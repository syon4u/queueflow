
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
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

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      console.log('NewCustomerForm - Fetching locations...');
      const { data, error } = await supabase
        .from('locations')
        .select('*')
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerForm;
