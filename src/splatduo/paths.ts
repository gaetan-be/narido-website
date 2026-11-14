import type { Locale } from "../i18n";

export type SplatKind = "index" | "support" | "privacy";

export function splatHref(locale: Locale, kind: SplatKind): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const tail = kind === "index" ? "/" : `/${kind}/`;
  return `${prefix}/SplatDuo${tail}`;
}
