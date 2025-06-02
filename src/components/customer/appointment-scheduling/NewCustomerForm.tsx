
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLocations } from '@/hooks/appointment-form/useLocations';
import { useServices } from '@/hooks/appointment-form/useServices';
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

  const { locations, isLoading: locationsLoading, error: locationsError } = useLocations();
  const selectedLocationId = watch('location_id');
  const { services, servicesLoading, servicesError } = useServices(selectedLocationId);

  console.log('NewCustomerForm - Component state:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError,
    selectedLocationId,
    servicesCount: services?.length || 0,
    servicesLoading,
    servicesError
  });

  // Clear service selection when location changes
  React.useEffect(() => {
    if (selectedLocationId) {
      setValue('service_id', '');
    }
  }, [selectedLocationId, setValue]);

  if (locationsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h3 className="text-lg font-semibold">New Customer Appointment</h3>
        </div>
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">
          Error loading locations: {locationsError}
        </div>
      </div>
    );
  }

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
          servicesError={servicesError ? new Error(servicesError) : null}
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
            disabled={isSubmitting || locationsLoading}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerForm;
