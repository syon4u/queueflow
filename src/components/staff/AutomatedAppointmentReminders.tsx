
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppointmentReminders } from '@/hooks/use-appointment-reminders';
import { useAppointments } from '@/hooks/use-appointments';
import { Bell, Clock, Mail, MessageSquare, Phone, Settings } from 'lucide-react';
import { format } from 'date-fns';

export const AutomatedAppointmentReminders: React.FC = () => {
  const { reminders, isProcessing, scheduleReminders, cancelReminders } = useAppointmentReminders();
  const { appointments } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [reminderSettings, setReminderSettings] = useState({
    sms_reminders: true,
    email_reminders: true,
    voice_reminders: false,
    reminder_timing: '24h' as '24h' | '12h' | '2h' | '30m'
  });

  const handleScheduleReminders = async () => {
    if (!selectedAppointment) return;

    const appointment = appointments?.find(a => a.id === selectedAppointment);
    if (!appointment) return;

    await scheduleReminders({
      appointmentId: appointment.id,
      customerId: appointment.customer_id,
      scheduledTime: appointment.scheduled_time,
      customerPreferences: reminderSettings
    });

    setSelectedAppointment('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">⏳ Pending</Badge>;
      case 'sent':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">✅ Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">❌ Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-500">🚫 Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'initial':
        return <Bell className="h-4 w-4 text-blue-600" />;
      case 'follow_up':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'same_day':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'final':
        return <Phone className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const upcomingAppointments = appointments?.filter(a => 
    a.status === 'scheduled' && 
    new Date(a.scheduled_time) > new Date()
  ) || [];

  const recentReminders = reminders?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Automated Appointment Reminders</h2>
        <p className="text-muted-foreground">
          Intelligent reminder system with multiple touchpoints, escalation, and customer preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule New Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Schedule Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Appointment</label>
              <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an upcoming appointment" />
                </SelectTrigger>
                <SelectContent>
                  {upcomingAppointments.map(appointment => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {appointment.customers?.first_name} {appointment.customers?.last_name} - {format(new Date(appointment.scheduled_time), 'PPP p')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Reminder Preferences</label>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email Reminders</span>
                </div>
                <Switch
                  checked={reminderSettings.email_reminders}
                  onCheckedChange={(checked) => 
                    setReminderSettings(prev => ({ ...prev, email_reminders: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">SMS Reminders</span>
                </div>
                <Switch
                  checked={reminderSettings.sms_reminders}
                  onCheckedChange={(checked) => 
                    setReminderSettings(prev => ({ ...prev, sms_reminders: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Voice Reminders</span>
                </div>
                <Switch
                  checked={reminderSettings.voice_reminders}
                  onCheckedChange={(checked) => 
                    setReminderSettings(prev => ({ ...prev, voice_reminders: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Reminder Timing</label>
                <Select 
                  value={reminderSettings.reminder_timing} 
                  onValueChange={(value: any) => 
                    setReminderSettings(prev => ({ ...prev, reminder_timing: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 hours before</SelectItem>
                    <SelectItem value="12h">12 hours before</SelectItem>
                    <SelectItem value="2h">2 hours before</SelectItem>
                    <SelectItem value="30m">30 minutes before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleScheduleReminders}
              disabled={!selectedAppointment || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Scheduling...' : 'Schedule Reminders'}
            </Button>
          </CardContent>
        </Card>

        {/* Reminder Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Reminder Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {reminders?.filter(r => r.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-blue-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {reminders?.filter(r => r.status === 'sent').length || 0}
                </div>
                <div className="text-sm text-green-600">Sent Today</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {reminders?.filter(r => r.status === 'failed').length || 0}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {reminders?.filter(r => r.status === 'cancelled').length || 0}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getReminderTypeIcon(reminder.reminder_type)}
                      <span className="capitalize">{reminder.reminder_type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    Customer #{reminder.appointment_id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(reminder.scheduled_for), 'PPP p')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(reminder.status)}
                  </TableCell>
                  <TableCell>
                    {reminder.sent_at ? format(new Date(reminder.sent_at), 'PPP p') : '-'}
                  </TableCell>
                  <TableCell>
                    {reminder.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelReminders(reminder.appointment_id)}
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
