#!/usr/bin/env node
/* Google pages for OSCAR.
 *
 * The shop itself is one page that switches views by the part after "#", and Google treats everything
 * after "#" as the same page. So every collection and every piece also gets a real address of its own
 * (oscar-fashion.com/shop-maxi, oscar-fashion.com/p-noir-sequin-drape-gown, ...): a copy of index.html
 * with its own Hebrew title, description, Google data and a short readable text, which then opens the
 * same live shop at that view.
 *
 * Run from the site folder after changing index.html or adding pieces:   node tools/build-seo.js
 * It rewrites index.html (head and opening text), writes the page files, assets/js/seo-pages.js and sitemap.xml.
 */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://oscar-fashion.com/";
const TODAY = new Date().toISOString().slice(0, 10);

/* ── the site's own data ── */
const ctx = { console, document: { documentElement: {} } };
ctx.window = ctx; ctx.Oscar = {};
vm.createContext(ctx);
for (const f of ["config.js", "i18n.js", "products.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js", f), "utf8"), ctx, { filename: f });
}
const O = ctx.Oscar, C = O.config;
const t = (k) => O.t(k);
const PRODUCTS = O.sampleProducts.filter((p) => !p.hidden);
const CATS = O.categories;
const catLabel = (id) => t("cat." + id);

/* ── words ── */
const BRAND = "אוסקר בוטיק";
const ADDR = "שדרות הרצל 73, רמלה";
const CAT_TEXT = {
  evening: "שמלות ערב לחתונות ולכל אירוע: מקסי, מיני ומידי, צנוע בסטייל ו-Haute Couture, ממעצבים מהארץ ומחו״ל, עם תופרת במקום שמתאימה כל שמלה לגוף שלך.",
  maxi: "שמלות ערב ארוכות לחתונות ולאירועים: פאייטים, תחרה, סאטן ומחוכים, עם התאמה אישית של התופרת בבוטיק.",
  short: "שמלות ערב קצרות במיני ובמידי: פאייטים, סאטן ושמלות בועה לאירועים ושמחות, עם מדידה פרטית בבוטיק.",
  modest: "שמלות ערב צנועות עם שרוולים ובגזרות ארוכות, אלגנטיות לגמרי, עם התאמה של התופרת בבוטיק.",
  couture: "שמלות Haute Couture: חרוזים, תחרה ומחוכים, לאירוע שבו השמלה היא הסיפור. מדידה פרטית בבוטיק.",
  suits: "חליפות ערב וסטים מעוצבים לנשים: פפלום, מכנסיים רחבים וחליפות מעוטרות לאירועים.",
  jumpsuits: "אוברולים ערב אלגנטיים לנשים, לחתונות ולאירועים, עם התאמה של התופרת בבוטיק.",
};
const HOME = {
  title: `${BRAND} OSCAR | שמלות ערב ובגדי מעצבים ברמלה`,
  desc: `${BRAND} (OSCAR), ${ADDR}: שמלות ערב, שמלות מקסי, חליפות ואוברולים ממעצבים מהארץ ומחו״ל, לחתונות ולכל אירוע, עם תופרת במקום שמתאימה כל שמלה לגוף שלך.`,
};
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (u) => (/^https?:/.test(u) ? u : SITE + u.replace(/^\//, ""));
const firstPhoto = (p) => (p.images || []).find((x) => !/-studio-/.test(x)) || (p.images || [])[0] || "";

/* ── Google data ── */
const STORE = {
  "@context": "https://schema.org", "@type": "ClothingStore", "@id": SITE + "#store",
  name: "OSCAR Boutique", alternateName: [BRAND, "אוסקר", "OSCAR"],
  description: HOME.desc, url: SITE,
  image: SITE + "assets/img/og/oscar-share.jpg", logo: SITE + "assets/img/logo/logo-full-mono.png",
  telephone: "+972-54-678-9446",
  address: { "@type": "PostalAddress", streetAddress: "שדרות הרצל 73", addressLocality: "רמלה", addressCountry: "IL" },
  geo: { "@type": "GeoCoordinates", latitude: 31.9275201, longitude: 34.8726342 },
  hasMap: "https://www.google.com/maps/place/?q=place_id:ChIJk3KPWQPKAhURjnuOu2m90fc",
  sameAs: [C.instagram || "https://www.instagram.com/oscar_boutique_ramle/"],
};
const WEBSITE = { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE + "#site", name: "OSCAR Boutique", alternateName: BRAND, url: SITE, inLanguage: "he" };
const crumbs = (list) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: list.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: SITE + c[1] })),
});

