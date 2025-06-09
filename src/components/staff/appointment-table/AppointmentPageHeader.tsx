
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Filter } from 'lucide-react';

interface AppointmentPageHeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
  onCreateAppointment: () => void;
}

export const AppointmentPageHeader: React.FC<AppointmentPageHeaderProps> = ({
  showFilters,
  onToggleFilters,
  onRefresh,
  onCreateAppointment
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
          <p className="text-gray-600">
            Manage and track all appointments across your locations
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onToggleFilters} variant="outline" size="sm" className="bg-white">
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button onClick={onRefresh} variant="outline" size="sm" className="bg-white">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={onCreateAppointment} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};
