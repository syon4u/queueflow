
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { searchQuery } = await req.json();

    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Searching for customer with query:', searchQuery);

    // Search for customers by phone or email
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select(`
        id,
        first_name,
        last_name,
        phone,
        email,
        created_at
      `)
      .or(`phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .limit(10);

    if (customerError) {
      console.error('Error searching customers:', customerError);
      return new Response(
        JSON.stringify({ error: 'Failed to search customers' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!customers || customers.length === 0) {
      return new Response(
        JSON.stringify({ customers: [], appointments: [] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get appointment history for found customers
    const customerIds = customers.map(c => c.id);
    
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        customer_id,
        status,
        scheduled_time,
        check_in_time,
        start_time,
        end_time,
        reason_for_visit,
        notes,
        created_at,
        services!appointments_service_id_fkey(name),
        locations!appointments_location_id_fkey(name)
      `)
      .in('customer_id', customerIds)
      .order('scheduled_time', { ascending: false });

    if (appointmentError) {
      console.error('Error fetching appointments:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch appointment history' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found ${customers.length} customers and ${appointments?.length || 0} appointments`);

    return new Response(
      JSON.stringify({ 
        customers, 
        appointments: appointments || [] 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
