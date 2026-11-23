/* OSCAR Boutique — the storefront: header, pages, bag, checkout, fittings and settings. */
(function () {
  "use strict";
  var O = window.Oscar, C = O.config, t = O.t, tx = O.tx, esc = O.esc;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ───────────── State ───────────── */
  function pickLang() {
    var saved = O.store.get("lang", null);
    if (saved && C.languages.indexOf(saved) !== -1) return saved;
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    var first = String(list[0] || "").slice(0, 2).toLowerCase();
    if (first === "iw") first = "he";
    if (first === "he" || first === "ar" || first === "ru") return first;
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* ignore */ }
    var inIsrael = /Jerusalem|Tel_Aviv|Hebron|Gaza/.test(tz);
    if (first === "en" && !inIsrael) return "en";
    return C.defaultLanguage;
  }
  function pickCurrency() {
    var saved = O.store.get("currency", null);
    return saved && C.currencies.indexOf(saved) !== -1 ? saved : C.baseCurrency;
  }

  O.state = {
    lang: pickLang(),
    currency: pickCurrency(),
    route: null,
    shop: { q: "", sort: "featured" },
    pdpView: "front",
    promo: null, promoInput: "", promoError: "",
    checkout: { name: "", phone: "", email: "", delivery: "pickup", address: "", city: "", notes: "", ready: false, message: "" },
    fitting: { name: "", phone: "", date: "", time: "any", event: "wedding", size: "", notes: "", ready: false, message: "" }
  };

  /* ───────────── Icons (generic line icons) ───────────── */
  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3.5 7h17M3.5 12h17M3.5 17h11"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M5 8.5h14l-1.1 12H6.1L5 8.5z"/><path d="M9 8.5V6.8a3 3 0 0 1 6 0v1.7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="6.8" r="1.4" fill="currentColor" stroke="none"/><path d="M7.2 9.6l4.8 1.1 4.8-1.1M12 10.7v3.6M12 14.3l-2.6 4.4M12 14.3l2.6 4.4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5h16v10.5H10l-6 4.5V5.5z"/><circle cx="8.5" cy="10.8" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="10.8" r=".9" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10.8" r=".9" fill="currentColor" stroke="none"/></svg>',
    scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="6.5" r="2.6"/><circle cx="6" cy="17.5" r="2.6"/><path d="M8.2 8 20 18.5M8.2 16 20 5.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9.5 6 6 6-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-6.5-5.8-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4.2-2 1.4a11 11 0 0 0 5.8 5.8l1.4-2 4.2 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4.5 6.5h15v13h-15z"/><path d="M4.5 10.5h15M8.5 4v4M15.5 4v4"/></svg>',
    /* The WhatsApp glyph (Simple Icons, CC0), drawn in the site's own black and white */
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41"/></svg>'
  };
  var SIZES = {
    card: "(min-width: 1100px) 25vw, (min-width: 720px) 33vw, 50vw",
    tile: "(min-width: 900px) 33vw, 64vw",
    main: "(min-width: 900px) 55vw, 100vw",
    hero: "(min-width: 900px) 34vw, 100vw",
    split: "(min-width: 900px) 50vw, 100vw",
    tiny: "80px"
  };
  var CUR_SYMBOL = { ILS: "₪", USD: "$", EUR: "€", GBP: "£", JOD: "JD", AED: "AED", RUB: "₽", CAD: "CA$" };

  /* ───────────── Helpers ───────────── */
  function wa(text) { return "https://wa.me/" + C.phoneIntl + (text ? "?text=" + encodeURIComponent(text) : ""); }
  // "#12 Black Zip Gown": the dress number helps the shop find the piece (and use it with its WhatsApp bot).
  function refName(p) { return (p && p.id ? "#" + p.id + " " : "") + tx(p.name); }
  function brandify(s) { return esc(s).replace("OSCAR", '<span class="brand-word">OSCAR</span>'); }
  function catLabel(id) { return t("cat." + id); }
  function primaryCat(p) {
    var known = O.categories.map(function (c) { return c.id; });
    return known.filter(function (id) { return p.categories.indexOf(id) !== -1; })[0] || "evening";
  }
  /* Breadcrumb trail for a category: [parent, child] or [category]. */
  function catTrail(id) {
    var c = O.data.category(id);
    return c && c.parent ? [c.parent, id] : [id];
  }
  function catLinks(ids, cls) {
    return ids.map(function (id) {
      var c = O.data.category(id);
      return c ? '<li><a href="#shop-' + id + '"' + (cls ? ' class="' + cls + '"' : "") + ">" + esc(t(c.key)) + "</a></li>" : "";
    }).join("");
  }
  /* A lookbook piece (with a cut-out photo) from a category, preferring one not used yet. */
  function lookFor(cat, used) {
    var inCat = O.data.inCategory(cat).map(function (p) { return p.slug; });
    var looks = (O.lookbook || []).filter(function (l) { return inCat.indexOf(l.slug) !== -1; });
    var pick = looks.filter(function (l) { return !used || !used[l.slug]; })[0] || looks[0];
    if (pick && used) used[pick.slug] = true;
    return pick || null;
  }
  /* Desktop header: evening dresses (with its sub-menu), suits, jumpsuits, SALE. */
  function navDesktop() {
    return O.menu.map(function (id) {
      if (id === "sale") return '<a href="#shop-sale">' + esc(t("cat.sale")) + "</a>";
      var c = O.data.category(id);
      if (!c) return "";
      if (!c.children) return '<a href="#shop-' + id + '">' + esc(t(c.key)) + "</a>";
      /* Beside the links, a cut-out of a piece from the category under the pointer */
      var used = {};
      var shots = [id].concat(c.children).map(function (cid) {
        var look = lookFor(cid, used);
        return look ? '<img src="' + esc(O.cutout(look.slug, 640)) + '" alt="" width="' + look.w[0] + '" height="640" loading="lazy" decoding="async" data-pv="' + cid + '"' + (cid === id ? ' class="on"' : "") + ">" : "";
      }).join("");
      return '<div class="nav-drop">' +
        '<a href="#shop-' + id + '">' + esc(t(c.key)) + "</a>" +
        '<button type="button" class="nav-drop-btn" aria-expanded="false" aria-controls="drop-' + id + '" aria-label="' + esc(t("nav.sub", { name: t(c.key) })) + '">' + ICON.chevron + "</button>" +
        '<div class="nav-drop-panel" id="drop-' + id + '"><ul class="drop-list">' +
          catLinks([id], "drop-all").replace(esc(t(c.key)), esc(t("cat.allEvening"))) + catLinks(c.children) + "</ul>" +
          (shots ? '<div class="drop-preview" aria-hidden="true">' + shots + "</div>" : "") +
        "</div>" +
      "</div>";
    }).join("");
  }
  function closeDrops(except) {
    $$(".nav-drop.open").forEach(function (d) {
      if (d === except) return;
      d.classList.remove("open");
      var b = d.querySelector(".nav-drop-btn"); if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  /* Side menu: the same tree, with the sub-menu open. */
  function menuTree() {
    return O.menu.map(function (id) {
      if (id === "sale") return '<li><a href="#shop-sale">' + esc(t("cat.sale")) + "</a></li>";
      var c = O.data.category(id);
      if (!c) return "";
      if (!c.children) return catLinks([id]);
      return '<li class="menu-group"><div class="menu-group-head"><a href="#shop-' + id + '">' + esc(t(c.key)) + "</a>" +
        '<button type="button" class="icon-btn menu-sub-btn" aria-expanded="true" aria-controls="menu-sub-' + id + '" aria-label="' + esc(t("nav.sub", { name: t(c.key) })) + '">' + ICON.chevron + "</button></div>" +
        '<ul class="menu-sub" id="menu-sub-' + id + '">' + catLinks(c.children) + "</ul></li>";
    }).join("");
  }
  /* Which photo leads: the plain-backdrop studio shot when a piece has one, so every grid reads as one shoot. */
  function leadPhoto(p) {
    var imgs = p.images || [];
    for (var i = 0; i < imgs.length; i++) if (/-studio-/.test(imgs[i])) return i;
    return 0;
  }
  function soldOutAll(p) { return O.stock.soldOut(p); }
  function sizeLabel(s) { return s === "ONE" ? t("product.oneSize") : s; }
  function onSale() { return O.data.products.filter(function (p) { return O.pricing.final(p, false).percent > 0; }); }
  function dealText(s) {
    if (!s) return "";
    return s.percentOff ? t("sale.off", { n: Math.round(s.percentOff) }) : t("sale.offAmount", { amount: O.currency.ils(s.amountOff || 0) });
  }
  function stockText(n) { return n === 1 ? t("stock.one") : t("stock.only", { n: n }); }
  /* A price, or a sale price with the old price struck through. Screen readers hear both labelled. */
  function amountHTML(now, was, opts) {
    if (!(was > now)) return O.currency.html(now, opts);
    return '<span class="price-sale"><span class="sr-only">' + esc(t("price.now")) + " </span>" + O.currency.html(now, opts) + "</span> " +
      '<s class="price-was"><span class="sr-only">' + esc(t("price.was")) + " </span>" + O.currency.html(was) + "</s>";
  }
  function priceHTML(p, opts) {
    var f = O.pricing.final(p, !!(opts && opts.withCode));
    return amountHTML(f.price, f.original, opts);
  }
  function sizeLeftText(p, size) {
    var left = O.stock.sizeLeft(p, size);
    return left !== null && left > 0 && left <= O.stock.threshold(p) ? t("stock.sizeLeft", { n: left, size: sizeLabel(size) }) : "";
  }

  /* ───────────── Holiday look, announcement and settings from the WhatsApp bot ───────────── */
  function notExpired(v) { return !v || !v.until || new Date(v.until) > new Date(); }
  function activeTheme() {
    var th = O.data.setting("theme", null);
    if (!th || !th.preset || th.preset === "none" || !notExpired(th)) return null;
    return th;
  }
  function themeMessage(th) {
    var msg = tx(th.message);
    if (!msg) { var base = (O.themes || []).filter(function (x) { return x.id === th.preset; })[0]; msg = base ? tx(base.message) : ""; }
    return msg;
  }
  function activeAnnouncement() {
    var a = O.data.setting("announcement", null);
    return a && a.text && tx(a.text) && notExpired(a) ? a : null;
  }
  /* Black or white text, whichever reads better on the holiday colour. */
  function readableOn(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return "#FFFFFF";
    var n = parseInt(m[1], 16);
    var lin = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    var L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.05) ? "#FFFFFF" : "#111111";
  }
  function applyTheme() {
    var th = activeTheme(), root = document.documentElement;
    root.classList.toggle("has-theme", !!th);
    if (th && /^#[0-9a-fA-F]{6}$/.test(th.accent || "")) {
      root.style.setProperty("--theme", th.accent);
      root.style.setProperty("--theme-fg", readableOn(th.accent));
    } else { root.style.removeProperty("--theme"); root.style.removeProperty("--theme-fg"); }
  }
  function startDecorations() {
    var th = activeTheme(), hero = $("#content .hero");
    if (!th || th.decorations_on === false || !th.decoration || th.decoration === "none" || !hero || !O.decorations) { if (O.decorations) O.decorations.stop(); return; }
    O.decorations.start(hero, th.decoration, th.accent);
  }
  function applySettings() {
    var S = O.data.settings || {};
    if (Array.isArray(S.hero_products) && S.hero_products.length) C.heroProducts = S.hero_products;
    if (typeof S.hero_banner === "boolean") C.heroBannerOn = S.hero_banner;
    if (S.fitting_product) C.fittingProduct = S.fitting_product;
    if (Array.isArray(S.hours) && S.hours.length) C.hours = S.hours;
    if (typeof S.preview_mode === "boolean") C.previewMode = S.preview_mode;
    if (S.accessibility_contact) {
      var cur = C.accessibilityContact || {};
      C.accessibilityContact = { name: S.accessibility_contact.name || cur.name || "", phone: S.accessibility_contact.phone || cur.phone || "" };
    }
  }
  function previewTools() { return C.previewMode && O.data.source === "sample" && (O.themes || []).length; }
  function announce(msg) { var live = $("#live"); live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 60); }
  function fmtDate(ms) {
    try { return new Intl.DateTimeFormat(O.i18n.meta[O.state.lang].locale, { dateStyle: "medium" }).format(new Date(ms)); }
    catch (e) { return new Date(ms).toDateString(); }
  }
  function todayISO() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }

  function langOptions() {
    return C.languages.map(function (code) {
      var m = O.i18n.meta[code];
      return '<option value="' + code + '" lang="' + code + '"' + (code === O.state.lang ? " selected" : "") + ">" + esc(m.name) + "</option>";
    }).join("");
  }
  function curOptions() {
    return C.currencies.map(function (c) {
      return '<option value="' + c + '"' + (c === O.state.currency ? " selected" : "") + ">" + esc(CUR_SYMBOL[c] && CUR_SYMBOL[c] !== c ? CUR_SYMBOL[c] + " " + c : c) + "</option>";
    }).join("");
  }
  function selectBox(id, cls, labelKey, options, visibleLabel) {
    return '<div class="tool-select"><label ' + (visibleLabel ? "" : 'class="sr-only" ') + 'for="' + id + '">' + esc(t(labelKey)) + "</label>" +
      '<select id="' + id + '" class="' + cls + '">' + options + "</select></div>";
  }
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="' + esc(t("crumb.label")) + '"><ol>' + items.map(function (it, i) {
      return i === items.length - 1 ? '<li aria-current="page">' + esc(it[0]) + "</li>" : '<li><a href="' + it[1] + '">' + esc(it[0]) + "</a></li>";
    }).join("") + "</ol></nav>";
  }
  function hoursHTML() {
    if (!C.hours || !C.hours.length) return '<p class="note">' + esc(t("visit.hoursTbd")) + "</p>";
    return '<table class="hours"><tbody>' + C.hours.map(function (h) {
      return '<tr><th scope="row">' + esc(tx(h.days)) + '</th><td dir="ltr">' + esc(h.hours) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  /* ───────────── Chrome: header, footer, floating buttons, drawers ───────────── */
  function wordmark() {
    var inner = C.logo
      ? '<img src="' + esc(C.logo) + '" alt="">'
      : '<span class="mark" aria-hidden="true">OSCAR</span>';
    return '<a class="wordmark" href="#" aria-label="OSCAR Boutique, ' + esc(t("nav.home")) + '">' + inner + "</a>";
  }

  function renderHeader() {
    $("#site-header").innerHTML =
      '<div class="header-inner">' +
        '<div class="header-start">' +
          '<button class="icon-btn menu-btn" id="menu-btn" type="button" aria-haspopup="dialog" aria-controls="menu-dialog" aria-label="' + esc(t("nav.menu")) + '">' + ICON.menu + "</button>" +
          '<a class="contact-btn" href="#book" aria-label="' + esc(t("nav.book")) + '">' + ICON.calendar + '<span class="contact-label" aria-hidden="true">' + esc(t("nav.book")) + "</span></a>" +
        "</div>" +
        wordmark() +
        '<div class="header-end">' +
          selectBox("lang-select", "js-lang", "lang.label", langOptions()) +
          selectBox("cur-select", "js-cur", "cur.label", curOptions()) +
          '<button class="icon-btn" id="cart-btn" type="button" aria-haspopup="dialog" aria-controls="cart-dialog">' + ICON.bag +
            '<span class="cart-count" id="cart-count" aria-hidden="true" hidden></span></button>' +
        "</div>" +
        '<nav class="nav-desktop" aria-label="' + esc(t("nav.main")) + '">' + navDesktop() + "</nav>" +
      "</div>";
    updateCartBadge();
  }

  function updateCartBadge() {
    var n = O.cart.count(), badge = $("#cart-count"), btn = $("#cart-btn");
    if (!badge || !btn) return;
    badge.innerHTML = "<span>" + n + "</span>";
    badge.hidden = n === 0;
    btn.setAttribute("aria-label", t("cart.open") + ". " + t("cart.badge", { n: n }));
  }

  function renderFooter() {
    var cats = catLinks(O.categories.map(function (c) { return c.id; })) + '<li><a href="#shop-sale">' + esc(t("cat.sale")) + "</a></li>";
    var th = activeTheme();
    var tester = previewTools()
      ? '<div class="theme-try tool-select"><label for="theme-try">' + esc(t("preview.themes")) + '</label><select id="theme-try"><option value="">' + esc(t("preview.themeNone")) + "</option>" +
          O.themes.map(function (x) { return '<option value="' + esc(x.id) + '"' + (th && th.preset === x.id ? " selected" : "") + ">" + esc(tx(x.name)) + "</option>"; }).join("") +
        "</select></div>"
      : "";
    var rates = O.currency.live && O.currency.updated ? t("footer.ratesLive", { date: fmtDate(O.currency.updated) }) : t("footer.ratesApprox");
    $("#site-footer").innerHTML =
      '<div class="wrap footer-inner">' +
        '<div class="footer-brand"><img class="footer-logo" src="assets/img/logo/logo-wordmark-tagline-black.png" alt="OSCAR · ' + esc(t("hero.eyebrow").split(" · ")[0]) + '" width="380" height="200" loading="lazy"><p>' + esc(t("footer.brand")) + "</p></div>" +
        '<nav class="footer-col" aria-labelledby="f-shop"><h2 id="f-shop">' + esc(t("nav.shop")) + "</h2><ul>" + cats + "</ul></nav>" +
        '<nav class="footer-col" aria-labelledby="f-info"><h2 id="f-info">' + esc(t("footer.links")) + "</h2><ul>" +
          '<li><a href="#contact">' + esc(t("nav.contact")) + "</a></li>" +
          '<li><a href="#accessibility">' + esc(t("a11y.statement")) + "</a></li>" +
          '<li><a href="#policies">' + esc(t("footer.policies")) + "</a></li>" +
          '<li><a href="' + esc(C.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>' +
        "</ul></nav>" +
        '<div class="footer-col"><h2>' + esc(t("footer.contact")) + "</h2><ul>" +
          "<li>" + esc(tx(C.address)) + "</li>" +
          '<li><span dir="ltr" class="phone-number">' + esc(C.phoneDisplay) + "</span></li>" +
          '<li><a href="' + wa(t("wa.hello")) + '" target="_blank" rel="noopener">WhatsApp</a></li>' +
          '<li><a href="' + esc(C.wazeUrl) + '" target="_blank" rel="noopener">' + esc(t("visit.waze")) + "</a></li>" +
        "</ul></div>" +
      "</div>" +
      '<div class="wrap footer-bottom">' +
        "<p>" + esc(t("footer.rights", { year: new Date().getFullYear() })) + "</p>" +
        '<p class="credit">' + esc(t("footer.credit", { name: "§" })).replace("§", '<span dir="ltr" lang="en">' + esc(C.siteDesigner) + "</span>") + "</p>" +
        /* Only for visitors who switched to another currency (the free rates service asks to be credited where its rates are shown) */
        (O.state.currency !== "ILS" ? "<p>" + esc(t("footer.rates")) + ' <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">ExchangeRate-API</a> · ' + esc(rates) + "</p>" : "") + tester +
      "</div>";
  }

  function renderFloats() {
    $("#a11y-btn").innerHTML = ICON.access;
    $("#a11y-btn").setAttribute("aria-label", t("a11y.open"));
    $("#a11y-btn").title = t("a11y.open");
    var w = $("#wa-float");
    w.href = wa(t("wa.hello"));
    w.setAttribute("aria-label", t("wa.float"));
    w.title = "WhatsApp";
    w.innerHTML = ICON.whatsapp;
  }

  function renderMenu() {
    $("#menu-dialog").innerHTML =
      '<div class="drawer-inner">' +
        '<div class="drawer-head"><h2 id="menu-title">' + esc(t("nav.menu")) + '</h2><button class="icon-btn" type="button" data-close aria-label="' + esc(t("nav.close")) + '">' + ICON.close + "</button></div>" +
        '<div class="drawer-body">' +
          '<nav aria-label="' + esc(t("nav.main")) + '"><ul class="menu-links">' +
            '<li><a href="#">' + esc(t("nav.home")) + "</a></li>" + menuTree() +
          "</ul></nav>" +
          '<ul class="menu-links small"><li><a href="#contact">' + esc(t("nav.contact")) + "</a></li></ul>" +
          '<a class="btn btn-block menu-contact" href="#book">' + esc(t("nav.book")) + "</a>" +
          '<div class="menu-tools">' +
            selectBox("menu-lang", "js-lang", "lang.label", langOptions(), true) +
            selectBox("menu-cur", "js-cur", "cur.label", curOptions(), true) +
          "</div>" +
          '<p class="note">' + esc(tx(C.address)) + ' · <span dir="ltr">' + esc(C.phoneDisplay) + "</span></p>" +
        "</div>" +
      "</div>";
  }

  function renderA11y() {
    var s = O.a11y.settings;
    function toggle(key, label) {
      return '<button type="button" class="toggle" data-a11y="' + key + '" aria-pressed="' + (!!s[key]) + '"><span>' + esc(t(label)) + '</span><span class="switch" aria-hidden="true"></span></button>';
    }
    $("#a11y-dialog").innerHTML =
      '<div class="drawer-inner">' +
        '<div class="drawer-head"><h2 id="a11y-title">' + esc(t("a11y.title")) + '</h2><button class="icon-btn" type="button" data-close aria-label="' + esc(t("a11y.close")) + '">' + ICON.close + "</button></div>" +
        '<div class="drawer-body">' +
          '<div class="a11y-group" role="group" aria-labelledby="a11y-text-h"><h3 id="a11y-text-h">' + esc(t("a11y.text")) + "</h3>" +
            '<div class="seg">' +
              '<button type="button" data-scale="down" aria-label="' + esc(t("a11y.smaller")) + '">A−</button>' +
              '<button type="button" data-scale="reset" aria-label="' + esc(t("a11y.default")) + '">A</button>' +
              '<button type="button" data-scale="up" aria-label="' + esc(t("a11y.larger")) + '">A+</button>' +
            "</div>" +
            '<p class="note" id="scale-out" aria-live="polite">' + esc(t("a11y.scale", { n: Math.round(O.a11y.scales[s.scale] * 100) + "%" })) + "</p>" +
          "</div>" +
          '<div class="toggle-list">' +
            toggle("contrast", "a11y.contrast") + toggle("links", "a11y.links") + toggle("font", "a11y.font") +
            toggle("spacing", "a11y.spacing") + toggle("still", "a11y.motion") +
          "</div>" +
          '<button type="button" class="btn btn-ghost btn-block" data-a11y-reset>' + esc(t("a11y.reset")) + "</button>" +
          '<a class="text-link" href="#accessibility">' + esc(t("a11y.statement")) + "</a>" +
        "</div>" +
      "</div>";
  }

  function bagLine(l) {
    var name = esc(tx(l.product.name));
    return '<div class="bag-line">' +
      '<div class="thumb-art">' + O.art.render(l.product, 0, { decorative: true, sizes: SIZES.tiny }) + "</div>" +
      '<div class="bag-info">' +
        "<h3>" + name + "</h3>" +
        '<p class="bag-meta">' + esc(t("cart.size")) + " " + esc(sizeLabel(l.size)) + " · " + esc(tx(l.product.color)) + "</p>" +
        "<p>" + amountHTML(l.total, l.originalTotal) + "</p>" +
        '<div class="bag-controls">' +
          '<div class="stepper" role="group" aria-label="' + esc(t("cart.qty")) + ": " + name + '">' +
            '<button type="button" data-qty="' + l.index + '" data-delta="-1" aria-label="' + esc(t("cart.dec")) + '">−</button>' +
            "<output>" + l.qty + "</output>" +
            '<button type="button" data-qty="' + l.index + '" data-delta="1" aria-label="' + esc(t("cart.inc")) + '"' +
              (l.qty >= O.cart.max(l.product.slug, l.size) ? ' aria-disabled="true"' : "") + ">+</button>" +
          "</div>" +
          '<button type="button" class="link-btn" data-remove="' + l.index + '">' + esc(t("cart.remove")) + '<span class="sr-only">: ' + name + "</span></button>" +
        "</div>" +
      "</div></div>";
  }

  function renderCart() {
    var lines = O.cart.lines(), sub = O.cart.subtotal(), saved = O.cart.savings();
    var body = lines.length ? lines.map(bagLine).join("")
      : '<div class="empty"><p>' + esc(t("cart.empty")) + '</p><a class="btn" href="#shop">' + esc(t("cart.emptyCta")) + "</a></div>";
    var foot = lines.length ?
      '<div class="drawer-foot">' +
        (saved > 0 ? '<div class="sum-row sum-save"><span>' + esc(t("cart.savings")) + "</span><span>" + O.currency.html(saved) + "</span></div>" : "") +
        '<div class="sum-row"><span>' + esc(t("cart.subtotal")) + "</span><span>" + O.currency.html(sub) + "</span></div>" +
        (O.state.currency !== "ILS" ? '<p class="note"><span dir="ltr">' + esc(O.currency.ils(sub)) + "</span> · " + esc(t("price.note")) + "</p>" : "") +
        '<a class="btn btn-block" href="#checkout">' + esc(t("cart.checkout")) + "</a>" +
      "</div>" : "";
    $("#cart-dialog").innerHTML =
      '<div class="drawer-inner">' +
        '<div class="drawer-head"><h2 id="cart-title">' + esc(t("cart.title")) + '</h2><button class="icon-btn" type="button" data-close aria-label="' + esc(t("cart.close")) + '">' + ICON.close + "</button></div>" +
        '<div class="drawer-body">' + body + "</div>" + foot +
      "</div>";
  }

  function renderChrome() {
    $("#skip-link").textContent = t("skip");
    applyTheme();
    /* Top bar: holiday greeting, the owner's announcement and running sales, or the address line. */
    var msgs = [], th = activeTheme(), an = activeAnnouncement();
    if (th && themeMessage(th)) msgs.push(esc(themeMessage(th)));
    if (an) msgs.push(esc(tx(an.text)));
    O.pricing.banners().forEach(function (s) {
      var title = tx(s.title) || dealText(s);
      var ends = s.endsAt ? " · " + t("sale.ends", { date: fmtDate(new Date(s.endsAt).getTime()) }) : "";
      msgs.push('<a href="#shop-sale">' + esc(title + ends) + "</a>");
    });
    var special = msgs.length > 0;
    var main = special ? msgs.slice(0, 3).join('<span class="ann-sep" aria-hidden="true"> · </span>') : esc(t("announce"));
    $("#announce").innerHTML = C.previewMode
      ? '<span class="ann-preview' + (special ? " with-msg" : "") + '">' + esc(t("preview")) + '</span><span class="ann-main' + (special ? "" : " with-preview") + '"><span class="ann-sep" aria-hidden="true">  ·  </span>' + main + "</span>"
      : '<span class="ann-main">' + main + "</span>";
    renderHeader(); renderFooter(); renderFloats(); renderMenu(); renderA11y(); renderCart();
    markCurrentLinks();
    measureAnnounce();
  }

  function markCurrentLinks() {
    var h = location.hash || "#";
    $$(".nav-desktop a, .footer-col a, .menu-links a, .contact-btn").forEach(function (a) {
      if (a.getAttribute("href") === h) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* ───────────── Product card ───────────── */
  /* A card is a photo, a name and a price. One quiet label at most ("sold out" or "new");
     a sale shows only as the struck-through old price, never as a red badge. */
  function card(p) {
    var out = soldOutAll(p), f = O.pricing.final(p, false), lead = leadPhoto(p);
    var label = out ? t("badge.soldout") : p.isNew ? t("badge.new") : "";
    var alt = p.images && p.images.length > 1 ? (lead === 0 ? 1 : 0) : -1;
    return '<article class="card reveal">' +
      '<div class="card-media">' + O.art.render(p, lead, { sizes: SIZES.card }) +
        /* The other photo (the boutique shot) shows on hover */
        (alt >= 0 ? O.art.photo(p, alt, { decorative: true, sizes: SIZES.card }).replace('class="art-img"', 'class="art-img art-alt"') : "") +
        (label ? '<div class="card-badges"><span class="badge">' + esc(label) + "</span></div>" : "") + "</div>" +
      '<div class="card-body">' +
        '<h3 class="card-name"><a href="#p-' + esc(p.slug) + '" data-card>' + esc(tx(p.name)) + "</a></h3>" +
        '<p class="card-price">' + amountHTML(f.price, f.original) + "</p>" +
      "</div></article>";
  }

  /* ───────────── Pages ───────────── */
  var VIEWS = {};

  function heroImg(p, i) {
    var src = p.images && p.images[0] ? p.images[0].replace(/-1080\.webp$/, "-hero.webp") : "";
    if (!src) return "";
    return '<img src="' + esc(src) + '" alt="" width="1000" height="1333" decoding="async"' +
      (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ">";
  }

  /* ───────────── Lookbook: cut-out pieces on a coloured stage ─────────────
     The piece in front is big; its neighbours wait at the sides. Drag, swipe, the arrows, the keyboard
     or the strip underneath move between them. The stage takes the colour of the piece in front. */
  function lookbookLooks() {
    return (O.lookbook || []).map(function (l) {
      var p = O.data.bySlug(l.slug);
      return p && !soldOutAll(p) ? { look: l, p: p } : null;
    }).filter(Boolean);
  }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function sizeSpan(p) {
    var s = p.sizes || [];
    return s.length > 2 ? s[0] + "–" + s[s.length - 1] : s.join(", ");
  }
  function lookDetail(x, i, n) {
    var p = x.p, f = O.pricing.final(p, false), sizes = sizeSpan(p);
    return '<p class="lb-count" aria-hidden="true"><b>' + two(i + 1) + "</b><span> / " + two(n) + "</span></p>" +
      '<p class="lb-cat">' + esc(catLabel(primaryCat(p))) + "</p>" +
      '<h3 class="lb-name">' + esc(tx(p.name)) + "</h3>" +
      '<p class="lb-meta">' + esc(tx(p.color)) +
        (sizes ? ' · ' + esc(t("lb.sizes", { sizes: "§" })).replace("§", '<span dir="ltr">' + esc(sizes) + "</span>") : "") + "</p>" +
      '<p class="lb-price">' + amountHTML(f.price, f.original) + "</p>" +
      '<div class="btn-row"><a class="btn" href="#p-' + esc(p.slug) + '">' + esc(t("lb.view")) + "</a></div>";
  }
  function lookbookHTML() {
    var looks = lookbookLooks(), n = looks.length;
    if (n < 3) return "";
    var i = ((O.state.lb || 0) % n + n) % n, x = looks[i];
    var figures = looks.map(function (y, k) {
      var l = y.look;
      return '<figure class="lb-look" data-k="' + k + '"' + (k === i ? "" : ' aria-hidden="true"') + ">" +
        '<img src="' + esc(O.cutout(l.slug, 1100)) + '" srcset="' + esc(O.cutout(l.slug, 640)) + " " + l.w[0] + "w, " + esc(O.cutout(l.slug, 1100)) + " " + l.w[1] + 'w"' +
        ' sizes="(min-width: 900px) 22vw, 44vw" width="' + l.w[1] + '" height="1100" alt="' + esc(tx(y.p.name) + ", " + tx(y.p.color)) + '"' +
        ' draggable="false" decoding="async"' + (Math.abs(k - i) > 2 ? ' loading="lazy"' : "") + "></figure>";
    }).join("");
    var strip = looks.map(function (y, k) {
      return '<button type="button" class="lb-thumb" data-lb="' + k + '"' + (k === i ? ' aria-current="true"' : "") +
        ' aria-label="' + esc(t("lb.pick", { n: k + 1, name: tx(y.p.name) })) + '">' +
        '<img src="' + esc(O.cutout(y.look.slug, 640)) + '" alt="" width="' + y.look.w[0] + '" height="640" loading="lazy" decoding="async" draggable="false"></button>';
    }).join("");
    var arrow = function (d) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
        (d > 0 ? "M5 12h14m-5-5 5 5-5 5" : "M19 12H5m5-5-5 5 5 5") + '"/></svg>';
    };
    /* One quiet stage for every piece (the site's own off-white, or near-black at night), so the dresses carry the colour */
    return '<section class="lookbook" id="lookbook" aria-roledescription="carousel" aria-label="' + esc(t("lb.label", { n: n })) + '">' +
      '<div class="wrap lb-grid">' +
        '<div class="lb-head"><p class="eyebrow">' + esc(t("lb.eyebrow")) + '</p><h2 class="lb-title">' + esc(t("lb.title")) + '</h2><p class="lb-lead">' + esc(t("lb.lead")) + "</p></div>" +
        '<div class="lb-stage" id="lb-stage" tabindex="0" aria-describedby="lb-hint">' +
          '<div class="lb-word" aria-hidden="true"><span>' + esc(tx(x.p.color)) + "</span></div>" + figures + '<span class="lb-floor" aria-hidden="true"></span></div>' +
        '<div class="lb-nav">' +
          '<button type="button" class="lb-arrow" data-lb-step="-1" aria-controls="lb-stage" aria-label="' + esc(t("lb.prev")) + '">' + arrow(-1) + "</button>" +
          '<span class="lb-progress" aria-hidden="true"><span style="--p:' + ((i + 1) / n) + '"></span></span>' +
          '<button type="button" class="lb-arrow" data-lb-step="1" aria-controls="lb-stage" aria-label="' + esc(t("lb.next")) + '">' + arrow(1) + "</button>" +
        "</div>" +
        '<div class="lb-detail" id="lb-detail">' + lookDetail(x, i, n) + "</div>" +
        '<div class="lb-strip" role="group" aria-label="' + esc(t("lb.title")) + '">' + strip + "</div>" +
        '<p class="sr-only" id="lb-hint">' + esc(t("lb.hint")) + '</p><p class="sr-only" id="lb-live" aria-live="polite"></p>' +
      "</div>" +
    "</section>";
  }

  var LB = {
    looks: [], i: 0,
    mount: function () {
      var sec = $("#lookbook");
      if (!sec) return;
      this.sec = sec; this.stage = $("#lb-stage"); this.looks = lookbookLooks();
      this.i = ((O.state.lb || 0) % this.looks.length + this.looks.length) % this.looks.length;
      this.layout(false);
      this.bindStage();
    },
    /* Places every piece by its distance from the one in front (wrapping around both ends). */
    layout: function (announceIt) {
      var n = this.looks.length, i = this.i;
      $$(".lb-look", this.stage).forEach(function (fig) {
        var k = +fig.getAttribute("data-k"), d = k - i;
        if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        var a = Math.abs(d);
        fig.style.setProperty("--d", d);
        fig.style.setProperty("--s", a === 0 ? 1 : a === 1 ? 0.64 : a === 2 ? 0.46 : 0.34);
        fig.style.setProperty("--o", a === 0 ? 1 : a === 1 ? 0.92 : a === 2 ? 0.5 : 0);
        fig.style.zIndex = String(10 - a);
        fig.classList.toggle("is-front", a === 0);
        fig.classList.toggle("is-near", a === 1);
        if (a === 0) fig.removeAttribute("aria-hidden"); else fig.setAttribute("aria-hidden", "true");
      });
      if (!announceIt) return;
      var x = this.looks[i], f = O.pricing.final(x.p, false);
      var word = $(".lb-word", this.sec);
      word.innerHTML = '<span class="lb-word-in">' + esc(tx(x.p.color)) + "</span>";
      $("#lb-detail").innerHTML = lookDetail(x, i, n);
      var bar = $(".lb-progress span", this.sec); if (bar) bar.style.setProperty("--p", (i + 1) / n);
      $$(".lb-thumb", this.sec).forEach(function (b) {
        if (+b.getAttribute("data-lb") === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
      /* Slide the strip sideways so the chosen piece is in view, without moving the page itself */
      var cur = $('.lb-thumb[aria-current="true"]', this.sec), strip = $(".lb-strip", this.sec);
      if (cur && strip) {
        var sr = strip.getBoundingClientRect(), cr = cur.getBoundingClientRect();
        var delta = (cr.left + cr.width / 2) - (sr.left + sr.width / 2);
        try { strip.scrollBy({ left: delta, behavior: O.motionOK() ? "smooth" : "auto" }); } catch (e) { strip.scrollLeft += delta; }
      }
      $("#lb-live").textContent = t("lb.now", { n: i + 1, total: n, name: tx(x.p.name), price: O.state.currency && O.state.currency !== "ILS" ? "≈ " + O.currency.format(O.currency.convert(f.price, O.state.currency), O.state.currency) : O.currency.ils(f.price) });
    },
    go: function (k) {
      var n = this.looks.length;
      if (!n) return;
      this.i = ((k % n) + n) % n;
      O.state.lb = this.i;
      this.layout(true);
    },
    step: function (d) { this.go(this.i + d); },
    /* Drag / swipe on the stage. Next sits at the reading end: right in English, left in Hebrew and Arabic. */
    bindStage: function () {
      var self = this, st = this.stage, startX = 0, startY = 0, dx = 0, down = false, moved = false, target = null, dir = document.documentElement.getAttribute("dir") === "rtl" ? -1 : 1;
      st.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        down = true; moved = false; dx = 0; startX = e.clientX; startY = e.clientY;
        target = e.target.closest ? e.target.closest(".lb-look") : null;
      });
      st.addEventListener("pointermove", function (e) {
        if (!down) {
          if (e.pointerType === "mouse" && O.motionOK()) {
            var r = st.getBoundingClientRect();
            self.sec.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
          }
          return;
        }
        dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - startY)) {
          moved = true; st.classList.add("dragging");
          try { st.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
        if (moved) st.style.setProperty("--drag", dx + "px");
      });
      var end = function () {
        if (!down) return;
        down = false;
        st.classList.remove("dragging");
        st.style.setProperty("--drag", "0px");
        if (moved) {
          if (Math.abs(dx) > 50) self.step((dx < 0 ? 1 : -1) * dir);
          return;
        }
        if (!target) return;
        var k = +target.getAttribute("data-k");
        if (k === self.i) location.hash = "#p-" + self.looks[k].p.slug;
        else self.go(k);
      };
      st.addEventListener("pointerup", end);
      st.addEventListener("pointercancel", function () { down = false; moved = false; st.classList.remove("dragging"); st.style.setProperty("--drag", "0px"); });
      st.addEventListener("pointerleave", function () { if (!down) self.sec.style.setProperty("--px", "0"); });
      st.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); self.step((e.key === "ArrowRight" ? 1 : -1) * dir); }
        else if (e.key === "Home") { e.preventDefault(); self.go(0); }
        else if (e.key === "End") { e.preventDefault(); self.go(self.looks.length - 1); }
        else if (e.key === "Enter") { location.hash = "#p-" + self.looks[self.i].p.slug; }
      });
    }
  };

  /* ───────────── Opening (see #intro in index.html) ───────────── */
  var Intro = {
    init: function () {
      var el = $("#intro");
      if (!el || el.hidden) return;
      this.el = el;
      $$(".intro-tag", el).forEach(function (p) { p.textContent = t("intro.tag"); });
      var self = this, skip = function () { self.open(); };
      document.addEventListener("pointerdown", skip, { once: true });
      document.addEventListener("keydown", skip, { once: true });
      setTimeout(skip, 6000); // never hold the site back for long
    },
    /* Called once the first page is on screen. The mark shows for about a second, then the page fades in. */
    ready: function () {
      if (!this.el) return;
      var self = this, since = window.performance && performance.now ? performance.now() : 0;
      setTimeout(function () { self.open(); }, Math.max(0, 1300 - since));
    },
    open: function () {
      var el = this.el;
      if (!el || this.opened) return;
      this.opened = true;
      try { window.sessionStorage.setItem("oscar.intro", "1"); } catch (e) { /* storage unavailable */ }
      document.documentElement.classList.remove("intro-hold");
      el.classList.add("open");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    }
  };

  /* Home page: a full-screen entrance, then one full-screen section after another
     (lookbook, new pieces, two pairs of category panels, the fitting, the house statement). */
  var BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  function lifestylePhoto(p) {
    var imgs = p.images || [];
    for (var i = 0; i < imgs.length; i++) if (!/-studio-/.test(imgs[i])) return imgs[i];
    return imgs[0] || "";
  }
  VIEWS.home = function () {
    var heroes = (C.heroProducts || []).map(O.data.bySlug).filter(Boolean);
    if (!heroes.length) heroes = O.data.products.slice(0, 3);
    var newOnes = O.data.products.filter(function (x) { return x.isNew && !soldOutAll(x); }).slice(0, 10);
    if (newOnes.length < 4) newOnes = O.data.products.slice(0, 10);
    var used = {};
    var panelList = (C.homePanels || [["maxi"], ["couture"], ["short"], ["suits"]]).map(function (pc) {
      var c = O.data.category(pc[0]);
      if (!c) return null;
      var list = O.data.inCategory(c.id);
      if (!list.length) return null;
      var p = (pc[1] && O.data.bySlug(pc[1])) || list.filter(function (x) { return !used[x.slug]; })[0] || list[0];
      used[p.slug] = true;
      var src = lifestylePhoto(p);
      return '<a class="panel" href="#shop-' + c.id + '">' +
        (src ? '<img class="panel-img" src="' + esc(src) + '"' + (/-1080\.webp$/.test(src) ? ' srcset="' + esc(src.replace(/-1080\.webp$/, "-540.webp")) + " 540w, " + esc(src) + ' 1080w" sizes="(min-width: 900px) 50vw, 100vw"' : "") +
          ' alt="" width="1080" height="1440" loading="lazy" decoding="async">' : "") +
        '<span class="panel-copy"><span class="panel-title">' + esc(t(c.key)) + '</span><span class="panel-cta">' + esc(t("home.shopCat")) + "</span></span></a>";
    }).filter(Boolean);
    var panels = "";
    for (var pi = 0; pi < panelList.length; pi += 2) panels += '<section class="panels" aria-label="' + esc(t("home.collections")) + '">' + panelList.slice(pi, pi + 2).join("") + "</section>";
    var splitP = O.data.bySlug(C.fittingProduct) || heroes[0];
    var splitSrc = splitP && splitP.images && splitP.images[0] ? splitP.images[0].replace(/-1080\.webp$/, "-hero.webp") : "";
    var values = [["home.why1t", "home.why1"], ["home.why2t", "home.why2"], ["home.why3t", "home.why3"]].map(function (v) {
      return '<div class="value reveal"><h3>' + esc(t(v[0])) + "</h3><p>" + esc(t(v[1])) + "</p></div>";
    }).join("");

    /* Computers get the boutique banner; phones get full-screen portraits that slowly cross-fade (each only loads where it shows) */
    var B = C.heroBanner && C.heroBannerOn !== false ? C.heroBanner : null;
    var slides = heroes.slice(0, 3).map(function (p, i) {
      var src = p.images && p.images[0] ? p.images[0].replace(/-1080\.webp$/, "-hero.webp") : "";
      if (!src) return "";
      return '<picture class="hero-slide' + (i === 0 ? " is-on" : "") + '">' + (B ? '<source media="(min-width: 900px)" srcset="' + BLANK + '">' : "") +
        '<img src="' + esc(src) + '" alt="" width="1000" height="1500" decoding="async"' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + "></picture>";
    }).join("");
    var heroMedia = (B
      ? '<div class="hero-media hero-wide"><picture>' +
          '<source media="(max-width: 899px)" srcset="' + BLANK + '">' +
          '<img src="' + esc(B.src) + '"' + (B.medium ? ' srcset="' + esc(B.medium) + " 1200w, " + esc(B.src) + " " + B.width + 'w" sizes="100vw"' : "") +
          ' width="' + B.width + '" height="' + B.height + '" alt="" decoding="async" fetchpriority="high">' +
        "</picture></div>"
      : "") +
      '<div class="hero-media hero-tall' + (B ? "" : " hero-tall-all") + '">' + slides + "</div>";
    return '' +
      '<section class="hero hero-full' + (B ? " hero-banner" : "") + '" aria-labelledby="hero-title">' +
        heroMedia +
        '<div class="wrap hero-copy">' +
          '<p class="eyebrow">' + esc(t("hero.eyebrow")) + "</p>" +
          '<h1 class="hero-title" id="hero-title" tabindex="-1">' + brandify(t("hero.title")) + "</h1>" +
          '<p class="hero-lead">' + esc(t("hero.lead")) + "</p>" +
          '<div class="hero-actions"><a class="btn btn-light" href="#shop">' + esc(t("hero.shop")) + '</a><a class="btn btn-outline-light" href="#book">' + esc(t("nav.book")) + "</a></div>" +
        "</div>" +
        '<a class="scroll-cue" href="#lookbook"><span class="sr-only">' + esc(t("home.scroll")) + '</span><span class="scroll-cue-label" aria-hidden="true">' + esc(t("home.scroll")) + '</span><span class="scroll-cue-line" aria-hidden="true"></span></a>' +
      "</section>" +

      lookbookHTML() +

      '<section class="section rail-section fullpage" aria-labelledby="new-title">' +
        '<div class="wrap section-head"><h2 id="new-title">' + esc(t("home.new")) + '</h2>' +
          '<div class="rail-tools"><a class="text-link" href="#shop">' + esc(t("home.viewAll")) + "</a>" +
          '<button type="button" class="rail-btn" data-rail="-1">' + esc(t("home.prev")) + '</button><button type="button" class="rail-btn" data-rail="1">' + esc(t("home.next")) + "</button></div></div>" +
        '<div class="rail" id="new-rail" tabindex="0" aria-label="' + esc(t("home.new")) + '">' + newOnes.map(card).join("").replace(/class="card reveal"/g, 'class="card"') + "</div>" +
      "</section>" +

      panels +

      '<section class="split fullpage" aria-labelledby="fit-title">' +
        '<div class="split-media">' + (splitSrc ? '<img src="' + esc(splitSrc) + '" alt="" width="1000" height="1500" loading="lazy" decoding="async">' : "") + "</div>" +
        '<div class="split-copy">' +
          '<p class="eyebrow">' + esc(t("tailor.title")) + "</p>" +
          '<h2 id="fit-title">' + esc(t("home.fitTitle")) + "</h2>" +
          "<p>" + esc(t("home.fitText")) + "</p>" +
          '<div class="btn-row"><a class="btn" href="#book">' + esc(t("nav.book")) + "</a>" +
          '<a class="btn btn-ghost" href="' + wa(t("wa.hello") + " " + t("wa.fitTitle")) + '" target="_blank" rel="noopener">' + ICON.whatsapp + "WhatsApp</a></div>" +
          '<dl class="facts">' +
            "<div><dt>" + esc(t("visit.address")) + "</dt><dd>" + esc(tx(C.address)) + "</dd></div>" +
            "<div><dt>" + esc(t("visit.phone")) + '</dt><dd><span dir="ltr" class="phone-number">' + esc(C.phoneDisplay) + "</span></dd></div>" +
            "<div><dt>" + esc(t("visit.hours")) + "</dt><dd>" + hoursHTML() + "</dd></div>" +
          "</dl>" +
          '<a class="text-link" href="#contact">' + esc(t("nav.contact")) + "</a>" +
        "</div>" +
      "</section>" +

      '<section class="section statement fullpage" aria-label="OSCAR"><div class="wrap">' +
        '<p class="eyebrow">OSCAR</p>' +
        '<p class="statement-text reveal">' + esc(t("home.statement")) + "</p>" +
        '<div class="values">' + values + "</div>" +
      "</div></section>" +

      '<section class="section section-tight" aria-labelledby="ig-title"><div class="wrap"><div class="ig">' +
        '<div><h2 id="ig-title">' + esc(t("home.igTitle")) + "</h2><p>" + esc(t("home.igText")) + "</p></div>" +
        '<a class="ig-handle" href="' + esc(C.instagram) + '" target="_blank" rel="noopener" dir="ltr">' + esc(C.instagramHandle) + "</a>" +
      "</div></div></section>";
  };

  /* Home widgets: the phone hero's slow cross-fade and the new-pieces rail buttons */
  var heroTimer = null;
  function mountHome() {
    clearInterval(heroTimer);
    var slides = $$("#content .hero-slide");
    if (slides.length > 1 && O.motionOK()) {
      var k = 0;
      heroTimer = setInterval(function () {
        if (document.hidden || !$("#content .hero") || window.scrollY > window.innerHeight) return;
        slides[k].classList.remove("is-on");
        k = (k + 1) % slides.length;
        slides[k].classList.add("is-on");
      }, 6000);
    }
    var rail = $("#new-rail");
    $$(".rail-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!rail) return;
        var card1 = rail.firstElementChild, step = card1 ? card1.getBoundingClientRect().width + 12 : 300;
        var rtl = document.documentElement.dir === "rtl";
        rail.scrollBy({ left: Number(b.getAttribute("data-rail")) * step * (rtl ? -1 : 1), behavior: O.motionOK() ? "smooth" : "auto" });
      });
    });
  }

  VIEWS.shop = function (r) {
    var cat = r.cat || "all";
    var sorts = ["featured", "priceAsc", "priceDesc"].map(function (s) {
      return '<option value="' + s + '"' + (O.state.shop.sort === s ? " selected" : "") + ">" + esc(t("sort." + s)) + "</option>";
    }).join("");
    return '<div class="wrap">' +
      '<div class="page-head">' + crumbs([[t("crumb.home"), "#"], [t("shop.title"), "#shop"]]) +
        '<h1 id="shop-title" tabindex="-1">' + esc(cat === "all" ? t("shop.title") : catLabel(cat)) + "</h1></div>" +
      '<nav class="chips-wrap" id="shop-chips" aria-label="' + esc(t("shop.filter")) + '">' + chipsHTML(cat) + "</nav>" +
      '<div class="toolbar">' +
        '<div class="field"><label for="shop-q">' + esc(t("shop.search")) + '</label><input id="shop-q" type="search" autocomplete="off" value="' + esc(O.state.shop.q) + '"></div>' +
        '<div class="field"><label for="shop-sort">' + esc(t("shop.sort")) + '</label><select id="shop-sort">' + sorts + "</select></div>" +
        '<p class="result-count" id="shop-count" aria-live="polite"></p>' +
      "</div>" +
      '<div id="shop-grid"></div>' +
      (O.state.currency !== "ILS" ? '<p class="note page-note">' + esc(t("price.note")) + "</p>" : '<div class="page-note"></div>') +
    "</div>";
  };

  /* Filter chips: top level (all, evening, suits, jumpsuits, SALE); inside evening dresses also its sub-categories. */
  function chipsHTML(cat) {
    function chip(id, label, extra) {
      var href = id === "all" ? "#shop" : "#shop-" + id;
      return '<a class="chip' + (extra || "") + '" href="' + href + '"' + (cat === id ? ' aria-current="page"' : "") + ">" + esc(label) + "</a>";
    }
    var top = [chip("all", t("cat.all"))].concat(O.menu.map(function (id) {
      if (id === "sale") return chip("sale", t("cat.sale"));
      var c = O.data.category(id);
      var inGroup = c && c.children && (cat === id || c.children.indexOf(cat) !== -1);
      return c ? chip(id, t(c.key), inGroup && cat !== id ? " chip-parent" : "") : "";
    })).join("");
    var c = O.data.category(cat), parent = c && c.parent ? O.data.category(c.parent) : c && c.children ? c : null;
    var sub = parent ? '<div class="chips chips-sub">' + [chip(parent.id, t("cat.allEvening"))].concat(parent.children.map(function (k) { return chip(k, t(O.data.category(k).key)); })).join("") + "</div>" : "";
    return '<div class="chips">' + top + "</div>" + sub;
  }

  function shopResults() {
    var r = O.state.route, q = O.state.shop.q.trim().toLowerCase();
    var list = r.cat === "sale" ? onSale() : O.data.inCategory(r.cat);
    if (q) {
      list = list.filter(function (p) {
        var hay = [p.name.he, p.name.en, p.name.ar, p.name.ru, tx(p.color), tx(p.description)].join(" ").toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }
    function now(p) { return O.pricing.final(p, false).price; }
    if (O.state.shop.sort === "priceAsc") list.sort(function (a, b) { return now(a) - now(b); });
    if (O.state.shop.sort === "priceDesc") list.sort(function (a, b) { return now(b) - now(a); });
    /* Sold-out pieces go last; the rest keep the owner's order */
    list = list.filter(function (p) { return !soldOutAll(p); }).concat(list.filter(soldOutAll));
    return list;
  }

  function renderShopGrid() {
    var list = shopResults(), grid = $("#shop-grid"), count = $("#shop-count");
    if (!grid) return;
    count.textContent = t("shop.results", { n: list.length });
    grid.innerHTML = list.length
      ? '<h2 class="sr-only">' + esc(t("shop.results", { n: list.length })) + '</h2><div class="grid">' + list.map(card).join("") + "</div>"
      : O.state.shop.q.trim()
        ? '<div class="empty"><p>' + esc(t("shop.none")) + '</p><button type="button" class="btn btn-ghost" data-clear-search>' + esc(t("shop.clear")) + "</button></div>"
        : '<div class="empty"><p>' + esc(t("cat.empty")) + '</p><a class="btn btn-ghost" href="' + wa(t("wa.hello")) + '" target="_blank" rel="noopener">' + ICON.whatsapp + "WhatsApp</a></div>";
  }

  function updateShopInPlace() {
    var r = O.state.route;
    $("#shop-title").textContent = r.cat === "all" ? t("shop.title") : catLabel(r.cat);
    var chipsNav = $("#shop-chips"), focused = document.activeElement && chipsNav && chipsNav.contains(document.activeElement) ? document.activeElement.getAttribute("href") : null;
    if (chipsNav) chipsNav.innerHTML = chipsHTML(r.cat);
    if (focused) { var again = chipsNav.querySelector('a[href="' + focused + '"]'); if (again) again.focus(); }
    renderShopGrid();
    setTitle();
    markCurrentLinks();
  }

  VIEWS.product = function (r) {
    var p = O.data.bySlug(r.slug);
    if (!p) {
      return '<div class="wrap"><div class="page-head"><h1 tabindex="-1">' + esc(t("product.notFound")) + '</h1></div><p style="padding-block-end:4rem"><a class="btn" href="#shop">' + esc(t("product.back")) + "</a></p></div>";
    }
    var name = tx(p.name), view = O.state.pdpView, allOut = soldOutAll(p);
    var hasPhotos = p.images && p.images.length > 0;
    var gallery;
    if (hasPhotos) {
      /* Opens on the same photo as its card (the studio shot when there is one) */
      var idx = O.state.pdpImage === null || O.state.pdpImage === undefined ? leadPhoto(p) : Math.min(O.state.pdpImage, p.images.length - 1);
      gallery = '<button type="button" class="pdp-media zoomable" id="pdp-art" aria-pressed="false" aria-label="' + esc(t("product.zoom") + ": " + name) + '" style="view-transition-name: oscar-art">' +
        O.art.render(p, idx, { eager: true, sizes: SIZES.main }) + "</button>";
      if (p.images.length > 1) {
        gallery += '<div class="thumbs" role="group" aria-label="' + esc(t("product.photos")) + '">' + p.images.map(function (img, i) {
          return '<button type="button" class="thumb" data-img="' + i + '" aria-pressed="' + (i === idx) + '" aria-label="' + esc(t("product.photos") + " " + (i + 1)) + '">' +
            O.art.render(p, i, { decorative: true, sizes: SIZES.tiny }) + "</button>";
        }).join("") + "</div>";
      }
    } else {
      gallery = '<div class="pdp-media" id="pdp-art" style="view-transition-name: oscar-art">' + O.art.render(p, view) + "</div>" +
        '<div class="thumbs" role="group" aria-label="' + esc(t("product.photos")) + '">' + ["front", "detail", "look"].map(function (v) {
          var label = t("product.view" + v.charAt(0).toUpperCase() + v.slice(1));
          return '<button type="button" class="thumb" data-view="' + v + '" aria-pressed="' + (v === view) + '">' +
            O.art.render(p, v, { decorative: true }) + '<span class="thumb-label">' + esc(label) + "</span></button>";
        }).join("") + "</div>";
    }
    var sibs = O.data.siblings(p);
    var swatches = sibs.length > 1 ? '<div class="swatches"><p class="meta-line"><span>' + esc(t("product.otherColors")) + ':</span></p><ul class="swatch-list">' +
      sibs.map(function (sb) {
        return '<li><a class="swatch" href="#p-' + esc(sb.slug) + '"' + (sb.slug === p.slug ? ' aria-current="true"' : "") + ">" +
          O.art.render(sb, 0, { decorative: true, sizes: SIZES.tiny }) + "<span>" + esc(tx(sb.color)) + "</span></a></li>";
      }).join("") + "</ul></div>" : "";
    var sizeList = p.sizes.length ? p.sizes : ["ONE"];
    var sizes = sizeList.map(function (s) {
      var out = allOut || O.stock.sizeLeft(p, s) === 0, few = out ? "" : sizeLeftText(p, s);
      return '<input type="radio" name="size" id="size-' + esc(s) + '" value="' + esc(s) + '"' + (out ? " disabled" : "") + (sizeList.length === 1 && !out ? " checked" : "") + ">" +
        '<label for="size-' + esc(s) + '"' + (few ? ' class="few"' : "") + ">" + esc(sizeLabel(s)) +
          (out ? '<span class="sr-only">. ' + esc(t("product.soldOutSize", { size: sizeLabel(s) })) + "</span>" : few ? '<span class="sr-only">. ' + esc(few) + "</span>" : "") + "</label>";
    }).join("");
    var fp = O.pricing.final(p, false), low = O.stock.lowLeft(p);
    var saleNote = fp.sale && fp.percent > 0
      ? '<p class="sale-note">' + esc((tx(fp.sale.title) || dealText(fp.sale)) + (fp.sale.endsAt ? " · " + t("sale.ends", { date: fmtDate(new Date(fp.sale.endsAt).getTime()) }) : "")) + "</p>" : "";
    var chart = '<div class="table-scroll"><table class="size-table"><thead><tr><th scope="col">' + esc(t("sg.size")) + '</th><th scope="col">' + esc(t("sg.bust")) +
      '</th><th scope="col">' + esc(t("sg.waist")) + '</th><th scope="col">' + esc(t("sg.hips")) + "</th></tr></thead><tbody>" +
      O.sizeChart.map(function (row) {
        return '<tr><th scope="row">' + row.size + "</th><td>" + row.bust + "</td><td>" + row.waist + "</td><td>" + row.hips + "</td></tr>";
      }).join("") + '</tbody></table></div><p>' + esc(t("sg.note")) + "</p>";
    var first = p.categories[0];
    var related = O.data.products.filter(function (x) { return x.slug !== p.slug && x.categories.indexOf(first) !== -1; });
    O.data.products.forEach(function (x) { if (related.length < 4 && x.slug !== p.slug && related.indexOf(x) === -1) related.push(x); });
    related = related.slice(0, 4);

    return '<div class="wrap">' +
      '<div class="pdp-crumbs">' + crumbs([[t("crumb.home"), "#"], [t("shop.title"), "#shop"]].concat(catTrail(primaryCat(p)).map(function (id) { return [catLabel(id), "#shop-" + id]; })).concat([[name, ""]])) + "</div>" +
      '<div class="pdp">' +
        '<div class="gallery">' + gallery + "</div>" +
        '<div class="pdp-info">' +
          '<div class="pdp-head">' +
            '<p class="eyebrow">' + esc(catLabel(primaryCat(p))) + (p.id ? ' · <span class="pdp-ref"><span class="sr-only">' + esc(t("product.ref")) + ' </span><span dir="ltr">#' + p.id + "</span></span>" : "") + "</p>" +
            '<h1 tabindex="-1">' + esc(name) + "</h1>" +
            '<div class="pdp-price">' + amountHTML(fp.price, fp.original, { withIls: true }) +
              (allOut ? ' <span class="badge">' + esc(t("badge.soldout")) + "</span>" : "") + "</div>" +
            saleNote +
          "</div>" +
          '<p class="pdp-desc">' + esc(tx(p.description)) + "</p>" +
          '<p class="meta-line"><span>' + esc(t("product.color")) + ":</span> " + esc(tx(p.color)) + "</p>" +
          swatches +
          '<form id="pdp-form" novalidate data-slug="' + esc(p.slug) + '">' +
            '<fieldset class="sizes" id="size-set">' +
              "<legend><span>" + esc(t("product.size")) + "</span></legend>" +
              '<div class="size-options">' + sizes + "</div>" +
              '<p class="size-note" id="size-note" aria-live="polite"></p>' +
              (low ? '<p class="stock-note">' + esc(stockText(low)) + "</p>" : "") +
              '<p class="field-error" id="size-error" hidden></p>' +
            "</fieldset>" +
            '<div class="pdp-actions">' +
              '<button class="btn btn-block" type="submit" id="add-btn"' + (allOut ? " disabled" : "") + ">" + esc(t("product.add")) + "</button>" +
              '<a class="btn btn-ghost btn-block" href="' + wa(t("wa.fitProduct", { name: refName(p) })) + '" target="_blank" rel="noopener">' + esc(t("product.fit")) + "</a>" +
            "</div>" +
          "</form>" +
          '<p class="tailor-line">' + ICON.scissors + "<span>" + esc(t("tailor.short")) + "</span></p>" +
          '<div class="accordion">' +
            "<details><summary>" + esc(t("product.sizeGuide")) + '</summary><div class="acc-body">' + chart + "</div></details>" +
            "<details><summary>" + esc(t("product.care")) + '</summary><div class="acc-body"><p>' + esc(t("product.careText")) + "</p></div></details>" +
            "<details><summary>" + esc(t("product.delivery")) + '</summary><div class="acc-body"><p>' + esc(t("product.deliveryText")) +
              '</p><p><a class="text-link" href="#policies">' + esc(t("product.policies")) + "</a></p></div></details>" +
          "</div>" +
          '<a class="text-link" href="' + wa(t("wa.askProduct", { name: refName(p) })) + '" target="_blank" rel="noopener">' + esc(t("product.ask")) + "</a>" +
          (O.state.currency !== "ILS" ? '<p class="note">' + esc(t("price.note")) + "</p>" : "") +
        "</div>" +
      "</div>" +
      '<section class="section section-related" aria-labelledby="rel-title"><div class="section-head"><h2 id="rel-title">' + esc(t("product.related")) + "</h2></div>" +
        '<div class="grid grid-4">' + related.map(card).join("") + "</div></section>" +
    "</div>";
  };

  function field(id, labelKey, value, opts) {
    opts = opts || {};
    var req = opts.required ? ' <span class="req">' + esc(t("f.req")) + "</span>" : "";
    var attrs = ' id="' + id + '" name="' + id + '"' + (opts.type ? ' type="' + opts.type + '"' : ' type="text"') +
      (opts.autocomplete ? ' autocomplete="' + opts.autocomplete + '"' : "") + (opts.required ? ' aria-required="true"' : "") +
      (opts.min ? ' min="' + opts.min + '"' : "") + (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : "") +
      (opts.dir ? ' dir="' + opts.dir + '"' : "");
    var control = opts.textarea
      ? '<textarea id="' + id + '" name="' + id + '">' + esc(value) + "</textarea>"
      : opts.options
        ? '<select id="' + id + '" name="' + id + '">' + opts.options.map(function (o) {
            return '<option value="' + o[0] + '"' + (o[0] === value ? " selected" : "") + ">" + esc(t(o[1])) + "</option>";
          }).join("") + "</select>"
        : "<input" + attrs + ' value="' + esc(value) + '">';
    return '<div class="field"><label for="' + id + '">' + esc(t(labelKey)) + req + "</label>" + control +
      '<p class="field-error" id="' + id + '-err" hidden></p></div>';
  }

  function readyBlock(titleKey, textKey, message, backId) {
    return '<div class="ready">' +
      '<h2 id="ready-title" tabindex="-1">' + esc(t(titleKey)) + "</h2>" +
      "<p>" + esc(t(textKey)) + "</p>" +
      '<a class="btn" href="' + wa(message) + '" target="_blank" rel="noopener">' + ICON.whatsapp + esc(t("checkout.openWa")) + "</a>" +
      '<button type="button" class="link-btn" id="' + backId + '">' + esc(t("checkout.edit")) + "</button>" +
    "</div>";
  }

  VIEWS.checkout = function () {
    var s = O.state.checkout, lines = O.cart.lines(), sub = O.cart.subtotal();
    var head = '<div class="page-head">' + crumbs([[t("crumb.home"), "#"], [t("checkout.title"), ""]]) + '<h1 tabindex="-1">' + esc(t("checkout.title")) + "</h1></div>";
    if (!lines.length) {
      return '<div class="wrap">' + head + '<div class="empty" style="padding-block-end:5rem"><p>' + esc(t("checkout.empty")) + '</p><a class="btn" href="#shop">' + esc(t("cart.emptyCta")) + "</a></div></div>";
    }
    var saved = O.cart.savings(), promo = O.state.promo;
    var promoUsed = promo && lines.some(function (l) { return l.sale && l.sale.code; });
    var promoPart = promo
      ? '<div class="promo-applied"><p><span dir="ltr" class="promo-code">' + esc(promo.code) + "</span> · " + esc(dealText(promo)) + "</p>" +
          '<button type="button" class="link-btn" id="promo-remove">' + esc(t("promo.remove")) + "</button>" +
          (promoUsed ? "" : '<p class="note">' + esc(t("promo.noItems")) + "</p>") + "</div>"
      : '<form id="promo-form" class="promo" novalidate>' +
          '<label for="promo-code">' + esc(t("promo.label")) + "</label>" +
          '<div class="promo-row"><input id="promo-code" name="promo-code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" dir="ltr" maxlength="24" value="' + esc(O.state.promoInput || "") + '"' +
            (O.state.promoError ? ' aria-invalid="true" aria-describedby="promo-err"' : "") + ">" +
          '<button class="btn btn-ghost" type="submit" id="promo-apply">' + esc(t("promo.apply")) + "</button></div>" +
          '<p class="field-error" id="promo-err"' + (O.state.promoError ? "" : " hidden") + ">" + esc(O.state.promoError || "") + "</p>" +
        "</form>";
    var summary = '<aside class="panel summary" aria-labelledby="sum-title"><h2 id="sum-title">' + esc(t("checkout.summary")) + "</h2>" +
      '<ul class="sum-lines">' + lines.map(function (l) {
        return '<li class="sum-line"><span>' + esc(tx(l.product.name)) + ' <span class="note">· ' + esc(t("cart.size")) + " " + esc(sizeLabel(l.size)) + " · ×" + l.qty + "</span></span>" +
          '<span class="sum-amount">' + (l.originalTotal > l.total ? '<s class="price-was" dir="ltr"><span class="sr-only">' + esc(t("price.was")) + " </span>" + esc(O.currency.ils(l.originalTotal)) + "</s> " : "") +
          '<span dir="ltr" class="price">' + esc(O.currency.ils(l.total)) + "</span></span></li>";
      }).join("") + "</ul>" + promoPart +
      (saved > 0 ? '<div class="sum-row sum-save"><span>' + esc(t("cart.savings")) + '</span><span dir="ltr" class="price">' + esc(O.currency.ils(saved)) + "</span></div>" : "") +
      '<div class="sum-row"><span>' + esc(t("checkout.total")) + '</span><span dir="ltr" class="price">' + esc(O.currency.ils(sub)) + "</span></div>" +
      (O.state.currency !== "ILS" ? '<p class="note">' + esc(t("checkout.charged")) + " · " + O.currency.html(sub) + "</p>" : "") + "</aside>";

    var main;
    if (s.ready) {
      main = '<section class="panel">' + readyBlock("checkout.ready", "checkout.readyText", s.message, "checkout-edit") + "</section>";
    } else {
      main = '<form id="checkout-form" class="form panel" novalidate>' +
        '<div id="checkout-errors"></div>' +
        "<fieldset><legend>" + esc(t("checkout.contact")) + "</legend>" +
          field("co-name", "f.name", s.name, { required: true, autocomplete: "name" }) +
          '<div class="field-row">' +
            field("co-phone", "f.phone", s.phone, { required: true, type: "tel", autocomplete: "tel", inputmode: "tel", dir: "ltr" }) +
            field("co-email", "f.email", s.email, { type: "email", autocomplete: "email", dir: "ltr" }) +
          "</div>" +
        "</fieldset>" +
        "<fieldset><legend>" + esc(t("checkout.delivery")) + "</legend>" +
          '<label class="choice"><input type="radio" name="co-delivery" value="pickup"' + (s.delivery === "pickup" ? " checked" : "") + "><span>" + esc(t("d.pickup")) + "</span></label>" +
          '<label class="choice"><input type="radio" name="co-delivery" value="ship"' + (s.delivery === "ship" ? " checked" : "") + "><span>" + esc(t("d.ship")) + "</span></label>" +
          '<div id="ship-fields" class="form"' + (s.delivery === "ship" ? "" : " hidden") + ">" +
            '<div class="field-row">' +
              field("co-address", "f.address", s.address, { required: true, autocomplete: "street-address" }) +
              field("co-city", "f.city", s.city, { required: true, autocomplete: "address-level2" }) +
            "</div>" +
            '<p class="note">' + esc(t("checkout.deliveryCost")) + "</p>" +
          "</div>" +
        "</fieldset>" +
        field("co-notes", "f.notes", s.notes, { textarea: true }) +
        "<fieldset><legend>" + esc(t("checkout.payment")) + '</legend><p class="callout">' + esc(t("checkout.payNote")) + "</p></fieldset>" +
        '<button class="btn btn-block" type="submit">' + ICON.whatsapp + esc(t("checkout.send")) + "</button>" +
      "</form>";
    }
    return '<div class="wrap">' + head + '<div class="checkout-grid">' + main + summary + "</div></div>";
  };

  VIEWS.visit = function () {
    var f = O.state.fitting;
    var formPart;
    if (f.ready) {
      formPart = readyBlock("visit.ready", "visit.readyText", f.message, "fit-edit");
    } else {
      formPart = '<h2 id="fit-form-title" tabindex="-1">' + esc(t("visit.fitTitle")) + '</h2><p class="note form-lead">' + esc(t("visit.fitLead")) + "</p>" +
        '<form id="fit-form" class="form" novalidate aria-labelledby="fit-form-title">' +
          '<div id="fit-errors"></div>' +
          '<div class="field-row">' +
            field("fit-name", "f.name", f.name, { required: true, autocomplete: "name" }) +
            field("fit-phone", "f.phone", f.phone, { required: true, type: "tel", autocomplete: "tel", inputmode: "tel", dir: "ltr" }) +
          "</div>" +
          '<div class="field-row">' +
            field("fit-date", "f.date", f.date, { type: "date", min: todayISO() }) +
            field("fit-time", "f.time", f.time, { options: [["any", "time.any"], ["morning", "time.morning"], ["afternoon", "time.afternoon"], ["evening", "time.evening"]] }) +
          "</div>" +
          '<div class="field-row">' +
            field("fit-event", "f.event", f.event, { options: [["wedding", "ev.wedding"], ["engagement", "ev.engagement"], ["henna", "ev.henna"], ["evening", "ev.evening"], ["other", "ev.other"]] }) +
            field("fit-size", "f.size", f.size, { inputmode: "numeric" }) +
          "</div>" +
          field("fit-notes", "f.notes", f.notes, { textarea: true }) +
          '<button class="btn btn-block" type="submit">' + ICON.whatsapp + esc(t("visit.send")) + "</button>" +
        "</form>";
    }
    return '<div class="wrap">' +
      '<div class="page-head">' + crumbs([[t("crumb.home"), "#"], [t("nav.contact"), ""]]) + '<h1 tabindex="-1">' + esc(t("nav.contact")) + "</h1>" +
        '<p class="contact-line">' + ICON.pin + "<span>" + esc(tx(C.address)) + ' · <span dir="ltr">' + esc(C.phoneDisplay) + "</span></span></p></div>" +
      '<section class="about" aria-labelledby="about-title">' +
        '<img class="about-logo" src="assets/img/logo/logo-full-mono.png" alt="OSCAR · ' + esc(t("hero.eyebrow").split(" · ")[0]) + '" width="354" height="480" loading="lazy">' +
        '<div class="about-copy"><h2 id="about-title">' + esc(t("contact.aboutTitle")) + "</h2><p>" + esc(t("contact.about")) + "</p>" +
          '<div class="tailor-card">' + ICON.scissors + "<div><h3>" + esc(t("tailor.title")) + "</h3><p>" + esc(t("tailor.text")) + "</p></div></div>" +
        "</div>" +
      "</section>" +
      '<div class="visit-grid">' +
        '<div class="info-list">' +
          '<div class="info-item"><h2>' + esc(t("contact.getHere")) + '</h2><p class="big">' + esc(tx(C.address)) + "</p>" +
            '<div class="btn-row"><a class="btn btn-ghost" href="' + esc(C.wazeUrl) + '" target="_blank" rel="noopener">' + esc(t("visit.waze")) + "</a>" +
            '<a class="btn btn-ghost" href="' + esc(C.mapsUrl) + '" target="_blank" rel="noopener">' + esc(t("visit.maps")) + "</a></div></div>" +
          '<div class="info-item"><h2>' + esc(t("contact.write")) + "</h2>" +
            '<div class="phone-row"><p class="big phone-number" dir="ltr" id="phone-text">' + esc(C.phoneDisplay) + "</p>" +
            '<button type="button" class="link-btn" id="copy-phone">' + esc(t("visit.copy")) + "</button></div>" +
            '<div class="btn-row"><a class="btn" href="' + wa(t("wa.hello")) + '" target="_blank" rel="noopener">' + ICON.whatsapp + esc(t("visit.whatsapp")) + "</a>" +
            '<a class="btn btn-ghost" href="tel:+' + C.phoneIntl + '">' + esc(t("contact.call")) + "</a></div></div>" +
          '<div class="info-item"><h2>' + esc(t("visit.hours")) + "</h2>" + hoursHTML() + "</div>" +
          '<div class="info-item"><h2>' + esc(t("contact.follow")) + '</h2><a class="ig-handle" href="' + esc(C.instagram) + '" target="_blank" rel="noopener" dir="ltr">Instagram ' + esc(C.instagramHandle) + "</a></div>" +
        "</div>" +
        '<section class="panel" id="fitting" aria-labelledby="' + (f.ready ? "ready-title" : "fit-form-title") + '">' + formPart + "</section>" +
      "</div></div>";
  };

  VIEWS.contact = VIEWS.visit;

  VIEWS.accessibility = function () {
    var contact = C.accessibilityContact || {};
    return '<div class="wrap">' +
      '<div class="page-head">' + crumbs([[t("crumb.home"), "#"], [t("st.title"), ""]]) + '<h1 tabindex="-1">' + esc(t("st.title")) + "</h1></div>" +
      '<div class="prose">' +
        "<p>" + esc(t("st.intro")) + "</p>" +
        "<h2>" + esc(t("st.featuresTitle")) + "</h2><ul>" + t("st.features").map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "<h2>" + esc(t("st.menuTitle")) + "</h2><p>" + esc(t("st.menu")) + "</p>" +
        "<h2>" + esc(t("st.storeTitle")) + "</h2><p>" + esc(t("st.store")) + "</p>" +
        "<h2>" + esc(t("st.limitsTitle")) + "</h2><p>" + esc(t("st.limits")) + "</p>" +
        "<h2>" + esc(t("st.contactTitle")) + "</h2><dl>" +
          "<dt>" + esc(t("st.name")) + "</dt><dd>" + esc(contact.name || t("st.owner")) + "</dd>" +
          "<dt>" + esc(t("st.phone")) + '</dt><dd dir="ltr" class="phone-number">' + esc(contact.phone || C.phoneDisplay) + "</dd>" +
          "<dt>" + esc(t("st.address")) + "</dt><dd>" + esc(tx(C.address)) + "</dd>" +
        "</dl>" +
        '<p class="note">' + esc(t("st.updated")) + "</p>" +
      "</div></div>";
  };

  VIEWS.policies = function () {
    /* Texts the owner sent through the WhatsApp bot replace the drafts, one section at a time */
    var parts = [["terms", "pol.termsTitle", "pol.terms"], ["returns", "pol.returnsTitle", "pol.returns"], ["shipping", "pol.shippingTitle", "pol.shipping"], ["privacy", "pol.privacyTitle", "pol.privacy"]];
    var custom = O.data.setting("policies", null) || {};
    function paras(text) { return String(text).split(/\n+/).filter(function (x) { return x.trim(); }).map(function (x) { return "<p>" + esc(x) + "</p>"; }).join(""); }
    return '<div class="wrap">' +
      '<div class="page-head">' + crumbs([[t("crumb.home"), "#"], [t("pol.title"), ""]]) + '<h1 tabindex="-1">' + esc(t("pol.title")) + "</h1></div>" +
      '<div class="prose">' +
        parts.map(function (p) { var own = custom[p[0]] ? tx(custom[p[0]]) : ""; return "<h2>" + esc(t(p[1])) + "</h2>" + paras(own || t(p[2])) + (p[0] === "terms" ? paras(t("pol.ip")) : ""); }).join("") +
      "</div></div>";
  };

  VIEWS.notFound = function () {
    return '<div class="wrap"><div class="page-head"><h1 tabindex="-1">' + esc(t("page.notFound")) + '</h1><p class="lead" style="margin-block-start:1rem">' + esc(t("notFound.text")) + '</p></div><p style="padding-block-end:5rem"><a class="btn" href="#">' + esc(t("nav.home")) + "</a></p></div>";
  };

  /* ───────────── Router ───────────── */
  var VIEW_PAGES = ["checkout", "contact", "accessibility", "policies"];
  function parseHash() {
    var h = (location.hash || "").replace(/^#/, "");
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    if (!h || h === "home") return { view: "home" };
    if (h === "content") return null;
    if (h === "shop") return { view: "shop", cat: "all" };
    if (h.indexOf("shop-") === 0) {
      var c = h.slice(5);
      return c === "sale" || O.categories.some(function (x) { return x.id === c; }) ? { view: "shop", cat: c } : { view: "notFound" };
    }
    if (h.indexOf("p-") === 0) return { view: "product", slug: h.slice(2) };
    if (h === "visit" || h === "about") return { view: "contact" };
    if (h === "book") return { view: "contact", book: true };
    if (VIEW_PAGES.indexOf(h) !== -1) return { view: h };
    return { view: "notFound" };
  }

  function pageName() {
    var r = O.state.route || { view: "home" };
    if (r.view === "product") { var p = O.data.bySlug(r.slug); return p ? tx(p.name) : t("page.notFound"); }
    if (r.view === "shop") return r.cat === "all" ? t("page.shop") : catLabel(r.cat);
    if (r.view === "contact") return t("nav.contact");
    return t("page." + r.view);
  }
  function setTitle() {
    var r = O.state.route || { view: "home" };
    document.title = r.view === "home" ? "OSCAR · " + t("hero.eyebrow") : pageName() + " · OSCAR";
  }

  function route(opts) {
    opts = opts || {};
    var r = parseHash();
    if (!r) return;
    var prev = O.state.route;
    closeDialogs();
    if (!opts.initial) hideToast();
    if (prev && prev.view === "shop" && r.view === "shop" && !opts.force) { O.state.route = r; updateShopInPlace(); return; }
    if (r.view === "product" && (!prev || prev.slug !== r.slug)) { O.state.pdpView = "front"; O.state.pdpImage = null; }
    if (r.view === "checkout" && prev && prev.view !== "checkout") O.state.checkout.ready = false;
    if (r.view === "contact" && prev && prev.view !== "contact") O.state.fitting.ready = false;
    O.state.route = r;
    var go = function () { renderView(opts); };
    var morph = O.state.morph; O.state.morph = false;
    if (!opts.transition || !O.motionOK()) { go(); return; }
    /* A product card opening its page grows into the big photo; every other page simply fades in, with no wait. */
    if (morph && document.startViewTransition) {
      try {
        var vt = document.startViewTransition(go);
        vt.finished.then(clearTransitionNames, clearTransitionNames);
      } catch (e) { go(); }
      return;
    }
    go();
    var main = $("#content");
    main.classList.remove("page-in");
    void main.offsetWidth;
    main.classList.add("page-in");
  }

  function clearTransitionNames() { $$(".card .card-media").forEach(function (el) { el.style.viewTransitionName = ""; }); }

  function renderView(opts) {
    opts = opts || {};
    var r = O.state.route, main = $("#content");
    var y = window.scrollY;
    main.innerHTML = (VIEWS[r.view] || VIEWS.notFound)(r);
    if (r.view === "shop") renderShopGrid();
    if (r.view === "home") { LB.mount(); mountHome(); } else clearInterval(heroTimer);
    if (r.view !== "home") { if (O.decorations) O.decorations.stop(); }
    else if (!opts.keep || opts.deco) startDecorations();
    setTitle();
    markCurrentLinks();
    setupBuybar(r.view === "product" ? O.data.bySlug(r.slug) : null);
    updateHeroHeader();
    if (opts.keep) { window.scrollTo(0, y); return; }
    /* "Book a fitting" opens the visit page at the fitting form */
    if (r.book) {
      var fit = $("#fitting"), fh = $("#fit-form-title") || $("#ready-title");
      if (fit) {
        setTimeout(function () {
          try { fit.scrollIntoView({ block: "start", behavior: "instant" }); } catch (e) { fit.scrollIntoView(); }
          if (fh) fh.focus({ preventScroll: true });
        }, opts.initial ? 120 : 0);
        if (!opts.initial) announce(t("route.loaded", { page: t("visit.fitTitle") }));
        return;
      }
    }
    if (!opts.initial) {
      try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
      var h1 = main.querySelector("h1");
      if (h1) h1.focus({ preventScroll: true });
      announce(t("route.loaded", { page: pageName() }));
    }
  }

  /* ───────────── Header sits clear over the hero photo, solid once you scroll past it ───────────── */
  var lastScrollY = 0;
  function updateHeroHeader() {
    var hero = $("#content .hero"), header = $("#site-header");
    var over = !!hero && !!header && hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom + 4;
    document.body.classList.toggle("at-hero", over);
    /* Out of the way while reading down the page, back as soon as you scroll up */
    var y = window.scrollY, b = document.body;
    if (y < 120 || over) b.classList.remove("header-hidden");
    else if (y > lastScrollY + 6 && !(header && header.contains(document.activeElement))) b.classList.add("header-hidden");
    else if (y < lastScrollY - 6) b.classList.remove("header-hidden");
    lastScrollY = y;
  }
  document.addEventListener("focusin", function (e) { var h = $("#site-header"); if (h && h.contains(e.target)) document.body.classList.remove("header-hidden"); });
  /* The top bar's height, so the entrance photo fills exactly one screen under it */
  function measureAnnounce() {
    var a = $("#announce");
    document.documentElement.style.setProperty("--announce-h", (a && !a.hidden ? a.offsetHeight : 0) + "px");
  }
  window.addEventListener("resize", measureAnnounce);
  var heroTick = false;
  window.addEventListener("scroll", function () {
    if (heroTick) return;
    heroTick = true;
    requestAnimationFrame(function () { heroTick = false; updateHeroHeader(); });
  }, { passive: true });

  /* ───────────── Sticky buy bar (phones) ───────────── */
  var buyObserver = null;
  function setupBuybar(p) {
    var bar = $("#buybar");
    if (buyObserver) { buyObserver.disconnect(); buyObserver = null; }
    bar.hidden = true;
    document.body.classList.remove("has-buybar");
    if (!p || soldOutAll(p)) return;
    bar.innerHTML = '<div class="wrap"><div style="min-width:0"><p class="buybar-name">' + esc(tx(p.name)) + "</p><p>" + priceHTML(p) + "</p></div>" +
      '<button type="button" class="btn" id="buybar-add">' + esc(t("product.add")) + "</button></div>";
    var target = $("#add-btn");
    if (!target || !("IntersectionObserver" in window)) return;
    buyObserver = new IntersectionObserver(function (entries) {
      var show = !entries[0].isIntersecting && window.innerWidth < 900;
      bar.hidden = !show;
      document.body.classList.toggle("has-buybar", show);
    });
    buyObserver.observe(target);
  }

  /* ───────────── Dialogs and toast ───────────── */
  function openDialog(id) {
    var d = document.getElementById(id);
    if (!d) return;
    if (id === "cart-dialog") renderCart();
    if (typeof d.showModal === "function") { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
  }
  function closeDialogs() { closeDrops(); $$("dialog[open]").forEach(function (d) { if (d.close) d.close(); else d.removeAttribute("open"); }); }

  var toastTimer = null;
  function toast(msg, actionLabel) {
    var el = $("#toast");
    el.innerHTML = "<span>" + esc(msg) + "</span>" + (actionLabel ? '<button type="button" id="toast-action">' + esc(actionLabel) + "</button>" : "");
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  }
  function hideToast() { clearTimeout(toastTimer); var el = $("#toast"); if (el) el.hidden = true; }

  /* ───────────── Actions ───────────── */
  function addToBag(slug, size) {
    var p = O.data.bySlug(slug);
    if (!p) return;
    if (!O.cart.add(slug, size)) {
      var inBag = O.cart.items.reduce(function (n, i) { return n + (i.slug === slug ? i.qty : 0); }, 0);
      toast(t("stock.max", { n: inBag }), inBag ? t("cart.view") : "");
      announce(t("stock.max", { n: inBag }));
      return;
    }
    toast(t("cart.added", { name: tx(p.name), size: sizeLabel(size) }), t("cart.view"));
  }

  function showSizeError() {
    var err = $("#size-error"), set = $("#size-set");
    if (!err) return;
    err.textContent = t("product.sizeError");
    err.hidden = false;
    set.setAttribute("aria-describedby", "size-error");
    var firstFree = $('#size-set input:not(:disabled)');
    if (firstFree) { firstFree.focus(); set.scrollIntoView({ block: "center" }); }
  }

  function selectedSize() { var el = $('#pdp-form input[name="size"]:checked'); return el ? el.value : ""; }

  function setLang(code, focusId) {
    if (C.languages.indexOf(code) === -1) return;
    O.state.lang = code;
    O.store.set("lang", code);
    hideToast();
    applyLang();
    renderChrome();
    renderView({ keep: true });
    refocus(focusId);
  }
  function setCurrency(cur, focusId) {
    if (C.currencies.indexOf(cur) === -1) return;
    O.state.currency = cur;
    O.store.set("currency", cur);
    renderChrome();
    renderView({ keep: true });
    refocus(focusId);
  }
  function refocus(id) { if (!id) return; var el = document.getElementById(id); if (el) el.focus(); }

  function applyLang() {
    var m = O.i18n.meta[O.state.lang];
    document.documentElement.lang = O.state.lang;
    document.documentElement.dir = m.dir;
  }

  function showErrors(boxId, errors) {
    var box = document.getElementById(boxId);
    $$('[aria-invalid="true"]').forEach(function (el) { el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby"); });
    $$(".field-error").forEach(function (el) { if (el.id !== "size-error") { el.hidden = true; el.textContent = ""; } });
    if (!errors.length) { box.innerHTML = ""; return true; }
    errors.forEach(function (e) {
      var input = document.getElementById(e.id), msg = document.getElementById(e.id + "-err");
      if (input) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", e.id + "-err"); }
      if (msg) { msg.textContent = e.msg; msg.hidden = false; }
    });
    box.innerHTML = '<div class="error-summary" role="alert" tabindex="-1" id="' + boxId + '-box"><h2>' + esc(t("err.title")) + "</h2><ul>" +
      errors.map(function (e) { return '<li><a href="#' + e.id + '" data-focus="' + e.id + '">' + esc(e.msg) + "</a></li>"; }).join("") + "</ul></div>";
    document.getElementById(boxId + "-box").focus();
    return false;
  }

  function digits(s) { return String(s || "").replace(/\D/g, ""); }

  function submitCheckout() {
    var s = O.state.checkout, errs = [];
    if (!s.name.trim()) errs.push({ id: "co-name", msg: t("err.name") });
    if (digits(s.phone).length < 9) errs.push({ id: "co-phone", msg: t("err.phone") });
    if (s.delivery === "ship") {
      if (!s.address.trim()) errs.push({ id: "co-address", msg: t("err.address") });
      if (!s.city.trim()) errs.push({ id: "co-city", msg: t("err.address") });
    }
    if (!showErrors("checkout-errors", errs)) return;
    var lines = O.cart.lines(), saved = O.cart.savings();
    var codeUsed = lines.filter(function (l) { return l.sale && l.sale.code; })[0];
    var msg = [t("wa.hello"), t("wa.orderTitle"), ""].concat(lines.map(function (l) {
      return "• " + refName(l.product) + " · " + t("wa.size") + " " + sizeLabel(l.size) + " · ×" + l.qty + " · " + O.currency.ils(l.total) +
        (l.originalTotal > l.total ? " (−" + l.percent + "%, " + t("wa.instead") + " " + O.currency.ils(l.originalTotal) + ")" : "");
    })).concat([
      "",
      codeUsed ? t("wa.code") + ": " + codeUsed.sale.code : null,
      saved > 0 ? t("wa.savings") + ": " + O.currency.ils(saved) : null,
      t("wa.total") + ": " + O.currency.ils(O.cart.subtotal()),
      t("wa.name") + ": " + s.name.trim(),
      t("wa.phone") + ": " + s.phone.trim(),
      s.email.trim() ? t("wa.email") + ": " + s.email.trim() : null,
      t("wa.delivery") + ": " + (s.delivery === "ship" ? t("d.ship") + " · " + s.address.trim() + ", " + s.city.trim() : t("d.pickup")),
      s.notes.trim() ? t("wa.notes") + ": " + s.notes.trim() : null
    ]).filter(function (x) { return x !== null; }).join("\n");
    s.message = msg;
    s.ready = true;
    renderView({ keep: true });
    var h = $("#ready-title"); if (h) { h.focus(); h.scrollIntoView({ block: "center" }); }
  }

  function applyPromo() {
    var input = $("#promo-code"), btn = $("#promo-apply");
    var code = String(input ? input.value : "").trim().toUpperCase();
    O.state.promoInput = code;
    if (!code) { O.state.promoError = t("promo.empty"); renderView({ keep: true }); refocus("promo-code"); return; }
    if (btn) { btn.disabled = true; btn.textContent = t("promo.checking"); }
    O.data.checkCode(code).then(function (sale) {
      if (sale) {
        O.state.promo = sale; O.state.promoError = ""; O.state.checkout.ready = false;
        O.store.set("promo", sale.code);
        renderCart(); renderView({ keep: true });
        announce(t("promo.applied", { code: sale.code, deal: dealText(sale) }));
        refocus("promo-remove");
      } else {
        O.state.promoError = t("promo.invalid");
        renderView({ keep: true });
        announce(t("promo.invalid"));
        refocus("promo-code");
      }
    });
  }

  function submitFitting() {
    var f = O.state.fitting, errs = [];
    if (!f.name.trim()) errs.push({ id: "fit-name", msg: t("err.name") });
    if (digits(f.phone).length < 9) errs.push({ id: "fit-phone", msg: t("err.phone") });
    if (!showErrors("fit-errors", errs)) return;
    var msg = [
      t("wa.hello"), t("wa.fitTitle"), "",
      t("wa.name") + ": " + f.name.trim(),
      t("wa.phone") + ": " + f.phone.trim(),
      f.date ? t("wa.date") + ": " + fmtDate(new Date(f.date + "T12:00:00").getTime()) : "",
      t("wa.time") + ": " + t("time." + f.time),
      t("wa.event") + ": " + t("ev." + f.event),
      f.size.trim() ? t("wa.size") + ": " + f.size.trim() : "",
      f.notes.trim() ? t("wa.notes") + ": " + f.notes.trim() : ""
    ].filter(function (x, i) { return x !== "" || i === 2; }).join("\n");
    f.message = msg;
    f.ready = true;
    renderView({ keep: true });
    var h = $("#ready-title"); if (h) { h.focus(); h.scrollIntoView({ block: "center" }); }
  }

  var FIELD_MAP = {
    "co-name": ["checkout", "name"], "co-phone": ["checkout", "phone"], "co-email": ["checkout", "email"],
    "co-address": ["checkout", "address"], "co-city": ["checkout", "city"], "co-notes": ["checkout", "notes"],
    "fit-name": ["fitting", "name"], "fit-phone": ["fitting", "phone"], "fit-date": ["fitting", "date"],
    "fit-time": ["fitting", "time"], "fit-event": ["fitting", "event"], "fit-size": ["fitting", "size"], "fit-notes": ["fitting", "notes"]
  };

  function zoomOrigin(box, e) {
    var r = box.getBoundingClientRect();
    var x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    var y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    return x.toFixed(1) + "% " + y.toFixed(1) + "%";
  }

  /* ───────────── Events ───────────── */
  var searchTimer = null;
  function bindEvents() {
    window.addEventListener("hashchange", function () { route({ transition: true }); });
    var preview = function (e) {
      var a = e.target.closest ? e.target.closest(".nav-drop-panel a") : null;
      if (!a) return;
      var panel = a.closest(".nav-drop-panel"), cat = (a.getAttribute("href") || "").replace("#shop-", "");
      var img = panel.querySelector('[data-pv="' + cat + '"]');
      if (!img || img.classList.contains("on")) return;
      $$("[data-pv]", panel).forEach(function (x) { x.classList.toggle("on", x === img); });
    };
    document.addEventListener("mouseover", preview);
    document.addEventListener("focusin", preview);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = $(".nav-drop.open");
      if (!open) return;
      closeDrops();
      var b = open.querySelector(".nav-drop-btn"); if (b) b.focus();
    });

    document.addEventListener("click", function (e) {
      var el = e.target.closest ? e.target : null;
      if (!el) return;
      var hit;

      if ((hit = el.closest(".nav-drop-btn"))) {
        var drop = hit.closest(".nav-drop"), open = !drop.classList.contains("open");
        closeDrops(drop);
        drop.classList.toggle("open", open);
        hit.setAttribute("aria-expanded", String(open));
        return;
      }
      if (!el.closest(".nav-drop")) closeDrops();
      if ((hit = el.closest(".menu-sub-btn"))) {
        var sub = document.getElementById(hit.getAttribute("aria-controls")), expanded = hit.getAttribute("aria-expanded") === "true";
        hit.setAttribute("aria-expanded", String(!expanded));
        if (sub) sub.hidden = expanded;
        return;
      }
      if ((hit = el.closest("#skip-link"))) { e.preventDefault(); var h1 = $("#content h1") || $("#content"); h1.focus(); return; }
      if ((hit = el.closest("#menu-btn"))) { openDialog("menu-dialog"); return; }
      if ((hit = el.closest("#cart-btn"))) { openDialog("cart-dialog"); return; }
      if ((hit = el.closest("#a11y-btn"))) { openDialog("a11y-dialog"); return; }
      if ((hit = el.closest("#toast-action"))) { $("#toast").hidden = true; openDialog("cart-dialog"); return; }
      if ((hit = el.closest("[data-close]"))) { var d = hit.closest("dialog"); if (d) d.close(); return; }
      if ((hit = el.closest("[data-focus]"))) {
        e.preventDefault();
        var target = document.getElementById(hit.getAttribute("data-focus"));
        if (target) target.focus();
        return;
      }
      if ((hit = el.closest("[data-lb-step]"))) { LB.step(+hit.getAttribute("data-lb-step")); return; }
      if ((hit = el.closest("[data-lb]"))) { LB.go(+hit.getAttribute("data-lb")); return; }
      if ((hit = el.closest("[data-card]"))) {
        var media = hit.closest(".card").querySelector(".card-media");
        if (media && O.motionOK() && document.startViewTransition) { media.style.viewTransitionName = "oscar-art"; O.state.morph = true; }
        return; // the link's hash change does the navigation
      }
      if ((hit = el.closest("dialog a[href^='#']"))) {
        var dlg = hit.closest("dialog");
        if (hit.getAttribute("href") === location.hash || (hit.getAttribute("href") === "#" && !location.hash)) { if (dlg) dlg.close(); }
        return; // route() closes dialogs on navigation
      }
      if ((hit = el.closest("[data-qty]"))) {
        var idx = +hit.getAttribute("data-qty"), delta = +hit.getAttribute("data-delta");
        var item = O.cart.items[idx];
        if (!item) return;
        var gone = item.qty + delta <= 0;
        var p = O.data.bySlug(item.slug);
        var ok = O.cart.setQty(idx, item.qty + delta);
        var again = gone ? $("#cart-dialog [data-close]") : $('#cart-dialog [data-qty="' + idx + '"][data-delta="' + delta + '"]');
        if (again) again.focus();
        if (gone && p) announce(t("cart.removed", { name: tx(p.name) }));
        if (!ok) announce(t("stock.max", { n: item.qty }));
        return;
      }
      if ((hit = el.closest("[data-remove]"))) {
        var ri = +hit.getAttribute("data-remove"), rItem = O.cart.items[ri], rp = rItem && O.data.bySlug(rItem.slug);
        O.cart.remove(ri);
        var closeBtn = $("#cart-dialog [data-close]"); if (closeBtn) closeBtn.focus();
        if (rp) announce(t("cart.removed", { name: tx(rp.name) }));
        return;
      }
      if ((hit = el.closest("[data-a11y]"))) {
        var key = hit.getAttribute("data-a11y"), on = hit.getAttribute("aria-pressed") !== "true";
        O.a11y.set(key, on);
        hit.setAttribute("aria-pressed", String(on));
        return;
      }
      if ((hit = el.closest("[data-scale]"))) {
        var cur = O.a11y.settings.scale, act = hit.getAttribute("data-scale");
        var next = act === "up" ? Math.min(3, cur + 1) : act === "down" ? Math.max(0, cur - 1) : 1;
        O.a11y.set("scale", next);
        $("#scale-out").textContent = t("a11y.scale", { n: Math.round(O.a11y.scales[next] * 100) + "%" });
        return;
      }
      if ((hit = el.closest("[data-a11y-reset]"))) {
        O.a11y.reset(); renderA11y(); refocus("a11y-title");
        var heading = $("#a11y-title"); if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus(); }
        return;
      }
      if ((hit = el.closest(".thumb"))) {
        var prod = O.data.bySlug(O.state.route.slug), art = $("#pdp-art");
        if (!prod || !art) return;
        if (hit.hasAttribute("data-img")) {
          O.state.pdpImage = +hit.getAttribute("data-img");
          art.innerHTML = O.art.render(prod, O.state.pdpImage, { eager: true, sizes: SIZES.main });
          art.setAttribute("aria-pressed", "false");
        } else {
          O.state.pdpView = hit.getAttribute("data-view");
          art.innerHTML = O.art.render(prod, O.state.pdpView);
        }
        $$(".thumb").forEach(function (b) { b.setAttribute("aria-pressed", String(b === hit)); });
        return;
      }
      if ((hit = el.closest("#pdp-art.zoomable"))) {
        var zoomOn = hit.getAttribute("aria-pressed") !== "true";
        hit.setAttribute("aria-pressed", String(zoomOn));
        var zimg = hit.querySelector("img");
        if (zimg) zimg.style.transformOrigin = zoomOn && e.clientX ? zoomOrigin(hit, e) : "";
        return;
      }
      if ((hit = el.closest("#buybar-add"))) {
        var size = selectedSize();
        if (size) addToBag(O.state.route.slug, size); else showSizeError();
        return;
      }
      if ((hit = el.closest("[data-clear-search]"))) {
        O.state.shop.q = ""; var q = $("#shop-q"); if (q) { q.value = ""; q.focus(); } renderShopGrid(); return;
      }
      if ((hit = el.closest("#copy-phone"))) {
        var done = function () { hit.textContent = t("visit.copied"); setTimeout(function () { hit.textContent = t("visit.copy"); }, 2500); };
        var selectIt = function () { var r = document.createRange(); r.selectNodeContents($("#phone-text")); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); };
        try {
          navigator.clipboard.writeText(C.phoneDisplay).then(done, selectIt);
        } catch (err) { selectIt(); }
        return;
      }
      if ((hit = el.closest("#promo-remove"))) {
        O.state.promo = null; O.state.promoInput = ""; O.state.promoError = "";
        O.store.set("promo", null);
        O.state.checkout.ready = false;
        renderCart(); renderView({ keep: true }); refocus("promo-code");
        return;
      }
      if ((hit = el.closest("#checkout-edit"))) { O.state.checkout.ready = false; renderView({ keep: true }); refocus("co-name"); return; }
      if ((hit = el.closest("#fit-edit"))) { O.state.fitting.ready = false; renderView({ keep: true }); refocus("fit-name"); return; }
    });

    document.addEventListener("pointermove", function (e) {
      var art = e.target.closest ? e.target.closest('#pdp-art.zoomable[aria-pressed="true"]') : null;
      if (!art) return;
      var img = art.querySelector("img");
      if (img) img.style.transformOrigin = zoomOrigin(art, e);
    });

    document.addEventListener("change", function (e) {
      var el = e.target;
      if (el.classList.contains("js-lang")) { setLang(el.value, el.id); return; }
      if (el.classList.contains("js-cur")) { setCurrency(el.value, el.id); return; }
      if (el.id === "shop-sort") { O.state.shop.sort = el.value; renderShopGrid(); return; }
      if (el.name === "size" && el.closest("#pdp-form")) {
        var err = $("#size-error"); if (err) err.hidden = true;
        $("#size-set").removeAttribute("aria-describedby");
        var sp = O.data.bySlug(O.state.route.slug), note = $("#size-note");
        if (sp && note) note.textContent = sizeLeftText(sp, el.value);
        return;
      }
      if (el.id === "theme-try") {
        var pick = (O.themes || []).filter(function (x) { return x.id === el.value; })[0];
        O.data.settings.theme = pick ? { preset: pick.id, message: pick.message, accent: pick.accent, decoration: pick.decoration, decorations_on: true, until: null } : null;
        renderChrome();
        if (O.state.route && O.state.route.view === "home") {
          renderView({ keep: true, deco: true });
          var again = document.getElementById("theme-try"); if (again) again.focus({ preventScroll: true });
          try { window.scrollTo({ top: 0, behavior: O.motionOK() ? "smooth" : "auto" }); } catch (err) { window.scrollTo(0, 0); }
        } else location.hash = "home";
        return;
      }
      if (el.name === "co-delivery") {
        O.state.checkout.delivery = el.value;
        var ship = $("#ship-fields"); if (ship) ship.hidden = el.value !== "ship";
        return;
      }
      if (FIELD_MAP[el.id]) { var m = FIELD_MAP[el.id]; O.state[m[0]][m[1]] = el.value; }
    });

    document.addEventListener("input", function (e) {
      var el = e.target;
      if (el.id === "shop-q") {
        O.state.shop.q = el.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(renderShopGrid, 180);
        return;
      }
      if (el.id === "promo-code") {
        O.state.promoInput = el.value;
        if (O.state.promoError) {
          O.state.promoError = "";
          el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby");
          var pe = $("#promo-err"); if (pe) { pe.hidden = true; pe.textContent = ""; }
        }
        return;
      }
      if (FIELD_MAP[el.id]) { var m = FIELD_MAP[el.id]; O.state[m[0]][m[1]] = el.value; }
    });

    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (form.id === "pdp-form") {
        e.preventDefault();
        var size = selectedSize();
        if (!size) { showSizeError(); return; }
        addToBag(form.getAttribute("data-slug"), size);
        return;
      }
      if (form.id === "checkout-form") { e.preventDefault(); submitCheckout(); return; }
      if (form.id === "promo-form") { e.preventDefault(); applyPromo(); return; }
      if (form.id === "fit-form") { e.preventDefault(); submitFitting(); return; }
    });

    $$("dialog").forEach(function (d) {
      d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    });

    document.addEventListener("oscar:cart", function () {
      updateCartBadge();
      renderCart();
      if (O.state.route && O.state.route.view === "checkout") renderView({ keep: true });
    });
    document.addEventListener("oscar:rates", function () {
      renderFooter();
      if (O.state.currency !== "ILS") { renderCart(); renderView({ keep: true }); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) { $("#buybar").hidden = true; document.body.classList.remove("has-buybar"); }
    });
  }

  /* ───────────── Start ───────────── */
  function start() {
    O.a11y.init();
    applyLang();
    Intro.init();
    O.currency.init();
    O.cart.load();
    bindEvents();
    O.data.load().then(function () {
      applySettings();
      O.cart.prune();
      renderChrome();
      route({ initial: true, force: true });
      Intro.ready();
      /* A promo code entered on an earlier visit is checked again before it counts */
      var saved = O.store.get("promo", null);
      if (saved) O.data.checkCode(saved).then(function (sale) {
        if (!sale) { O.store.set("promo", null); return; }
        O.state.promo = sale;
        renderCart();
        if (O.state.route && O.state.route.view === "checkout") renderView({ keep: true });
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
