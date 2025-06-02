
import React from 'react';
import { useQueue } from '@/context/QueueContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  formatTime, 
  getQueuePosition, 
  formatWaitTime, 
  getStatusColor, 
  getStatusDisplay,
  getPriorityLabel
} from '@/lib/queue';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, MessageSquare, Flag, Timer } from 'lucide-react';

const CustomerQueue: React.FC = () => {
  const { customers, getEstimatedWaitTime } = useQueue();
  
  // Get waiting customers only, ordered by priority then join time
  const waitingCustomers = [...customers]
    .filter(c => c.status === 'waiting')
    .sort((a, b) => {
      // Sort by priority
      if (a.priority !== b.priority) {
        return a.priority === 'priority' ? -1 : 1;
      }
      // Then by join time
      return a.joinedAt.getTime() - b.joinedAt.getTime();
    });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Waiting List</CardTitle>
          <Badge variant="outline" className="ml-2">
            {waitingCustomers.length} waiting
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {waitingCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No customers waiting</p>
            <p className="text-sm">Add customers to the queue to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-[390px] pr-4">
            <div className="space-y-3">
              {waitingCustomers.map((customer) => {
                const position = getQueuePosition(customer.id, customers);
                const estimatedWait = getEstimatedWaitTime(customer.id);
                return (
                  <div 
                    key={customer.id}
                    className="p-4 rounded-lg border bg-card flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold flex items-center">
                          <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2 font-bold">
                            {position}
                          </span>
                          {customer.name}
                        </p>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> 
                          <span>Joined at {formatTime(customer.joinedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="secondary"
                          className={`${customer.priority === 'priority' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}`}
                        >
                          {getPriorityLabel(customer.priority)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {customer.service}
                        </Badge>
                      </div>
                    </div>

                    {/* Estimated Wait Time - Prominently displayed */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-700">
                          <Timer className="h-4 w-4 mr-2" />
                          <span className="font-medium text-sm">Estimated Wait:</span>
                        </div>
                        <span className="font-bold text-blue-800">
                          {estimatedWait === 0 ? 'Next up!' : formatWaitTime(estimatedWait)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      {customer.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      
                      {customer.notes && (
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[150px]">{customer.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerQueue;
