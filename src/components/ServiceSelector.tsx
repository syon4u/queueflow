
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
}

const ServiceSelector = ({ value, onChange }: ServiceSelectorProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormItem>
      <FormLabel>Service</FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
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
