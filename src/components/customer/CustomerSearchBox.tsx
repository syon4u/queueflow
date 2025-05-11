
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}

type CustomerSearchBoxProps = {
  onSelectCustomer: (customer: Customer) => void;
  onCreateNew: () => void;
};

const CustomerSearchBox: React.FC<CustomerSearchBoxProps> = ({ onSelectCustomer, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // Search for customers by phone or email
      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name, phone, email')
        .or(`phone.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%`)
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      
      setSearchResults(data || []);
      if ((data || []).length === 0) {
        toast({
          description: t('customer.noResults')
        });
      }
    } catch (error) {
      console.error('Error searching for customers:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('customer.searchError')
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder={t('customer.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {t('common.search')}
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium">
            {t('customer.searchResults', { count: searchResults.length })}
          </div>
          <div className="divide-y">
            {searchResults.map((customer) => (
              <button
                key={customer.id}
                className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
                onClick={() => onSelectCustomer(customer)}
              >
                <div className="font-medium">{customer.first_name} {customer.last_name}</div>
                <div className="text-sm text-muted-foreground">
                  {customer.phone && <div>{customer.phone}</div>}
                  {customer.email && <div>{customer.email}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {t('customer.searchInstructions')}
        </div>
        <Button variant="outline" onClick={onCreateNew}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('customer.createNew')}
        </Button>
      </div>
    </div>
  );
};

export default CustomerSearchBox;
