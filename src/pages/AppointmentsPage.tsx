
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Clock } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-500';
    case 'checked_in': return 'bg-yellow-500';
    case 'in_progress': return 'bg-orange-500';
    case 'completed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    case 'no_show': return 'bg-gray-500';
    default: return 'bg-gray-300';
  }
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { appointments, isLoading, refetch } = useAppData();
  
  // Filter appointments for current user
  const userAppointments = appointments.filter(
    appointment => appointment.customer_id === user?.id
  );
  
  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh data
      refetch();
      
      toast({
        title: t('appointments.cancelled'),
        description: t('appointments.appointmentCancelled')
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointments.errorCancelling'),
        variant: 'destructive'
      });
    }
  };
  
  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'PPp');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pattern-waves bg-gradient-overlay-teal">
        <div className="container mx-auto p-6">
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-pattern-waves bg-gradient-overlay-teal">
      <div className="container mx-auto p-6">
        <div className="bg-image bg-image-overlay rounded-xl mb-6" 
             style={{ backgroundImage: "url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg')" }}>
          <div className="flex justify-between items-center p-6">
            <h1 className="text-3xl font-bold">{t('appointments.title')}</h1>
            <Button asChild>
              <Link to="/new-appointment">{t('appointments.newAppointment')}</Link>
            </Button>
          </div>
        </div>
        
        {userAppointments.length === 0 ? (
          <Card className="text-center p-12 bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50">
            <CardContent className="pt-6">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('appointments.noAppointments')}</h2>
              <p className="text-muted-foreground mb-6">{t('appointments.bookAppointment')}</p>
              <Button asChild>
                <Link to="/new-appointment">{t('appointments.scheduleNow')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userAppointments.map((appointment) => (
              <Card key={appointment.id} className={`${appointment.status === 'cancelled' ? 'opacity-60' : ''} bg-white/90 backdrop-filter backdrop-blur-sm border border-gray-200/50 transition-all hover:shadow-md`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={getStatusColor(appointment.status)}>{t(`appointments.status.${appointment.status}`)}</Badge>
                      <CardTitle className="mt-2">{appointment.service?.name || 'Unknown Service'}</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('appointments.location')}</p>
                      <p>{appointment.location?.name || 'Unknown Location'}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDateTime(appointment.scheduled_time)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{t('appointments.duration')}: {appointment.service?.duration || 0} {t('appointments.minutes')}</span>
                    </div>
                  </div>
                  
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        {t('appointments.cancel')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/">{t('common.backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
