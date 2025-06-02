import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"
import { withAuth, corsHeaders, AuthContext } from "../_shared/auth.ts"

// Schema for creating appointment for new customer
const CreateNewCustomerAppointmentSchema = z.object({
  service_id: z.string().uuid(),
  location_id: z.string().uuid(),
  scheduled_time: z.string().datetime(),
  notes: z.string().optional(),
  reason_for_visit: z.string().optional(),
  customer_name: z.string(),
  phone_number: z.string(),
  email: z.string().email().optional(),
})

// Schema for creating appointment for existing customer
const CreateExistingCustomerAppointmentSchema = z.object({
  service_id: z.string().uuid(),
  location_id: z.string().uuid(),
  scheduled_time: z.string().datetime(),
  notes: z.string().optional(),
  reason_for_visit: z.string().optional(),
  customer_id: z.string().uuid(),
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

// Schema for check-in
const CheckInSchema = z.object({
  confirmation_code: z.string(),
})

// Handler for all appointment-related endpoints
const appointmentHandler = withAuth(async (req: Request, ctx: AuthContext) => {
  const url = new URL(req.url)
  const method = req.method
  const { user, supabase } = ctx
  
  console.log(`Appointments API - ${method} ${url.pathname}`)
  
  try {
    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Check-in endpoint (POST /appointments/check-in)
    if (method === 'POST' && url.pathname.endsWith('/check-in')) {
      const body = await req.json()
      const validation = CheckInSchema.safeParse(body)
      
      if (!validation.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid request data', 
            details: validation.error.format() 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      const { confirmation_code } = validation.data
      
      // Extract appointment ID from confirmation code (format: APT-XXXXXXXX)
      if (!confirmation_code.startsWith('APT-')) {
        return new Response(
          JSON.stringify({ error: 'Invalid confirmation code format' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      const appointmentIdPrefix = confirmation_code.substring(4).toLowerCase()
      
      // Find appointment by ID prefix
      const { data: appointments, error: searchError } = await supabase
        .from('appointments')
        .select('id, status, scheduled_time, customer_id')
        .ilike('id', `${appointmentIdPrefix}%`)
        .limit(1)
      
      if (searchError || !appointments || appointments.length === 0) {
        console.error('Check-in error - appointment not found:', searchError)
        return new Response(
          JSON.stringify({ error: 'Appointment not found' }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      const appointment = appointments[0]
      
      // Check if appointment can be checked in
      if (appointment.status !== 'scheduled') {
        return new Response(
          JSON.stringify({ 
            error: 'Appointment cannot be checked in', 
            current_status: appointment.status 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Update appointment status to checked_in
      const { data: updatedAppointment, error: updateError } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', appointment.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('Check-in error - failed to update:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to check in', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      console.log('Appointment checked in successfully:', appointment.id)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          appointment: updatedAppointment,
          message: 'Successfully checked in'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // List user's appointments (GET /appointments)
    if (method === 'GET') {
      const userRole = user.role || 'customer'
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          services (
            name,
            duration
          ),
          locations (
            name
          ),
          customers (
            first_name,
            last_name
          )
        `)
        
      // Filter appointments based on user role
      if (userRole === 'customer') {
        // Customers can only see their own appointments
        query = query.eq('customer_id', user.id)
      } else if (userRole === 'staff') {
        // Staff can see appointments at their location
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
      const { data: appointments, error } = await query.order('scheduled_time', { ascending: true })
      
      if (error) {
        console.error('Error fetching appointments:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch appointments', details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      return new Response(
        JSON.stringify(appointments || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Create new appointment (POST /appointments)
    if (method === 'POST') {
      const body = await req.json()
      
      // Check if this is for a new or existing customer
      if ('customer_id' in body) {
        // Existing customer
        const validation = CreateExistingCustomerAppointmentSchema.safeParse(body)
        
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
        
        const { data: appointment, error } = await supabase
          .from('appointments')
          .insert({
            customer_id: appointmentData.customer_id,
            service_id: appointmentData.service_id,
            location_id: appointmentData.location_id,
            scheduled_time: appointmentData.scheduled_time,
            reason_for_visit: appointmentData.reason_for_visit,
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
      } else {
        // New customer
        const validation = CreateNewCustomerAppointmentSchema.safeParse(body)
        
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
        
        // Parse the name into first and last name
        const nameParts = appointmentData.customer_name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
        
        // Check if customer exists by phone number
        let customerId: string;
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', appointmentData.phone_number)
          .maybeSingle()
        
        if (existingCustomer) {
          customerId = existingCustomer.id
          console.log('Using existing customer:', customerId)
        } else {
          // Generate a UUID for the new customer (aligning with frontend logic)
          const newCustomerId = crypto.randomUUID()
          
          // Create customer first with explicit ID
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .insert({
              id: newCustomerId,
              first_name: firstName,
              last_name: lastName,
              phone: appointmentData.phone_number,
              email: appointmentData.email || null,
            })
            .select('id')
            .single()
          
          if (customerError) {
            console.error('Error creating customer:', customerError)
            return new Response(
              JSON.stringify({ error: 'Failed to create customer', details: customerError.message }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
          }
          
          customerId = customerData.id
          console.log('Created new customer:', customerId)
        }
        
        // Insert the appointment
        const { data: appointment, error } = await supabase
          .from('appointments')
          .insert({
            customer_id: customerId,
            service_id: appointmentData.service_id,
            location_id: appointmentData.location_id,
            scheduled_time: appointmentData.scheduled_time,
            reason_for_visit: appointmentData.reason_for_visit,
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
    }
    
    // Update appointment status (PATCH /appointments/{id})
    if (method === 'PATCH') {
      const pathParts = url.pathname.split('/')
      const appointmentId = pathParts[pathParts.length - 1]
      
      if (!appointmentId) {
        return new Response(
          JSON.stringify({ error: 'Appointment ID is required' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
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
      const userRole = user.role || 'customer'
      
      if (userRole !== 'staff' && userRole !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Unauthorized to update appointment status' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      // Special handling for certain status changes
      const updatePayload: any = { ...updateData }
      
      if (updateData.status === 'checked_in') {
        updatePayload.check_in_time = updatePayload.check_in_time || new Date().toISOString()
      }
      
      if (updateData.status === 'in_progress' && !updateData.start_time) {
        updatePayload.start_time = new Date().toISOString()
      }
      
      if (updateData.status === 'completed' && !updateData.end_time) {
        updatePayload.end_time = new Date().toISOString()
      }
      
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

serve(appointmentHandler)
