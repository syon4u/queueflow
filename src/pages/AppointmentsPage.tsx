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
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardButton from '@/components/ui/broward-button';
import BrowardCard from '@/components/ui/broward-card';

interface Appointment {
  id: string;
  status: string;
  scheduled_time: string;
  check_in_time: string | null;
  start_time: string | null;
  end_time: string | null;
  service: {
    name: string;
    duration: number;
  };
  location: {
    name: string;
  };
}

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

// Mock appointments for demo
const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    status: 'scheduled',
    scheduled_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    check_in_time: null,
    start_time: null,
    end_time: null,
    service: {
      name: 'License Renewal',
      duration: 30
    },
    location: {
      name: 'Main Office'
    }
  },
  {
    id: 'appt-2',
    status: 'checked_in',
    scheduled_time: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    check_in_time: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    start_time: null,
    end_time: null,
    service: {
      name: 'ID Card Application',
      duration: 20
    },
    location: {
      name: 'North Branch'
    }
  },
  {
    id: 'appt-3',
    status: 'completed',
    scheduled_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    check_in_time: new Date(Date.now() - 86400000 + 1800000).toISOString(),
    start_time: new Date(Date.now() - 86400000 + 2700000).toISOString(),
    end_time: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    service: {
      name: 'Business License',
      duration: 45
    },
    location: {
      name: 'South Branch'
    }
  }
];

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCancel = async (id: string) => {
    try {
      // Update local state
      setAppointments(prev => prev.map(appt => 
        appt.id === id ? { ...appt, status: 'cancelled' } : appt
      ));
      
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
  
  return (
    <BrowardLayout headerTitle="Appointments">
      <BrowardHero 
        title="Your Appointments" 
        subtitle="View and manage your scheduled appointments"
        backgroundStyle="wave"
      />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <BrowardButton asChild>
            <Link to="/new-appointment">{t('appointments.newAppointment')}</Link>
          </BrowardButton>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bc-blue"></div>
          </div>
        ) : appointments.length === 0 ? (
          <BrowardCard className="text-center p-12">
            <Calendar className="mx-auto h-12 w-12 text-bc-blue mb-4" />
            <h2 className="text-xl font-serif mb-2">{t('appointments.noAppointments')}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{t('appointments.bookAppointment')}</p>
            <BrowardButton asChild>
              <Link to="/new-appointment">{t('appointments.scheduleNow')}</Link>
            </BrowardButton>
          </BrowardCard>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <BrowardCard 
                key={appointment.id} 
                className={appointment.status === 'cancelled' ? 'opacity-60' : ''}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className={getStatusColor(appointment.status)}>{t(`appointments.status.${appointment.status}`)}</Badge>
                    <h3 className="mt-2 font-serif text-xl">{appointment.service.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('appointments.location')}</p>
                    <p>{appointment.location.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-bc-blue" />
                    <span className="text-sm">{formatDateTime(appointment.scheduled_time)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-bc-blue" />
                    <span className="text-sm">{t('appointments.duration')}: {appointment.service.duration} {t('appointments.minutes')}</span>
                  </div>
                </div>
                
                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <div className="mt-4 flex justify-end">
                    <BrowardButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      {t('appointments.cancel')}
                    </BrowardButton>
                  </div>
                )}
              </BrowardCard>
            ))}
          </div>
        )}
      </div>
    </BrowardLayout>
  );
};

export default AppointmentsPage;