
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAppointments, Appointment } from '@/hooks/use-appointments';
import StaffAppointmentTable from '@/components/StaffAppointmentTable';

const StaffPage = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { appointments, loading } = useAppointments(undefined, refreshTrigger);
  
  // Filter to only show active appointments (not completed or cancelled)
  const activeAppointments = appointments.filter(
    (appointment) => !['completed', 'cancelled', 'no_show'].includes(appointment.status)
  );
  
  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
    // Refresh will happen automatically due to the dependency in useAppointments
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Appointments</h2>
          <p className="text-sm text-muted-foreground">
            Logged in as: {user?.email} (Role: {role})
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <StaffAppointmentTable 
            appointments={activeAppointments} 
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
      
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        {role === 'admin' && (
          <Button asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffPage;
