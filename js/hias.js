/* Hias: template halaman bulan, judul bulan, hiasan bebas (geser, ubah ukuran, putar), dan simpan halaman sebagai gambar. */

const PAGE_KEY = "jurnal-rasa:calpages",
  DECO_MAX = 40;
const TEMPLATES = [
  { id: "klasik", n: "Klasik", d: "Kotak berwarna, rapi" },
  { id: "tulis", n: "Buku tulis", d: "Kertas bergaris, dilingkari spidol" },
  { id: "scrap", n: "Scrapbook", d: "Kertas krem, foto jadi isi kotak" },
  { id: "bujo", n: "Bullet journal", d: "Kertas titik, bulatan kecil" },
  { id: "malam", n: "Langit malam", d: "Rasa jadi bintang" },
  { id: "musim", n: "Musim", d: "Hiasan berganti tiap bulan" },
  { id: "hewan", n: "Teman hewan", d: "Hewan lucu mengintip, ganti tiap bulan" },
  { id: "permen", n: "Toko permen", d: "Garis pastel, rasa jadi permen" },
  { id: "hati", n: "Penuh cinta", d: "Merah muda, rasa jadi hati" },
  { id: "kebun", n: "Kebun bunga", d: "Rasa mekar jadi bunga" },
  { id: "kaki", n: "Jejak kaki", d: "Kucing dan anjing, rasa jadi jejak" },
  { id: "laut", n: "Bawah laut", d: "Biru laut, rasa jadi gelembung" },
  { id: "awan", n: "Awan kapas", d: "Langit pastel, rasa jadi awan" },
];
// Template Teman hewan: tiga hewan yang mengintip dari sudut halaman, berbeda tiap bulan.
const ANIMAL_SETS = [
  ["a-penguin", "a-bunny", "a-chick"],
  ["a-bear", "a-cat", "a-ladybug"],
  ["a-frog", "a-duck", "a-snail"],
  ["a-bunny", "a-chick", "a-butterfly"],
  ["a-cat", "a-bee", "a-hamster"],
  ["a-dog", "a-turtle", "a-butterfly"],
  ["a-whale", "a-fish", "a-duck"],
  ["a-panda", "a-fox", "a-bee"],
  ["a-owl", "a-hamster", "a-snail"],
  ["a-fox", "a-cat", "a-ladybug"],
  ["a-frog", "a-bear", "a-duck"],
  ["a-unicorn", "a-penguin", "a-panda"],
];
const PEEK_POS = [
  [0.9, 0.06, 0.15, 10],
  [0.08, 0.95, 0.14, -8],
  [0.92, 0.96, 0.12, 6],
];
// Template Musim: warna kertas dan tiga hiasan untuk tiap bulan (Januari–Desember).
const SEASONS = [
  ["#e8f0ff", ["sparkle", "cloud", "star-deco"]],
  ["#ffeef4", ["heart-doodle", "flower", "bow"]],
  ["#eaf6ff", ["cloud", "rainbow", "leaf-sprig"]],
  ["#eefaec", ["flower", "daisy", "leaf-sprig"]],
  ["#fff7e3", ["sun-doodle", "daisy", "leaf-sprig"]],
  ["#fff1e2", ["sun-doodle", "cloud", "flower"]],
  ["#fff5d9", ["sun-doodle", "rainbow", "sparkle"]],
  ["#fff0ee", ["flag-id", "star-deco", "sparkle"]],
  ["#f4f0e6", ["leaf-sprig", "cloud", "moon-stars"]],
  ["#fbefe2", ["leaf-sprig", "daisy", "sparkle"]],
  ["#e9f1f8", ["cloud", "rainbow", "moon-stars"]],
  ["#edf3fb", ["star-deco", "bow", "sparkle"]],
];
const MOTIF_POS = [
  [0.92, 0.05, 0.15, 12],
  [0.07, 0.95, 0.14, -10],
  [0.62, 0.97, 0.09, 6],
];

// Template lucu punya ruang kosong di atas dan bawah (template.css), jadi hiasannya tidak menutupi tulisan.
const CUTE_POS = [
  [0.92, 0.055, 0.11, 10],
  [0.07, 0.955, 0.1, -8],
  [0.93, 0.955, 0.1, 6],
];

