/* =========================================================================
   AESTHETIC SURVEILLANCE — PART 3 SCRIPT  (js/script.js)
   -------------------------------------------------------------------------
   One shared script, loaded with `defer` on every page. Each feature below
   starts with a guard (e.g. "if this page has no #map, do nothing"), so the
   same file is safe to load everywhere.

   Sources followed (full Harvard references in README §11):
     - Tabs, accordion and modal-dialog keyboard behaviour follow the patterns in
       W3C (2026) WAI-ARIA Authoring Practices Guide.
     - The map uses the Leaflet API (Agafonkin, 2023) with OpenStreetMap tiles
       (OpenStreetMap contributors, 2026).
     - Scroll reveal and counters use IntersectionObserver (Mozilla, 2026).

   Sections
     0. Shared data + helpers
     1. Mobile navigation toggle
     2. Scroll-reveal animation + animated stat counters
     3. Accordion (FAQ)            – services.html
     4. Tabs ("How we work")       – about.html
     5. Service modal              – services.html
     6. Service search / filter / sort – services.html
     7. Dynamic "Security insights" (JS-rendered, filter + load more) – index.html
     8. Gallery lightbox           – index.html
     9. Interactive map (Leaflet)  – contact.html
    10. Form validation + processing – enquiry.html and contact.html
   ========================================================================= */
