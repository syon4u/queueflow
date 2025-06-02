
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/context/QueueContext';

export const QueueManagementTab: React.FC = () => {
  const {
    customers,
    currentCustomer,
    stats,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    resetQueue,
    isLoading
  } = useQueue();

  // Debug logging for Admin QueueManagementTab
  console.log('Admin QueueManagementTab - customers:', customers);
  console.log('Admin QueueManagementTab - stats:', stats);
  console.log('Admin QueueManagementTab - stats.waitingCustomers:', stats.waitingCustomers);
  console.log('Admin QueueManagementTab - currentCustomer:', currentCustomer);
  console.log('Admin QueueManagementTab - customers.length:', customers.length);
  console.log('Admin QueueManagementTab - waiting customers count:', customers.filter(c => c.status === 'waiting').length);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Queue Management</h1>
      
      {/* Current Customer Being Served */}
      {currentCustomer && (
        <Card className="mb-6 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Now Serving
              <Badge className="bg-green-600 text-white">ACTIVE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentCustomer.name}</h3>
                <p className="text-sm text-gray-600">{currentCustomer.service}</p>
                {currentCustomer.phone && (
                  <p className="text-sm text-gray-600">{currentCustomer.phone}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={markAsNoShow} 
                  variant="outline" 
                  className="border-red-300 hover:bg-red-50 text-red-700"
                  disabled={isLoading}
                >
                  Mark as No-Show
                </Button>
                <Button 
                  onClick={markAsServed} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  Mark as Served
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.servedCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.noShowCustomers}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          onClick={callNextCustomer} 
          disabled={isLoading || !!currentCustomer}
        >
          {isLoading ? 'Calling...' : 'Call Next'}
        </Button>
        <Button 
          onClick={resetQueue} 
          variant="destructive"
        >
          Reset Queue
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waited</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map(customer => (
                  <TableRow key={customer.id} className={customer.status === 'serving' ? 'bg-green-50' : ''}>
                    <TableCell className={customer.status === 'serving' ? 'font-bold' : ''}>{customer.name}</TableCell>
                    <TableCell>{customer.service || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === 'serving' ? 'default' : 'outline'}
                        className={customer.status === 'serving' ? 'bg-green-600' : ''}
                      >
                        {customer.status === 'serving' ? 'Now Serving' : customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {Math.floor((new Date().getTime() - new Date(customer.joinedAt).getTime()) / 60000)}{' '}
                      min
                    </TableCell>
                    <TableCell>
                      <span className={customer.priority === 'priority' ? 'text-red-500 font-bold' : ''}>
                        {customer.priority}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Queue is empty</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