/* ===== Data ===== */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const isTpl = t => TEMPLATES.some(x => x.id === t);
function cleanPages(o) {
  const out = { def: "klasik", months: {} };
  if (!o || typeof o !== "object") return out;
  if (isTpl(o.def)) out.def = o.def;
  if (o.months && typeof o.months === "object")
    for (const [k, p] of Object.entries(o.months)) {
      if (!/^\d{4}-\d{2}$/.test(k) || !p || typeof p !== "object") continue;
      const x = {};
      if (isTpl(p.tpl)) x.tpl = p.tpl;
      if (typeof p.title === "string" && p.title.trim()) x.title = p.title.slice(0, 60);
      if (Array.isArray(p.deco)) {
        const d = p.deco
          .filter(i => i && typeof i.s === "string" && [i.x, i.y, i.w, i.r].every(Number.isFinite))
          .slice(0, DECO_MAX)
          .map(i => ({
            s: i.s,
            x: clamp(i.x, 0, 1),
            y: clamp(i.y, 0, 1),
            w: clamp(i.w, 0.04, 0.9),
            r: Math.round(i.r) % 360,
            ...(i.b ? { b: 1 } : {}),
          }));
        if (d.length) x.deco = d;
      }
      if (Object.keys(x).length) out.months[k] = x;
    }
  return out;
}
S.pages = cleanPages(loadObj(PAGE_KEY));
const savePages = () => saveObj(PAGE_KEY, S.pages);
const mkey = (y, m) => `${y}-${pad(m + 1)}`;
const pageOf = (y, m) => S.pages.months[mkey(y, m)] || {};
const tplOf = (y, m) => pageOf(y, m).tpl || S.pages.def;
function setPage(y, m, patch) {
  const k = mkey(y, m),
    p = { ...pageOf(y, m), ...patch };
  Object.keys(p).forEach(f => {
    if (p[f] === "" || p[f] === undefined || (Array.isArray(p[f]) && !p[f].length)) delete p[f];
  });
  if (Object.keys(p).length) S.pages.months[k] = p;
  else delete S.pages.months[k];
  return savePages();
}
// Hiasan bawaan template (tidak bisa digeser): selotip Scrapbook dan hiasan Musim.
function templateMotif(tpl, m) {
  if (tpl === "musim")
    return SEASONS[m][1].map((s, i) => {
      const [x, y, w, r] = MOTIF_POS[i];
      return { s, x, y, w, r };
    });
  if (tpl === "hewan")
    return ANIMAL_SETS[m].map((s, i) => {
      const [x, y, w, r] = PEEK_POS[i];
      return { s, x, y, w, r };
    });
  if (CUTE_TPL[tpl])
    return CUTE_TPL[tpl].motif.map((s, i) => {
      const [x, y, w, r] = CUTE_POS[i];
      return { s, x, y, w: stickerById(s)?.vb === "0 0 64 32" ? w * 1.3 : w, r };
    });
  if (tpl === "scrap")
    return [
      { s: "tape-pink", x: 0.07, y: 0.02, w: 0.24, r: -30 },
      { s: "tape-mint", x: 0.93, y: 0.02, w: 0.24, r: 28 },
    ];
  return [];
}

/* ===== Menggambar halaman ===== */
// Template lucu diwarnai lewat style langsung (dari CUTE_TPL di js/lucu.js); template lain lewat template.css.
function cuteStyle(el, tpl) {
  const t = CUTE_TPL[tpl],
    st = el.style;
  if (!t) {
    delete el.dataset.shape;
    ["background", "--fg", "--muted", "--surface-2", "--shape"].forEach(p => st.removeProperty(p));
    return;
  }
  el.dataset.shape = t.shape;
  st.background = cuteCss(t);
  st.setProperty("--fg", t.fg);
  st.setProperty("--muted", t.mu);
  st.setProperty("--surface-2", t.cell);
  st.setProperty("--shape", shapeUrl(t.shape));
}
function decoItem(d, i, edit) {
  const s = stickerById(d.s);
  if (!s) return "";
  const on = edit && S.hSel === i;
  return `<div class="dk${on ? " on" : ""}"${i >= 0 ? ` data-dk="${i}"` : ""} style="left:${d.x * 100}%;top:${d.y * 100}%;width:${d.w * 100}%;--r:${d.r}deg"${edit ? ` tabindex="0" aria-label="${esc(s.n)}"` : ""}>${stickerSvg(s)}${
    on
      ? `<span class="hrot" data-h="rot" title="Putar"></span><span class="hsize" data-h="size" title="Ubah ukuran"></span><button class="hdel" data-h="del" aria-label="Hapus hiasan">×</button>`
      : ""
  }</div>`;
}
function paintPage(el, y, m, edit) {
  const p = pageOf(y, m),
    tpl = tplOf(y, m);
  el.dataset.tpl = tpl;
  el.style.setProperty("--season", SEASONS[m][0]);
  cuteStyle(el, tpl);
  const t = el.querySelector(":scope > .ptitle");
  t.hidden = !p.title;
  t.textContent = p.title || "";
  el.querySelector(":scope > .motif").innerHTML = templateMotif(tpl, m)
    .map(d => decoItem(d, -1))
    .join("");
  // Hiasan bertanda b ada di lapisan belakang (di balik kotak tanggal); nomor urutnya tetap nomor di daftar.
  const list = p.deco || [],
    layer = back => list.map((d, i) => (!!d.b === back ? decoItem(d, i, edit) : "")).join("");
  el.querySelector(":scope > .decob").innerHTML = layer(true);
  el.querySelector(":scope > .deco").innerHTML = layer(false);
  // Saat hiasan belakang dipilih, kalender dibuat transparan supaya hiasannya terlihat waktu digeser.
  if (edit) el.classList.toggle("backsel", !!list[S.hSel]?.b);
}
function renderPage() {
  paintPage($("#calpage"), S.vm, S.vmo, false);
}

