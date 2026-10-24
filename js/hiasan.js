/* Hiasan: koleksi stiker, hiasan halaman, dan template bulan yang senada dengan tampilan "buku terbuka"
   (palet Lumut & Pasir). Dimuat setelah stiker.js dan sebelum hias.js.
   Stiker dan hiasan lama (hewan, makanan, selotip warna-warni) ada di js/lama.js dan hanya dimuat
   kalau masih ada yang tertempel (lihat muatLama di bawah). */

/* ===== Mesin template halaman bulan ===== */
// Bentuk tanda rasa tiap template (viewBox 0 0 24 24). Dipakai di CSS (mask) dan di gambar PNG (Path2D).
const SHAPES = {};
// Bentuk dengan lubang memakai aturan evenodd (belum ada yang memakainya).
const SHAPE_EVENODD = {};
const shapeUrl = k =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='${SHAPE_EVENODD[k] ? "evenodd" : "nonzero"}' d='${SHAPES[k]}'/></svg>`)}")`;

// Template: warna halaman, pola latar, bentuk tanda rasa, dan tiga hiasan tetap di sudut.
// bg: warna dasar atau [atas, bawah]; dot: [warna, jari-jari, jarak]; stripe: warna garis miring.
const CUTE_TPL = {};
// Latar CSS dari spesifikasi yang sama dengan gambar PNG (cuteBg di js/hias.js).
function cuteCss(t) {
  const L = [];
  if (t.dot)
    L.push(
      `radial-gradient(${t.dot[0]} ${t.dot[1]}px, transparent ${t.dot[1] + 0.5}px) 0 0 / ${t.dot[2]}px ${t.dot[2]}px`
    );
  if (t.stripe)
    L.push(`repeating-linear-gradient(45deg, ${t.stripe} 0 10px, transparent 10px 20px)`);
  L.push(Array.isArray(t.bg) ? `linear-gradient(${t.bg[0]}, ${t.bg[1]})` : t.bg);
  return L.join(", ");
}

// Tepi selotip bergerigi (viewBox 0 0 120 36). Dipakai selotip baru di sini dan selotip lama di js/lama.js.
const TAPE =
  "M3 5L9 2l4 3 4-3 4 3h78l4-3 4 3 4-3 4 3 4-2v6l-3 5 3 5-3 5 3 5v4l-4-2-4 3-4-3-4 3-4-3H21l-4 3-4-3-4 3-4-3-3 2v-5l3-5-3-5 3-5-3-5z";

// Warna gambar: lumut, sage, pasir, madu, peach, tanah liat, biru kabut, lavender, mawar, krem, tinta, kayu.
const HC = {
  moss: "#6a7b4e",
  mossD: "#55643d",
  sage: "#a9b98a",
  sageL: "#cfd8b8",
  sand: "#e2c98e",
  honey: "#d4ad66",
  peach: "#d9a77f",
  clay: "#c0866a",
  blue: "#7f8fb7",
  mist: "#aebbd2",
  mistL: "#d5dde9",
  lav: "#b3a9cc",
  rose: "#c99a9f",
  roseL: "#e6c9c8",
  cream: "#f6f1e3",
  paper: "#fbf9f2",
  ink: "#4a4d40",
  bark: "#8a6f55",
};
const mk = (id, n, svg, vb = "0 0 64 64") => ({ id, n, vb, svg, kind: "deco" });

