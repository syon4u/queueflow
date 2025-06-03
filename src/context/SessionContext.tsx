
import React, { createContext, useContext, useEffect, useState } from 'react';
import { sessionManager, SessionInfo } from '@/services/session-manager';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface SessionContextType {
  activeSessions: SessionInfo[];
  isSessionValid: boolean;
  timeUntilExpiry: number | null;
  refreshSessions: () => Promise<void>;
  invalidateSession: (sessionId: string) => Promise<void>;
  invalidateAllSessions: () => Promise<void>;
  extendSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);
  const [isSessionValid, setIsSessionValid] = useState(true);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  // Initialize session management when user logs in
  useEffect(() => {
    if (user && session) {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      sessionManager.initialize(user, rememberMe);
      refreshSessions();
    }
  }, [user, session]);

  // Setup activity monitoring
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();
    
    const cleanup = sessionManager.onActivity(() => {
      lastActivity = Date.now();
      sessionManager.updateLastActive();
    });

    // Check session every 30 seconds
    const interval = setInterval(async () => {
      const valid = await checkSessionValidity();
      setIsSessionValid(valid);
      
      if (valid) {
        updateTimeUntilExpiry();
      }
    }, 30000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionManager.cleanup();
    };
  }, []);

  const checkSessionValidity = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const sessions = await sessionManager.getUserSessions();
      const currentSession = sessions.find(s => 
        s.deviceInfo === getDeviceInfo()
      );
      
      if (!currentSession) return false;
      
      const now = new Date();
      if (now > currentSession.expiresAt) {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive'
        });
        await sessionManager.invalidateCurrentSession();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validity check failed:', error);
      return false;
    }
  };

  const updateTimeUntilExpiry = async (): Promise<void> => {
    try {
      const sessions = await sessionManager.getUserSessions();
      const currentSession = sessions.find(s => 
        s.deviceInfo === getDeviceInfo()
      );
      
      if (currentSession) {
        const now = new Date();
        const expiry = currentSession.expiresAt;
        const timeLeft = Math.max(0, expiry.getTime() - now.getTime());
        setTimeUntilExpiry(timeLeft);
        
        // Warn user when session is about to expire (5 minutes)
        if (timeLeft > 0 && timeLeft < 5 * 60 * 1000 && timeLeft > 4 * 60 * 1000) {
          toast({
            title: 'Session Expiring Soon',
            description: 'Your session will expire in 5 minutes. Click to extend.',
            action: (
              <button 
                onClick={extendSession}
                className="text-sm underline"
              >
                Extend Session
              </button>
            )
          });
        }
      }
    } catch (error) {
      console.error('Failed to update time until expiry:', error);
    }
  };

  const refreshSessions = async (): Promise<void> => {
    try {
      const sessions = await sessionManager.getUserSessions();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to refresh sessions:', error);
    }
  };

  const invalidateSession = async (sessionId: string): Promise<void> => {
    try {
      await sessionManager.invalidateSession(sessionId);
      await refreshSessions();
      toast({
        title: 'Session Terminated',
        description: 'The selected session has been terminated.'
      });
    } catch (error) {
      console.error('Failed to invalidate session:', error);
      toast({
        title: 'Error',
        description: 'Failed to terminate session.',
        variant: 'destructive'
      });
    }
  };

  const invalidateAllSessions = async (): Promise<void> => {
    try {
      await sessionManager.invalidateAllSessions();
      toast({
        title: 'All Sessions Terminated',
        description: 'All active sessions have been terminated.'
      });
    } catch (error) {
      console.error('Failed to invalidate all sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to terminate all sessions.',
        variant: 'destructive'
      });
    }
  };

  const extendSession = async (): Promise<void> => {
    try {
      await sessionManager.updateLastActive();
      await refreshSessions();
      toast({
        title: 'Session Extended',
        description: 'Your session has been extended.'
      });
    } catch (error) {
      console.error('Failed to extend session:', error);
      toast({
        title: 'Error',
        description: 'Failed to extend session.',
        variant: 'destructive'
      });
    }
  };

  const getDeviceInfo = (): string => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `${platform} - ${userAgent.substring(0, 100)}`;
  };

  const value: SessionContextType = {
    activeSessions,
    isSessionValid,
    timeUntilExpiry,
    refreshSessions,
    invalidateSession,
    invalidateAllSessions,
    extendSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
