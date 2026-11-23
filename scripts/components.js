/* Reusable building blocks: product cards, shop listing, page heroes, form fields. */
const { cfg, esc, rand, waHref, MESSAGES, CONDITIONS, AVAIL, img, icon, waIcon } = require('./lib');
const categories = require('../src/data/categories');
const { breadcrumbs } = require('./layout');

// Shorter labels used inside the WhatsApp message
const KEYS = { 'What needs repairing?': 'Appliance', 'Describe the problem': 'Problem', 'Problem description': 'Problem', 'Best way to reach you': 'Contact me by', 'What is it about?': 'Topic', 'Product name or model': 'Item', 'Your name': 'Name', 'Brand and model': 'Brand / model', 'Product category': 'Category' };
const key = (l) => esc(KEYS[l] || l);
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const isNew = (p) => (Date.now() - new Date(p.dateAdded).getTime()) / 864e5 <= 5;

const condBadge = (c) => `<span class="cond cond--${c}">${esc(CONDITIONS[c].label)}</span>`;
const availPill = (a) => `<span class="avail avail--${a}">${esc(AVAIL[a].label)}</span>`;

function productCard(p, { sizes = '(min-width: 1200px) 280px, (min-width: 640px) 33vw, 50vw' } = {}) {
  const cat = catById[p.category];
  const href = `/shop/${p.id}/`;
  const text = [p.name, p.brand, cat && cat.name, p.description, ...(p.tags || [])].join(' ').toLowerCase();
  const sold = p.availability === 'sold';
  return `<article class="pcard${sold ? ' pcard--sold' : ''}" data-cat="${p.category}" data-cond="${p.condition}" data-price="${p.price == null ? '' : p.price}" data-avail="${p.availability}" data-date="${p.dateAdded}" data-text="${esc(text)}">
  <a class="pcard__media" href="${href}" tabindex="-1" aria-hidden="true">
    ${img('products/' + p.images[0], p.name, { sizes })}
    ${condBadge(p.condition)}
    ${sold ? '<span class="pcard__soldmark">Sold</span>' : (isNew(p) ? '<span class="pcard__new">Just in</span>' : '')}
  </a>
  <div class="pcard__body">
    <p class="pcard__cat">${esc(cat ? cat.short : '')}</p>
    <h3 class="pcard__title"><a href="${href}">${esc(p.name)}</a></h3>
    <p class="pcard__price">${esc(rand(p.price))}</p>
    <ul class="pcard__meta">
      <li>${availPill(p.availability)}</li>
      ${p.warranty ? `<li class="pcard__warranty">${icon('shield')}${esc(p.warranty)}</li>` : ''}
    </ul>
    <div class="pcard__actions">
      <a class="btn btn--ghost btn--sm" href="${href}">View details</a>
      ${sold
        ? `<a class="btn btn--wa btn--sm" href="${esc(waHref(MESSAGES.similar(p)))}" target="_blank" rel="noopener noreferrer" aria-label="Ask Leon about items similar to the ${esc(p.name)}">${waIcon()}Similar?</a>`
        : `<a class="btn btn--wa btn--sm" href="${esc(waHref(MESSAGES.product(p)))}" target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp about the ${esc(p.name)}">${waIcon()}Enquire</a>`}
    </div>
  </div>
</article>`;
}

const sampleNote = () => cfg.sampleCatalogue
  ? `<p class="sample-note">${icon('info')}<span><strong>Sample listings.</strong> These products and prices are placeholders built from Leon’s workshop photos. Message Leon for what is in stock today.</span></p>`
  : '';

function catPills(activeId, products) {
  const count = (id) => products.filter((p) => p.category === id && p.availability !== 'sold').length;
  return `<nav class="catpills" aria-label="Shop categories"><ul>
    <li><a href="/shop/"${!activeId ? ' aria-current="page"' : ''}>All</a></li>
    ${categories.map((c) => `<li><a href="/shop/category/${c.id}/"${activeId === c.id ? ' aria-current="page"' : ''}>${esc(c.short)}<span>${count(c.id)}</span></a></li>`).join('')}
  </ul></nav>`;
}

function shopListing(list, { heading = 'All products', id = 'products' } = {}) {
  const sorted = [...list].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  const conds = Object.entries(CONDITIONS).map(([k, v]) => `
      <label class="check"><input type="checkbox" name="cond" value="${k}"><span>${esc(v.label)}</span></label>`).join('');
  const prices = [['', 'Any price'], ['0-500', 'Under R500'], ['500-1500', 'R500 – R1 500'], ['1500-3000', 'R1 500 – R3 000'], ['3000-', 'Over R3 000']]
    .map(([v, l], i) => `<label class="check check--radio"><input type="radio" name="price" value="${v}"${i === 0 ? ' checked' : ''}><span>${l}</span></label>`).join('');
  const visible = sorted.filter((p) => p.availability !== 'sold').length;
  return `
<section class="shop" id="${id}" data-shop aria-labelledby="${id}-h">
  <div class="shop__head">
    <h2 id="${id}-h" class="h3">${esc(heading)}</h2>
    <p class="shop__count" data-count aria-live="polite">${visible} product${visible === 1 ? '' : 's'}</p>
  </div>
  <div class="shop__layout">
    <aside class="filters" data-filters aria-label="Filter products">
      <div class="filters__head"><h3>Filters</h3><button class="filters__close" type="button" data-filters-close aria-label="Close filters">${icon('x')}</button></div>
      <fieldset><legend>Condition</legend>${conds}</fieldset>
      <fieldset><legend>Price</legend>${prices}</fieldset>
      <fieldset><legend>Availability</legend>
        <label class="check"><input type="checkbox" name="sold" value="1"><span>Include sold items</span></label>
      </fieldset>
      <button class="btn btn--ghost btn--sm btn--block" type="button" data-clear>Clear filters</button>
      <button class="btn btn--primary btn--block filters__apply" type="button" data-filters-close>Show products</button>
    </aside>
    <div class="shop__main">
      <div class="shop__bar">
        <button class="btn btn--ghost btn--sm filters-toggle" type="button" data-filters-open>${icon('filter')}Filters<span class="filters-toggle__n" data-active-n hidden></span></button>
        <label class="sort"><span>Sort</span>
          <select data-sort>
            <option value="new">Recently added</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div class="pgrid" data-grid>${sorted.map((p) => productCard(p)).join('')}</div>
      <div class="empty" data-empty hidden>
        ${icon('search', 'i i--lg')}
        <h3>Nothing matches right now</h3>
        <p>Stock changes every week. Tell Leon what you are looking for and he will let you know when it comes in.</p>
        <a class="btn btn--wa" href="${esc(waHref('Hello Leon, I am looking for an item that is not on your website. Can you help?'))}" target="_blank" rel="noopener noreferrer">${waIcon()}Ask Leon</a>
      </div>
    </div>
  </div>
</section>`;
}

/* Inner-page hero: title block + optional image */
function pageHero({ trail, eyebrow, title, lead, actions = '', image, imageAlt, tone = 'light', extra = '' }) {
  return `
<section class="phero phero--${tone}${image ? '' : ' phero--noimg'}">
  <div class="wrap phero__in">
    <div class="phero__text">
      ${breadcrumbs(trail)}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
      ${extra}
    </div>
    ${image ? `<div class="phero__media">${img(image, imageAlt, { sizes: '(min-width: 1024px) 46vw, 100vw', eager: true })}</div>` : ''}
  </div>
</section>`;
}

/* Form fields */
const field = ({ name, label, type = 'text', required = false, placeholder = '', max = 120, hint = '', auto = '', attrs = '' }) => `
<div class="field">
  <label for="f-${name}">${esc(label)}${required ? '' : ' <span class="opt">(optional)</span>'}</label>
  <input id="f-${name}" name="${name}" type="${type}" ${required ? 'required' : ''} maxlength="${max}" ${placeholder ? `placeholder="${esc(placeholder)}"` : ''} ${auto ? `autocomplete="${auto}"` : ''} data-label="${key(label)}" ${attrs}>
  ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
</div>`;
const textarea = ({ name, label, required = false, placeholder = '', max = 600, hint = '' }) => `
<div class="field">
  <label for="f-${name}">${esc(label)}${required ? '' : ' <span class="opt">(optional)</span>'}</label>
  <textarea id="f-${name}" name="${name}" rows="4" ${required ? 'required' : ''} maxlength="${max}" ${placeholder ? `placeholder="${esc(placeholder)}"` : ''} data-label="${key(label)}"></textarea>
  ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
</div>`;
const select = ({ name, label, options, required = true, placeholder = 'Choose…' }) => {
  const opts = Array.isArray(options)
    ? options.map((o) => `<option>${esc(o)}</option>`).join('')
    : Object.entries(options).map(([g, list]) => `<optgroup label="${esc(g)}">${list.map((o) => `<option>${esc(o)}</option>`).join('')}</optgroup>`).join('');
  return `
<div class="field">
  <label for="f-${name}">${esc(label)}${required ? '' : ' <span class="opt">(optional)</span>'}</label>
  <div class="select"><select id="f-${name}" name="${name}" ${required ? 'required' : ''} data-label="${key(label)}"><option value="">${esc(placeholder)}</option>${opts}</select></div>
</div>`;
};
const formEnd = (btn) => `
<div class="form__end">
  <button class="btn btn--wa btn--lg" type="submit">${waIcon()}${esc(btn)}</button>
  <p class="hint">WhatsApp opens with your details filled in. Nothing is sent until you press send in WhatsApp.</p>
  <p class="form__done" data-done hidden role="status">WhatsApp should now be open. If it didn’t open, <a href="#" data-fallback target="_blank" rel="noopener noreferrer">tap here to continue</a>.</p>
</div>`;

module.exports = { productCard, shopListing, catPills, pageHero, field, textarea, select, formEnd, condBadge, availPill, sampleNote, catById, isNew };
