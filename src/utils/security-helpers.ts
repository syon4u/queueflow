
import { InputValidationError } from '@/types/security';

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potential XSS patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const validateEmailSecure = (email: string): InputValidationError | null => {
  const sanitized = sanitizeInput(email);
  
  if (!sanitized) {
    return { field: 'email', message: 'Email is required' };
  }
  
  if (sanitized.length > 254) {
    return { field: 'email', message: 'Email is too long' };
  }
  
  // More strict email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    return { field: 'email', message: 'Invalid email format' };
  }
  
  return null;
};

export const validatePasswordSecure = (password: string): InputValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { field: 'password', message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { field: 'password', message: 'Password is too long' };
  }
  
  // Check for password strength requirements
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const requirements = [];
  if (!hasLowercase) requirements.push('one lowercase letter');
  if (!hasUppercase) requirements.push('one uppercase letter');
  if (!hasNumber) requirements.push('one number');
  if (!hasSpecialChar) requirements.push('one special character');
  
  if (requirements.length > 0) {
    return { 
      field: 'password', 
      message: `Password must contain ${requirements.join(', ')}` 
    };
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return { 
      field: 'password', 
      message: 'This password is too common. Please choose a stronger password.' 
    };
  }
  
  return null;
};

export const detectSuspiciousActivity = (
  attempts: number, 
  timeWindow: number,
  userAgent: string
): boolean => {
  // Detect automated requests
  const suspiciousUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'automated'
  ];
  
  const isSuspiciousAgent = suspiciousUserAgents.some(agent => 
    userAgent.toLowerCase().includes(agent)
  );
  
  // High frequency attempts
  const isHighFrequency = attempts > 10 && timeWindow < 60000; // 10 attempts in 1 minute
  
  return isSuspiciousAgent || isHighFrequency;
};

export const generateSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

export const maskSensitiveData = (data: unknown): unknown => {
  if (typeof data !== 'object' || data === null) return data;
  
  const masked: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential'];
  
  for (const [key, value] of Object.entries(masked)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      masked[key] = '***MASKED***';
    } else if (typeof value === 'object') {
      masked[key] = maskSensitiveData(value);
    }
  }
  
  return masked;
};
