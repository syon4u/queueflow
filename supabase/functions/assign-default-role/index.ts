
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get the user data from the webhook payload
    const payload = await req.json()
    console.log('Received payload:', JSON.stringify(payload, null, 2))
    
    const userId = payload.record?.id || payload.user?.id

    if (!userId) {
      console.error('No user ID found in payload')
      return new Response(
        JSON.stringify({ error: 'No user ID found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing user:', userId)

    // Check if user already has a role assigned
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id, role')
      .eq('user_id', userId)
      .single()

    if (existingRole) {
      console.log(`User ${userId} already has role: ${existingRole.role}`)
      return new Response(
        JSON.stringify({ message: 'Role already assigned', role: existingRole.role }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Assign default 'staff' role to new user
    const { data: newRole, error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'staff'
      })
      .select()

    if (roleError) {
      console.error('Error assigning role:', roleError)
      return new Response(
        JSON.stringify({ error: 'Failed to assign role', details: roleError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully assigned 'staff' role to user ${userId}`)
    
    // Also create a profile record if it doesn't exist
    const userData = payload.record || payload.user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: userData?.raw_user_meta_data?.first_name || userData?.user_metadata?.first_name || '',
        last_name: userData?.raw_user_meta_data?.last_name || userData?.user_metadata?.last_name || '',
        email: userData?.email || '',
        status: 'active'
      })
      .select()

    if (profileError && !profileError.message?.includes('duplicate key')) {
      console.error('Error creating profile record:', profileError)
    } else {
      console.log(`Profile record created for user ${userId}`)
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Role assigned successfully', 
        role: 'staff',
        profile_created: !profileError 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in assign-default-role function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
