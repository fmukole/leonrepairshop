/* Every page of the site. Each function returns { path, html }. */
const { cfg, esc, rand, waHref, MESSAGES, CONDITIONS, AVAIL, img, imgUrl, icon, waIcon } = require('./lib');
const { page } = require('./layout');
const C = require('./components');
const categories = require('../src/data/categories');
const services = require('../src/data/services');

const wa = (msg, label, cls = 'btn btn--wa') => `<a class="${cls}" href="${esc(waHref(msg))}" target="_blank" rel="noopener noreferrer">${waIcon()}${label}</a>`;
const btn = (href, label, cls = 'btn btn--primary') => `<a class="${cls}" href="${href}">${label}</a>`;
const live = (products) => products.filter((p) => p.availability !== 'sold');

const applianceOptions = () => Object.fromEntries(services.map((g) => [g.name, g.items.map((i) => i.name)]));

const localBusiness = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': cfg.siteUrl + '/#business',
  name: cfg.name,
  description: 'Appliance repairs, house calls, refurbished and second-hand appliances, power tools, spare parts and household goods in Cape Town.',
  url: cfg.siteUrl + '/',
  logo: cfg.siteUrl + '/assets/img/icon-512.png',
  image: cfg.siteUrl + '/assets/img/site/og-image.jpg',
  ...(cfg.phoneLink ? { telephone: cfg.phoneLink } : {}),
  ...(cfg.email ? { email: cfg.email } : {}),
  address: { '@type': 'PostalAddress', addressLocality: cfg.city, addressRegion: cfg.region, addressCountry: cfg.country, ...(cfg.streetAddress ? { streetAddress: cfg.streetAddress } : {}) },
  areaServed: { '@type': 'City', name: cfg.city },
  priceRange: 'R',
  ...(Object.values(cfg.social).some(Boolean) ? { sameAs: Object.values(cfg.social).filter(Boolean) } : {}),
});

