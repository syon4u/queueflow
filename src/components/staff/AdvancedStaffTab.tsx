
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useAppointments } from '@/hooks/use-appointments';
import { AppointmentFilters, AppointmentFilterOptions } from './AppointmentFilters';
import StaffAppointmentTable from '@/components/StaffAppointmentTable';
import CustomerSearchTab from './CustomerSearchTab';
import { Search, Calendar, Users, BarChart3 } from 'lucide-react';

export const AdvancedStaffTab: React.FC = () => {
  const { t } = useTranslation();
  const { appointments, loading, refreshAppointments } = useAppointments();
  const [filters, setFilters] = useState<AppointmentFilterOptions>({});

  // Filter appointments based on current filters
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (filters.status) {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Note: For customer name filtering, we would need to fetch customer data
    // or have it joined in the appointments query. For now, skipping this filter
    // since the current Appointment type only has customer_id
    if (filters.customerName) {
      // This would require additional customer data lookup
      console.log('Customer name filtering not implemented - requires customer data join');
    }

    // Note: For service name filtering, we would need to fetch service data
    // or have it joined in the appointments query. For now, skipping this filter
    // since the current Appointment type only has service_id
    if (filters.service) {
      // This would require additional service data lookup
      console.log('Service name filtering not implemented - requires service data join');
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.scheduled_time);
        return aptDate >= filters.dateRange!.from && aptDate <= filters.dateRange!.to;
      });
    }

    return filtered;
  }, [appointments, filters]);

  const handleStatusChange = () => {
    refreshAppointments();
  };

  const statsData = useMemo(() => {
    const total = filteredAppointments.length;
    const scheduled = filteredAppointments.filter(apt => apt.status === 'scheduled').length;
    const inProgress = filteredAppointments.filter(apt => apt.status === 'in_progress').length;
    const completed = filteredAppointments.filter(apt => apt.status === 'completed').length;
    const cancelled = filteredAppointments.filter(apt => apt.status === 'cancelled').length;

    return { total, scheduled, inProgress, completed, cancelled };
  }, [filteredAppointments]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Tools</h2>
        <p className="text-muted-foreground">
          Advanced staff tools for appointment management, customer search, and detailed analytics
        </p>
      </div>

      <Tabs defaultValue="appointment-search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointment-search" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Appointment Search
          </TabsTrigger>
          <TabsTrigger value="customer-search" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customer Search
          </TabsTrigger>
          <TabsTrigger value="detailed-analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Detailed Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointment-search" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{statsData.total}</div>
                <p className="text-xs text-muted-foreground">Total Appointments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{statsData.scheduled}</div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{statsData.inProgress}</div>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{statsData.completed}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{statsData.cancelled}</div>
                <p className="text-xs text-muted-foreground">Cancelled</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <AppointmentFilters onFiltersChange={setFilters} />

          {/* Appointments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtered Results ({filteredAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-label="Loading"></div>
                </div>
              ) : (
                <StaffAppointmentTable 
                  appointments={filteredAppointments} 
                  onStatusChange={handleStatusChange}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer-search">
          <CustomerSearchTab />
        </TabsContent>

        <TabsContent value="detailed-analytics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced analytics features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
