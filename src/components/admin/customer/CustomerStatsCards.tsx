
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';

interface Customer {
  id: string;
  appointment_count?: number;
}

interface CustomerStatsCardsProps {
  customers: Customer[];
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({ customers }) => {
  const activeCustomersCount = customers.filter(c => c.appointment_count && c.appointment_count > 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Active Customers</p>
              <p className="text-2xl font-bold">{activeCustomersCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
