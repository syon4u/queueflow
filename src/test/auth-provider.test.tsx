
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as reactTesting from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { AuthTokenResponsePassword, Session } from '@supabase/supabase-js';

// Extract the needed utilities from the testing library
const { screen, waitFor } = reactTesting;

// Mock component to test the hook
const AuthConsumer = () => {
  const { user, loading, role, signIn } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="role">{role || 'null'}</div>
      <button data-testid="login-button" onClick={() => signIn('test@example.com', 'password')}>Login</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state and no user', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </BrowserRouter>
    );

    // Initial state should be loading
    expect(screen.getByTestId('loading').textContent).toBe('true');
    
    // After fetching session, it should not be loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // No user should be present
    expect(screen.getByTestId('user').textContent).toBe('null');
    
    // Default role should be null
    expect(screen.getByTestId('role').textContent).toBe('null');
  });

  it('should fetch user role when session is available', async () => {
    // Mock session response
    const mockUser = { id: 'test-user-id', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: mockSession as unknown as Session },
      error: null,
    });
    
    // Mock role response
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: 'customer',
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </BrowserRouter>
    );

    // Should eventually have user
    await waitFor(() => {
      const userContent = screen.getByTestId('user').textContent;
      expect(userContent).toContain('test@example.com');
    });
    
    // Should fetch role
    await waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('customer');
    });
  });

  it('resolves the role once per session even though Supabase emits several auth events', async () => {
    const mockUser = { id: 'once-user-id', email: 'once@example.com' };
    const mockSession = { user: mockUser } as unknown as Session;

    type AuthCallback = (event: string, session: Session | null) => void;
    let emit: AuthCallback | undefined;
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce(((cb: AuthCallback) => {
      emit = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }) as unknown as typeof supabase.auth.onAuthStateChange);

    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </BrowserRouter>
    );

    // The client is loaded on demand, so the listener is attached asynchronously.
    await waitFor(() => expect(emit).toBeDefined());

    // A cold load fires the initial-session check plus a burst of listener events.
    reactTesting.act(() => {
      emit?.('INITIAL_SESSION', mockSession);
      emit?.('SIGNED_IN', mockSession);
      emit?.('TOKEN_REFRESHED', mockSession);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('role').textContent).toBe('customer');
    });

    const tablesQueried = (vi.mocked(supabase.from).mock.calls as unknown as [string][]).map(([table]) => table);
    const roleLookups = tablesQueried.filter((table) => table === 'user_roles');
    expect(roleLookups).toHaveLength(1);
  });

  it('should call signInWithPassword when signIn is called', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: {},
      error: null,
    } as unknown as AuthTokenResponsePassword);

    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </BrowserRouter>
    );

    // Click login button
    screen.getByTestId('login-button').click();

    // Verify signInWithPassword was called with correct params
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });
});
