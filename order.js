/* Lantees Cafe & Bistro. Menu rendering, item sheet, cart drawer, checkout.
   Orders leave the site as a prefilled WhatsApp message (or an email), with
   optional card payment through Paystack when a public key is configured. */
(function () {
  "use strict";
  const D = window.LANTEES, LC = window.LC;
  const { $, $$, fmt, esc, img, icon, cart, toast } = LC;
  const B = D.brand;
  const FKEY = "lantees.fulfil.v1";
  let fulfil = { mode: "pickup", zone: "" };
  try { Object.assign(fulfil, JSON.parse(localStorage.getItem(FKEY) || "{}")); } catch (e) { /* ignore */ }
  const saveFulfil = () => { try { localStorage.setItem(FKEY, JSON.stringify(fulfil)); } catch (e) { /* ignore */ } };
  const zoneById = (id) => D.order.zones.find((z) => z.id === id);
  const deliveryFee = () => (fulfil.mode === "delivery" && zoneById(fulfil.zone) ? zoneById(fulfil.zone).fee : 0);
  const ALLERGEN = { gluten: "gluten", dairy: "dairy", eggs: "eggs", nuts: "nuts", fish: "fish", shellfish: "shellfish" };

  /* ---------- Menu ---------- */
  function tags(it, sec) {
    let out = "";
    if (it.diet === "vegan") out += '<span class="tag tag--vegan">Vegan</span>';
    else if (it.diet === "veg") out += '<span class="tag tag--veg">Vegetarian</span>';
    if (sec.sunday) out += '<span class="tag tag--sun">Sundays</span>';
    if (it.c && it.c.length) out += '<span class="tag">Contains ' + it.c.map((c) => ALLERGEN[c] || c).join(", ") + "</span>";
    return out;
  }
  function dish(it, sec, orderable) {
    const withImg = !!it.img && !sec.compact;
    return '<article class="dish' + (withImg ? " dish--img" : "") + '" id="' + it.id + '" data-diet="' + (it.diet || "") + '" data-c="' + (it.c || []).join(" ") + '">' +
      (withImg ? img(it.img, it.name, { sizes: "5.5rem", cls: "dish__img" }) : "") +
      '<h3 class="dish__name">' + esc(it.name) + "</h3>" +
      '<span class="dish__price">' + fmt(it.price) + "</span>" +
      (it.desc ? '<p class="dish__desc">' + esc(it.desc) + "</p>" : "") +
      '<div class="dish__meta">' + tags(it, sec) + (orderable ? '<button type="button" class="dish__add" data-add="' + it.id + '">' + icon("plus") + " Add</button>" : "") + "</div>" +
      "</article>";
  }
  function renderMenu(root, o) {
    o = o || {};
    root.innerHTML = D.menu.map((sec) =>
      '<section class="msec' + (sec.compact ? " msec--compact" : "") + '" id="' + sec.id + '" aria-labelledby="h-' + sec.id + '"><div class="wrap msec__grid">' +
      '<div class="msec__head"><h2 id="h-' + sec.id + '">' + esc(sec.name) + "</h2>" + (sec.lede ? '<p class="lede">' + esc(sec.lede) + "</p>" : "") +
      (sec.img ? '<div class="msec__img">' + img(sec.img, sec.name, { sizes: "(min-width: 56rem) 18rem, 100vw" }) + "</div>" : "") + "</div>" +
      '<div class="dishes">' + sec.items.map((it) => dish(it, sec, o.orderable !== false)).join("") + "</div>" +
      "</div></section>"
    ).join("");
    const nav = $("#menu-nav");
    if (nav) {
      nav.innerHTML = D.menu.map((s) => '<a class="chip" href="#' + s.id + '">' + esc(s.name) + "</a>").join("");
      if ("IntersectionObserver" in window) {
        const chips = $$(".chip", nav);
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => { if (en.isIntersecting) { chips.forEach((c) => c.classList.toggle("is-active", c.getAttribute("href") === "#" + en.target.id)); const on = $(".is-active", nav); if (on) on.scrollIntoView({ block: "nearest", inline: "center", behavior: LC.reduceMotion ? "auto" : "smooth" }); } });
        }, { rootMargin: "-40% 0px -55% 0px" });
        $$(".msec", root).forEach((s) => io.observe(s));
      }
    }
    const filters = $("#menu-filters");
    if (filters) {
      const F = [["all", "All"], ["veg", "Vegetarian"], ["vegan", "Vegan"], ["no-nuts", "No nuts"], ["no-dairy", "No dairy"], ["no-gluten", "No gluten"], ["no-shellfish", "No shellfish"]];
      filters.innerHTML = "<span>Show</span>" + F.map(([k, l]) => '<button type="button" class="chip' + (k === "all" ? " is-active" : "") + '" data-filter="' + k + '">' + l + "</button>").join("");
      filters.addEventListener("click", (e) => {
        const b = e.target.closest("[data-filter]"); if (!b) return;
        $$("[data-filter]", filters).forEach((x) => x.classList.toggle("is-active", x === b));
        const f = b.dataset.filter;
        $$(".dish", root).forEach((d) => {
          const diet = d.dataset.diet, c = d.dataset.c.split(" ");
          let ok = true;
          if (f === "veg") ok = diet === "veg" || diet === "vegan";
          else if (f === "vegan") ok = diet === "vegan";
          else if (f.startsWith("no-")) ok = !c.includes(f.slice(3));
          d.classList.toggle("is-hidden", !ok);
        });
        $$(".msec", root).forEach((s) => s.classList.toggle("is-empty", !$$(".dish:not(.is-hidden)", s).length));
      });
    }
    if (location.hash) { const t = $(location.hash); if (t) setTimeout(() => t.scrollIntoView({ block: "start" }), 50); }
  }

  /* ---------- Item sheet ---------- */
  let sheet;
  function optionGroups(it) {
    const sec = LC.sectionOf(it);
    const shared = (sec.shared || []).filter((g) => !(it.noMilk && g.id === "milk"));
    return shared.concat(it.opts || []);
  }
  function openItem(id) {
    const it = LC.itemById(id); if (!it) return;
    const sec = LC.sectionOf(it);
    if (!sheet) {
      sheet = document.createElement("dialog"); sheet.className = "sheet"; sheet.setAttribute("aria-label", "Add to order");
      document.body.appendChild(sheet);
      sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
    }
    const groups = optionGroups(it);
    let qty = 1;
    sheet.innerHTML = '<div class="sheet__panel">' +
      '<button type="button" class="iconbtn sheet__close" data-close aria-label="Close">' + icon("x") + "</button>" +
      (it.img || sec.img ? '<div class="sheet__img">' + img(it.img || sec.img, it.name, { sizes: "34rem", eager: true }) + "</div>" : "") +
      '<div class="sheet__scroll"><div class="sheet__title"><h2>' + esc(it.name) + '</h2><span class="sheet__price">' + fmt(it.price) + "</span></div>" +
      (it.desc ? '<p class="lede" style="font-size:.95rem">' + esc(it.desc) + "</p>" : "") +
      (sec.sunday ? '<p class="menu-note">Served on Sundays. Orders for a Sunday roast are for Sunday collection or delivery.</p>' : "") +
      '<form id="item-form">' + groups.map((g) => {
        const multi = g.type === "multi";
        return '<fieldset class="optgroup" data-group="' + g.id + '" data-type="' + g.type + '" data-min="' + (g.min || 0) + '" data-free="' + (g.freeCount || 0) + '" data-extra="' + (g.extraPrice || 0) + '"><legend>' + esc(g.name) + (g.min ? "<small>choose at least " + g.min + "</small>" : "") + "</legend>" +
          g.choices.map((c, k) => '<label class="opt"><input type="' + (multi ? "checkbox" : "radio") + '" name="' + g.id + '" value="' + esc(c.n) + '" data-p="' + (c.p || 0) + '"' + (!multi && k === 0 ? " checked" : "") + "><span>" + esc(c.n) + "</span>" + (c.p ? "<em>+" + fmt(c.p) + "</em>" : "") + "</label>").join("") +
          "</fieldset>";
      }).join("") +
      '<div class="field note"><label for="item-note">Note for the kitchen</label><textarea id="item-note" rows="2" placeholder="Allergies, spice level, anything else"></textarea></div>' +
      "</form></div>" +
      '<div class="sheet__foot"><div class="qty"><button type="button" data-q="-1" aria-label="Fewer">' + icon("minus") + '</button><output aria-live="polite">1</output><button type="button" data-q="1" aria-label="More">' + icon("plus") + "</button></div>" +
      '<button type="button" class="btn" id="item-add">Add <span data-total></span></button></div></div>';
    const form = $("#item-form", sheet), out = $(".qty output", sheet), total = $("[data-total]", sheet), addBtn = $("#item-add", sheet);
    function calc() {
      let unit = it.price, chosen = [], valid = true;
      $$(".optgroup", form).forEach((g) => {
        const picked = $$("input:checked", g);
        const free = +g.dataset.free, extra = +g.dataset.extra, min = +g.dataset.min;
        if (picked.length < min) valid = false;
        picked.forEach((inp, k) => { unit += +inp.dataset.p; if (free && k >= free) unit += extra; if (!(g.dataset.type === "single" && inp.value === "None")) chosen.push(inp.value); });
      });
      total.textContent = fmt(unit * qty);
      addBtn.disabled = !valid;
      return { unit, chosen, valid };
    }
    form.addEventListener("change", calc);
    $$("[data-q]", sheet).forEach((b) => b.addEventListener("click", () => { qty = Math.min(20, Math.max(1, qty + +b.dataset.q)); out.textContent = qty; calc(); }));
    $("[data-close]", sheet).addEventListener("click", () => sheet.close());
    addBtn.addEventListener("click", () => {
      const r = calc(); if (!r.valid) return;
      const note = $("#item-note", sheet).value.trim();
      const key = it.id + "|" + r.chosen.join(",") + "|" + note;
      cart.add({ key, id: it.id, name: it.name, unit: r.unit, qty, opts: r.chosen, note, sun: !!sec.sunday });
      sheet.close();
      toast(it.name + " added", { label: "View order", run: openCart });
    });
    calc();
    sheet.showModal();
  }

  /* ---------- Cart drawer ---------- */
  let drawer, view = "cart";
  function ensureDrawer() {
    if (drawer) return drawer;
    drawer = document.createElement("dialog"); drawer.className = "drawer"; drawer.setAttribute("aria-label", "Your order");
    drawer.innerHTML = '<div class="drawer__panel"><div class="drawer__head"><h2>Your order</h2><button type="button" class="iconbtn" data-close aria-label="Close">' + icon("x") + '</button></div><div class="drawer__body"></div><div class="drawer__foot"></div></div>';
    document.body.appendChild(drawer);
    drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
    $("[data-close]", drawer).addEventListener("click", () => drawer.close());
    drawer.addEventListener("close", () => { view = "cart"; });
    cart.onChange(() => { if (drawer.open && view === "cart") renderCart(); });
    return drawer;
  }
  function openCart() { ensureDrawer(); view = "cart"; renderCart(); if (!drawer.open) drawer.showModal(); }
  function totals() {
    const sub = cart.subtotal(), service = sub * D.charges.service, vat = sub * D.charges.vat, fee = deliveryFee();
    return { sub, service, vat, fee, grand: sub + service + vat + fee };
  }
  function totalsHtml(t) {
    return '<div class="totals"><div class="totals__row"><span>Subtotal</span><span>' + fmt(t.sub) + '</span></div><div class="totals__row"><span>Service charge 5%</span><span>' + fmt(t.service) + '</span></div><div class="totals__row"><span>VAT 7.5%</span><span>' + fmt(t.vat) + "</span></div>" +
      (fulfil.mode === "delivery" ? '<div class="totals__row"><span>Delivery' + (zoneById(fulfil.zone) ? " to " + esc(zoneById(fulfil.zone).name) : "") + "</span><span>" + (zoneById(fulfil.zone) ? fmt(t.fee) : "choose an area") + "</span></div>" : "") +
      '<div class="totals__row totals__row--grand"><span>Total</span><span>' + fmt(t.grand) + "</span></div></div>";
  }
  function segHtml() {
    return '<div class="seg" role="group" aria-label="Collection or delivery"><button type="button" class="seg__btn' + (fulfil.mode === "pickup" ? " is-active" : "") + '" data-mode="pickup">' + icon("building-store") + ' Pickup</button><button type="button" class="seg__btn' + (fulfil.mode === "delivery" ? " is-active" : "") + '" data-mode="delivery">' + icon("bike") + " Delivery</button></div>" +
      (fulfil.mode === "delivery" ? '<div class="field"><label for="zone-select">Delivery area</label><select id="zone-select"><option value="">Choose an area</option>' + D.order.zones.map((z) => '<option value="' + z.id + '"' + (z.id === fulfil.zone ? " selected" : "") + ">" + esc(z.name) + " (" + fmt(z.fee) + ")</option>").join("") + '</select><span class="field__hint">Fees are estimates and confirmed with your order.</span></div>' : "");
  }
  function bindSeg(root, rerender) {
    $$("[data-mode]", root).forEach((b) => b.addEventListener("click", () => { fulfil.mode = b.dataset.mode; saveFulfil(); rerender(); }));
    const z = $("#zone-select", root); if (z) z.addEventListener("change", () => { fulfil.zone = z.value; saveFulfil(); rerender(); });
  }
  function renderCart() {
    const body = $(".drawer__body", drawer), foot = $(".drawer__foot", drawer);
    const lines = cart.lines();
    if (!lines.length) {
      body.innerHTML = '<div class="empty">' + icon("shopping-bag") + "<p>Nothing here yet.</p></div>";
      foot.innerHTML = '<a class="btn btn--wide" href="menu.html">Browse the menu</a>';
      return;
    }
    body.innerHTML = segHtml() + '<ul class="lines">' + lines.map((l) =>
      '<li class="line" data-key="' + esc(l.key) + '"><span class="line__name">' + esc(l.name) + '</span><span class="line__price">' + fmt(l.unit * l.qty) + "</span>" +
      (l.opts.length || l.note ? '<span class="line__opts">' + esc(l.opts.join(", ")) + (l.note ? (l.opts.length ? ". " : "") + "Note: " + esc(l.note) : "") + "</span>" : "") +
      '<div class="line__row"><div class="qty"><button type="button" data-q="-1" aria-label="Fewer">' + icon("minus") + "</button><output>" + l.qty + '</output><button type="button" data-q="1" aria-label="More">' + icon("plus") + '</button></div><button type="button" class="line__remove" data-remove>Remove</button></div></li>'
    ).join("") + "</ul>" + totalsHtml(totals());
    foot.innerHTML = '<button type="button" class="btn btn--wide" id="to-checkout">Continue to details</button><a class="textlink" href="menu.html" style="justify-self:center">Add more from the menu</a>';
    bindSeg(body, renderCart);
    $$(".line", body).forEach((li) => {
      const key = li.dataset.key;
      $$("[data-q]", li).forEach((b) => b.addEventListener("click", () => { const l = cart.lines().find((x) => x.key === key); cart.setQty(key, l.qty + +b.dataset.q); }));
      $("[data-remove]", li).addEventListener("click", () => cart.remove(key));
    });
    $("#to-checkout").addEventListener("click", () => { view = "checkout"; renderCheckout(); });
  }

  /* ---------- Checkout ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  function slotsFor(iso) {
    const now = LC.nowLagos();
    const d = new Date(iso + "T12:00:00");
    const day = d.getDay();
    const h = LC.hoursFor(day);
    let start = LC.toMin(h.open), end = LC.toMin(h.close) - D.order.lastOrderMinutesBeforeClose;
    if (iso === now.iso) start = Math.max(start, Math.ceil((now.minutes + D.order.prepMinutes) / 15) * 15);
    const out = [];
    for (let m = start; m <= end; m += 15) out.push(pad(Math.floor(m / 60)) + ":" + pad(m % 60));
    return out;
  }
  function renderCheckout() {
    const body = $(".drawer__body", drawer), foot = $(".drawer__foot", drawer);
    const now = LC.nowLagos();
    const open = LC.openStatus().open;
    const t = totals();
    const card = !!B.paystackKey;
    const dates = []; for (let i = 0; i < 8; i++) { const d = new Date(now.iso + "T12:00:00"); d.setDate(d.getDate() + i); const iso = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); if (!slotsFor(iso).length) continue; dates.push({ iso, label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : LC.DAYS[d.getDay()] + " " + d.getDate(), sun: d.getDay() === 0 }); }
    body.innerHTML = '<form id="checkout" novalidate>' + segHtml() +
      '<div class="field"><span>When</span><div class="seg"><button type="button" class="seg__btn is-active" data-when="asap"' + (open ? "" : " disabled") + '>As soon as possible</button><button type="button" class="seg__btn" data-when="later">Schedule</button></div><span class="field__hint">' + (open ? "Ready in about " + D.order.prepMinutes + " minutes." : "We are closed right now, so choose a time.") + "</span></div>" +
      '<div id="schedule" hidden><div class="field field--row"><div class="field"><label for="co-date">Day</label><select id="co-date">' + dates.map((d) => '<option value="' + d.iso + '">' + d.label + "</option>").join("") + '</select></div><div class="field"><label for="co-time">Time</label><select id="co-time"></select><span class="field__err">Choose a time.</span></div></div><div class="field__err" id="sun-err">Sunday Roast is served on Sundays. Choose a Sunday, or remove the roast from your order.</div></div>' +
      (fulfil.mode === "delivery" ? '<div class="field"><label for="co-address">Delivery address</label><input id="co-address" autocomplete="street-address" required placeholder="House number, street, estate"><span class="field__err">Please add the delivery address.</span></div><div class="field"><label for="co-landmark">Nearest landmark or gate instructions</label><input id="co-landmark" placeholder="Optional"></div>' : "") +
      '<div class="field"><label for="co-name">Your name</label><input id="co-name" autocomplete="name" required><span class="field__err">Please add your name.</span></div>' +
      '<div class="field"><label for="co-phone">Phone</label><input id="co-phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="0803 000 0000"><span class="field__err">Please add a phone number we can reach.</span></div>' +
      (card ? '<div class="field"><label for="co-email">Email (for the card receipt)</label><input id="co-email" type="email" autocomplete="email"></div>' : "") +
      '<div class="field"><span>Payment</span><div class="paycards">' +
      (fulfil.mode === "pickup" ? '<label class="paycard"><input type="radio" name="pay" value="Pay at collection" checked><span><b>Pay at collection</b><small>Card or cash at the counter.</small></span></label>' : '<label class="paycard"><input type="radio" name="pay" value="Pay on delivery" checked><span><b>Pay on delivery</b><small>Card, cash or transfer to the rider.</small></span></label>') +
      '<label class="paycard"><input type="radio" name="pay" value="Bank transfer"><span><b>Bank transfer</b><small>Account details are sent with your confirmation.</small></span></label>' +
      (card ? '<label class="paycard"><input type="radio" name="pay" value="Card online"><span><b>Card online</b><small>Secure payment by Paystack.</small></span></label>' : "") +
      "</div></div>" +
      '<div class="field"><label for="co-notes">Notes</label><textarea id="co-notes" rows="2" placeholder="Optional"></textarea></div>' +
      '<div class="co-summary"><ul>' + cart.lines().map((l) => "<li><span>" + l.qty + " × " + esc(l.name) + "</span><span>" + fmt(l.unit * l.qty) + "</span></li>").join("") + "</ul>" + totalsHtml(t) + "</div></form>";
    foot.innerHTML = '<button type="button" class="btn btn--wide" id="send-wa">' + icon("brand-whatsapp") + ' Send order on WhatsApp</button><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap"><button type="button" class="textlink" id="send-mail">Email the order instead</button><button type="button" class="textlink" id="back-cart">Back</button></div>';
    const form = $("#checkout", body);
    let when = open ? "asap" : "later";
    const sched = $("#schedule", form), dateSel = $("#co-date", form), timeSel = $("#co-time", form);
    function fillTimes() {
      const slots = slotsFor(dateSel.value);
      timeSel.innerHTML = slots.length ? slots.map((s) => '<option value="' + s + '">' + LC.clock(LC.toMin(s)) + "</option>").join("") : '<option value="">No more slots that day</option>';
      const d = dates.find((x) => x.iso === dateSel.value);
      $("#sun-err", form).style.display = cart.hasSunday() && d && !d.sun ? "block" : "none";
    }
    function setWhen(w) { when = w; $$("[data-when]", form).forEach((b) => b.classList.toggle("is-active", b.dataset.when === w)); sched.hidden = w !== "later"; if (w === "later") fillTimes(); }
    $$("[data-when]", form).forEach((b) => b.addEventListener("click", () => setWhen(b.dataset.when)));
    dateSel.addEventListener("change", fillTimes);
    if (cart.hasSunday()) { const s = dates.find((x) => x.sun); if (s) dateSel.value = s.iso; setWhen("later"); } else setWhen(when);
    bindSeg(body, renderCheckout);
    $("#back-cart").addEventListener("click", () => { view = "cart"; renderCart(); });
    function validate() {
      let ok = true;
      $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
      const req = (id, test) => { const el = $(id, form); if (!el) return; if (!test(el.value.trim())) { el.closest(".field").classList.add("is-invalid"); ok = false; } };
      req("#co-name", (v) => v.length > 1);
      req("#co-phone", (v) => v.replace(/\D/g, "").length >= 10);
      req("#co-address", (v) => v.length > 3);
      if (fulfil.mode === "delivery" && !zoneById(fulfil.zone)) { $("#zone-select").closest(".field").classList.add("is-invalid"); ok = false; toast("Choose a delivery area first"); }
      if (when === "later") {
        const d = dates.find((x) => x.iso === dateSel.value);
        if (cart.hasSunday() && d && !d.sun) { ok = false; $("#sun-err", form).style.display = "block"; }
        if (!timeSel.value) { ok = false; timeSel.closest(".field").classList.add("is-invalid"); }
      }
      if (!ok) { const bad = $(".is-invalid, #sun-err[style*='block']", form); if (bad) bad.scrollIntoView({ block: "center", behavior: LC.reduceMotion ? "auto" : "smooth" }); }
      return ok;
    }
    function ref() { const d = new Date(); return "LC-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(); }
    function message(r) {
      const v = (id) => { const el = $(id, form); return el ? el.value.trim() : ""; };
      const pay = ($("input[name=pay]:checked", form) || {}).value || "";
      const whenText = when === "asap" ? "As soon as possible (about " + D.order.prepMinutes + " min)" : dates.find((x) => x.iso === dateSel.value).label + " at " + LC.clock(LC.toMin(timeSel.value));
      const L = ["New order from lanteescafe.com", "Ref " + r, ""];
      L.push(fulfil.mode === "delivery" ? "DELIVERY to " + zoneById(fulfil.zone).name : "PICKUP at Sarius Palmetum");
      L.push("When: " + whenText);
      if (fulfil.mode === "delivery") { L.push("Address: " + v("#co-address")); if (v("#co-landmark")) L.push("Landmark: " + v("#co-landmark")); }
      L.push("Name: " + v("#co-name"), "Phone: " + v("#co-phone"), "");
      cart.lines().forEach((l) => L.push(l.qty + " x " + l.name + (l.opts.length ? " (" + l.opts.join(", ") + ")" : "") + (l.note ? " - " + l.note : "") + " = " + fmt(l.unit * l.qty)));
      L.push("", "Subtotal " + fmt(t.sub), "Service 5% " + fmt(t.service), "VAT 7.5% " + fmt(t.vat));
      if (fulfil.mode === "delivery") L.push("Delivery " + fmt(t.fee));
      L.push("TOTAL " + fmt(t.grand), "", "Payment: " + pay);
      if (v("#co-notes")) L.push("Notes: " + v("#co-notes"));
      return L.join("\n");
    }
    function done(r, channel) {
      view = "done";
      body.innerHTML = '<div class="done">' + icon("check") + "<h3>Order sent</h3><p>Reference " + r + ". " + (channel === "wa" ? "Finish sending the message in WhatsApp and we will confirm within a few minutes." : "Your email app has the order ready to send. We reply with a confirmation.") + "</p></div>";
      foot.innerHTML = '<button type="button" class="btn btn--wide" id="new-order">Start a new order</button>';
      $("#new-order").addEventListener("click", () => { cart.clear(); drawer.close(); });
    }
    function send(channel) {
      if (!validate()) return;
      const r = ref(); const text = message(r);
      const pay = ($("input[name=pay]:checked", form) || {}).value;
      if (pay === "Card online" && card) { payWithCard(t.grand, r, $("#co-email", form).value.trim(), () => deliver(channel, r, text + "\nPaid online by card.")); return; }
      deliver(channel, r, text);
    }
    function deliver(channel, r, text) {
      if (channel === "wa") window.open("https://wa.me/" + B.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      else location.href = "mailto:" + B.email + "?subject=" + encodeURIComponent("Order " + r) + "&body=" + encodeURIComponent(text);
      done(r, channel);
    }
    $("#send-wa").addEventListener("click", () => send("wa"));
    $("#send-mail").addEventListener("click", () => send("mail"));
  }
  function payWithCard(amount, r, email, onDone) {
    if (!email) { toast("Add an email address for the card receipt"); return; }
    const run = () => window.PaystackPop.setup({ key: B.paystackKey, email, amount: Math.round(amount * 100), currency: "NGN", ref: r, callback: onDone, onClose: () => toast("Payment window closed") }).openIframe();
    if (window.PaystackPop) run(); else { const s = document.createElement("script"); s.src = "https://js.paystack.co/v1/inline.js"; s.onload = run; document.head.appendChild(s); }
  }

  /* ---------- Order page extras ---------- */
  function initOrderPage() {
    const bar = $(".orderbar"); if (!bar) return;
    document.body.classList.add("has-orderbar");
    cart.onChange(() => { const c = cart.count(); bar.classList.toggle("is-on", c > 0); $("[data-bar-count]", bar).textContent = c + (c === 1 ? " item" : " items"); $("[data-bar-total]", bar).textContent = fmt(totals().grand); });
    const seg = $("#order-fulfil");
    if (seg) { const r = () => { seg.innerHTML = segHtml(); bindSeg(seg, r); }; r(); }
  }

  LC.openItem = openItem; LC.openCart = openCart; LC.renderMenu = renderMenu;
  document.addEventListener("DOMContentLoaded", () => {
    const root = $("#menu-root"); if (root) renderMenu(root, { orderable: true });
    initOrderPage();
    if (location.hash === "#order") openCart();
  });
})();