(function () {
  'use strict';

  /* ======================= 0. SHARED DATA + HELPERS ======================= */

  // Recipient for the contact-form email (change this one line when the real
  // mailbox exists — the contact form builds a mailto: link to this address).
  var CONTACT_EMAIL = 'info@aestheticsurveillance.example';

  // Indicative day-rates in ZAR (illustrative figures for this academic
  // project, used by the service modal AND the enquiry cost estimate).
  var SERVICES = {
    'drone-surveillance': {
      title: 'Drone Surveillance', unit: 'drone unit', rate: 4500,
      summary: 'Licensed pilots provide live aerial coverage of estates, events and motorcade routes, feeding a monitored operations desk.',
      features: ['Perimeter and estate overwatch', 'Live event and crowd monitoring', 'Route reconnaissance before arrival', 'Incident footage logged for review'],
      bestFor: 'Large properties, outdoor events and high-profile arrivals.'
    },
    'secure-transport': {
      title: 'Secure Transport', unit: 'vehicle', rate: 3200,
      summary: 'Discreet, security-planned travel with trained drivers, pre-checked routes and contingency options.',
      features: ['Trained protective drivers', 'Pre-planned and alternate routes', 'Airport, event and city transfers', 'Real-time journey monitoring'],
      bestFor: 'Executives, performers and families who travel often.'
    },
    'vip-protection': {
      title: 'VIP & Executive Protection', unit: 'officer', rate: 2800,
      summary: 'Close-protection officers who blend into the environment while managing risk around the client at all times.',
      features: ['Advance venue and route checks', 'Low-profile close protection', 'Media and crowd liaison', 'Daily risk briefings'],
      bestFor: 'Public figures, business leaders and private clients.'
    },
    'armed-response': {
      title: 'Armed Response', unit: 'responder', rate: 2200,
      summary: 'Rapid, responsibly planned response capability for incidents at client premises or events.',
      features: ['Rapid dispatch from regional bases', 'Coordination with the 24/7 control room', 'Incident reporting and follow-up', 'Lawful, licensed personnel only'],
      bestFor: 'Homes, businesses and venues needing fast incident response.'
    },
    'site-security': {
      title: 'Site Security', unit: 'guard', rate: 1200,
      summary: 'Access control, patrols and monitoring for homes, businesses, venues and controlled sites.',
      features: ['Access control and guest screening', 'Scheduled patrols', 'CCTV and alarm monitoring', 'Daily occurrence logs'],
      bestFor: 'Residential estates, offices, warehouses and venues.'
    },
    'security-consulting': {
      title: 'Security Consultation', unit: 'consultant', rate: 1500,
      summary: 'A practical risk review with clear, prioritised recommendations before you commit to any services.',
      features: ['On-site or remote risk assessment', 'Prioritised recommendations', 'Budget-aware options', 'Written summary report'],
      bestFor: 'Anyone unsure what level of protection they really need.'
    }
  };

  var URGENCY = {
    standard:  { label: 'Standard (5+ days)',        factor: 1,    msg: 'Standard scheduling: a planner will call you within one business day and we can usually deploy within 3\u20135 business days after your risk call.' },
    priority:  { label: 'Priority (within 48 hours)', factor: 1.25, msg: 'Priority scheduling: a planner will call you within 4 business hours, with deployment targeted inside 48 hours, subject to availability.' },
    emergency: { label: 'Emergency (within 24 hours)', factor: 1.5,  msg: 'Emergency scheduling: our 24/7 operations desk will call you within 30 minutes, with deployment targeted inside 24 hours.' }
  };

  // Sample articles rendered dynamically on the home page.
  var INSIGHTS = [
    { title: 'How to brief a close-protection detail before a public event', category: 'Planning', date: '2026-09-12', read: 4,
      excerpt: 'A clear briefing on venue layout, arrival routes and escalation contacts makes the difference between reacting and controlling the day.' },
    { title: 'What drone perimeter patrols can (and cannot) see', category: 'Technology', date: '2026-09-05', read: 5,
      excerpt: 'Aerial coverage widens your view of a property, but it works best when paired with trained people on the ground.' },
    { title: 'Armoured vehicle or discreet transfer: choosing the right option', category: 'Travel', date: '2026-08-28', read: 4,
      excerpt: 'The right vehicle depends on risk level, visibility and the journey. Here is how we weigh those factors with clients.' },
    { title: 'Seven questions to ask before hiring a private security provider', category: 'Planning', date: '2026-08-19', read: 6,
      excerpt: 'From registration and training to reporting and insurance, these questions help you compare providers fairly.' },
    { title: 'Keeping a home secure during extended power outages', category: 'Planning', date: '2026-08-11', read: 5,
      excerpt: 'Backup power for alarms, cameras and gate motors is a small cost compared with an unprotected night.' },
    { title: 'Live route risk monitoring: how it works in practice', category: 'Technology', date: '2026-08-02', read: 4,
      excerpt: 'Operations desks combine traffic, incident and weather information so drivers can change route before a problem appears.' },
    { title: 'A quick safety checklist for business travel in Gauteng', category: 'Travel', date: '2026-07-24', read: 3,
      excerpt: 'Simple habits on arrival, parking and accommodation lower risk without changing how you work.' },
    { title: 'Event security: guest screening without the queue', category: 'Planning', date: '2026-07-15', read: 4,
      excerpt: 'Pre-registered guest lists and staggered arrival windows keep entry smooth while still checking who comes in.' },
    { title: 'Using drones responsibly: what clients should know', category: 'Technology', date: '2026-07-06', read: 5,
      excerpt: 'Licensed pilots, insured equipment and respect for privacy are the baseline for any professional drone service.' }
  ];

  var OFFICES = [
    { id: 'johannesburg', name: 'Johannesburg \u2014 Head Office', lat: -26.1076, lng: 28.0567, text: 'Sandton, Gauteng (placeholder address)' },
    { id: 'pretoria',     name: 'Pretoria \u2014 Regional Base',   lat: -25.7479, lng: 28.2293, text: 'Pretoria Central, Gauteng (placeholder address)' },
    { id: 'durban',       name: 'Durban \u2014 Regional Base',     lat: -29.8587, lng: 31.0218, text: 'Durban Central, KwaZulu-Natal (placeholder address)' }
  ];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Tiny DOM builder. Text is always added with textContent (never innerHTML)
  // so anything a visitor types can never be executed as markup.
  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (kid) { if (kid) node.appendChild(kid); });
    return node;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var money = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 });

  /* ========================= 1. MOBILE NAV TOGGLE ========================= */
  function initNav() {
    var btn = $('.nav-toggle');
    var nav = $('#primary-nav');
    if (!btn || !nav) return;

    function close() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); }
    });
  }

  /* ================= 2. SCROLL REVEAL + ANIMATED COUNTERS ================= */
  var revealObserver = null;

  function observeReveal(node) {
    if (!revealObserver) { node.classList.add('is-visible'); return; }
    revealObserver.observe(node);
  }

  function initReveal() {
    if ('IntersectionObserver' in window && !reduceMotion) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    $$('[data-reveal]').forEach(observeReveal);
  }

  function initCounters() {
    var counters = $$('[data-count]');
    if (!counters.length) return;

    function run(node) {
      var target = parseFloat(node.getAttribute('data-count'));
      var suffix = node.getAttribute('data-suffix') || '';
      if (reduceMotion) { node.textContent = target + suffix; return; }
      var start = null, duration = 1400;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);               // ease-out
        node.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { c.textContent = '0' + (c.getAttribute('data-suffix') || ''); io.observe(c); });
  }

  /* ============================ 3. ACCORDION ============================== */
  function initAccordions() {
    $$('.accordion').forEach(function (acc) {
      var triggers = $$('.accordion-trigger', acc);

      function setOpen(trigger, open) {
        var item = trigger.closest('.accordion-item');
        trigger.setAttribute('aria-expanded', String(open));
        item.classList.toggle('open', open);
      }

      triggers.forEach(function (t, i) {
        t.addEventListener('click', function () {
          var willOpen = t.getAttribute('aria-expanded') !== 'true';
          triggers.forEach(function (other) { setOpen(other, false); });   // one open at a time
          setOpen(t, willOpen);
        });
        t.addEventListener('keydown', function (e) {                      // arrow-key navigation
          var next = null;
          if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
          if (e.key === 'ArrowUp')   next = triggers[(i - 1 + triggers.length) % triggers.length];
          if (e.key === 'Home')      next = triggers[0];
          if (e.key === 'End')       next = triggers[triggers.length - 1];
          if (next) { e.preventDefault(); next.focus(); }
        });
      });
    });
  }

  /* ============================== 4. TABS ================================= */
  function initTabs() {
    $$('.tabs').forEach(function (box) {
      var tabs = $$('[role="tab"]', box);
      var panels = $$('[role="tabpanel"]', box);

      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
        });
        panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
        if (focus) tab.focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab, false); });
        tab.addEventListener('keydown', function (e) {
          var idx = null;
          if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft')  idx = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') idx = 0;
          if (e.key === 'End')  idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); select(tabs[idx], true); }
        });
      });
      select(tabs[0], false);   // JS hides the other panels; without JS all stay visible
    });
  }

  /* ========================== 5. SERVICE MODAL ============================ */
  function initModal() {
    var modal = $('#service-modal');
    if (!modal) return;
    var dialog = $('.modal-dialog', modal);
    var lastFocus = null;

    function focusables() {
      return $$('a[href], button:not([disabled])', dialog).filter(function (n) { return n.offsetParent !== null; });
    }

    function open(slug, trigger) {
      var s = SERVICES[slug];
      if (!s) return;
      lastFocus = trigger;
      $('#modal-title').textContent = s.title;
      $('#modal-summary').textContent = s.summary;
      $('#modal-bestfor').textContent = s.bestFor;
      $('#modal-rate').textContent = 'From ' + money.format(s.rate) + ' per ' + s.unit + ' per day (indicative, excl. VAT)';
      var list = $('#modal-features');
      list.textContent = '';
      s.features.forEach(function (f) { list.appendChild(el('li', { text: f })); });
      $('#modal-quote').setAttribute('href', 'enquiry.html?service=' + encodeURIComponent(slug) + '#enquiry-form');
      modal.hidden = false;
      document.documentElement.classList.add('no-scroll');
      requestAnimationFrame(function () { modal.classList.add('is-open'); $('.modal-close', modal).focus(); });
    }

    function close() {
      modal.classList.remove('is-open');
      document.documentElement.classList.remove('no-scroll');
      setTimeout(function () { modal.hidden = true; }, 250);
      if (lastFocus) lastFocus.focus();
    }

    $$('[data-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-modal'), btn); });
    });
    $$('[data-modal-close]', modal).forEach(function (n) { n.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {                                       // keep keyboard focus inside the dialog
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ================== 6. SERVICE SEARCH / FILTER / SORT =================== */
  function initServiceFilter() {
    var list = $('#service-list');
    if (!list) return;
    var rows = $$('.service-row', list);
    var input = $('#service-search');
    var sortSel = $('#service-sort');
    var chips = $$('[data-filter]');
    var count = $('#service-count');
    var empty = $('#service-empty');
    var category = 'all';

    rows.forEach(function (r, i) { r.dataset.order = String(i); });

    function apply() {
      var q = input.value.trim().toLowerCase();
      var words = q ? q.split(/\s+/) : [];

      rows.forEach(function (r) {
        var hay = (r.dataset.name + ' ' + r.dataset.category + ' ' + r.dataset.keywords + ' ' + r.querySelector('p').textContent).toLowerCase();
        var matchCat = category === 'all' || r.dataset.category === category;
        var matchText = words.every(function (w) { return hay.indexOf(w) !== -1; });
        r.hidden = !(matchCat && matchText);
      });

      // Sort (re-append rows in the chosen order; hidden rows stay hidden)
      var mode = sortSel.value;
      var sorted = rows.slice().sort(function (a, b) {
        if (mode === 'az')  return a.dataset.name.localeCompare(b.dataset.name);
        if (mode === 'za')  return b.dataset.name.localeCompare(a.dataset.name);
        if (mode === 'low') return (+a.dataset.rate) - (+b.dataset.rate);
        if (mode === 'high') return (+b.dataset.rate) - (+a.dataset.rate);
        return (+a.dataset.order) - (+b.dataset.order);
      });
      sorted.forEach(function (r) { list.appendChild(r); });

      // Keep the left/right image alternation correct for whatever is visible
      var n = 0;
      sorted.forEach(function (r) { if (!r.hidden) { r.classList.toggle('is-flipped', n % 2 === 1); n++; } });

      count.textContent = 'Showing ' + n + ' of ' + rows.length + ' services';
      empty.hidden = n !== 0;
    }

    input.addEventListener('input', apply);
    sortSel.addEventListener('change', apply);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        category = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    });
    var reset = $('#service-reset');
    if (reset) reset.addEventListener('click', function () {
      input.value = ''; sortSel.value = 'featured'; category = 'all';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === 'all')); });
      apply(); input.focus();
    });
    apply();
  }

  /* ============== 7. DYNAMIC INSIGHTS (JS-RENDERED CONTENT) =============== */
  function initInsights() {
    var grid = $('#insights-grid');
    if (!grid) return;
    var more = $('#insights-more');
    var status = $('#insights-status');
    var chips = $$('[data-insight-filter]');
    var PAGE = 3, category = 'all', shown = 0;

    function filtered() {
      return INSIGHTS.filter(function (a) { return category === 'all' || a.category === category; });
    }

    function card(a) {
      var date = new Date(a.date + 'T00:00:00');
      var nice = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
      var node = el('article', { class: 'insight', 'data-reveal': '' }, [
        el('span', { class: 'tag', text: a.category }),
        el('h3', { text: a.title }),
        el('p', { text: a.excerpt }),
        el('p', { class: 'meta', text: nice + ' \u00b7 ' + a.read + ' min read' })
      ]);
      observeReveal(node);
      return node;
    }

    function render(reset) {
      var items = filtered();
      if (reset) { grid.textContent = ''; shown = 0; }
      items.slice(shown, shown + PAGE).forEach(function (a) { grid.appendChild(card(a)); });
      shown = Math.min(shown + PAGE, items.length);
      more.hidden = shown >= items.length;
      status.textContent = 'Showing ' + shown + ' of ' + items.length + ' articles';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        category = chip.getAttribute('data-insight-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        render(true);
      });
    });
    more.addEventListener('click', function () { render(false); });
    render(true);
  }

  /* ========================== 8. GALLERY LIGHTBOX ========================= */
  function initLightbox() {
    var links = $$('.gallery a[data-lightbox]');
    if (!links.length) return;
    var index = 0, lastFocus = null, touchX = null;

    var img = el('img', { alt: '' });
    var cap = el('figcaption');
    var counter = el('p', { class: 'lightbox-count', 'aria-live': 'polite' });
    var closeBtn = el('button', { class: 'lightbox-btn lightbox-close', type: 'button', 'aria-label': 'Close image viewer', text: '\u00d7' });
    var prevBtn = el('button', { class: 'lightbox-btn lightbox-prev', type: 'button', 'aria-label': 'Previous image', text: '\u2039' });
    var nextBtn = el('button', { class: 'lightbox-btn lightbox-next', type: 'button', 'aria-label': 'Next image', text: '\u203a' });
    var overlay = el('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Image viewer', hidden: '' }, [
      closeBtn, prevBtn, nextBtn, el('figure', {}, [img, cap]), counter
    ]);
    document.body.appendChild(overlay);

    function show(i) {
      index = (i + links.length) % links.length;
      var a = links[index];
      img.classList.remove('loaded');
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('img').alt;
      cap.textContent = a.getAttribute('data-caption') || '';
      counter.textContent = (index + 1) + ' / ' + links.length;
      img.onload = function () { img.classList.add('loaded'); };
      // pre-load neighbours so next/prev feel instant
      [index + 1, index - 1].forEach(function (n) { var p = new Image(); p.src = links[(n + links.length) % links.length].getAttribute('href'); });
    }
    function open(i, trigger) {
      lastFocus = trigger;
      overlay.hidden = false;
      document.documentElement.classList.add('no-scroll');
      show(i);
      requestAnimationFrame(function () { overlay.classList.add('is-open'); closeBtn.focus(); });
    }
    function close() {
      overlay.classList.remove('is-open');
      document.documentElement.classList.remove('no-scroll');
      setTimeout(function () { overlay.hidden = true; }, 250);
      if (lastFocus) lastFocus.focus();
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(i, a); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (overlay.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'Tab') {                                        // simple focus trap
        var f = [closeBtn, prevBtn, nextBtn];
        var pos = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(pos + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    overlay.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', function (e) {             // swipe left / right on phones
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  /* ===================== 9. INTERACTIVE MAP (LEAFLET) ===================== */
  function initMap() {
    var mapEl = $('#map');
    if (!mapEl) return;
    if (typeof window.L === 'undefined') {                         // Leaflet failed to load (offline / blocked)
      mapEl.classList.add('map-fallback');
      mapEl.appendChild(el('p', { text: 'The interactive map could not be loaded. Our head office is in Sandton, Johannesburg \u2014 see the office list below.' }));
      return;
    }

    var map = window.L.map(mapEl, { scrollWheelZoom: false, zoomControl: true });
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    var icon = window.L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
    var markers = {};
    var bounds = [];

    OFFICES.forEach(function (o) {
      var popup = el('div', {}, [el('strong', { text: o.name }), el('br'), el('span', { text: o.text })]);
      var m = window.L.marker([o.lat, o.lng], { icon: icon, title: o.name, alt: o.name }).addTo(map).bindPopup(popup);
      markers[o.id] = m;
      bounds.push([o.lat, o.lng]);
    });

    function fitAll() { map.fitBounds(bounds, { padding: [40, 40] }); }
    fitAll();

    // Scroll-wheel zoom only after the visitor clicks the map (avoids trapping page scroll)
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    mapEl.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });

    $$('[data-office]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-office');
        var o = OFFICES.filter(function (x) { return x.id === id; })[0];
        map.flyTo([o.lat, o.lng], 12, { duration: reduceMotion ? 0 : 1.2 });
        markers[id].openPopup();
        mapEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
    });
    var reset = $('#map-reset');
    if (reset) reset.addEventListener('click', fitAll);
    setTimeout(function () { map.invalidateSize(); }, 300);
  }

  /* ==================== 10. FORM VALIDATION + PROCESSING =================== */

  function value(form, name) {
    var f = form.elements[name];
    if (!f) return '';
    if (f.type === 'checkbox') return f.checked;
    return (f.value || '').trim();                    // RadioNodeList also exposes .value
  }

  function todayISO() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  // Each validator returns an error message, or '' when the value is fine.
  var RULES = {
    fullName: function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Your name looks too short.';
      if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F\s'\u2019.-]*$/.test(v)) return 'Use letters, spaces, hyphens or apostrophes only.';
      return '';
    },
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email address, for example name@example.com.';
      return '';
    },
    phone: function (v, form, optional) {
      if (!v) return optional ? '' : 'Please enter a contact number.';
      var digits = v.replace(/[\s()-]/g, '');
      if (!/^(\+27|0027|0)[1-9][0-9]{8}$/.test(digits)) return 'Enter a South African number, e.g. 082 123 4567 or +27 82 123 4567.';
      return '';
    },
    service: function (v) { return v ? '' : 'Please choose a service.'; },
    urgency: function (v) { return v ? '' : 'Please choose how soon you need us.'; },
    city: function (v) { return v ? '' : 'Please choose where the service is needed.'; },
    startDate: function (v) {
      if (!v) return 'Please choose a preferred start date.';
      if (v < todayISO()) return 'The start date cannot be in the past.';
      var limit = new Date(); limit.setFullYear(limit.getFullYear() + 1);
      if (v > limit.toISOString().slice(0, 10)) return 'Please choose a date within the next 12 months.';
      return '';
    },
    days: function (v) {
      var n = Number(v);
      if (v === '') return 'Please enter how many days you need.';
      if (!Number.isInteger(n) || n < 1 || n > 30) return 'Enter a whole number of days between 1 and 30.';
      return '';
    },
    units: function (v) {
      var n = Number(v);
      if (v === '') return 'Please enter how many you need.';
      if (!Number.isInteger(n) || n < 1 || n > 10) return 'Enter a whole number between 1 and 10.';
      return '';
    },
    details: function (v) {
      if (!v) return 'Please tell us a little about your requirement.';
      if (v.length < 20) return 'Please add a little more detail (at least 20 characters).';
      if (v.length > 1000) return 'Please keep this under 1000 characters.';
      return '';
    },
    topic: function (v) { return v ? '' : 'Please choose a message type.'; },
    subject: function (v) {
      if (!v) return 'Please add a subject.';
      if (v.length < 3) return 'The subject is too short.';
      if (v.length > 100) return 'Please keep the subject under 100 characters.';
      return '';
    },
    message: function (v) {
      if (!v) return 'Please write your message.';
      if (v.length < 20) return 'Please add a little more detail (at least 20 characters).';
      if (v.length > 1000) return 'Please keep your message under 1000 characters.';
      return '';
    },
    consent: function (v) { return v ? '' : 'Please tick the box to continue.'; }
  };

  function setError(form, name, msg) {
    var wrap = form.querySelector('[data-field="' + name + '"]');
    if (!wrap) return;
    var err = $('.field-error', wrap);
    wrap.classList.toggle('has-error', !!msg);
    if (err) { err.textContent = msg; err.hidden = !msg; }
    $$('input, select, textarea', wrap).forEach(function (c) {
      if (msg) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid');
    });
  }

  function validateField(form, name) {
    var rule = RULES[name];
    if (!rule) return true;
    var optional = form.querySelector('[data-field="' + name + '"]').hasAttribute('data-optional');
    var msg = rule(value(form, name), form, optional);
    setError(form, name, msg);
    return !msg;
  }

  // Wire up a form: live validation, submit handling, honeypot, status line.
  function bindForm(form, onValid) {
    var names = $$('[data-field]', form).map(function (w) { return w.getAttribute('data-field'); });
    var status = $('.form-status', form);

    names.forEach(function (name) {
      var wrap = form.querySelector('[data-field="' + name + '"]');
      wrap.addEventListener('focusout', function () { validateField(form, name); });
      wrap.addEventListener('input', function () { if (wrap.classList.contains('has-error')) validateField(form, name); });
      wrap.addEventListener('change', function () { validateField(form, name); });
    });

    $$('[data-counter-for]', form).forEach(function (c) {
      var field = form.elements[c.getAttribute('data-counter-for')];
      var max = field.getAttribute('maxlength') || 1000;
      function upd() { c.textContent = field.value.length + ' / ' + max; }
      field.addEventListener('input', upd); upd();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return;   // honeypot: bots fill this, people never see it
      var bad = names.filter(function (n) { return !validateField(form, n); });
      if (bad.length) {
        status.textContent = 'Please fix ' + bad.length + (bad.length === 1 ? ' field' : ' fields') + ' highlighted below.';
        status.className = 'form-status is-error';
        var first = form.querySelector('[data-field="' + bad[0] + '"] input, [data-field="' + bad[0] + '"] select, [data-field="' + bad[0] + '"] textarea');
        if (first) first.focus();
        return;
      }
      status.textContent = '';
      status.className = 'form-status';
      onValid(form);
    });
  }

  /* -------------------------- Enquiry (enquiry.html) --------------------------- */
  function initEnquiry() {
    var form = $('#enquiry-form');
    if (!form) return;
    var result = $('#enquiry-result');

    form.elements.startDate.min = todayISO();

    // Pre-select a service when arriving from the services page / modal (?service=slug)
    var preset = new URLSearchParams(window.location.search).get('service');
    if (preset && SERVICES[preset]) form.elements.service.value = preset;

    function build(form) {
      var svc = SERVICES[value(form, 'service')];
      var urg = URGENCY[value(form, 'urgency')];
      var days = Number(value(form, 'days'));
      var units = Number(value(form, 'units'));
      var first = value(form, 'fullName').split(/\s+/)[0];

      // ---- cost estimate ----
      var base = svc.rate * units * days;
      var surcharge = Math.round(base * (urg.factor - 1));
      var discountRate = days >= 14 ? 0.10 : days >= 7 ? 0.05 : 0;
      var discount = Math.round((base + surcharge) * discountRate);
      var total = base + surcharge - discount;
      var low = Math.round(total * 0.9 / 50) * 50;
      var high = Math.round(total * 1.1 / 50) * 50;

      var ref = 'AS-' + todayISO().replace(/-/g, '') + '-' + String(Math.floor(1000 + Math.random() * 9000));
      var startNice = new Date(value(form, 'startDate') + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
      var cityEl = form.elements.city;
      var cityText = cityEl.options[cityEl.selectedIndex].text;

      function dl(rows) {
        var node = el('dl', { class: 'summary' });
        rows.forEach(function (r) { node.appendChild(el('dt', { text: r[0] })); node.appendChild(el('dd', { text: r[1] })); });
        return node;
      }

      result.textContent = '';
      var h = el('h2', { id: 'result-title', tabindex: '-1', text: 'Thank you, ' + first + '. Your enquiry is logged.' });
      result.appendChild(h);
      result.appendChild(el('p', { class: 'ref', text: 'Reference: ' + ref }));
      result.appendChild(el('h3', { text: 'Your request' }));
      result.appendChild(dl([
        ['Service', svc.title],
        ['Location', cityText],
        ['Preferred start', startNice],
        ['Duration', days + (days === 1 ? ' day' : ' days')],
        ['Team size', units + ' \u00d7 ' + svc.unit + (units > 1 ? 's' : '')],
        ['Priority', urg.label]
      ]));
      result.appendChild(el('h3', { text: 'Indicative estimate' }));
      var rows = [[units + ' \u00d7 ' + svc.unit + ' \u00d7 ' + days + ' days', money.format(base)]];
      if (surcharge) rows.push(['Priority surcharge', '+ ' + money.format(surcharge)]);
      if (discount) rows.push(['Longer-booking discount (' + Math.round(discountRate * 100) + '%)', '\u2212 ' + money.format(discount)]);
      rows.push(['Estimated range (excl. VAT)', money.format(low) + ' \u2013 ' + money.format(high)]);
      result.appendChild(dl(rows));
      result.appendChild(el('h3', { text: 'Availability' }));
      result.appendChild(el('p', { text: urg.msg }));
      result.appendChild(el('p', { class: 'note', text: 'Figures are indicative only. A final quotation follows your risk assessment call. We will contact you on ' + value(form, 'phone') + ' or ' + value(form, 'email') + '.' }));

      var actions = el('div', { class: 'result-actions' });
      var printBtn = el('button', { class: 'btn btn-sm', type: 'button', text: 'Print this summary' });
      var againBtn = el('button', { class: 'btn btn-sm alt', type: 'button', text: 'Make another enquiry' });
      printBtn.addEventListener('click', function () { window.print(); });
      againBtn.addEventListener('click', function () {
        form.reset();
        $$('[data-field]', form).forEach(function (w) { setError(form, w.getAttribute('data-field'), ''); });
        result.hidden = true; form.hidden = false;
        form.elements.fullName.focus();
      });
      actions.appendChild(printBtn); actions.appendChild(againBtn);
      result.appendChild(actions);

      form.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      h.focus({ preventScroll: true });
    }

    bindForm(form, build);
  }

  /* --------------------------- Contact (contact.html) --------------------------- */
  function initContact() {
    var form = $('#contact-form');
    if (!form) return;
    var result = $('#contact-result');

    function build(form) {
      var topicEl = form.elements.topic;
      var topic = topicEl.options[topicEl.selectedIndex].text;
      var subject = value(form, 'subject').replace(/[\r\n]+/g, ' ');
      var lines = [
        'Name: ' + value(form, 'fullName'),
        'Email: ' + value(form, 'email'),
        'Phone: ' + (value(form, 'phone') || 'not provided'),
        'Message type: ' + topic,
        '',
        value(form, 'message')
      ];
      var mailSubject = '[' + topic + '] ' + subject;
      var body = lines.join('\n');
      var mailto = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(body);

      result.textContent = '';
      var h = el('h2', { id: 'contact-result-title', tabindex: '-1', text: 'Your message is ready to send' });
      result.appendChild(h);
      result.appendChild(el('p', { text: 'Your details passed all checks. Your email app should open with the message addressed to ' + CONTACT_EMAIL + '. Press Send there to finish. If nothing opened, use the button below.' }));
      var preview = el('dl', { class: 'summary' }, [
        el('dt', { text: 'To' }), el('dd', { text: CONTACT_EMAIL }),
        el('dt', { text: 'Subject' }), el('dd', { text: mailSubject }),
        el('dt', { text: 'Message' }), el('dd', { class: 'pre', text: body })
      ]);
      result.appendChild(preview);

      var actions = el('div', { class: 'result-actions' });
      var open = el('a', { class: 'btn btn-sm', href: mailto, text: 'Open in email app' });
      var copy = el('button', { class: 'btn btn-sm alt', type: 'button', text: 'Copy message' });
      var again = el('button', { class: 'btn btn-sm alt', type: 'button', text: 'Write another message' });
      copy.addEventListener('click', function () {
        if (navigator.clipboard) navigator.clipboard.writeText('To: ' + CONTACT_EMAIL + '\nSubject: ' + mailSubject + '\n\n' + body)
          .then(function () { copy.textContent = 'Copied \u2713'; });
      });
      again.addEventListener('click', function () {
        form.reset();
        $$('[data-field]', form).forEach(function (w) { setError(form, w.getAttribute('data-field'), ''); });
        result.hidden = true; form.hidden = false;
        form.elements.fullName.focus();
      });
      [open, copy, again].forEach(function (b) { actions.appendChild(b); });
      result.appendChild(actions);

      form.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      h.focus({ preventScroll: true });
      window.location.href = mailto;                      // opens the visitor's email app (runs inside the submit click)
    }

    bindForm(form, build);
  }

  /* ================================= START ================================= */
  function start() {
    initNav();
    initReveal();
    initCounters();
    initAccordions();
    initTabs();
    initModal();
    initServiceFilter();
    initInsights();
    initLightbox();
    initMap();
    initEnquiry();
    initContact();
  }
  // `defer` normally runs this after parsing; the check keeps it safe either way.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