/* ===== Atur halaman: judul dan template ===== */
const MINI = [0, 4, 5, 3, 0, 2, 4, 5, 1, 3, 4, 0, 5, 4];
function openTpl() {
  renderTpl();
  if (!$("#dlgTpl").open) $("#dlgTpl").showModal();
}
function renderTpl() {
  const y = S.vm,
    m = S.vmo,
    cur = tplOf(y, m),
    p = pageOf(y, m);
  const mini = id =>
    `<div class="calpage mini" data-tpl="${id}" style="--season:${SEASONS[m][0]}"><div class="cal">${MINI.map(
      (c, i) =>
        `<div class="day${c ? " has" : ""}"${c ? ` data-c="${c}"` : ""}><span class="n">${i + 1}</span></div>`
    ).join("")}</div></div>`;
  $("#dlgTpl").innerHTML =
    `<form method="dialog" class="dhead"><h2><span class="hi" style="--hc:var(--m5)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg></span>Halaman ${monthName(y, m)}</h2>
      <button class="iconbtn sm" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></form>
    <label class="pf wide"><span>Judul bulan (boleh kosong)</span><input id="ptIn" maxlength="60" value="${esc(p.title || "")}" placeholder="Misalnya: ${monthName(y, m).split(" ")[0]}, pelan-pelan saja 🌱"></label>
    <p class="label">Template</p>
    <div class="tgrid">${TEMPLATES.map(
      t =>
        `<button class="tcard" data-tpl-pick="${t.id}" aria-pressed="${cur === t.id}">${mini(t.id)}<b>${t.n}</b><small>${t.d}</small></button>`
    ).join("")}</div>
    <label class="chk"><input type="checkbox" id="tplDef" ${S.pages.def === cur ? "checked" : ""}> Jadikan bawaan untuk bulan lain yang belum diatur</label>
    <div class="row"><button class="btn primary" id="tplDone">Selesai</button></div>`;
  $("#dlgTpl")
    .querySelectorAll(".calpage.mini")
    .forEach(el => cuteStyle(el, el.dataset.tpl));
}

