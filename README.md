# OSCAR Boutique — website

Website design and development: **AVI SHINI**. © OSCAR Boutique, all rights reserved.

The online store for OSCAR, evening dresses and designer wear, Herzl 73, Ramla.

It works in two parts:

1. **Website** (this folder): shop, product pages, bag, checkout, fittings, 4 languages, currencies, accessibility, sales, promo codes, stock limits and holiday looks.
2. **WhatsApp bot** (the `oscar-bot` folder): the owner sends a photo and a price and the piece appears on the site with its texts in all 4 languages. Prices, stock, sizes, sales, codes, holiday looks, hours and announcements are all changed the same way. Its README has the full setup.

Until the database is connected, the site shows its built-in sample collection with an example sale (15% off two gowns), an example code (`OSCAR10`) and example stock limits, so everything can be tried. In this preview the footer also has a "Try a holiday look" menu.

## Look and feel (premium pass, November 2026)

Black and white only, square edges, photos first. The logo is the shop's own mark in black (white over photos, in dark mode and on the black footer); the gold originals stay in `assets/img/logo/`. Grids lead with the plain-backdrop studio photo of each piece and show the boutique photo on hover. No red sale badges or "last pieces" warnings: a sale is the old price struck through. "Book a fitting" (`#book`) is in the header, the hero, the menu and the fitting section, and opens the visit page at the fitting form. Pages fade in; the opening shows the black logo for about a second.

**To go back to the previous design:** it is kept unchanged on the `classic-design` branch. Replace `main` with it (`git checkout main && git reset --hard classic-design && git push --force origin main`), or ask Claude to restore it.

## What's in the folder

```
index.html              the page shell
assets/css/oscar.css    all styles: black-and-white photo-first look, dark mode, high contrast
assets/js/config.js     store details: phone, address, hours, currencies, logo, connections
assets/js/i18n.js       every piece of interface text in Hebrew, English, Arabic and Russian
assets/js/products.js   sample dresses, example sale/stock, and loading from Supabase
assets/js/store.js      bag, sale prices, stock limits, currency conversion, accessibility settings
assets/js/themes.js     holiday looks (same list as the bot)
assets/js/decorations.js  the short falling sparkles/snow/confetti effect for holiday looks
assets/js/art.js        product photos (and a drawn fallback for any piece without photos)
assets/img/products/    product photos, each in two sizes: name-1080.webp and name-540.webp
assets/js/app.js        pages, navigation, checkout and fitting forms
```

No build step and no packages to install. It runs as plain files on any free host.

When a release changes the CSS or JS, bump the `?v=` tag on their links in `index.html` (all nine share one value) so visitors never mix old and new files.

## Try it on your computer

Double-click `index.html`. Everything works except live exchange rates and Google Fonts if you're offline.

## Products and photos

The collection in `assets/js/products.js` is the boutique's own photographed pieces. Each has a name, colour and description in all 4 languages, categories, sizes and a photo. Pieces that share a `group` (the lace corset gown in ivory, blush and cocoa) show each other as colour options. The top of the home page shows the OSCAR banner (`heroBanner` in `config.js`, files in `assets/img/hero/`; phones get the `-mobile` crop of the two gowns). To show product photos there instead, the bot can switch the banner off ("תשים בראש האתר את השמלה השחורה"), or remove `heroBanner`. `heroProducts` in `config.js` picks those photos (phones show the first), and `fittingProduct` picks the photo beside the fittings section. Hero photos use the `-hero.webp` version of each image.

## Opening, page changes and the lookbook

- **Opening:** the first time someone opens the site in a visit, a gold seam is stitched down an ivory page and then opens onto the site (about 2.5 seconds; a click or key skips it). It doesn't show again until the next visit, and never for visitors who asked for reduced motion or turned on "stop animations" in the accessibility menu. The markup is `#intro` at the top of `index.html`.
- **Page changes:** an ivory panel with the OSCAR mark covers the page while the next one is drawn (about 0.8 seconds). Opening a product from its card instead grows the card photo into the product page. Both are off with reduced motion.
- **Lookbook:** the home page shows pieces whose photo has had the background removed, standing on a stage that takes each dress's colour. Visitors drag, swipe, use the arrows or the keyboard, or pick from the strip; tapping the piece in front opens it. The list and the stage colours are `Oscar.lookbook` in `products.js`, and the cut-out photos are in `assets/img/cutouts/` (`<slug>-1100.webp` and `<slug>-640.webp`, transparent background). To add a piece, save its cut-out in both heights, add a line to the list with its widths, and it appears; a piece that is hidden or sold out is skipped automatically. A phone's built-in "lift subject from background" works well for making a cut-out.
- **Menu:** on a computer, the evening-dress menu shows a cut-out from the category under the pointer. Product cards with two or more photos show the second photo on hover.

