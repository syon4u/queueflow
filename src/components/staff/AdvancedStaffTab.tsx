
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

    if (filters.customerName) {
      const searchTerm = filters.customerName.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.customer_name?.toLowerCase().includes(searchTerm) ||
        apt.customers?.first_name?.toLowerCase().includes(searchTerm) ||
        apt.customers?.last_name?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.service) {
      const searchTerm = filters.service.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.service_name?.toLowerCase().includes(searchTerm) ||
        apt.services?.name?.toLowerCase().includes(searchTerm)
      );
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
        <h2 className="text-2xl font-bold mb-2">{t('staff.advancedTools')}</h2>
        <p className="text-muted-foreground">
          {t('staff.advancedToolsDescription')}
        </p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('staff.appointments')}
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('staff.customers')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('staff.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{statsData.total}</div>
                <p className="text-xs text-muted-foreground">{t('appointments.total')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{statsData.scheduled}</div>
                <p className="text-xs text-muted-foreground">{t('appointments.scheduled')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{statsData.inProgress}</div>
                <p className="text-xs text-muted-foreground">{t('appointments.inProgress')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{statsData.completed}</div>
                <p className="text-xs text-muted-foreground">{t('appointments.completed')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{statsData.cancelled}</div>
                <p className="text-xs text-muted-foreground">{t('appointments.cancelled')}</p>
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
                {t('appointments.filteredResults')} ({filteredAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-label={t('common.loading')}></div>
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

        <TabsContent value="customers">
          <CustomerSearchTab />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.analyticsOverview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('staff.analyticsComingSoon')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
