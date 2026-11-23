/* OSCAR Boutique — products and categories.
   These are the boutique's own photographed pieces, with EXAMPLE prices.
   Once Supabase is connected (config.supabase), products load from the database instead,
   and the WhatsApp bot keeps them up to date. */
window.Oscar = window.Oscar || {};

Oscar.categories = [
  { id: "evening", key: "cat.evening", children: ["maxi", "short", "modest", "couture"] },
  { id: "maxi", key: "cat.maxi", parent: "evening" },
  { id: "short", key: "cat.short", parent: "evening" },
  { id: "modest", key: "cat.modest", parent: "evening" },
  { id: "couture", key: "cat.couture", parent: "evening" },
  { id: "suits", key: "cat.suits" },
  { id: "jumpsuits", key: "cat.jumpsuits" }
];
/* The side menu, in order. "sale" is every piece with a running discount. */
Oscar.menu = ["evening", "suits", "jumpsuits", "sale"];

/* Lookbook on the home page: pieces that have a cut-out photo (background removed), in show order.
   bg is the stage colour behind the piece; dark: true puts light text on it.
   w is the cut-out's width at 640 and 1100 pixels tall. A piece that is hidden or removed is skipped. */
Oscar.lookbook = [
  { slug: "plum-satin-sparkle-gown", bg: "#3A2229", dark: true, w: [222, 381] },
  { slug: "sky-chiffon-gown", bg: "#DCD3E6", w: [273, 469] },
  { slug: "cocoa-zip-gown", bg: "#E4CFC6", w: [171, 293] },
  { slug: "gilded-brocade-corset-gown", bg: "#1D1A15", dark: true, w: [273, 468] },
  { slug: "ivory-lace-corset-gown", bg: "#E6DDCF", w: [177, 304] },
  { slug: "sky-strapless-wrap-mini", bg: "#EAD8CB", w: [182, 312] },
  { slug: "pearl-trim-suit", bg: "#2A2A2D", dark: true, w: [203, 349] },
  { slug: "blush-lace-corset-gown", bg: "#EBD4CF", w: [176, 303] },
  { slug: "noir-zip-gown", bg: "#D6CDC1", w: [197, 339] },
  { slug: "sky-brooch-one-shoulder-set", bg: "#E9DCCF", w: [188, 324] },
  { slug: "noir-sequin-drape-gown", bg: "#D8CDC0", w: [245, 422] },
  { slug: "gold-sequin-drape-mini", bg: "#E4D5B7", w: [220, 378] },
  { slug: "rose-sequin-drape-gown", bg: "#2C2427", dark: true, w: [223, 383] },
  { slug: "noir-buckle-gown", bg: "#E2D6C8", w: [196, 337] },
  { slug: "white-bubble-mini", bg: "#CFC6BB", w: [274, 471] },
  { slug: "noir-one-shoulder-peplum-set", bg: "#E3D3CB", w: [222, 382] },
  { slug: "pearl-satin-mini", bg: "#BDB2A6", w: [278, 478] },
  { slug: "lace-sleeve-jumpsuit", bg: "#D8CEC4", w: [206, 355] },
  { slug: "white-cape-peplum-set", bg: "#2E2B28", dark: true, w: [189, 326] },
  { slug: "ice-blue-shimmer-midi", bg: "#D2DCE8", w: [251, 432] },
  { slug: "noir-chain-belt-peplum-set", bg: "#D9CBBE", w: [213, 366] },
  { slug: "noir-draped-strapless-gown", bg: "#CBBFB3", w: [203, 348] },
  { slug: "lavender-beaded-gown", bg: "#D0CCD9", w: [360, 620] },
  { slug: "white-corset-peplum-set", bg: "#C9BDB0", w: [167, 287] },
  { slug: "cocoa-lace-corset-gown", bg: "#D9C4AF", w: [175, 301] },
  { slug: "beaded-fringe-suit", bg: "#C9C0B5", w: [192, 329] }
];
Oscar.cutout = function (slug, h) { return "assets/img/cutouts/" + slug + "-" + (h || 1100) + ".webp"; };

/* EU sizes with body measurements in cm (general guide). */
Oscar.sizeChart = [
  { size: "36", bust: "82–86", waist: "64–68", hips: "90–94" },
  { size: "38", bust: "86–90", waist: "68–72", hips: "94–98" },
  { size: "40", bust: "90–94", waist: "72–76", hips: "98–102" },
  { size: "42", bust: "94–98", waist: "76–80", hips: "102–106" },
  { size: "44", bust: "98–102", waist: "80–84", hips: "106–110" }
];

/* Pieces photographed by the boutique. Prices are examples until the owner sets them.
   "group" links colour versions of the same design. */
var SIZES = ["36", "38", "40", "42", "44"];
function photo(slug) { return ["assets/img/products/" + slug + "-1080.webp"]; }
/* A second, studio-style photo (cut-out on a plain backdrop). On the shop cards it shows on hover. */
function studio(slug) { return "assets/img/products/" + slug + "-studio-1080.webp"; }

