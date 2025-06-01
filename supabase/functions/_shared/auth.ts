
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from './cors.ts'

export interface AuthContext {
  user: any;
  supabase: any;
}

export function withAuth(handler: (req: Request, ctx: AuthContext) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    try {
      // Get the authorization header
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Missing authorization header' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      // Get user from JWT
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)

      if (authError || !user) {
        console.error('Auth error:', authError)
        return new Response(
          JSON.stringify({ error: 'Invalid or expired token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user roles from database
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch user roles' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const userRole = userRoles && userRoles.length > 0 ? userRoles[0].role : 'customer'

      // Create context
      const context: AuthContext = {
        user: { ...user, role: userRole },
        supabase
      }

      // Call the handler
      return await handler(req, context)

    } catch (error) {
      console.error('Auth error:', error)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }
}
