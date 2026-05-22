import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://www.reichentrog-kollegen.de';

export default defineConfig({
  site,
  /** Eigener Port — nicht 4321 (häufig anderes Projekt / OMB). Immer aus diesem Ordner starten. */
  server: {
    port: 5175,
    host: true,
    strictPort: true,
  },
  vite: {
    server: {
      // Erlaubt Tunnel-Domains (z. B. *.loca.lt / *.tunnelmole.net) für externe Vorschau-Links.
      allowedHosts: true,
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.endsWith('/danke/') && !page.endsWith('/404/'),
    }),
  ],
});
