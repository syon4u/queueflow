
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/components/customer/CustomerSearchBox';
import { NewCustomerFormValues } from '@/components/customer/appointment-scheduling/NewCustomerForm';
import { ExistingCustomerFormValues } from '@/components/customer/appointment-scheduling/ExistingCustomerForm';

export const useAppointmentScheduling = (onAppointmentScheduled: (code: string) => void) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [step, setStep] = useState<'search' | 'new-customer' | 'existing-customer'>('search');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep('existing-customer');
  };

  const handleCreateNewCustomer = () => {
    setStep('new-customer');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedCustomer(null);
  };

  const parseTimeAndDate = (selectedDate: Date, selectedTime: string) => {
    const [hours, minutes] = selectedTime.split(':');
    const [minutesValue, ampm] = minutes.split(' ');
    let hour = parseInt(hours);
    
    if (ampm === 'PM' && hour < 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }

    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hour, parseInt(minutesValue));
    return scheduledDate;
  };

  const submitNewCustomerAppointment = async (data: NewCustomerFormValues) => {
    if (!selectedDate) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectDate'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDate = parseTimeAndDate(selectedDate, selectedTime);
      
      const [firstName, ...lastNameParts] = data.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      let customerId: string;
      
      // Check if customer already exists by phone
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', data.phone)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Generate a UUID for the new customer
        const customerUuid = crypto.randomUUID();
        
        // Create new customer with explicit ID
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            id: customerUuid,
            first_name: firstName,
            last_name: lastName,
            phone: data.phone,
            email: null
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }
      
      // Create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          service_id: data.service_id,
          location_id: data.location_id,
          scheduled_time: scheduledDate.toISOString(),
          notes: data.notes,
          reason_for_visit: data.reason_for_visit,
          status: 'scheduled'
        })
        .select('id')
        .single();

      if (appointmentError) throw appointmentError;
      
      const confirmationCode = appointment.id;
      onAppointmentScheduled(confirmationCode);
      
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setStep('search');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitExistingCustomerAppointment = async (data: ExistingCustomerFormValues) => {
    if (!selectedDate || !selectedCustomer) {
      toast({
        title: t('common.error'),
        description: t('appointments.selectDateAndCustomer'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDate = parseTimeAndDate(selectedDate, selectedTime);
      
      // Create the appointment
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: selectedCustomer.id,
          service_id: data.service_id,
          location_id: data.location_id,
          scheduled_time: scheduledDate.toISOString(),
          notes: data.notes,
          reason_for_visit: data.reason_for_visit,
          status: 'scheduled'
        })
        .select('id')
        .single();

      if (error) throw error;

      const confirmationCode = appointment.id;
      onAppointmentScheduled(confirmationCode);
      
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setStep('search');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    step,
    selectedCustomer,
    isSubmitting,
    handleSelectCustomer,
    handleCreateNewCustomer,
    handleBackToSearch,
    submitNewCustomerAppointment,
    submitExistingCustomerAppointment,
  };
};
