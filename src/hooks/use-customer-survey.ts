
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SurveyStats {
  totalSurveys: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  recentFeedback: Array<{
    id: string;
    rating: number;
    feedback: string;
    submitted_at: string;
    appointment_id: string;
  }>;
}

export function useCustomerSurvey() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    appointmentId: string;
    customerId: string;
  } | null>(null);

  // Get survey statistics
  const { data: surveyStats, isLoading: statsLoading } = useQuery({
    queryKey: ['survey-stats'],
    queryFn: async (): Promise<SurveyStats> => {
      const { data: surveys, error } = await supabase
        .from('customer_surveys')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const totalSurveys = surveys?.length || 0;
      const ratings = surveys?.map(s => s.rating).filter(Boolean) || [];
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

      const ratingDistribution = ratings.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const recentFeedback = surveys?.slice(0, 10).map(survey => ({
        id: survey.id,
        rating: survey.rating || 0,
        feedback: survey.feedback || '',
        submitted_at: survey.submitted_at || '',
        appointment_id: survey.appointment_id || ''
      })) || [];

      return {
        totalSurveys,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        recentFeedback
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Get surveys for a specific appointment
  const { data: appointmentSurvey } = useQuery({
    queryKey: ['appointment-survey', selectedAppointment?.appointmentId],
    queryFn: async () => {
      if (!selectedAppointment?.appointmentId) return null;

      const { data, error } = await supabase
        .from('customer_surveys')
        .select('*')
        .eq('appointment_id', selectedAppointment.appointmentId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedAppointment?.appointmentId
  });

  const openSurveyModal = (appointmentId: string, customerId: string) => {
    setSelectedAppointment({ appointmentId, customerId });
    setIsModalOpen(true);
  };

  const closeSurveyModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const hasSurveyBeenSubmitted = (appointmentId: string): boolean => {
    return appointmentSurvey?.appointment_id === appointmentId;
  };

  return {
    surveyStats,
    statsLoading,
    isModalOpen,
    selectedAppointment,
    appointmentSurvey,
    openSurveyModal,
    closeSurveyModal,
    hasSurveyBeenSubmitted
  };
}
