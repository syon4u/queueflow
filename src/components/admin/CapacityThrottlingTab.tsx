import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, Edit, Activity, Clock, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCapacityThrottling } from '@/hooks/use-capacity-throttling';
import { Separator } from "@/components/ui/separator"

interface ThrottlingRule {
  id: string;
  location_id: string;
  service_id?: string;
  day_of_week: number;
  hour_of_day: number;
  max_capacity: number;
  throttle_threshold: number; // Percentage at which to start throttling
  waitlist_enabled: boolean;
  dynamic_adjustment: boolean;
  is_active: boolean;
  staff_multiplier: number;
  created_at: string;
  updated_at: string;
}

interface CapacityPrediction {
  time_slot: string;
  predicted_demand: number;
  recommended_capacity: number;
  confidence_score: number;
  adjustment_reason: string;
}

export const CapacityThrottlingTab: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  // Get locations
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

  // Get services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const {
    throttlingRules,
    rulesLoading,
    throttlingStatus,
    statusLoading,
    predictions,
    createThrottlingRule,
    creatingRule,
    applyDynamicAdjustment,
    applyingAdjustment,
    toggleThrottling,
    togglingThrottling
  } = useCapacityThrottling(selectedLocation, selectedService);

  const handleCreateRule = (values: any) => {
    createThrottlingRule({
      location_id: selectedLocation,
      service_id: selectedService || undefined,
      day_of_week: parseInt(values.dayOfWeek),
      hour_of_day: parseInt(values.hourOfDay),
      max_capacity: parseInt(values.maxCapacity),
      throttle_threshold: parseInt(values.throttleThreshold),
      waitlist_enabled: values.waitlistEnabled,
      dynamic_adjustment: values.dynamicAdjustment,
      is_active: true,
      staff_multiplier: 1.0
    });
    setShowRuleDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Capacity Throttling</h2>
        <p className="text-gray-600">
          Manage capacity throttling rules to automatically adjust maximum capacity based on time of day,
          service demand, and other factors.
        </p>
      </div>

      {/* Location and Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Select onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locationsLoading ? (
                <SelectItem value="">Loading...</SelectItem>
              ) : locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="service">Service (Optional)</Label>
          <Select onValueChange={setSelectedService}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a service (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Services</SelectItem>
              {servicesLoading ? (
                <SelectItem value="">Loading...</SelectItem>
              ) : services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Status */}
      {throttlingStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Current Throttling Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-600">Current Capacity</p>
                  <p className="text-lg font-semibold">
                    {throttlingStatus.current_capacity}/{throttlingStatus.max_capacity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-600">Estimated Wait</p>
                  <p className="text-lg font-semibold">{throttlingStatus.estimated_wait_time} min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-600">Waitlist Count</p>
                  <p className="text-lg font-semibold">{throttlingStatus.waitlist_count}</p>
                </div>
              </div>
            </div>
            {throttlingStatus.is_throttled && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Throttling Active</span>
                </div>
                <p className="text-yellow-700 mt-1">{throttlingStatus.throttle_reason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Throttling Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Throttling Rules</CardTitle>
            <Button onClick={() => setShowRuleDialog(true)} disabled={!selectedLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rulesLoading ? (
            <div className="text-center py-4">Loading rules...</div>
          ) : throttlingRules && throttlingRules.length > 0 ? (
            <div className="space-y-4">
              {throttlingRules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {getDayName(rule.day_of_week)} at {rule.hour_of_day}:00
                      </h4>
                      <p className="text-sm text-gray-600">
                        Max Capacity: {rule.max_capacity} | 
                        Threshold: {rule.throttle_threshold || 80}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRule(rule);
                          setShowRuleDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No throttling rules configured. Create your first rule to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capacity Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Predictions (Next 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          {predictions && predictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map((prediction) => (
                <div key={prediction.time_slot} className="border rounded-lg p-3">
                  <h4 className="font-medium">{new Date(prediction.time_slot).toLocaleString()}</h4>
                  <p className="text-sm text-gray-600">
                    Predicted Demand: {prediction.predicted_demand}
                  </p>
                  <p className="text-sm text-gray-600">
                    Recommended Capacity: {prediction.recommended_capacity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {prediction.adjustment_reason} (Confidence: {prediction.confidence_score}%)
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => applyDynamicAdjustment({ prediction })}
                    disabled={applyingAdjustment}
                  >
                    Apply Adjustment
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No capacity predictions available.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rule Creation Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Throttling Rule' : 'Create Throttling Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule ? 'Modify the settings for the selected rule.' : 'Define a new rule to automatically adjust capacity.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dayOfWeek" className="text-right">
                Day of Week
              </Label>
              <Select defaultValue={editingRule?.day_of_week?.toString()} onValueChange={(value) => console.log('selected day', value)} >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {getDayName(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourOfDay" className="text-right">
                Hour of Day
              </Label>
              <Select defaultValue={editingRule?.hour_of_day?.toString()} onValueChange={(value) => console.log('selected hour', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxCapacity" className="text-right">
                Max Capacity
              </Label>
              <Input
                id="maxCapacity"
                defaultValue={editingRule?.max_capacity?.toString()}
                className="col-span-3"
                type="number"
                placeholder="Enter max capacity"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="throttleThreshold" className="text-right">
                Throttle Threshold (%)
              </Label>
              <Slider
                defaultValue={[editingRule?.throttle_threshold || 80]}
                max={100}
                step={10}
                className="col-span-3"
                onValueChange={(value) => console.log('selected threshold', value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="waitlistEnabled" className="text-right">
                Waitlist Enabled
              </Label>
              <Switch
                id="waitlistEnabled"
                defaultChecked={editingRule?.waitlist_enabled}
                onCheckedChange={(value) => console.log('waitlist enabled', value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dynamicAdjustment" className="text-right">
                Dynamic Adjustment
              </Label>
              <Switch
                id="dynamicAdjustment"
                defaultChecked={editingRule?.dynamic_adjustment}
                onCheckedChange={(value) => console.log('dynamic adjustment', value)}
              />
            </div>
          </div>
          <Button type="submit">
            {editingRule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function
const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};
