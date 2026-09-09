import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import '@/styles/landing.css';

/** Date shown on every legal page; bump it when the wording changes. */
export const LEGAL_LAST_UPDATED = '2026-09-09';

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

interface LegalPageProps {
  /** Untranslated page name used for the browser tab: "Privacy · QueueFlow". */
  title: string;
  /** Short eyebrow above the h1 (e.g. "QueueFlow policies"). */
  eyebrow: string;
  /** One-paragraph summary shown under the h1. */
  intro: React.ReactNode;
  sections: LegalSection[];
  /** Render the "On this page" table of contents. */
  toc?: boolean;
}

/**
 * Document layout for the public legal and accessibility pages: landing nav
 * and footer, a readable ~70ch column, and one h1 followed by h2 sections.
 * The long-form body is English-only; when the UI language is anything else
 * the page says so in that language.
 */
const LegalPage: React.FC<LegalPageProps> = ({ title, eyebrow, intro, sections, toc = false }) => {
  const { t, i18n } = useTranslation();
  const english = i18n.language.toLowerCase().startsWith('en');

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · QueueFlow`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <div className="landing min-h-screen w-full">
      <LandingNav />
      <main id="main" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <article className="qf-doc mx-auto max-w-[70ch]" lang="en">
          <p className="qf-eyebrow">{eyebrow}</p>
          <h1 className="qf-h2 mt-3 text-[--text-1]">{title}</h1>
          <p className="mt-4 text-[15px] text-[--text-2]">
            {t('public.legal.lastUpdated', { date: LEGAL_LAST_UPDATED })}
          </p>

          {!english && (
            <p role="note" lang={i18n.language} className="qf-doc-notice mt-6">
              {t('public.legal.englishOnly')}
            </p>
          )}

          <div className="mt-6 text-[17px] leading-relaxed text-[--text-1]">{intro}</div>

          {toc && (
            <nav aria-label={t('public.legal.onThisPage')} className="qf-doc-toc mt-8">
              <h2 className="qf-eyebrow">{t('public.legal.onThisPage')}</h2>
              <ol className="mt-3">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      <span className="qf-doc-toc-num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="qf-doc-section">
              <h2 id={`${s.id}-heading`} className="qf-h3">
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>
      </main>
      <LandingFooter />
    </div>
  );
};

export default LegalPage;