Oscar.sampleProducts = [
  {
    slug: "noir-chain-belt-peplum-set", price: 790, isNew: true, categories: ["suits"],
    sizes: SIZES, soldOut: [], images: photo("noir-chain-belt-peplum-set"),
    name: { he: "סט פפלום שחור עם חגורת שרשרת", en: "Black Chain-Belt Peplum Set", ar: "طقم بيبلوم أسود بحزام سلسلة", ru: "Чёрный комплект с баской и поясом-цепью" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "טופ ללא שרוולים עם צווארון נשפך, פפלום וחגורת עור עם שרשרת זהב, ומכנסיים רחבים בגזרה גבוהה.",
      en: "Sleeveless top with a draped neckline and peplum, a leather belt with a gold chain, and high-waisted wide-leg trousers.",
      ar: "توب بلا أكمام بياقة منسدلة وبيبلوم، مع حزام جلدي بسلسلة ذهبية، وبنطلون واسع بخصر عالٍ.",
      ru: "Топ без рукавов с драпированным воротом и баской, кожаный пояс с золотой цепью и широкие брюки с высокой посадкой."
    }
  },
  {
    slug: "noir-buckle-gown", price: 890, isNew: true, categories: ["maxi", "modest"],
    sizes: SIZES, soldOut: [], images: photo("noir-buckle-gown"),
    name: { he: "שמלת אבזם שחורה", en: "Black Buckle Gown", ar: "فستان أسود بإبزيم", ru: "Чёрное платье с пряжкой" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "שמלה ארוכה וצמודה עם שרוולים ארוכים וצווארון סירה, כיווץ במותן עם אבזם זהב ושסע בצד.",
      en: "Long fitted gown with long sleeves and a boat neckline, gathered at the waist with a gold buckle, and a side slit.",
      ar: "فستان طويل ضيّق بأكمام طويلة وياقة قارب، مكشكش عند الخصر بإبزيم ذهبي، مع فتحة جانبية.",
      ru: "Длинное облегающее платье с длинными рукавами и вырезом-лодочкой, сборкой на талии с золотой пряжкой и разрезом сбоку."
    }
  },
  {
    slug: "white-cape-peplum-set", price: 890, isNew: true, categories: ["suits", "modest"],
    sizes: SIZES, soldOut: [], images: photo("white-cape-peplum-set"),
    name: { he: "סט פפלום לבן עם שכמייה", en: "White Cape Peplum Set", ar: "طقم بيبلوم أبيض بكاب", ru: "Белый комплект с кейпом и баской" },
    color: { he: "לבן", en: "White", ar: "أبيض", ru: "Белый" },
    description: {
      he: "טופ עם צווארון עגול ושכמייה קצרה על הכתפיים, מותן פפלום וחצאית ארוכה וצמודה עד הקרסול.",
      en: "Round-neck top with a short cape over the shoulders and a peplum waist, with a long fitted skirt to the ankle.",
      ar: "توب بياقة دائرية وكاب قصير على الكتفين وخصر بيبلوم، مع تنورة طويلة ضيّقة حتى الكاحل.",
      ru: "Топ с круглым вырезом, коротким кейпом на плечах и баской, с длинной облегающей юбкой до щиколотки."
    }
  },
  {
    slug: "sky-brooch-one-shoulder-set", price: 690, isNew: true, categories: ["suits"],
    sizes: SIZES, soldOut: [], images: photo("sky-brooch-one-shoulder-set"),
    name: { he: "סט כתף אחת תכלת עם סיכה", en: "Sky One-Shoulder Brooch Set", ar: "طقم سماوي بكتف واحد وبروش", ru: "Голубой комплект на одно плечо с брошью" },
    color: { he: "תכלת", en: "Sky blue", ar: "أزرق سماوي", ru: "Небесно-голубой" },
    description: {
      he: "טופ כתף אחת נשפך עם סיכת פרח זהב בכתף, ומכנסיים רחבים בגזרה גבוהה.",
      en: "Draped one-shoulder top with a gold flower brooch at the shoulder, and high-waisted wide-leg trousers.",
      ar: "توب منسدل بكتف واحد مع بروش وردة ذهبي على الكتف، وبنطلون واسع بخصر عالٍ.",
      ru: "Драпированный топ на одно плечо с золотой брошью-цветком и широкие брюки с высокой посадкой."
    }
  },
  {
    slug: "white-corset-peplum-set", price: 990, isNew: true, categories: ["suits"],
    sizes: SIZES, soldOut: [], images: photo("white-corset-peplum-set"),
    name: { he: "סט מחוך פפלום לבן", en: "White Corset Peplum Set", ar: "طقم كورسيه بيبلوم أبيض", ru: "Белый комплект с корсетом и баской" },
    color: { he: "לבן", en: "White", ar: "أبيض", ru: "Белый" },
    description: {
      he: "טופ מחוך סטרפלס עם פפלום מחודד, וחצאית ארוכה וצמודה עם שסע.",
      en: "Strapless corset top with a pointed peplum, and a long fitted skirt with a slit.",
      ar: "توب كورسيه بلا حمّالات مع بيبلوم مدبّب، وتنورة طويلة ضيّقة بفتحة.",
      ru: "Корсет без бретелей с заострённой баской и длинная облегающая юбка с разрезом."
    }
  },
  {
    slug: "rose-sequin-drape-gown", price: 1390, isNew: true, categories: ["maxi"], group: "sequin-drape",
    sizes: SIZES, soldOut: [], images: photo("rose-sequin-drape-gown"),
    name: { he: "שמלת פאייטים ורודה עם שסע", en: "Rose Sequin Draped Gown", ar: "فستان ترتر وردي بفتحة", ru: "Розовое платье с пайетками" },
    color: { he: "ורוד", en: "Rose", ar: "وردي", ru: "Розовый" },
    description: {
      he: "שמלת סטרפלס ארוכה רקומה פאייטים ורודים, עם מחשוף קאול, כיווצים בירך, שסע גבוה ושובל קצר.",
      en: "Long strapless gown covered in rose sequins, with a soft cowl neckline, gathering at the hip, a high slit and a short train.",
      ar: "فستان طويل بلا حمّالات مغطّى بالترتر الوردي، بفتحة صدر منسدلة وكشكشة عند الورك وفتحة عالية وذيل قصير.",
      ru: "Длинное платье без бретелей, расшитое розовыми пайетками, с мягким вырезом-хомутом, сборкой на бедре, высоким разрезом и небольшим шлейфом."
    }
  },
  {
    slug: "cocoa-zip-gown", price: 890, isNew: true, categories: ["maxi", "modest"], group: "zip-gown",
    sizes: SIZES, soldOut: [], images: photo("cocoa-zip-gown"),
    name: { he: "שמלת זיפ שוקולד", en: "Chocolate Zip Gown", ar: "فستان السحّاب بلون الشوكولاتة", ru: "Шоколадное платье с молнией" },
    color: { he: "שוקולד", en: "Chocolate", ar: "شوكولاتة", ru: "Шоколадный" },
    description: {
      he: "שמלה ארוכה עם צווארון גבוה ושרוולים ארוכים, כיווצים במותן ורוכסן זהב אלכסוני שנפתח לשסע.",
      en: "Long gown with a high neck and long sleeves, ruching at the waist and a diagonal gold zip that opens into a slit.",
      ar: "فستان طويل بياقة عالية وأكمام طويلة، مع كشكشة عند الخصر وسحّاب ذهبي مائل ينفتح على فتحة.",
      ru: "Длинное платье с высоким воротом и длинными рукавами, сборкой на талии и диагональной золотой молнией, переходящей в разрез."
    }
  },
  {
    slug: "sky-strapless-wrap-mini", price: 560, isNew: true, categories: ["short"],
    sizes: SIZES, soldOut: [], images: photo("sky-strapless-wrap-mini"),
    name: { he: "מיני סטרפלס תכלת במעטפת", en: "Sky Strapless Wrap Mini", ar: "فستان ميني سماوي بلا حمّالات", ru: "Голубое мини без бретелей с запахом" },
    color: { he: "תכלת", en: "Sky blue", ar: "أزرق سماوي", ru: "Небесно-голубой" },
    description: {
      he: "שמלת מיני ללא כתפיות עם מחוך תפור, כיווצים בצד וחצאית מעטפת א־סימטרית.",
      en: "Strapless mini with a seamed bodice, side ruching and an asymmetric wrap skirt.",
      ar: "فستان ميني بلا حمّالات بصدر مخيط، وكشكشة جانبية، وتنورة ملفوفة غير متماثلة.",
      ru: "Мини без бретелей с лифом на швах, сборкой сбоку и асимметричной юбкой с запахом."
    }
  },
  {
    slug: "noir-draped-strapless-gown", price: 990, isNew: true, categories: ["maxi"],
    sizes: SIZES, soldOut: [], images: photo("noir-draped-strapless-gown"),
    name: { he: "שמלת סטרפלס שחורה בדרפרי", en: "Black Draped Strapless Gown", ar: "فستان أسود بلا حمّالات بطيّات", ru: "Чёрное драпированное платье без бретелей" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "שמלה ארוכה ללא כתפיות, עם כיווצים צמודים במותן ודרפרי רך שנופל עד הרצפה.",
      en: "Long strapless gown with fitted ruching at the waist and soft draping that falls to the floor.",
      ar: "فستان طويل بلا حمّالات مع كشكشة ضيّقة عند الخصر وطيّات ناعمة تنسدل حتى الأرض.",
      ru: "Длинное платье без бретелей с облегающими сборками на талии и мягкой драпировкой до пола."
    }
  },
  {
    slug: "noir-one-shoulder-peplum-set", price: 790, isNew: true, categories: ["suits"],
    sizes: SIZES, soldOut: [], images: photo("noir-one-shoulder-peplum-set"),
    name: { he: "סט פפלום כתף אחת", en: "One-Shoulder Peplum Set", ar: "طقم بيبلوم بكتف واحد", ru: "Комплект с баской на одно плечо" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "טופ כתף אחת משובץ חרוזים ונצנצים שחורים, מותן פפלום ומכנסיים מתרחבים בגזרה גבוהה.",
      en: "One-shoulder top covered in black beading and sparkle, with a peplum waist and high-waisted flared trousers.",
      ar: "توب بكتف واحد مطرّز بالخرز واللمعة السوداء، مع خصر بيبلوم وبنطلون واسع بخصر عالٍ.",
      ru: "Топ на одно плечо с чёрной вышивкой бисером и блеском, баска на талии и расклёшенные брюки с высокой посадкой."
    }
  },
  {
    slug: "ivory-lace-corset-gown", price: 1290, isNew: true, categories: ["maxi", "couture"], group: "lace-corset",
    sizes: SIZES, soldOut: [], images: photo("ivory-lace-corset-gown").concat(studio("ivory-lace-corset-gown")),
    name: { he: "שמלת מחוך תחרה שנהב", en: "Ivory Lace Corset Gown", ar: "فستان كورسيه دانتيل عاجي", ru: "Кружевное платье-корсет «Айвори»" },
    color: { he: "שנהב", en: "Ivory", ar: "عاجي", ru: "Слоновая кость" },
    description: {
      he: "שמלת סטרפלס עם מחוך תחרה מובנה, פתחים במותן, כיווצים בירך וחצאית תחרה שקופה עד הרצפה.",
      en: "Strapless gown with a structured lace corset, cut-outs at the waist, ruching at the hip and a sheer lace skirt to the floor.",
      ar: "فستان بلا حمّالات بكورسيه دانتيل مشدود، وفتحات عند الخصر، وكشكشة عند الورك، وتنورة دانتيل شفافة حتى الأرض.",
      ru: "Платье без бретелей с кружевным корсетом, вырезами на талии, сборкой на бёдрах и прозрачной кружевной юбкой в пол."
    }
  },
  {
    slug: "noir-sequin-drape-gown", price: 1390, isNew: true, categories: ["maxi"], group: "sequin-drape",
    sizes: SIZES, soldOut: [], images: photo("noir-sequin-drape-gown").concat(studio("noir-sequin-drape-gown")),
    name: { he: "שמלת פאייטים שחורה עם שסע", en: "Black Sequin Draped Gown", ar: "فستان ترتر أسود بفتحة", ru: "Чёрное платье с пайетками" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "שמלת סטרפלס ארוכה רקומה פאייטים שחורים, עם מחשוף קאול, כיווצים בירך, שסע גבוה ושובל קצר.",
      en: "Long strapless gown covered in black sequins, with a soft cowl neckline, gathering at the hip, a high slit and a short train.",
      ar: "فستان طويل بلا حمّالات مغطّى بالترتر الأسود، بفتحة صدر منسدلة وكشكشة عند الورك وفتحة عالية وذيل قصير.",
      ru: "Длинное платье без бретелей, расшитое чёрными пайетками, с мягким вырезом-хомутом, сборкой на бедре, высоким разрезом и небольшим шлейфом."
    }
  },
  {
    slug: "plum-satin-sparkle-gown", price: 1490, isNew: true, categories: ["maxi", "couture"],
    sizes: SIZES, soldOut: [], images: photo("plum-satin-sparkle-gown").concat(studio("plum-satin-sparkle-gown")),
    name: { he: "שמלת סאטן שזיף נוצצת", en: "Plum Satin Sparkle Gown", ar: "فستان ساتان برقوقي لامع", ru: "Сливовое атласное платье с блеском" },
    color: { he: "שזיף", en: "Plum", ar: "برقوقي", ru: "Сливовый" },
    description: {
      he: "מחוך סאטן בגוון שזיף עם מחשוף עלי כותרת נוצץ, יחד עם חצאית ארוכה רקומה נצנצים ושסע גבוה.",
      en: "Plum satin corset with a sparkling petal neckline, over a long sequin-embroidered skirt with a high slit.",
      ar: "كورسيه من الساتان البرقوقي بفتحة صدر لامعة على شكل بتلات، مع تنورة طويلة مطرّزة بالترتر وفتحة عالية.",
      ru: "Атласный корсет сливового цвета со сверкающим вырезом-лепестками и длинная юбка, расшитая пайетками, с высоким разрезом."
    }
  },
  {
    slug: "noir-zip-gown", price: 890, isNew: true, categories: ["maxi", "modest"], group: "zip-gown",
    sizes: SIZES, soldOut: [], images: photo("noir-zip-gown").concat(studio("noir-zip-gown")),
    name: { he: "שמלת זיפ שחורה", en: "Black Zip Gown", ar: "فستان السحّاب الأسود", ru: "Чёрное платье с молнией" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "שמלה ארוכה עם צווארון גבוה ושרוולים ארוכים, כיווצים במותן ורוכסן זהב אלכסוני שנפתח לשסע.",
      en: "Long gown with a high neck and long sleeves, ruching at the waist and a diagonal gold zip that opens into a slit.",
      ar: "فستان طويل بياقة عالية وأكمام طويلة، مع كشكشة عند الخصر وسحّاب ذهبي مائل ينفتح على فتحة.",
      ru: "Длинное платье с высоким воротом и длинными рукавами, сборкой на талии и диагональной золотой молнией, переходящей в разрез."
    }
  },
  {
    slug: "pearl-trim-suit", price: 980, isNew: true, categories: ["suits"],
    sizes: SIZES, soldOut: [], images: photo("pearl-trim-suit").concat(studio("pearl-trim-suit")),
    name: { he: "חליפת פנינים לבנה", en: "Pearl Trim Suit", ar: "بدلة بيضاء بحواف لؤلؤ", ru: "Белый костюм с жемчугом" },
    color: { he: "לבן", en: "White", ar: "أبيض", ru: "Белый" },
    description: {
      he: "בלייזר מחויט בכפתור אחד עם דש ושפת כיסים רקומים פנינים, יחד עם מכנסיים מתרחבים בגזרה גבוהה.",
      en: "Tailored one-button blazer with pearl-trimmed lapels and pocket flaps, paired with high-waisted wide-leg trousers.",
      ar: "سترة مفصّلة بزر واحد مع ياقة وجيوب مزيّنة باللؤلؤ، مع بنطال واسع بخصر عالٍ.",
      ru: "Приталенный пиджак на одной пуговице с жемчужной отделкой лацканов и клапанов карманов, в паре с широкими брюками с высокой талией."
    }
  },
  {
    slug: "gold-sequin-drape-mini", price: 760, isNew: true, categories: ["short"],
    sizes: SIZES, soldOut: [], images: photo("gold-sequin-drape-mini").concat(studio("gold-sequin-drape-mini")),
    name: { he: "מיני פאייטים זהב עם שובל", en: "Gold Sequin Drape Mini", ar: "فستان قصير بالترتر الذهبي", ru: "Золотое мини-платье с пайетками" },
    color: { he: "זהב", en: "Gold", ar: "ذهبي", ru: "Золотой" },
    description: {
      he: "שמלת מיני סטרפלס בגזרת לב, רקומה פאייטים זהובים, עם כיווצים בצד ושובל בד נשפך.",
      en: "Strapless sweetheart mini covered in gold sequins, gathered at the side into a long falling drape.",
      ar: "فستان قصير بلا حمّالات بفتحة على شكل قلب، مغطّى بالترتر الذهبي، مع كشكشة جانبية تنتهي بقماش طويل منسدل.",
      ru: "Мини-платье без бретелей с вырезом-сердечком, расшитое золотыми пайетками, со сборкой сбоку и длинной ниспадающей драпировкой."
    }
  },
  {
    slug: "white-bubble-mini", price: 590, isNew: true, categories: ["short"],
    sizes: SIZES, soldOut: [], images: photo("white-bubble-mini").concat(studio("white-bubble-mini")),
    name: { he: "שמלת מיני בלון לבנה", en: "White Bubble Mini", ar: "فستان قصير أبيض منفوش", ru: "Белое мини-платье «Баллон»" },
    color: { he: "לבן", en: "White", ar: "أبيض", ru: "Белый" },
    description: {
      he: "שמלת סטרפלס עם מחוך סאטן בגזרת לב וחצאית בלון קצרה ומלאה.",
      en: "Strapless satin corset dress with a sweetheart neckline and a full, short bubble skirt.",
      ar: "فستان من الساتان بلا حمّالات بكورسيه وفتحة على شكل قلب وتنورة قصيرة منفوشة.",
      ru: "Атласное платье-корсет без бретелей с вырезом-сердечком и пышной короткой юбкой-баллон."
    }
  },
  {
    slug: "ice-blue-shimmer-midi", price: 650, isNew: true, categories: ["short"],
    sizes: SIZES, soldOut: [], images: photo("ice-blue-shimmer-midi").concat(studio("ice-blue-shimmer-midi")),
    name: { he: "שמלת מידי נוצצת תכלת", en: "Ice Blue Shimmer Midi", ar: "فستان ميدي لامع أزرق جليدي", ru: "Мерцающее платье миди «Лёд»" },
    color: { he: "תכלת קרח", en: "Ice blue", ar: "أزرق جليدي", ru: "Ледяной голубой" },
    description: {
      he: "שמלת מידי מבד מנצנץ עם כתפיות דקות, מחשוף קאול רך וחצאית מתרחבת.",
      en: "Shimmering midi dress with thin straps, a soft cowl neckline and a full flared skirt.",
      ar: "فستان ميدي من قماش لامع بحمّالات رفيعة وفتحة صدر منسدلة وتنورة واسعة.",
      ru: "Мерцающее платье миди на тонких бретелях, с мягким вырезом-хомутом и пышной расклёшенной юбкой."
    }
  },
  {
    slug: "blush-lace-corset-gown", price: 1290, isNew: false, categories: ["maxi", "couture"], group: "lace-corset",
    sizes: SIZES, soldOut: [], images: photo("blush-lace-corset-gown").concat(studio("blush-lace-corset-gown")),
    name: { he: "שמלת מחוך תחרה ורודה", en: "Blush Lace Corset Gown", ar: "فستان كورسيه دانتيل وردي", ru: "Кружевное платье-корсет «Пудра»" },
    color: { he: "ורוד", en: "Blush", ar: "وردي", ru: "Пудровый" },
    description: {
      he: "שמלת מחוך התחרה בגוון ורוד עדין: מחוך מובנה, פתחים במותן וחצאית תחרה שקופה עד הרצפה.",
      en: "Our lace corset gown in soft blush: a structured corset, waist cut-outs and a sheer lace skirt to the floor.",
      ar: "فستان الكورسيه الدانتيل باللون الوردي الناعم: كورسيه مشدود وفتحات عند الخصر وتنورة دانتيل شفافة حتى الأرض.",
      ru: "Наше кружевное платье-корсет в нежном пудровом цвете: корсет, вырезы на талии и прозрачная кружевная юбка в пол."
    }
  },
  {
    slug: "cocoa-lace-corset-gown", price: 1290, isNew: false, categories: ["maxi", "couture"], group: "lace-corset",
    sizes: SIZES, soldOut: [], images: photo("cocoa-lace-corset-gown").concat(studio("cocoa-lace-corset-gown")),
    name: { he: "שמלת מחוך תחרה קקאו", en: "Cocoa Lace Corset Gown", ar: "فستان كورسيه دانتيل كاكاو", ru: "Кружевное платье-корсет «Какао»" },
    color: { he: "קקאו", en: "Cocoa", ar: "كاكاو", ru: "Какао" },
    description: {
      he: "שמלת מחוך התחרה בגוון קקאו חם: מחוך מובנה, כיווצים בירך וחצאית תחרה שקופה עד הרצפה.",
      en: "Our lace corset gown in warm cocoa: a structured corset, ruched hips and a sheer lace skirt to the floor.",
      ar: "فستان الكورسيه الدانتيل بلون الكاكاو الدافئ: كورسيه مشدود وكشكشة عند الورك وتنورة دانتيل شفافة حتى الأرض.",
      ru: "Наше кружевное платье-корсет тёплого цвета какао: корсет, сборка на бёдрах и прозрачная кружевная юбка в пол."
    }
  },
  {
    slug: "lavender-beaded-gown", price: 1890, isNew: false, categories: ["maxi", "couture"],
    sizes: SIZES, soldOut: [], images: photo("lavender-beaded-gown").concat(studio("lavender-beaded-gown")),
    name: { he: "שמלת חרוזים לבנדר", en: "Lavender Beaded Gown", ar: "فستان مطرّز بالخرز بلون الخزامى", ru: "Расшитое бисером платье «Лаванда»" },
    color: { he: "לבנדר אפור", en: "Lavender grey", ar: "رمادي خزامي", ru: "Серо-лавандовый" },
    description: {
      he: "שמלת בת ים עם מחשוף V עמוק, רקומה כולה חרוזי כסף בדוגמה גאומטרית, עם שובל טול.",
      en: "Mermaid gown with a deep V neckline, embroidered all over in silver beads in a geometric pattern, finished with a tulle train.",
      ar: "فستان بقصّة حورية البحر بفتحة V عميقة، مطرّز بالكامل بخرز فضي بنقشة هندسية، مع ذيل من التول.",
      ru: "Платье-русалка с глубоким V-образным вырезом, полностью расшитое серебряным бисером с геометрическим узором, со шлейфом из тюля."
    }
  },
  {
    slug: "gilded-brocade-corset-gown", price: 1190, isNew: false, categories: ["maxi"],
    sizes: SIZES, soldOut: [], images: photo("gilded-brocade-corset-gown").concat(studio("gilded-brocade-corset-gown")),
    name: { he: "שמלת מחוך ברוקד זהב", en: "Gilded Brocade Corset Gown", ar: "فستان كورسيه بروكار ذهبي", ru: "Платье с корсетом из золотой парчи" },
    color: { he: "שחור וזהב", en: "Black & gold", ar: "أسود وذهبي", ru: "Чёрный с золотом" },
    description: {
      he: "מחוך ברוקד שחור-זהב בגזרת לב, עם חצאית סאטן שחורה צמודה ושסע גבוה.",
      en: "Black and gold brocade corset with a sweetheart neckline, above a fitted black satin skirt with a high slit.",
      ar: "كورسيه بروكار أسود وذهبي بفتحة على شكل قلب، مع تنورة ساتان سوداء ضيقة وفتحة عالية.",
      ru: "Корсет из чёрно-золотой парчи с вырезом-сердечком и облегающая чёрная атласная юбка с высоким разрезом."
    }
  },
  {
    slug: "pearl-satin-mini", price: 620, isNew: true, categories: ["short"],
    sizes: SIZES, soldOut: [], images: photo("pearl-satin-mini").concat(studio("pearl-satin-mini")),
    name: { he: "שמלת מיני סאטן פנינה", en: "Pearl Satin Mini", ar: "فستان قصير من الساتان اللؤلؤي", ru: "Мини-платье из жемчужного атласа" },
    color: { he: "לבן פנינה", en: "Pearl white", ar: "أبيض لؤلؤي", ru: "Жемчужно-белый" },
    description: {
      he: "שמלת מיני סטרפלס מסאטן מבריק, עם מחוך בקפלים אלכסוניים וחצאית מתרחבת.",
      en: "Strapless mini in lustrous satin, with a diagonally pleated bodice and a full flared skirt.",
      ar: "فستان قصير بلا حمّالات من الساتان اللامع، بصدرية بطيّات مائلة وتنورة واسعة.",
      ru: "Мини-платье без бретелей из блестящего атласа, с лифом в диагональных складках и пышной расклёшенной юбкой."
    }
  },
  {
    slug: "sky-chiffon-gown", price: 840, isNew: false, categories: ["maxi"],
    sizes: SIZES, soldOut: [], images: photo("sky-chiffon-gown").concat(studio("sky-chiffon-gown")),
    name: { he: "שמלת שיפון תכלת עם שסע", en: "Sky Chiffon Gown", ar: "فستان شيفون أزرق سماوي", ru: "Голубое шифоновое платье" },
    color: { he: "תכלת", en: "Sky blue", ar: "أزرق سماوي", ru: "Небесно-голубой" },
    description: {
      he: "שמלת סטרפלס ארוכה מבד שיפון, עם מחוך מכווץ בגזרת לב, חצאית נשפכת ושסע גבוה.",
      en: "Long strapless chiffon gown with a gathered sweetheart corset, a flowing skirt and a high slit.",
      ar: "فستان شيفون طويل بلا حمّالات بكورسيه مكشكش على شكل قلب، وتنورة منسدلة وفتحة عالية.",
      ru: "Длинное шифоновое платье без бретелей с присборенным корсетом-сердечком, струящейся юбкой и высоким разрезом."
    }
  },
  {
    slug: "lace-sleeve-jumpsuit", price: 690, isNew: false, categories: ["jumpsuits"],
    sizes: SIZES, soldOut: [], images: photo("lace-sleeve-jumpsuit").concat(studio("lace-sleeve-jumpsuit")),
    name: { he: "אוברול תחרה שחור", en: "Lace Sleeve Jumpsuit", ar: "جمبسوت أسود بأكمام دانتيل", ru: "Чёрный комбинезон с кружевом" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "אוברול עם מחוך ושרוולים מתחרה שקופה, צווארון גבוה עם פתח מעוצב ומכנסיים רחבים.",
      en: "Jumpsuit with a lace bodice and sheer lace sleeves, a high collar with a shaped cut-out and wide-leg trousers.",
      ar: "جمبسوت بصدرية وأكمام من الدانتيل الشفاف، وياقة عالية بفتحة مصمّمة وبنطال واسع.",
      ru: "Комбинезон с кружевным лифом и прозрачными кружевными рукавами, высоким воротником с фигурным вырезом и широкими брюками."
    }
  },
  {
    slug: "beaded-fringe-suit", price: 1050, isNew: false, categories: ["suits"],
    sizes: SIZES, soldOut: [], images: photo("beaded-fringe-suit").concat(studio("beaded-fringe-suit")),
    name: { he: "חליפה שחורה עם חרוזים", en: "Beaded Fringe Suit", ar: "بدلة سوداء بشراشيب الخرز", ru: "Чёрный костюм с бисерной бахромой" },
    color: { he: "שחור", en: "Black", ar: "أسود", ru: "Чёрный" },
    description: {
      he: "בלייזר שחור עם צווארון שאל משובץ חרוזים ושרוולי תחרה עם פרנזים מחרוזים, יחד עם מכנסיים ישרים.",
      en: "Black blazer with a beaded shawl collar and lace cuffs finished in beaded fringe, paired with straight trousers.",
      ar: "سترة سوداء بياقة شال مطرّزة بالخرز وأساور من الدانتيل تنتهي بشراشيب من الخرز، مع بنطال مستقيم.",
      ru: "Чёрный пиджак с расшитым бисером воротником-шалью и кружевными манжетами с бисерной бахромой, в паре с прямыми брюками."
    }
  }
];

