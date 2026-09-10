
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '@/i18n/languages';

type LanguageMenuComponent = typeof import('@/components/LanguageMenu')['default'];

// The dropdown (radix menu + popper + floating-ui) is loaded on demand and
// shared by every switcher instance on the page.
let menuModule: Promise<LanguageMenuComponent> | null = null;
const loadMenu = () => {
  menuModule ??= import('@/components/LanguageMenu').then((m) => m.default);
  return menuModule;
};

/**
 * Globe button that opens the language menu. The button renders from the
 * main chunk; the menu chunk is fetched on intent (hover, focus or press on
 * the button) or on the visitor's first interaction with the page (pointer,
 * touch, key or scroll), so it is normally there before the first click.
 * It is deliberately not fetched on idle: that would put ~15 requests on
 * the network while the hero is still loading. A click that lands before
 * the chunk has arrived opens the menu as soon as it does. Keyboard focus
 * on the button survives the swap from placeholder to real trigger.
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [Menu, setMenu] = useState<LanguageMenuComponent | null>(null);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const warm = useCallback(() => {
    if (Menu) return;
    loadMenu().then((component) => {
      restoreFocusRef.current = document.activeElement === triggerRef.current;
      setMenu(() => component);
    });
  }, [Menu]);

  // Warm-up on the visitor's first interaction anywhere on the page.
  useEffect(() => {
    if (Menu) return;
    const events = ['pointermove', 'pointerdown', 'touchstart', 'keydown', 'scroll'] as const;
    const onFirstInteraction = () => {
      events.forEach((name) => window.removeEventListener(name, onFirstInteraction));
      warm();
    };
    events.forEach((name) => window.addEventListener(name, onFirstInteraction, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, onFirstInteraction));
  }, [Menu, warm]);

  // The placeholder button and the radix trigger are different React
  // subtrees, so the DOM node changes; give focus back if it was there.
  useEffect(() => {
    if (Menu && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      triggerRef.current?.focus();
    }
  }, [Menu]);

  const label = (
    <>
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{currentLanguage.name}</span>
    </>
  );

  if (!Menu) {
    return (
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        className="min-h-11 min-w-11 gap-2"
        aria-haspopup="menu"
        aria-expanded={false}
        onPointerEnter={warm}
        onFocus={warm}
        onPointerDown={warm}
        onClick={() => {
          setOpen(true);
          warm();
        }}
      >
        {label}
      </Button>
    );
  }

  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      language={i18n.language}
      onSelect={changeLanguage}
      trigger={
        <Button ref={triggerRef} variant="outline" size="sm" className="min-h-11 min-w-11 gap-2">
          {label}
        </Button>
      }
    />
  );
};

export default LanguageSwitcher;
