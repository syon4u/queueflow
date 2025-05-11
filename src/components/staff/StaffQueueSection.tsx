
import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const StaffQueueSection: React.FC = () => {
  const { customers, stats, callNextCustomer, markAsServed, markAsNoShow, currentCustomer } = useQueue();
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('queue.total')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('queue.waiting')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitingCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('queue.served')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.servedCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('queue.noShows')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.noShowCustomers}</div>
          </CardContent>
        </Card>
      </div>
      
      {currentCustomer && (
        <Card className="mb-6 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle>{t('staff.nowServing')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-xl font-bold">{currentCustomer.name}</h3>
                <p className="text-sm text-gray-600">{t('queue.service')}: {currentCustomer.serviceId || 'N/A'}</p>
                <p className="text-sm text-gray-600">
                  {t('queue.waitTime')}: {Math.floor(
                    (new Date().getTime() - new Date(currentCustomer.joinedAt).getTime()) / 60000
                  )} {t('queue.minutes')}
                </p>
              </div>
              
              <div className="flex space-x-2 mt-4 sm:mt-0">
                <Button onClick={markAsServed}>{t('queue.markAsServed')}</Button>
                <Button variant="outline" onClick={markAsNoShow}>{t('queue.markAsNoShow')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('queue.queueManagement')}</h2>
        <Button onClick={callNextCustomer}>{t('queue.callNext')}</Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('queue.name')}</TableHead>
                <TableHead>{t('queue.service')}</TableHead>
                <TableHead>{t('queue.status')}</TableHead>
                <TableHead>{t('queue.waitTime')}</TableHead>
                <TableHead>{t('queue.priority')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.serviceId || 'N/A'}</TableCell>
                    <TableCell>{t(`queue.status.${customer.status}`)}</TableCell>
                    <TableCell>
                      {Math.floor(
                        (new Date().getTime() - new Date(customer.joinedAt).getTime()) / 60000
                      )}{' '}
                      {t('queue.minutes')}
                    </TableCell>
                    <TableCell>
                      <span className={customer.priority === 'priority' ? 'text-red-500 font-bold' : ''}>
                        {t(`queue.priority.${customer.priority}`)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {t('queue.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffQueueSection;
