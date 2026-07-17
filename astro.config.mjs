// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Temporary Render address. TODO: replace with the group's real domain
  // once one is attached (see README section 3). Keep this in sync with
  // SITE_URL in src/site.config.ts and the Sitemap line in public/robots.txt.
  // Sitemap and canonical/OG URLs are generated from this.
  site: 'https://ladera-health-watch.onrender.com',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()],

  // Old standalone pages were merged into other pages for a leaner mobile nav
  // (see src/site.config.ts). These keep any existing links from 404ing.
  redirects: {
    '/pesticide-notices': '/what-we-know/#pesticide-notices',
    '/about': '/get-involved/#about',
  },

  // The dev-only floating toolbar (bottom-center pill with icons) is an Astro
  // dev-server feature, not part of the site: it never appears in a
  // production build. Disabled here since it was being mistaken for a bug.
  devToolbar: {
    enabled: false
  }
});