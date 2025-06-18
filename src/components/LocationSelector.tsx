
import React from 'react';
import { useAppData } from '@/hooks/useAppData';
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
  availableLocationIds?: string[];
}

const LocationSelector = ({ value, onChange, availableLocationIds }: LocationSelectorProps) => {
  const { locations, isLoading, error } = useAppData();

  // Filter locations based on available location IDs from service selection
  const filteredLocations = React.useMemo(() => {
    if (!locations) return [];
    
    // If no service is selected or service selection doesn't limit locations, show all
    if (!availableLocationIds || availableLocationIds.length === 0) {
      return locations;
    }
    
    // Filter to only show locations that are available for the selected service
    return locations.filter(location => 
      availableLocationIds.includes(location.id)
    );
  }, [locations, availableLocationIds]);

  console.log('LocationSelector - Component state:', {
    locationsCount: filteredLocations?.length || 0,
    availableLocationIds,
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
        <FormMessage>Unable to load locations: {error.message}</FormMessage>
      </FormItem>
    );
  }

  if (!filteredLocations || filteredLocations.length === 0) {
    const message = availableLocationIds?.length === 0 
      ? "Select a service first" 
      : "No locations available for selected service";
    
    return (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={message} />
            </SelectTrigger>
          </Select>
        </FormControl>
        <FormMessage>{message}</FormMessage>
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
            {filteredLocations.map((location) => (
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
