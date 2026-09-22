/* Lantees Cafe & Bistro. Shared behaviour: helpers, cart state, header,
   reveal-on-scroll, opening hours, hero slideshow, rooms, dish rail, map. */
(function () {
  "use strict";
  const D = window.LANTEES;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmt = (n) => "₦" + Math.round(n).toLocaleString("en-NG");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function img(slug, alt, o) {
    o = o || {};
    const sizes = o.sizes || "(min-width: 56rem) 33vw, 100vw";
    return '<img src="assets/img/' + slug + '-960.jpg" srcset="assets/img/' + slug + '-480.jpg 480w, assets/img/' + slug + '-960.jpg 960w" sizes="' + sizes + '" alt="' + esc(alt) + '" loading="' + (o.eager ? "eager" : "lazy") + '" decoding="async" width="987" height="1431"' + (o.cls ? ' class="' + o.cls + '"' : "") + ">";
  }
  const icon = (n) => '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>';

  /* Menu lookups */
  const allItems = [];
  D.menu.forEach((sec) => sec.items.forEach((it) => { it.section = sec.id; allItems.push(it); }));
  const itemById = (id) => allItems.find((i) => i.id === id);
  const sectionOf = (item) => D.menu.find((s) => s.id === item.section);

  /* Time in Lagos */
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const toMin = (hhmm) => { const p = hhmm.split(":"); return +p[0] * 60 + +p[1]; };
  const clock = (m) => { const h = Math.floor(m / 60), mm = m % 60; const suf = h >= 12 ? "pm" : "am"; const h12 = ((h + 11) % 12) + 1; return h12 + (mm ? ":" + String(mm).padStart(2, "0") : "") + " " + suf; };
  function nowLagos() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const g = (t) => (parts.find((p) => p.type === t) || {}).value;
    const day = DAYS.indexOf(g("weekday"));
    return { day: day, minutes: (+g("hour") % 24) * 60 + +g("minute"), iso: g("year") + "-" + g("month") + "-" + g("day") };
  }
  const hoursFor = (d) => D.brand.hours.find((h) => h.d === d);
  function openStatus() {
    const n = nowLagos(); const h = hoursFor(n.day);
    const o = toMin(h.open), c = toMin(h.close);
    if (n.minutes >= o && n.minutes < c) return { open: true, text: "Open now, until " + clock(c) };
    if (n.minutes < o) return { open: false, text: "Opens today at " + clock(o) };
    const t = hoursFor((n.day + 1) % 7);
    return { open: false, text: "Opens tomorrow at " + clock(toMin(t.open)) };
  }
  function renderHours() {
    const n = nowLagos();
    $$("[data-open-status]").forEach((el) => { const s = openStatus(); el.textContent = s.text; el.classList.toggle("is-closed", !s.open); });
    $$(".hours").forEach((ul) => {
      ul.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => { const h = hoursFor(d); return '<li data-day="' + d + '"' + (d === n.day ? ' class="is-today"' : "") + "><span>" + DAYS[d] + "</span><span>" + clock(toMin(h.open)) + " to " + clock(toMin(h.close)) + "</span></li>"; }).join("");
    });
  }

  /* Cart state, persisted */
  const KEY = "lantees.cart.v1";
  const listeners = [];
  let lines = [];
  try { lines = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!Array.isArray(lines)) lines = []; } catch (e) { lines = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* private mode */ } listeners.forEach((f) => f(lines)); }
  const cart = {
    lines: () => lines.slice(),
    onChange: (f) => { listeners.push(f); f(lines); },
    add(line) {
      const same = lines.find((l) => l.key === line.key);
      if (same) same.qty += line.qty; else lines.push(line);
      save();
    },
    setQty(key, qty) { const l = lines.find((x) => x.key === key); if (!l) return; l.qty = qty; if (l.qty <= 0) lines = lines.filter((x) => x.key !== key); save(); },
    remove(key) { lines = lines.filter((x) => x.key !== key); save(); },
    clear() { lines = []; save(); },
    count: () => lines.reduce((a, l) => a + l.qty, 0),
    subtotal: () => lines.reduce((a, l) => a + l.qty * l.unit, 0),
    hasSunday: () => lines.some((l) => l.sun)
  };

  /* Toast */
  let toastTimer;
  function toast(msg, action) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = icon("check") + "<span>" + esc(msg) + "</span>" + (action ? '<button class="textlink" data-toast-action style="color:inherit">' + esc(action.label) + "</button>" : "");
    if (action) $("[data-toast-action]", t).addEventListener("click", () => { t.classList.remove("is-on"); action.run(); });
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), action ? 5000 : 2800);
  }

  /* Header */
  function initHeader() {
    const hdr = $(".hdr"); if (!hdr) return;
    const sentinel = $("#top-sentinel");
    if (sentinel && "IntersectionObserver" in window) {
      new IntersectionObserver((en) => hdr.classList.toggle("is-solid", !en[0].isIntersecting), { rootMargin: "0px" }).observe(sentinel);
    } else hdr.classList.add("is-solid");
    const mnav = $(".mnav");
    const burger = $(".burger");
    if (burger && mnav) {
      burger.addEventListener("click", () => { mnav.showModal(); $(".mnav__list a", mnav).focus(); });
      $$("[data-close]", mnav).forEach((b) => b.addEventListener("click", () => mnav.close()));
      $$("a", mnav).forEach((a) => a.addEventListener("click", () => mnav.close()));
    }
    const here = location.pathname.split("/").pop() || "index.html";
    $$(".hdr__nav a, .mnav__list a").forEach((a) => { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });
    const count = $(".cartbtn__count");
    if (count) cart.onChange(() => { const c = cart.count(); count.textContent = c; count.classList.toggle("is-on", c > 0); });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* Reveal on scroll */
  function initReveal() {
    $$("[data-reveal-stagger]").forEach((wrap) => Array.from(wrap.children).forEach((c, i) => { c.setAttribute("data-reveal", ""); c.style.setProperty("--i", i); }));
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* Hero slideshow */
  function initHero() {
    const hero = $(".hero"); if (!hero) return;
    const slides = $$(".hero__slide", hero); if (slides.length < 2) return;
    const dots = $(".hero__dots", hero);
    let i = 0, timer, visible = true;
    if (dots) dots.innerHTML = slides.map((_, k) => '<button type="button" aria-label="Show photo ' + (k + 1) + '"' + (k === 0 ? ' class="is-active"' : "") + "></button>").join("");
    function show(k) {
      slides[i].classList.remove("is-active"); i = (k + slides.length) % slides.length; slides[i].classList.add("is-active");
      if (dots) $$("button", dots).forEach((b, j) => b.classList.toggle("is-active", j === i));
    }
    function upgrade(s) { if (s.dataset.srcset) { s.srcset = s.dataset.srcset; s.sizes = "100vw"; delete s.dataset.srcset; } if (s.dataset.src) { s.src = s.dataset.src; delete s.dataset.src; } }
    function upgradeRest() { slides.slice(1).forEach(upgrade); }
    if (slides[0].complete) upgradeRest(); else { slides[0].addEventListener("load", upgradeRest, { once: true }); slides[0].addEventListener("error", upgradeRest, { once: true }); }
    function start() { stop(); if (reduceMotion) return; timer = setInterval(() => { if (visible && !document.hidden) show(i + 1); }, 6500); }
    function stop() { clearInterval(timer); }
    if (dots) dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; show($$("button", dots).indexOf(b)); start(); });
    if ("IntersectionObserver" in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.1 }).observe(hero);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
    start();
  }

  /* Rooms accordion */
  function initRooms() {
    const rooms = $$(".room"); if (!rooms.length) return;
    const open = (r) => { rooms.forEach((x) => { x.classList.toggle("is-open", x === r); x.setAttribute("aria-expanded", x === r ? "true" : "false"); }); };
    rooms.forEach((r) => {
      r.setAttribute("role", "button"); r.setAttribute("tabindex", "0");
      r.addEventListener("click", () => open(r));
      r.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(r); } });
      if (window.matchMedia("(hover: hover) and (min-width: 56rem)").matches) r.addEventListener("mouseenter", () => open(r));
    });
    open(rooms[0]);
  }

  /* Featured dish rail */
  function initRail() {
    const track = $("#featured-track"); if (!track) return;
    track.innerHTML = D.featured.map((id) => {
      const it = itemById(id); if (!it) return "";
      return '<article class="dish-card">' +
        '<a class="dish-card__img" href="menu.html#' + it.section + '" aria-label="' + esc(it.name) + ' on the menu">' + img(it.img || sectionOf(it).img, it.name, { sizes: "(min-width: 56rem) 24vw, 60vw" }) + "</a>" +
        '<div class="dish-card__row"><h3 class="dish-card__name">' + esc(it.name) + '</h3><span class="dish-card__price">' + fmt(it.price) + "</span></div>" +
        (it.desc ? '<p class="dish-card__desc">' + esc(it.desc) + "</p>" : "") +
        '<div><button type="button" class="dish__add" data-add="' + it.id + '">' + icon("plus") + " Add to order</button></div>" +
        "</article>";
    }).join("");
    const rail = track.closest(".rail");
    $$("[data-rail]", rail).forEach((b) => b.addEventListener("click", () => track.scrollBy({ left: (b.dataset.rail === "next" ? 1 : -1) * track.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" })));
  }

  /* Map */
  function initMap() {
    const el = $("#map"); if (!el || !window.L) return;
    const g = D.brand.geo;
    const map = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([g.lat, g.lng], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    const pin = L.divIcon({ className: "", html: '<div class="pin"><img src="assets/brand/logo-ivory.png" alt=""></div>', iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44] });
    L.marker([g.lat, g.lng], { icon: pin, title: D.brand.name }).addTo(map)
      .bindPopup("<b>" + esc(D.brand.short) + "</b>" + esc(D.brand.address.line1) + "<br>" + esc(D.brand.address.line2) + "<br>" + esc(D.brand.address.area) + '<br><a href="' + D.brand.mapsUrl + '" target="_blank" rel="noopener">Get directions</a>').openPopup();
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());
  }

  /* Delegated add-to-order */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b && window.LC && LC.openItem) { e.preventDefault(); LC.openItem(b.dataset.add); }
    const c = e.target.closest("[data-open-cart]");
    if (c && window.LC && LC.openCart) { e.preventDefault(); LC.openCart(); }
  });

  window.LC = { $, $$, fmt, esc, img, icon, cart, toast, itemById, allItems, sectionOf, nowLagos, hoursFor, toMin, clock, DAYS, openStatus, reduceMotion };

  document.addEventListener("DOMContentLoaded", () => { initHeader(); renderHours(); initReveal(); initHero(); initRooms(); initRail(); initMap(); });
})();
