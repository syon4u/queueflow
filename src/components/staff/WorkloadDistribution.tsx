
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  User,
  Calendar
} from 'lucide-react';
import { useWorkloadDistribution } from '@/hooks/use-workload-distribution';

export const WorkloadDistribution: React.FC = () => {
  const { t } = useTranslation();
  const {
    workloadData,
    isLoading,
    assignCustomer,
    balanceWorkload,
    refreshWorkload
  } = useWorkloadDistribution();

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 50) return 'text-green-600';
    if (utilization <= 75) return 'text-yellow-600';
    if (utilization <= 90) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'break': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'break': return 'On Break';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const handleAssignCustomer = async () => {
    if (selectedCustomer && selectedStaff) {
      const success = await assignCustomer(selectedCustomer, selectedStaff);
      if (success) {
        setSelectedCustomer('');
        setSelectedStaff('');
      }
    }
  };

  const averageUtilization = workloadData.length > 0
    ? Math.round(workloadData.reduce((acc, staff) => acc + staff.utilization, 0) / workloadData.length)
    : 0;

  const overloadedStaff = workloadData.filter(staff => staff.utilization > 80).length;
  const availableStaff = workloadData.filter(staff => staff.status === 'available').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Available Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableStaff}</div>
            <p className="text-xs text-muted-foreground">out of {workloadData.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(averageUtilization)}`}>
              {averageUtilization}%
            </div>
            <Progress value={averageUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Overloaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overloadedStaff}</div>
            <p className="text-xs text-muted-foreground">staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={balanceWorkload} 
              size="sm" 
              className="w-full"
              disabled={isLoading}
            >
              Balance Workload
            </Button>
            <Button 
              onClick={refreshWorkload} 
              size="sm" 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Manual Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Customer Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="workload-customer" className="text-sm font-medium">Customer</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger id="workload-customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-1">John Doe</SelectItem>
                  <SelectItem value="customer-2">Jane Smith</SelectItem>
                  <SelectItem value="customer-3">Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="workload-staff" className="text-sm font-medium">Assign to Staff</label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger id="workload-staff">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {workloadData
                    .filter(staff => staff.status === 'available')
                    .map((staff) => (
                      <SelectItem key={staff.staffId} value={staff.staffId}>
                        {staff.name} ({staff.currentLoad}/{staff.capacity})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAssignCustomer}
                disabled={!selectedCustomer || !selectedStaff || isLoading}
                className="w-full"
              >
                Assign Customer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Workload Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Workload Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workloadData.map((staff) => (
              <div key={staff.staffId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(staff.status)}`}></div>
                    <div>
                      <h4 className="font-medium">{staff.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(staff.status)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getUtilizationColor(staff.utilization)}`}>
                      {staff.utilization}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {staff.currentLoad}/{staff.capacity} capacity
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Progress value={staff.utilization} className="mb-2" />
                    <p className="text-xs text-muted-foreground">Utilization</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Current Load: {staff.currentLoad}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Next: {staff.nextAvailable ? 
                        staff.nextAvailable.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'Available now'
                      }
                    </span>
                  </div>
                </div>

                {staff.specialties.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {staff.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {workloadData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No staff data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
