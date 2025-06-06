
import { supabase } from '@/integrations/supabase/client';

export interface DemoCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface DemoAppointment {
  customer: DemoCustomer;
  service_name: string;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'no_show';
  scheduled_time: string;
  check_in_time?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

const demoCustomers: DemoCustomer[] = [
  {
    first_name: 'Maria',
    last_name: 'Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '(954) 123-4567'
  },
  {
    first_name: 'James',
    last_name: 'Johnson',
    email: 'james.johnson@email.com',
    phone: '(954) 234-5678'
  },
  {
    first_name: 'Sarah',
    last_name: 'Williams',
    email: 'sarah.williams@email.com',
    phone: '(954) 345-6789'
  },
  {
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@email.com',
    phone: '(954) 456-7890'
  },
  {
    first_name: 'Jennifer',
    last_name: 'Davis',
    email: 'jennifer.davis@email.com',
    phone: '(954) 567-8901'
  },
  {
    first_name: 'Robert',
    last_name: 'Miller',
    email: 'robert.miller@email.com',
    phone: '(954) 678-9012'
  },
  {
    first_name: 'Lisa',
    last_name: 'Wilson',
    email: 'lisa.wilson@email.com',
    phone: '(954) 789-0123'
  },
  {
    first_name: 'David',
    last_name: 'Moore',
    email: 'david.moore@email.com',
    phone: '(954) 890-1234'
  }
];

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getTimeSlot = (hour: number, minute: number = 0) => {
  const today = getToday();
  return `${today}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
};

export const generateDemoAppointments = (): DemoAppointment[] => {
  const today = getToday();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return [
    // Currently being served
    {
      customer: demoCustomers[0],
      service_name: 'Driver License Renewal',
      status: 'in_progress',
      scheduled_time: getTimeSlot(currentHour - 1),
      check_in_time: getTimeSlot(currentHour - 1, 15),
      start_time: getTimeSlot(currentHour, currentMinute - 10),
      notes: 'Priority customer - renewal for CDL'
    },
    
    // Waiting customers (checked in)
    {
      customer: demoCustomers[1],
      service_name: 'Vehicle Registration',
      status: 'checked_in',
      scheduled_time: getTimeSlot(currentHour),
      check_in_time: getTimeSlot(currentHour, currentMinute - 5),
      notes: 'New vehicle registration'
    },
    {
      customer: demoCustomers[2],
      service_name: 'ID Card Application',
      status: 'checked_in',
      scheduled_time: getTimeSlot(currentHour + 1),
      check_in_time: getTimeSlot(currentHour, currentMinute - 3),
      notes: 'First-time ID application'
    },
    {
      customer: demoCustomers[3],
      service_name: 'Title Transfer',
      status: 'checked_in',
      scheduled_time: getTimeSlot(currentHour + 1, 30),
      check_in_time: getTimeSlot(currentHour, currentMinute - 1),
      notes: 'Vehicle ownership transfer'
    },
    
    // Upcoming scheduled appointments
    {
      customer: demoCustomers[4],
      service_name: 'Driver License Test',
      status: 'scheduled',
      scheduled_time: getTimeSlot(currentHour + 2),
      notes: 'First-time driver test appointment'
    },
    {
      customer: demoCustomers[5],
      service_name: 'Business License',
      status: 'scheduled',
      scheduled_time: getTimeSlot(currentHour + 2, 30),
      notes: 'New business registration'
    },
    
    // Completed appointments (earlier today)
    {
      customer: demoCustomers[6],
      service_name: 'Passport Application',
      status: 'completed',
      scheduled_time: getTimeSlot(9),
      check_in_time: getTimeSlot(9, 5),
      start_time: getTimeSlot(9, 15),
      end_time: getTimeSlot(9, 45),
      notes: 'Expedited passport service'
    },
    {
      customer: demoCustomers[7],
      service_name: 'Property Tax Payment',
      status: 'completed',
      scheduled_time: getTimeSlot(10),
      check_in_time: getTimeSlot(10, 2),
      start_time: getTimeSlot(10, 10),
      end_time: getTimeSlot(10, 25),
      notes: 'Annual property tax payment'
    }
  ];
};

export const populateDemoData = async () => {
  try {
    console.log('Starting demo data population...');
    
    // Get the first location and services
    const { data: locations } = await supabase
      .from('locations')
      .select('id')
      .limit(1);
    
    const { data: services } = await supabase
      .from('services')
      .select('id, name');
    
    if (!locations?.length || !services?.length) {
      throw new Error('No locations or services found. Please ensure basic setup data exists.');
    }
    
    const locationId = locations[0].id;
    const demoAppointments = generateDemoAppointments();
    
    console.log(`Creating ${demoAppointments.length} demo appointments...`);
    
    // Create customers and appointments
    for (const appointmentData of demoAppointments) {
      // Find or create customer
      let customerId: string;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', appointmentData.customer.email)
        .maybeSingle();
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert(appointmentData.customer)
          .select('id')
          .single();
        
        if (customerError) {
          console.error('Error creating customer:', customerError);
          continue;
        }
        
        customerId = newCustomer.id;
      }
      
      // Find service by name
      const service = services.find(s => s.name === appointmentData.service_name);
      if (!service) {
        console.warn(`Service "${appointmentData.service_name}" not found, skipping...`);
        continue;
      }
      
      // Create appointment
      const appointmentInsert = {
        customer_id: customerId,
        service_id: service.id,
        location_id: locationId,
        status: appointmentData.status,
        scheduled_time: appointmentData.scheduled_time,
        check_in_time: appointmentData.check_in_time || null,
        start_time: appointmentData.start_time || null,
        end_time: appointmentData.end_time || null,
        notes: appointmentData.notes || null
      };
      
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentInsert);
      
      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
      }
    }
    
    console.log('Demo data population completed successfully!');
    return { success: true, message: 'Demo data created successfully!' };
    
  } catch (error) {
    console.error('Error populating demo data:', error);
    return { success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

export const clearDemoData = async () => {
  try {
    console.log('Clearing existing appointments and customers...');
    
    // Delete appointments first (due to foreign key constraints)
    const { error: appointmentsError } = await supabase
      .from('appointments')
      .delete()
      .gte('created_at', new Date().toISOString().split('T')[0]);
    
    if (appointmentsError) {
      console.error('Error clearing appointments:', appointmentsError);
    }
    
    // Delete customers created today
    const { error: customersError } = await supabase
      .from('customers')
      .delete()
      .gte('created_at', new Date().toISOString().split('T')[0]);
    
    if (customersError) {
      console.error('Error clearing customers:', customersError);
    }
    
    console.log('Demo data cleared successfully!');
    return { success: true, message: 'Demo data cleared successfully!' };
    
  } catch (error) {
    console.error('Error clearing demo data:', error);
    return { success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};
