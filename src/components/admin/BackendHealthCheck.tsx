import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils';

interface HealthCheckResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: unknown;
}

const BackendHealthCheck: React.FC = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<HealthCheckResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (name: string, status: HealthCheckResult['status'], message: string, details?: unknown) => {
    setResults(prev => {
      const existing = prev.findIndex(r => r.name === name);
      const newResult = { name, status, message, details };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResult;
        return updated;
      }
      return [...prev, newResult];
    });
  };

  const runHealthChecks = async () => {
    setIsRunning(true);
    setResults([]);

    // 1. Test Supabase Connection
    updateResult('Supabase Connection', 'loading', 'Testing connection...');
    try {
      const { data, error } = await supabase.from('locations').select('count').limit(1);
      if (error) throw error;
      updateResult('Supabase Connection', 'success', 'Connected successfully');
    } catch (error) {
      updateResult('Supabase Connection', 'error', `Connection failed: ${getErrorMessage(error)}`);
    }

    // 2. Test Authentication
    updateResult('Authentication', 'loading', 'Checking auth status...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        updateResult('Authentication', 'success', `Authenticated as: ${user.email}`);
      } else {
        updateResult('Authentication', 'warning', 'Not authenticated');
      }
    } catch (error) {
      updateResult('Authentication', 'error', `Auth check failed: ${getErrorMessage(error)}`);
    }

    // 3. Test Tables Access - Updated to use new table structure
    const tableChecks = [
      { name: 'locations', table: 'locations' as const },
      { name: 'services', table: 'services' as const },
      { name: 'profiles', table: 'profiles' as const },
      { name: 'customers', table: 'customers' as const },
      { name: 'appointments', table: 'appointments' as const },
      { name: 'user_roles', table: 'user_roles' as const }
    ];

    for (const { name, table } of tableChecks) {
      updateResult(`Table: ${name}`, 'loading', 'Checking access...');
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) throw error;
        updateResult(`Table: ${name}`, 'success', 'Accessible');
      } catch (error) {
        updateResult(`Table: ${name}`, 'error', `Access denied: ${getErrorMessage(error)}`);
      }
    }

    // 4. Test Edge Functions
    const functions = ['admin-stats', 'appointments', 'customer-history', 'daily-metrics', 'staff-metrics', 'service-metrics'];
    
    for (const func of functions) {
      updateResult(`Function: ${func}`, 'loading', 'Testing function...');
      try {
        const { data, error } = await supabase.functions.invoke(func, { body: { test: true } });
        if (error) throw error;
        updateResult(`Function: ${func}`, 'success', 'Function accessible');
      } catch (error) {
        updateResult(`Function: ${func}`, 'error', `Function failed: ${getErrorMessage(error)}`);
      }
    }

    // 5. Test Database Functions
    updateResult('Database Functions', 'loading', 'Testing stored procedures...');
    try {
      const { data, error } = await supabase.rpc('get_current_user_role');
      if (error) throw error;
      updateResult('Database Functions', 'success', `User role function works: ${data}`);
    } catch (error) {
      updateResult('Database Functions', 'error', `DB function failed: ${getErrorMessage(error)}`);
    }

    // 6. Test RLS Policies
    updateResult('RLS Policies', 'loading', 'Testing row level security...');
    try {
      // Try to access appointments (requires auth)
      const { data, error } = await supabase.from('appointments').select('id').limit(1);
      if (error && error.message.includes('permission')) {
        updateResult('RLS Policies', 'success', 'RLS is active and protecting data');
      } else if (error) {
        throw error;
      } else {
        updateResult('RLS Policies', 'warning', 'RLS may not be properly configured');
      }
    } catch (error) {
      updateResult('RLS Policies', 'error', `RLS test failed: ${getErrorMessage(error)}`);
    }

    // 7. Test Data Integrity - Updated to check new structure
    updateResult('Data Integrity', 'loading', 'Checking data consistency...');
    try {
      const { data: locations } = await supabase.from('locations').select('id, name');
      const { data: services } = await supabase.from('services').select('id, location_id');
      const { data: profiles } = await supabase.from('profiles').select('id');
      
      const issues = [];
      if (locations?.length === 0) issues.push('No locations found');
      if (services?.length === 0) issues.push('No services found');
      if (profiles?.length === 0) issues.push('No user profiles found');
      
      if (issues.length > 0) {
        updateResult('Data Integrity', 'warning', `Issues found: ${issues.join(', ')}`);
      } else {
        updateResult('Data Integrity', 'success', 'Basic data structure looks good');
      }
    } catch (error) {
      updateResult('Data Integrity', 'error', `Data check failed: ${getErrorMessage(error)}`);
    }

    setIsRunning(false);
    
    toast({
      title: "Health Check Complete",
      description: "Backend configuration check finished"
    });
  };

  const getStatusIcon = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'loading': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status: HealthCheckResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      loading: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Backend Health Check
          <Button 
            onClick={runHealthChecks} 
            disabled={isRunning}
            className="ml-4"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Health Check'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Click "Run Health Check" to test your backend configuration
          </p>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
            
            {!isRunning && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Summary</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {results.filter(r => r.status === 'success').length}
                    </div>
                    <div>Success</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {results.filter(r => r.status === 'warning').length}
                    </div>
                    <div>Warning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {results.filter(r => r.status === 'error').length}
                    </div>
                    <div>Error</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.filter(r => r.status === 'loading').length}
                    </div>
                    <div>Loading</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendHealthCheck;
