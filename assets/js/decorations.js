/* OSCAR Boutique — holiday decorations: a few seconds of gently falling sparkles, snow, stars,
   confetti, petals or hearts over the home page photo. Off when the visitor prefers less motion. */
window.Oscar = window.Oscar || {};

Oscar.decorations = (function () {
  var active = null;
  var DURATION = 14000, FADE = 2200;

  function palette(type, accent) {
    switch (type) {
      case "snow": return ["#FFFFFF", "#EEF3FF"];
      case "sparkle": return ["#F6D77A", "#FFFFFF", accent || "#F6D77A"];
      case "stars": return ["#F6D77A", "#FFF3C4"];
      case "confetti": return [accent || "#F6D77A", "#F6D77A", "#FFFFFF", "#E8B4C8"];
      case "petals": return ["#F7D6DF", "#FBE9EE", "#FFFFFF"];
      case "hearts": return ["#E04A7A", "#F7A8C0", "#FFFFFF"];
      default: return ["#FFFFFF"];
    }
  }

  function star(ctx, r, points, inner) {
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var rad = i % 2 === 0 ? r : r * inner;
      var a = (Math.PI / points) * i - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill();
  }

  function heart(ctx, r) {
    ctx.beginPath();
    ctx.moveTo(0, r * 0.35);
    ctx.bezierCurveTo(-r, -r * 0.35, -r * 0.45, -r * 1.05, 0, -r * 0.45);
    ctx.bezierCurveTo(r * 0.45, -r * 1.05, r, -r * 0.35, 0, r * 0.35);
    ctx.fill();
  }

  function stop() {
    if (!active) return;
    cancelAnimationFrame(active.raf);
    window.removeEventListener("resize", active.resize);
    if (active.canvas.parentNode) active.canvas.parentNode.removeChild(active.canvas);
    active = null;
  }

  function start(host, type, accent) {
    stop();
    if (!host || !type || type === "none" || !Oscar.motionOK()) return;
    var canvas = document.createElement("canvas");
    canvas.className = "deco-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, host.querySelector(".hero-copy"));
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    function resize() {
      var r = host.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    }
    resize();
    var colors = palette(type, accent);
    var count = type === "confetti" ? 46 : 32;
    function make(initial) {
      var base = type === "snow" ? 2 + Math.random() * 3 : type === "sparkle" ? 2 + Math.random() * 3 : 4 + Math.random() * 5;
      return {
        x: Math.random() * canvas.width,
        y: initial ? -Math.random() * canvas.height : -24 * dpr,
        r: base * dpr,
        vy: (0.45 + Math.random() * 0.7) * dpr,
        vx: (Math.random() - 0.5) * 0.4 * dpr,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.04,
        tw: Math.random() * 6.28,
        c: colors[Math.floor(Math.random() * colors.length)]
      };
    }
    var parts = [];
    for (var i = 0; i < count; i++) parts.push(make(true));
    var t0 = performance.now();

    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      switch (type) {
        case "snow": ctx.globalAlpha *= 0.9; ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 6.283); ctx.fill(); break;
        case "sparkle": var s = p.r * (0.6 + 0.4 * Math.sin(p.tw)); star(ctx, s * 2, 4, 0.28); break;
        case "stars": star(ctx, p.r, 5, 0.45); break;
        case "confetti": ctx.fillRect(-p.r * 0.8, -p.r * 0.35, p.r * 1.6, p.r * 0.7); break;
        case "petals": ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.283); ctx.fill(); break;
        case "hearts": heart(ctx, p.r); break;
      }
      ctx.restore();
    }

    function frame(now) {
      var t = now - t0;
      var alpha = t > DURATION ? Math.max(0, 1 - (t - DURATION) / FADE) : 1;
      if (alpha <= 0) { stop(); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy; p.x += p.vx + Math.sin(p.y / (45 * dpr)) * 0.35 * dpr; p.rot += p.vr; p.tw += 0.09;
        if (p.y > canvas.height + 24 * dpr && t < DURATION) parts[i] = make(false);
        draw(p);
      }
      active.raf = requestAnimationFrame(frame);
    }
    active = { canvas: canvas, raf: requestAnimationFrame(frame), resize: resize };
    window.addEventListener("resize", resize);
  }

  return { start: start, stop: stop };
})();
