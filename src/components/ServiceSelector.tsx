
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  locationId?: string;
}

const ServiceSelector = ({ value, onChange, locationId }: ServiceSelectorProps) => {
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services', locationId],
    queryFn: async () => {
      console.log('ServiceSelector - Fetching services for location:', locationId);
      
      if (!locationId) {
        console.log('ServiceSelector - No locationId provided, returning empty array');
        return [];
      }
      
      let query = supabase
        .from('services')
        .select('id, name, duration, description, is_active')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .order('name');
      
      const { data, error } = await query;
      
      console.log('ServiceSelector - Raw response:', { data, error });
      
      if (error) {
        console.error('ServiceSelector - Error fetching services:', error);
        throw error;
      }
      
      // Filter out any services with empty or invalid IDs
      const validServices = (data || []).filter(service => 
        service.id && 
        service.id.trim() !== '' && 
        service.name && 
        service.name.trim() !== ''
      );
      
      console.log('ServiceSelector - Valid services:', validServices);
      
      return validServices;
    },
    enabled: !!locationId, // Only run when locationId is available
    retry: 2,
    retryDelay: 1000,
  });

  console.log('ServiceSelector - Component state:', {
    value,
    locationId,
    servicesCount: services?.length || 0,
    isLoading,
    error: error?.message
  });

  // Show error state
  if (error) {
    return (
      <FormItem>
        <FormLabel>Service</FormLabel>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading services: {error.message}
          </AlertDescription>
        </Alert>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <FormItem>
      <FormLabel>Service *</FormLabel>
      <FormControl>
        <Select 
          value={value || ''} 
          onValueChange={onChange} 
          disabled={isLoading || !locationId}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !locationId 
                  ? "Select a location first"
                  : isLoading 
                    ? "Loading services..."
                    : services && services.length === 0
                      ? "No services available"
                      : "Select a service"
              } 
            />
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {services && services.length > 0 ? (
              services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex flex-col">
                    <span>{service.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {service.duration} min
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              !isLoading && locationId && (
                <SelectItem value="" disabled>
                  No services available for this location
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
          <strong>ServiceSelector Debug:</strong><br />
          Location ID: {locationId || 'None'}<br />
          Current Value: {value || 'None'}<br />
          Services Count: {services?.length || 0}<br />
          Loading: {isLoading ? 'Yes' : 'No'}<br />
          Error: {error?.message || 'None'}
        </div>
      )}
    </FormItem>
  );
};

export default ServiceSelector;
