
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import type { Appointment } from '@/hooks/use-appointments';

interface CustomerHistoryModalProps {
  trigger?: React.ReactNode;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({ trigger }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Search for customers based on query
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setCustomers([]);
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .limit(10);
      
      if (error) throw error;
      
      setCustomers(data || []);
    } catch (error) {
      console.error('Error searching for customers:', error);
      toast({
        title: t('common.error'),
        description: t('customer.searchError'),
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Load customer appointment history
  const loadCustomerHistory = async (customerId: string) => {
    setIsLoadingHistory(true);
    setAppointments([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-history', {
        method: 'POST',
        body: JSON.stringify({ customerId }),
      });
      
      if (error) throw error;
      
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading customer history:', error);
      toast({
        title: t('common.error'),
        description: t('customer.historyError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  // Select customer and load their history
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    loadCustomerHistory(customer.id);
  };
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setCustomers([]);
      setSelectedCustomer(null);
      setAppointments([]);
    }
  }, [open]);
  
  // Format appointment status for display
  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'checked_in': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': 
      case 'no_show': 
        return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          {t('customer.viewHistory')}
        </Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('customer.history')}</DialogTitle>
          <DialogDescription>
            {t('customer.historyDescription')}
          </DialogDescription>
        </DialogHeader>
        
        {/* Customer search section */}
        {!selectedCustomer && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                placeholder={t('customer.searchPlaceholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? t('common.searching') : t('common.search')}
              </Button>
            </div>
            
            {/* Search results */}
            {isSearching ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : customers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('customer.name')}</TableHead>
                    <TableHead>{t('customer.contact')}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell>
                        {customer.email || customer.phone || t('common.notAvailable')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          {t('common.select')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : searchQuery && (
              <p className="text-center text-muted-foreground py-4">
                {t('customer.noResults')}
              </p>
            )}
          </div>
        )}
        
        {/* Customer history section */}
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCustomer.email || selectedCustomer.phone || t('common.notAvailable')}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCustomer(null)}
              >
                {t('common.back')}
              </Button>
            </div>
            
            {/* Appointment history */}
            {isLoadingHistory ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : appointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('appointments.date')}</TableHead>
                    <TableHead>{t('appointments.service')}</TableHead>
                    <TableHead>{t('appointments.status')}</TableHead>
                    <TableHead>{t('appointments.notes')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {format(new Date(appointment.scheduled_time), 'PPp')}
                      </TableCell>
                      <TableCell>
                        {appointment.service_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(appointment.status)}>
                          {t(`appointments.status.${appointment.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {appointment.notes || appointment.reason_for_visit || t('common.notAvailable')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {t('customer.noAppointmentHistory')}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerHistoryModal;
