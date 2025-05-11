
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders, withAuth, AuthContext } from "../_shared/auth.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const CustomerIdSchema = z.object({
  customerId: z.string().uuid()
})

const handler = withAuth(async (req: Request, ctx: AuthContext) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, supabase } = ctx;
    
    // Verify user has staff/admin privileges
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const userRole = userRoles && userRoles.length > 0 ? userRoles[0].role : 'customer';
    
    if (userRole !== 'staff' && userRole !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = CustomerIdSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid customer ID', details: validation.error.format() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { customerId } = validation.data;
    
    // Get customer information to verify they exist
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', customerId)
      .single();
    
    if (customerError || !customer) {
      return new Response(
        JSON.stringify({ error: 'Customer not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get all appointments for this customer, ordered by scheduled time
    let query = supabase
      .from('appointments')
      .select(`
        id,
        service_id,
        location_id,
        staff_id,
        status,
        scheduled_time,
        check_in_time,
        start_time,
        end_time,
        notes,
        reason_for_visit,
        created_at,
        updated_at
      `)
      .eq('customer_id', customerId)
      .order('scheduled_time', { ascending: false });
      
    // Staff with location restrictions can only see appointments for their location
    if (userRole === 'staff') {
      const { data: staffData } = await supabase
        .from('staff')
        .select('location_id')
        .eq('id', user.id)
        .single();
        
      if (staffData && staffData.location_id) {
        query = query.eq('location_id', staffData.location_id);
      }
    }
    
    const { data: appointments, error: appointmentError } = await query;
    
    if (appointmentError) {
      console.error('Error fetching appointments:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch appointment history', details: appointmentError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Return the appointment history
    return new Response(
      JSON.stringify(appointments),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Expose the handler as a Deno deployment function
serve(handler);
