
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import ServiceSelector from '@/components/ServiceSelector';
import LocationSelector from '@/components/LocationSelector';
import TimePicker from '@/components/TimePicker';
import { useAppointments } from '@/hooks/use-appointments';
import { formatWaitTime } from '@/lib/queue';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  service_id: z.string().min(1, "Service is required"),
  location_id: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CustomerPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [appointmentCreated, setAppointmentCreated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const { userPosition, estimatedWaitTime } = useAppointments();

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
      };

      // Send the appointment request to the Supabase Edge Function
      const { data: response, error } = await supabase.functions.invoke('appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your appointment has been scheduled",
      });

      // Reset form and update appointment created state
      form.reset();
      setAppointmentCreated(true);
      
      // Invalidate and refetch appointments
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {appointmentCreated && userPosition && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle>Your Appointment</CardTitle>
              <CardDescription>Current queue information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    #{userPosition}
                  </p>
                  <p className="text-sm text-muted-foreground">Your position in line</p>
                </div>
                
                {estimatedWaitTime !== null && (
                  <div className="text-center mt-4">
                    <p className="text-xl font-medium">
                      Estimated wait: {formatWaitTime(estimatedWaitTime)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
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
      </div>
      
      <div className="flex space-x-4">
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default CustomerPage;
