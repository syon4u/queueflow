
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceNotifications } from '@/hooks/use-voice-notifications';
import { useAppointments } from '@/hooks/use-appointments';
import { Phone, PhoneCall, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export const VoiceNotificationSystem: React.FC = () => {
  const { notifications, isProcessing, scheduleVoiceCall, cancelVoiceNotification } = useVoiceNotifications();
  const { appointments } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('9BWtsMINqrJLrRacOk9x'); // Aria voice
  const [maxRetries, setMaxRetries] = useState(3);

  const handleScheduleCall = async () => {
    if (!selectedAppointment || !customMessage.trim()) return;

    const appointment = appointments?.find(a => a.id === selectedAppointment);
    if (!appointment || !appointment.customer?.phone) return;

    await scheduleVoiceCall({
      customerId: appointment.customer_id,
      appointmentId: appointment.id,
      phoneNumber: appointment.customer.phone,
      message: customMessage,
      voiceId: selectedVoice,
      maxRetries
    });

    setSelectedAppointment('');
    setCustomMessage('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">⏳ Pending</Badge>;
      case 'calling':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">📞 Calling</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">✅ Completed</Badge>;
      case 'no_answer':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">📵 No Answer</Badge>;
      case 'busy':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">📞 Busy</Badge>;
      case 'failed':
        return <Badge variant="destructive">❌ Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'calling':
        return <PhoneCall className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'no_answer':
      case 'busy':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const upcomingAppointments = appointments?.filter(a => 
    a.status === 'scheduled' && 
    new Date(a.scheduled_time) > new Date() &&
    a.customer?.phone
  ) || [];

  const recentNotifications = notifications?.slice(0, 10) || [];

  // Voice options
  const voiceOptions = [
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria (Female, Clear)' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (Male, Professional)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Female, Warm)' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Male, Friendly)' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (Male, Clear)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Voice Call Notifications</h2>
        <p className="text-muted-foreground">
          Automated voice call system for customer notifications and confirmations using AI-generated speech
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule New Voice Call */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Schedule Voice Call
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Appointment</label>
              <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an appointment with phone number" />
                </SelectTrigger>
                <SelectContent>
                  {upcomingAppointments.map(appointment => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {appointment.customer?.first_name} {appointment.customer?.last_name} - {appointment.customer?.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Voice</label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Retries</label>
              <Select value={maxRetries.toString()} onValueChange={(value) => setMaxRetries(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 attempt</SelectItem>
                  <SelectItem value="2">2 attempts</SelectItem>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Enter the message to be spoken during the call..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="text-xs text-muted-foreground">
                Keep messages clear and concise for best voice quality
              </div>
            </div>

            <Button 
              onClick={handleScheduleCall}
              disabled={!selectedAppointment || !customMessage.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Scheduling...' : 'Schedule Voice Call'}
            </Button>
          </CardContent>
        </Card>

        {/* Voice Call Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Call Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {notifications?.filter(n => n.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-blue-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {notifications?.filter(n => n.status === 'completed').length || 0}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {notifications?.filter(n => n.status === 'no_answer').length || 0}
                </div>
                <div className="text-sm text-orange-600">No Answer</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {notifications?.filter(n => n.status === 'failed').length || 0}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Voice Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Voice Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      {getStatusBadge(notification.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{notification.phone_number}</code>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {notification.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    {notification.call_duration ? `${notification.call_duration}s` : '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(notification.scheduled_for), 'PPp')}
                  </TableCell>
                  <TableCell>
                    {notification.retry_count}/{notification.max_retries}
                  </TableCell>
                  <TableCell>
                    {notification.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelVoiceNotification(notification.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