/* ===== Hias bebas ===== */
const hDeco = () => pageOf(S.hy, S.hm).deco || [];
function openHias() {
  S.hy = S.vm;
  S.hm = S.vmo;
  S.hSel = -1;
  S.hTab = S.hTab || "deco";
  const d = $("#dlgHias");
  d.innerHTML = `<div class="hhead"><h2>Hias ${monthName(S.hy, S.hm)}</h2><div class="row"><button class="btn ghost sm iconlbl" data-page-png="hpage"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>Gambar</button><button class="btn primary sm" id="hiasDone">Selesai</button></div></div>
    <div class="hstage" id="hstage"><div class="calpage" id="hpage"><div class="motif" aria-hidden="true"></div><div class="decob edit"></div><p class="ptitle" hidden></p><div class="cal">${monthCells(S.hy, S.hm, false)}</div><div class="legend">${legendHtml()}</div><div class="deco edit"></div></div></div>
    <div class="htools" id="htools"></div>
    <div class="htray"><div class="seg" id="htab"></div><div class="hlist" id="hlist"></div></div>`;
  renderHias();
  renderTray();
  d.showModal();
}
function renderHias() {
  paintPage($("#hpage"), S.hy, S.hm, true);
  const n = hDeco().length,
    sel = S.hSel >= 0 && S.hSel < n;
  $("#htools").innerHTML = sel
    ? `<button class="btn ghost sm" data-hact="layer" aria-pressed="${!!hDeco()[S.hSel].b}">${hDeco()[S.hSel].b ? "Ke atas tanggal" : "Ke balik tanggal"}</button><button class="btn ghost sm" data-hact="front">Ke depan</button><button class="btn ghost sm" data-hact="back">Ke belakang</button><button class="btn ghost sm" data-hact="dup">Gandakan</button><button class="btn text sm" data-hact="del">Hapus</button>`
    : `<span class="muted small">${n ? "Ketuk hiasan untuk memilih. Geser untuk memindah, tarik bulatan atas untuk memutar, kotak pojok untuk mengubah ukuran." : "Ketuk hiasan di bawah untuk menambahkannya ke halaman."}${n >= DECO_MAX ? ` Maksimal ${DECO_MAX} hiasan.` : ""}</span>`;
}
function renderTray() {
  const tabs = [
    ["deco", "Dekorasi"],
    ["animal", "Hewan"],
    ["food", "Makanan"],
    ["cute", "Lucu"],
  ];
  $("#htab").innerHTML = tabs
    .map(([id, n]) => `<button data-htab="${id}" aria-pressed="${S.hTab === id}">${n}</button>`)
    .join("");
  // Hias khusus hiasan halaman. Stiker rasa dan stiker buatanmu ditempel per tanggal lewat mode tempel.
  const list = { deco: DECOS, animal: ANIMALS, food: SNACKS, cute: CUTES }[S.hTab] || DECOS;
  $("#hlist").innerHTML = list.length
    ? list
        .map(
          s =>
            `<button class="htile" data-hadd="${s.id}" title="${esc(s.n)}" aria-label="Tambah ${esc(s.n)}">${stickerSvg(s)}</button>`
        )
        .join("")
    : `<span class="muted small">Belum ada stiker buatanmu. Buat lewat Buku stiker di tab Koleksi.</span>`;
}
function saveDeco(list) {
  setPage(S.hy, S.hm, { deco: list });
  renderHias();
  if (S.hy === S.vm && S.hm === S.vmo) renderPage();
}
// Hiasan baru ditaruh di tempat yang paling jauh dari hiasan lain, supaya tidak saling menumpuk.
function freeSpot(own) {
  const list = [...own, ...templateMotif(tplOf(S.hy, S.hm), S.hm)];
  let best = [0.5, 0.45],
    far = -1;
  for (let gy = 0; gy < 5; gy++)
    for (let gx = 0; gx < 5; gx++) {
      const x = 0.14 + gx * 0.18,
        y = 0.12 + gy * 0.19,
        d = list.length
          ? Math.min(...list.map(o => Math.hypot(o.x - x, o.y - y)))
          : 1 - Math.hypot(x - 0.5, y - 0.45);
      if (d > far + 1e-6) {
        far = d;
        best = [x, y];
      }
    }
  return best;
}
function addDeco(id) {
  const list = [...hDeco()];
  if (list.length >= DECO_MAX) return renderHias();
  const s = stickerById(id),
    [, , vw, vh] = (s.vb || "0 0 1 1").split(" ").map(Number),
    ratio = vw / vh || 1,
    // Ukuran mengikuti sisi terpanjang: selotip dan kata-kata lebih lebar, penjepit yang tinggi lebih sempit.
    w = ratio > 1.6 ? 0.26 : s.kind === "deco" ? Math.min(0.15, 0.15 * ratio) : 0.12,
    [x, y] = freeSpot(list);
  list.push({
    s: id,
    x: clamp(x + (Math.random() - 0.5) * 0.04, 0.05, 0.95),
    y: clamp(y + (Math.random() - 0.5) * 0.04, 0.05, 0.95),
    w,
    r: Math.round((Math.random() - 0.5) * 20),
  });
  S.hSel = list.length - 1;
  saveDeco(list);
}
function hiasAction(a) {
  const list = [...hDeco()],
    i = S.hSel;
  if (i < 0 || i >= list.length) return;
  if (a === "layer") {
    const it = { ...list[i] };
    if (it.b) delete it.b;
    else it.b = 1;
    list[i] = it;
    return saveDeco(list);
  }
  const [it] = list.splice(i, 1);
  if (a === "front") {
    list.push(it);
    S.hSel = list.length - 1;
  } else if (a === "back") {
    list.unshift(it);
    S.hSel = 0;
  } else if (a === "dup") {
    list.splice(i, 0, it);
    if (list.length < DECO_MAX) {
      list.push({ ...it, x: clamp(it.x + 0.05, 0, 1), y: clamp(it.y + 0.05, 0, 1) });
      S.hSel = list.length - 1;
    } else S.hSel = i;
  } else S.hSel = -1;
  saveDeco(list);
}

