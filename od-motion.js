/* OD Socials — shared motion engine  "RAW → OPTIMISED"
   Vanilla, no dependencies. Idempotent: call ODMotion.scan() after any re-render.
   Everything is progressive enhancement — content is visible without this file. */
(function () {
  "use strict";
  if (window.ODMotion) { window.ODMotion.scan(); return; }

  var cfg = window.ODMotionConfig || {};
  var C = {
    intensity: num(cfg.motionIntensity, 1),
    cursor: cfg.enableCursor !== false,
    loaderOnce: cfg.playLoaderOnce !== false,
    accent: cfg.accent || "#4C7DF0",
    accent2: cfg.accent2 || "#8FB6F5"
  };
  function num(v, d) { v = parseFloat(v); return isFinite(v) ? v : d; }

  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.connection && navigator.connection.saveData === true);

  function reduced() { return mqReduce.matches || C.intensity === 0; }
  function fine() { return mqFine.matches; }
  function K() { return C.intensity; }               // distance / parallax scale
  function D(ms) { return reduced() ? 1 : ms * (lowPower ? 0.5 : 1) / Math.max(0.35, C.intensity); }

  /* ------------------------------------------------------------ styles */
  var css = [
    ":root{--ease-out:cubic-bezier(.16,1,.3,1);--ease-snap:cubic-bezier(.7,0,.2,1);--ease-spring:cubic-bezier(.22,1.4,.36,1);",
    "--t-micro:180ms;--t-ui:420ms;--t-reveal:800ms;--t-hero:1400ms;--stagger:60ms;--v:0;--od-accent:" + C.accent + ";--od-accent-2:" + C.accent2 + ";}",
    "html.js [data-reveal]{--od-in:0}",
    "html.js [data-reveal='headline']{clip-path:inset(0 -20% -25% 0)}",
    "html.js [data-reveal='headline']>*,html.js [data-reveal='headline']{will-change:auto}",
    "[data-od-in='0'][data-reveal='block']{opacity:0;transform:translate3d(0," + (14 * K()) + "px,0)}",
    "[data-od-in='1'][data-reveal='block']{opacity:1;transform:none;transition:opacity var(--t-reveal) var(--ease-out),transform var(--t-reveal) var(--ease-out)}",
    "[data-od-in='0'][data-reveal='rise']{opacity:0;transform:translate3d(0," + (26 * K()) + "px,0) skewY(1.5deg)}",
    "[data-od-in='1'][data-reveal='rise']{opacity:1;transform:none;transition:opacity var(--t-reveal) var(--ease-out),transform var(--t-reveal) var(--ease-out)}",
    "[data-od-in='0'][data-reveal='rule']{transform:scaleX(0);transform-origin:left center}",
    "[data-od-in='1'][data-reveal='rule']{transform:scaleX(1);transform-origin:left center;transition:transform 900ms var(--ease-out)}",
    "[data-od-in='0'][data-develop]{filter:grayscale(1) contrast(.72) brightness(.55);opacity:.55;transform:scale(1.04)}",
    "[data-od-in='1'][data-develop]{filter:none;opacity:1;transform:none;transition:filter 900ms var(--ease-out),opacity 700ms var(--ease-out),transform 1100ms var(--ease-out)}",
    "button,a,[role='button']{-webkit-tap-highlight-color:transparent}",
    "[data-od-face='back'][data-od-open='false']{visibility:hidden;transition:visibility 0s linear 380ms}",
    "[data-od-face='front'][data-od-open='true']{visibility:hidden;transition:visibility 0s linear 380ms}",
    "[data-od-chip]{transition:background 220ms var(--ease-out),color 220ms var(--ease-out),border-color 220ms var(--ease-out),transform 260ms var(--ease-spring)}",
    "[data-od-chip][aria-pressed='true']{background:#F7F4ED;color:#0A0D14;border-color:#F7F4ED;transform:scale(1.04)}",
    "[data-od-chip-dark][aria-pressed='true']{background:#0A0D14;color:#F7F4ED;border-color:#0A0D14}",
    "html.js button:active,html.js [data-magnetic]:active{transform:scale(.97);transition:transform 90ms var(--ease-snap)}",
    ":focus-visible{outline:2px solid var(--od-accent-2);outline-offset:3px}",
    "[data-od-arrow]{display:inline-block;transition:transform var(--t-micro) var(--ease-out)}",
    "a[data-magnetic],button[data-magnetic]{white-space:nowrap}",
    "a:hover [data-od-arrow],button:hover [data-od-arrow]{transform:translate3d(" + (4 * K()) + "px,-" + (2 * K()) + "px,0)}",
    "@keyframes od-sweep{0%{transform:translate3d(-130%,0,0) rotate(14deg)}100%{transform:translate3d(260%,0,0) rotate(14deg)}}",
    "[data-od-sweep]{position:relative;overflow:hidden;isolation:isolate}",
    "[data-od-sweep]>.od-sweep{position:absolute;inset:-40% -10%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.34),transparent);width:38%;animation:od-sweep 1100ms var(--ease-out) both;z-index:1}",
    "#od-cursor{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;mix-blend-mode:difference}",
    "#od-cursor .od-dot{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#fff}",
    "#od-cursor .od-ring{position:absolute;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;border:1px solid rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font:500 8px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;color:#fff;transition:width 260ms var(--ease-out),height 260ms var(--ease-out),margin 260ms var(--ease-out),background 260ms var(--ease-out)}",
    "#od-cursor.is-label .od-ring{width:62px;height:62px;margin:-31px 0 0 -31px;background:rgba(255,255,255,.14)}",
    "#od-cursor.is-hidden{opacity:0}",
    "#od-progress{position:fixed;left:0;height:2px;background:var(--od-accent);z-index:9998;width:0;transform-origin:left center;pointer-events:none;transition:opacity 200ms linear}",
    "html.od-navhide [data-od-header]{transform:translate3d(0,-110%,0)}",
    "[data-od-header]{transition:transform 420ms var(--ease-out),padding 420ms var(--ease-out)}",
    "[data-od-marquee-paused]{animation-play-state:paused!important}",
    "@keyframes od-blink{0%,49%{opacity:1}50%,100%{opacity:0}}",
    ".od-caret{display:inline-block;width:.5em;height:1em;background:currentColor;vertical-align:-.12em;animation:od-blink 1.05s steps(1) infinite}",
    "@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:120ms!important;scroll-behavior:auto!important}#od-cursor{display:none}}",
    "@media print{#od-cursor,#od-progress{display:none!important}}"
  ].join("");

  var st = document.createElement("style");
  st.id = "od-motion-css";
  st.textContent = css;
  document.head.appendChild(st);
  document.documentElement.classList.add("js");
  if (lowPower) document.documentElement.classList.add("od-lowpower");

  /* ------------------------------------------------- scroll velocity --v */
  var lastY = window.scrollY, v = 0, vSmooth = 0, dir = 1, rafV = 0;
  function tickV() {
    rafV = 0;
    var y = window.scrollY;
    var raw = y - lastY;
    lastY = y;
    if (raw !== 0) dir = raw > 0 ? 1 : -1;
    v = Math.max(-1, Math.min(1, raw / 60));
    vSmooth += (v - vSmooth) * 0.18;
    if (Math.abs(vSmooth) < 0.001) vSmooth = 0;
    document.documentElement.style.setProperty("--v", (reduced() ? 0 : vSmooth).toFixed(3));
    document.documentElement.style.setProperty("--vdir", String(dir));
    if (Math.abs(vSmooth) > 0.0015) rafV = requestAnimationFrame(tickV);
  }
  function onScroll() {
    if (!rafV) rafV = requestAnimationFrame(tickV);
    navSync();
    progressSync();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  setInterval(function () { if (!rafV) rafV = requestAnimationFrame(tickV); }, 300);

  /* ------------------------------------------------------ intersection */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var el = en.target, ratio = en.intersectionRatio;
      var need = parseFloat(el.getAttribute("data-od-at")) || 0.12;
      var passed = !en.isIntersecting && en.boundingClientRect.bottom < 0;
      if ((ratio >= need || passed) && el.getAttribute("data-od-in") !== "1") {
        el.setAttribute("data-od-in", "1");
        fire(el);
        if (!el.hasAttribute("data-od-repeat")) io.unobserve(el);
      }
    });
  }, { threshold: [0, 0.12, 0.3, 0.6, 0.9] });

  /* looping animations pause when off-screen */
  var ioLoop = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var tracks = en.target.matches("[data-od-track],[data-sm-track]") ? [en.target] :
        en.target.querySelectorAll("[data-od-track],[data-sm-track]");
      Array.prototype.forEach.call(tracks, function (t) {
        if (en.isIntersecting) t.removeAttribute("data-od-marquee-paused");
        else t.setAttribute("data-od-marquee-paused", "");
      });
    });
  }, { threshold: 0 });

  document.addEventListener("visibilitychange", function () {
    var hidden = document.hidden;
    document.querySelectorAll("[data-od-track],[data-sm-track]").forEach(function (t) {
      if (hidden) t.setAttribute("data-od-marquee-paused", "");
      else t.removeAttribute("data-od-marquee-paused");
    });
  });

  function fire(el) {
    if (el.hasAttribute("data-reveal")) revealRun(el);
    if (el.hasAttribute("data-decode")) decode(el);
    if (el.hasAttribute("data-count")) countUp(el);
    if (el.hasAttribute("data-od-fire")) {
      var name = el.getAttribute("data-od-fire");
      (window.ODMotion.hooks[name] || noop)(el);
    }
  }
  function noop() {}

  /* --------------------------------------------------------- reveal */
  function revealRun(el) {
    var kind = el.getAttribute("data-reveal");
    if (kind !== "headline") return;
    var kids = Array.prototype.filter.call(el.children, function (c) { return c.nodeType === 1; });
    var targets = kids.length ? kids : [el];
    targets.forEach(function (c, i) {
      var isItalic = /Playfair/i.test(c.style.fontFamily || "") || c.hasAttribute("data-od-italic");
      var delay = (isItalic ? targets.length : i) * (reduced() ? 0 : 70);
      c.style.transition = "none";
      c.style.opacity = "0";
      c.style.transform = reduced() ? "none" : "translate3d(0,105%,0)" + (isItalic ? " skewY(4deg)" : "");
      requestAnimationFrame(function () {
        setTimeout(function () {
          c.style.transition = "opacity " + D(520) + "ms var(--ease-out)," + "transform " + D(800) + "ms var(--ease-out)";
          c.style.opacity = "1";
          c.style.transform = "none";
        }, delay);
      });
    });
  }

  /* --------------------------------------------------------- decode */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%·+=";
  function decode(el) {
    if (reduced() || el.__decoded) return;
    el.__decoded = true;
    var real = el.textContent;
    if (!real || real.length > 90) return;
    var start = performance.now(), dur = 400;
    var chars = real.split("");
    el.setAttribute("aria-label", real);
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var lock = Math.floor(p * chars.length);
      var out = "";
      for (var i = 0; i < chars.length; i++) {
        var ch = chars[i];
        out += (i < lock || ch === " " || ch === "\n") ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step); else el.textContent = real;
    }
    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------- odometer */
  function countUp(el) {
    if (el.__counted) return;
    el.__counted = true;
    var raw = el.getAttribute("data-count") || el.textContent;
    var m = String(raw).match(/^(\D*)([\d.,]+)(.*)$/);
    if (!m) return;
    var pre = m[1], target = parseFloat(m[2].replace(/,/g, "")), suf = m[3];
    var dec = (m[2].split(".")[1] || "").length;
    el.setAttribute("aria-label", raw);
    if (reduced()) { el.textContent = raw; return; }
    var t0 = performance.now(), dur = D(1100);
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var val = target * e;
      el.textContent = pre + val.toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = raw; if (el.hasAttribute("data-count-flash")) flash(el); }
    }
    requestAnimationFrame(step);
  }
  function flash(el) {
    el.style.transition = "opacity 140ms linear";
    el.style.opacity = "0.35";
    setTimeout(function () { el.style.opacity = "1"; }, 150);
  }

  /* --------------------------------------------------------- magnetic */
  var magnets = [];
  function magnetMove(e) {
    if (!fine() || reduced()) return;
    for (var i = 0; i < magnets.length; i++) {
      var el = magnets[i];
      var r = el.getBoundingClientRect();
      if (!r.width) continue;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var d = Math.hypot(dx, dy);
      if (d < 80 + Math.max(r.width, r.height) / 2) {
        var f = Math.min(1, 1 - d / (140 + r.width / 2)) * 8 * K();
        el.style.transform = "translate3d(" + (dx * 0.12).toFixed(2) + "px," + (dy * 0.18 - f * 0.2).toFixed(2) + "px,0)";
        el.style.transition = "transform 120ms linear";
      } else if (el.style.transform) {
        el.style.transform = "";
        el.style.transition = "transform 420ms var(--ease-out)";
      }
    }
  }

  /* ------------------------------------------------------------- tilt */
  var tilts = [];
  function tiltMove(e) {
    if (!fine() || reduced() || lowPower) return;
    for (var i = 0; i < tilts.length; i++) {
      var el = tilts[i], r = el.getBoundingClientRect();
      if (!r.width) continue;
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      var glare = el.__glare;
      if (!inside) {
        el.style.transform = "";
        el.style.transition = "transform 500ms var(--ease-out)";
        if (glare) glare.style.opacity = "0";
        continue;
      }
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      var amt = (parseFloat(el.getAttribute("data-tilt")) || 6) * K();
      el.style.transition = "transform 140ms linear";
      el.style.transform = "perspective(900px) rotateX(" + (-py * amt).toFixed(2) + "deg) rotateY(" + (px * amt).toFixed(2) + "deg)";
      if (glare) {
        glare.style.opacity = "1";
        glare.style.background = "radial-gradient(240px circle at " + ((px + 0.5) * 100).toFixed(1) + "% " + ((py + 0.5) * 100).toFixed(1) + "%,rgba(255,255,255,.28),transparent 62%)";
      }
    }
  }

  window.addEventListener("pointermove", function (e) {
    magnetMove(e); tiltMove(e); cursorMove(e);
    if (window.ODMotion.onPointer) window.ODMotion.onPointer(e);
  }, { passive: true });

  /* ----------------------------------------------------- custom cursor */
  var cur = null, ring = null, ringLabel = "", cx = -100, cy = -100, rx = -100, ry = -100, rafC = 0;
  function cursorInit() {
    if (cur || !C.cursor || !fine() || reduced()) return;
    cur = document.createElement("div");
    cur.id = "od-cursor";
    cur.innerHTML = '<div class="od-ring"><span></span></div><div class="od-dot"></div>';
    document.body.appendChild(cur);
    ring = cur.querySelector(".od-ring span");
    loopC();
  }
  function loopC() {
    rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
    if (cur) {
      cur.querySelector(".od-dot").style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      cur.querySelector(".od-ring").style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
    }
    rafC = requestAnimationFrame(loopC);
  }
  function cursorMove(e) {
    if (!cur) return;
    cx = e.clientX; cy = e.clientY;
    var t = e.target.closest ? e.target.closest("[data-cursor],input,textarea,select") : null;
    var label = "";
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) { cur.classList.add("is-hidden"); return; }
    cur.classList.remove("is-hidden");
    if (t) label = t.getAttribute("data-cursor") || "";
    if (label !== ringLabel) {
      ringLabel = label;
      ring.textContent = label;
      cur.classList.toggle("is-label", !!label);
    }
  }

  /* ------------------------------------------- nav: hide / progress / counter */
  var header = null, prevY = window.scrollY, bar = null;
  function progressSync() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    bar.style.width = (p * 100).toFixed(2) + "%";
    if (header) bar.style.top = Math.max(0, header.getBoundingClientRect().bottom) + "px";
  }
  function navSync() {
    var y = window.scrollY;
    if (header) {
      var down = y > prevY + 4, up = y < prevY - 4;
      if (down && y > 220) document.documentElement.classList.add("od-navhide");
      else if (up) document.documentElement.classList.remove("od-navhide");
    }
    if (Math.abs(y - prevY) > 2) prevY = y;
    sectionSync();
  }
  var counterEl = null, sections = [], lastIdx = -1;
  function sectionSync() {
    if (!counterEl || !sections.length) return;
    var mid = window.innerHeight * 0.4, idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= mid) idx = i;
    }
    var first = lastIdx === -1;
    if (idx === lastIdx) return;
    lastIdx = idx;
    counterEl.textContent = pad(idx + 1) + " / " + pad(sections.length);
    if (!first && !reduced()) { counterEl.__decoded = false; decode(counterEl); }
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ------------------------------------------------- periodic CTA sweep */
  var sweepers = [];
  setInterval(function () {
    if (reduced()) return;
    sweepers.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var s = document.createElement("span");
      s.className = "od-sweep";
      el.appendChild(s);
      setTimeout(function () { s.remove(); }, 1200);
    });
  }, 8000);

  /* ---------------------------------------------------------- scan */
  function scan() {
    header = document.querySelector("[data-od-header]");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "od-progress";
      document.body.appendChild(bar);
    }
    cursorInit();

    document.querySelectorAll("[data-reveal],[data-decode],[data-count],[data-develop],[data-od-fire]").forEach(function (el) {
      if (el.__obs) return;
      el.__obs = true;
      if (!el.hasAttribute("data-od-in")) el.setAttribute("data-od-in", "0");
      io.observe(el);
      var r0 = el.getBoundingClientRect();
      if (r0.top < window.innerHeight * 0.96 && r0.bottom > -40) {
        requestAnimationFrame(function () {
          if (el.getAttribute("data-od-in") === "1") return;
          el.setAttribute("data-od-in", "1");
          fire(el);
          if (!el.hasAttribute("data-od-repeat")) io.unobserve(el);
        });
      }
    });
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      if (magnets.indexOf(el) < 0) magnets.push(el);
    });
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      if (tilts.indexOf(el) >= 0) return;
      tilts.push(el);
      if (el.getAttribute("data-tilt-glare") !== "0") {
        var g = document.createElement("span");
        g.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 260ms ease;z-index:2;border-radius:inherit";
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        el.appendChild(g);
        el.__glare = g;
      }
    });
    document.querySelectorAll("[data-od-sweep]").forEach(function (el) {
      if (sweepers.indexOf(el) < 0) sweepers.push(el);
    });
    document.querySelectorAll("[data-od-rail],[data-sm-rail],[data-od-track],[data-sm-track]").forEach(function (el) {
      if (el.__loop) return; el.__loop = true; ioLoop.observe(el);
    });
    sweepPending();
    counterEl = document.querySelector("[data-od-counter]");
    sections = Array.prototype.slice.call(document.querySelectorAll("[data-od-section]"));
    lastIdx = -1;
    sectionSync();
    progressSync();
  }

  /* ---------------------------------- shared stories-style media viewer */
  function stories(items, start) {
    if (!items || !items.length) return;
    var i = Math.max(0, Math.min(items.length - 1, start || 0));
    var timer = 0, paused = false;
    var root = document.createElement("div");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Work viewer");
    root.tabIndex = -1;
    root.style.cssText = "position:fixed;inset:0;z-index:9990;background:rgba(6,8,13,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:calc(18px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom));opacity:0;transition:opacity 260ms var(--ease-out)";
    root.innerHTML =
      '<div style="position:relative;width:min(430px,100%);height:min(86vh,780px);display:flex;flex-direction:column;gap:10px">' +
        '<div data-bars style="display:flex;gap:4px;height:3px;flex:none"></div>' +
        '<div data-stage style="position:relative;flex:1;border-radius:14px;overflow:hidden;background:#0A0D14;border:1px solid rgba(247,244,237,.18)"></div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(247,244,237,.65);flex:none">' +
          '<span data-cap></span><span data-count></span>' +
        "</div>" +
      "</div>" +
      '<button data-close aria-label="Close viewer" style="position:absolute;top:calc(14px + env(safe-area-inset-top));right:14px;width:46px;height:46px;border-radius:999px;border:1px solid rgba(247,244,237,.35);background:transparent;color:#F7F4ED;font-family:monospace;font-size:16px;cursor:pointer">✕</button>';
    document.body.appendChild(root);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { root.style.opacity = "1"; root.focus(); });

    var bars = root.querySelector("[data-bars]");
    var stage = root.querySelector("[data-stage]");
    var cap = root.querySelector("[data-cap]");
    var count = root.querySelector("[data-count]");
    items.forEach(function () {
      var b = document.createElement("span");
      b.style.cssText = "flex:1;background:rgba(247,244,237,.25);border-radius:999px;overflow:hidden";
      b.innerHTML = '<span style="display:block;height:100%;width:0;background:#F7F4ED"></span>';
      bars.appendChild(b);
    });

    function close() {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      root.style.opacity = "0";
      setTimeout(function () { root.remove(); }, 260);
      document.removeEventListener("keydown", onKey);
    }
    function render() {
      var it = items[i];
      stage.innerHTML = '<img src="' + it.src + '" alt="' + (it.cap || "") + '" style="width:100%;height:100%;object-fit:cover;display:block">';
      cap.textContent = it.cap || "";
      count.textContent = (i + 1) + " / " + items.length;
      Array.prototype.forEach.call(bars.children, function (b, k) {
        var f = b.firstElementChild;
        f.style.transition = "none";
        f.style.width = k < i ? "100%" : "0";
      });
      if (reduced()) return;
      var f = bars.children[i].firstElementChild;
      requestAnimationFrame(function () {
        f.style.transition = "width 4200ms linear";
        f.style.width = "100%";
      });
      clearTimeout(timer);
      timer = setTimeout(next, 4200);
    }
    function next() { if (i < items.length - 1) { i++; render(); } else close(); }
    function prev() { if (i > 0) { i--; render(); } }
    function onKey(ev) {
      if (ev.key === "Escape") close();
      if (ev.key === "ArrowRight") next();
      if (ev.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    root.querySelector("[data-close]").addEventListener("click", close);
    stage.addEventListener("click", function (ev) {
      var r = stage.getBoundingClientRect();
      if (ev.clientX - r.left < r.width * 0.32) prev(); else next();
    });
    var y0 = null;
    stage.addEventListener("touchstart", function (ev) { y0 = ev.touches[0].clientY; }, { passive: true });
    stage.addEventListener("touchend", function (ev) {
      if (y0 !== null && ev.changedTouches[0].clientY - y0 > 70) close();
      y0 = null;
    }, { passive: true });
    render();
  }

  /* safety net: anything still unrevealed but visible gets fired */
  function sweepPending() {
    document.querySelectorAll('[data-od-in="0"]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.98 && r.bottom > -40 && (r.width || r.height)) {
        el.setAttribute("data-od-in", "1");
        fire(el);
        io.unobserve(el);
      }
    });
  }
  window.addEventListener("scroll", function () { sweepPending(); }, { passive: true });
  setInterval(sweepPending, 700);

  window.ODMotion = {
    config: C,
    sweep: sweepPending,
    stories: stories,
    hooks: {},
    scan: scan,
    reduced: reduced,
    fine: fine,
    lowPower: lowPower,
    intensity: K,
    dur: D,
    decode: decode,
    count: countUp,
    velocity: function () { return vSmooth; },
    direction: function () { return dir; }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
  window.addEventListener("load", scan);
})();
