/* Lantees Cafe & Bistro. Gallery grid, filters and lightbox. */
(function () {
  "use strict";
  const D = window.LANTEES, LC = window.LC;
  const { $, $$, esc, icon } = LC;
  const grid = $("#masonry"); if (!grid) return;
  const items = D.gallery;
  grid.innerHTML = items.map((g, i) => '<figure class="tile" data-g="' + g.g + '" data-i="' + i + '" tabindex="0" role="button" aria-label="Open photo: ' + esc(g.alt) + '">' + LC.img(g.img, g.alt, { sizes: "(min-width: 64rem) 25vw, (min-width: 40rem) 33vw, 50vw" }) + "</figure>").join("");
  const filters = $("#gfilters");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("[data-g]"); if (!b) return;
    $$("[data-g]", filters).forEach((x) => x.classList.toggle("is-active", x === b));
    $$(".tile", grid).forEach((t) => t.classList.toggle("is-hidden", b.dataset.g !== "all" && t.dataset.g !== b.dataset.g));
  });

  let box, cur = 0;
  const visible = () => $$(".tile:not(.is-hidden)", grid).map((t) => +t.dataset.i);
  function ensure() {
    if (box) return;
    box = document.createElement("dialog"); box.className = "lightbox"; box.setAttribute("aria-label", "Photo");
    box.innerHTML = '<div class="lightbox__stage"><img class="lightbox__img" alt=""></div><p class="lightbox__cap"></p>' +
      '<button type="button" class="lightbox__btn lightbox__btn--prev" data-dir="-1" aria-label="Previous">' + icon("chevron-left") + '</button><button type="button" class="lightbox__btn lightbox__btn--next" data-dir="1" aria-label="Next">' + icon("chevron-right") + "</button>" +
      '<button type="button" class="iconbtn lightbox__close" data-close aria-label="Close">' + icon("x") + "</button>";
    document.body.appendChild(box);
    $("[data-close]", box).addEventListener("click", () => box.close());
    $$("[data-dir]", box).forEach((b) => b.addEventListener("click", () => step(+b.dataset.dir)));
    box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lightbox__stage")) box.close(); });
    box.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
    let x0 = null;
    box.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    box.addEventListener("pointerup", (e) => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
  }
  function load(i) {
    cur = i; const g = items[i];
    const im = $(".lightbox__img", box);
    im.src = "assets/img/" + g.img + "-960.jpg"; im.alt = g.alt;
    $(".lightbox__cap", box).textContent = g.alt;
    const v = visible(); const k = v.indexOf(i);
    [v[(k + 1) % v.length], v[(k - 1 + v.length) % v.length]].forEach((n) => { const p = new Image(); p.src = "assets/img/" + items[n].img + "-960.jpg"; });
  }
  function step(d) { const v = visible(); const k = v.indexOf(cur); load(v[(k + d + v.length) % v.length]); }
  function open(i) { ensure(); load(i); if (!box.open) box.showModal(); }
  grid.addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (t) open(+t.dataset.i); });
  grid.addEventListener("keydown", (e) => { const t = e.target.closest(".tile"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(+t.dataset.i); } });
})();
