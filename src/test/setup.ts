
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { 
          subscription: { unsubscribe: vi.fn() } 
        } 
      }),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    from: vi.fn(() => {
      const q: any = {};
      for (const m of ['select','insert','update','delete','eq','neq','in','order','limit','gte','lte','ilike','single','maybeSingle','range']) {
        q[m] = vi.fn(() => q);
      }
      q.then = (res: any) => Promise.resolve({ data: [], error: null }).then(res);
      return q;
    }),
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis(), unsubscribe: vi.fn() })),
    removeChannel: vi.fn(),
    storage: { from: vi.fn(() => ({ list: vi.fn().mockResolvedValue({ data: [], error: null }) })) },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/test', state: {} }),
  };
});

// Mock react-i18next
vi.mock('react-i18next', async () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));
