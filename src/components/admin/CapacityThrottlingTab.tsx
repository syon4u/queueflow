import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCapacityThrottling } from '@/hooks/use-capacity-throttling';
import { 
  Gauge, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Users,
  Activity,
  Zap,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, addHours } from 'date-fns';

export const CapacityThrottlingTab: React.FC = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [newRule, setNewRule] = useState({
    day_of_week: 1,
    hour_of_day: 9,
    max_capacity: 50,
    throttle_threshold: 80,
    waitlist_enabled: true,
    dynamic_adjustment: true
  });

  const {
    throttlingRules,
    rulesLoading,
    throttlingStatus,
    statusLoading,
    predictions,
    throttlingActive,
    createThrottlingRule,
    creatingRule,
    applyDynamicAdjustment,
    applyingAdjustment,
    toggleThrottling,
    togglingThrottling
  } = useCapacityThrottling(selectedLocationId, selectedServiceId);

  // Fetch locations
  const { data: locations } = useQuery({
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

  // Fetch services for selected location
  const { data: services } = useQuery({
    queryKey: ['services', selectedLocationId],
    queryFn: async () => {
      if (!selectedLocationId) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('location_id', selectedLocationId)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedLocationId
  });

  const handleCreateRule = () => {
    if (!selectedLocationId) return;
    
    createThrottlingRule({
      location_id: selectedLocationId,
      service_id: selectedServiceId || undefined,
      ...newRule
    });
  };

  const getDayName = (dayNum: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  const getThrottleStatusColor = () => {
    if (!throttlingStatus) return 'secondary';
    if (throttlingStatus.is_throttled) return 'destructive';
    if ((throttlingStatus.current_capacity / throttlingStatus.max_capacity) > 0.7) return 'default';
    return 'secondary';
  };

  // Prepare chart data for predictions
  const predictionChartData = predictions?.slice(0, 12).map(p => ({
    time: format(new Date(p.time_slot), 'HH:mm'),
    demand: p.predicted_demand,
    capacity: p.recommended_capacity,
    confidence: p.confidence_score
  })) || [];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Capacity Throttling Engine</h2>
        <p className="text-gray-600">
          Intelligent capacity management with auto-throttling, predictive adjustments, and waitlist integration.
        </p>
      </div>

      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
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
            
            <div>
              <Label htmlFor="service">Service (Optional)</Label>
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All services</SelectItem>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="throttling-active"
                  checked={throttlingActive}
                  onCheckedChange={toggleThrottling}
                  disabled={togglingThrottling || !selectedLocationId}
                />
                <Label htmlFor="throttling-active">Enable Throttling</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLocationId && (
        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Status
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusLoading ? (
                  <div className="text-center py-4">Loading status...</div>
                ) : throttlingStatus ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{throttlingStatus.current_capacity}</div>
                      <div className="text-sm text-gray-600">Current Capacity</div>
                      <Badge variant={getThrottleStatusColor()} className="mt-2">
                        {throttlingStatus.is_throttled ? 'Throttled' : 'Active'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{throttlingStatus.max_capacity}</div>
                      <div className="text-sm text-gray-600">Max Capacity</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {throttlingStatus.throttle_threshold}% threshold
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{throttlingStatus.waitlist_count}</div>
                      <div className="text-sm text-gray-600">In Waitlist</div>
                      <div className="text-xs text-gray-500 mt-1">
                        ~{throttlingStatus.estimated_wait_time}min wait
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round((throttlingStatus.current_capacity / throttlingStatus.max_capacity) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Utilization</div>
                      {throttlingStatus.throttle_reason && (
                        <div className="text-xs text-amber-600 mt-1">
                          {throttlingStatus.throttle_reason}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No status data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            {/* Create New Rule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Create Throttling Rule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <Label>Day of Week</Label>
                    <Select 
                      value={newRule.day_of_week.toString()} 
                      onValueChange={(v) => setNewRule({...newRule, day_of_week: parseInt(v)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0,1,2,3,4,5,6].map(day => (
                          <SelectItem key={day} value={day.toString()}>
                            {getDayName(day)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Hour</Label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={newRule.hour_of_day}
                      onChange={(e) => setNewRule({...newRule, hour_of_day: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label>Max Capacity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newRule.max_capacity}
                      onChange={(e) => setNewRule({...newRule, max_capacity: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label>Throttle %</Label>
                    <Input
                      type="number"
                      min="50"
                      max="100"
                      value={newRule.throttle_threshold}
                      onChange={(e) => setNewRule({...newRule, throttle_threshold: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newRule.waitlist_enabled}
                      onCheckedChange={(checked) => setNewRule({...newRule, waitlist_enabled: checked})}
                    />
                    <Label>Waitlist</Label>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleCreateRule} 
                      disabled={creatingRule}
                      className="w-full"
                    >
                      {creatingRule ? 'Creating...' : 'Create Rule'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Active Rules</CardTitle>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <div className="text-center py-4">Loading rules...</div>
                ) : throttlingRules && throttlingRules.length > 0 ? (
                  <div className="space-y-3">
                    {throttlingRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {getDayName(rule.day_of_week)} at {rule.hour_of_day}:00
                          </div>
                          <div className="text-sm text-gray-600">
                            Max: {rule.max_capacity} | Throttle: {rule.throttle_threshold}%
                            {rule.waitlist_enabled && ' | Waitlist enabled'}
                            {rule.dynamic_adjustment && ' | Dynamic adjustment'}
                          </div>
                        </div>
                        <Badge variant={rule.is_active ? 'secondary' : 'outline'}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No throttling rules configured
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            {/* Capacity Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Demand Predictions (Next 12 Hours)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions && predictions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={predictionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="demand" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Predicted Demand"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="capacity" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Recommended Capacity"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No prediction data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prediction Details */}
            {predictions && predictions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.slice(0, 6).map((prediction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {format(new Date(prediction.time_slot), 'MMM dd, HH:mm')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {prediction.adjustment_reason}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            Demand: {prediction.predicted_demand} | Capacity: {prediction.recommended_capacity}
                          </div>
                          <Badge variant="outline">
                            {prediction.confidence_score}% confidence
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            onClick={() => applyDynamicAdjustment({ prediction })}
                            disabled={applyingAdjustment}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Advanced analytics will be integrated with existing analytics components</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
