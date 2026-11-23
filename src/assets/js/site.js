/* Leon Repair Shop — small, dependency-free site script. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var WA = document.body.getAttribute('data-wa') || '';
  var params = new URLSearchParams(location.search);

  /* ---------- Mobile navigation ---------- */
  var nav = $('#mobilenav'), toggle = $('.navtoggle'), lastFocus;
  function openNav() {
    lastFocus = document.activeElement;
    nav.hidden = false; document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    var c = $('.navclose', nav); if (c) c.focus();
  }
  function closeNav() {
    nav.hidden = true; document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }
  if (nav && toggle) {
    toggle.addEventListener('click', openNav);
    $('.navclose', nav).addEventListener('click', closeNav);
    nav.addEventListener('click', function (e) { if (e.target === nav) closeNav(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) closeNav(); });
  }

  /* ---------- WhatsApp helpers ---------- */
  function clean(v, max) {
    return String(v || '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, max || 600);
  }
  function waUrl(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }

  /* ---------- Enquiry forms -> WhatsApp ---------- */
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $$('input[data-min-today]').forEach(function (i) { i.min = today.toISOString().slice(0, 10); });

  function setError(el, msg) {
    var field = el.closest('.field') || el.closest('.form__step') || el.parentNode;
    var old = $('.field-error', field); if (old) old.remove();
    el.classList.toggle('is-invalid', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) {
      var p = document.createElement('p'); p.className = 'field-error'; p.id = (el.id || el.name) + '-err';
      p.textContent = msg; field.appendChild(p); el.setAttribute('aria-describedby', p.id);
    } else el.removeAttribute('aria-describedby');
  }

  $$('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('input', function (e) { if (e.target.classList.contains('is-invalid')) setError(e.target, ''); });
    form.addEventListener('change', function (e) { if (e.target.classList.contains('is-invalid')) setError(e.target, ''); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [], firstBad = null, seen = {};
      $$('input, select, textarea', form).forEach(function (el) {
        if (!el.name || el.type === 'submit') return;
        var label = el.getAttribute('data-label') || el.name;
        if (el.type === 'radio') {
          if (seen[el.name]) return; seen[el.name] = 1;
          var chk = $('input[name="' + el.name + '"]:checked', form);
          if (chk) lines.push('*' + label + ':* ' + clean(chk.value, 120));
          return;
        }
        if (el.type === 'checkbox') { if (el.checked) lines.push(clean(el.value, 120)); return; }
        var v = clean(el.value, el.maxLength > 0 ? el.maxLength : 600);
        var msg = '';
        if (el.required && !v) msg = el.tagName === 'SELECT' ? 'Please choose an option.' : 'Please fill this in.';
        else if (v && el.name === 'name' && v.length < 2) msg = 'Please enter your name.';
        else if (v && el.type === 'date' && el.min && v < el.min) msg = 'Please choose today or a later date.';
        setError(el, msg);
        if (msg && !firstBad) firstBad = el;
        if (v) {
          if (el.type === 'date') { var d = new Date(v + 'T00:00:00'); v = d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
          lines.push('*' + label + ':* ' + v);
        }
      });
      if (firstBad) { firstBad.focus(); return; }
      var text = (form.getAttribute('data-intro') || 'Hello Leon,') + '\n\n' + lines.join('\n');
      var url = waUrl(text);
      var done = $('[data-done]', form), fb = $('[data-fallback]', form);
      if (fb) fb.href = url;
      if (done) done.hidden = false;
      var w = window.open(url, '_blank', 'noopener');
      if (!w) location.href = url;
    });
  });

  /* Repair page: pre-select an appliance from a "Book repair" link or ?item= */
  function preselect(name) {
    var sel = $('#book select[name="appliance"]'); if (!sel || !name) return;
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === name) { sel.selectedIndex = i; break; }
  }
  preselect(params.get('item'));
  function houseCall() { var r = $('#book input[value="House call"]'); if (r) r.checked = true; }
  if (params.get('type') === 'house-call') houseCall();
  $$('[data-housecall]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); houseCall();
      $('#book').scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', '?type=house-call#book');
    });
  });
  $$('[data-book]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); preselect(a.getAttribute('data-book'));
      var target = $('#book'); target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', '?item=' + encodeURIComponent(a.getAttribute('data-book')) + '#book');
      setTimeout(function () { var t = $('#f-problem'); if (t) t.focus({ preventScroll: true }); }, 500);
    });
  });

  /* ---------- Shop: search, filters, sort ---------- */
  var searchInput = $('[data-search]');
  var shop = $('[data-shop]') || $('[data-parts]');
  if (shop) {
    var grid = $('[data-grid]', shop);
    var cards = $$('.pcard', grid);
    var countEl = $('[data-count]', shop);
    var empty = $('[data-empty]', shop);
    var filters = $('[data-filters]', shop);
    var sortSel = $('[data-sort]', shop);
    var activeN = $('[data-active-n]', shop);
    var strips = $$('[data-hide-on-search]');
    var isParts = shop.hasAttribute('data-parts');

    var q0 = params.get('q');
    if (q0 && searchInput) searchInput.value = clean(q0, 60);

    var firstRun = true;
    var apply = function () {
      var q = searchInput ? clean(searchInput.value, 60).toLowerCase() : '';
      var words = q.split(/\s+/).filter(Boolean);
      var conds = filters ? $$('input[name="cond"]:checked', filters).map(function (i) { return i.value; }) : [];
      var pr = filters ? ($('input[name="price"]:checked', filters) || {}).value || '' : '';
      var lo = pr ? parseFloat(pr.split('-')[0]) || 0 : 0;
      var hi = pr && pr.split('-')[1] ? parseFloat(pr.split('-')[1]) : Infinity;
      var withSold = isParts ? true : (filters ? !!$('input[name="sold"]:checked', filters) : false);
      var n = 0;
      cards.forEach(function (c) {
        var text = c.getAttribute('data-text') || '';
        var price = c.getAttribute('data-price');
        var ok = words.every(function (w) { return text.indexOf(w) !== -1; })
          && (!conds.length || conds.indexOf(c.getAttribute('data-cond')) !== -1)
          && (!pr || (price !== '' && +price >= lo && +price < hi))
          && (withSold || c.getAttribute('data-avail') !== 'sold');
        c.hidden = !ok; if (ok) n++;
      });
      if (sortSel && !(firstRun && sortSel.value === 'new')) { // cards are already newest-first in the HTML
        var mode = sortSel.value;
        var key = function (c) { var p = c.getAttribute('data-price'); return p === '' ? null : +p; };
        cards.slice().sort(function (a, b) {
          if (mode === 'new') return b.getAttribute('data-date').localeCompare(a.getAttribute('data-date'));
          var x = key(a), y = key(b);
          if (x === null) return 1; if (y === null) return -1;
          return mode === 'low' ? x - y : y - x;
        }).forEach(function (c) { grid.appendChild(c); });
      }
      if (countEl) countEl.textContent = (isParts && !q) ? '' : n + (n === 1 ? ' product' : ' products') + (q ? ' for “' + q + '”' : '');
      if (empty) empty.hidden = n > 0;
      var active = conds.length + (pr ? 1 : 0) + (withSold && !isParts ? 1 : 0);
      if (activeN) { activeN.hidden = !active; activeN.textContent = active; }
      strips.forEach(function (s) { s.hidden = !!(q || active); });
      var u = new URL(location.href);
      if (q) u.searchParams.set('q', q); else u.searchParams.delete('q');
      if (!firstRun || q) history.replaceState(null, '', u.pathname + u.search + u.hash);
      firstRun = false;
    };

    if (searchInput) {
      var t; searchInput.addEventListener('input', function () { clearTimeout(t); t = setTimeout(apply, 120); });
      var sf = searchInput.closest('form');
      if (sf) sf.addEventListener('submit', function (e) {
        e.preventDefault(); apply();
        if (!isParts) { var target = $('#products') || shop; target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    }
    if (filters) {
      filters.addEventListener('change', apply);
      var clear = $('[data-clear]', filters);
      if (clear) clear.addEventListener('click', function () {
        $$('input[name="cond"], input[name="sold"]', filters).forEach(function (i) { i.checked = false; });
        var any = $('input[name="price"][value=""]', filters); if (any) any.checked = true;
        apply();
      });
      var open = $('[data-filters-open]', shop);
      if (open) open.addEventListener('click', function () { filters.classList.add('is-open'); document.body.classList.add('nav-open'); var c = $('[data-filters-close]', filters); if (c) c.focus(); });
      $$('[data-filters-close]', filters).forEach(function (b) { b.addEventListener('click', function () { filters.classList.remove('is-open'); document.body.classList.remove('nav-open'); if (open) open.focus(); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && filters.classList.contains('is-open')) { filters.classList.remove('is-open'); document.body.classList.remove('nav-open'); } });
    }
    if (sortSel) sortSel.addEventListener('change', apply);

    // Spare-part category buttons fill in the search
    $$('[data-partq]').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') === 'true';
        $$('[data-partq]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        if (searchInput) searchInput.value = on ? '' : b.getAttribute('data-partq');
        b.setAttribute('aria-pressed', on ? 'false' : 'true');
        apply();
      });
    });
    apply();
  }

  /* ---------- Product gallery ---------- */
  var main = $('.gallery__img');
  $$('[data-thumb]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!main) return;
      main.removeAttribute('srcset'); main.src = b.getAttribute('data-thumb');
      $$('[data-thumb]').forEach(function (x) { x.removeAttribute('aria-current'); });
      b.setAttribute('aria-current', 'true');
    });
  });

  /* ---------- Sticky buy bar on mobile product pages ---------- */
  var bar = $('.buybar'), cta = $('.product__cta');
  if (bar && cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { bar.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top < 0); });
    }).observe(cta);
  }

})();
