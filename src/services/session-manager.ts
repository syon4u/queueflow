
import { supabase } from '@/integrations/supabase/client';
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

interface CreateSessionOptions {
  rememberMe?: boolean;
  deviceInfo?: string;
}

class SessionManager {
  private static instance: SessionManager;
  private currentSession: SessionData | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private readonly SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private async getClientIP(): Promise<string> {
    // Fallback to a safe default instead of making external requests
    // In production, this would typically be handled server-side
    return 'unknown';
  }

  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || 'Unknown';
    const language = navigator.language || 'Unknown';
    
    // Create a simplified device fingerprint
    return `${platform} - ${language} - ${userAgent.substring(0, 50)}`;
  }

  async initialize(): Promise<void> {
    console.log('SessionManager: Initializing...');
    
    try {
      // Start session monitoring
      this.startSessionMonitoring();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('SessionManager: No authenticated user');
        return;
      }

      // Create or update session
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      await this.createSession(user.id, { rememberMe });
      
      console.log('SessionManager: Initialized successfully');
    } catch (error) {
      console.error('SessionManager: Failed to initialize:', error);
      // Don't throw error, just log it to prevent blocking the app
    }
  }

  async createSession(userId: string, options: CreateSessionOptions = {}): Promise<SessionData | null> {
    try {
      const { rememberMe = false, deviceInfo = this.getDeviceInfo() } = options;
      const ipAddress = await this.getClientIP();
      
      const duration = rememberMe ? this.REMEMBER_ME_DURATION : this.DEFAULT_SESSION_DURATION;
      const expiresAt = new Date(Date.now() + duration).toISOString();

      const sessionData = {
        user_id: userId,
        device_info: deviceInfo,
        ip_address: ipAddress,
        last_active: new Date().toISOString(),
        expires_at: expiresAt,
        is_remembered: rememberMe,
      };

      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('SessionManager: Failed to create session:', error);
        return null;
      }

      this.currentSession = data;
      console.log('SessionManager: Session created successfully');
      return data;
    } catch (error) {
      console.error('SessionManager: Error creating session:', error);
      return null;
    }
  }

  async validateSession(): Promise<boolean> {
    if (!this.currentSession) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', this.currentSession.id)
        .single();

      if (error || !data) {
        console.log('SessionManager: Session not found or error:', error);
        this.currentSession = null;
        return false;
      }

      // Check if session has expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        console.log('SessionManager: Session expired');
        await this.invalidateSession(this.currentSession.id);
        return false;
      }

      return true;
    } catch (error) {
      console.error('SessionManager: Error validating session:', error);
      return false;
    }
  }

  async updateLastActive(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          last_active: new Date().toISOString(),
        })
        .eq('id', this.currentSession.id);

      if (error) {
        console.error('SessionManager: Failed to update last active:', error);
      }
    } catch (error) {
      console.error('SessionManager: Error updating last active:', error);
    }
  }

  async invalidateSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('SessionManager: Failed to invalidate session:', error);
      } else {
        console.log('SessionManager: Session invalidated successfully');
      }

      if (this.currentSession?.id === sessionId) {
        this.currentSession = null;
      }
    } catch (error) {
      console.error('SessionManager: Error invalidating session:', error);
    }
  }

  async invalidateCurrentSession(): Promise<void> {
    if (this.currentSession) {
      await this.invalidateSession(this.currentSession.id);
    }
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
    this.cleanup();
  }

  async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('last_active', { ascending: false });

      if (error) {
        console.error('SessionManager: Failed to get user sessions:', error);
        return [];
      }

      return data.map(session => ({
        ...session,
        user_id: session.user_id,
        device_info: session.device_info,
        ip_address: session.ip_address,
        last_active: session.last_active,
        expires_at: session.expires_at,
        is_remembered: session.is_remembered,
        created_at: session.created_at,
        updated_at: session.updated_at,
        id: session.id,
      }));
    } catch (error) {
      console.error('SessionManager: Error getting user sessions:', error);
      return [];
    }
  }

  private startSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    this.sessionCheckInterval = setInterval(async () => {
      const isValid = await this.validateSession();
      if (!isValid) {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please sign in again.',
          variant: 'destructive',
        });
        await this.invalidateCurrentSession();
      } else {
        await this.updateLastActive();
      }
    }, this.SESSION_CHECK_INTERVAL);
  }

  cleanup(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
    this.currentSession = null;
    localStorage.removeItem('rememberMe');
  }

  getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  isSessionValid(): boolean {
    return this.currentSession !== null;
  }
}

export const sessionManager = SessionManager.getInstance();
