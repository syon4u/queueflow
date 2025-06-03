import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Building2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const DashboardTab: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch real stats data - Updated to use profiles instead of staff
  const { data: staffCount = 0 } = useQuery({
    queryKey: ['dashboard-staff-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['staff', 'admin']);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: locationsCount = 0 } = useQuery({
    queryKey: ['dashboard-locations-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: appointmentsToday = 0 } = useQuery({
    queryKey: ['dashboard-appointments-today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_time', `${today}T00:00:00`)
        .lt('scheduled_time', `${today}T23:59:59`);
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: servicesOffered = 0 } = useQuery({
    queryKey: ['dashboard-services-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  // Debug logging
  console.log('DashboardTab - Real data:', {
    staffCount,
    locationsCount,
    appointmentsToday,
    servicesOffered
  });
  
  // Handler functions for quick access buttons
  const handleViewSchedule = () => {
    navigate('/admin?tab=queue');
    toast({
      title: "Schedule View",
      description: "Navigating to queue management",
    });
  };
  
  const handleManageStaff = () => {
    navigate('/admin?tab=staff');
    toast({
      title: "Staff Management",
      description: "Navigating to staff management",
    });
  };
  
  const handleAddLocation = () => {
    navigate('/admin?tab=locations');
    toast({
      title: "Location Management",
      description: "Navigating to location management",
    });
  };
  
  const handleAddService = () => {
    navigate('/admin?tab=services');
    toast({
      title: "Service Management",
      description: "Navigating to service management",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffCount}</div>
            <p className="text-xs text-muted-foreground">Total personnel</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationsCount}</div>
            <p className="text-xs text-muted-foreground">Service centers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesOffered}</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center border-b border-border pb-2">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">New appointment scheduled</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col justify-center"
                onClick={handleViewSchedule}
              >
                <Calendar className="h-8 w-8 mb-1" />
                <span>View Schedule</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col justify-center"
                onClick={handleManageStaff}
              >
                <Users className="h-8 w-8 mb-1" />
                <span>Manage Staff</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col justify-center"
                onClick={handleAddLocation}
              >
                <Building2 className="h-8 w-8 mb-1" />
                <span>Add Location</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col justify-center"
                onClick={handleAddService}
              >
                <FileText className="h-8 w-8 mb-1" />
                <span>Add Service</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
