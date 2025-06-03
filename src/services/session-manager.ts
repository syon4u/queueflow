
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress?: string;
  lastActive: Date;
  expiresAt: Date;
  isRemembered: boolean;
}

export interface SessionSettings {
  timeoutMinutes: number;
  maxConcurrentSessions: number;
  rememberMeDays: number;
  extendOnActivity: boolean;
}

class SessionManager {
  private static instance: SessionManager;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private activityListeners: Array<() => void> = [];
  private settings: SessionSettings = {
    timeoutMinutes: 30, // 30 minutes default timeout
    maxConcurrentSessions: 3,
    rememberMeDays: 30,
    extendOnActivity: true
  };

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private constructor() {
    this.setupActivityDetection();
  }

  // Initialize session management
  async initialize(user: User | null, rememberMe: boolean = false): Promise<void> {
    if (!user) return;

    const sessionData = {
      user_id: user.id,
      device_info: this.getDeviceInfo(),
      ip_address: await this.getClientIP(),
      last_active: new Date().toISOString(),
      expires_at: this.calculateExpiration(rememberMe),
      is_remembered: rememberMe
    };

    try {
      // Store session in database
      const { error } = await supabase
        .from('user_sessions')
        .insert(sessionData);

      if (error && !error.message.includes('duplicate')) {
        console.error('Failed to store session:', error);
      }

      // Clean up old sessions for this user
      await this.cleanupOldSessions(user.id);

      // Start session monitoring
      this.startSessionMonitoring();
      
      console.log('Session initialized for user:', user.id);
    } catch (error) {
      console.error('Session initialization error:', error);
    }
  }

  // Start monitoring session timeout
  private startSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    this.sessionCheckInterval = setInterval(async () => {
      await this.checkSessionValidity();
    }, 60000); // Check every minute
  }

  // Check if current session is still valid
  private async checkSessionValidity(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data: sessionRecord, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('device_info', this.getDeviceInfo())
        .single();

      if (error || !sessionRecord) {
        console.log('Session not found in database, logging out');
        await this.invalidateCurrentSession();
        return false;
      }

      const expiresAt = new Date(sessionRecord.expires_at);
      const now = new Date();

      if (now > expiresAt) {
        console.log('Session expired, logging out');
        await this.invalidateCurrentSession();
        return false;
      }

      // Update last active if session is still valid
      if (this.settings.extendOnActivity) {
        await this.updateLastActive();
      }

      return true;
    } catch (error) {
      console.error('Session validity check failed:', error);
      return false;
    }
  }

  // Update last active timestamp
  async updateLastActive(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase
        .from('user_sessions')
        .update({ 
          last_active: new Date().toISOString(),
          expires_at: this.calculateExpiration(false) // Extend session
        })
        .eq('user_id', session.user.id)
        .eq('device_info', this.getDeviceInfo());
    } catch (error) {
      console.error('Failed to update last active:', error);
    }
  }

  // Get active sessions for current user
  async getUserSessions(): Promise<SessionInfo[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Failed to get user sessions:', error);
        return [];
      }

      return sessions.map(s => ({
        id: s.id,
        userId: s.user_id,
        deviceInfo: s.device_info,
        ipAddress: s.ip_address,
        lastActive: new Date(s.last_active),
        expiresAt: new Date(s.expires_at),
        isRemembered: s.is_remembered
      }));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  // Invalidate a specific session
  async invalidateSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to invalidate session:', error);
      }
    } catch (error) {
      console.error('Session invalidation error:', error);
    }
  }

  // Invalidate current session and logout
  async invalidateCurrentSession(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Remove from database
        await supabase
          .from('user_sessions')
          .delete()
          .eq('user_id', session.user.id)
          .eq('device_info', this.getDeviceInfo());
      }

      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear monitoring
      this.stopSessionMonitoring();
      
      console.log('Current session invalidated');
    } catch (error) {
      console.error('Failed to invalidate current session:', error);
    }
  }

  // Invalidate all sessions for current user
  async invalidateAllSessions(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Remove all sessions from database
      await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', session.user.id);

      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear monitoring
      this.stopSessionMonitoring();
      
      console.log('All sessions invalidated');
    } catch (error) {
      console.error('Failed to invalidate all sessions:', error);
    }
  }

  // Clean up old/expired sessions
  private async cleanupOldSessions(userId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Remove expired sessions
      await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', userId)
        .lt('expires_at', now);

      // Enforce max concurrent sessions
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('id, last_active')
        .eq('user_id', userId)
        .order('last_active', { ascending: false });

      if (sessions && sessions.length > this.settings.maxConcurrentSessions) {
        const sessionsToRemove = sessions.slice(this.settings.maxConcurrentSessions);
        const idsToRemove = sessionsToRemove.map(s => s.id);
        
        await supabase
          .from('user_sessions')
          .delete()
          .in('id', idsToRemove);
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }

  // Setup activity detection
  private setupActivityDetection(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const onActivity = () => {
      this.activityListeners.forEach(listener => listener());
    };

    events.forEach(event => {
      document.addEventListener(event, onActivity, true);
    });
  }

  // Add activity listener
  onActivity(callback: () => void): () => void {
    this.activityListeners.push(callback);
    
    // Return cleanup function
    return () => {
      const index = this.activityListeners.indexOf(callback);
      if (index > -1) {
        this.activityListeners.splice(index, 1);
      }
    };
  }

  // Stop session monitoring
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  // Calculate session expiration
  private calculateExpiration(isRemembered: boolean): string {
    const now = new Date();
    const minutes = isRemembered 
      ? this.settings.rememberMeDays * 24 * 60 
      : this.settings.timeoutMinutes;
    
    now.setMinutes(now.getMinutes() + minutes);
    return now.toISOString();
  }

  // Get device information
  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `${platform} - ${userAgent.substring(0, 100)}`;
  }

  // Get client IP (simplified - in production you'd use a service)
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  // Update session settings
  updateSettings(newSettings: Partial<SessionSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Cleanup on app unload
  cleanup(): void {
    this.stopSessionMonitoring();
    this.activityListeners = [];
  }
}

export const sessionManager = SessionManager.getInstance();
