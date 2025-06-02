
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Monitor, Users, Clock } from 'lucide-react';
import { useQueue } from '@/context/QueueContext';

export const QueueDisplayBoard: React.FC = () => {
  const { t } = useTranslation();
  const { currentCustomer, customers, stats } = useQueue();

  const recentlyCalledCustomers = customers
    .filter(c => c.status === 'served' && c.calledAt)
    .sort((a, b) => (b.calledAt?.getTime() || 0) - (a.calledAt?.getTime() || 0))
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Monitor className="h-5 w-5" />
            {t('queue.nowServing')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentCustomer ? (
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-800 mb-2">
                {currentCustomer.name}
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300 text-lg px-4 py-1">
                {currentCustomer.service}
              </Badge>
              {currentCustomer.phone && (
                <div className="text-sm text-green-600 mt-2">
                  Phone: {currentCustomer.phone}
                </div>
              )}
              <div className="text-xs text-green-600 mt-2">
                Called at: {currentCustomer.calledAt?.toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-xl font-medium text-gray-600">
                {t('queue.noOneBeingServed')}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Ready to serve the next customer
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {recentlyCalledCustomers.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="h-5 w-5" />
              {t('queue.recentlyCalled')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentlyCalledCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{customer.name}</span>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {customer.service}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('queue.waitingCustomers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.waitingCustomers}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('queue.customersInQueue')}
            </div>
            {stats.averageWaitTime > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Average wait: {Math.round(stats.averageWaitTime)}m
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