/* ── the pages ── */
const pages = [];
pages.push({ key: "", title: HOME.title, desc: HOME.desc, image: SITE + "assets/img/og/oscar-share.jpg", ld: [STORE, WEBSITE],
  h1: `${BRAND} · שמלות ערב ובגדי מעצבים ברמלה`, lead: t("hero.lead"), extra: `${ADDR} · ${C.phoneDisplay || "054-678-9446"}`, links: "all" });
pages.push({ key: "shop", title: `הקולקציה: שמלות ערב, חליפות ואוברולים | ${BRAND} רמלה`,
  desc: clip(`כל הקולקציה של ${BRAND} ב${ADDR}: שמלות ערב מקסי ומיני, Haute Couture, צנוע בסטייל, חליפות ואוברולים, עם תופרת במקום.`),
  image: abs(firstPhoto(PRODUCTS[0])), ld: [crumbs([["דף הבית", ""], ["הקולקציה", "shop"]])],
  h1: "הקולקציה", lead: CAT_TEXT.evening, links: "all" });
for (const c of CATS) {
  const list = PRODUCTS.filter((p) => (p.categories || []).includes(c.id) || (c.children || []).some((k) => (p.categories || []).includes(k)));
  if (!list.length) continue;
  const label = catLabel(c.id);
  const parent = c.parent ? CATS.find((x) => x.id === c.parent) : null;
  const trail = [["דף הבית", ""], ["הקולקציה", "shop"]].concat(parent ? [[catLabel(parent.id), "shop-" + parent.id]] : []).concat([[label, "shop-" + c.id]]);
  pages.push({ key: "shop-" + c.id, title: `${label} ברמלה | ${BRAND}`, desc: clip(`${label} ב${BRAND}, ${ADDR}. ${CAT_TEXT[c.id] || ""}`),
    image: abs(firstPhoto(list[0])), h1: label, lead: CAT_TEXT[c.id] || "", items: list,
    ld: [crumbs(trail), { "@context": "https://schema.org", "@type": "CollectionPage", name: label, url: SITE + "shop-" + c.id,
      isPartOf: { "@id": SITE + "#site" },
      mainEntity: { "@type": "ItemList", itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + "p-" + p.slug, name: p.name.he })) } }] });
}
for (const p of PRODUCTS) {
  const cat = CATS.find((c) => (p.categories || [])[0] === c.id);
  const label = cat ? catLabel(cat.id) : "הקולקציה";
  const parent = cat && cat.parent ? CATS.find((x) => x.id === cat.parent) : null;
  const trail = [["דף הבית", ""], ["הקולקציה", "shop"]].concat(parent ? [[catLabel(parent.id), "shop-" + parent.id]] : []).concat(cat ? [[label, "shop-" + cat.id]] : []).concat([[p.name.he, "p-" + p.slug]]);
  const d = (p.description && p.description.he) || "";
  pages.push({ key: "p-" + p.slug, title: `${p.name.he} | ${BRAND} רמלה`,
    desc: clip(`${p.name.he}: ${d} ${label} ב${BRAND}, ${ADDR}.`), image: abs(firstPhoto(p)), product: p, catLabel: label,
    h1: p.name.he, lead: d, ld: [crumbs(trail)] });
}
pages.push({ key: "contact", title: `ביקור ומדידה פרטית | ${BRAND}, ${ADDR}`,
  desc: clip(`${BRAND}, ${ADDR}, טלפון ${C.phoneDisplay || "054-678-9446"}. מדידות פרטיות בתיאום מראש, ותופרת במקום שמתאימה כל שמלה לגוף שלך.`),
  image: SITE + "assets/img/og/oscar-share.jpg", h1: t("visit.title"), lead: t("home.fitText"), extra: `${ADDR} · ${C.phoneDisplay || "054-678-9446"}`,
  ld: [crumbs([["דף הבית", ""], ["ביקור ומדידה", "contact"]]), STORE] });

