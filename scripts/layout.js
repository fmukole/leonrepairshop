/* Page shell: <head>, header, navigation, footer, floating WhatsApp button. */
const { cfg, esc, waHref, MESSAGES, icon, waIcon, asset } = require('./lib');
const categories = require('../src/data/categories');

const NAV = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/repairs/', label: 'Repair Services', icon: 'wrench' },
  { href: '/shop/', label: 'Flip Shop', icon: 'tag' },
  { href: '/sell/', label: 'Sell to Leon', icon: 'cash' },
  { href: '/spare-parts/', label: 'Spare Parts', icon: 'cog' },
  { href: '/contact/', label: 'Contact', icon: 'chat' },
];

const wordmark = () => `<span class="wordmark"><span>Leon</span> <b>Repair</b> <span>Shop</span></span>`;

function header(active) {
  const links = NAV.map((n) => {
    const on = n.href === '/' ? active === '/' : active.startsWith(n.href);
    return `<li><a href="${n.href}"${on ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('');
  const mobile = NAV.map((n) => {
    const on = n.href === '/' ? active === '/' : active.startsWith(n.href);
    return `<li><a href="${n.href}"${on ? ' aria-current="page"' : ''}>${icon(n.icon)}<span>${n.label}</span>${icon('arrow', 'i i--end')}</a></li>`;
  }).join('');
  return `
<a class="skip" href="#main">Skip to content</a>
<div class="topbar">
  <div class="wrap topbar__in">
    <p>Appliance repairs &middot; Refurbished &amp; second-hand goods &middot; Spare parts &middot; ${esc(cfg.city)}</p>
    <ul>
      ${cfg.phoneDisplay ? `<li><a href="tel:${esc(cfg.phoneLink)}">${icon('phone')}${esc(cfg.phoneDisplay)}</a></li>` : ''}
      ${cfg.email ? `<li><a href="mailto:${esc(cfg.email)}">${icon('mail')}${esc(cfg.email)}</a></li>` : ''}
    </ul>
  </div>
</div>
<header class="site-header" id="top">
  <div class="wrap site-header__in">
    <a class="brand" href="/" aria-label="${esc(cfg.name)} home">
      <img src="${asset('img/site/logo-96.webp')}" width="96" height="96" alt="" class="brand__logo">
      ${wordmark()}
    </a>
    <nav class="mainnav" aria-label="Main">
      <ul>${links}</ul>
    </nav>
    <a class="btn btn--wa btn--sm header-wa" href="${esc(waHref(MESSAGES.general))}" target="_blank" rel="noopener noreferrer">${waIcon()}<span>WhatsApp</span></a>
    <button class="navtoggle" type="button" aria-expanded="false" aria-controls="mobilenav" aria-label="Open menu">${icon('menu')}</button>
  </div>
</header>
<div class="mobilenav" id="mobilenav" hidden>
  <div class="mobilenav__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mobilenav__head">
      <a class="brand" href="/"><img src="${asset('img/site/logo-96.webp')}" width="96" height="96" alt="" class="brand__logo">${wordmark()}</a>
      <button class="navclose" type="button" aria-label="Close menu">${icon('x')}</button>
    </div>
    <ul class="mobilenav__list">${mobile}</ul>
    <div class="mobilenav__foot">
      <a class="btn btn--wa btn--block" href="${esc(waHref(MESSAGES.general))}" target="_blank" rel="noopener noreferrer">${waIcon()}Chat with Leon on WhatsApp</a>
      ${cfg.phoneDisplay ? `<a class="btn btn--ghost btn--block" href="tel:${esc(cfg.phoneLink)}">${icon('phone')}Call ${esc(cfg.phoneDisplay)}</a>` : ''}
    </div>
  </div>
</div>`;
}

function footer() {
  const cats = categories.slice(0, 7).map((c) => `<li><a href="/shop/category/${c.id}/">${esc(c.name)}</a></li>`).join('');
  const hours = cfg.hours.length
    ? cfg.hours.map((h) => `<li><span>${esc(h.days)}</span> ${esc(h.time)}</li>`).join('')
    : '<li>Message Leon for current trading hours</li>';
  const social = Object.entries(cfg.social).filter(([, u]) => u)
    .map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${icon(k)}</a>`).join('');
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand brand--light" href="/"><img src="${asset('img/site/logo-96.webp')}" width="96" height="96" alt="" class="brand__logo">${wordmark()}</a>
        <p class="footer__tag">${esc(cfg.tagline)}</p>
        <p>Appliance repairs, house calls, refurbished and second-hand goods, and spare parts in ${esc(cfg.city)}.</p>
        ${social ? `<div class="footer__social">${social}</div>` : ''}
      </div>
      <div>
        <h2 class="footer__h">Services</h2>
        <ul>
          <li><a href="/repairs/">Repair Services</a></li>
          <li><a href="/repairs/?type=house-call#book">House Calls</a></li>
          <li><a href="/sell/">Sell to Leon</a></li>
          <li><a href="/spare-parts/">Spare Parts</a></li>
          <li><a href="/how-it-works/">How It Works</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer__h">Flip Shop</h2>
        <ul>${cats}<li><a href="/shop/">All products</a></li></ul>
      </div>
      <div>
        <h2 class="footer__h">Contact</h2>
        <ul class="footer__contact">
          <li><a href="${esc(waHref(MESSAGES.general))}" target="_blank" rel="noopener noreferrer">${waIcon()}WhatsApp Leon</a></li>
          ${cfg.phoneDisplay ? `<li><a href="tel:${esc(cfg.phoneLink)}">${icon('phone')}${esc(cfg.phoneDisplay)}</a></li>` : ''}
          ${cfg.email ? `<li><a href="mailto:${esc(cfg.email)}">${icon('mail')}${esc(cfg.email)}</a></li>` : ''}
          <li>${icon('pin')}${cfg.streetAddress ? esc(cfg.streetAddress) + ', ' : ''}${esc(cfg.city)}, ${esc(cfg.region)}</li>
        </ul>
        <h2 class="footer__h footer__h--sm">Hours</h2>
        <ul class="footer__hours">${hours}</ul>
      </div>
    </div>
    <div class="footer__base">
      <p>&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(cfg.name)}. ${esc(cfg.city)}, South Africa.</p>
      <p>Purchases and repairs are arranged directly with Leon on WhatsApp.</p>
    </div>
  </div>
</footer>
<a class="fab-wa" href="${esc(waHref(MESSAGES.general))}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Leon on WhatsApp">${waIcon()}<span>Chat</span></a>`;
}

function breadcrumbs(trail) {
  if (!trail || !trail.length) return '';
  const items = [{ name: 'Home', href: '/' }, ...trail];
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((t, i) => i === items.length - 1
    ? `<li aria-current="page">${esc(t.name)}</li>`
    : `<li><a href="${t.href}">${esc(t.name)}</a></li>`).join('')}</ol></nav>`;
}

function breadcrumbLd(trail) {
  const items = [{ name: 'Home', href: '/' }, ...trail];
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: cfg.siteUrl + t.href })),
  };
}

function page({ title, description, path, body, jsonld = [], ogImage = '/assets/img/site/og-image.jpg', ogType = 'website', trail, noindex = false, bodyClass = '' }) {
  const url = cfg.siteUrl + path;
  const lds = [...jsonld, ...(trail ? [breadcrumbLd(trail)] : [])];
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(cfg.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(cfg.siteUrl + ogImage)}">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#20242B">
<link rel="icon" href="/assets/img/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('css/site.css')}">
${lds.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body class="${bodyClass}" data-wa="${esc(cfg.whatsapp)}">
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="${asset('js/site.js')}" defer></script>
</body>
</html>
`;
}

module.exports = { page, NAV, breadcrumbs };
