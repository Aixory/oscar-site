/* OSCAR Boutique — placeholder dress illustrations.
   Each sample dress is drawn on a dress form inside an arched boutique mirror.
   As soon as a product has real photos (product.images), those are shown instead. */
window.Oscar = window.Oscar || {};

Oscar.art = (function () {
  var uid = 0;

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(hex, target, amt) {
    var a = hexToRgb(hex), b = hexToRgb(target);
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * amt); });
    return "#" + c.map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join("");
  }
  function luminance(hex) {
    var c = hexToRgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  var FORM_TOP = '<rect x="141" y="50" width="18" height="24" rx="4" fill="{form}"/>' +
    '<ellipse cx="150" cy="50" rx="11" ry="3.6" fill="{brass}"/><circle cx="150" cy="44.5" r="3.6" fill="{brass}"/>';
  var SHOULDERS = '<path d="M141 70 Q122 74 108 84 Q100 90 102 104 L198 104 Q200 90 192 84 Q178 74 159 70 Z" fill="{form}"/>';
  var STAND = '<rect x="148.5" y="330" width="3" height="40" fill="{brass}"/><ellipse cx="150" cy="371" rx="26" ry="4" fill="{brassDark}"/>';

  var SHAPES = {
    zip: function (c) {
      var body = "M136 68 Q150 72 164 68 L168 76 Q190 80 194 94 Q191 118 186 130 Q177 148 178 156 Q193 182 190 204 Q182 262 176 300 Q186 338 206 364 L94 364 Q114 338 124 300 Q118 262 110 204 Q107 182 122 156 Q123 148 114 130 Q109 118 106 94 Q110 80 132 76 Z";
      return STAND +
        '<path d="M194 94 Q206 132 209 186 L199 188 Q194 146 186 116 Z" fill="' + c.dressDark + '"/>' +
        '<path d="M106 94 Q94 132 91 186 L101 188 Q106 146 114 116 Z" fill="' + c.dressDark + '"/>' +
        '<path d="' + body + '" fill="' + c.dress + '"/>' +
        '<path d="' + body + '" fill="url(#' + c.sheen + ')"/>' +
        '<path d="M171 300 Q176 334 186 364 L166 364 Q168 334 171 300 Z" fill="' + c.form + '"/>' +
        '<g fill="none" stroke="' + c.fold + '" stroke-width="1.2" stroke-linecap="round">' +
        '<path d="M126 168 Q150 178 174 170"/><path d="M120 186 Q150 196 182 186"/><path d="M118 204 Q148 212 186 204"/></g>' +
        '<path d="M158 150 Q166 226 171 300" fill="none" stroke="' + c.accent + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M158 150 Q166 226 171 300" fill="none" stroke="' + c.accent + '" stroke-width="5" stroke-dasharray="1.4 2.6" opacity=".55"/>' +
        '<circle cx="158" cy="150" r="2.4" fill="' + c.accent + '"/>' + FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass);
    },
    drape: function (c) {
      var body = "M110 102 Q150 96 190 102 Q187 128 180 150 Q194 184 190 206 Q186 286 198 364 L102 364 Q114 286 110 206 Q106 184 120 150 Q113 128 110 102 Z";
      return STAND + FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass) + SHOULDERS.replace("{form}", c.form) +
        '<path d="' + body + '" fill="' + c.dress + '"/>' +
        '<path d="' + body + '" fill="url(#' + c.sheen + ')"/>' +
        '<path d="M188 156 Q156 214 124 300 Q132 334 124 364 L152 364 Q150 300 190 210 Z" fill="#ffffff" opacity=".09"/>' +
        '<g fill="none" stroke="' + c.fold + '" stroke-width="1.1" stroke-linecap="round">' +
        '<path d="M114 112 Q150 120 186 112"/><path d="M116 124 Q150 132 184 124"/><path d="M118 136 Q150 143 182 136"/>' +
        '<path d="M182 168 Q160 220 138 290"/></g>';
    },
    mini: function (c) {
      var body = "M112 102 Q150 96 188 102 Q185 128 178 150 Q192 180 190 200 L194 250 Q172 262 150 254 Q128 262 106 250 L110 200 Q108 180 122 150 Q115 128 112 102 Z";
      return '<rect x="148.5" y="250" width="3" height="120" fill="' + c.brass + '"/><ellipse cx="150" cy="371" rx="26" ry="4" fill="' + c.brassDark + '"/>' +
        FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass) + SHOULDERS.replace("{form}", c.form) +
        '<path d="' + body + '" fill="' + c.dress + '"/>' +
        '<path d="' + body + '" fill="url(#' + c.sheen + ')"/>' +
        '<g fill="none" stroke-linecap="round"><path d="M190 204 Q164 226 134 256" stroke="' + c.fold + '" stroke-width="1.6"/>' +
        '<path d="M186 216 Q166 234 148 254" stroke="' + c.fold + '" stroke-width="1"/>' +
        '<path d="M122 150 Q150 158 178 150" stroke="' + c.fold + '" stroke-width="1.2"/></g>';
    },
    set: function (c) {
      var top = "M108 104 L162 74 Q186 78 192 96 Q189 126 182 150 L188 170 L112 170 L118 150 Q111 128 108 104 Z";
      return STAND + FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass) + SHOULDERS.replace("{form}", c.form) +
        '<path d="M118 192 L182 192 L184 250 L198 364 L156 364 L150 252 L144 364 L102 364 L116 250 Z" fill="' + c.dress + '"/>' +
        '<path d="M118 192 L182 192 L184 250 L198 364 L156 364 L150 252 L144 364 L102 364 L116 250 Z" fill="url(#' + c.sheen + ')"/>' +
        '<path d="' + top + '" fill="' + c.dress + '"/>' +
        '<path d="' + top + '" fill="url(#' + c.seq + ')"/>' +
        '<path d="M112 170 L188 170 L200 192 Q150 198 100 192 Z" fill="' + c.dressDark + '"/>' +
        '<g fill="none" stroke="' + c.fold + '" stroke-width="1"><path d="M132 200 L124 360"/><path d="M168 200 L176 360"/></g>';
    },
    ball: function (c) {
      var skirt = "M124 152 L176 152 Q228 248 254 364 L46 364 Q72 248 124 152 Z";
      return FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass) + SHOULDERS.replace("{form}", c.form) +
        '<path d="' + skirt + '" fill="' + c.dress + '"/>' +
        '<path d="' + skirt + '" fill="url(#' + c.sheen + ')"/>' +
        '<g fill="none" stroke="' + c.fold + '" stroke-width="1.2" stroke-linecap="round">' +
        '<path d="M138 160 Q116 260 92 362"/><path d="M150 158 Q148 260 150 362"/><path d="M162 160 Q184 260 208 362"/>' +
        '<path d="M130 158 Q96 250 66 360"/><path d="M170 158 Q204 250 234 360"/></g>' +
        '<path d="M114 106 Q130 96 150 106 Q170 96 186 106 Q183 130 176 152 L124 152 Q117 130 114 106 Z" fill="' + c.dress + '"/>' +
        '<path d="M124 152 L176 152" stroke="' + c.accent + '" stroke-width="2.4"/>';
    },
    column: function (c) {
      var body = "M116 100 Q150 104 184 100 Q182 128 176 150 Q190 186 188 208 L186 364 L114 364 L112 208 Q110 186 124 150 Q118 128 116 100 Z";
      return FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass) + SHOULDERS.replace("{form}", c.form) +
        '<g stroke="' + c.dress + '" stroke-width="2.4" stroke-linecap="round"><path d="M121 102 L129 76"/><path d="M179 102 L171 76"/></g>' +
        '<path d="' + body + '" fill="' + c.dress + '"/>' +
        '<path d="' + body + '" fill="url(#' + c.seq + ')"/>' +
        '<path d="' + body + '" fill="url(#' + c.sheen + ')"/>';
    },
    modest: function (c) {
      var body = "M136 68 Q150 72 164 68 L168 76 Q190 80 194 94 Q191 118 186 130 Q177 148 178 156 Q202 252 216 364 L84 364 Q98 252 122 156 Q123 148 114 130 Q109 118 106 94 Q110 80 132 76 Z";
      return '<path d="M194 94 Q208 140 216 200 L198 202 Q195 150 186 116 Z" fill="' + c.dressDark + '"/>' +
        '<path d="M106 94 Q92 140 84 200 L102 202 Q105 150 114 116 Z" fill="' + c.dressDark + '"/>' +
        '<path d="' + body + '" fill="' + c.dress + '"/>' +
        '<path d="' + body + '" fill="url(#' + c.sheen + ')"/>' +
        '<g fill="none" stroke="' + c.fold + '" stroke-width="1.1" stroke-linecap="round">' +
        '<path d="M140 164 Q126 260 110 362"/><path d="M160 164 Q174 260 190 362"/><path d="M150 166 L150 362"/></g>' +
        '<path d="M122 156 Q150 162 178 156" fill="none" stroke="' + c.fold + '" stroke-width="1.6"/>' +
        FORM_TOP.replace(/\{form\}/g, c.form).replace(/\{brass\}/g, c.brass);
    }
  };

  function sparkles(color) {
    var pts = [[72, 120], [226, 104], [96, 200], [214, 236], [80, 300], [232, 318], [120, 84], [190, 140]];
    return pts.map(function (p, i) {
      var r = i % 3 === 0 ? 1.6 : 1;
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '" fill="' + color + '" opacity="' + (i % 2 ? 0.55 : 0.85) + '"/>';
    }).join("");
  }

  /* view: "front" | "detail" | "look" */
  function svg(product, view, opts) {
    opts = opts || {};
    var a = product.art || {};
    var shape = SHAPES[a.shape] ? a.shape : "column";
    var id = "oa" + (++uid);
    var backdrop = (a.backdrop || ["#F3EBE2", "#DCCBB9"]).slice();
    var darkBack = luminance(backdrop[0]) < 0.2;
    if (view === "look") backdrop = darkBack ? ["#F1E4DA", "#D9B9AE"] : ["#232A52", "#0E1126"];
    var nowDark = luminance(backdrop[0]) < 0.2;
    var dress = a.dress || "#1B2140";
    var dressLum = luminance(dress);
    var c = {
      dress: dress,
      dressDark: mix(dress, "#000000", 0.18),
      fold: dressLum < 0.08 ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.16)",
      accent: a.accent || "#D4AF62",
      form: nowDark ? "#CBBBA7" : "#EADFD2",
      brass: "#B8955A",
      brassDark: "#7E6439",
      sheen: id + "s",
      seq: id + "q"
    };
    var vb = view === "detail" ? "82 46 136 181" : "0 0 300 400";
    var arch = '<path d="M58 400 V162 A92 92 0 0 1 242 162 V400" fill="' + (nowDark ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.32)") + '"' +
      ' stroke="' + (nowDark ? "#D4AF62" : "#B8955A") + '" stroke-opacity="' + (nowDark ? ".75" : ".6") + '" stroke-width="1.4"' +
      (opts.drawArch ? ' class="arch-draw" pathLength="1"' : "") + '/>';
    var label = opts.decorative ? ' aria-hidden="true" focusable="false"' :
      ' role="img" aria-label="' + Oscar.esc(Oscar.t("product.placeholderAlt", { name: Oscar.tx(product.name), color: Oscar.tx(product.color) })) + '"';
    return '<svg class="art-svg" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"' + label + '>' +
      '<defs>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + backdrop[0] + '"/><stop offset="1" stop-color="' + backdrop[1] + '"/></linearGradient>' +
      '<linearGradient id="' + c.sheen + '" x1="0" y1="0" x2="1" y2="0"><stop offset=".15" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".16"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<pattern id="' + c.seq + '" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".95" fill="' + (a.sequin || "#E9DDBF") + '" opacity=".75"/><circle cx="4.5" cy="4.5" r=".7" fill="' + (a.sequin || "#E9DDBF") + '" opacity=".45"/></pattern>' +
      '</defs>' +
      '<rect width="300" height="400" fill="url(#' + id + 'b)"/>' +
      arch +
      (nowDark ? sparkles("#E6C987") : "") +
      '<ellipse cx="150" cy="372" rx="78" ry="7" fill="#000" opacity=".14"/>' +
      SHAPES[shape](c).replace(/\{brassDark\}/g, c.brassDark).replace(/\{brass\}/g, c.brass) +
      '</svg>';
  }

  /* A product photo. Local photos come in two widths (-540 / -1080) so phones load the small one. */
  function photo(product, index, opts) {
    opts = opts || {};
    var esc = Oscar.esc;
    var src = product.images[index] || product.images[0];
    var small = /-1080\.webp$/.test(src) ? src.replace(/-1080\.webp$/, "-540.webp") : "";
    var alt = opts.decorative ? "" : Oscar.tx(product.name) + ", " + Oscar.tx(product.color);
    return '<img class="art-img" src="' + esc(src) + '"' +
      (small ? ' srcset="' + esc(small) + " 540w, " + esc(src) + ' 1080w" sizes="' + esc(opts.sizes || "50vw") + '"' : "") +
      ' width="1080" height="1440" alt="' + esc(alt) + '" decoding="async" loading="' + (opts.eager ? "eager" : "lazy") + '"' +
      (opts.eager ? ' fetchpriority="high"' : "") + ">";
  }

  /* Returns markup for a product image: the real photo when there is one, otherwise the illustration.
     view: a photo index (0, 1, 2…) or an illustration view ("front" | "detail" | "look"). */
  function render(product, view, opts) {
    if (product.images && product.images.length) return photo(product, typeof view === "number" ? view : 0, opts);
    return svg(product, typeof view === "string" ? view : "front", opts);
  }

  return { render: render, svg: svg, photo: photo };
})();
