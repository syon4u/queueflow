
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Settings, Filter } from 'lucide-react';

interface CustomerSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedService: string;
  onServiceChange: (value: string) => void;
  locations: Array<{ id: string; name: string }>;
  services: Array<{ id: string; name: string }>;
  totalCustomers: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const CustomerSearchFilters: React.FC<CustomerSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  selectedService,
  onServiceChange,
  locations,
  services,
  totalCustomers,
  filteredCount,
  onClearFilters
}) => {
  const hasActiveFilters = selectedLocation !== 'all' || selectedService !== 'all';

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900">Search & Filter</span>
        </div>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or confirmation number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <label htmlFor="customer-search-location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </label>
              <Select value={selectedLocation} onValueChange={onLocationChange}>
                <SelectTrigger id="customer-search-location" className="bg-white">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md z-50">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Filter */}
            <div className="space-y-2">
              <label htmlFor="customer-search-service" className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Service
              </label>
              <Select value={selectedService} onValueChange={onServiceChange}>
                <SelectTrigger id="customer-search-service" className="bg-white">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md z-50">
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-transparent">Clear</span>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="text-sm text-muted-foreground pt-2 border-t">
            Showing {filteredCount} of {totalCustomers} customers
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
