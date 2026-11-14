import type { Locale } from "../i18n";
import type { SplatKind } from "./paths";

export interface SplatUi {
  supportTitle: string;
  privacyTitle: string;
  indexTitle: string;
  supportLabel: string;
  privacyLabel: string;
  backToSupport: string;
  publisher: string;
  indexIntro: string;
  supportDescription: string;
  privacyDescription: string;
  indexDescription: string;
}

export const splatUi: Record<Locale, SplatUi> = {
  en: {
    supportTitle: "SplatDuo – Support",
    privacyTitle: "SplatDuo – Privacy Policy",
    indexTitle: "SplatDuo",
    supportLabel: "Support",
    privacyLabel: "Privacy policy",
    backToSupport: "Back to support",
    publisher: "Published by Narido SRL.",
    indexIntro: "Support and privacy for the SplatDuo iPhone game.",
    supportDescription:
      "SplatDuo is a game for iPhone: bugs crawl over a newspaper on your screen and you squash them with a finger.",
    privacyDescription: "SplatDuo does not collect, store or share any personal data.",
    indexDescription: "Support and privacy for the SplatDuo iPhone game.",
  },
  fr: {
    supportTitle: "SplatDuo – Assistance",
    privacyTitle: "SplatDuo – Politique de confidentialité",
    indexTitle: "SplatDuo",
    supportLabel: "Assistance",
    privacyLabel: "Politique de confidentialité",
    backToSupport: "Retour à l’assistance",
    publisher: "Publié par Narido SRL.",
    indexIntro: "Assistance et confidentialité pour le jeu iPhone SplatDuo.",
    supportDescription:
      "SplatDuo est un jeu pour iPhone : des bestioles se promènent sur un journal, à l'écran, et vous les écrasez du doigt.",
    privacyDescription: "SplatDuo ne collecte, ne conserve et ne partage aucune donnée personnelle.",
    indexDescription: "Assistance et confidentialité pour le jeu iPhone SplatDuo.",
  },
  nl: {
    supportTitle: "SplatDuo – Ondersteuning",
    privacyTitle: "SplatDuo – Privacybeleid",
    indexTitle: "SplatDuo",
    supportLabel: "Ondersteuning",
    privacyLabel: "Privacybeleid",
    backToSupport: "Terug naar ondersteuning",
    publisher: "Uitgegeven door Narido SRL.",
    indexIntro: "Ondersteuning en privacy voor het iPhone-spel SplatDuo.",
    supportDescription:
      "SplatDuo is een spel voor iPhone: beestjes kruipen over een krant op je scherm en jij plet ze met je vinger.",
    privacyDescription: "SplatDuo verzamelt, bewaart en deelt geen persoonsgegevens.",
    indexDescription: "Ondersteuning en privacy voor het iPhone-spel SplatDuo.",
  },
};

export function splatTitle(locale: Locale, kind: SplatKind): string {
  const ui = splatUi[locale];
  if (kind === "support") return ui.supportTitle;
  if (kind === "privacy") return ui.privacyTitle;
  return ui.indexTitle;
}

export function splatDescription(locale: Locale, kind: SplatKind): string {
  const ui = splatUi[locale];
  if (kind === "support") return ui.supportDescription;
  if (kind === "privacy") return ui.privacyDescription;
  return ui.indexDescription;
}
