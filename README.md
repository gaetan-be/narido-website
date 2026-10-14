# Narido

Website for Narido, Gaëtan Denaisse's one-person IT company in Belgium.

English copy lives in `src/i18n/en.ts`. French and Dutch can be added as new dictionaries and listed in `astro.config.mjs`.

## Develop

Requires Node 22 or newer.

```sh
npm install
npm run dev
npm run build
```

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`, which publishes the site with GitHub Pages. `public/CNAME` sets the custom domain to `narido.eu`.

In the repository settings:

1. Make the repository public, unless the GitHub plan includes Pages for private repositories.
2. Set Pages → Build and deployment → Source to **GitHub Actions**.
3. After the first deploy, enable **Enforce HTTPS**.

## DNS

At the DNS host for `narido.eu`:

Apex (`narido.eu`):

- A `185.199.108.153`
- A `185.199.109.153`
- A `185.199.110.153`
- A `185.199.111.153`
- AAAA `2606:50c0:8000::153`
- AAAA `2606:50c0:8001::153`
- AAAA `2606:50c0:8002::153`
- AAAA `2606:50c0:8003::153`

`www.narido.eu`:

- CNAME `gaetan-be.github.io`

Then enable Enforce HTTPS in the GitHub Pages settings.
