
import React from 'react';
import { useLocations } from '@/hooks/appointment-form/useLocations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const { locations, isLoading, error } = useLocations();

  console.log('LocationSelector - Component state:', {
    locationsCount: locations?.length || 0,
    isLoading,
    error,
    currentValue: value
  });

  if (isLoading) {
    return (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Loading locations..." />
            </SelectTrigger>
          </Select>
        </FormControl>
      </FormItem>
    );
  }

  if (error) {
    console.error('LocationSelector - Error state:', error);
    return (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Error loading locations" />
            </SelectTrigger>
          </Select>
        </FormControl>
        <FormMessage>Unable to load locations: {error}</FormMessage>
      </FormItem>
    );
  }

  if (!locations || locations.length === 0) {
    console.warn('LocationSelector - No locations available');
    return (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="No locations available" />
            </SelectTrigger>
          </Select>
        </FormControl>
        <FormMessage>No locations are currently available</FormMessage>
      </FormItem>
    );
  }

  return (
    <FormItem>
      <FormLabel>Location</FormLabel>
      <FormControl>
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default LocationSelector;
