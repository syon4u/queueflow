
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { withAuth, corsHeaders, AuthContext } from "../_shared/auth.ts"

interface QueuePositionRequest {
  customerId: string;
}

// Handler for retrieving customer queue position
const queuePositionHandler = withAuth(async (req: Request, ctx: AuthContext) => {
  try {
    // Parse request body
    const body: QueuePositionRequest = await req.json();
    const { customerId } = body;
    
    const { user, supabase } = ctx;
    
    // Check if user is requesting their own position
    if (user.id !== customerId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to view this queue position' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Fetch customer's appointment that is scheduled for today or checked in
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find the current appointment for the customer
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        status,
        scheduled_time,
        location_id,
        service_id
      `)
      .eq('customer_id', customerId)
      .gte('scheduled_time', today.toISOString())
      .lt('scheduled_time', tomorrow.toISOString())
      .in('status', ['scheduled', 'checked_in'])
      .order('scheduled_time', { ascending: true })
      .limit(1)
      .single();
    
    if (appointmentError && appointmentError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error fetching appointment:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch appointment', details: appointmentError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If no appointment found, return null position
    if (!appointment) {
      return new Response(
        JSON.stringify({ 
          position: null,
          estimatedWaitTime: null,
          queueStatus: 'closed'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get queue status from location
    const { data: locationData } = await supabase
      .from('locations')
      .select('queue_status')
      .eq('id', appointment.location_id)
      .single();
    
    const queueStatus = locationData?.queue_status || 'closed';
    
    // Get all checked-in appointments for the same location that are ahead in the queue
    const { data: queueData, error: queueError } = await supabase
      .from('appointments')
      .select(`
        id,
        status,
        scheduled_time,
        service:service_id (duration)
      `)
      .eq('location_id', appointment.location_id)
      .in('status', ['checked_in', 'scheduled'])
      .lte('scheduled_time', appointment.scheduled_time)
      .order('scheduled_time', { ascending: true });
    
    if (queueError) {
      console.error('Error fetching queue data:', queueError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch queue data', details: queueError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Calculate position in queue
    let position = 0;
    let estimatedWaitTime = 0;
    
    if (queueData && queueData.length > 0) {
      for (const queueItem of queueData) {
        if (queueItem.id === appointment.id) {
          break;
        }
        position++;
        // Add estimated service time
        estimatedWaitTime += queueItem.service?.duration || 15; // Default 15 minutes if duration not available
      }
    }
    
    // If the user's appointment is already being served, set position to 0
    if (appointment.status === 'in_progress') {
      position = 0;
      estimatedWaitTime = 0;
    }
    
    return new Response(
      JSON.stringify({ 
        position,
        estimatedWaitTime: estimatedWaitTime > 0 ? estimatedWaitTime : null,
        queueStatus
      }),
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
serve(queuePositionHandler);
