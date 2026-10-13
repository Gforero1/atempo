// Copia estática de respaldo (por ejemplo para GitHub Pages) a partir de content/default.json.
// En Cloudflare la web la sirven las Functions con el contenido que Adelina guarda en /admin.
// Uso: node build.mjs
import fs from 'node:fs';
import { renderPage, renderLegal } from './src/render.mjs';

const content = JSON.parse(fs.readFileSync(new URL('./content/default.json', import.meta.url)));
const v = Date.now().toString(36);
const site = content.settings.site;
fs.mkdirSync('en', { recursive: true });
fs.writeFileSync('index.html', renderPage(content, 'es', { mode: 'rel', version: v }));
fs.writeFileSync('en/index.html', renderPage(content, 'en', { mode: 'rel', version: v }));
fs.writeFileSync('privacidad.html', renderLegal(content, 'es', { mode: 'rel', version: v }));
fs.writeFileSync('en/privacy.html', renderLegal(content, 'en', { mode: 'rel', version: v }));
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>${site}/</loc><xhtml:link rel="alternate" hreflang="en" href="${site}/en/"/><xhtml:link rel="alternate" hreflang="es" href="${site}/"/></url>
<url><loc>${site}/en/</loc><xhtml:link rel="alternate" hreflang="es" href="${site}/"/><xhtml:link rel="alternate" hreflang="en" href="${site}/en/"/></url>
</urlset>
`);
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${site}/sitemap.xml\n`);
console.log('ok', v);
