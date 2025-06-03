
import React, { createContext, useContext, useEffect, useState } from 'react';
import { sessionManager } from '@/services/session-manager';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface SessionData {
  id: string;
  user_id: string;
  device_info: string;
  ip_address: string | null;
  last_active: string;
  expires_at: string;
  is_remembered: boolean;
  created_at: string;
  updated_at: string;
}

interface SessionContextType {
  activeSessions: SessionData[];
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
  const [activeSessions, setActiveSessions] = useState<SessionData[]>([]);
  const [isSessionValid, setIsSessionValid] = useState(true);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  // Initialize session management when user logs in
  useEffect(() => {
    if (user && session) {
      sessionManager.initialize();
      refreshSessions();
    }
  }, [user, session]);

  // Setup session monitoring
  useEffect(() => {
    if (!user) return;

    // Check session every 30 seconds
    const interval = setInterval(async () => {
      const valid = await checkSessionValidity();
      setIsSessionValid(valid);
      
      if (valid) {
        updateTimeUntilExpiry();
      }
    }, 30000);

    return () => {
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
      const valid = await sessionManager.validateSession();
      
      if (!valid) {
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
      const currentSession = sessionManager.getCurrentSession();
      
      if (currentSession) {
        const now = new Date();
        const expiry = new Date(currentSession.expires_at);
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
      if (!user) return;
      const sessions = await sessionManager.getUserSessions(user.id);
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
      // Invalidate all sessions except current
      for (const session of activeSessions) {
        if (session.id !== sessionManager.getCurrentSession()?.id) {
          await sessionManager.invalidateSession(session.id);
        }
      }
      await refreshSessions();
      toast({
        title: 'All Sessions Terminated',
        description: 'All other sessions have been terminated.'
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
      updateTimeUntilExpiry();
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
