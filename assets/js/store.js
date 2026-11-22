/* OSCAR Boutique — browser storage, currency, bag and accessibility settings. */
window.Oscar = window.Oscar || {};

/* Safe browser storage: never throws, works without storage (private windows, blocked cookies). */
Oscar.store = {
  get: function (key, fallback) {
    try { var v = window.localStorage.getItem("oscar." + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set: function (key, value) {
    try { window.localStorage.setItem("oscar." + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }
};

Oscar.esc = function (s) {
  return String(s === undefined || s === null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

/* ───────────── Currency ───────────── */
Oscar.currency = {
  // Approximate value of 1 ILS. Used until live rates load (or if they can't load).
  fallback: { ILS: 1, USD: 0.29, EUR: 0.25, GBP: 0.22, JOD: 0.21, AED: 1.07, RUB: 23, CAD: 0.40 },
  rates: null,
  live: false,
  updated: null,

  init: function () {
    var self = this;
    self.rates = Object.assign({}, self.fallback);
    var cached = Oscar.store.get("rates", null);
    if (cached && cached.rates && Date.now() - cached.saved < 12 * 3600 * 1000) {
      Object.assign(self.rates, cached.rates); self.live = true; self.updated = cached.updated;
      return;
    }
    if (!window.fetch) return;
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 5000);
    fetch("https://open.er-api.com/v6/latest/ILS", ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (data) {
        clearTimeout(timer);
        if (!data || data.result !== "success" || !data.rates) return;
        var picked = {};
        Oscar.config.currencies.forEach(function (c) { if (data.rates[c]) picked[c] = data.rates[c]; });
        Object.assign(self.rates, picked);
        self.live = true;
        self.updated = (data.time_last_update_unix || Date.now() / 1000) * 1000;
        Oscar.store.set("rates", { rates: picked, saved: Date.now(), updated: self.updated });
        document.dispatchEvent(new CustomEvent("oscar:rates"));
      })
      .catch(function () { clearTimeout(timer); /* keep approximate rates */ });
  },

  convert: function (ils, cur) { return ils * (this.rates[cur] || 1); },

  format: function (amount, cur) {
    var locale = Oscar.i18n.meta[Oscar.state.lang].locale;
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency: cur, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(amount);
    } catch (e) { return cur + " " + Math.round(amount); }
  },

  /* Price in ILS, always exact. */
  ils: function (ils) { return this.format(ils, "ILS"); },

  /* Price markup in the visitor's chosen currency. Non-ILS prices are marked approximate. */
  html: function (ils, opts) {
    opts = opts || {};
    var cur = Oscar.state.currency;
    if (cur === "ILS") return '<span class="price" dir="ltr">' + Oscar.esc(this.ils(ils)) + "</span>";
    var conv = this.format(this.convert(ils, cur), cur);
    var out = '<span class="price"><span aria-hidden="true">≈ </span><span class="sr-only">' + Oscar.esc(Oscar.t("price.approx")) + ' </span><span dir="ltr">' + Oscar.esc(conv) + "</span></span>";
    if (opts.withIls) out += ' <span class="price-ils" dir="ltr">' + Oscar.esc(this.ils(ils)) + "</span>";
    return out;
  }
};

/* ───────────── Sales and stock (same rules as the WhatsApp bot: oscar-bot/.../util.ts) ───────────── */
Oscar.pricing = {
  running: function (s, now) {
    now = now || new Date();
    if (!s || s.active === false) return false;
    if (s.startsAt && new Date(s.startsAt) > now) return false;
    if (s.endsAt && new Date(s.endsAt) <= now) return false;
    return true;
  },
  applies: function (s, p) {
    if (s.scope === "all") return true;
    if (s.scope === "categories") {
      /* a sale on evening dresses also covers maxi, mini/midi, modest and couture */
      var cats = p.categories.slice();
      p.categories.forEach(function (c) { var x = Oscar.data.category(c); if (x && x.parent) cats.push(x.parent); });
      return (s.categories || []).some(function (c) { return cats.indexOf(c) !== -1; });
    }
    return (s.productSlugs || []).indexOf(p.slug) !== -1;
  },
  /* Best discount for a piece. Promo-code sales count only when withCode is true and that code was entered. */
  final: function (p, withCode) {
    var promo = withCode && Oscar.state ? Oscar.state.promo : null;
    var list = Oscar.data.sales.slice();
    if (promo) list.push(promo);
    var original = Number(p.price) || 0, best = 0, bestSale = null, now = new Date();
    list.forEach(function (s) {
      if (!Oscar.pricing.running(s, now) || !Oscar.pricing.applies(s, p)) return;
      if (s.code && (!promo || String(promo.code).toUpperCase() !== String(s.code).toUpperCase())) return;
      var off = s.percentOff ? original * s.percentOff / 100 : Number(s.amountOff || 0);
      if (off > best) { best = off; bestSale = s; }
    });
    var price = Math.max(0, Math.round(original - best));
    return { price: price, original: original, sale: bestSale, percent: original > 0 ? Math.round((1 - price / original) * 100) : 0 };
  },
  /* Public sales running now, for the top bar. */
  banners: function () {
    return Oscar.data.sales.filter(function (s) { return !s.code && s.showBanner && Oscar.pricing.running(s); });
  }
};

Oscar.stock = {
  threshold: function (p) {
    if (typeof p.lowStockThreshold === "number") return p.lowStockThreshold;
    return Number(Oscar.data.setting("low_stock_default", 3)) || 3;
  },
  /* Pieces left in a size: a number, or null when not counted. */
  sizeLeft: function (p, size) {
    if ((p.soldOut || []).indexOf(size) !== -1) return 0;
    var v = p.stock ? p.stock[size] : undefined;
    return typeof v === "number" ? v : null;
  },
  soldOut: function (p) {
    if (p.stockTotal === 0) return true;
    if (!p.sizes.length) return false;
    return p.sizes.every(function (s) { return Oscar.stock.sizeLeft(p, s) === 0; });
  },
  /* The "Only N left" number for a piece, or null when there's plenty (or it isn't counted). */
  lowLeft: function (p) {
    if (Oscar.stock.soldOut(p)) return null;
    var limit = Oscar.stock.threshold(p);
    if (typeof p.stockTotal === "number") return p.stockTotal <= limit ? p.stockTotal : null;
    var tracked = p.sizes.map(function (s) { return Oscar.stock.sizeLeft(p, s); });
    if (!tracked.length || tracked.some(function (v) { return v === null; })) return null;
    var total = tracked.reduce(function (a, b) { return a + b; }, 0);
    return total > 0 && total <= limit ? total : null;
  },
  /* Most a visitor can put in the bag for one size of a piece (also counting other sizes for a piece-wide limit). */
  maxQty: function (p, size, otherSizesInBag) {
    var max = 9, left = Oscar.stock.sizeLeft(p, size);
    if (left !== null) max = Math.min(max, left);
    if (typeof p.stockTotal === "number") max = Math.min(max, Math.max(0, p.stockTotal - (otherSizesInBag || 0)));
    return Math.max(0, max);
  }
};

/* ───────────── Shopping bag ───────────── */
Oscar.cart = {
  items: [],
  load: function () {
    var saved = Oscar.store.get("cart", []);
    this.items = Array.isArray(saved) ? saved.filter(function (i) { return i && i.slug && i.size; }) : [];
  },
  save: function () {
    Oscar.store.set("cart", this.items);
    document.dispatchEvent(new CustomEvent("oscar:cart"));
  },
  /* How many of a piece are in the bag in sizes other than this one. */
  others: function (slug, size) {
    return this.items.reduce(function (n, i) { return n + (i.slug === slug && i.size !== size ? i.qty : 0); }, 0);
  },
  max: function (slug, size) {
    var p = Oscar.data.bySlug(slug);
    return p ? Oscar.stock.maxQty(p, size, this.others(slug, size)) : 0;
  },
  /* Drop lines whose piece was removed or sold out, and trim quantities to what's left. */
  prune: function () {
    var self = this, changed = false;
    this.items = this.items.filter(function (i) {
      var p = Oscar.data.bySlug(i.slug);
      if (!p || p.sizes.indexOf(i.size) === -1) { changed = true; return false; }
      return true;
    });
    this.items.forEach(function (i) {
      var max = self.max(i.slug, i.size);
      if (i.qty > max) { i.qty = max; changed = true; }
    });
    var before = this.items.length;
    this.items = this.items.filter(function (i) { return i.qty > 0; });
    if (changed || this.items.length !== before) this.save();
  },
  /* Returns true when added, false when there's no more in stock. */
  add: function (slug, size) {
    var max = this.max(slug, size);
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].slug === slug && this.items[i].size === size) {
        if (this.items[i].qty >= max) return false;
        this.items[i].qty += 1; this.save(); return true;
      }
    }
    if (max < 1) return false;
    this.items.push({ slug: slug, size: size, qty: 1 });
    this.save();
    return true;
  },
  /* Returns false when the wanted quantity was more than what's left. */
  setQty: function (index, qty) {
    var item = this.items[index];
    if (!item) return true;
    if (qty <= 0) { this.items.splice(index, 1); this.save(); return true; }
    var max = this.max(item.slug, item.size), ok = qty <= max;
    item.qty = Math.max(1, Math.min(max, qty));
    this.save();
    return ok;
  },
  remove: function (index) { this.items.splice(index, 1); this.save(); },
  clear: function () { this.items = []; this.save(); },
  count: function () { return this.items.reduce(function (n, i) { return n + i.qty; }, 0); },
  lines: function () {
    return this.items.map(function (i, idx) {
      var p = Oscar.data.bySlug(i.slug);
      if (!p) return null;
      var f = Oscar.pricing.final(p, true);
      return {
        index: idx, product: p, size: i.size, qty: i.qty,
        unit: f.price, original: f.original, sale: f.sale, percent: f.percent,
        total: f.price * i.qty, originalTotal: f.original * i.qty
      };
    }).filter(Boolean);
  },
  subtotal: function () { return this.lines().reduce(function (s, l) { return s + l.total; }, 0); },
  savings: function () { return this.lines().reduce(function (s, l) { return s + (l.originalTotal - l.total); }, 0); }
};

/* ───────────── Accessibility settings ───────────── */
Oscar.a11y = {
  scales: [0.9, 1, 1.15, 1.3],
  defaults: { scale: 1, contrast: false, links: false, font: false, spacing: false, still: false },
  settings: null,
  init: function () {
    this.settings = Object.assign({}, this.defaults, Oscar.store.get("a11y", {}));
    this.apply();
  },
  apply: function () {
    var s = this.settings, root = document.documentElement;
    root.style.fontSize = Math.round(this.scales[s.scale] * 100) + "%";
    root.classList.toggle("a11y-contrast", !!s.contrast);
    root.classList.toggle("a11y-links", !!s.links);
    root.classList.toggle("a11y-font", !!s.font);
    root.classList.toggle("a11y-spacing", !!s.spacing);
    root.classList.toggle("a11y-still", !!s.still);
    Oscar.store.set("a11y", s);
  },
  set: function (key, value) { this.settings[key] = value; this.apply(); },
  reset: function () { this.settings = Object.assign({}, this.defaults); this.apply(); }
};

Oscar.motionOK = function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduce && !(Oscar.a11y.settings && Oscar.a11y.settings.still);
};
