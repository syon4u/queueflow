
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

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  locationId?: string;
}

const ServiceSelector = ({ value, onChange, locationId }: ServiceSelectorProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services', locationId],
    queryFn: async () => {
      let query = supabase.from('services').select('id, name, duration, description');
      
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log('Fetched services:', data);
      
      // Return all valid services
      return data || [];
    },
    enabled: !!locationId, // Only run when locationId is available
  });

  return (
    <FormItem>
      <FormLabel>Service</FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onChange} disabled={isLoading || !locationId}>
          <SelectTrigger>
            <SelectValue placeholder={locationId ? "Select a service" : "Select a location first"} />
          </SelectTrigger>
          <SelectContent>
            {services?.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} ({service.duration} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ServiceSelector;
