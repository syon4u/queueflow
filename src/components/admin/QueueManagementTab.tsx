
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/context/QueueContext';
import { Users, Clock, CheckCircle, XCircle, Phone, AlertCircle } from 'lucide-react';
import Breadcrumb from '@/components/navigation/Breadcrumb';

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
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'Queue Management', isActive: true }
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600 mt-1">Monitor and control active queues across all locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${
            stats.waitingCustomers > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {stats.waitingCustomers > 0 ? 'Queue Active' : 'Queue Empty'}
          </Badge>
        </div>
      </div>
      
      {/* Current Customer Being Served */}
      {currentCustomer && (
        <Card className="border-green-500 bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Users className="h-5 w-5" />
              Now Serving
              <Badge className="bg-green-600 text-white ml-2">ACTIVE</Badge>
            </CardTitle>
            <CardDescription className="text-green-700">
              Customer currently being assisted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-green-900">{currentCustomer.name}</h3>
                <p className="text-green-700 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentCustomer.service}
                </p>
                {currentCustomer.phone && (
                  <p className="text-green-600 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {currentCustomer.phone}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={markAsNoShow} 
                  variant="outline" 
                  className="border-red-300 hover:bg-red-50 text-red-700"
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as No-Show
                </Button>
                <Button 
                  onClick={markAsServed} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Served
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalCustomers}</div>
            <p className="text-xs text-blue-600 mt-1">All-time queue entries</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Currently Waiting</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.waitingCustomers}</div>
            <p className="text-xs text-orange-600 mt-1">In queue now</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Served Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.servedCustomers}</div>
            <p className="text-xs text-green-600 mt-1">Successfully completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">No-Shows</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.noShowCustomers}</div>
            <p className="text-xs text-red-600 mt-1">Missed appointments</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Control Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Queue Controls
          </CardTitle>
          <CardDescription>
            Manage queue operations and customer flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={callNextCustomer} 
              disabled={isLoading || !!currentCustomer || stats.waitingCustomers === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              {isLoading ? 'Calling...' : 'Call Next Customer'}
            </Button>
            <Button 
              onClick={resetQueue} 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Reset Queue
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Current Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Queue Status
          </CardTitle>
          <CardDescription>
            Real-time view of all customers in the queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Priority Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map(customer => (
                  <TableRow 
                    key={customer.id} 
                    className={customer.status === 'serving' ? 'bg-green-50 border-green-200' : ''}
                  >
                    <TableCell className={customer.status === 'serving' ? 'font-bold text-green-900' : 'font-medium'}>
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {customer.service || 'General Service'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === 'serving' ? 'default' : 'outline'}
                        className={
                          customer.status === 'serving' 
                            ? 'bg-green-600 text-white' 
                            : customer.status === 'waiting'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {customer.status === 'serving' ? 'Now Serving' : 
                         customer.status === 'waiting' ? 'Waiting' : customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {Math.floor((new Date().getTime() - new Date(customer.joinedAt).getTime()) / 60000)}{' '}
                      min
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={customer.priority === 'priority' ? 'bg-red-100 text-red-700 border-red-200 font-semibold' : 'bg-gray-100 text-gray-600'}
                      >
                        {customer.priority === 'priority' ? 'High Priority' : 'Standard'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Queue is Empty</h3>
              <p className="text-gray-500">No customers are currently waiting in the queue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
