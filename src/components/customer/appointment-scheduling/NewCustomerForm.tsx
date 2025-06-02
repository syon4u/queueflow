
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import CustomerDetailsFields from './CustomerDetailsFields';
import LocationServiceSelector from './LocationServiceSelector';
import DateTimePicker from './DateTimePicker';

export interface NewCustomerFormValues {
  name: string;
  phone: string;
  email?: string;
  service_id: string;
  location_id: string;
  reason_for_visit?: string;
}

interface NewCustomerFormProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  onSubmit: (data: NewCustomerFormValues) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const NewCustomerForm = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onSubmit,
  onBack,
  isSubmitting
}: NewCustomerFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<NewCustomerFormValues>();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      console.log('NewCustomerForm - Fetching locations...');
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('queue_status', 'open')
        .order('name');
      if (error) {
        console.error('NewCustomerForm - Error fetching locations:', error);
        throw error;
      }
      console.log('NewCustomerForm - Locations fetched:', data);
      return data;
    },
  });

  const selectedLocationId = watch('location_id');

  const { data: services, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['services', selectedLocationId],
    queryFn: async () => {
      if (!selectedLocationId) {
        console.log('NewCustomerForm - No location selected, returning empty array');
        return [];
      }
      
      console.log('NewCustomerForm - Fetching services for location:', selectedLocationId);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('location_id', selectedLocationId)
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('NewCustomerForm - Error fetching services:', error);
        throw error;
      }
      
      console.log('NewCustomerForm - Services fetched:', data);
      return data;
    },
    enabled: !!selectedLocationId,
  });

  // Create appointment for new customer
  const createAppointment = useMutation({
    mutationFn: async (formData: NewCustomerFormValues) => {
      console.log('NewCustomerForm - Creating appointment for new customer:', formData);
      
      if (!selectedDate || !selectedTime) {
        throw new Error('Date and time are required');
      }

      // Parse the name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

      // Check if customer already exists by phone or email
      let customerId: string;
      let customerData: any;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .or(`phone.eq.${formData.phone}${formData.email ? `,email.eq.${formData.email}` : ''}`)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        customerData = existingCustomer;
        console.log('Found existing customer:', customerId);
      } else {
        // For walk-in customers without authentication, generate a UUID
        const customerUuid = crypto.randomUUID();
        
        // Try to insert customer directly
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            first_name: firstName,
            last_name: lastName,
            phone: formData.phone,
            email: formData.email || null
          })
          .select('*')
          .single();

        if (customerError) {
          console.error('Error creating walk-in customer:', customerError);
          throw customerError;
        }
        
        customerId = newCustomer.id;
        customerData = newCustomer;
        console.log('Created new walk-in customer:', customerId);
      }

      // Create appointment
      const appointmentUuid = crypto.randomUUID();
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      console.log('Creating appointment with ID:', appointmentUuid);
      
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          id: appointmentUuid,
          customer_id: customerId,
          service_id: formData.service_id,
          location_id: formData.location_id,
          scheduled_time: scheduledDateTime.toISOString(),
          reason_for_visit: formData.reason_for_visit,
          status: 'scheduled'
        });

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        throw appointmentError;
      }

      return { customerId: customerId, appointmentId: appointmentUuid };
    },
    onSuccess: (data) => {
      console.log('NewCustomerForm - Appointment created successfully:', data);
      toast({
        title: t('common.success'),
        description: t('appointments.created'),
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Call the original onSubmit to handle any additional logic
      onSubmit({
        name: '',
        phone: '',
        email: '',
        service_id: '',
        location_id: '',
        reason_for_visit: ''
      });
    },
    onError: (error) => {
      console.error('NewCustomerForm - Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('appointments.createError'),
        variant: 'destructive',
      });
    }
  });

  const handleFormSubmit = (data: NewCustomerFormValues) => {
    console.log('NewCustomerForm - Form submitted:', data);
    createAppointment.mutate(data);
  };

  // Clear service selection when location changes
  React.useEffect(() => {
    if (selectedLocationId) {
      setValue('service_id', '');
    }
  }, [selectedLocationId, setValue]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h3 className="text-lg font-semibold">New Customer Appointment</h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <CustomerDetailsFields register={register} errors={errors} />

        <LocationServiceSelector
          locations={locations}
          services={services}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
          selectedLocationId={selectedLocationId}
          setValue={setValue}
        />

        <DateTimePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Input
            id="reason"
            {...register('reason_for_visit')}
            placeholder="Brief description of your visit"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={createAppointment.isPending || !selectedDate || !selectedTime}
          >
            {createAppointment.isPending ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerForm;