// Geser, putar, dan ubah ukuran dengan pointer (mouse, jari, atau pena).
let drag = null;
function startDrag(e) {
  const dk = e.target.closest("#hpage .dk");
  if (!dk) {
    if (e.target.closest("#hstage") && S.hSel >= 0) {
      S.hSel = -1;
      renderHias();
    }
    return;
  }
  const h = e.target.closest("[data-h]")?.dataset.h || "move";
  if (h === "del") return;
  const i = +dk.dataset.dk,
    d = hDeco()[i],
    page = $("#hpage").getBoundingClientRect(),
    cx = page.left + d.x * page.width,
    cy = page.top + d.y * page.height;
  if (S.hSel !== i) {
    S.hSel = i;
    renderHias();
  }
  drag = {
    i,
    h,
    page,
    cx,
    cy,
    sx: e.clientX,
    sy: e.clientY,
    d0: { ...d },
    a0: Math.atan2(e.clientY - cy, e.clientX - cx),
    r0: Math.max(8, Math.hypot(e.clientX - cx, e.clientY - cy)),
    moved: false,
  };
  try {
    $("#dlgHias").setPointerCapture(e.pointerId);
  } catch (_) {}
  e.preventDefault();
}
function moveDrag(e) {
  if (!drag) return;
  const g = drag,
    d = { ...g.d0 };
  if (g.h === "move") {
    d.x = clamp(g.d0.x + (e.clientX - g.sx) / g.page.width, 0, 1);
    d.y = clamp(g.d0.y + (e.clientY - g.sy) / g.page.height, 0, 1);
  } else if (g.h === "rot") {
    let r = g.d0.r + ((Math.atan2(e.clientY - g.cy, e.clientX - g.cx) - g.a0) * 180) / Math.PI;
    r = Math.round(r) % 360;
    if (Math.abs(r) < 4) r = 0;
    d.r = r;
  } else {
    d.w = clamp((g.d0.w * Math.hypot(e.clientX - g.cx, e.clientY - g.cy)) / g.r0, 0.04, 0.9);
  }
  g.cur = d;
  g.moved = true;
  const el = $(`#hpage .dk[data-dk="${g.i}"]`);
  if (el) {
    el.style.left = d.x * 100 + "%";
    el.style.top = d.y * 100 + "%";
    el.style.width = d.w * 100 + "%";
    el.style.setProperty("--r", d.r + "deg");
  }
}
function endDrag() {
  if (!drag) return;
  const g = drag;
  drag = null;
  if (!g.moved) return;
  const list = [...hDeco()];
  list[g.i] = g.cur;
  saveDeco(list);
}

