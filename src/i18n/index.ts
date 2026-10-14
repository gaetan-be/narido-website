import { en } from './en';
import type { Locale, SiteCopy } from './types';

// Add a locale by creating src/i18n/<code>.ts, listing it here, and adding
// the code to `locales` in astro.config.mjs. French and Dutch are not
// shipped yet; the shape of SiteCopy is what a new dictionary must match.
const dictionaries: Record<Locale, SiteCopy> = {
  en,
};

export const defaultLocale: Locale = 'en';

export function getCopy(locale: Locale = defaultLocale): SiteCopy {
  return dictionaries[locale];
}

export type { Accent, Locale, SiteCopy } from './types';
