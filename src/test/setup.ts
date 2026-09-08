
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
      const q: Record<string, unknown> = {};
      for (const m of ['select','insert','update','delete','eq','neq','in','order','limit','gte','lte','ilike','single','maybeSingle','range']) {
        q[m] = vi.fn(() => q);
      }
      q.then = (res: (value: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(res);
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

// Mock react-i18next. `t` resolves against the English resources (with
// {{interpolation}}) so components render the same copy users see, and tests
// can keep asserting on English text.
vi.mock('react-i18next', async () => {
  const { default: en } = await import('@/i18n/locales/en');
  const lookup = (key: string) =>
    key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), en);
  const t = (key: string, options?: string | Record<string, unknown>) => {
    const opts = typeof options === 'object' && options ? options : {};
    const defaultValue = typeof options === 'string' ? options : (opts.defaultValue as string | undefined);
    const value = lookup(key);
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return defaultValue ?? key;
    return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(opts[name] ?? ''));
  };
  return {
    useTranslation: () => ({
      t,
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
      },
    }),
  };
});