/* ------------------------------------------------------------------ HOME */
function home(products) {
  const featured = live(products).filter((p) => p.featured).slice(0, 8);
  const catCards = categories.filter((c) => c.id !== 'electrical').map((c) => {
    const n = live(products).filter((p) => p.category === c.id).length;
    return `<a class="catcard" href="/shop/category/${c.id}/">
      <div class="catcard__img">${img(c.image, '', { sizes: '(min-width: 1024px) 25vw, 50vw' })}</div>
      <div class="catcard__body"><h3>${esc(c.name)}</h3><p>${n ? `${n} item${n === 1 ? '' : 's'} in stock` : 'Ask what’s in'}</p></div>
    </a>`;
  }).join('');

  const journeys = [
    { key: 'Repair', icon: 'wrench', steps: ['Select your appliance', 'Describe the problem', 'WhatsApp Leon', 'Arrange the repair'], href: '/repairs/#book', cta: 'Book a repair' },
    { key: 'Buy', icon: 'tag', steps: ['Browse the Flip Shop', 'Choose an item', 'WhatsApp Leon', 'Arrange collection or delivery'], href: '/shop/', cta: 'Browse products' },
    { key: 'Sell', icon: 'cash', steps: ['Send your item’s details', 'Leon assesses it', 'Receive an offer', 'Arrange collection or drop-off'], href: '/sell/', cta: 'Sell an item' },
  ].map((j) => `<div class="journey">
      <div class="journey__head">${icon(j.icon)}<h3>${j.key}</h3></div>
      <ol class="steps">${j.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      <a class="link-arrow" href="${j.href}">${j.cta}${icon('arrow')}</a>
    </div>`).join('');

  const why = [
    ['wrench', 'Affordable repairs', 'Fixing is often far cheaper than replacing. Leon tells you honestly whether a repair is worth it.'],
    ['refresh', 'Refurbished products', 'Appliances and tools that are cleaned, repaired and tested before they go on sale.'],
    ['truck', 'Convenient house calls', 'For fridges, washers and stoves that are hard to move, ask about a technician visit.'],
    ['cog', 'Spare parts on hand', 'Motors, compressors, boards and fittings saved from appliances Leon has stripped.'],
    ['leaf', 'Sustainable reuse', 'Every repaired or resold appliance is one less on a dumping site.'],
    ['chat', 'Personal service', 'You deal with Leon directly on WhatsApp. No call centres, no accounts.'],
  ].map(([i, h, t]) => `<li>${icon(i)}<div><h3>${h}</h3><p>${t}</p></div></li>`).join('');

  const body = `
<section class="hero">
  <div class="wrap hero__in">
    <div class="hero__text">
      <p class="eyebrow">${esc(cfg.city)} &middot; ${esc(cfg.tagline)}</p>
      <h1>Your Home. Your Appliances. <span>We’ve Got You Covered.</span></h1>
      <p class="lead">From appliance repairs and house calls to affordable refurbished appliances, second-hand electronics, power tools and household essentials, Leon makes it easier to repair, replace and save.</p>
      <div class="actions">
        ${btn('/repairs/#book', `${icon('wrench')}Book a repair`)}
        ${btn('/shop/', `${icon('tag')}Explore the Flip Shop`, 'btn btn--dark')}
        ${btn('/sell/', `${icon('cash')}Sell to Leon`, 'btn btn--ghost')}
      </div>
      <ul class="hero__facts">
        <li>${icon('check')}Workshop repairs &amp; house calls</li>
        <li>${icon('check')}Products tested before sale</li>
        <li>${icon('check')}Buy and book on WhatsApp</li>
      </ul>
    </div>
    <div class="hero__media">
      ${img('site/hero-counter', 'At the counter of the Cape Town repair shop, testing a customer’s appliance', { sizes: '(min-width: 1024px) 50vw, 100vw', eager: true, cls: 'hero__main' })}
      <figure class="hero__inset">
        ${img('site/washers-display', 'Refurbished washing machines ready for sale', { sizes: '200px' })}
        <figcaption>Refurbished &amp; ready</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="section divisions" aria-label="What Leon does">
  <div class="wrap divisions__grid">
    <article class="division division--repair">
      <div class="division__img">${img('site/microwave-repair', 'Microwave opened up on Leon’s workbench for repair', { sizes: '(min-width: 1024px) 50vw, 100vw' })}</div>
      <div class="division__body">
        <p class="eyebrow">Leon Repair Services</p>
        <h2>Something Broken? We’ll Help Fix It.</h2>
        <p>Repairs and maintenance for household appliances, electronics and power tools. Bring your equipment to Leon or enquire about a convenient house call.</p>
        ${btn('/repairs/', `Explore repair services${icon('arrow')}`)}
      </div>
    </article>
    <article class="division division--shop">
      <div class="division__img">${img('site/shop-street', 'Second-hand fridges, sofas and generators on display outside a shop', { sizes: '(min-width: 1024px) 50vw, 100vw' })}</div>
      <div class="division__body">
        <p class="eyebrow">Leon Flip Shop</p>
        <h2>Discover Great Products at Better Prices.</h2>
        <p>Shop affordable refurbished appliances, second-hand electronics, power tools, spare parts and household products.</p>
        ${btn('/shop/', `Explore the Flip Shop${icon('arrow')}`, 'btn btn--light')}
      </div>
    </article>
  </div>
</section>

<section class="section section--grey" aria-labelledby="cats-h">
  <div class="wrap">
    <div class="sechead">
      <div><p class="eyebrow">Flip Shop</p><h2 id="cats-h">Popular shop categories</h2></div>
      <a class="link-arrow" href="/shop/">View all products${icon('arrow')}</a>
    </div>
    <div class="catgrid">${catCards}</div>
  </div>
</section>

<section class="section" aria-labelledby="feat-h">
  <div class="wrap">
    <div class="sechead">
      <div><p class="eyebrow">In the shop</p><h2 id="feat-h">Featured products</h2></div>
      <a class="link-arrow" href="/shop/">Shop all${icon('arrow')}</a>
    </div>
    ${C.sampleNote()}
    <div class="pgrid pgrid--4">${featured.map((p) => C.productCard(p)).join('')}</div>
  </div>
</section>

<section class="section section--grey" aria-labelledby="how-h">
  <div class="wrap">
    <div class="sechead sechead--center">
      <p class="eyebrow">How it works</p>
      <h2 id="how-h">Repair, buy or sell in four simple steps</h2>
      <p class="lead">Everything happens on WhatsApp. No accounts, no checkout, no waiting on hold.</p>
    </div>
    <div class="journeys">${journeys}</div>
  </div>
</section>

<section class="section" aria-labelledby="why-h">
  <div class="wrap why">
    <div class="why__media">
      ${img('site/leon-shelves', 'Inside the workshop, surrounded by shelves of parts and hardware', { sizes: '(min-width: 1024px) 40vw, 100vw' })}
    </div>
    <div class="why__text">
      <p class="eyebrow">Why choose Leon</p>
      <h2 id="why-h">Practical help for the things your home runs on</h2>
      <ul class="why__list">${why}</ul>
    </div>
  </div>
</section>

<section class="band band--sell" aria-labelledby="sell-h">
  <div class="wrap band__in">
    <div class="band__media">${img('site/appliance-stack', 'Stack of second-hand microwaves and appliances bought by Leon', { sizes: '(min-width: 1024px) 30vw, 100vw' })}</div>
    <div class="band__text">
      <p class="eyebrow">Sell to Leon</p>
      <h2 id="sell-h">Have an Appliance You No Longer Need?</h2>
      <p>Leon buys selected working and faulty appliances, electronics and equipment. Send a few details and photos, and Leon will tell you whether he can make an offer.</p>
      <div class="actions">${btn('/sell/', `Sell your item${icon('arrow')}`)}</div>
    </div>
  </div>
</section>

<section class="cta" aria-labelledby="cta-h">
  <div class="wrap cta__in">
    <div>
      <h2 id="cta-h">Need Help? Let’s Talk.</h2>
      <p>Send Leon a message about a repair, a product or something you want to sell.</p>
    </div>
    <div class="actions">
      ${wa(MESSAGES.general, 'Chat with Leon', 'btn btn--wa btn--lg')}
      ${cfg.phoneDisplay ? `<a class="btn btn--outline-light btn--lg" href="tel:${esc(cfg.phoneLink)}">${icon('phone')}${esc(cfg.phoneDisplay)}</a>` : ''}
    </div>
  </div>
</section>

<section class="band band--housecall" id="house-calls" aria-labelledby="hc-h">
  <div class="wrap band__in">
    <div class="band__media">${img('site/leon-fridge', 'Checking a fridge in the workshop', { sizes: '(min-width: 1024px) 40vw, 100vw' })}</div>
    <div class="band__text">
      <p class="eyebrow">House Calls</p>
      <h2 id="hc-h">Appliance Help at Your Doorstep.</h2>
      <p>Fridges, washing machines and stoves are heavy and awkward to move. Request a technician visit and Leon comes to you for assessment, diagnosis, repair or installation help.</p>
      <ul class="ticks ticks--cols">
        <li>${icon('check')}Assessment on site</li>
        <li>${icon('check')}Fault diagnosis</li>
        <li>${icon('check')}Repairs where parts are available</li>
        <li>${icon('check')}Installation help</li>
      </ul>
      ${cfg.serviceAreas.length ? `<p class="hc-areas">${icon('pin')}<span><b>Areas we visit:</b> ${cfg.serviceAreas.map(esc).join(', ')}</span></p>` : ''}
      <div class="actions">
        ${btn('/repairs/?type=house-call#book', `${icon('calendar')}Request a house call`)}
        ${wa(MESSAGES.houseCall, 'Ask on WhatsApp', 'btn btn--ghost')}
      </div>
    </div>
  </div>
</section>`;
  return {
    path: '/',
    html: page({
      path: '/',
      title: `Appliance Repairs & Refurbished Appliances Cape Town | Leon`,
      description: 'Appliance repairs, house calls, refurbished and second-hand appliances, used power tools and spare parts in Cape Town. Book, buy or sell on WhatsApp.',
      body,
      jsonld: [localBusiness(), { '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.name, url: cfg.siteUrl + '/' }],
      bodyClass: 'page-home',
    }),
  };
}

/* --------------------------------------------------------------- REPAIRS */
function repairs() {
  const trail = [{ name: 'Repair Services', href: '/repairs/' }];
  const groups = services.map((g) => `
<section class="svcgroup" id="${g.id}" aria-labelledby="${g.id}-h">
  <div class="svcgroup__head">
    <div class="svcgroup__img">${img(g.image, '', { sizes: '(min-width: 1024px) 320px, 100vw' })}</div>
    <div>
      <h2 id="${g.id}-h">${esc(g.name)}</h2>
      <p>${esc(g.intro)}</p>
    </div>
  </div>
  <ul class="svcgrid">
    ${g.items.map((i) => `<li class="svc">
      <span class="svc__icon">${icon(i.icon)}</span>
      <h3>${esc(i.name)}</h3>
      <p>${esc(i.desc)}</p>
      <a class="link-arrow" href="?item=${encodeURIComponent(i.name)}#book" data-book="${esc(i.name)}">Book repair${icon('arrow')}</a>
    </li>`).join('')}
  </ul>
</section>`).join('');

  const body = `
${C.pageHero({
    trail, eyebrow: 'Leon Repair Services',
    title: 'Appliance Repairs Made Easier.',
    lead: 'Fridges, washing machines, stoves, microwaves, TVs and power tools, assessed and repaired by Leon in his Cape Town workshop, or at your home where a house call makes sense.',
    actions: `${btn('#book', `${icon('wrench')}Book a repair`)}<a class="btn btn--ghost" href="?type=house-call#book" data-housecall>${icon('truck')}Request a house call</a>`,
    image: 'site/tech-microwave', imageAlt: 'Technician repairing a microwave in Leon’s workshop',
  })}
<section class="section section--tight">
  <div class="wrap">
    <nav class="jumpnav" aria-label="Repair categories"><ul>
      ${services.map((g) => `<li><a href="#${g.id}">${esc(g.name)}</a></li>`).join('')}
      <li><a href="#recycling">Recycling</a></li>
      <li><a href="#book">Book a repair</a></li>
    </ul></nav>
    ${groups}
  </div>
</section>

<section class="band band--parts" id="recycling" aria-labelledby="rec-h">
  <div class="wrap band__in">
    <div class="band__text">
      <p class="eyebrow">Recycling</p>
      <h2 id="rec-h">We Recycle Electrical and Electronic Components.</h2>
      <p>What can’t be repaired doesn’t go to the dump. Leon recycles electrical and electronic components, including PC and mobile phone boards, and copper from fridge tanks.</p>
      <ul class="recycle">
        <li>${icon('cpu')}<span>PC boards</span></li>
        <li>${icon('phone')}<span>Mobile phone boards</span></li>
        <li>${icon('fridge')}<span>Copper from fridge tanks</span></li>
        <li>${icon('bolt')}<span>Electrical components</span></li>
      </ul>
      <div class="actions">${wa('Hello Leon, I have electrical or electronic items for recycling. Can I bring them to you?', 'Ask about recycling')}</div>
    </div>
    <div class="band__media">${img('site/compressor', 'Fridge compressor tank kept for its copper and parts', { sizes: '(min-width: 1024px) 30vw, 100vw' })}</div>
  </div>
</section>

<section class="section section--grey" id="book" aria-labelledby="book-h">
  <div class="wrap formwrap">
    <div class="formwrap__aside">
      <p class="eyebrow">Repair enquiry</p>
      <h2 id="book-h">Tell Leon what needs fixing</h2>
      <p>Fill this in and WhatsApp opens with your enquiry ready to send. Add photos or a short video of the fault in the chat. It helps Leon give you a quicker answer.</p>
      <ol class="steps steps--plain">
        <li>Leon reads your message and may ask for a photo.</li>
        <li>He tells you whether it’s worth repairing and what the next step is.</li>
        <li>You drop it off, or Leon arranges a house call.</li>
      </ol>
      <p class="note">${icon('info')}<span>There are no fixed prices online. Every appliance is different, so Leon quotes after assessing it.</span></p>
    </div>
    <form class="form card" data-wa-form data-intro="Hello Leon, I would like to book a repair." novalidate>
      <fieldset class="form__step"><legend><span>1</span>Appliance or equipment</legend>
        ${C.select({ name: 'appliance', label: 'What needs repairing?', options: applianceOptions() })}
        ${C.field({ name: 'brand', label: 'Brand and model', required: false, placeholder: 'e.g. Defy, Samsung, Bosch …', max: 80 })}
      </fieldset>
      <fieldset class="form__step"><legend><span>2</span>The problem</legend>
        ${C.textarea({ name: 'problem', label: 'Describe the problem', required: true, placeholder: 'e.g. The fridge runs but isn’t cold. It started making a clicking noise last week.' })}
      </fieldset>
      <fieldset class="form__step"><legend><span>3</span>Workshop or house call</legend>
        <div class="choice" role="radiogroup">
          <label class="choice__opt"><input type="radio" name="where" value="Workshop repair (I will bring it in)" data-label="Repair type" required checked><span>${icon('wrench')}<b>Workshop repair</b><small>Bring it to Leon</small></span></label>
          <label class="choice__opt"><input type="radio" name="where" value="House call" data-label="Repair type"><span>${icon('truck')}<b>House call</b><small>Leon comes to you</small></span></label>
        </div>
      </fieldset>
      <fieldset class="form__step"><legend><span>4</span>Your suburb</legend>
        ${C.field({ name: 'suburb', label: 'Suburb', required: true, placeholder: 'e.g. Parow, Bellville, Khayelitsha', max: 60, auto: 'address-level2' })}
      </fieldset>
      <fieldset class="form__step"><legend><span>5</span>Your details</legend>
        <div class="grid2">
          ${C.field({ name: 'name', label: 'Your name', required: true, max: 60, auto: 'name' })}
          ${C.select({ name: 'contact', label: 'Best way to reach you', options: ['WhatsApp this number', 'Phone call', 'Either'], required: true })}
        </div>
      </fieldset>
      ${C.formEnd('Send repair enquiry')}
    </form>
  </div>
</section>`;
  return {
    path: '/repairs/',
    html: page({
      path: '/repairs/', trail,
      title: `Fridge & Washing Machine Repairs Cape Town | ${cfg.name}`,
      description: 'Fridge, freezer, washing machine, stove, microwave, TV and power tool repairs in Cape Town. Workshop repairs or house calls. Book on WhatsApp.',
      body,
      jsonld: [{
        '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Appliance repair',
        provider: { '@id': cfg.siteUrl + '/#business' }, areaServed: { '@type': 'City', name: cfg.city },
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Repair services', itemListElement: services.flatMap((g) => g.items.map((i) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `${i.name} repair` } }))) },
      }],
    }),
  };
}

/* ------------------------------------------------------------------ SHOP */
function shop(products) {
  const trail = [{ name: 'Flip Shop', href: '/shop/' }];
  const featured = live(products).filter((p) => p.featured).slice(0, 4);
  const recent = [...live(products)].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 4);
  const body = `
<section class="shophero">
  <div class="wrap">
    ${require('./layout').breadcrumbs(trail)}
    <div class="shophero__in">
      <div>
        <p class="eyebrow">Leon Flip Shop</p>
        <h1>Flip Shop</h1>
        <p class="lead">Refurbished appliances, second-hand electronics, power tools, spare parts and household goods. Found something? Enquire on WhatsApp. No cart, no checkout.</p>
      </div>
      <form class="search" role="search" action="/shop/" data-search-form>
        <label class="sr-only" for="shop-q">Search products</label>
        ${icon('search')}
        <input id="shop-q" name="q" type="search" placeholder="Search fridges, drills, microwaves…" maxlength="60" autocomplete="off" data-search>
        <button class="btn btn--primary btn--sm" type="submit">Search</button>
      </form>
    </div>
    ${C.catPills(null, products)}
  </div>
</section>
<div class="wrap">${C.sampleNote()}</div>
<section class="section section--tight" aria-labelledby="sf-h" data-hide-on-search>
  <div class="wrap">
    <div class="sechead"><div><h2 id="sf-h" class="h3">Featured</h2></div></div>
    <div class="pgrid pgrid--4 pgrid--scroll">${featured.map((p) => C.productCard(p)).join('')}</div>
  </div>
</section>
<section class="section section--tight" aria-labelledby="sr-h" data-hide-on-search>
  <div class="wrap">
    <div class="sechead"><div><h2 id="sr-h" class="h3">Recently added</h2></div></div>
    <div class="pgrid pgrid--4 pgrid--scroll">${recent.map((p) => C.productCard(p)).join('')}</div>
  </div>
</section>
<div class="wrap section section--tight">${C.shopListing(products, { heading: 'All products' })}</div>
<section class="section section--grey section--tight">
  <div class="wrap minicta">
    <div><h2 class="h3">Looking for something specific?</h2><p>Leon’s stock changes weekly. Tell him what you need.</p></div>
    ${wa('Hello Leon, I am looking for a specific item. Can you help?', 'Ask Leon')}
  </div>
</section>`;
  return {
    path: '/shop/',
    html: page({
      path: '/shop/', trail,
      title: `Refurbished & Second-Hand Appliances Cape Town | Leon`,
      description: 'Shop refurbished and second-hand appliances, used power tools, electronics, spare parts and household goods in Cape Town. Enquire on WhatsApp.',
      body,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Flip Shop', url: cfg.siteUrl + '/shop/' }],
    }),
  };
}

function category(cat, products) {
  const list = products.filter((p) => p.category === cat.id);
  const trail = [{ name: 'Flip Shop', href: '/shop/' }, { name: cat.name, href: `/shop/category/${cat.id}/` }];
  const body = `
<section class="shophero">
  <div class="wrap">
    ${require('./layout').breadcrumbs(trail)}
    <div class="shophero__in">
      <div>
        <p class="eyebrow">Flip Shop</p>
        <h1>${esc(cat.name)}</h1>
        <p class="lead">${esc(cat.blurb)}</p>
      </div>
      <form class="search" role="search" data-search-form>
        <label class="sr-only" for="shop-q">Search ${esc(cat.name)}</label>
        ${icon('search')}
        <input id="shop-q" name="q" type="search" placeholder="Search ${esc(cat.short.toLowerCase())}…" maxlength="60" autocomplete="off" data-search>
        <button class="btn btn--primary btn--sm" type="submit">Search</button>
      </form>
    </div>
    ${C.catPills(cat.id, products)}
  </div>
</section>
<div class="wrap">${C.sampleNote()}</div>
<div class="wrap section section--tight">${C.shopListing(list, { heading: cat.name })}</div>`;
  return {
    path: `/shop/category/${cat.id}/`,
    html: page({
      path: `/shop/category/${cat.id}/`, trail,
      title: `${cat.name} Cape Town | Leon Flip Shop`,
      description: `${cat.blurb} Refurbished, pre-owned and new ${cat.name.toLowerCase()} from ${cfg.name} in Cape Town. Enquire on WhatsApp.`.slice(0, 160),
      body,
    }),
  };
}

/* --------------------------------------------------------------- PRODUCT */
function product(p, products) {
  const cat = C.catById[p.category];
  const trail = [{ name: 'Flip Shop', href: '/shop/' }, { name: cat.name, href: `/shop/category/${cat.id}/` }, { name: p.name, href: `/shop/${p.id}/` }];
  const sold = p.availability === 'sold';
  const related = live(products).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const more = related.length < 4 ? live(products).filter((x) => x.featured && x.id !== p.id && !related.includes(x)).slice(0, 4 - related.length) : [];
  const gallery = p.images.length > 1
    ? `<ul class="gallery__thumbs">${p.images.map((k, i) => `<li><button type="button" data-thumb="${imgUrl('products/' + k)}"${i === 0 ? ' aria-current="true"' : ''} aria-label="Show photo ${i + 1}">${img('products/' + k, '', { sizes: '96px' })}</button></li>`).join('')}</ul>`
    : '';
  const specs = [
    ['Brand', p.brand || 'Ask Leon'],
    ['Condition', CONDITIONS[p.condition].label],
    ['Category', cat.name],
    ...p.specs,
    ['Reference', p.id],
  ];
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description,
    image: p.images.map((k) => cfg.siteUrl + imgUrl('products/' + k)), sku: p.id, category: cat.name,
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    itemCondition: `https://schema.org/${CONDITIONS[p.condition].schema}`,
    ...(p.price != null ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: 'ZAR', availability: `https://schema.org/${AVAIL[p.availability].schema}`, itemCondition: `https://schema.org/${CONDITIONS[p.condition].schema}`, url: cfg.siteUrl + `/shop/${p.id}/`, seller: { '@id': cfg.siteUrl + '/#business' } } } : {}),
  };
  const body = `
<section class="section section--tight product">
  <div class="wrap">
    ${require('./layout').breadcrumbs(trail)}
    <div class="product__grid">
      <div class="gallery">
        <div class="gallery__main">
          ${img('products/' + p.images[0], `${p.name} – ${CONDITIONS[p.condition].label.toLowerCase()}`, { sizes: '(min-width: 1024px) 55vw, 100vw', eager: true, cls: 'gallery__img' })}
          ${C.condBadge(p.condition)}
          ${sold ? '<span class="pcard__soldmark">Sold</span>' : ''}
        </div>
        ${gallery}
      </div>
      <div class="product__info">
        <p class="pcard__cat">${esc(cat.name)}</p>
        <h1>${esc(p.name)}</h1>
        <p class="product__price">${esc(rand(p.price))}</p>
        <ul class="product__facts">
          <li>${C.availPill(p.availability)}</li>
          <li>${C.condBadge(p.condition)}<span class="muted">${esc(CONDITIONS[p.condition].note)}</span></li>
        </ul>
        ${cfg.sampleCatalogue ? `<p class="sample-note sample-note--inline">${icon('info')}<span>Sample listing. Confirm price and stock with Leon.</span></p>` : ''}
        <div class="product__cta">
          ${sold
            ? `<p class="soldnote">This item has been sold.</p>${wa(MESSAGES.similar(p), 'Ask about similar items', 'btn btn--wa btn--lg btn--block')}`
            : wa(MESSAGES.product(p), p.availability === 'reserved' ? 'Ask if it’s still reserved' : 'Enquire on WhatsApp', 'btn btn--wa btn--lg btn--block')}
          ${cfg.phoneDisplay ? `<a class="btn btn--ghost btn--block" href="tel:${esc(cfg.phoneLink)}">${icon('phone')}Call ${esc(cfg.phoneDisplay)}</a>` : ''}
        </div>
        <ul class="product__assure">
          <li>${icon('shield')}<div><b>Warranty</b><span>${p.warranty ? esc(p.warranty) : 'Ask Leon whether this item carries a warranty.'}</span></div></li>
          <li>${icon('pin')}<div><b>Collection</b><span>Collect from Leon in ${esc(cfg.city)} once you have agreed the sale on WhatsApp.</span></div></li>
          <li>${icon('truck')}<div><b>Delivery</b><span>Ask Leon about delivery. Cost depends on the item and your suburb.</span></div></li>
        </ul>
      </div>
    </div>
    <div class="product__more">
      <section aria-labelledby="desc-h"><h2 id="desc-h" class="h3">Description</h2><p>${esc(p.description)}</p></section>
      <section aria-labelledby="spec-h"><h2 id="spec-h" class="h3">Specifications</h2>
        <table class="specs"><tbody>${specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
      </section>
    </div>
  </div>
</section>
${related.length + more.length ? `<section class="section section--grey section--tight" aria-labelledby="rel-h">
  <div class="wrap">
    <div class="sechead"><div><h2 id="rel-h" class="h3">You might also like</h2></div><a class="link-arrow" href="/shop/category/${cat.id}/">More ${esc(cat.short.toLowerCase())}${icon('arrow')}</a></div>
    <div class="pgrid pgrid--4 pgrid--scroll">${[...related, ...more].map((x) => C.productCard(x)).join('')}</div>
  </div>
