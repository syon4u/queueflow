
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/context/QueueContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Phone, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  Clock
} from 'lucide-react';

interface QueueOperationsPanelProps {
  variant?: 'staff' | 'admin';
  showAdvancedControls?: boolean;
}

export const QueueOperationsPanel: React.FC<QueueOperationsPanelProps> = ({ 
  variant = 'staff',
  showAdvancedControls = false 
}) => {
  const { 
    currentCustomer, 
    callNextCustomer, 
    markAsServed, 
    markAsNoShow, 
    resetQueue,
    isLoading,
    stats 
  } = useQueue();
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {/* Current Customer Being Served */}
      {currentCustomer && (
        <Card className="border-green-500 bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Users className="h-5 w-5" />
              Now Serving
              <Badge className="bg-green-600 text-white ml-2">ACTIVE</Badge>
            </CardTitle>
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
                  <UserX className="h-4 w-4 mr-2" />
                  No-Show
                </Button>
                <Button 
                  onClick={markAsServed} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Mark Served
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Queue Controls
            {variant === 'admin' && (
              <Badge variant="outline" className="ml-2">Admin View</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={callNextCustomer} 
              disabled={isLoading || !!currentCustomer || stats.waitingCustomers === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              {isLoading ? 'Calling...' : 'Call Next Customer'}
            </Button>
            
            {showAdvancedControls && (
              <Button 
                onClick={resetQueue} 
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset Queue
              </Button>
            )}
          </div>
          
          {variant === 'admin' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Admin Note:</strong> Advanced queue management controls are available. 
                Use with caution as these affect all staff operations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
