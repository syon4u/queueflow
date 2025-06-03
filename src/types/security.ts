
export interface SecurityAuditLog {
  id: string;
  event_type: string;
  client_identifier: string;
  success: boolean;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  retryAfter?: number;
  remainingAttempts?: number;
}

export interface SecurityMetrics {
  failedAttempts: number;
  successfulAttempts: number;
  blockedAttempts: number;
  uniqueClients: number;
  topFailureReasons: Array<{
    reason: string;
    count: number;
  }>;
}

export interface InputValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface SecureAuthContext {
  clientId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  sessionId?: string;
}

// Security audit log record interface for internal use
export interface SecurityAuditLogRecord {
  id: string;
  event_type: string;
  client_identifier: string;
  success: boolean;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