</section>` : ''}
<div class="buybar">
  <div><b>${esc(rand(p.price))}</b><span>${esc(AVAIL[p.availability].label)}</span></div>
  ${sold ? wa(MESSAGES.similar(p), 'Similar items') : wa(MESSAGES.product(p), 'Enquire')}
</div>`;
  const priceTxt = p.price != null ? `${rand(p.price).replace(' ', ' ')}. ` : '';
  return {
    path: `/shop/${p.id}/`,
    html: page({
      path: `/shop/${p.id}/`, trail,
      title: `${p.name}, ${CONDITIONS[p.condition].label} | Leon Cape Town`,
      description: `${priceTxt}${CONDITIONS[p.condition].label} ${p.name.toLowerCase()}. ${p.description}`.slice(0, 158),
      body, ogType: 'product', ogImage: '/assets/img/products/' + p.images[0] + '-share.jpg',
      jsonld: [ld], bodyClass: 'page-product',
    }),
  };
}

/* ------------------------------------------------------------------ SELL */
function sell() {
  const trail = [{ name: 'Sell to Leon', href: '/sell/' }];
  const buys = [['fridge', 'Fridges'], ['washer', 'Washing machines'], ['stove', 'Stoves'], ['microwave', 'Microwaves'], ['kettle', 'Small appliances'], ['tv', 'Electronics'], ['drill', 'Power tools'], ['box', 'Other household equipment']]
    .map(([i, t]) => `<li>${icon(i)}<span>${t}</span></li>`).join('');
  const body = `
${C.pageHero({
    trail, eyebrow: 'Sell to Leon',
    title: 'Turn Your Unwanted Appliances Into Cash.',
    lead: 'Leon buys selected working and faulty appliances, electronics and equipment. Send the details, and he’ll let you know whether he can make an offer.',
    actions: `${btn('#sell-form', `${icon('cash')}Sell your item`)}${wa(MESSAGES.sell, 'WhatsApp photos', 'btn btn--ghost')}`,
    image: 'site/yard-appliances', imageAlt: 'Used fridges and appliances bought by Leon outside his shop',
  })}
<section class="section" aria-labelledby="buys-h">
  <div class="wrap">
    <div class="sechead"><div><p class="eyebrow">What Leon buys</p><h2 id="buys-h">Working or faulty, send it through</h2></div></div>
    <ul class="buys">${buys}</ul>
    <p class="note note--wide">${icon('info')}<span>Leon assesses every item before deciding whether to make an offer. Not every item can be bought, and offers depend on condition, demand and repair cost.</span></p>
  </div>
</section>
<section class="section section--grey" aria-labelledby="sp-h">
  <div class="wrap">
    <div class="sechead"><div><p class="eyebrow">The process</p><h2 id="sp-h">How selling works</h2></div></div>
    <ol class="flow">
      <li><span>1</span><h3>Send details</h3><p>Fill in the form. WhatsApp opens with everything written out.</p></li>
      <li><span>2</span><h3>Add photos</h3><p>Attach 2–4 photos in the WhatsApp chat: front, label, and any damage.</p></li>
      <li><span>3</span><h3>Leon assesses</h3><p>He may ask a few questions, then lets you know if he can make an offer.</p></li>
      <li><span>4</span><h3>Collection or drop-off</h3><p>If you accept, arrange a drop-off or ask about collection.</p></li>
    </ol>
  </div>
</section>
<section class="section" id="sell-form" aria-labelledby="sf-h">
  <div class="wrap formwrap">
    <div class="formwrap__aside">
      <p class="eyebrow">Sell your item</p>
      <h2 id="sf-h">Tell Leon about your item</h2>
      <p>The more Leon knows, the quicker he can respond.</p>
      <div class="photo-tip">
        ${icon('camera', 'i i--lg')}
        <div><h3>Photos go in WhatsApp</h3><p>Websites can’t attach photos to a WhatsApp message. When the chat opens, tap the paperclip or camera icon and add your photos before sending.</p></div>
      </div>
    </div>
    <form class="form card" data-wa-form data-intro="Hello Leon, I have an item I would like to sell to you." novalidate>
      <div class="grid2">
        ${C.field({ name: 'name', label: 'Your name', required: true, max: 60, auto: 'name' })}
        ${C.select({ name: 'category', label: 'Product category', options: ['Fridge / freezer', 'Washing machine / dryer', 'Stove / oven', 'Microwave', 'Small kitchen appliance', 'TV / audio / electronics', 'Computer / laptop', 'Power tool', 'Other household equipment'] })}
      </div>
      ${C.field({ name: 'model', label: 'Product name or model', required: true, max: 80, placeholder: 'e.g. Defy 13kg top loader' })}
      ${C.select({ name: 'condition', label: 'Condition', options: ['Working well', 'Working, with some faults', 'Not working', 'Not sure'] })}
      ${C.textarea({ name: 'description', label: 'Description', required: true, placeholder: 'Age, what works, what doesn’t, any damage…' })}
      ${C.field({ name: 'suburb', label: 'Suburb', required: true, max: 60, auto: 'address-level2' })}
      <label class="check check--box"><input type="checkbox" name="photos" value="I will attach photos in this chat." data-label="Photos"><span>I have photos to send in WhatsApp</span></label>
      ${C.formEnd('Send to Leon')}
    </form>
  </div>
</section>`;
  return {
    path: '/sell/',
    html: page({
      path: '/sell/', trail,
      title: `Sell Used or Broken Appliances Cape Town | Leon`,
      description: 'Sell your used, working or faulty fridge, washing machine, stove, microwave, electronics or power tools to Leon in Cape Town. Send details on WhatsApp.',
      body,
    }),
  };
}

