
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCapacityManagement } from '@/hooks/use-capacity-management';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Settings,
  TrendingUp,
  UserPlus
} from 'lucide-react';

interface CapacityStatus {
  has_capacity: boolean;
  current_capacity: number;
  max_capacity: number;
  max_allowed: number;
  available_spots: number;
  buffer_amount: number;
}

export const CapacityManagementTab: React.FC = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [overrideCapacity, setOverrideCapacity] = useState<string>('');
  const [overrideNotes, setOverrideNotes] = useState<string>('');

  const {
    capacityEvents,
    eventsLoading,
    waitlistEntries,
    waitlistLoading,
    updateCapacity,
    updatingCapacity,
    convertWaitlistEntry,
    convertingEntry
  } = useCapacityManagement(selectedLocationId);

  // Fetch locations
  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch current capacity status for selected location
  const { data: capacityStatus, isLoading: capacityLoading } = useQuery({
    queryKey: ['capacity-status', selectedLocationId],
    queryFn: async (): Promise<CapacityStatus | null> => {
      if (!selectedLocationId) return null;
      
      const { data, error } = await supabase.rpc('check_location_capacity', {
        location_uuid: selectedLocationId
      });

      if (error) throw error;
      return data as unknown as CapacityStatus;
    },
    enabled: !!selectedLocationId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleCapacityOverride = () => {
    if (!selectedLocationId || !overrideCapacity) return;
    
    updateCapacity({
      locationId: selectedLocationId,
      newCapacity: parseInt(overrideCapacity),
      notes: overrideNotes || undefined
    });
    
    setOverrideCapacity('');
    setOverrideNotes('');
  };

  const getCapacityStatusColor = (status: CapacityStatus | null) => {
    if (!status) return 'secondary';
    const utilizationRate = status.current_capacity / status.max_allowed;
    if (utilizationRate >= 1) return 'destructive';
    if (utilizationRate >= 0.8) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Capacity Management</h2>
        <p className="text-gray-600">
          Monitor and manage location capacity to prevent overcrowding and maintain service quality.
        </p>
      </div>

      {/* Location Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Location Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Select Location</Label>
              <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a location to manage" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLocationId && (
        <>
          {/* Current Capacity Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Capacity Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {capacityLoading ? (
                <div className="text-center py-4">Loading capacity status...</div>
              ) : capacityStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{capacityStatus.current_capacity}</div>
                    <div className="text-sm text-gray-600">Current</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{capacityStatus.max_allowed}</div>
                    <div className="text-sm text-gray-600">Max Allowed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{capacityStatus.available_spots}</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div className="text-center">
                    <Badge variant={getCapacityStatusColor(capacityStatus)}>
                      {capacityStatus.has_capacity ? 'Available' : 'Full'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No capacity data available</div>
              )}
            </CardContent>
          </Card>

          {/* Capacity Override */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Capacity Override
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="override-capacity">New Capacity Limit</Label>
                    <Input
                      id="override-capacity"
                      type="number"
                      value={overrideCapacity}
                      onChange={(e) => setOverrideCapacity(e.target.value)}
                      placeholder="Enter new capacity limit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="override-notes">Reason (Optional)</Label>
                    <Input
                      id="override-notes"
                      value={overrideNotes}
                      onChange={(e) => setOverrideNotes(e.target.value)}
                      placeholder="Emergency situation, special event, etc."
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCapacityOverride}
                  disabled={updatingCapacity || !overrideCapacity}
                  className="w-full md:w-auto"
                >
                  {updatingCapacity ? 'Updating...' : 'Apply Override'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Waitlist Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Capacity Waitlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {waitlistLoading ? (
                <div className="text-center py-4">Loading waitlist...</div>
              ) : waitlistEntries && waitlistEntries.length > 0 ? (
                <div className="space-y-3">
                  {waitlistEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">
                          {entry.customer?.first_name} {entry.customer?.last_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Service: {entry.service?.name} | 
                          Requested: {new Date(entry.requested_time).toLocaleString()}
                        </div>
                        {entry.customer?.phone && (
                          <div className="text-sm text-gray-500">
                            Phone: {entry.customer.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Priority: {entry.priority_level}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => convertWaitlistEntry(entry.id)}
                          disabled={convertingEntry}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Notify
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No customers on waitlist
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Capacity Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Capacity Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-center py-4">Loading events...</div>
              ) : capacityEvents && capacityEvents.length > 0 ? (
                <div className="space-y-3">
                  {capacityEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {event.event_type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                        {event.notes && (
                          <div className="text-sm text-gray-500 mt-1">
                            {event.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        {event.old_capacity && event.new_capacity && (
                          <div>
                            {event.old_capacity} → {event.new_capacity}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent capacity events
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
