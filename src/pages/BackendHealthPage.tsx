
import React from 'react';
import BackendHealthCheck from '@/components/admin/BackendHealthCheck';
import DatabaseAnalysis from '@/components/admin/DatabaseAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BackendHealthPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Backend Configuration & Analysis</h1>
        <p className="text-muted-foreground">
          Verify backend services and analyze database structure for potential issues.
        </p>
      </div>
      
      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="health">Health Check</TabsTrigger>
          <TabsTrigger value="analysis">Database Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health" className="space-y-6">
          <BackendHealthCheck />
          
          <div className="mt-8 space-y-4">
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-2">What this checks:</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Supabase database connection</li>
                <li>Authentication status and user session</li>
                <li>Table access permissions</li>
                <li>Edge functions availability</li>
                <li>Database functions (stored procedures)</li>
                <li>Row Level Security (RLS) policies</li>
                <li>Basic data integrity</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50">
              <h2 className="font-semibold mb-2">Common Issues:</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Missing RLS policies on tables</li>
                <li>Edge functions not deployed</li>
                <li>Authentication not properly configured</li>
                <li>Database functions missing or incorrect</li>
                <li>Missing test data in tables</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          <DatabaseAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackendHealthPage;