## Things to fill in before launch

Once the bot is connected, all of these are done from WhatsApp: real prices, opening hours, turning off the "preview" notice ("תוריד את ההודעה של גרסת התצוגה"), the accessibility coordinator's name (required by Israeli regulations) and the store policies.

The only things left in `assets/js/config.js` are the logo (`logo: "assets/img/logo.png"`) and the database connection (`supabase`).

The store policies are placeholders until the owner sends the final wording, ideally checked by a lawyer, following the Consumer Protection Law for online sales.

## Where it's online

The site is published with **GitHub Pages** from the repository `Aixory/oscar-site` at **https://oscar-fashion.com/** (custom domain; the old https://aixory.github.io/oscar-site/ address redirects there). DNS for oscar-fashion.com is on Cloudflare's free plan (account xorystudios@gmail.com, nameservers adelaide/james.ns.cloudflare.com): four A records to GitHub (185.199.108–111.153) and `www` → `aixory.github.io`, all **DNS only** (grey cloud) so GitHub can renew the HTTPS certificate. The domain itself stays registered at Vangus. Every push to the `main` branch goes live in about a minute.

For your own domain: repository **Settings → Pages → Custom domain**, then add the DNS records GitHub shows. After that, replace `https://aixory.github.io/oscar-site/` in `index.html`, `robots.txt` and `sitemap.xml`, and the bot's `SITE_URL`.

## Google

The shop switches views with the part after "#", which Google sees as one page. So every collection, every piece and the visit page also has a real address of its own (`oscar-fashion.com/shop-maxi`, `oscar-fashion.com/p-noir-sequin-drape-gown`, `oscar-fashion.com/contact`), with its own Hebrew title, description and Google data. Each one is a copy of `index.html` that opens the same live shop at that view.

- These pages, `assets/js/seo-pages.js` and `sitemap.xml` are written by `node tools/build-seo.js`. Run it after changing `index.html` (for example a new `?v=` tag) and after pieces are added, so new pieces get their own address too.
- On screen, the shop keeps the title, the address Google should use and the piece's live price and stock up to date as visitors move around.
- The boutique's Google Maps listing ("אוסקר בוטיק", שדרות הרצל 73) is the strongest signal for local searches. Its owner should add `https://oscar-fashion.com` as the website there.

## How orders work right now

Card payments aren't connected yet, so checkout builds the order (items, sizes, total in ₪, customer details) and opens WhatsApp to the boutique's number with everything filled in. The boutique confirms availability and payment. When you're ready, the checkout button can be switched to PayPal or an Israeli processor (Grow, Cardcom, Tranzila).

## Languages and currencies

- Hebrew is the default. Arabic and Hebrew display right to left.
- To add a language: copy the `en` block in `i18n.js`, translate it, add the code to `config.languages`, and add its entry in `Oscar.i18n.meta`.
- Prices are stored and charged in shekels. Other currencies are shown as approximate conversions using free daily rates from ExchangeRate-API (credited in the footer, as their free plan requires).

## Accessibility

Built to meet IS 5568 / WCAG 2.0 AA (and WCAG 2.1 AA): keyboard navigation, screen-reader labels, skip link, contrast, 130% text, reduced motion, and an accessibility menu (text size, high contrast, link underlines, readable font, line spacing, stop animations). The accessibility statement page is in all 4 languages. Before launch, it's worth having the site checked by an accessibility tester, since automated building can't catch everything.

## Connecting the database

Follow `oscar-bot/README.md`. In short: create a free Supabase project, run the SQL files from `oscar-bot/supabase`, deploy the bot, then put the project URL and the **publishable** key (`sb_publishable_…`, or the older `anon` key) in `config.supabase`:

```js
supabase: { url: "https://YOUR-PROJECT-REF.supabase.co", anonKey: "sb_publishable_..." },
```

The site then loads pieces, running sales and settings from the database instead of the samples. It can only read; promo codes are checked one at a time and never listed.

Only the WhatsApp bot writes to the database, with the **secret** key that lives in Supabase. That key must never go into the website files.

## How stock and sales show on the site

- **Stock**: a piece can have a count per size and/or a total limit. Sizes at 0 can't be picked; the bag never lets someone add more than what's left; "Only N left" appears once stock drops to the piece's alert level (3 unless the owner changes it).
- **Sales**: the best running discount is shown with the old price struck through, a −% badge, and a "Sale" filter. Sales can start and end on set dates by themselves.
- **Promo codes**: entered at checkout; the discount and code are included in the WhatsApp order message so the boutique sees exactly what the customer saw.
- **Holiday looks**: the top bar takes the holiday colour and greeting, and a short decoration plays over the home photo (never for visitors who turned off animations).
