import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueueStatus } from '@/hooks/useQueueStatus';

const StatusPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [lookupMethod, setLookupMethod] = useState<'confirmation' | 'details'>('confirmation');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const confirmationInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);

  // Focus the first field of the active lookup method (replaces autoFocus).
  useEffect(() => {
    if (lookupMethod === 'confirmation') {
      confirmationInputRef.current?.focus();
    } else {
      lastNameInputRef.current?.focus();
    }
  }, [lookupMethod]);
  const {
    data: statusData,
    isLoading,
    error,
    refetch
  } = useQueueStatus(lookupMethod === 'confirmation' ? confirmationNumber : undefined, lookupMethod === 'details' ? lastName : undefined, lookupMethod === 'details' ? phone : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupMethod === 'confirmation' && confirmationNumber.trim()) {
      refetch();
    } else if (lookupMethod === 'details' && lastName.trim() && phone.trim()) {
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'no_show':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'checked_in':
      case 'in_progress':
      case 'completed':
      case 'scheduled':
      case 'cancelled':
      case 'no_show':
        return t(`public.statusLabels.${status.toLowerCase()}`);
      default:
        return t('public.statusLabels.unknown');
    }
  };

  const getCheckInStatus = (isCheckedIn: boolean, status: string) => {
    if (status === 'completed') {
      return {
        text: t('public.status.serviceCompleted'),
        color: 'text-green-600',
        icon: CheckCircle
      };
    }
    if (isCheckedIn) {
      return {
        text: t('public.status.checkedIn'),
        color: 'text-green-600',
        icon: CheckCircle
      };
    }
    return {
      text: t('public.status.notCheckedIn'),
      color: 'text-red-600',
      icon: XCircle
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('public.status.pageTitle')}</h1>
        </div>

        {/* Lookup Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t('public.status.findTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Method Selection */}
            <div className="flex space-x-2 mb-4">
              <Button 
                type="button" 
                variant={lookupMethod === 'confirmation' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setLookupMethod('confirmation')} 
                className="flex-1"
              >
                {t('public.status.methodCode')}
              </Button>
              <Button 
                type="button" 
                variant={lookupMethod === 'details' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setLookupMethod('details')} 
                className="flex-1"
              >
                {t('public.status.methodDetails')}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {lookupMethod === 'confirmation' ? (
                <div>
                  <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('public.status.codeLabel')}
                  </label>
                  <Input 
                    id="confirmation" 
                    ref={confirmationInputRef}
                    type="text" 
                    placeholder={t('public.status.codePlaceholder')} 
                    value={confirmationNumber} 
                    onChange={(e) => setConfirmationNumber(e.target.value)} 
                    className="uppercase" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('public.status.codeHint')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('public.status.lastName')}
                    </label>
                    <Input 
                      id="lastName" 
                      ref={lastNameInputRef}
                      type="text" 
                      placeholder={t('public.status.lastNamePlaceholder')} 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('public.status.phone')}
                    </label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(555) 123-4567" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || (lookupMethod === 'confirmation' ? !confirmationNumber.trim() : !lastName.trim() || !phone.trim())}
              >
                {isLoading ? t('public.status.searching') : t('public.status.findButton')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Results */}
        {error && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto text-red-600 mb-3" />
                <p className="text-red-800 font-medium mb-2">{t('public.status.notFoundTitle')}</p>
                <p className="text-red-600 text-sm mb-4">
                  {t('public.status.notFoundDescription')}
                </p>
                <Link to="/customer">
                  <Button variant="outline" size="sm">
                    {t('public.status.bookNew')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Results */}
        {statusData && (
          <Card className="mt-6 shadow-sm" role="region" aria-live="polite" aria-label={t('public.status.resultsLabel')}>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Check-In Status - Main Focus */}
                <div className="text-center border-b pb-4">
                  {(() => {
                    const checkInStatus = getCheckInStatus(statusData.is_checked_in, statusData.status);
                    const StatusIcon = checkInStatus.icon;
                    return (
                      <div className="space-y-2">
                        <StatusIcon className={`h-16 w-16 mx-auto ${checkInStatus.color}`} />
                        <h2 className={`text-2xl font-bold ${checkInStatus.color}`}>
                          {checkInStatus.text}
                        </h2>
                        <Badge className={getStatusColor(statusData.status)}>
                          {getStatusText(statusData.status)}
                        </Badge>
                      </div>
                    );
                  })()}
                </div>

                {/* Queue Position (only if checked in) */}
                {statusData.is_checked_in && statusData.position && (
                  <div className="text-center bg-blue-50 rounded-lg p-4">
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      #{statusData.position}
                    </div>
                    <p className="text-gray-600">{t('public.status.positionLabel')}</p>
                    {statusData.estimated_wait_time_minutes > 0 && (
                      <div className="flex items-center justify-center mt-2 text-blue-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{t('public.status.waitApprox', { minutes: statusData.estimated_wait_time_minutes })}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Appointment Details */}
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{statusData.customer_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-left">{t('public.status.location')}</p>
                      <p className="text-sm text-gray-600">{statusData.location_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-left">{t('public.status.service')}</p>
                      <p className="text-sm text-gray-600">{statusData.service_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-left">{t('public.status.scheduledTime')}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(statusData.scheduled_at).toLocaleString(i18n.language, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {statusData.check_in_time && (
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mt-0.5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t('public.status.checkedIn')}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(statusData.check_in_time).toLocaleTimeString(i18n.language, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!statusData.is_checked_in && statusData.status === 'scheduled' && (
                  <div className="text-center">
                    <Link to="/check-in">
                      <Button className="w-full">
                        {t('public.status.checkInNow')}
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Ticket Number */}
                {statusData.ticket_number && (
                  <div className="text-center pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">{t('public.status.ticketNumber')}</p>
                    <p className="font-mono text-sm font-medium text-gray-900">
                      {statusData.ticket_number}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
