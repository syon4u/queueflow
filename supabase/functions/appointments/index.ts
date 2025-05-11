import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"
import { withAuth, corsHeaders, AuthContext } from "../_shared/auth.ts"
import { Database } from "../_shared/types.ts"

// Schema for joining queue (creating appointment)
const CreateAppointmentSchema = z.object({
  service_id: z.string().uuid(),
  location_id: z.string().uuid(),
  scheduled_time: z.string().datetime(),
  notes: z.string().optional(),
})

// Schema for updating appointment status
const UpdateAppointmentSchema = z.object({
  status: z.enum([
    'scheduled', 
    'checked_in', 
    'in_progress', 
    'completed', 
    'cancelled', 
    'no_show'
  ]),
  notes: z.string().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
})

// Schema for sending reminders
const SendReminderSchema = z.object({
  appointment_id: z.string().uuid(),
  message: z.string(),
  type: z.enum(['sms', 'email', 'app']),
  send_time: z.string().datetime().optional() // If not provided, send immediately
})

// Type for appointment responses
type AppointmentResponse = {
  id: string;
  customer_id: string;
  service_id: string;
  location_id: string;
  staff_id: string | null;
  status: string;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Handler for all appointment-related endpoints
const appointmentHandler = withAuth(async (req: Request, ctx: AuthContext) => {
  // Get the URL and method
  const url = new URL(req.url)
  const method = req.method
  const { user, supabase } = ctx
  
  try {
    // Send reminder (POST /appointments/reminder)
    if (method === 'POST' && url.pathname.endsWith('/reminder')) {
      // Extract and validate the request body
      const body = await req.json()
      const validation = SendReminderSchema.safeParse(body)
      
      if (!validation.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid request data', 
            details: validation.error.format() 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      const reminderData = validation.data
      
      // Get the appointment details to make sure it exists
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select('id, customer_id')
        .eq('id', reminderData.appointment_id)
        .single()
      
      if (fetchError || !appointment) {
        return new Response(
          JSON.stringify({ error: 'Appointment not found', details: fetchError?.message }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Check authorization - only staff/admin or the appointment owner can send reminders
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
      
      const userRole = userRoles && userRoles.length > 0 ? userRoles[0].role : 'customer'
      
      if (userRole !== 'staff' && userRole !== 'admin' && appointment.customer_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized to send reminders for this appointment' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Log the reminder (in a real app, this would send an SMS/email)
      const { data: reminderLog, error: logError } = await supabase
        .from('appointment_reminders')
        .insert({
          appointment_id: reminderData.appointment_id,
          message: reminderData.message,
          type: reminderData.type,
          scheduled_for: reminderData.send_time || new Date().toISOString(),
          sent_by: user.id
        })
        .select()
      
      if (logError) {
        console.error('Error logging reminder:', logError)
        return new Response(
          JSON.stringify({ error: 'Failed to send reminder', details: logError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // For now, we just log that we would send the reminder
      console.log(`Would send ${reminderData.type} reminder to appointment ${reminderData.appointment_id}: ${reminderData.message}`)
      
      return new Response(
        JSON.stringify({ success: true, reminder: reminderLog }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Create new appointment (POST /appointments)
    if (method === 'POST') {
      // Extract and validate the request body
      const body = await req.json()
      const validation = CreateAppointmentSchema.safeParse(body)
      
      if (!validation.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid request data', 
            details: validation.error.format() 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      const appointmentData = validation.data
      
      // Insert the new appointment with customer ID from authenticated user
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: user.id,
          service_id: appointmentData.service_id,
          location_id: appointmentData.location_id,
          scheduled_time: appointmentData.scheduled_time,
          notes: appointmentData.notes,
          status: 'scheduled'
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating appointment:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to create appointment', details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      return new Response(
        JSON.stringify(appointment),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // List user's appointments (GET /appointments)
    if (method === 'GET') {
      // Determine if the user is a customer or staff
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
      
      const userRole = userRoles && userRoles.length > 0 
        ? userRoles[0].role 
        : 'customer'
      
      let query = supabase
        .from('appointments')
        .select('*')
        
      // Filter appointments based on user role
      if (userRole === 'customer') {
        // Customers can only see their own appointments
        query = query.eq('customer_id', user.id)
      } else if (userRole === 'staff') {
        // Staff can see appointments assigned to them or unassigned at their location
        // This assumes staff members have a location_id in their profile
        const { data: staffData } = await supabase
          .from('staff')
          .select('location_id')
          .eq('id', user.id)
          .single()
          
        if (staffData && staffData.location_id) {
          query = query.eq('location_id', staffData.location_id)
        }
      }
      // Admin role can see all appointments (no additional filter needed)
      
      // Execute the query
      const { data: appointments, error } = await query
      
      if (error) {
        console.error('Error fetching appointments:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch appointments', details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      return new Response(
        JSON.stringify(appointments as AppointmentResponse[]),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Update appointment status (PATCH /appointments/{id})
    if (method === 'PATCH') {
      // Extract appointment ID from URL path
      const pathParts = url.pathname.split('/')
      const appointmentId = pathParts[pathParts.length - 1]
      
      if (!appointmentId) {
        return new Response(
          JSON.stringify({ error: 'Appointment ID is required' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Extract and validate the request body
      const body = await req.json()
      const validation = UpdateAppointmentSchema.safeParse(body)
      
      if (!validation.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid request data', 
            details: validation.error.format() 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      const updateData = validation.data
      
      // Check if user has permission to update this appointment
      // Only staff or admin should be able to update appointment status
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
      
      const userRole = userRoles && userRoles.length > 0 
        ? userRoles[0].role 
        : 'customer'
      
      if (userRole !== 'staff' && userRole !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Unauthorized to update appointment status' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Special handling for certain status changes
      const updatePayload: any = { ...updateData }
      
      // If status is changing to checked_in and no check_in_time provided, set it now
      if (updateData.status === 'checked_in') {
        updatePayload.check_in_time = updatePayload.check_in_time || new Date().toISOString()
      }
      
      // If status is changing to in_progress and no start_time provided, set it now
      if (updateData.status === 'in_progress' && !updateData.start_time) {
        updatePayload.start_time = new Date().toISOString()
      }
      
      // If status is changing to completed and no end_time provided, set it now
      if (updateData.status === 'completed' && !updateData.end_time) {
        updatePayload.end_time = new Date().toISOString()
      }
      
      // Update the appointment in the database
      const { data: updatedAppointment, error } = await supabase
        .from('appointments')
        .update(updatePayload)
        .eq('id', appointmentId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating appointment:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update appointment', details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      return new Response(
        JSON.stringify(updatedAppointment),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Handle unsupported methods
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

// Expose the handler as a Deno deployment function
serve(appointmentHandler)
