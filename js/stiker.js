/* Stiker: stiker bawaan dan buatan sendiri (emoji atau tulisan) yang bisa ditempel di tanggal mana saja,
   termasuk tanggal yang akan datang. Maksimal 3 stiker per tanggal. */

const STK_KEY = "jurnal-rasa:stickers",
  STK_MAX = 3,
  STK_CUSTOM_MAX = 50;
const STK_COLORS = [
  "#f0648a",
  "#f5a524",
  "#4c8bf5",
  "#2fb37a",
  "#9a6cf0",
  "#f27b3d",
  "#1fa9a1",
  "#e2504a",
  "#7b8597",
];
// [id, nama, warna (indeks STK_COLORS), path ikon 24×24, diisi penuh?]
const STICKERS = [
  ["heart", "Sayang", 0, "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z", 1],
  [
    "star",
    "Spesial",
    1,
    "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
    1,
  ],
  [
    "cake",
    "Ulang tahun",
    0,
    "M5 20h14v-7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1zM5 16c2.3 1.3 4.7 1.3 7 0s4.7-1.3 7 0M12 12V8.5M12 4.5c1 1 1 2 0 2.5-1-.5-1-1.5 0-2.5z",
  ],
  ["plane", "Liburan", 2, "M21 3L3 10.5l7 2.5 2.5 7zM10 13l5-5"],
  ["book", "Ujian", 4, "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11"],
  ["grad", "Kelulusan", 4, "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"],
  [
    "money",
    "Gajian",
    3,
    "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 10v4M18 10v4",
  ],
  [
    "gift",
    "Hadiah",
    7,
    "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7C10.5 4 7 4 7 6s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1",
  ],
  ["pill", "Sakit", 8, "M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7zM6.5 10.5l7 7"],
  ["drop", "Haid", 7, "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z", 1],
  ["moon", "Tidur nyenyak", 4, "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z", 1],
  [
    "sun",
    "Cerah",
    1,
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
  [
    "rain",
    "Hujan",
    2,
    "M7 15a4 4 0 1 1 1-7.9A5 5 0 0 1 17.5 9 3.5 3.5 0 0 1 17 15zM8 18.5l-1 2M12 18.5l-1 2M16 18.5l-1 2",
  ],
  [
    "coffee",
    "Ngopi",
    5,
    "M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5v2M12 3.5v2",
  ],
  ["food", "Makan enak", 5, "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 21V3c-2 1-3 4-3 7h3"],
  [
    "music",
    "Musik",
    4,
    "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  ["sport", "Olahraga", 3, "M6.5 8v8M17.5 8v8M3.5 10v4M20.5 10v4M6.5 12h11"],
  [
    "friends",
    "Kumpul",
    6,
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M21 20a6 6 0 0 0-4-5.6",
  ],
  ["home", "Di rumah", 6, "M4 11l8-7 8 7v9H4zM10 20v-5h4v5"],
  ["work", "Kerja", 8, "M4 8h16v11H4zM9 8V5h6v3M4 13h16"],
  [
    "game",
    "Main game",
    2,
    "M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14 14h-4l-1.6 1.8A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4zM8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01",
  ],
  ["leaf", "Jalan-jalan", 3, "M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l7-7"],
  ["flag", "Target", 7, "M5 21V4M5 4h11l-2 4 2 4H5"],
  ["check", "Selesai", 6, "M5 12.5l4.5 4.5L19 7.5"],
].map(([id, n, c, d, fill]) => ({ id, n, c: STK_COLORS[c], d, fill: !!fill }));

// Stiker dekorasi untuk menghias halaman bulan (bentuknya bebas, tidak bulat). [id, nama, viewBox, isi SVG]
const TAPE =
  "M3 5L9 2l4 3 4-3 4 3h78l4-3 4 3 4-3 4 3 4-2v6l-3 5 3 5-3 5 3 5v4l-4-2-4 3-4-3-4 3-4-3H21l-4 3-4-3-4 3-4-3-3 2v-5l3-5-3-5 3-5-3-5z";
const DECOS = [
  [
    "tape-pink",
    "Selotip merah muda",
    "0 0 120 36",
    `<path d="${TAPE}" fill="#f6a5bd" opacity=".9"/><path d="M18 4l-8 28M38 4l-8 28M58 4l-8 28M78 4l-8 28M98 4l-8 28M116 6l-7 26" stroke="#fff" stroke-width="5" opacity=".45"/>`,
  ],
  [
    "tape-mint",
    "Selotip mint",
    "0 0 120 36",
    `<path d="${TAPE}" fill="#94d9c3" opacity=".9"/><g fill="#fff" opacity=".7"><circle cx="16" cy="12" r="3"/><circle cx="36" cy="24" r="3"/><circle cx="56" cy="12" r="3"/><circle cx="76" cy="24" r="3"/><circle cx="96" cy="12" r="3"/><circle cx="108" cy="25" r="3"/></g>`,
  ],
  [
    "tape-yellow",
    "Selotip kuning",
    "0 0 120 36",
    `<path d="${TAPE}" fill="#f7d77a" opacity=".9"/><path d="M8 13h104M8 23h104M30 4v28M60 4v28M90 4v28" stroke="#fff" stroke-width="2" opacity=".6"/>`,
  ],
  [
    "flower",
    "Bunga",
    "0 0 64 64",
    `<g fill="#f59ec2"><circle cx="32" cy="16" r="11"/><circle cx="47" cy="27" r="11"/><circle cx="41" cy="45" r="11"/><circle cx="23" cy="45" r="11"/><circle cx="17" cy="27" r="11"/></g><circle cx="32" cy="32" r="9" fill="#f6c443"/>`,
  ],
  [
    "daisy",
    "Aster",
    "0 0 64 64",
    `<g fill="#fff" stroke="#e3dccf" stroke-width="1.5">${[0, 45, 90, 135, 180, 225, 270, 315]
      .map(a => `<ellipse cx="32" cy="14" rx="7" ry="13" transform="rotate(${a} 32 32)"/>`)
      .join("")}</g><circle cx="32" cy="32" r="8" fill="#f5b83d"/>`,
  ],
  [
    "leaf-sprig",
    "Daun",
    "0 0 64 64",
    `<path d="M14 54C26 40 36 26 50 10" stroke="#3f9a63" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M26 40c-12-2-16-12-14-20 10 2 16 10 14 20zM36 28c2-12 12-16 20-14-2 10-10 16-20 14zM31 33c-8-6-6-17 0-22 6 6 6 16 0 22z" fill="#6cc58c"/>`,
  ],
  [
    "cloud",
    "Awan",
    "0 0 80 50",
    `<path d="M18 42a12 12 0 0 1-1-24 16 16 0 0 1 30-6 12 12 0 0 1 19 9 9 9 0 0 1-2 21z" fill="#fff" stroke="#c6d4e8" stroke-width="2.5" stroke-linejoin="round"/>`,
  ],
  [
    "sparkle",
    "Kilau",
    "0 0 64 64",
    `<path d="M26 6l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="#f8cf4a"/><path d="M48 36l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#f8cf4a" opacity=".8"/>`,
  ],
  [
    "star-deco",
    "Bintang",
    "0 0 64 64",
    `<path d="M32 5l8 17 18 2-13 13 4 19-17-9-17 9 4-19L6 24l18-2z" fill="#ffd45e" stroke="#e8a92e" stroke-width="2" stroke-linejoin="round"/>`,
  ],
  [
    "heart-doodle",
    "Hati coretan",
    "0 0 64 64",
    `<path d="M32 54S9 40 9 23a12 12 0 0 1 23-5 12 12 0 0 1 23 5c0 17-23 31-23 31z" fill="none" stroke="#e8506e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 8l4-4M56 14l5-1M44 6l-1-4" stroke="#e8506e" stroke-width="3" stroke-linecap="round"/>`,
  ],
  [
    "rainbow",
    "Pelangi",
    "0 0 80 46",
    `<g fill="none" stroke-width="6" stroke-linecap="round"><path d="M8 42a32 32 0 0 1 64 0" stroke="#f07a7a"/><path d="M15 42a25 25 0 0 1 50 0" stroke="#f6c443"/><path d="M22 42a18 18 0 0 1 36 0" stroke="#6cc58c"/><path d="M29 42a11 11 0 0 1 22 0" stroke="#6aa3f0"/></g>`,
  ],
  [
    "bow",
    "Pita",
    "0 0 80 50",
    `<path d="M40 25C28 8 10 8 10 20s18 14 30 5zM40 25c12-17 30-17 30-5s-18 14-30 5z" fill="#ec7a99"/><path d="M36 26l-10 20 8-3 4 6 2-20M44 26l10 20-8-3-4 6-2-20" fill="#d9587d"/><circle cx="40" cy="25" r="5" fill="#d9587d"/>`,
  ],
  [
    "squiggle",
    "Garis coretan",
    "0 0 120 24",
    `<path d="M4 12c8-10 16-10 22 0s14 10 22 0 16-10 22 0 14 10 22 0 16-10 24 0" fill="none" stroke="#5b8def" stroke-width="4" stroke-linecap="round"/>`,
  ],
  [
    "arrow",
    "Panah coretan",
    "0 0 80 50",
    `<path d="M6 40C20 14 44 8 68 16" fill="none" stroke="#3b3f4a" stroke-width="3.5" stroke-linecap="round"/><path d="M56 8l13 8-11 10" fill="none" stroke="#3b3f4a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  ],
  [
    "clip",
    "Penjepit kertas",
    "0 0 40 80",
    `<path d="M26 18v38a8 8 0 0 1-16 0V12a6 6 0 0 1 12 0v40a3 3 0 0 1-6 0V20" fill="none" stroke="#97a1b1" stroke-width="3.5" stroke-linecap="round"/>`,
  ],
  [
    "sun-doodle",
    "Matahari",
    "0 0 64 64",
    `<circle cx="32" cy="32" r="12" fill="#f8c03d"/><g stroke="#f8a93d" stroke-width="4" stroke-linecap="round"><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.7 5.7M44.7 44.7l5.7 5.7M13.6 50.4l5.7-5.7M44.7 19.3l5.7-5.7"/></g>`,
  ],
  [
    "moon-stars",
    "Bulan & bintang",
    "0 0 64 64",
    `<path d="M40 52A22 22 0 0 1 28 10a20 20 0 1 0 24 30 22 22 0 0 1-12 12z" fill="#f3d36b"/><path d="M50 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM56 30l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#f3d36b"/>`,
  ],
  [
    "flag-id",
    "Merah putih",
    "0 0 60 64",
    `<path d="M10 6v54" stroke="#8b6b4a" stroke-width="3.5" stroke-linecap="round"/><path d="M12 8c12-4 22 4 36 0v14c-14 4-24-4-36 0z" fill="#e2453c"/><path d="M12 22c12-4 22 4 36 0v14c-14 4-24-4-36 0z" fill="#fff" stroke="#e0dcd5" stroke-width="1.5"/>`,
  ],
].map(([id, n, vb, svg]) => ({ id, n, vb, svg, kind: "deco" }));

/* ===== Data ===== */
function cleanStk(o) {
  const out = { placed: {}, custom: [] };
  if (!o || typeof o !== "object") return out;
  if (Array.isArray(o.custom))
    out.custom = o.custom
      .filter(
        s =>
          s &&
          typeof s.id === "string" &&
          ["emoji", "text"].includes(s.kind) &&
          typeof s.v === "string" &&
          s.v &&
          STK_COLORS.includes(s.c)
      )
      .slice(0, STK_CUSTOM_MAX)
      .map(s => ({
        id: s.id,
        kind: s.kind,
        v: s.v.slice(0, 12),
        c: s.c,
        n: typeof s.n === "string" && s.n ? s.n.slice(0, 20) : s.v,
      }));
  if (o.placed && typeof o.placed === "object")
    for (const [k, ids] of Object.entries(o.placed))
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && Array.isArray(ids)) {
        const a = ids.filter(x => typeof x === "string").slice(0, STK_MAX);
        if (a.length) out.placed[k] = a;
      }
  return out;
}
S.stk = cleanStk(loadObj(STK_KEY));
const saveStk = () => saveObj(STK_KEY, S.stk);

const stickerById = id =>
  STICKERS.find(s => s.id === id) ||
  S.stk.custom.find(s => s.id === id) ||
  DECOS.find(s => s.id === id) ||
  ANIMALS.find(s => s.id === id) ||
  SNACKS.find(s => s.id === id) ||
  CUTES.find(s => s.id === id);
const isCustom = id => S.stk.custom.some(s => s.id === id);
const dayStickers = k => (S.stk.placed[k] || []).map(stickerById).filter(Boolean);
// Kemiringan kecil yang tetap untuk tiap tanggal, supaya terlihat seperti ditempel tangan.
function tilt(k) {
  let h = 0;
  for (const c of k) h = (h * 31 + c.charCodeAt(0)) % 997;
  return (h % 25) - 12;
}

function stickerSvg(s, size) {
  const wh = size ? ` width="${size}" height="${size}"` : "";
  // Dengan ukuran: muat di kotak persegi (stiker tinggi atau lebar tidak keluar dari kotaknya).
  if (s.kind === "deco")
    return `<svg class="stk shape" viewBox="${s.vb}"${wh} aria-hidden="true">${s.svg}</svg>`;
  let inner;
  if (s.kind === "emoji")
    inner = `<text x="16" y="17" text-anchor="middle" dominant-baseline="central" font-size="16">${esc(s.v)}</text>`;
  else if (s.kind === "text") {
    const L = [...s.v].length,
      fs = L <= 2 ? 13 : L <= 3 ? 11 : L <= 4 ? 9.5 : L <= 5 ? 8 : 7;
    inner = `<text x="16" y="16.5" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="800" fill="#fff" font-family="Figtree, system-ui, sans-serif">${esc(s.v)}</text>`;
  } else
    inner = `<g transform="translate(5 5) scale(.9167)" fill="${s.fill ? "#fff" : "none"}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${s.d}"/></g>`;
  return `<svg class="stk" viewBox="0 0 32 32"${wh} aria-hidden="true"><circle cx="16" cy="16" r="14" fill="${esc(s.c)}" stroke="#fff" stroke-width="2.5"/>${inner}</svg>`;
}

function toggleSticker(k, id) {
  const a = S.stk.placed[k] || [];
  if (a.includes(id)) a.splice(a.indexOf(id), 1);
  else if (a.length < STK_MAX) a.push(id);
  else return;
  if (a.length) S.stk.placed[k] = a;
  else delete S.stk.placed[k];
  saveStk();
  renderStickersEverywhere();
}
function renderStickersEverywhere() {
  if ($("#dlgStk").open) renderStkDlg();
  renderEstk();
  renderMonth();
  renderStkBook();
  renderHistory();
}

/* ===== Stiker di judul editor ===== */
function renderEstk() {
  const st = dayStickers(S.sel);
  $("#estk").innerHTML =
    st
      .map(
        (s, i) =>
          `<span class="estk-i" style="--r:${tilt(S.sel + i)}deg" title="${esc(s.n)}">${stickerSvg(s, 28)}</span>`
      )
      .join("") +
    `<button class="iconbtn sm" data-stkday="${S.sel}" aria-label="Tempel stiker" title="Tempel stiker"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5.5z"/><path d="M12.5 20c0-4.5 3-7.5 7.5-7.5"/></svg></button>`;
}

/* ===== Laci stiker (dialog) ===== */
function openStk(k) {
  S.stkDay = k || "";
  S.stkMake = false;
  S.stkEdit = false;
  renderStkDlg();
  if (!$("#dlgStk").open) $("#dlgStk").showModal();
}
function renderStkDlg() {
  const k = S.stkDay,
    placed = k ? S.stk.placed[k] || [] : [],
    full = placed.length >= STK_MAX,
    cs = S.stk.custom;
  const tile = s => {
    const on = placed.includes(s.id),
      del = S.stkEdit && isCustom(s.id);
    return `<button class="stile${on ? " on" : ""}${del ? " del" : ""}" data-stk="${s.id}" title="${esc(s.n)}" ${k && !del ? `aria-pressed="${on}"` : ""} ${!k && !del ? "tabindex='-1'" : ""} ${k && !on && full && !del ? "disabled" : ""}>${stickerSvg(s)}<span>${esc(s.n)}</span></button>`;
  };
  let h = `<form method="dialog" class="dhead"><h2><span class="hi" style="--hc:var(--m5)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5.5z"/><path d="M12.5 20c0-4.5 3-7.5 7.5-7.5"/></svg></span>${k ? `Stiker · ${fmtShort(k)}` : "Buku stiker"}</h2>
    <button class="iconbtn sm" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></form>`;
  if (k)
    h += `<div class="splaced">${
      placed.length
        ? dayStickers(k)
            .map(
              (s, i) =>
                `<button class="sput" data-stk="${s.id}" style="--r:${tilt(k + i)}deg" aria-label="Lepas stiker ${esc(s.n)}" title="Lepas">${stickerSvg(s, 46)}<i>×</i></button>`
            )
            .join("")
        : `<span class="muted small">Belum ada stiker. Ketuk stiker di bawah untuk menempel (maksimal ${STK_MAX}).</span>`
    }</div>${full ? `<p class="muted small">Sudah ${STK_MAX} stiker. Lepas salah satu untuk mengganti.</p>` : ""}`;
  else
    h += `<p class="muted small">Buat stiker sendiri dari emoji atau tulisan. Tempel lewat tombol stiker di kalender atau di samping judul catatan.</p>`;
  h += `<p class="label">Stiker bawaan</p><div class="sgrid">${STICKERS.map(tile).join("")}</div>`;
  h += `<p class="label">Hewan</p><div class="sgrid">${ANIMALS.map(tile).join("")}</div>`;
  h += `<p class="label">Makanan</p><div class="sgrid">${SNACKS.map(tile).join("")}</div>`;
  h += `<p class="label">Lucu &amp; kata-kata</p><div class="sgrid">${CUTES.map(tile).join("")}</div>`;
  h += `<div class="lrow"><p class="label">Buatanmu</p>${cs.length ? `<button class="link small" id="stkEditBtn">${S.stkEdit ? "Selesai" : "Atur"}</button>` : ""}</div>`;
  h += `<div class="sgrid">${cs.map(tile).join("")}${
    !S.stkEdit && !S.stkMake && cs.length < STK_CUSTOM_MAX
      ? `<button class="stile new" id="stkMake"><span class="snew">+</span><span>Buat</span></button>`
      : ""
  }</div>`;
  if (S.stkEdit)
    h += `<p class="muted small">Ketuk stiker buatanmu untuk menghapusnya. Stiker itu juga dilepas dari semua tanggal.</p>`;
  if (S.stkMake) h += makerHtml();
  $("#dlgStk").innerHTML = h;
}

/* ===== Buat stiker ===== */
function makerHtml() {
  const m = S.stkNew;
  return `<div class="smake" id="smBox">
    <div class="seg"><button data-smk="emoji" aria-pressed="${m.kind === "emoji"}">Emoji</button><button data-smk="text" aria-pressed="${m.kind === "text"}">Tulisan</button></div>
    <div class="smrow"><span class="smprev" id="smPrev">${stickerSvg(previewStk(), 64)}</span>
      <div class="smfields"><label class="pf"><span>${m.kind === "emoji" ? "Emoji (ketik atau tempel 1 emoji)" : "Tulisan (maks. 6 huruf)"}</span><input id="smV" maxlength="${m.kind === "emoji" ? 12 : 6}" value="${esc(m.v)}" placeholder="${m.kind === "emoji" ? "🎂" : "UTS!"}"></label>
      <label class="pf"><span>Nama</span><input id="smN" maxlength="20" value="${esc(m.n)}" placeholder="Misalnya: Ulang tahun Ibu"></label></div></div>
    <div class="swatches">${STK_COLORS.map((c, i) => `<button class="sw" data-smc="${i}" style="--c:${c}" aria-pressed="${m.c === i}" aria-label="Warna ${i + 1}"></button>`).join("")}</div>
    <p class="pmsg" id="smMsg"></p>
    <div class="row"><button class="btn primary sm" id="smSave">Simpan stiker</button><button class="btn ghost sm" id="smCancel">Batal</button></div></div>`;
}
// Emoji diambil 1 karakter utuh saja (termasuk emoji gabungan seperti 👨‍👩‍👧).
function firstGrapheme(v) {
  if (window.Intl?.Segmenter) return [...new Intl.Segmenter().segment(v)][0]?.segment || "";
  return [...v][0] || "";
}
function cleanMakerValue() {
  const m = S.stkNew,
    v = m.v.trim();
  return m.kind === "emoji" ? firstGrapheme(v) : [...v.replace(/\s+/g, " ")].slice(0, 6).join("");
}
function previewStk() {
  const m = S.stkNew,
    v = cleanMakerValue();
  return { kind: m.kind, v: v || (m.kind === "emoji" ? "🙂" : "Aa"), c: STK_COLORS[m.c] };
}
function saveMaker() {
  const m = S.stkNew,
    v = cleanMakerValue();
  if (!v) {
    $("#smMsg").textContent = m.kind === "emoji" ? "Isi satu emoji dulu." : "Isi tulisannya dulu.";
    $("#smV").focus();
    return;
  }
  const s = {
    id: "c" + Date.now().toString(36),
    kind: m.kind,
    v,
    c: STK_COLORS[m.c],
    n: m.n.trim() || v,
  };
  S.stk.custom.push(s);
  const k = S.stkDay;
  if (k && (S.stk.placed[k] || []).length < STK_MAX)
    S.stk.placed[k] = [...(S.stk.placed[k] || []), s.id];
  if (!saveStk()) {
    S.stk.custom.pop();
    $("#smMsg").textContent = "Gagal menyimpan. Penyimpanan browser mungkin penuh.";
    return;
  }
  S.stkMake = false;
  renderStickersEverywhere();
}
function deleteCustom(id) {
  S.stk.custom = S.stk.custom.filter(s => s.id !== id);
  for (const [k, a] of Object.entries(S.stk.placed)) {
    const b = a.filter(x => x !== id);
    if (b.length) S.stk.placed[k] = b;
    else delete S.stk.placed[k];
  }
  if (!S.stk.custom.length) S.stkEdit = false;
  saveStk();
  renderStickersEverywhere();
}

/* ===== Buku stiker (Koleksi) ===== */
function renderStkBook() {
  const all = Object.entries(S.stk.placed),
    tk = todayKey(),
    count = {};
  all.forEach(([, a]) => a.forEach(id => (count[id] = (count[id] || 0) + 1)));
  const used = Object.entries(count)
    .map(([id, n]) => [stickerById(id), n])
    .filter(([s]) => s)
    .sort((a, b) => b[1] - a[1]);
  const total = used.reduce((x, [, n]) => x + n, 0),
    cs = S.stk.custom.length;
  $("#stkSum").textContent = total
    ? `${total} stiker tertempel di ${all.length} hari${cs ? ` · ${cs} stiker buatanmu` : ""}.`
    : `Belum ada stiker yang ditempel. Pakai tombol stiker di kalender atau di samping judul catatan.${cs ? ` Kamu punya ${cs} stiker buatan sendiri.` : ""}`;
  const soon = all
    .filter(([k]) => k > tk)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(0, 4);
  $("#stkUsed").innerHTML =
    (soon.length
      ? `<p class="label">Yang akan datang</p><div class="ssoon">${soon
          .map(
            ([k]) =>
              `<button class="ssoon-i" data-stkday="${k}">${dayStickers(k)
                .map(s => stickerSvg(s, 26))
                .join("")}<span><b>${esc(
                dayStickers(k)
                  .map(s => s.n)
                  .join(", ")
              )}</b><small>${fmtShort(k)} · ${Math.round((fromKey(k) - fromKey(tk)) / 864e5)} hari lagi</small></span></button>`
          )
          .join("")}</div>`
      : "") +
    (used.length
      ? `<p class="label">Paling sering</p><div class="sused">${used
          .slice(0, 12)
          .map(
            ([s, n]) =>
              `<span class="sused-i" title="${esc(s.n)}">${stickerSvg(s, 40)}<b class="tnum">${n}×</b></span>`
          )
          .join("")}</div>`
      : "");
}

/* ===== Mode tempel di kalender ===== */
function setStkMode(on) {
  S.stkMode = on;
  $("#stkMode").setAttribute("aria-pressed", on);
  $("#stkHint").hidden = !on;
  renderMonth();
}
// Saat mode tempel aktif, ketukan tanggal membuka laci stiker, bukan memilih tanggal untuk ditulis.
document.addEventListener(
  "click",
  e => {
    const d = S.stkMode && e.target.closest("#cal [data-day]");
    if (!d) return;
    e.stopImmediatePropagation();
    openStk(d.dataset.day);
  },
  true
);

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "stkMode") {
    setStkMode(!S.stkMode);
    return;
  }
  if (t.id === "stkModeOff") {
    setStkMode(false);
    return;
  }
  if (t.dataset.stkday) {
    openStk(t.dataset.stkday);
    return;
  }
  if (t.id === "stkBook") {
    openStk("");
    S.stkNew = { kind: "emoji", v: "", c: 0, n: "" };
    S.stkMake = true;
    renderStkDlg();
    return;
  }
  if (t.dataset.stk) {
    const id = t.dataset.stk,
      s = stickerById(id);
    if (S.stkEdit && isCustom(id)) deleteCustom(id);
    else if (S.stkDay) toggleSticker(S.stkDay, id);
    return;
  }
  if (t.id === "stkEditBtn") {
    S.stkEdit = !S.stkEdit;
    S.stkMake = false;
    renderStkDlg();
    return;
  }
  if (t.id === "stkMake") {
    S.stkNew = { kind: "emoji", v: "", c: 0, n: "" };
    S.stkMake = true;
    renderStkDlg();
    $("#smV").focus();
    return;
  }
  if (t.dataset.smk) {
    S.stkNew.kind = t.dataset.smk;
    S.stkNew.v = "";
    renderStkDlg();
    $("#smV").focus();
    return;
  }
  if (t.dataset.smc) {
    S.stkNew.c = +t.dataset.smc;
    document.querySelectorAll("[data-smc]").forEach(b => b.setAttribute("aria-pressed", b === t));
    $("#smPrev").innerHTML = stickerSvg(previewStk(), 64);
    return;
  }
  if (t.id === "smSave") {
    saveMaker();
    return;
  }
  if (t.id === "smCancel") {
    S.stkMake = false;
    renderStkDlg();
    return;
  }
});
// Saat mengetik di pembuat stiker, cukup perbarui pratinjau supaya kursor tidak hilang.
document.addEventListener("input", e => {
  const id = e.target.id;
  if (id !== "smV" && id !== "smN") return;
  S.stkNew[id === "smV" ? "v" : "n"] = e.target.value;
  $("#smPrev").innerHTML = stickerSvg(previewStk(), 64);
  $("#smMsg").textContent = "";
});
document.addEventListener("keydown", e => {
  if ((e.target.id === "smV" || e.target.id === "smN") && e.key === "Enter") {
    e.preventDefault();
    saveMaker();
  }
});
