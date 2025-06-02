
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatWaitTime } from '@/lib/queue';

const formSchema = z.object({
  appointment_code: z.string().min(1, "Confirmation code is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentStatus {
  id: string;
  status: string;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  services: {
    name: string;
    duration: number;
  } | null;
  locations: {
    name: string;
  } | null;
  customers: {
    first_name: string;
    last_name: string;
  } | null;
}

const AppointmentStatusCard = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentStatus | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_code: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name, duration),
          locations (name),
          customers (first_name, last_name)
        `)
        .eq('id', data.appointment_code)
        .single();

      if (error || !appointmentData) {
        toast({
          title: "Appointment Not Found",
          description: "No appointment found with that confirmation code",
          variant: "destructive",
        });
        setAppointment(null);
        return;
      }

      setAppointment(appointmentData);
    } catch (error) {
      console.error('Error checking appointment status:', error);
      toast({
        title: "Status Check Failed",
        description: "Unable to retrieve appointment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'secondary';
      case 'checked_in':
        return 'default';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'outline';
      case 'cancelled':
      case 'no_show':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getEstimatedWait = () => {
    if (!appointment || appointment.status === 'completed') return null;
    
    if (appointment.check_in_time) {
      const checkInTime = new Date(appointment.check_in_time);
      const now = new Date();
      const waitTimeMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / (1000 * 60));
      return waitTimeMinutes;
    }
    
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Status</CardTitle>
        <CardDescription>
          View the current status of your appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="appointment_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your confirmation code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Checking Status..." : "Check Status"}
            </Button>
          </form>
        </Form>

        {appointment && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Appointment Details</h3>
              <Badge variant={getStatusBadgeVariant(appointment.status)}>
                {appointment.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span>{appointment.customers?.first_name} {appointment.customers?.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span>{appointment.services?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{appointment.locations?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled Time:</span>
                <span>{new Date(appointment.scheduled_time).toLocaleString()}</span>
              </div>
              
              {appointment.check_in_time && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in Time:</span>
                  <span>{new Date(appointment.check_in_time).toLocaleString()}</span>
                </div>
              )}
              
              {getEstimatedWait() !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wait Time:</span>
                  <span>{formatWaitTime(getEstimatedWait()!)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentStatusCard;
