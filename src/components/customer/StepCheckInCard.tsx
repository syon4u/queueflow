
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, CheckCircle, Loader2, User, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkInPublicAppointment, customerName, listPublicAppointments } from '@/lib/publicQueue';

interface AppointmentInfo {
  id: string;
  code: string;
  customer_name: string;
  service_name: string;
  location_name: string;
  location_id: string;
  scheduled_time: string;
}

interface QueueInfo {
  position: number;
  estimatedWaitTime: number;
}

const StepCheckInCard = () => {
  const [step, setStep] = useState<'lookup' | 'confirm' | 'success'>('lookup');
  const [lookupMethod, setLookupMethod] = useState<'confirmation' | 'details'>('confirmation');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const findAppointment = async () => {
    if (lookupMethod === 'confirmation' && !confirmationCode.trim()) {
      toast({
        title: t('common.error'),
        description: t('public.checkIn.errors.enterCode'),
        variant: 'destructive',
      });
      return;
    }

    if (lookupMethod === 'details' && (!lastName.trim() || !phone.trim())) {
      toast({
        title: t('common.error'),
        description: t('public.checkIn.errors.enterNameAndPhone'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const matches = await listPublicAppointments(
        lookupMethod === 'confirmation'
          ? { code: confirmationCode }
          : { lastName, phone }
      );

      if (matches.length === 0) {
        throw new Error(t('public.checkIn.errors.notFound'));
      }

      const appointment = matches.find(apt => apt.status === 'scheduled');
      if (!appointment) {
        const latest = matches[0];
        if (latest.status === 'checked_in' || latest.status === 'in_progress') {
          throw new Error(
            latest.position
              ? t('public.checkIn.errors.alreadyCheckedInWithPosition', { position: latest.position })
              : t('public.checkIn.errors.alreadyCheckedIn')
          );
        }
        throw new Error(
          t('public.checkIn.errors.latestStatus', {
            status: t(`public.statusLabels.${latest.status}`, latest.status.replace('_', ' ')).toLowerCase(),
          })
        );
      }

      setAppointmentInfo({
        id: appointment.appointment_id,
        code: appointment.confirmation_code,
        customer_name: customerName(appointment),
        service_name: appointment.service_name || t('public.checkIn.fallbackService'),
        location_name: appointment.location_name || t('public.checkIn.fallbackLocation'),
        location_id: appointment.location_id || '',
        scheduled_time: appointment.scheduled_time
      });

      setStep('confirm');

    } catch (error) {
      console.error('Error finding appointment:', error);
      toast({
        title: t('public.checkIn.errors.notFoundTitle'),
        description: error instanceof Error ? error.message : t('public.checkIn.errors.notFoundFallback'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performCheckIn = async () => {
    if (!appointmentInfo) return;

    setIsLoading(true);

    try {
      const checkedIn = await checkInPublicAppointment(appointmentInfo.id, appointmentInfo.code);
      setQueueInfo({
        position: checkedIn.position ?? 1,
        estimatedWaitTime: checkedIn.estimated_wait_minutes ?? 0,
      });
      setStep('success');

    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: t('public.checkIn.errors.checkInFailed'),
        description: error instanceof Error ? error.message : t('public.checkIn.errors.checkInFallback'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (step === 'lookup') {
        findAppointment();
      } else if (step === 'confirm') {
        performCheckIn();
      }
    }
  };

  const resetForm = () => {
    setStep('lookup');
    setConfirmationCode('');
    setLastName('');
    setPhone('');
    setAppointmentInfo(null);
    setQueueInfo(null);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-6">
      <Card className="shadow-sm">
        {step === 'lookup' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5" />
                {t('public.checkIn.findTitle')}
              </CardTitle>
              <CardDescription>
                {t('public.checkIn.findDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Method Selection */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={lookupMethod === 'confirmation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLookupMethod('confirmation')}
                  className="flex-1"
                >
                  {t('public.checkIn.methodCode')}
                </Button>
                <Button
                  type="button"
                  variant={lookupMethod === 'details' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLookupMethod('details')}
                  className="flex-1"
                >
                  {t('public.checkIn.methodDetails')}
                </Button>
              </div>

              {lookupMethod === 'confirmation' ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmation-code">{t('public.checkIn.codeLabel')}</Label>
                  <Input
                    id="confirmation-code"
                    placeholder={t('public.checkIn.codePlaceholder')}
                    className="text-center font-mono"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    {t('public.checkIn.codeHint')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center text-sm text-gray-500 py-2">
                    {t('public.checkIn.or')}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="last-name">{t('public.checkIn.lastName')}</Label>
                      <Input
                        id="last-name"
                        placeholder={t('public.checkIn.lastNamePlaceholder')}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('public.checkIn.phone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full" 
                onClick={findAppointment}
                disabled={isLoading || (lookupMethod === 'confirmation' ? !confirmationCode.trim() : !lastName.trim() || !phone.trim())}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('public.checkIn.searching')}
                  </>
                ) : (
                  t('public.checkIn.findButton')
                )}
              </Button>
            </CardContent>
          </>
        )}

        {step === 'confirm' && appointmentInfo && (
          <>
            <CardHeader className="text-center">
              <CardTitle>{t('public.checkIn.confirmTitle')}</CardTitle>
              <CardDescription>
                {t('public.checkIn.confirmDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border">
                <div className="flex items-start">
                  <User className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{appointmentInfo.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('public.checkIn.service')}</p>
                    <p className="text-sm text-gray-600">{appointmentInfo.service_name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('public.checkIn.location')}</p>
                    <p className="text-sm text-gray-600">{appointmentInfo.location_name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('public.checkIn.scheduledTime')}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointmentInfo.scheduled_time).toLocaleString(i18n.language, { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {t('public.checkIn.back')}
                </Button>
                <Button 
                  onClick={performCheckIn}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('public.checkIn.checkingIn')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('public.checkIn.checkMeIn')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'success' && queueInfo && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-green-600">{t('public.checkIn.successTitle')}</CardTitle>
              <CardDescription>
                {t('public.checkIn.successDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Queue Position */}
              <div className="text-center bg-blue-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  #{queueInfo.position}
                </div>
                <p className="text-gray-600 mb-4">{t('public.checkIn.positionLabel')}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-lg font-semibold">{Math.max(0, queueInfo.position - 1)}</p>
                    <p className="text-xs text-gray-600">{t('public.checkIn.aheadOfYou')}</p>
                  </div>
                  
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                    <p className="text-lg font-semibold">{t('public.checkIn.waitShort', { minutes: queueInfo.estimatedWaitTime })}</p>
                    <p className="text-xs text-gray-600">{t('public.checkIn.estimatedWait')}</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>{t('public.checkIn.refreshNote')}</p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => navigate('/')}
              >
                {t('public.checkIn.done')}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default StepCheckInCard;