/* ── writing ── */
const tpl = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
function between(s, a, b, inner) {
  const i = s.indexOf(a), j = s.indexOf(b);
  if (i < 0 || j < 0) throw new Error("marker missing: " + a);
  return s.slice(0, i + a.length) + inner + s.slice(j);
}
function headHTML(pg) {
  const url = SITE + pg.key;
  return "\n" + [
    `<title>${esc(pg.title)}</title>`,
    `<meta name="description" content="${esc(pg.desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="${pg.product ? "product" : "website"}">`,
    `<meta property="og:site_name" content="OSCAR Boutique">`,
    `<meta property="og:locale" content="he_IL">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(pg.title)}">`,
    `<meta property="og:description" content="${esc(pg.desc)}">`,
    `<meta property="og:image" content="${esc(pg.image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ].concat(pg.ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`)).map((l) => "  " + l).join("\n") + "\n  ";
}
function linkList(items) {
  return items.map((p) => `<li><a href="p-${p.slug}">${esc(p.name.he)}</a></li>`).join("");
}
function mainHTML(pg) {
  /* What a search engine (or a visitor before the shop loads) reads; the live shop replaces it a moment later. */
  let h = `\n    <div class="wrap page-head seo-static">\n      <h1>${esc(pg.h1)}</h1>\n`;
  if (pg.lead) h += `      <p class="lead">${esc(pg.lead)}</p>\n`;
  if (pg.extra) h += `      <p>${esc(pg.extra)}</p>\n`;
  if (pg.product) {
    const img = firstPhoto(pg.product);
    if (img) h += `      <img src="${esc(img)}" alt="${esc(pg.product.name.he)}" width="1080" height="1440" style="max-width:min(100%,28rem);height:auto">\n`;
    h += `      <p><a href="shop-${esc((pg.product.categories || [])[0] || "")}">${esc(pg.catLabel)}</a> · <a href="contact">קביעת מדידה</a></p>\n`;
  }
  h += `      <nav class="seo-links" aria-label="הקולקציה" hidden><ul>`;
  h += `<li><a href="./">${BRAND}</a></li><li><a href="shop">הקולקציה</a></li>`;
  h += CATS.map((c) => `<li><a href="shop-${c.id}">${esc(catLabel(c.id))}</a></li>`).join("");
  h += `<li><a href="contact">ביקור ומדידה</a></li>`;
  h += linkList(pg.items || (pg.links === "all" ? PRODUCTS : []));
  h += `</ul></nav>\n    </div>\n    <noscript><div class="wrap" style="padding-block:2rem"><p>האתר צריך JavaScript כדי להציג את הקולקציה. This site needs JavaScript to show the collection.</p></div></noscript>\n    `;
  return h;
}
const written = [];
for (const pg of pages) {
  let html = between(tpl, "<!--SEO:HEAD-->", "<!--/SEO:HEAD-->", headHTML(pg));
  html = between(html, "<!--SEO:MAIN-->", "<!--/SEO:MAIN-->", mainHTML(pg));
  html = html.replace(/<html lang="he" dir="rtl"[^>]*>/, pg.key ? `<html lang="he" dir="rtl" data-route="${pg.key}">` : '<html lang="he" dir="rtl">');
  const file = pg.key ? pg.key + ".html" : "index.html";
  fs.writeFileSync(path.join(ROOT, file), html);
  written.push(file);
}

/* the list the live shop uses to keep each view's Google title and address */
const map = {};
for (const pg of pages) map[pg.key] = { t: pg.title, d: pg.desc };
fs.writeFileSync(path.join(ROOT, "assets/js/seo-pages.js"),
  "/* Written by tools/build-seo.js: the pages that have their own address, with their Hebrew Google title and description. */\n" +
  "window.Oscar = window.Oscar || {};\nOscar.seoPages = " + JSON.stringify(map) + ";\n");

/* sitemap, with the photos so the dresses can show up in Google Images */
const img = (u, cap) => `<image:image><image:loc>${esc(abs(u))}</image:loc>${cap ? `<image:title>${esc(cap)}</image:title>` : ""}</image:image>`;
const sm = ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'];
for (const pg of pages) {
  const imgs = pg.product ? (pg.product.images || []).map((u) => img(u, pg.product.name.he)).join("") : "";
  sm.push(`  <url><loc>${SITE + pg.key}</loc><lastmod>${TODAY}</lastmod>${imgs}</url>`);
}
sm.push("</urlset>");
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sm.join("\n") + "\n");
console.log(written.length + " pages, sitemap with " + pages.length + " addresses");
