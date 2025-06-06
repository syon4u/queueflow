
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, Calendar, User, CheckCircle, XCircle, Users, Timer, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueueStatus } from '@/hooks/useQueueStatus';

const StatusPage: React.FC = () => {
  const [lookupMethod, setLookupMethod] = useState<'confirmation' | 'details'>('confirmation');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const { data: statusData, isLoading, error, refetch } = useQueueStatus(
    lookupMethod === 'confirmation' ? confirmationNumber : undefined,
    lookupMethod === 'details' ? lastName : undefined,
    lookupMethod === 'details' ? phone : undefined
  );

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
        return 'In Queue';
      case 'in_progress':
        return 'Being Served';
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      default:
        return 'Unknown';
    }
  };

  const getCheckInStatus = (isCheckedIn: boolean, status: string) => {
    if (status === 'completed') {
      return { text: 'Service Completed', color: 'text-green-600', icon: CheckCircle };
    }
    if (isCheckedIn) {
      return { text: 'Checked In', color: 'text-green-600', icon: CheckCircle };
    }
    return { text: 'Not Checked In', color: 'text-red-600', icon: XCircle };
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
          <h1 className="text-2xl font-bold text-gray-900">Check Status</h1>
        </div>

        {/* Lookup Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Find My Status</CardTitle>
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
                Confirmation #
              </Button>
              <Button
                type="button"
                variant={lookupMethod === 'details' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLookupMethod('details')}
                className="flex-1"
              >
                Name & Phone
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {lookupMethod === 'confirmation' ? (
                <div>
                  <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmation Number
                  </label>
                  <Input
                    id="confirmation"
                    type="text"
                    placeholder="Enter CUST-XXXXXXXX or APT-XXXXXXXX"
                    value={confirmationNumber}
                    onChange={(e) => setConfirmationNumber(e.target.value)}
                    autoFocus
                    className="uppercase"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use your customer confirmation number (CUST-XXXXXXXX) or appointment code (APT-XXXXXXXX)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
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
                {isLoading ? 'Searching...' : 'Find My Status'}
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
                <p className="text-red-800 font-medium mb-2">Appointment Not Found</p>
                <p className="text-red-600 text-sm mb-4">
                  We couldn't find an appointment with the information provided. Please check your confirmation number and try again.
                </p>
                <Link to="/customer">
                  <Button variant="outline" size="sm">
                    Book New Appointment
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Results */}
        {statusData && (
          <Card className="mt-6 shadow-lg border-0 overflow-hidden" role="region" aria-live="polite" aria-label="Queue status results">
            <CardContent className="p-0">
              <div className="space-y-0">
                {/* Check-In Status Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
                  {(() => {
                    const checkInStatus = getCheckInStatus(statusData.is_checked_in, statusData.status);
                    const StatusIcon = checkInStatus.icon;
                    
                    return (
                      <div className="space-y-3">
                        <StatusIcon className="h-16 w-16 mx-auto text-white" />
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {checkInStatus.text}
                          </h2>
                          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                            {getStatusText(statusData.status)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Queue Position - Prominent Display */}
                {statusData.is_checked_in && statusData.position && (
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Users className="h-7 w-7 text-blue-600" />
                        <h3 className="text-2xl font-bold text-gray-900">Your Queue Position</h3>
                      </div>
                      
                      {/* Large Position Number */}
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200 max-w-sm mx-auto">
                        <div className="text-7xl font-black text-blue-600 mb-3 leading-none">
                          #{statusData.position}
                        </div>
                        <p className="text-lg font-semibold text-blue-800">
                          {statusData.position === 1 ? "🎉 You're next!" : `${statusData.position - 1} people ahead of you`}
                        </p>
                      </div>

                      {/* Wait Time Cards */}
                      <div className="grid gap-4">
                        {/* Estimated Wait Time */}
                        {statusData.estimated_wait_time_minutes > 0 && (
                          <div className="bg-white rounded-xl p-6 shadow-md border border-orange-200">
                            <div className="flex items-center justify-center gap-3 mb-3">
                              <div className="bg-orange-100 p-2 rounded-full">
                                <Timer className="h-6 w-6 text-orange-600" />
                              </div>
                              <span className="text-xl font-bold text-gray-900">Estimated Wait</span>
                            </div>
                            <div className="text-4xl font-black text-orange-600 mb-2">
                              ≈ {statusData.estimated_wait_time_minutes} min
                            </div>
                            <p className="text-sm text-gray-600">
                              Based on current queue and service times
                            </p>
                          </div>
                        )}

                        {/* Current Wait Time */}
                        {statusData.current_wait_time_minutes > 0 && (
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center gap-2 text-gray-700">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                <Clock className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="text-sm font-medium">
                                You've been waiting for <span className="font-bold text-gray-900">{statusData.current_wait_time_minutes} min</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appointment Details */}
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      Appointment Details
                    </h4>
                    
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{statusData.customer_name}</p>
                          <p className="text-sm text-gray-600">Customer</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-green-100 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{statusData.location_name}</p>
                          <p className="text-sm text-gray-600">Location</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{statusData.service_name}</p>
                          <p className="text-sm text-gray-600">Service</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(statusData.scheduled_at).toLocaleString([], { 
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <p className="text-sm text-gray-600">Scheduled Time</p>
                        </div>
                      </div>

                      {statusData.check_in_time && (
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {new Date(statusData.check_in_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            <p className="text-sm text-gray-600">Checked In</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!statusData.is_checked_in && statusData.status === 'scheduled' && (
                  <div className="p-6 bg-gray-50 border-t">
                    <Link to="/customer">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                        Check In Now
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Footer Information */}
                <div className="bg-gray-50 p-6 border-t space-y-4">
                  {/* Auto-refresh notice */}
                  {statusData.is_checked_in && (
                    <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-center gap-2 text-blue-700">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Queue information updates every 30 seconds</span>
                      </div>
                    </div>
                  )}

                  {/* Ticket Number */}
                  {statusData.ticket_number && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 border shadow-sm">
                        <Ticket className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Ticket Number</p>
                          <p className="font-mono text-sm font-bold text-gray-900">
                            {statusData.ticket_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
