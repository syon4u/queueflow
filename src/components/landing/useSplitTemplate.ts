import { useTranslation } from 'react-i18next';

/**
 * Splits a translated template around ONE interpolation slot so the slot can
 * be rendered as a live element (a rolling TicketNumber) instead of text.
 *
 * `split('public.preview.position', 'position')` on "You're #{{position}} in
 * line" returns ["You're #", " in line"]; ES/PT/HT put the number wherever
 * their grammar needs it and the split still lands on the right spot.
 * Never splits the English string — always the active locale's.
 */
const SLOT = '⁣'; // INVISIBLE SEPARATOR: cannot occur in copy

export function useSplitTemplate() {
  const { t } = useTranslation();
  return (key: string, slot: string, values: Record<string, string | number> = {}) => {
    const s = t(key, { ...values, [slot]: SLOT }) as string;
    const i = s.indexOf(SLOT);
    if (i === -1) return [s, ''] as const;
    return [s.slice(0, i), s.slice(i + SLOT.length)] as const;
  };
}