/* Example sale, promo code and stock limit so the preview shows these features.
   On the live site all of this comes from the database and the WhatsApp bot. */
Oscar.sampleSales = [
  {
    id: 1, active: true, percentOff: 15, amountOff: null, scope: "products",
    productSlugs: ["sky-chiffon-gown", "lavender-beaded-gown"], categories: [], code: null, showBanner: true,
    startsAt: null, endsAt: null,
    title: { he: "15% הנחה על שמלות נבחרות", en: "15% off selected gowns", ar: "خصم 15% على فساتين مختارة", ru: "Скидка 15% на избранные платья" }
  },
  {
    id: 2, active: true, percentOff: 10, amountOff: null, scope: "all", productSlugs: [], categories: [], code: "OSCAR10", showBanner: false,
    startsAt: null, endsAt: null,
    title: { he: "10% הנחה עם קוד", en: "10% off with a code", ar: "خصم 10% بالكود", ru: "Скидка 10% по коду" }
  }
];
(function () {
  var plum = Oscar.sampleProducts.filter(function (p) { return p.slug === "plum-satin-sparkle-gown"; })[0];
  if (plum) plum.stockTotal = 2;
  var blush = Oscar.sampleProducts.filter(function (p) { return p.slug === "blush-lace-corset-gown"; })[0];
  if (blush) blush.stock = { "36": 1, "38": 2, "44": 0 };
})();

