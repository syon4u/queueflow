import React from 'react';
import BackendHealthCheck from '@/components/admin/BackendHealthCheck';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardCard from '@/components/ui/broward-card';

const BackendHealthPage: React.FC = () => {
  return (
    <BrowardLayout headerTitle="System Health">
      <BrowardHero 
        title="Backend Configuration Check" 
        subtitle="Verify that all backend services, database connections, and configurations are working properly"
        backgroundStyle="gradient"
      />
      
      <div className="container mx-auto p-6">
        <BackendHealthCheck />
        
        <div className="mt-8 space-y-4">
          <BrowardCard title="What This Checks" elevation="sm">
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Supabase database connection</li>
              <li>Authentication status and user session</li>
              <li>Table access permissions</li>
              <li>Edge functions availability</li>
              <li>Database functions (stored procedures)</li>
              <li>Row Level Security (RLS) policies</li>
              <li>Basic data integrity</li>
            </ul>
          </BrowardCard>
          
          <BrowardCard title="Common Issues" elevation="sm" className="bg-bc-sand dark:bg-bc-navy/30">
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Missing RLS policies on tables</li>
              <li>Edge functions not deployed</li>
              <li>Authentication not properly configured</li>
              <li>Database functions missing or incorrect</li>
              <li>Missing test data in tables</li>
            </ul>
          </BrowardCard>
        </div>
      </div>
    </BrowardLayout>
  );
};

export default BackendHealthPage;