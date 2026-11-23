/* OSCAR Boutique — store settings.
   Edit this file to change contact details, hours, currencies and connections.
   Everything else on the site reads from here. */
window.Oscar = window.Oscar || {};

Oscar.config = {
  storeName: "OSCAR",

  // Website design and development credit (footer, policies page and the page's author tag).
  // Fixed here in the code on purpose: nothing from the database, the WhatsApp bot or the panel can change it.
  siteDesigner: "AVI SHINI",

  // Path or URL of the logo image. Leave empty to show the text wordmark.
  logo: "assets/img/logo/logo-wordmark-black.png",

  // The big picture at the top of the home page. While it is set (and the bot hasn't switched it off),
  // it shows instead of the product photos below. Phones get the "small" crop.
  heroBanner: {
    src: "assets/img/hero/oscar-banner-1983.webp", width: 1983, height: 793,
    medium: "assets/img/hero/oscar-banner-1200.webp",
    small: "assets/img/hero/oscar-banner-mobile.webp", smallWidth: 700, smallHeight: 793
  },
  // Full-screen photos at the top of the home page when there is no banner (slugs). Phones show the first one.
  heroProducts: ["noir-sequin-drape-gown", "ivory-lace-corset-gown", "plum-satin-sparkle-gown"],
  // Photo beside the "book a fitting" section on the home page.
  fittingProduct: "ivory-lace-corset-gown",

  // Shown while the site uses sample dresses, prices and placeholder photos.
  // Set to false once real products are loaded.
  previewMode: true,

  phoneDisplay: "054-678-9446",
  phoneIntl: "972546789446",          // used for WhatsApp links (no + or spaces)
  instagram: "https://www.instagram.com/oscar_boutique_ramle/",
  instagramHandle: "@oscar_boutique_ramle",

  address: {
    he: "הרצל 73, רמלה",
    en: "Herzl St 73, Ramla",
    ar: "شارع هرتسل 73، الرملة",
    ru: "ул. Герцль 73, Рамла"
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C+73+%D7%A8%D7%9E%D7%9C%D7%94",
  wazeUrl: "https://waze.com/ul?q=%D7%94%D7%A8%D7%A6%D7%9C%2073%20%D7%A8%D7%9E%D7%9C%D7%94&navigate=yes",

  // Opening hours: fill in when known. Leave empty to show the "call before you come" note.
  // Example: [{ days: { he: "א׳–ה׳", en: "Sun–Thu", ar: "الأحد–الخميس", ru: "Вс–Чт" }, hours: "10:00–20:00" }]
  hours: [],

  // Accessibility coordinator (required by Israeli accessibility regulations).
  accessibilityContact: { name: "", phone: "054-678-9446" },

  languages: ["he", "en", "ar", "ru"],
  defaultLanguage: "he",

  // Prices are stored and charged in ILS. Other currencies are shown as approximate conversions.
  baseCurrency: "ILS",
  currencies: ["ILS", "USD", "EUR", "GBP", "JOD", "AED", "RUB", "CAD"],

  // Supabase (free database). Leave empty to use the sample products in products.js.
  // The live database the WhatsApp bot writes to. This publishable key is safe in public files; it can only read.
  supabase: { url: "https://yjxqjarbsljkjujgtujk.supabase.co", anonKey: "sb_publishable_zGxYuiZHZclzIyrd1BdSrA_mGRIaC7A" },

  // Card payments: "none" sends orders on WhatsApp. Later: "paypal" or "grow".
  payments: "none"
};
