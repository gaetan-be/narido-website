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
  redirects: {
    '/splatduo': '/SplatDuo/',
    '/splatduo/support': '/SplatDuo/support/',
    '/splatduo/privacy': '/SplatDuo/privacy/',
    '/fr/splatduo': '/fr/SplatDuo/',
    '/fr/splatduo/support': '/fr/SplatDuo/support/',
    '/fr/splatduo/privacy': '/fr/SplatDuo/privacy/',
    '/nl/splatduo': '/nl/SplatDuo/',
    '/nl/splatduo/support': '/nl/SplatDuo/support/',
    '/nl/splatduo/privacy': '/nl/SplatDuo/privacy/',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/splatduo(\/|$)/i.test(page),
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
