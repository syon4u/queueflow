
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import ServiceSelector from '@/components/ServiceSelector';
import LocationSelector from '@/components/LocationSelector';
import TimePicker from '@/components/TimePicker';

const newCustomerFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  service_id: z.string().min(1, "Service is required"),
  location_id: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
  reason_for_visit: z.string().optional(),
});

export type NewCustomerFormValues = z.infer<typeof newCustomerFormSchema>;

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
  const { t } = useTranslation();

  const form = useForm<NewCustomerFormValues>({
    resolver: zodResolver(newCustomerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      service_id: "",
      location_id: "",
      notes: "",
      reason_for_visit: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customer.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('customer.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customer.phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('customer.phonePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location_id"
          render={({ field }) => (
            <LocationSelector 
              value={field.value} 
              onChange={field.onChange} 
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="service_id"
          render={({ field }) => (
            <ServiceSelector 
              value={field.value} 
              onChange={field.onChange}
              locationId={form.watch('location_id')}
            />
          )}
        />
        
        <TimePicker 
          date={selectedDate}
          onDateChange={setSelectedDate}
          time={selectedTime}
          onTimeChange={setSelectedTime}
        />
        
        <FormField
          control={form.control}
          name="reason_for_visit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('appointments.reasonForVisit')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('appointments.reasonPlaceholder')}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('appointments.notes')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('appointments.notesPlaceholder')}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            {t('common.back')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : t('appointments.schedule')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewCustomerForm;