/* ===== Alam ===== */
const NATURE = [
  mk(
    "n-leaf",
    "Daun",
    `<path d="M32 5C17 15 11 31 16 47c4 8 16 12 16 12s12-4 16-12c5-16-1-32-16-42z" fill="${HC.sage}"/><path d="M32 9v50M32 24l-9-7M32 33l-11-8M32 42l-10-7M32 24l9-7M32 33l11-8M32 42l10-7" stroke="${HC.mossD}" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".55"/>`
  ),
  mk(
    "n-fern",
    "Pakis",
    `<path d="M20 60C26 42 34 26 46 6" stroke="${HC.mossD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>${[
      0, 1, 2, 3, 4, 5,
    ]
      .map(i => {
        const t = i / 6,
          x = 20 + 26 * t + 3,
          y = 58 - 52 * t,
          s = 1 - t * 0.55;
        return `<ellipse cx="${x - 7 * s}" cy="${y - 1}" rx="${7 * s}" ry="${2.8 * s}" transform="rotate(-25 ${x - 7 * s} ${y - 1})" fill="${HC.moss}"/><ellipse cx="${x + 6 * s}" cy="${y - 4}" rx="${7 * s}" ry="${2.8 * s}" transform="rotate(-60 ${x + 6 * s} ${y - 4})" fill="${HC.sage}"/>`;
      })
      .join("")}`
  ),
  mk(
    "n-sprig",
    "Ranting beri",
    `<path d="M12 56C24 44 34 30 52 10" stroke="${HC.bark}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M24 44c-9-1-13-7-12-13 7 1 11 6 12 13zM36 30c-1-8 3-14 9-15 1 7-3 12-9 15zM30 38c8-3 14 0 16 5-7 3-13 1-16-5z" fill="${HC.sage}"/><circle cx="47" cy="20" r="4.2" fill="${HC.clay}"/><circle cx="53" cy="15" r="3.6" fill="${HC.clay}"/><circle cx="51" cy="24" r="3.2" fill="${HC.peach}"/>`
  ),
  mk(
    "n-flower",
    "Bunga kering",
    `<path d="M32 60V30" stroke="${HC.moss}" stroke-width="2.4" stroke-linecap="round"/><path d="M32 50c-7 0-11-5-11-9 6 0 10 4 11 9z" fill="${HC.sage}"/>${[
      0, 72, 144, 216, 288,
    ]
      .map(
        a =>
          `<ellipse cx="32" cy="14" rx="6" ry="9" fill="${HC.rose}" transform="rotate(${a} 32 23)"/>`
      )
      .join(
        ""
      )}<circle cx="32" cy="23" r="5" fill="${HC.honey}"/><circle cx="32" cy="23" r="2" fill="${HC.bark}" opacity=".5"/>`
  ),
  mk(
    "n-sprout",
    "Tunas",
    `<ellipse cx="32" cy="54" rx="20" ry="6" fill="${HC.bark}" opacity=".45"/><path d="M32 52V30" stroke="${HC.moss}" stroke-width="3" stroke-linecap="round"/><path d="M32 34C30 22 20 17 11 19c1 10 9 16 21 15z" fill="${HC.sage}"/><path d="M32 30c2-11 11-16 20-14-1 9-8 15-20 14z" fill="${HC.moss}"/>`
  ),
  mk(
    "n-mushroom",
    "Jamur",
    `<path d="M26 34h12l3 20c0 4-18 4-18 0z" fill="${HC.cream}" stroke="#e3dcc6" stroke-width="1.5"/><path d="M8 34C8 19 19 10 32 10s24 9 24 24z" fill="${HC.peach}"/><circle cx="22" cy="23" r="3.4" fill="${HC.cream}"/><circle cx="35" cy="18" r="2.6" fill="${HC.cream}"/><circle cx="44" cy="27" r="3" fill="${HC.cream}"/><path d="M8 34h48" stroke="${HC.clay}" stroke-width="2" stroke-linecap="round"/>`
  ),
  mk(
    "n-pebbles",
    "Batu tersusun",
    `<ellipse cx="32" cy="51" rx="20" ry="9" fill="${HC.mist}"/><ellipse cx="31" cy="36" rx="14" ry="7.5" fill="${HC.sand}"/><ellipse cx="33" cy="24" rx="9" ry="5.5" fill="${HC.sageL}"/><ellipse cx="32" cy="14" rx="5.5" ry="4" fill="${HC.peach}"/><path d="M18 49c6 3 22 3 28 0M22 35c4 2 14 2 18 0" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".5"/>`
  ),
  mk(
    "n-dandelion",
    "Dandelion",
    `<path d="M32 60C31 46 32 38 32 30" stroke="${HC.moss}" stroke-width="2.2" stroke-linecap="round" fill="none"/>${Array.from(
      { length: 14 },
      (_, i) => {
        const a = (i / 14) * Math.PI * 2,
          x = 32 + Math.cos(a) * 15,
          y = 22 + Math.sin(a) * 15;
        return `<path d="M32 22L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${HC.bark}" stroke-width="1" opacity=".45"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="${HC.paper}" stroke="#d8d1bd" stroke-width="1"/>`;
      }
    ).join("")}<circle cx="32" cy="22" r="3.4" fill="${HC.honey}"/>`
  ),
  mk(
    "n-pine",
    "Cemara",
    `<rect x="29" y="48" width="6" height="11" rx="2" fill="${HC.bark}"/><path d="M32 5L46 26H38L50 40H40L52 52H12L24 40H14L26 26H18z" fill="${HC.moss}"/><path d="M32 5L46 26H38L50 40H40L52 52H32z" fill="${HC.mossD}" opacity=".35"/>`
  ),
];

