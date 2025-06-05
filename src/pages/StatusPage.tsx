
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, Calendar, User } from 'lucide-react';
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
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'no_show':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'checked_in':
        return 'Checked In';
      case 'waiting':
        return 'Waiting';
      case 'in_progress':
        return 'Being Served';
      case 'completed':
        return 'Completed';
      case 'no_show':
        return 'No Show';
      default:
        return 'Unknown';
    }
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
            <CardTitle className="text-lg">Find Your Place in Line</CardTitle>
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
                    placeholder="Enter your confirmation number"
                    value={confirmationNumber}
                    onChange={(e) => setConfirmationNumber(e.target.value)}
                    autoFocus
                    className="uppercase"
                  />
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
                {isLoading ? 'Searching...' : 'Find My Place'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-800 font-medium mb-2">Appointment Not Found</p>
                <p className="text-red-600 text-sm mb-4">
                  We couldn't find an appointment with the information provided. Please check your details and try again.
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

        {statusData && (
          <Card className="mt-6 shadow-sm" role="region" aria-live="polite" aria-label="Queue status results">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {/* Position & Wait Time */}
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {statusData.position ? `#${statusData.position}` : 'N/A'}
                  </div>
                  <p className="text-gray-600">
                    {statusData.position ? "You're number" : "Position in line"}
                  </p>
                  {statusData.estimated_wait_time_minutes > 0 && (
                    <div className="flex items-center justify-center mt-2 text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>≈ {statusData.estimated_wait_time_minutes} min wait</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge className={getStatusColor(statusData.status)}>
                    {getStatusText(statusData.status)}
                  </Badge>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{statusData.customer_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">Main Office</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Service</p>
                      <p className="text-sm text-gray-600">{statusData.service_name}</p>
                    </div>
                  </div>

                  {statusData.check_in_time && (
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mt-0.5 mr-3 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Checked In</p>
                        <p className="text-sm text-gray-600">
                          {new Date(statusData.check_in_time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ticket Number */}
                {statusData.ticket_number && (
                  <div className="text-center pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Ticket Number</p>
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
