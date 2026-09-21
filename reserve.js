/* Lantees Cafe & Bistro. Three-step reservation request. The request leaves
   the site as a prefilled WhatsApp message (or an email). */
(function () {
  "use strict";
  const D = window.LANTEES, LC = window.LC;
  const { $, $$, esc, icon, toast } = LC;
  const B = D.brand;
  const root = $("#resv"); if (!root) return;
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const state = { guests: 2, date: "", time: "", space: "No preference", occasion: "", name: "", phone: "", email: "", notes: "" };
  const today = new Date(), max = new Date(); max.setDate(max.getDate() + 60);
  const steps = $$(".step", root), panels = $$(".panel", root);
  const SPACES = D.rooms.filter((r) => r.id !== "bar");

  let booted = false;
  function show(n) {
    panels.forEach((p) => (p.hidden = +p.dataset.step !== n));
    steps.forEach((s, i) => { s.classList.toggle("is-on", i === n - 1); s.classList.toggle("is-done", i < n - 1); });
    if (booted) {
      root.scrollIntoView({ block: "start", behavior: LC.reduceMotion ? "auto" : "smooth" });
      const h = $("h2", panels[n - 1]); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    }
    booted = true;
  }
  function slots(dateIso) {
    if (!dateIso) return [];
    const d = new Date(dateIso + "T12:00:00"); const h = LC.hoursFor(d.getDay());
    const now = LC.nowLagos();
    let start = LC.toMin(h.open), end = LC.toMin(h.close) - 60;
    if (dateIso === now.iso) start = Math.max(start, Math.ceil((now.minutes + 60) / 30) * 30);
    const out = []; for (let m = start; m <= end; m += 30) out.push(pad(Math.floor(m / 60)) + ":" + pad(m % 60));
    return out;
  }
  function renderTimes() {
    const box = $("#times", root); const s = slots(state.date);
    box.innerHTML = s.length ? s.map((t) => '<button type="button" class="chip' + (t === state.time ? " is-active" : "") + '" data-time="' + t + '">' + LC.clock(LC.toMin(t)) + "</button>").join("") : '<p class="menu-note">' + (state.date ? "No tables left to request for that day. Try another date." : "Choose a date to see times.") + "</p>";
    if (!s.includes(state.time)) state.time = "";
  }
  /* Step 1 */
  const gOut = $("#guests-out", root), gNote = $("#guests-note", root);
  function renderGuests() { gOut.textContent = state.guests; gNote.hidden = state.guests < 9; }
  $$("[data-g]", root).forEach((b) => b.addEventListener("click", () => { state.guests = Math.min(12, Math.max(1, state.guests + +b.dataset.g)); renderGuests(); }));
  const dateIn = $("#resv-date", root);
  dateIn.min = iso(today); dateIn.max = iso(max);
  dateIn.addEventListener("change", () => { state.date = dateIn.value; renderTimes(); });
  $("#times", root).addEventListener("click", (e) => { const b = e.target.closest("[data-time]"); if (!b) return; state.time = b.dataset.time; $$("[data-time]", root).forEach((x) => x.classList.toggle("is-active", x === b)); });
  $("#to-step2", root).addEventListener("click", () => {
    if (!state.date) { toast("Choose a date"); dateIn.focus(); return; }
    if (!state.time) { toast("Choose a time"); return; }
    show(2);
  });
  /* Step 2 */
  const spaces = $("#spaces", root);
  spaces.innerHTML = SPACES.map((r) => '<label class="spacecard"><input type="radio" name="space" value="' + esc(r.name) + '">' + LC.img(r.img, r.name, { sizes: "(min-width: 40rem) 30vw, 50vw" }) + "<span>" + esc(r.name) + "</span></label>").join("") +
    '<label class="spacecard spacecard--plain"><input type="radio" name="space" value="No preference" checked><span>No preference</span></label>';
  spaces.addEventListener("change", () => { state.space = ($("input:checked", spaces) || {}).value || "No preference"; });
  $("#occasions", root).addEventListener("click", (e) => { const b = e.target.closest("[data-occ]"); if (!b) return; const on = b.classList.contains("is-active"); $$("[data-occ]", root).forEach((x) => x.classList.remove("is-active")); if (!on) b.classList.add("is-active"); state.occasion = on ? "" : b.dataset.occ; });
  $("#to-step3", root).addEventListener("click", () => show(3));
  $("#back-step1", root).addEventListener("click", () => show(1));
  /* Step 3 */
  const form = $("#resv-form", root);
  function dateLabel() { const d = new Date(state.date + "T12:00:00"); return LC.DAYS[d.getDay()] + " " + d.getDate() + " " + d.toLocaleString("en-GB", { month: "long" }) + " " + d.getFullYear(); }
  function renderReview() {
    $("#review", root).innerHTML = "<dl><dt>Guests</dt><dd>" + state.guests + "</dd><dt>Date</dt><dd>" + esc(dateLabel()) + "</dd><dt>Time</dt><dd>" + LC.clock(LC.toMin(state.time)) + "</dd><dt>Space</dt><dd>" + esc(state.space) + "</dd>" + (state.occasion ? "<dt>Occasion</dt><dd>" + esc(state.occasion) + "</dd>" : "") + "</dl>";
  }
  $("#back-step2", root).addEventListener("click", () => show(2));
  function validate() {
    let ok = true;
    $$(".field", form).forEach((f) => f.classList.remove("is-invalid"));
    const req = (id, test) => { const el = $(id, form); if (!test(el.value.trim())) { el.closest(".field").classList.add("is-invalid"); ok = false; } };
    req("#r-name", (v) => v.length > 1); req("#r-phone", (v) => v.replace(/\D/g, "").length >= 10);
    return ok;
  }
  function message() {
    const v = (id) => $(id, form).value.trim();
    const L = ["Reservation request from lanteescafe.com", "", "Guests: " + state.guests, "Date: " + dateLabel(), "Time: " + LC.clock(LC.toMin(state.time)), "Space: " + state.space];
    if (state.occasion) L.push("Occasion: " + state.occasion);
    L.push("", "Name: " + v("#r-name"), "Phone: " + v("#r-phone"));
    if (v("#r-email")) L.push("Email: " + v("#r-email"));
    if (v("#r-notes")) L.push("Notes: " + v("#r-notes"));
    return L.join("\n");
  }
  function finish(channel) {
    const text = message();
    if (channel === "wa") window.open("https://wa.me/" + B.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    else location.href = "mailto:" + B.email + "?subject=" + encodeURIComponent("Reservation request, " + dateLabel()) + "&body=" + encodeURIComponent(text);
    panels[2].innerHTML = '<div class="done">' + icon("check") + "<h3>Request sent</h3><p>" + (channel === "wa" ? "Finish sending the message in WhatsApp. We confirm every table personally, usually within the hour." : "Your email app has the request ready to send. We confirm every table personally.") + '</p><a class="btn" href="index.html">Back to the cafe</a></div>';
  }
  $("#send-wa", root).addEventListener("click", () => { if (validate()) finish("wa"); });
  $("#send-mail", root).addEventListener("click", () => { if (validate()) finish("mail"); });
  const obs = new MutationObserver(() => { if (!panels[2].hidden) renderReview(); });
  obs.observe(panels[2], { attributes: true, attributeFilter: ["hidden"] });
  renderGuests(); renderTimes(); show(1);
})();
