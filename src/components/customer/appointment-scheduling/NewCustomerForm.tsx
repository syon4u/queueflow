
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

  const { data: locations, isLoading: locationsLoading, error: locationsError } = useLocations();
  const selectedLocationId = watch('location_id');
  const selectedServiceId = watch('service_id');
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices(selectedLocationId);

  console.log('NewCustomerForm - Component state:', {
    locationsCount: locations?.length || 0,
    locationsLoading,
    locationsError,
    selectedLocationId,
    selectedServiceId,
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

  if (locationsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h3 className="text-lg font-semibold">New Customer Appointment</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading available locations...</p>
        </div>
      </div>
    );
  }

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
          <p className="font-medium">Unable to load locations</p>
          <p className="mt-1 text-sm">Error: {locationsError}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h3 className="text-lg font-semibold">New Customer Appointment</h3>
        </div>
        <div className="text-amber-600 p-4 bg-amber-50 rounded-lg">
          <p className="font-medium">No locations available</p>
          <p className="mt-1 text-sm">
            There are currently no open locations available for scheduling. Please check back later.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-3"
          >
            Refresh
          </Button>
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
          services={services}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
          selectedLocationId={selectedLocationId || ''}
          selectedServiceId={selectedServiceId || ''}
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
            disabled={isSubmitting || !selectedLocationId || !selectedServiceId}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerForm;
