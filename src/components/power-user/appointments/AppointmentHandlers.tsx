
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAppointmentHandlers = (refetch: () => void) => {
  const { toast } = useToast();

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'checked_in',
          check_in_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer checked in successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in customer",
        variant: "destructive",
      });
    }
  };

  const handleStartService = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'in_progress',
          start_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service started successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start service",
        variant: "destructive",
      });
    }
  };

  const handleCompleteService = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service completed successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete service",
        variant: "destructive",
      });
    }
  };

  const handleAddWalkIn = () => {
    toast({
      title: "Walk-in Feature",
      description: "Walk-in appointment form would open here",
    });
  };

  const handleScheduleFollowUp = () => {
    toast({
      title: "Follow-up Feature",
      description: "Follow-up scheduling form would open here",
    });
  };

  const handleViewFullQueue = () => {
    toast({
      title: "Queue View",
      description: "Full queue management view would open here",
    });
  };

  const handleScheduleAppointment = () => {
    toast({
      title: "Schedule Appointment",
      description: "New appointment scheduling form would open here",
    });
  };

  return {
    handleCheckIn,
    handleStartService,
    handleCompleteService,
    handleAddWalkIn,
    handleScheduleFollowUp,
    handleViewFullQueue,
    handleScheduleAppointment
  };
};