/* ===== Langit ===== */
const SKY = [
  mk(
    "s-rembulan",
    "Rembulan",
    `<defs><mask id="hmRb"><rect width="64" height="64" fill="#fff"/><circle cx="41" cy="22" r="16" fill="#000"/></mask></defs><circle cx="29" cy="35" r="21" fill="${HC.blue}" mask="url(#hmRb)"/><path d="M17 38q3 2.6 6 0" fill="none" stroke="${HC.paper}" stroke-width="2.4" stroke-linecap="round"/><path d="M47 10l1.6 5.4 5.4 1.6-5.4 1.6L47 24l-1.6-5.4L40 17l5.4-1.6z" fill="${HC.sand}"/>`
  ),
  mk(
    "s-moon",
    "Bulan sabit",
    `<path d="M40 6a26 26 0 1 0 18 42A21 21 0 0 1 40 6z" fill="${HC.sand}"/><circle cx="28" cy="40" r="3" fill="${HC.honey}" opacity=".6"/><circle cx="20" cy="28" r="2" fill="${HC.honey}" opacity=".6"/>`
  ),
  mk(
    "s-stars",
    "Kerlip",
    `<path d="M24 8l3.2 11.8L39 23l-11.8 3.2L24 38l-3.2-11.8L9 23l11.8-3.2z" fill="${HC.honey}"/><path d="M46 34l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="${HC.sand}"/><circle cx="48" cy="14" r="2.4" fill="${HC.sand}"/>`
  ),
  mk(
    "s-star",
    "Bintang",
    `<path d="M32 6l7.6 15.6 17.2 2.5-12.4 12.1 2.9 17.1L32 45.2l-15.3 8.1 2.9-17.1L7.2 24.1l17.2-2.5z" fill="${HC.sand}" stroke="${HC.honey}" stroke-width="2" stroke-linejoin="round"/>`
  ),
  mk(
    "s-cloud",
    "Awan",
    `<path d="M17 46a10 10 0 0 1-1.5-19.9A14 14 0 0 1 42.5 22 9.5 9.5 0 0 1 49 46z" fill="${HC.paper}" stroke="${HC.mist}" stroke-width="2.5" stroke-linejoin="round"/>`
  ),
  mk(
    "s-sun",
    "Matahari",
    `<g stroke="${HC.honey}" stroke-width="3" stroke-linecap="round">${[
      0, 45, 90, 135, 180, 225, 270, 315,
    ]
      .map(a => `<path d="M32 6v7" transform="rotate(${a} 32 32)"/>`)
      .join("")}</g><circle cx="32" cy="32" r="13" fill="${HC.sand}"/>`
  ),
  mk(
    "s-rain",
    "Hujan",
    `<path d="M16 34a9 9 0 0 1-1.3-17.9A12.5 12.5 0 0 1 38.8 13 8.5 8.5 0 0 1 45 34z" fill="${HC.mistL}"/><path d="M20 42l-3 8M31 42l-3 8M42 42l-3 8M25 52l-2 5M36 52l-2 5" stroke="${HC.blue}" stroke-width="2.6" stroke-linecap="round"/>`
  ),
  mk(
    "s-rainbow",
    "Pelangi senja",
    `<g fill="none" stroke-linecap="round" stroke-width="6"><path d="M8 50a24 24 0 0 1 48 0" stroke="${HC.peach}"/><path d="M15 50a17 17 0 0 1 34 0" stroke="${HC.sand}"/><path d="M22 50a10 10 0 0 1 20 0" stroke="${HC.sage}"/></g>`
  ),
  mk(
    "s-drop",
    "Embun",
    `<path d="M32 6s17 19 17 31a17 17 0 0 1-34 0C15 25 32 6 32 6z" fill="${HC.mist}"/><path d="M24 38a8 8 0 0 0 6 8" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/>`
  ),
];

