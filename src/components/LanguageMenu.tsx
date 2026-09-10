import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGES } from '@/i18n/languages';

interface LanguageMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current i18n language code. */
  language: string;
  onSelect: (code: string) => void;
  /** The trigger button element (rendered via `asChild`, so it keeps its own markup). */
  trigger: React.ReactElement;
}

/**
 * The dropdown half of LanguageSwitcher. Lives in its own chunk: the radix
 * menu stack (menu, popper, floating-ui, focus scope...) is ~45 kB gzip and
 * is not needed to paint the trigger button.
 */
const LanguageMenu: React.FC<LanguageMenuProps> = ({ open, onOpenChange, language, onSelect, trigger }) => (
  <DropdownMenu open={open} onOpenChange={onOpenChange}>
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {LANGUAGES.map((item) => (
        <DropdownMenuItem
          key={item.code}
          onClick={() => onSelect(item.code)}
          className={language === item.code ? 'bg-muted' : ''}
        >
          {item.name}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default LanguageMenu;
