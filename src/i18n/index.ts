import { en } from './en';
import { fr } from './fr';
import { nl } from './nl';
import type { HtmlLang, Locale, SiteCopy } from './types';

const dictionaries: Record<Locale, SiteCopy> = {
  en,
  fr,
  nl,
};

export const defaultLocale: Locale = 'en';

export const locales: { locale: Locale; label: string; htmlLang: HtmlLang; ogLocale: string; href: string }[] = [
  { locale: 'en', label: 'EN', htmlLang: 'en', ogLocale: 'en_GB', href: '/' },
  { locale: 'fr', label: 'FR', htmlLang: 'fr-BE', ogLocale: 'fr_BE', href: '/fr/' },
  { locale: 'nl', label: 'NL', htmlLang: 'nl-BE', ogLocale: 'nl_BE', href: '/nl/' },
];

export function getCopy(locale: Locale = defaultLocale): SiteCopy {
  return dictionaries[locale];
}

export function homePath(locale: Locale): string {
  return locales.find((item) => item.locale === locale)?.href ?? '/';
}

export type { Accent, HtmlLang, Locale, SiteCopy } from './types';