/* ----------------------------------------------------------- SPARE PARTS */
function spareParts(products) {
  const trail = [{ name: 'Spare Parts', href: '/spare-parts/' }];
  const parts = products.filter((p) => p.category === 'spare-parts');
  const pcats = [
    ['fridge', 'Fridge parts', 'fridge compressor thermostat seal'],
    ['washer', 'Washing machine parts', 'washing machine motor pump belt'],
    ['stove', 'Stove & oven components', 'stove oven element switch'],
    ['microwave', 'Microwave parts', 'microwave magnetron board'],
    ['motor', 'Motors & pumps', 'motor pump'],
    ['bolt', 'Electrical components', 'board wiring switch electrical'],
    ['drill', 'Power tool accessories', 'drill grinder bit brush'],
  ];
  const body = `
${C.pageHero({
    trail, eyebrow: 'Spare Parts',
    title: 'Appliance Spare Parts in Cape Town.',
    lead: 'Motors, pumps, compressors, boards, elements and power tool accessories, many of them saved from appliances Leon has stripped and tested.',
    actions: `${wa(MESSAGES.parts, 'Send a photo of your part')}${btn('#parts', `${icon('search')}Search parts`, 'btn btn--ghost')}`,
    image: 'site/shelves-parts', imageAlt: 'Shelves of spare parts and accessories in Leon’s workshop',
  })}
<section class="section" id="parts" aria-labelledby="pc-h">
  <div class="wrap">
    <div class="sechead"><div><p class="eyebrow">Browse by type</p><h2 id="pc-h">Part categories</h2></div></div>
    <ul class="partcats">
      ${pcats.map(([i, t, q]) => `<li><button type="button" class="partcat" data-partq="${esc(q.split(' ')[0])}">${icon(i)}<span>${t}</span></button></li>`).join('')}
    </ul>
    <div class="partsearch" data-parts>
      <form class="search search--block" role="search" data-search-form>
        <label class="sr-only" for="parts-q">Search spare parts</label>
        ${icon('search')}
        <input id="parts-q" type="search" placeholder="Search parts, e.g. motor, compressor, board" maxlength="60" autocomplete="off" data-search>
        <button class="btn btn--primary btn--sm" type="submit">Search</button>
      </form>
      ${C.sampleNote()}
      <div class="pgrid pgrid--4" data-grid>${parts.map((p) => C.productCard(p)).join('')}</div>
      <p class="shop__count" data-count aria-live="polite"></p>
      <div class="empty" data-empty hidden>
        ${icon('search', 'i i--lg')}
        <h3>That part isn’t listed</h3>
        <p>Most parts never make it online. Send Leon a photo and he’ll check the shelves.</p>
        ${wa(MESSAGES.parts, 'Send a photo')}
      </div>
    </div>
  </div>
</section>
<section class="band band--parts" aria-labelledby="cf-h">
  <div class="wrap band__in">
    <div class="band__text">
      <p class="eyebrow">Can’t find it?</p>
      <h2 id="cf-h">Can’t Find Your Part? Send Us a Photo.</h2>
      <p>Take a photo of the part and the appliance’s rating label (usually inside the door or on the back). Leon will check what he has and let you know.</p>
      <form class="form form--inline" data-wa-form data-intro="Hello Leon, I am looking for a spare part. I will attach photos of the part and the appliance label." novalidate>
        <div class="grid3">
          ${C.field({ name: 'appliance', label: 'Appliance', required: true, max: 60, placeholder: 'e.g. Washing machine' })}
          ${C.field({ name: 'model', label: 'Brand / model', required: false, max: 80, placeholder: 'e.g. LG T8503' })}
          ${C.field({ name: 'part', label: 'Part needed', required: true, max: 80, placeholder: 'e.g. Drain pump' })}
        </div>
        ${C.formEnd('Ask Leon on WhatsApp')}
      </form>
    </div>
    <div class="band__media">${img('site/washer-motor', 'Washing machine motor removed for reuse as a spare part', { sizes: '(min-width: 1024px) 30vw, 100vw' })}</div>
  </div>
</section>`;
  return {
    path: '/spare-parts/',
    html: page({
      path: '/spare-parts/', trail,
      title: `Appliance Spare Parts Cape Town | ${cfg.name}`,
      description: 'Appliance spare parts in Cape Town: fridge, washing machine, stove and microwave parts, motors, pumps, electrical components and power tool accessories.',
      body,
    }),
  };
}