Oscar.sampleSettings = {
  announcement: null,
  theme: null,
  hero_products: null,
  hero_banner: null,
  fitting_product: null,
  hours: null,
  preview_mode: null,
  low_stock_default: 3,
  accessibility_contact: null,
  policies: null
};

/* Data access. Uses Supabase when configured, otherwise the samples above.
   Tables: products, sales, site_settings (see oscar-bot/supabase/migrations). */
Oscar.data = {
  products: [],
  sales: [],
  settings: {},
  source: "sample",

  load: function () {
    var cfg = Oscar.config.supabase || {};
    function useSamples() {
      Oscar.data.products = Oscar.sampleProducts.slice();
      Oscar.data.sales = Oscar.sampleSales.slice();
      Oscar.data.settings = Object.assign({}, Oscar.sampleSettings);
      Oscar.data.source = "sample";
      return Oscar.data.products;
    }
    if (!cfg.url || !cfg.anonKey) return Promise.resolve(useSamples());
    var base = cfg.url.replace(/\/$/, "") + "/rest/v1/";
    var headers = Oscar.data.headers(cfg.anonKey);
    function get(path) {
      return fetch(base + path, { headers: headers }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
    }
    return Promise.all([
      get("products?select=*&order=sort_order.asc,id.asc"),
      get("sales?select=*"),
      get("site_settings?select=key,value")
    ]).then(function (res) {
      Oscar.data.products = res[0].map(Oscar.data.fromRow);
      Oscar.data.sales = res[1].map(Oscar.data.saleFromRow);
      var settings = {};
      res[2].forEach(function (r) { settings[r.key] = r.value; });
      Oscar.data.settings = settings;
      Oscar.data.source = "supabase";
      return Oscar.data.products;
    }).catch(function (err) {
      console.warn("OSCAR: could not load from Supabase, showing samples.", err);
      return useSamples();
    });
  },

  fromRow: function (r) {
    function lang(prefix) { return { he: r[prefix + "_he"], en: r[prefix + "_en"], ar: r[prefix + "_ar"], ru: r[prefix + "_ru"] }; }
    return {
      id: r.id || null, slug: r.slug, price: Number(r.price_ils) || 0, isNew: !!r.is_new,
      categories: r.categories || [], sizes: r.sizes || [], soldOut: r.sold_out || [],
      stock: r.stock || {}, stockTotal: r.stock_total === null || r.stock_total === undefined ? null : Number(r.stock_total),
      lowStockThreshold: r.low_stock_threshold === null || r.low_stock_threshold === undefined ? 3 : Number(r.low_stock_threshold),
      group: r.design_group || "", images: r.images || [],
      art: r.art || { shape: "column", dress: "#1B2140", backdrop: ["#F3EBE2", "#DCCBB9"] },
      name: lang("name"), color: lang("color"), description: lang("description")
    };
  },

  saleFromRow: function (r) {
    return {
      id: r.id, active: r.active !== false, percentOff: r.percent_off === null ? null : Number(r.percent_off),
      amountOff: r.amount_off_ils === null ? null : Number(r.amount_off_ils), scope: r.scope || "all",
      categories: r.categories || [], productSlugs: r.product_slugs || [], code: r.code || null,
      showBanner: r.show_banner !== false, startsAt: r.starts_at || null, endsAt: r.ends_at || null,
      title: { he: r.title_he, en: r.title_en, ar: r.title_ar, ru: r.title_ru }
    };
  },

  /* Checks a promo code. Returns a sale object, or null when the code isn't valid. */
  checkCode: function (code) {
    code = String(code || "").trim().toUpperCase();
    if (!code) return Promise.resolve(null);
    var cfg = Oscar.config.supabase || {};
    if (Oscar.data.source !== "supabase" || !cfg.url) {
      var s = Oscar.data.sales.filter(function (x) { return x.code && x.code.toUpperCase() === code && Oscar.pricing.running(x); })[0];
      return Promise.resolve(s || null);
    }
    return fetch(cfg.url.replace(/\/$/, "") + "/rest/v1/rpc/check_promo_code", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, Oscar.data.headers(cfg.anonKey)),
      body: JSON.stringify({ p_code: code })
    }).then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) { return rows && rows[0] ? Oscar.data.saleFromRow(Object.assign({ active: true }, rows[0])) : null; })
      .catch(function () { return null; });
  },

  /* New Supabase keys (sb_publishable_...) go in the apikey header only; older JWT keys ("eyJ...") also go in Authorization. */
  headers: function (key) {
    var h = { apikey: key };
    if (/^eyJ/.test(key)) h.Authorization = "Bearer " + key;
    return h;
  },

  setting: function (key, fallback) {
    var v = Oscar.data.settings ? Oscar.data.settings[key] : undefined;
    return v === undefined || v === null ? fallback : v;
  },

  activeCategories: function () {
    return Oscar.categories.filter(function (c) { return Oscar.data.inCategory(c.id).length > 0; });
  },

  siblings: function (p) {
    if (!p.group) return [];
    return Oscar.data.products.filter(function (x) { return x.group === p.group; });
  },

  bySlug: function (slug) {
    for (var i = 0; i < Oscar.data.products.length; i++) if (Oscar.data.products[i].slug === slug) return Oscar.data.products[i];
    return null;
  },

  category: function (id) {
    for (var i = 0; i < Oscar.categories.length; i++) if (Oscar.categories[i].id === id) return Oscar.categories[i];
    return null;
  },

  /* A parent category (evening dresses) also holds everything in its sub-categories. */
  inCategory: function (cat) {
    if (!cat || cat === "all") return Oscar.data.products.slice();
    var c = Oscar.data.category(cat), ids = [cat].concat(c && c.children ? c.children : []);
    return Oscar.data.products.filter(function (p) {
      return p.categories.some(function (x) { return ids.indexOf(x) !== -1; });
    });
  }
};
