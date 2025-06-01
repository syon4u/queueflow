
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AppointmentFormData {
  customerId: string;
  serviceId: string;
  locationId: string;
  scheduledDate?: Date;
  scheduledTime: string;
  reasonForVisit: string;
  notes: string;
}

export const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerSearch, setCustomerSearch] = useState('');
  const [formData, setFormData] = useState<AppointmentFormData>({
    customerId: '',
    serviceId: '',
    locationId: '',
    scheduledTime: '',
    reasonForVisit: '',
    notes: ''
  });

  // Fetch customers for search
  const { data: customers } = useQuery({
    queryKey: ['customers', customerSearch],
    queryFn: async () => {
      if (!customerSearch || customerSearch.length < 2) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`first_name.ilike.%${customerSearch}%,last_name.ilike.%${customerSearch}%,email.ilike.%${customerSearch}%`)
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: customerSearch.length >= 2
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      if (!data.scheduledDate || !data.scheduledTime) {
        throw new Error('Date and time are required');
      }

      const scheduledDateTime = new Date(data.scheduledDate);
      const [hours, minutes] = data.scheduledTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('appointments')
        .insert({
          customer_id: data.customerId,
          service_id: data.serviceId,
          location_id: data.locationId,
          scheduled_time: scheduledDateTime.toISOString(),
          reason_for_visit: data.reasonForVisit || null,
          notes: data.notes || null,
          status: 'scheduled'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: t('common.success'),
        description: t('appointments.created'),
      });
      onOpenChange(false);
      setFormData({
        customerId: '',
        serviceId: '',
        locationId: '',
        scheduledTime: '',
        reasonForVisit: '',
        notes: ''
      });
      setCustomerSearch('');
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('appointments.createError'),
        variant: 'destructive',
      });
      console.error('Error creating appointment:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const selectedCustomer = customers?.find(c => c.id === formData.customerId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('appointments.createNew')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Search */}
          <div className="space-y-2">
            <Label htmlFor="customer-search">{t('appointments.customer')}</Label>
            <Input
              id="customer-search"
              placeholder={t('appointments.searchCustomer')}
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
            {customers && customers.length > 0 && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={cn(
                      "p-2 cursor-pointer hover:bg-muted",
                      formData.customerId === customer.id && "bg-muted"
                    )}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, customerId: customer.id }));
                      setCustomerSearch(`${customer.first_name} ${customer.last_name}`);
                    }}
                  >
                    <div className="font-medium">{customer.first_name} {customer.last_name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedCustomer && (
              <div className="p-2 bg-muted rounded-md">
                <div className="font-medium">{selectedCustomer.first_name} {selectedCustomer.last_name}</div>
                <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">{t('appointments.service')}</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('appointments.selectService')} />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <Label htmlFor="location">{t('appointments.location')}</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('appointments.selectLocation')} />
              </SelectTrigger>
              <SelectContent>
                {locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>{t('appointments.date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : t('appointments.selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.scheduledDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">{t('appointments.time')}</Label>
            <Input
              id="time"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
              required
            />
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label htmlFor="reason">{t('appointments.reasonForVisit')}</Label>
            <Input
              id="reason"
              value={formData.reasonForVisit}
              onChange={(e) => setFormData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
              placeholder={t('appointments.reasonPlaceholder')}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('appointments.notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={t('appointments.notesPlaceholder')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || !formData.customerId || !formData.serviceId || !formData.locationId || !formData.scheduledDate || !formData.scheduledTime}
            >
              {createMutation.isPending ? t('common.creating') : t('appointments.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
