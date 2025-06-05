
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Clock, 
  Users, 
  PlayCircle, 
  CheckCircle, 
  XCircle,
  Wifi,
  WifiOff 
} from 'lucide-react';
import { useRealtimeQueue } from '@/hooks/use-realtime-queue';

interface RealtimeQueueBoardProps {
  locationId: string;
}

export const RealtimeQueueBoard: React.FC<RealtimeQueueBoardProps> = ({ locationId }) => {
  const {
    queuePositions,
    queueStats,
    queueLoading,
    isConnected,
    callNextCustomer,
    startService,
    completeService,
    markNoShow
  } = useRealtimeQueue(locationId);

  if (queueLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading queue...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time Queue Management</h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Queue Statistics */}
      {queueStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Waiting</p>
                  <p className="text-2xl font-bold">{queueStats.total_waiting}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Wait</p>
                  <p className="text-2xl font-bold">{queueStats.average_wait_time}m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">In Service</p>
                  <p className="text-2xl font-bold">{queueStats.current_service_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Served Today</p>
                  <p className="text-2xl font-bold">{queueStats.total_served_today}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Queue Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={callNextCustomer}
              disabled={!queuePositions || queuePositions.length === 0}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Next Customer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue ({queuePositions?.length || 0} customers)</CardTitle>
        </CardHeader>
        <CardContent>
          {queuePositions && queuePositions.length > 0 ? (
            <div className="space-y-4">
              {queuePositions.map((position) => (
                <div key={position.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-blue-600">
                        #{position.position}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {position.customer?.first_name} {position.customer?.last_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {position.service?.name} • Est. wait: {position.estimated_wait_time}m
                        </p>
                        <p className="text-xs text-gray-500">
                          Checked in: {new Date(position.check_in_time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {position.status}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startService(position.id)}
                          disabled={position.position !== 1}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => completeService(position.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markNoShow(position.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No customers in queue
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
