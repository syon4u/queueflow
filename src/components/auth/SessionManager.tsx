
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSession } from '@/context/SessionContext';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Clock, 
  MapPin, 
  Shield,
  LogOut,
  RefreshCw 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SessionManager: React.FC = () => {
  const { 
    activeSessions, 
    timeUntilExpiry, 
    refreshSessions, 
    invalidateSession, 
    invalidateAllSessions,
    extendSession 
  } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo.toLowerCase();
    if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (info.includes('tablet') || info.includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getCurrentDeviceInfo = (): string => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `${platform} - ${userAgent.substring(0, 100)}`;
  };

  const isCurrentSession = (deviceInfo: string): boolean => {
    return deviceInfo === getCurrentDeviceInfo();
  };

  const formatTimeUntilExpiry = (expiry: Date): string => {
    const now = new Date();
    const timeLeft = expiry.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshSessions();
    setIsLoading(false);
  };

  const handleInvalidateSession = async (sessionId: string) => {
    setIsLoading(true);
    await invalidateSession(sessionId);
    setIsLoading(false);
  };

  const handleInvalidateAllSessions = async () => {
    setIsLoading(true);
    await invalidateAllSessions();
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Session Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage your active sessions and security settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={extendSession}
            variant="outline"
            size="sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            Extend Session
          </Button>
        </div>
      </div>

      {/* Session Timeout Warning */}
      {timeUntilExpiry && timeUntilExpiry < 10 * 60 * 1000 && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your session will expire in {Math.ceil(timeUntilExpiry / (1000 * 60))} minutes.
            <Button 
              onClick={extendSession}
              variant="link" 
              className="p-0 h-auto ml-2"
            >
              Extend now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Sessions ({activeSessions.length})
          </CardTitle>
          <CardDescription>
            These are the devices currently signed into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No active sessions found
              </p>
            ) : (
              activeSessions.map((session) => (
                <div 
                  key={session.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    isCurrentSession(session.device_info) 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.device_info)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {session.device_info.split(' - ')[0]}
                        </span>
                        {isCurrentSession(session.device_info) && (
                          <Badge variant="secondary" className="text-xs">
                            Current Session
                          </Badge>
                        )}
                        {session.is_remembered && (
                          <Badge variant="outline" className="text-xs">
                            Remembered
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.ip_address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.ip_address}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active: {formatDistanceToNow(new Date(session.last_active))} ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Expires in {formatTimeUntilExpiry(new Date(session.expires_at))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.expires_at).toLocaleString()}
                      </div>
                    </div>
                    
                    {!isCurrentSession(session.device_info) && (
                      <Button
                        onClick={() => handleInvalidateSession(session.id)}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {activeSessions.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={handleInvalidateAllSessions}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out All Sessions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
