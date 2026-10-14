export type Locale = 'en';

export type Accent = 'coral' | 'sunflower' | 'teal' | 'ink';

export interface Service {
  id: string;
  index: string;
  accent: Accent;
  title: string;
  text: string;
}

export interface Project {
  id: string;
  index: string;
  accent: Accent;
  title: string;
  href: string;
  link: string;
  paragraphs: string[];
  note?: string;
}

export interface Era {
  id: string;
  accent: Accent;
  title: string;
  text: string;
}

export interface NeedOption {
  value: string;
  label: string;
}

export interface SiteCopy {
  meta: {
    lang: Locale;
    title: string;
    description: string;
    ogAlt: string;
  };
  nav: {
    home: string;
    services: string;
    work: string;
    background: string;
    contact: string;
    menu: string;
    close: string;
    cta: string;
    skip: string;
    landmark: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleTail: string;
    lede: string;
    primary: string;
    secondary: string;
  };
  services: {
    title: string;
    intro: string;
    items: Service[];
  };
  work: {
    title: string;
    intro: string;
    visit: string;
    newTab: string;
    projects: Project[];
  };
  background: {
    title: string;
    intro: string;
    eras: Era[];
  };
  contact: {
    title: string;
    intro: string;
    name: string;
    emailLabel: string;
    need: string;
    needPlaceholder: string;
    needs: NeedOption[];
    message: string;
    submit: string;
    hint: string;
    sent: string;
    subjectPrefix: string;
    direct: string;
    linkedin: string;
    detailsTitle: string;
    company: string;
    owner: string;
    country: string;
    countryLabel: string;
    vatLabel: string;
    vat: string;
    addressLabel: string;
    address: string;
    email: string;
    linkedinUrl: string;
  };
  footer: {
    positioning: string;
    rights: string;
  };
  notFound: {
    title: string;
    text: string;
    cta: string;
  };
}
