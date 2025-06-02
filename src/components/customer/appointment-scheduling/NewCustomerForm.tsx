
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { NewCustomerFormValues } from '../../../hooks/appointment-scheduling/types';
import { useNewCustomerAppointment } from '../../../hooks/appointment-scheduling/useNewCustomerAppointment';
import NewCustomerFormHeader from './NewCustomerFormHeader';
import CustomerDetailsFields from './CustomerDetailsFields';
import LocationServiceSelector from './LocationServiceSelector';
import DateTimePicker from './DateTimePicker';
import ReasonForVisitField from './ReasonForVisitField';

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

  const { createAppointment, isSubmitting: isCreating } = useNewCustomerAppointment(onSubmit);

  const handleFormSubmit = (data: NewCustomerFormValues) => {
    console.log('NewCustomerForm - Form submitted:', data);
    if (!selectedDate || !selectedTime) return;
    
    createAppointment({
      formData: data,
      selectedDate,
      selectedTime
    });
  };

  // Clear service selection when location changes
  React.useEffect(() => {
    if (selectedLocationId) {
      setValue('service_id', '');
    }
  }, [selectedLocationId, setValue]);

  return (
    <div className="space-y-6">
      <NewCustomerFormHeader onBack={onBack} />

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

        <ReasonForVisitField register={register} />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isCreating || !selectedDate || !selectedTime}
          >
            {isCreating ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerForm;
