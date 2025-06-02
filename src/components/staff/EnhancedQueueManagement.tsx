import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { 
  Play, 
  Pause, 
  Phone, 
  UserCheck, 
  UserX, 
  Settings, 
  Volume2, 
  VolumeX,
  Clock,
  Users,
  RefreshCw,
  Timer,
  MessageSquare
} from 'lucide-react';
import { useEnhancedQueue } from '@/hooks/use-enhanced-queue';
import { formatTime } from '@/lib/queue';

interface EnhancedQueueManagementProps {
  locationId: string;
}

export const EnhancedQueueManagement: React.FC<EnhancedQueueManagementProps> = ({ 
  locationId 
}) => {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    customers,
    currentCustomer,
    isLoading,
    settings,
    stats,
    callNextCustomer,
    markAsServed,
    markAsNoShow,
    updateSettings,
    refreshQueue
  } = useEnhancedQueue(locationId);

  const waitingCustomers = customers.filter(c => c.status === 'waiting');
  const priorityCustomers = waitingCustomers.filter(c => c.priority === 'priority');
  const regularCustomers = waitingCustomers.filter(c => c.priority === 'normal');

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('queue.waitingCustomers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.waitingCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Served Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.servedCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.noShowCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Wait Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageWaitTime)}m</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Customer Being Served - Enhanced Version */}
      <Card className={currentCustomer ? "border-green-500 bg-green-50 shadow-lg" : "border-gray-200"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5" />
              Now Serving
              {currentCustomer && (
                <Badge className="bg-green-600 text-white animate-pulse ml-2">
                  ACTIVE
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshQueue}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentCustomer ? (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-900">{currentCustomer.name}</h3>
                  <div className="flex items-center gap-2">
                    {currentCustomer.priority === 'priority' && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                        Priority
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800">
                      {currentCustomer.service}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Joined: </span>
                      <span className="font-medium">{formatTime(currentCustomer.joinedAt)}</span>
                    </div>
                    {currentCustomer.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{currentCustomer.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Wait Time: </span>
                      <span className="font-medium">
                        {Math.floor((new Date().getTime() - currentCustomer.joinedAt.getTime()) / 60000)}m
                      </span>
                    </div>
                    {currentCustomer.calledAt && (
                      <div className="flex items-center">
                        <span className="text-gray-600">Called: </span>
                        <span className="font-medium">{formatTime(currentCustomer.calledAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {currentCustomer.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded border">
                    <div className="flex items-start">
                      <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-700 mb-1">Customer Notes:</p>
                        <p className="text-sm text-gray-600">{currentCustomer.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 hover:bg-red-50 text-red-700 hover:text-red-800"
                  onClick={markAsNoShow}
                  disabled={isLoading}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Mark No-Show
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={markAsServed}
                  disabled={isLoading}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  {isLoading ? 'Processing...' : 'Mark as Served'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                <Phone className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl font-medium text-gray-700 mb-2">No Customer Being Served</p>
                <p className="text-gray-500 mb-6">Ready to serve the next customer in queue</p>
                <Button
                  onClick={callNextCustomer}
                  disabled={isLoading || waitingCustomers.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {isLoading ? 'Calling...' : 'Call Next Customer'}
                </Button>
                {waitingCustomers.length === 0 && (
                  <p className="text-sm text-gray-500 mt-3">No customers waiting in queue</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('queue.queueSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{t('queue.autoCall')}</Label>
                <p className="text-sm text-muted-foreground">
                  {settings.autoCallEnabled ? t('queue.autoCallEnabled') : t('queue.autoCallDisabled')}
                </p>
              </div>
              <Switch
                checked={settings.autoCallEnabled}
                onCheckedChange={(checked) => updateSettings({ autoCallEnabled: checked })}
              />
            </div>
            
            {settings.autoCallEnabled && (
              <div className="space-y-2">
                <Label htmlFor="autoCallInterval">{t('queue.autoCallInterval')}</Label>
                <Input
                  id="autoCallInterval"
                  type="number"
                  value={settings.autoCallInterval}
                  onChange={(e) => updateSettings({ autoCallInterval: Number(e.target.value) })}
                  min="10"
                  max="300"
                  className="w-24"
                />
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {t('queue.soundNotification')}
                </Label>
                <p className="text-sm text-muted-foreground">{t('queue.enableSound')}</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waitTime">{t('queue.estimatedWaitTime')}</Label>
              <Input
                id="waitTime"
                type="number"
                value={settings.estimatedWaitPerCustomer}
                onChange={(e) => updateSettings({ estimatedWaitPerCustomer: Number(e.target.value) })}
                min="5"
                max="60"
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Queue */}
        {priorityCustomers.length > 0 && (
          <Card className="border-amber-300 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                  {t('queue.priority')}
                </Badge>
                {t('queue.priorityQueue')} ({priorityCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {priorityCustomers.map((customer, index) => (
                    <div key={customer.id} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">#{index + 1} {customer.name}</span>
                        <Badge variant="outline" className="text-xs">{customer.service}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('queue.joinedAt')}: {formatTime(customer.joinedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Regular Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('queue.regularQueue')} ({regularCustomers.length})
              {waitingCustomers.length === 0 && (
                <Badge variant="outline">{t('queue.queueEmpty')}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regularCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('queue.noCustomersWaiting')}</p>
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {regularCustomers.map((customer, index) => (
                    <div key={customer.id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">
                          #{priorityCustomers.length + index + 1} {customer.name}
                        </span>
                        <Badge variant="outline" className="text-xs">{customer.service}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-4">
                        <span>{t('queue.joinedAt')}: {formatTime(customer.joinedAt)}</span>
                        {customer.estimatedWaitTime && (
                          <span>{t('queue.estimatedWait')}: {customer.estimatedWaitTime}m</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
