/*
 * Builds the whole website into /dist.
 *
 *   npm run build
 *
 * Reads src/config.js, src/data/*.js and writes plain HTML pages, so the
 * site can be hosted anywhere that serves static files (Netlify, cPanel…).
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Always load fresh data (so `npm run dev` picks up edits)
for (const k of Object.keys(require.cache)) if (k.includes(path.join(ROOT, 'src'))) delete require.cache[k];

const cfg = require('../src/config');
const products = require('../src/data/products');
const categories = require('../src/data/categories');
const sizes = require('../src/data/image-sizes.json');
const { CONDITIONS, AVAIL } = require('./lib');
const pages = require('./pages');

/* ---------- check the catalogue so mistakes are caught before going live ---------- */
const errors = [];
const ids = new Set();
const catIds = new Set(categories.map((c) => c.id));
products.forEach((p, i) => {
  const where = `products.js item ${i + 1} (${p.id || 'no id'})`;
  if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) errors.push(`${where}: id must be lowercase letters, numbers and dashes`);
  if (ids.has(p.id)) errors.push(`${where}: id is used twice`);
  ids.add(p.id);
  if (!p.name) errors.push(`${where}: missing name`);
  if (!catIds.has(p.category)) errors.push(`${where}: unknown category "${p.category}"`);
  if (!CONDITIONS[p.condition]) errors.push(`${where}: condition must be one of ${Object.keys(CONDITIONS).join(', ')}`);
  if (!AVAIL[p.availability]) errors.push(`${where}: availability must be one of ${Object.keys(AVAIL).join(', ')}`);
  if (p.price != null && (typeof p.price !== 'number' || p.price < 0)) errors.push(`${where}: price must be a number like 2450, or null`);
  if (!Array.isArray(p.images) || !p.images.length) errors.push(`${where}: needs at least one image`);
  else p.images.forEach((k) => { if (!sizes['products/' + k]) errors.push(`${where}: photo "${k}" not found — put it in /product-photos and run npm run images`); });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.dateAdded || '')) errors.push(`${where}: dateAdded must look like 2026-11-23`);
  p.specs = p.specs || [];
});
if (errors.length) {
  console.error('\nThe catalogue has problems:\n  - ' + errors.join('\n  - ') + '\n');
  process.exit(1);
}

/* ---------- write pages ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
const out = [];
const write = (r) => {
  const file = r.file || path.join(r.path.replace(/^\//, ''), 'index.html');
  const full = path.join(DIST, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, r.html);
  out.push(r.path);
};

write(pages.home(products));
write(pages.repairs());
write(pages.shop(products));
categories.forEach((c) => write(pages.category(c, products)));
products.forEach((p) => write(pages.product(p, products)));
write(pages.sell());
write(pages.spareParts(products));
write(pages.howItWorks());
write(pages.contact());
write(pages.notFound());

/* ---------- copy static assets ---------- */
fs.cpSync(path.join(ROOT, 'src/assets'), path.join(DIST, 'assets'), {
  recursive: true,
  filter: (src) => !/logo-src\.png$/.test(src),
});

/* ---------- minify CSS (strip comments and whitespace) ---------- */
const cssFile = path.join(DIST, 'assets/css/site.css');
const cssIn = fs.readFileSync(cssFile, 'utf8');
const cssOut = cssIn
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\n\s*/g, '')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}');
fs.writeFileSync(cssFile, cssOut);

/* ---------- SEO files ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((u) => u !== '/404.html').map((u) => {
  const prod = products.find((p) => u === `/shop/${p.id}/`);
  return `  <url><loc>${cfg.siteUrl}${u}</loc><lastmod>${prod ? prod.dateAdded : today}</lastmod></url>`;
});
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'site.webmanifest'), JSON.stringify({ name: cfg.name, short_name: cfg.shortName, start_url: '/', display: 'browser', background_color: '#ffffff', theme_color: '#20242B', icons: [{ src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }] }));

const live = products.filter((p) => p.availability !== 'sold').length;
console.log(`Built ${out.length} pages into /dist  (${products.length} products, ${live} on sale).`);
