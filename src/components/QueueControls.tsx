
import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, User, UserCheck, UserX, Timer, MessageSquare, Phone } from 'lucide-react';
import { getStatusColor, formatTime } from '@/lib/queue';

const QueueControls: React.FC = () => {
  const { currentCustomer, callNextCustomer, markAsServed, markAsNoShow, isLoading } = useQueue();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Now Serving
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentCustomer ? (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-3 border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{currentCustomer.name}</h3>
                <Badge 
                  className="bg-green-100 text-green-800 border-green-300 animate-pulse"
                >
                  Now Serving
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Joined at {formatTime(currentCustomer.joinedAt)}</span>
                </div>
                
                {currentCustomer.phone && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{currentCustomer.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-muted-foreground">Service: </span>
                  <span className="font-medium ml-1">{currentCustomer.service}</span>
                </div>
                
                {currentCustomer.priority === 'priority' && (
                  <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800">
                    Priority Customer
                  </Badge>
                )}
              </div>
              
              {currentCustomer.notes && (
                <div className="bg-background p-3 rounded-md text-sm border">
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium mb-1">Notes:</p>
                      <p>{currentCustomer.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-red-300 hover:bg-red-50 text-red-700" 
                onClick={markAsNoShow}
                disabled={isLoading}
              >
                <UserX className="h-4 w-4 mr-1" />
                No-Show
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={markAsServed}
                disabled={isLoading}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Mark Served
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-xl font-medium text-gray-700">No customer being served</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ready to call the next customer in queue
              </p>
            </div>
            
            <Button 
              className="w-full bg-qflow-teal hover:bg-qflow-darkTeal"
              onClick={callNextCustomer}
              disabled={isLoading}
            >
              <Phone className="h-4 w-4 mr-2" />
              {isLoading ? 'Calling...' : 'Call Next Customer'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueueControls;
