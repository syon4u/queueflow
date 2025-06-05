
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface CustomerSearchHeaderProps {
  totalCustomers: number;
}

export const CustomerSearchHeader: React.FC<CustomerSearchHeaderProps> = ({
  totalCustomers
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Customer Management
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Search and manage customer records from appointment history
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            {totalCustomers} Total Customers
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};