/* ===== Simpan halaman sebagai gambar ===== */
// Halaman digambar ulang di canvas dengan mengukur posisi tiap bagian di layar, jadi hasilnya sama dengan yang terlihat.
const imgCache = new Map();
function loadImg(src) {
  if (imgCache.has(src)) return imgCache.get(src);
  const p = new Promise(res => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });
  imgCache.set(src, p);
  return p;
}
function svgImg(s, px) {
  let svg = stickerSvg(s).replace("<svg ", `<svg xmlns="http://www.w3.org/2000/svg" `);
  const [, , vw, vh] = (s.vb || "0 0 32 32").split(" ").map(Number);
  // Ganti ukuran hanya di tag <svg> paling luar; width/height milik <rect> di dalamnya harus tetap.
  svg = svg.replace(/^<svg[^>]*>/, tag =>
    tag
      .replace(/ width="[^"]*"| height="[^"]*"/g, "")
      .replace("<svg ", `<svg width="${px}" height="${Math.round((px * vh) / vw)}" `)
  );
  return loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
}
const aspect = s => {
  const [, , vw, vh] = (s.vb || "0 0 32 32").split(" ").map(Number);
  return vh / vw;
};
function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
}
function seeded(n) {
  let a = n;
  return () => ((a = (a * 16807) % 2147483647) - 1) / 2147483646;
}
function solidBg(el) {
  for (let n = el; n; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor;
    if (c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c)) return c;
  }
  return "#fff";
}
// Latar halaman tiap template, meniru CSS di template.css.
function drawBg(g, tpl, W, H, s, el, top) {
  const fill = c => {
    g.fillStyle = c;
    g.fillRect(0, 0, W, H);
  };
  if (tpl === "tulis") {
    fill("#fffdf7");
    g.fillStyle = "#dfe6f1";
    for (let y = top + 27 * s; y < H; y += 28 * s) g.fillRect(0, y, W, s);
    for (let y = top - s; y > 0; y -= 28 * s) g.fillRect(0, y, W, s);
    g.fillStyle = "#f3b4b4";
    g.fillRect(29 * s, 0, 2 * s, H);
  } else if (tpl === "scrap") {
    fill("#efe3cf");
    g.fillStyle = "rgba(120,90,50,.07)";
    for (let y = 4.5 * s; y < H; y += 9 * s)
      for (let x = 4.5 * s; x < W; x += 9 * s) g.fillRect(x, y, s, s);
  } else if (tpl === "bujo") {
    fill("#fbfbf7");
    g.fillStyle = "#cdd1d8";
    for (let y = top + 8 * s; y < H; y += 16 * s)
      for (let x = 8 * s; x < W; x += 16 * s) {
        g.beginPath();
        g.arc(x, y, 1.2 * s, 0, 7);
        g.fill();
      }
  } else if (tpl === "malam") {
    const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, "#121a38");
    gr.addColorStop(1, "#2a2f5e");
    fill(gr);
    const pts = [
      [20, 30, 1.2],
      [70, 80, 1],
      [110, 20, 1.5],
      [150, 110, 1],
      [40, 140, 1.2],
    ];
    g.fillStyle = "#fff";
    for (let ty = 0; ty < H; ty += 170 * s)
      for (let tx = 0; tx < W; tx += 180 * s)
        pts.forEach(([x, y, r]) => {
          g.beginPath();
          g.arc(tx + x * s, ty + y * s, r * s, 0, 7);
          g.fill();
        });
  } else if (CUTE_TPL[tpl]) {
    const t = CUTE_TPL[tpl];
    if (Array.isArray(t.bg)) {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, t.bg[0]);
      gr.addColorStop(1, t.bg[1]);
      fill(gr);
    } else fill(t.bg);
    if (t.stripe) {
      g.save();
      g.fillStyle = t.stripe;
      g.rotate(-Math.PI / 4);
      const L = W + H;
      for (let x = -L; x < L; x += 20 * s) g.fillRect(x, -L, 10 * s, 3 * L);
      g.restore();
    }
    if (t.dot) {
      const [c, r, gap] = t.dot,
        dot = (x, y) => {
          g.beginPath();
          g.arc(x, y, r * s, 0, 7);
          g.fill();
        };
      g.fillStyle = c;
      for (let x = (gap / 2) * s; x < W; x += gap * s) {
        for (let y = top + (gap / 2) * s; y < H; y += gap * s) dot(x, y);
        for (let y = top - (gap / 2) * s; y > 0; y -= gap * s) dot(x, y);
      }
    }
  } else if (tpl === "musim") fill(SEASONS[S.expM][0]);
  else if (tpl === "hewan") {
    fill("#eaf7ef");
    g.fillStyle = "#d3eedb";
    for (let y = top + 11 * s; y < H; y += 22 * s)
      for (let x = 11 * s; x < W; x += 22 * s) {
        g.beginPath();
        g.arc(x, y, 2 * s, 0, 7);
        g.fill();
      }
  } else fill(solidBg(el));
}
async function drawDeco(g, list, R, s, alpha = 1) {
  for (const d of list) {
    const st = stickerById(d.s);
    if (!st) continue;
    const w = d.w * R.width * s,
      h = w * aspect(st),
      im = await svgImg(st, Math.round(w * 2));
    if (!im) continue;
    g.save();
    g.globalAlpha = alpha;
    g.translate(d.x * R.width * s, d.y * R.height * s);
    g.rotate((d.r * Math.PI) / 180);
    g.shadowColor = "rgba(0,0,0,.22)";
    g.shadowBlur = 3 * s;
    g.shadowOffsetY = s;
    g.drawImage(im, -w / 2, -h / 2, w, h);
    g.restore();
  }
}
function drawText(g, el, R, s, align, text) {
  const r = el.getBoundingClientRect(),
    st = getComputedStyle(el);
  g.font = `${st.fontStyle} ${st.fontWeight} ${parseFloat(st.fontSize) * s}px ${st.fontFamily}`;
  g.fillStyle = st.color;
  g.textBaseline = "middle";
  g.textAlign = align || "left";
  const x = (r.left - R.left) * s + (align === "center" ? (r.width * s) / 2 : 0);
  g.fillText(text ?? el.textContent.trim(), x, (r.top - R.top + r.height / 2) * s, r.width * s);
}
function star(g, cx, cy, rad) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      rr2 = i % 2 ? rad * 0.42 : rad;
    g.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2);
  }
  g.closePath();
}
async function drawCell(g, d, tpl, R, s, mc) {
  const r = d.getBoundingClientRect(),
    st = getComputedStyle(d),
    x = (r.left - R.left) * s,
    y = (r.top - R.top) * s,
    w = r.width * s,
    h = r.height * s,
    lvl = +d.dataset.c || 0,
    col = lvl ? mc[lvl] : "";
  g.save();
  g.globalAlpha = parseFloat(st.opacity) || 1;
  const bg = st.backgroundColor;
  if (bg && !/rgba\(.*,\s*0\)$/.test(bg) && bg !== "transparent") {
    if (tpl === "scrap") {
      g.shadowColor = "rgba(60,40,20,.2)";
      g.shadowBlur = 3 * s;
      g.shadowOffsetY = s;
    }
    g.fillStyle = bg;
    rr(g, x, y, w, h, parseFloat(st.borderTopLeftRadius) * s);
    g.fill();
    g.shadowColor = "transparent";
  }
  if (tpl === "scrap") {
    const ix = x + 3 * s,
      iy = y + 3 * s,
      iw = w - 6 * s,
      ih = h - 16 * s;
    rr(g, ix, iy, iw, ih, 2 * s);
    g.fillStyle = col || "#e9e1d3";
    g.fill();
    const ph = d.dataset.ph && S.entries[d.dataset.day]?.photo;
    const im = ph && (await loadImg(ph));
    if (im) {
      g.save();
      rr(g, ix, iy, iw, ih, 2 * s);
      g.clip();
      const k = Math.max(iw / im.width, ih / im.height);
      g.drawImage(
        im,
        ix + (iw - im.width * k) / 2,
        iy + (ih - im.height * k) / 2,
        im.width * k,
        im.height * k
      );
      g.restore();
    }
  } else if (col && tpl === "tulis") {
    g.strokeStyle = col;
    g.lineWidth = 2.5 * s;
    g.beginPath();
    g.ellipse(x + w / 2, y + h / 2, w * 0.36, h * 0.42, -0.14, 0, Math.PI * 2);
    g.stroke();
  } else if (col && tpl === "bujo") {
    g.fillStyle = col;
    g.beginPath();
    g.arc(x + w / 2, y + h * 0.56, w * 0.2, 0, Math.PI * 2);
    g.fill();
  } else if (col && CUTE_TPL[tpl]) {
    // Sama dengan .day.has::before di template.css: lebar 56% kotak, titik tengah di 58% tinggi.
    const sh = CUTE_TPL[tpl].shape,
      sz = w * 0.56,
      k = sz / 24;
    g.save();
    g.translate(x + w / 2 - sz / 2, y + h * 0.58 - sz / 2);
    g.scale(k, k);
    g.fillStyle = col;
    g.fill(new Path2D(SHAPES[sh]), SHAPE_EVENODD[sh] ? "evenodd" : "nonzero");
    g.restore();
  } else if (col && tpl === "malam") {
    const sz = w * (0.24 + lvl * 0.06),
      cx = x + w / 2,
      cy = y + h * 0.54,
      glow = g.createRadialGradient(cx, cy, 0, cx, cy, sz * 0.95);
    glow.addColorStop(0, col);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    g.globalAlpha *= 0.6;
    g.fillStyle = glow;
    g.fillRect(cx - sz, cy - sz, sz * 2, sz * 2);
    g.globalAlpha /= 0.6;
    g.fillStyle = col;
    star(g, cx, cy, sz / 2);
    g.fill();
  }
  drawText(g, d.querySelector(".n"), R, s, "center");
  const ds = d.querySelector(".dstk");
  if (ds) {
    const k = d.dataset.day,
      stk = dayStickers(k)[0],
      sw = ds.offsetWidth * s,
      im = stk && (await svgImg(stk, Math.round(sw * 2)));
    if (im) {
      g.save();
      g.globalAlpha = 1;
      g.translate(
        x + (ds.offsetLeft + ds.offsetWidth / 2) * s,
        y + (ds.offsetTop + ds.offsetWidth / 2) * s
      );
      g.rotate((tilt(k) * Math.PI) / 180);
      g.shadowColor = "rgba(0,0,0,.25)";
      g.shadowBlur = 2 * s;
      g.drawImage(im, -sw / 2, -sw / 2, sw, sw);
      g.restore();
    }
  }
  g.restore();
}
async function pagePng(id) {
  const el = $("#" + id),
    y = id === "hpage" ? S.hy : S.vm,
    m = id === "hpage" ? S.hm : S.vmo;
  S.expM = m;
  if (document.fonts) await document.fonts.ready;
  // Tunggu animasi muncul (kotak tanggal, stiker) selesai, supaya ukuran dan warnanya terbaca utuh.
  await Promise.all(
    el
      .getAnimations({ subtree: true })
      .filter(a => a.effect?.getTiming().iterations !== Infinity)
      .map(a => a.finished.catch(() => {}))
  );
  const R = el.getBoundingClientRect(),
    W = 1080,
    s = W / R.width,
    HEAD = 200,
    FOOT = 80,
    H = Math.round(HEAD + R.height * s + FOOT),
    tpl = el.dataset.tpl,
    cs = getComputedStyle(el),
    root = getComputedStyle(document.documentElement),
    mc = [0, 1, 2, 3, 4, 5].map(l => root.getPropertyValue(`--m${l}`).trim());
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  drawBg(g, tpl, W, H, s, el, HEAD);
  g.save();
  g.translate(0, HEAD);
  await drawDeco(g, templateMotif(tpl, m), R, s, tpl === "musim" ? 0.85 : 1);
  g.restore();
  g.fillStyle = cs.color;
  g.textBaseline = "alphabetic";
  g.textAlign = "left";
  g.font = `800 72px "Bricolage Grotesque", system-ui, sans-serif`;
  g.fillText(monthName(y, m), 56, 112);
  g.globalAlpha = 0.6;
  g.font = `600 28px Figtree, system-ui, sans-serif`;
  g.fillText("Jurnal Rasa", 58, 160);
  g.globalAlpha = 1;
  g.save();
  g.translate(0, HEAD);
  const deco = pageOf(y, m).deco || [];
  await drawDeco(
    g,
    deco.filter(d => d.b),
    R,
    s
  );
  const t = el.querySelector(":scope > .ptitle");
  if (!t.hidden) drawText(g, t, R, s, "center");
  el.querySelectorAll(".dow").forEach(d => drawText(g, d, R, s, "center"));
  for (const d of el.querySelectorAll(".day:not(.pad)")) await drawCell(g, d, tpl, R, s, mc);
  el.querySelectorAll(".legend span").forEach(sp => {
    const i = sp.querySelector("i"),
      ri = i.getBoundingClientRect(),
      rs = sp.getBoundingClientRect();
    g.fillStyle = getComputedStyle(i).backgroundColor;
    rr(g, (ri.left - R.left) * s, (ri.top - R.top) * s, ri.width * s, ri.height * s, 4 * s);
    g.fill();
    const st = getComputedStyle(sp);
    g.font = `${st.fontWeight} ${parseFloat(st.fontSize) * s}px ${st.fontFamily}`;
    g.fillStyle = st.color;
    g.textAlign = "left";
    g.textBaseline = "middle";
    g.fillText(
      sp.textContent.trim(),
      (ri.right - R.left + 6) * s,
      (rs.top - R.top + rs.height / 2) * s
    );
  });
  await drawDeco(
    g,
    deco.filter(d => !d.b),
    R,
    s
  );
  g.restore();
  g.globalAlpha = 0.5;
  g.fillStyle = cs.color;
  g.font = `600 24px Figtree, system-ui, sans-serif`;
  g.fillText("Dibuat dengan Jurnal Rasa", 56, H - 34);
  return new Promise(res => c.toBlob(res, "image/png"));
}
async function downloadPage(id, btn) {
  if (btn) btn.disabled = true;
  try {
    const blob = await pagePng(id),
      y = id === "hpage" ? S.hy : S.vm,
      m = id === "hpage" ? S.hm : S.vmo,
      a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `jurnal-rasa-${monthName(y, m).toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } catch (_) {
    toast(
      `<span class="bdg" style="--bc:var(--danger)">${bsvg("check")}</span><div><small>Gambar</small><b>Gagal membuat gambar halaman.</b></div>`
    );
  }
  if (btn) btn.disabled = false;
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "tplOpen") {
    openTpl();
    return;
  }
  if (t.dataset.tplPick) {
    setPage(S.vm, S.vmo, { tpl: t.dataset.tplPick });
    if ($("#tplDef").checked) {
      S.pages.def = t.dataset.tplPick;
      savePages();
    }
    renderTpl();
    renderMonth();
    return;
  }
  if (t.id === "tplDone") {
    $("#dlgTpl").close();
    return;
  }
  if (t.id === "hiasOpen") {
    openHias();
    return;
  }
  if (t.id === "hiasDone") {
    $("#dlgHias").close();
    return;
  }
  if (t.dataset.htab) {
    S.hTab = t.dataset.htab;
    renderTray();
    return;
  }
  if (t.dataset.hadd) {
    addDeco(t.dataset.hadd);
    return;
  }
  if (t.dataset.hact) {
    hiasAction(t.dataset.hact);
    return;
  }
  if (t.dataset.h === "del") {
    hiasAction("del");
    return;
  }
  if (t.dataset.pagePng) {
    downloadPage(t.dataset.pagePng, t);
    return;
  }
});
document.addEventListener("input", e => {
  if (e.target.id !== "ptIn") return;
  setPage(S.vm, S.vmo, { title: e.target.value.trim() });
  renderPage();
});
document.addEventListener("change", e => {
  if (e.target.id !== "tplDef") return;
  S.pages.def = e.target.checked ? tplOf(S.vm, S.vmo) : "klasik";
  savePages();
  renderMonth();
});
$("#dlgHias").addEventListener("pointerdown", startDrag);
$("#dlgHias").addEventListener("pointermove", moveDrag);
$("#dlgHias").addEventListener("pointerup", endDrag);
$("#dlgHias").addEventListener("pointercancel", endDrag);
$("#dlgHias").addEventListener("close", () => {
  drag = null;
  renderMonth();
});
// Keyboard: panah menggeser hiasan terpilih, Delete menghapusnya.
$("#dlgHias").addEventListener("keydown", e => {
  if (S.hSel < 0 || e.target.matches("input,textarea")) return;
  const step = e.shiftKey ? 0.05 : 0.01,
    mv = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[e.key];
  if (mv) {
    e.preventDefault();
    const list = [...hDeco()],
      d = { ...list[S.hSel] };
    d.x = clamp(d.x + mv[0], 0, 1);
    d.y = clamp(d.y + mv[1], 0, 1);
    list[S.hSel] = d;
    saveDeco(list);
    $(`#hpage .dk[data-dk="${S.hSel}"]`)?.focus();
  } else if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    hiasAction("del");
  }
});

/* ===== Menu ⋮ halaman bulan (tempel stiker, template, hias, gambar) ===== */
function pageMenu(open) {
  $("#pageMenu").hidden = !open;
  $("#pageMenuBtn").setAttribute("aria-expanded", open);
  if (open) $("#pageMenu button").focus();
}
// Menu tertutup setelah salah satu pilihannya dipakai, atau saat mengetuk di luar menu.
document.addEventListener("click", e => {
  if (e.target.closest("#pageMenuBtn")) return pageMenu($("#pageMenu").hidden);
  if (!$("#pageMenu").hidden) pageMenu(false);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("#pageMenu").hidden) {
    pageMenu(false);
    $("#pageMenuBtn").focus();
  }
});