/* ===== Meja (alat tulis) ===== */
const tape = (id, n, fill, deco) =>
  mk(id, n, `<path d="${TAPE}" fill="${fill}" opacity=".88"/>${deco}`, "0 0 120 36");
const DESK = [
  tape(
    "t-tape-sage",
    "Selotip lumut",
    HC.sage,
    `<path d="M18 4l-8 28M38 4l-8 28M58 4l-8 28M78 4l-8 28M98 4l-8 28M116 6l-7 26" stroke="#fff" stroke-width="4" opacity=".35"/>`
  ),
  tape(
    "t-tape-mist",
    "Selotip kabut",
    HC.mist,
    `<g fill="#fff" opacity=".6">${[16, 36, 56, 76, 96].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 24 : 12}" r="2.6"/>`).join("")}</g>`
  ),
  tape(
    "t-tape-sand",
    "Selotip pasir",
    HC.sand,
    `<path d="M8 13h104M8 23h104M30 4v28M60 4v28M90 4v28" stroke="#fff" stroke-width="2" opacity=".5"/>`
  ),
  tape(
    "t-tape-rose",
    "Selotip mawar",
    HC.roseL,
    `<g fill="${HC.rose}" opacity=".55">${[20, 50, 80, 108].map(x => `<path d="M${x} 13c-2-3-6-1-4 2l4 4 4-4c2-3-2-5-4-2z"/>`).join("")}</g>`
  ),
  mk(
    "t-note",
    "Kertas tempel",
    `<path d="M10 8h44v36L42 56H10z" fill="${HC.sand}"/><path d="M42 56V44h12z" fill="${HC.honey}"/><path d="M17 20h28M17 28h28M17 36h18" stroke="${HC.bark}" stroke-width="2" stroke-linecap="round" opacity=".4"/>`
  ),
  mk(
    "t-clip",
    "Penjepit kertas",
    `<path d="M24 50V16a8 8 0 0 1 16 0v32a5 5 0 0 1-10 0V20" fill="none" stroke="${HC.bark}" stroke-width="3" stroke-linecap="round"/>`,
    "0 0 64 64"
  ),
  mk(
    "t-pin",
    "Paku pines",
    `<ellipse cx="36" cy="50" rx="10" ry="3" fill="${HC.ink}" opacity=".15"/><path d="M32 36l4 14" stroke="${HC.ink}" stroke-width="2.4" stroke-linecap="round" opacity=".55"/><circle cx="31" cy="25" r="14" fill="${HC.clay}"/><circle cx="31" cy="25" r="8" fill="${HC.peach}"/><circle cx="26" cy="20" r="3.5" fill="#fff" opacity=".45"/>`
  ),
  mk(
    "t-stamp",
    "Prangko",
    `<rect x="10" y="8" width="44" height="50" rx="2" fill="${HC.paper}" stroke="#ddd4be" stroke-width="2" stroke-dasharray="3 3"/><rect x="16" y="14" width="32" height="38" fill="${HC.mistL}"/><defs><mask id="hmSt"><rect width="64" height="64" fill="#fff"/><circle cx="36" cy="27" r="8" fill="#000"/></mask></defs><circle cx="31" cy="31" r="10" fill="${HC.blue}" mask="url(#hmSt)"/><path d="M16 46h32" stroke="${HC.moss}" stroke-width="3"/>`
  ),
  mk(
    "t-pencil",
    "Pensil",
    `<g transform="rotate(-35 32 32)"><rect x="12" y="27" width="34" height="10" fill="${HC.sand}"/><rect x="12" y="27" width="34" height="3.4" fill="${HC.honey}"/><rect x="6" y="27" width="7" height="10" rx="2" fill="${HC.rose}"/><rect x="12" y="27" width="3" height="10" fill="${HC.mist}"/><path d="M46 27l10 5-10 5z" fill="#ead9bd"/><path d="M53 30.5l3 1.5-3 1.5z" fill="${HC.ink}"/></g>`
  ),
  mk(
    "t-tea",
    "Teh hangat",
    `<path d="M24 14c-3 4 3 6 0 10M32 12c-3 4 3 6 0 10M40 14c-3 4 3 6 0 10" stroke="${HC.mist}" stroke-width="2.4" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="55" rx="24" ry="5" fill="${HC.sageL}"/><path d="M14 30h34v8a17 17 0 0 1-34 0z" fill="${HC.paper}" stroke="#ddd4be" stroke-width="2"/><path d="M48 34h3a6 6 0 0 1 0 12h-4" fill="none" stroke="#ddd4be" stroke-width="3"/><path d="M16 36h30" stroke="${HC.sage}" stroke-width="3"/>`
  ),
  mk(
    "t-ribbon",
    "Pita pembatas",
    `<path d="M24 2h16v58l-8-8-8 8z" fill="${HC.moss}"/><path d="M28 2v52" stroke="#fff" stroke-width="1.5" opacity=".3"/>`
  ),
];

/* ===== Kata-kata, ditulis seperti di buku harian ===== */
const softWord = (id, n, txt, fill, w) =>
  mk(
    id,
    n,
    `<rect x="3" y="5" width="${w - 6}" height="34" rx="8" fill="${fill}"/><text x="${w / 2}" y="23" text-anchor="middle" dominant-baseline="central" font-family="'Fraunces', Georgia, serif" font-style="italic" font-size="19" font-weight="500" fill="${HC.ink}">${txt}</text>`,
    `0 0 ${w} 44`
  );
const WORDS = [
  softWord("k-pelan", "Pelan-pelan", "pelan-pelan", HC.sageL, 140),
  softWord("k-cukup", "Hari ini cukup", "hari ini cukup", HC.mistL, 156),
  softWord("k-terima", "Terima kasih", "terima kasih", HC.roseL, 140),
  softWord("k-napas", "Tarik napas", "tarik napas", "#efe2c4", 130),
  softWord("k-bangga", "Aku bangga", "aku bangga", "#ecd7c6", 126),
  softWord("k-besok", "Besok lagi", "besok lagi", HC.cream, 118),
];

// Semua hiasan baru, untuk pencarian id (stickerById di js/stiker.js).
const HIASAN = [...NATURE, ...SKY, ...DESK, ...WORDS];

/* ===== Bentuk tanda rasa (viewBox 0 0 24 24) ===== */
Object.assign(SHAPES, {
  leaf: "M21 3C11 3 3.5 8.5 3.5 16.5c0 1.6.4 3 1.1 4.1C5.8 20 7.2 19.6 9 19.6 16.6 19.6 21 12.4 21 3z",
  moon: "M14.5 2.5a9.5 9.5 0 1 0 7 14 7.6 7.6 0 0 1-7-14z",
  drop: "M12 2.5s7 7.6 7 12.5a7 7 0 0 1-14 0c0-4.9 7-12.5 7-12.5z",
  pebble:
    "M3.5 14c0-5.3 4.3-9 9.4-9 5 0 7.6 3.2 7.6 7.2 0 5.2-4.1 8.3-9.3 8.3-4.6 0-7.7-2.3-7.7-6.5z",
  cup: "M3.5 7.5h14v5.5a7 7 0 0 1-14 0zM17.5 9h1.2a3.2 3.2 0 0 1 0 6.4h-1.6v-2h1.6a1.2 1.2 0 0 0 0-2.4h-1.2zM2.5 20.5h16v1.6h-16z",
  seal:
    Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2,
        x = 12 + Math.cos(a) * 8.2,
        y = 12 + Math.sin(a) * 8.2;
      return `M${(x - 2.6).toFixed(2)} ${y.toFixed(2)}a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0z`;
    }).join("") + "M3.8 12a8.2 8.2 0 1 0 16.4 0a8.2 8.2 0 1 0-16.4 0z",
});

/* ===== Template bulan yang baru ===== */
// Format CUTE_TPL di atas: warna halaman, pola latar, bentuk tanda rasa, tiga hiasan tetap.
Object.assign(CUTE_TPL, {
  herba: {
    fg: "#3d4232",
    mu: "#7b7f6c",
    cell: "rgba(255,255,255,.62)",
    bg: "#f3f1e7",
    dot: ["#e3e1d2", 1.4, 18],
    shape: "leaf",
    motif: ["n-fern", "n-flower", "n-sprig"],
  },
  embun: {
    fg: "#33403d",
    mu: "#6f7d7a",
    cell: "rgba(255,255,255,.7)",
    bg: ["#ecf0ee", "#f5f3eb"],
    shape: "drop",
    motif: ["s-drop", "n-leaf", "s-cloud"],
  },
  kerikil: {
    fg: "#40423a",
    mu: "#7c7d70",
    cell: "rgba(255,255,255,.62)",
    bg: "#f1efe6",
    dot: ["#e2dfd2", 2, 22],
    shape: "pebble",
    motif: ["n-pebbles", "n-sprout", "n-mushroom"],
  },
  teh: {
    fg: "#4a3f35",
    mu: "#8b7c6c",
    cell: "rgba(255,255,255,.66)",
    bg: ["#f6efe4", "#f2ebdf"],
    stripe: "#f1e8da",
    shape: "cup",
    motif: ["t-tea", "t-note", "n-flower"],
  },
  kraft: {
    fg: "#473e31",
    mu: "#8a7b64",
    cell: "rgba(255,255,255,.5)",
    bg: "#e9e1cf",
    dot: ["rgba(120,90,50,.09)", 1, 9],
    shape: "seal",
    motif: ["t-tape-sage", "t-stamp", "t-clip"],
  },
  senyap: {
    fg: "#ebe9de",
    mu: "#a7a998",
    cell: "rgba(255,255,255,.07)",
    bg: ["#262b22", "#363d30"],
    dot: ["rgba(255,255,255,.2)", 1, 26],
    shape: "moon",
    motif: ["s-rembulan", "s-stars", "s-cloud"],
  },
});

/* ===== Hiasan lama ===== */
// Dipanggil di awal renderAll. Kalau ada id stiker yang tidak dikenal (hiasan dari versi lama, termasuk dari
// backup yang baru dipulihkan), js/lama.js dimuat sekali lalu semuanya digambar ulang.
function muatLama() {
  if (window.LEGACY_STK || muatLama.busy) return;
  const ids = [
    ...Object.values(S.stk.placed).flat(),
    ...Object.values(S.pages?.months || {}).flatMap(p => (p.deco || []).map(d => d.s)),
  ];
  if (!ids.some(id => !stickerById(id))) return;
  muatLama.busy = true;
  const sc = document.createElement("script");
  sc.src = "js/lama.js";
  sc.onload = () => renderAll();
  // Gagal dimuat (misalnya offline sebelum sempat tersimpan): tidak dicoba lagi sampai aplikasi dibuka ulang.
  sc.onerror = () => sc.remove();
  document.head.appendChild(sc);
}
