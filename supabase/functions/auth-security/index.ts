
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

interface AuthSecurityRequest {
  action: 'signin' | 'signup' | 'password_reset';
  email: string;
  password?: string;
  metadata?: Record<string, any>;
}

interface ValidationError {
  field: string;
  message: string;
}

// Rate limiting configuration
const RATE_LIMITS = {
  signin: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  password_reset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 } // 3 attempts per hour
};

// In-memory rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Input validation functions
function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { field: 'email', message: 'Email is required' };
  if (typeof email !== 'string') return { field: 'email', message: 'Email must be a string' };
  if (email.length > 254) return { field: 'email', message: 'Email is too long' };
  if (!emailRegex.test(email)) return { field: 'email', message: 'Invalid email format' };
  return null;
}

function validatePassword(password: string): ValidationError | null {
  if (!password) return { field: 'password', message: 'Password is required' };
  if (typeof password !== 'string') return { field: 'password', message: 'Password must be a string' };
  if (password.length < 6) return { field: 'password', message: 'Password must be at least 6 characters' };
  if (password.length > 128) return { field: 'password', message: 'Password is too long' };
  
  // Check for basic password strength
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { field: 'password', message: 'Password must contain at least one letter and one number' };
  }
  
  return null;
}

function validateRequest(request: AuthSecurityRequest): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate email
  const emailError = validateEmail(request.email);
  if (emailError) errors.push(emailError);
  
  // Validate password for signin and signup
  if (request.action === 'signin' || request.action === 'signup') {
    if (!request.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else {
      const passwordError = validatePassword(request.password);
      if (passwordError) errors.push(passwordError);
    }
  }
  
  // Validate action
  if (!['signin', 'signup', 'password_reset'].includes(request.action)) {
    errors.push({ field: 'action', message: 'Invalid action' });
  }
  
  return errors;
}

function getClientIdentifier(req: Request): string {
  // Use IP address and User-Agent for rate limiting
  const clientIp = req.headers.get('x-forwarded-for') || 
                  req.headers.get('x-real-ip') || 
                  'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `${clientIp}:${userAgent.substring(0, 50)}`;
}

function checkRateLimit(clientId: string, action: string): { allowed: boolean; retryAfter?: number } {
  const limits = RATE_LIMITS[action as keyof typeof RATE_LIMITS];
  if (!limits) return { allowed: true };
  
  const now = Date.now();
  const record = rateLimitStore.get(`${clientId}:${action}`) || { attempts: 0, lastAttempt: 0 };
  
  // Check if still blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return { allowed: false, retryAfter: Math.ceil((record.blockedUntil - now) / 1000) };
  }
  
  // Reset if window has passed
  if (now - record.lastAttempt > limits.windowMs) {
    record.attempts = 0;
  }
  
  // Check if limit exceeded
  if (record.attempts >= limits.maxAttempts) {
    record.blockedUntil = now + limits.windowMs;
    rateLimitStore.set(`${clientId}:${action}`, record);
    return { allowed: false, retryAfter: Math.ceil(limits.windowMs / 1000) };
  }
  
  return { allowed: true };
}

function updateRateLimit(clientId: string, action: string, success: boolean): void {
  const record = rateLimitStore.get(`${clientId}:${action}`) || { attempts: 0, lastAttempt: 0 };
  
  if (success) {
    // Reset on successful auth
    rateLimitStore.delete(`${clientId}:${action}`);
  } else {
    // Increment attempts on failure
    record.attempts += 1;
    record.lastAttempt = Date.now();
    rateLimitStore.set(`${clientId}:${action}`, record);
  }
}

async function logSecurityEvent(
  supabase: any,
  event: string,
  details: any,
  clientId: string,
  success: boolean
): Promise<void> {
  try {
    await supabase.from('security_audit_log').insert({
      event_type: event,
      client_identifier: clientId,
      success,
      details: JSON.stringify(details),
      ip_address: details.ip,
      user_agent: details.userAgent,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    let requestData: AuthSecurityRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client identifier for rate limiting
    const clientId = getClientIdentifier(req);
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Validate input
    const validationErrors = validateRequest(requestData);
    if (validationErrors.length > 0) {
      await logSecurityEvent(supabase, 'validation_failed', {
        action: requestData.action,
        errors: validationErrors,
        ip: clientIp,
        userAgent
      }, clientId, false);

      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validationErrors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limits
    const rateLimitResult = checkRateLimit(clientId, requestData.action);
    if (!rateLimitResult.allowed) {
      await logSecurityEvent(supabase, 'rate_limit_exceeded', {
        action: requestData.action,
        retryAfter: rateLimitResult.retryAfter,
        ip: clientIp,
        userAgent
      }, clientId, false);

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '300'
          } 
        }
      );
    }

    // Process the authentication request
    let authResult: any;
    let success = false;

    try {
      switch (requestData.action) {
        case 'signin':
          authResult = await supabase.auth.signInWithPassword({
            email: requestData.email,
            password: requestData.password!
          });
          success = !authResult.error;
          break;

        case 'signup':
          authResult = await supabase.auth.signUp({
            email: requestData.email,
            password: requestData.password!,
            options: {
              data: requestData.metadata || {}
            }
          });
          success = !authResult.error;
          break;

        case 'password_reset':
          authResult = await supabase.auth.resetPasswordForEmail(
            requestData.email,
            {
              redirectTo: `${req.headers.get('origin')}/auth/reset-password`
            }
          );
          success = !authResult.error;
          break;

        default:
          throw new Error('Invalid action');
      }

      // Update rate limiting
      updateRateLimit(clientId, requestData.action, success);

      // Log the security event
      await logSecurityEvent(supabase, `auth_${requestData.action}`, {
        action: requestData.action,
        email: requestData.email,
        success,
        error: authResult.error?.message,
        ip: clientIp,
        userAgent
      }, clientId, success);

      // Return result
      if (authResult.error) {
        return new Response(
          JSON.stringify({ 
            error: authResult.error.message,
            code: authResult.error.status 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          data: authResult.data 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Auth processing error:', error);
      
      // Update rate limiting for failed attempt
      updateRateLimit(clientId, requestData.action, false);

      // Log the error
      await logSecurityEvent(supabase, `auth_${requestData.action}_error`, {
        action: requestData.action,
        email: requestData.email,
        error: error.message,
        ip: clientIp,
        userAgent
      }, clientId, false);

      return new Response(
        JSON.stringify({ error: 'Authentication processing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
