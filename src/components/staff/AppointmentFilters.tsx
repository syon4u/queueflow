
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon, Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface AppointmentFiltersProps {
  onFiltersChange: (filters: AppointmentFilterOptions) => void;
}

export interface AppointmentFilterOptions {
  status?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  customerName?: string;
  service?: string;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({ onFiltersChange }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<AppointmentFilterOptions>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof AppointmentFilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof AppointmentFilterOptions] !== undefined && 
    filters[key as keyof AppointmentFilterOptions] !== ''
  );

  // Get the current status value, ensuring it's never an empty string
  const getCurrentStatusValue = () => {
    const status = filters.status;
    if (!status || status === '') {
      return 'all';
    }
    return status;
  };

  console.log('AppointmentFilters - Current filters:', filters);
  console.log('AppointmentFilters - Current status value:', getCurrentStatusValue());

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {t('appointments.filters')}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 p-0"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">{t('appointments.status')}</Label>
              <Select
                value={getCurrentStatusValue()}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder={t('appointments.allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('appointments.allStatuses')}</SelectItem>
                  <SelectItem value="scheduled">{t('appointments.scheduled')}</SelectItem>
                  <SelectItem value="checked_in">{t('appointments.checkedIn')}</SelectItem>
                  <SelectItem value="in_progress">{t('appointments.inProgress')}</SelectItem>
                  <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('appointments.cancelled')}</SelectItem>
                  <SelectItem value="no_show">{t('appointments.noShow')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer Name Filter */}
            <div className="space-y-2">
              <Label htmlFor="customer-filter">{t('appointments.customer')}</Label>
              <Input
                id="customer-filter"
                placeholder={t('appointments.searchCustomer')}
                value={filters.customerName || ''}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
              />
            </div>

            {/* Service Filter */}
            <div className="space-y-2">
              <Label htmlFor="service-filter">{t('appointments.service')}</Label>
              <Input
                id="service-filter"
                placeholder={t('appointments.searchService')}
                value={filters.service || ''}
                onChange={(e) => handleFilterChange('service', e.target.value)}
              />
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>{t('appointments.dateRange')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                          {format(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{t('appointments.pickDateRange')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => handleFilterChange('dateRange', range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-3 w-3" />
                {t('common.clearFilters')}
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
