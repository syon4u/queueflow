
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import ServiceSelector from '@/components/ServiceSelector';
import LocationSelector from '@/components/LocationSelector';
import TimePicker from '@/components/TimePicker';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  service_id: z.string().min(1, "Service is required"),
  location_id: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ScheduleAppointmentCardProps {
  onAppointmentScheduled: (code: string) => void;
}

const ScheduleAppointmentCard = ({ onAppointmentScheduled }: ScheduleAppointmentCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState('9:00 AM');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      service_id: "",
      location_id: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    try {
      // Parse selected date and time
      const [hours, minutes] = selectedTime.split(':');
      const [minutesValue, ampm] = minutes.split(' ');
      let hour = parseInt(hours);
      
      if (ampm === 'PM' && hour < 12) {
        hour += 12;
      } else if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }

      // Create a date object with the selected date and time
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hour, parseInt(minutesValue));
      
      const appointmentData = {
        service_id: data.service_id,
        location_id: data.location_id,
        scheduled_time: scheduledDate.toISOString(),
        notes: data.notes,
        customer_name: data.name,
        phone_number: data.phone,
      };

      // Send the appointment request to the Supabase Edge Function
      const { data: response, error } = await supabase.functions.invoke('appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });

      if (error) throw error;

      // Generate a confirmation code (this would normally come from the server)
      const confirmationCode = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Call the callback with the confirmation code
      onAppointmentScheduled(confirmationCode);
      
      // Reset form and invalidate queries
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Appointment</CardTitle>
        <CardDescription>
          Fill out the form to schedule a new appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requests or notes for your appointment"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Schedule Appointment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScheduleAppointmentCard;
