
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { populateDemoData, clearDemoData } from '@/utils/demo-data';
import { Database, Trash2, Users, RefreshCw } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';

export const DemoDataControls: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refetch } = useAppData();

  const handlePopulateDemo = async () => {
    setIsLoading(true);
    try {
      const result = await populateDemoData();
      
      if (result.success) {
        toast({
          title: 'Demo Data Created',
          description: result.message,
        });
        refetch(); // Refresh the data
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to populate demo data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDemo = async () => {
    setIsLoading(true);
    try {
      const result = await clearDemoData();
      
      if (result.success) {
        toast({
          title: 'Demo Data Cleared',
          description: result.message,
        });
        refetch(); // Refresh the data
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear demo data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Database className="h-5 w-5" />
          Demo Data Controls
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            Development
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-blue-700">
            Quickly populate the app with realistic demo data for screenshots and demonstrations.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handlePopulateDemo} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-2 h-4 w-4" />
              )}
              Populate Demo Data
            </Button>
            
            <Button 
              onClick={handleClearDemo} 
              disabled={isLoading}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Demo Data
            </Button>
          </div>
          
          <div className="text-xs text-blue-600 bg-blue-100 p-3 rounded">
            <strong>Demo Data Includes:</strong>
            <ul className="mt-1 space-y-1">
              <li>• 1 customer currently being served</li>
              <li>• 3 customers waiting in queue (checked in)</li>
              <li>• 2 upcoming scheduled appointments</li>
              <li>• 2 completed appointments from earlier today</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
