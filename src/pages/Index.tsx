
import React from 'react';
import { QueueProvider } from '@/context/QueueContext';
import QueueHeader from '@/components/QueueHeader';
import QueueStats from '@/components/QueueStats';
import CustomerQueue from '@/components/CustomerQueue';
import QueueControls from '@/components/QueueControls';
import AddCustomerForm from '@/components/AddCustomerForm';

const Index = () => {
  return (
    <QueueProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="qflow-container">
          <QueueHeader />
          <QueueStats />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="order-2 lg:order-1 lg:col-span-2">
              <CustomerQueue />
            </div>
            
            <div className="space-y-6 order-1 lg:order-2">
              <QueueControls />
              <AddCustomerForm />
            </div>
          </div>
        </div>
      </div>
    </QueueProvider>
  );
};

export default Index;