/* ---------------------------------------------------------- HOW IT WORKS */
function howItWorks() {
  const trail = [{ name: 'How It Works', href: '/how-it-works/' }];
  const flows = [
    { id: 'repair', title: 'Getting something repaired', icon: 'wrench', steps: [['Select your appliance', 'Choose what needs fixing on the Repair Services page.'], ['Describe the problem', 'Explain what it is doing and when it started.'], ['WhatsApp Leon', 'Your message opens in WhatsApp. Add photos or a video and send.'], ['Arrange the repair', 'Drop it off at the workshop, or arrange a house call.']], cta: ['/repairs/#book', 'Book a repair'] },
    { id: 'buy', title: 'Buying from the Flip Shop', icon: 'tag', steps: [['Browse products', 'Search or filter by category, condition and price.'], ['Select an item', 'Check the photos, condition and specifications.'], ['WhatsApp Leon', 'Tap “Enquire” and the product name is already in the message.'], ['Arrange the purchase', 'Agree on payment, then collect or ask about delivery.']], cta: ['/shop/', 'Browse the Flip Shop'] },
    { id: 'sell', title: 'Selling to Leon', icon: 'cash', steps: [['Send product details', 'Use the Sell to Leon form and attach photos in WhatsApp.'], ['Leon assesses', 'He checks the details and may ask a few questions.'], ['Receive an offer', 'If the item suits the shop, Leon makes you an offer.'], ['Collection or drop-off', 'Bring it in, or ask whether collection is possible.']], cta: ['/sell/', 'Sell an item'] },
  ];
  const faqs = [
    ['Do I need an account to buy?', 'No. There is no registration, cart or online checkout. Every purchase is arranged directly with Leon on WhatsApp.'],
    ['How do I pay?', 'Payment is agreed with Leon when you confirm a purchase or repair. Ask him which payment options are available.'],
    ['Are repair prices listed?', 'No. Every fault is different, so Leon quotes after he has assessed the appliance.'],
    ['Do products come with a warranty?', 'Where an item carries a warranty, it is shown on the product page. Items marked “Used – as is” are sold in their current state. If unsure, ask Leon.'],
    ['Do you deliver?', 'Ask Leon. Delivery depends on the item size and your suburb.'],
    ['What do the condition labels mean?', Object.values(CONDITIONS).map((c) => `${c.label}: ${c.note}`).join(' ')],
  ];
  const body = `
${C.pageHero({
    trail, eyebrow: 'How it works', title: 'Simple, WhatsApp-first service.',
    lead: 'Whether you’re repairing, buying or selling, every conversation happens directly with Leon on WhatsApp.',
  })}
<section class="section section--tight">
  <div class="wrap">
    ${flows.map((f) => `<section class="howflow" id="${f.id}" aria-labelledby="${f.id}-h">
      <div class="howflow__head">${icon(f.icon)}<h2 id="${f.id}-h">${f.title}</h2></div>
      <ol class="flow">${f.steps.map(([h, t], i) => `<li><span>${i + 1}</span><h3>${h}</h3><p>${t}</p></li>`).join('')}</ol>
      <a class="link-arrow" href="${f.cta[0]}">${f.cta[1]}${icon('arrow')}</a>
    </section>`).join('')}
  </div>
</section>
<section class="section section--grey" aria-labelledby="faq-h">
  <div class="wrap faqwrap">
    <div><p class="eyebrow">Questions</p><h2 id="faq-h">Frequently asked</h2><p>Something else? ${wa(MESSAGES.general, 'Ask Leon', 'link-wa')}</p></div>
    <div class="faq">${faqs.map(([q, a]) => `<details><summary>${q}${icon('arrow')}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>`;
  return {
    path: '/how-it-works/',
    html: page({
      path: '/how-it-works/', trail,
      title: `How It Works: Repair, Buy & Sell on WhatsApp | Leon`,
      description: 'How to book an appliance repair, buy refurbished appliances or sell your used items to Leon in Cape Town, all on WhatsApp.',
      body,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
    }),
  };
}

/* --------------------------------------------------------------- CONTACT */
function contact() {
  const trail = [{ name: 'Contact', href: '/contact/' }];
  const hours = cfg.hours.length ? `<ul class="hours">${cfg.hours.map((h) => `<li><span>${esc(h.days)}</span><b>${esc(h.time)}</b></li>`).join('')}</ul>` : '<p>Message Leon for current trading hours.</p>';
  const body = `
${C.pageHero({
    trail, eyebrow: 'Contact', title: 'Talk to Leon.',
    lead: 'WhatsApp is the quickest way to reach Leon about repairs, products, spare parts or selling an item.',
  })}
<section class="section section--tight">
  <div class="wrap contact">
    <div class="contact__cards">
      <a class="ccard ccard--wa" href="${esc(waHref(MESSAGES.general))}" target="_blank" rel="noopener noreferrer">${waIcon('i i--lg')}<div><h2>WhatsApp</h2><p>${cfg.phoneDisplay ? esc(cfg.phoneDisplay) : 'Chat with Leon'}</p><span class="link-arrow">Start a chat${icon('arrow')}</span></div></a>
      ${cfg.phoneDisplay ? `<a class="ccard" href="tel:${esc(cfg.phoneLink)}">${icon('phone', 'i i--lg')}<div><h2>Call</h2><p>${esc(cfg.phoneDisplay)}</p></div></a>` : ''}
      ${cfg.email ? `<a class="ccard" href="mailto:${esc(cfg.email)}">${icon('mail', 'i i--lg')}<div><h2>Email</h2><p>${esc(cfg.email)}</p></div></a>` : ''}
      <div class="ccard">${icon('pin', 'i i--lg')}<div><h2>Location</h2><p>${cfg.streetAddress ? esc(cfg.streetAddress) + '<br>' : ''}${esc(cfg.city)}, ${esc(cfg.region)}</p>${cfg.mapLink ? `<a class="link-arrow" href="${esc(cfg.mapLink)}" target="_blank" rel="noopener noreferrer">Open in Maps${icon('arrow')}</a>` : '<p class="hint">Ask Leon for directions to the workshop.</p>'}</div></div>
      <div class="ccard">${icon('clock', 'i i--lg')}<div><h2>Hours</h2>${hours}</div></div>
    </div>
    <form class="form card" data-wa-form data-intro="Hello Leon, I have an enquiry from your website." novalidate>
      <h2 class="h3">Send a message</h2>
      ${C.field({ name: 'name', label: 'Your name', required: true, max: 60, auto: 'name' })}
      ${C.select({ name: 'topic', label: 'What is it about?', options: ['A repair', 'A house call', 'A product in the Flip Shop', 'Spare parts', 'Selling an item', 'Something else'] })}
      ${C.textarea({ name: 'message', label: 'Message', required: true })}
      ${C.formEnd('Send on WhatsApp')}
    </form>
  </div>
</section>`;
  return {
    path: '/contact/',
    html: page({
      path: '/contact/', trail,
      title: `Contact ${cfg.name} | Cape Town`,
      description: `Contact ${cfg.name} in Cape Town on WhatsApp${cfg.phoneDisplay ? ` or ${cfg.phoneDisplay}` : ''} about appliance repairs, house calls, refurbished products, spare parts or selling an item.`,
      body, jsonld: [localBusiness()],
    }),
  };
}

/* ------------------------------------------------------------------- 404 */
function notFound() {
  const body = `
<section class="section notfound">
  <div class="wrap">
    <p class="eyebrow">404</p>
    <h1>This page needs a repair.</h1>
    <p class="lead">The page you were looking for isn’t here. It may have been a product that has since sold.</p>
    <div class="actions">${btn('/', 'Go to the home page')}${btn('/shop/', 'Browse the Flip Shop', 'btn btn--ghost')}</div>
  </div>
</section>`;
  return { path: '/404.html', file: '404.html', html: page({ path: '/404.html', title: `Page not found | ${cfg.name}`, description: 'Page not found.', body, noindex: true }) };
}

module.exports = { home, repairs, shop, category, product, sell, spareParts, howItWorks, contact, notFound };
