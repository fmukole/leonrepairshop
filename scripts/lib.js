/* Shared helpers for the build: escaping, prices, WhatsApp links, images, icons. */
const path = require('path');
const cfg = require('../src/config');
const sizes = require('../src/data/image-sizes.json');

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const rand = (n) => (n == null ? 'Ask for price' : 'R' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '));

const waHref = (msg) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`;

const MESSAGES = {
  general: 'Hello Leon, I found you on your website and have a question.',
  repair: 'Hello Leon, I would like to book a repair.',
  houseCall: 'Hello Leon, I would like to request a house call.',
  sell: 'Hello Leon, I have an item I would like to sell to you.',
  parts: 'Hello Leon, I am looking for a spare part. I will send a photo of the part and the appliance label.',
  product: (p) => `Hello Leon, I am interested in the ${p.name}${p.price != null ? ` (${rand(p.price).replace(' ', ' ')})` : ''}. Is this item still available?\nRef: ${p.id}`,
  similar: (p) => `Hello Leon, I saw the ${p.name} on your website is sold. Do you have anything similar?`,
};

const CONDITIONS = {
  'new': { label: 'New', schema: 'NewCondition', note: 'Brand new, unused.' },
  'refurbished': { label: 'Refurbished', schema: 'RefurbishedCondition', note: 'Repaired, cleaned and tested in Leon’s workshop.' },
  'pre-owned': { label: 'Pre-owned', schema: 'UsedCondition', note: 'Used and in working order.' },
  'used-as-is': { label: 'Used – as is', schema: 'UsedCondition', note: 'Sold in its current state. Check it before you buy.' },
};
const AVAIL = {
  available: { label: 'Available', schema: 'InStock' },
  reserved: { label: 'Reserved', schema: 'LimitedAvailability' },
  sold: { label: 'Sold', schema: 'SoldOut' },
};

/* Content fingerprint for an asset, e.g. asset('css/site.css') -> '/assets/css/site.css?v=1a2b3c4d'.
 * The URL changes only when the file changes, so browsers can cache assets for a year. */
const fs = require('fs');
const crypto = require('crypto');
const ASSETS = path.join(__dirname, '..', 'src', 'assets');
const hashes = {};
function asset(rel) {
  if (!(rel in hashes)) {
    const file = path.join(ASSETS, rel);
    hashes[rel] = fs.existsSync(file) ? crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8) : '0';
  }
  return `/assets/${rel}?v=${hashes[rel]}`;
}

/* Responsive image. key = 'site/hero-counter' or 'products/fridge-01'
 * Offers every generated width (420 / 700 / 1000 / full) so each screen downloads only what it needs. */
function img(key, alt, { sizes: sz = '(min-width: 1024px) 33vw, 100vw', cls = '', eager = false } = {}) {
  const lg = sizes[key];
  if (!lg) { console.warn('  ! image not found:', key); return `<div class="img-missing ${cls}" role="img" aria-label="${esc(alt)}"></div>`; }
  const seen = new Set();
  const variants = ['-xs', '-sm', '-md', ''].filter((s) => sizes[key + s])
    .map((s) => ({ url: asset(`img/${key}${s}.webp`), w: sizes[key + s][0] }))
    .filter((v) => (seen.has(v.w) ? false : seen.add(v.w)));
  const fallback = variants.find((v) => v.w >= 600) || variants[variants.length - 1];
  const srcset = variants.map((v) => `${v.url} ${v.w}w`).join(', ');
  return `<img src="${fallback.url}" srcset="${srcset}" sizes="${sz}" width="${lg[0]}" height="${lg[1]}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${cls ? ` class="${cls}"` : ''}>`;
}
const imgUrl = (key) => asset(`img/${key}.webp`);

/* Line icons (24px grid, stroke). */
const P = {
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
  tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  truck: '<path d="M10 17h4V5H2v12h3"/><path d="M14 8h4l4 4v5h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  plug: '<path d="M12 22v-5"/><path d="M9 8V2M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>',
  fridge: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14M9 5v2M9 13v3"/>',
  freezer: '<path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/>',
  washer: '<rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7 6h.01M10 6h.01"/>',
  dryer: '<rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M9.6 13c.8-.8 1.6.8 2.4 0s1.6.8 2.4 0M7 6h.01"/>',
  dishwasher: '<rect x="3" y="2" width="18" height="20" rx="2"/><path d="M3 7h18M7 4.5h.01M10 4.5h.01M8 12h8M8 16h8"/>',
  stove: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8" r="2"/><circle cx="15.5" cy="8" r="2"/><path d="M3 12h18M7 16h10"/>',
  oven: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18"/><rect x="7" y="11" width="10" height="7" rx="1"/><path d="M7 5.5h.01M11 5.5h.01"/>',
  microwave: '<rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9h.01M18 12h.01M18 15h.01"/>',
  kettle: '<path d="M7 21h10a2 2 0 0 0 2-2l-1-9H6l-1 9a2 2 0 0 0 2 2z"/><path d="M6 10 7 5h10l1 5"/><path d="M19 12h1.5a1.5 1.5 0 0 1 0 3H19"/>',
  blender: '<path d="M8 2h8l-1 13H9L8 2z"/><rect x="7" y="15" width="10" height="7" rx="1.5"/><path d="M12 18.5h.01"/>',
  mixer: '<path d="M4 12h16a8 8 0 0 1-16 0z"/><path d="M12 12V3M9 3h6"/>',
  airfryer: '<rect x="4" y="3" width="16" height="18" rx="4"/><rect x="7" y="11" width="10" height="7" rx="1"/><circle cx="12" cy="7" r="1.5"/>',
  vacuum: '<circle cx="7" cy="17" r="4"/><path d="M10 15 18 3h3"/><path d="M14 21h6"/>',
  toaster: '<rect x="3" y="9" width="18" height="12" rx="3"/><path d="M8 9V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4"/><path d="M21 14h1"/>',
  tv: '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8M12 18v3"/>',
  speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M12 6h.01"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  drill: '<path d="M3 6h11v6H3z"/><path d="M14 8h4M18 9h3"/><path d="M6 12l-1 9h4l1-9"/>',
  disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/>',
  saw: '<circle cx="12" cy="12" r="8"/><path d="M12 4l1.5 2M20 12l-2 1.5M12 20l-1.5-2M4 12l2-1.5"/><circle cx="12" cy="12" r="1.5"/>',
  hammer: '<path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
  motor: '<circle cx="9" cy="12" r="6"/><path d="M15 12h7M9 9v6"/>',
  laptop: '<rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 20h20"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  sofa: '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z"/><path d="M5 18v2M19 18v2"/>',
  filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12A9 9 0 0 1 18.5 5.8L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
};
const icon = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.wrench}</svg>`;
const waIcon = (cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42a9.36 9.36 0 0 1 6.66 2.76 9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42zm8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.7 5.84.7 12.1c0 2 .52 3.95 1.52 5.67L.6 23.25l5.61-1.47a11.33 11.33 0 0 0 5.83 1.6h.01c6.25 0 11.34-5.09 11.34-11.35 0-3.03-1.18-5.88-3.33-8.02z"/></svg>`;

module.exports = { cfg, esc, rand, waHref, MESSAGES, CONDITIONS, AVAIL, img, imgUrl, asset, icon, waIcon, path };
