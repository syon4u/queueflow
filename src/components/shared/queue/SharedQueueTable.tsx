
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/context/QueueContext';
import { Clock, Users } from 'lucide-react';

interface SharedQueueTableProps {
  variant?: 'staff' | 'admin';
  showAllStatuses?: boolean;
}

export const SharedQueueTable: React.FC<SharedQueueTableProps> = ({ 
  variant = 'staff',
  showAllStatuses = false 
}) => {
  const { customers } = useQueue();

  // Filter customers based on variant and showAllStatuses
  const displayCustomers = showAllStatuses 
    ? customers 
    : customers.filter(c => c.status === 'waiting' || c.status === 'serving');

  const getStatusBadge = (status: string, isCurrentlyServing: boolean) => {
    if (isCurrentlyServing) {
      return (
        <Badge className="bg-green-600 text-white">
          Now Serving
        </Badge>
      );
    }

    const statusConfig = {
      waiting: { variant: 'outline' as const, className: 'bg-orange-100 text-orange-700 border-orange-200' },
      serving: { variant: 'default' as const, className: 'bg-green-600 text-white' },
      served: { variant: 'outline' as const, className: 'bg-blue-100 text-blue-700 border-blue-200' },
      no_show: { variant: 'outline' as const, className: 'bg-red-100 text-red-700 border-red-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting;
    const displayText = status === 'serving' ? 'Being Served' : 
                       status === 'waiting' ? 'Waiting' :
                       status === 'served' ? 'Completed' :
                       status === 'no_show' ? 'No-Show' : status;

    return (
      <Badge variant={config.variant} className={config.className}>
        {displayText}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {variant === 'admin' ? 'Queue Overview' : 'Current Queue'}
          {variant === 'admin' && (
            <Badge variant="outline" className="ml-2">Admin View</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayCustomers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Wait Time</TableHead>
                {variant === 'admin' && <TableHead>Priority</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCustomers.map(customer => {
                const isCurrentlyServing = customer.status === 'serving';
                const waitTime = Math.floor((new Date().getTime() - customer.joinedAt.getTime()) / 60000);
                
                return (
                  <TableRow 
                    key={customer.id} 
                    className={isCurrentlyServing ? 'bg-green-50 border-green-200' : ''}
                  >
                    <TableCell className={isCurrentlyServing ? 'font-bold text-green-900' : 'font-medium'}>
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {customer.service || 'General Service'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.status, isCurrentlyServing)}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {waitTime} min
                    </TableCell>
                    {variant === 'admin' && (
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={customer.priority === 'priority' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-600'}
                        >
                          {customer.priority === 'priority' ? 'High Priority' : 'Standard'}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showAllStatuses ? 'No Queue Activity' : 'Queue is Empty'}
            </h3>
            <p className="text-gray-500">
              {showAllStatuses ? 'No customers in the system' : 'No customers are currently waiting'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
