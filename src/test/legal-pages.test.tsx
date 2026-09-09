import { describe, it, expect, afterEach, vi } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import AccessibilityPage from '@/pages/AccessibilityPage';
import LandingFooter from '@/components/landing/LandingFooter';
import SiteFooter from '@/components/layout/SiteFooter';
import { renderWithProviders } from './test-utils';

// The shared mock in setup.ts is pinned to English; this file needs to flip
// the active language to check the "English only" notice.
const lang = vi.hoisted(() => ({ current: 'en' }));
vi.mock('react-i18next', async () => {
  const { default: en } = await import('@/i18n/locales/en');
  const { default: es } = await import('@/i18n/locales/es.json');
  const lookup = (key: string) =>
    key
      .split('.')
      .reduce<unknown>(
        (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
        lang.current === 'es' ? es : en
      );
  const t = (key: string, options?: Record<string, unknown>) => {
    const value = lookup(key);
    if (typeof value !== 'string') return key;
    return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(options?.[name] ?? ''));
  };
  return { useTranslation: () => ({ t, i18n: { language: lang.current, changeLanguage: vi.fn() } }) };
});

const routes = (
  <Routes>
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/accessibility" element={<AccessibilityPage />} />
  </Routes>
);

describe('Legal pages', () => {
  afterEach(() => {
    cleanup();
    lang.current = 'en';
  });

  it.each([
    ['/privacy', 'Privacy Policy'],
    ['/terms', 'Terms of Service'],
    ['/accessibility', 'Accessibility Statement'],
  ])('%s renders one h1, the updated date and sets the tab title', (route, heading) => {
    renderWithProviders(routes, { route });
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(heading);
    expect(screen.getByText('Last updated: 2026-09-09')).toBeInTheDocument();
    expect(document.title).toBe(`${heading} · QueueFlow`);
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('shows the English-only notice in the active language when not English', () => {
    lang.current = 'es';
    renderWithProviders(routes, { route: '/privacy' });
    expect(screen.getByRole('note')).toHaveTextContent('Esta página solo está disponible en inglés.');
    expect(screen.getByText('Última actualización: 2026-09-09')).toBeInTheDocument();
  });

  it('keeps the governing-law placeholder visible for the owner to fill in', () => {
    renderWithProviders(routes, { route: '/terms' });
    expect(screen.getByText('[State], United States')).toBeInTheDocument();
  });

  it.each([
    ['LandingFooter', <LandingFooter key="l" />],
    ['SiteFooter', <SiteFooter key="s" />],
  ])('%s links to privacy, terms and accessibility', (_name, footer) => {
    renderWithProviders(footer);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/privacy', '/terms', '/accessibility']));
  });
});
