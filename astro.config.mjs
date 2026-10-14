// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// English at /, French at /fr/, Dutch at /nl/.
export default defineConfig({
  site: 'https://narido.eu',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'nl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          fr: 'fr-BE',
          nl: 'nl-BE',
        },
      },
      serialize(item) {
        const links = item.links ? [...item.links] : [];
        const english = links.find((link) => link.lang === 'en');
        if (english && !links.some((link) => link.lang === 'x-default')) {
          links.push({ lang: 'x-default', url: english.url });
        }
        return { ...item, links };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
