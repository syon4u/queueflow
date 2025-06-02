
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CustomerSearchBoxProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const CustomerSearchBox: React.FC<CustomerSearchBoxProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};
