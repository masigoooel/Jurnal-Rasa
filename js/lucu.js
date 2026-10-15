/* Lucu: stiker tambahan (hewan baru, makanan, benda lucu, dan kata-kata) serta bentuk tanda rasa
   untuk template lucu. Semua stiker bisa ditempel di tanggal maupun di halaman bulan. */

// Hewan tambahan, digabung ke daftar ANIMALS dari hewan.js.
ANIMALS.push(
  ...[
    [
      "a-koala",
      "Koala",
      `<circle cx="13" cy="24" r="11" fill="#aab2bf"/><circle cx="51" cy="24" r="11" fill="#aab2bf"/><circle cx="13" cy="24" r="6" fill="#f1d6dc"/><circle cx="51" cy="24" r="6" fill="#f1d6dc"/><circle cx="32" cy="37" r="20" fill="#c6ccd6"/><ellipse cx="32" cy="41" rx="5" ry="6" fill="#3b3f4a"/>${kawaii({ ey: 33, dx: 10, my: 50 })}`,
    ],
    [
      "a-pig",
      "Babi",
      `<path d="M14 26l2-14 11 8zM50 26l-2-14-11 8z" fill="#ff9fb8"/><circle cx="32" cy="36" r="21" fill="#ffc2cf"/><ellipse cx="32" cy="43" rx="9" ry="6.5" fill="#ff9fb8"/><ellipse cx="28.5" cy="43" rx="1.8" ry="2.4" fill="#c4607a"/><ellipse cx="35.5" cy="43" rx="1.8" ry="2.4" fill="#c4607a"/>${kawaii({ ey: 32, dx: 10, mouth: false })}`,
    ],
    [
      "a-sheep",
      "Domba",
      `<g fill="#fff" stroke="#e6dcd3" stroke-width="1.5">${pts(
        "16,24 23,15 32,12 41,15 48,24 51,34 13,34 18,44 46,44"
      )
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`)
        .join(
          ""
        )}</g><ellipse cx="11" cy="36" rx="6" ry="3.5" fill="#d9b48a" transform="rotate(-20 11 36)"/><ellipse cx="53" cy="36" rx="6" ry="3.5" fill="#d9b48a" transform="rotate(20 53 36)"/><ellipse cx="32" cy="38" rx="13" ry="15" fill="#f1d3ae"/>${kawaii({ ey: 37, dx: 6, my: 45 })}`,
    ],
    [
      "a-mouse",
      "Tikus",
      `<circle cx="15" cy="20" r="12" fill="#c9ced8"/><circle cx="49" cy="20" r="12" fill="#c9ced8"/><circle cx="15" cy="20" r="7" fill="#ffc2cf"/><circle cx="49" cy="20" r="7" fill="#ffc2cf"/><circle cx="32" cy="39" r="19" fill="#dde1e8"/><circle cx="32" cy="44" r="2.4" fill="#ff8fab"/><path d="M8 42h11M9 48l10-3M56 42H45M55 48l-10-3" stroke="#9aa3b2" stroke-width="1.3" stroke-linecap="round"/>${kawaii({ ey: 37, dx: 7, my: 48, blush: false })}`,
    ],
    [
      "a-monkey",
      "Monyet",
      `<circle cx="10" cy="34" r="8" fill="#a8744f"/><circle cx="54" cy="34" r="8" fill="#a8744f"/><circle cx="10" cy="34" r="4.5" fill="#f1d3ae"/><circle cx="54" cy="34" r="4.5" fill="#f1d3ae"/><circle cx="32" cy="34" r="21" fill="#a8744f"/><g fill="#f1d3ae"><circle cx="25" cy="32" r="8"/><circle cx="39" cy="32" r="8"/><ellipse cx="32" cy="43" rx="13" ry="9"/></g>${kawaii({ ey: 32, dx: 7, my: 45 })}`,
    ],
    [
      "a-lion",
      "Singa",
      `<g fill="#e8954a">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        .map(a => `<circle cx="32" cy="10" r="8" transform="rotate(${a} 32 34)"/>`)
        .join(
          ""
        )}</g><circle cx="32" cy="34" r="20" fill="#e8954a"/><circle cx="32" cy="35" r="17" fill="#f8cf6a"/><path d="M29 40h6l-3 3z" fill="#8a5a2b"/>${kawaii({ ey: 33, dx: 7, my: 45 })}`,
    ],
    [
      "a-elephant",
      "Gajah",
      `<ellipse cx="12" cy="32" rx="11" ry="15" fill="#a9c1e0"/><ellipse cx="52" cy="32" rx="11" ry="15" fill="#a9c1e0"/><ellipse cx="12" cy="32" rx="6" ry="9" fill="#f1d6dc"/><ellipse cx="52" cy="32" rx="6" ry="9" fill="#f1d6dc"/><circle cx="32" cy="31" r="18" fill="#bcd0ea"/><path d="M27 38c0 10 1 17 8 20 4 1 5-4 1-5-4-1-3-7-3-15z" fill="#bcd0ea"/>${kawaii({ ey: 29, dx: 8, mouth: false })}`,
    ],
    [
      "a-dino",
      "Dino",
      `<path d="M12 28l5-11 5 9 5-12 5 12 5-12 5 12 5-9 5 11z" fill="#5fae6a"/><ellipse cx="32" cy="40" rx="22" ry="18" fill="#8fd18b"/><ellipse cx="32" cy="47" rx="12" ry="7" fill="#d6f0c4"/>${kawaii({ ey: 36, dx: 8, my: 43 })}`,
    ],
  ].map(([id, n, svg]) => ({ id, n, vb: "0 0 64 64", svg, kind: "deco" }))
);

// Makanan lucu.
const SNACKS = [
  [
    "f-donut",
    "Donat",
    `<path fill-rule="evenodd" d="M8 35a24 21 0 1 0 48 0a24 21 0 1 0-48 0zM27 27a5 4 0 1 0 10 0a5 4 0 1 0-10 0z" fill="#e9b47a"/><path fill-rule="evenodd" d="M10 31c1-10 10-17 22-17s21 7 22 17c-3 4-6 0-8 3s-6 1-8-1-5 3-8 0-5 3-8 0-6 2-8-1-4 2-6-1zM27 27a5 4 0 1 0 10 0a5 4 0 1 0-10 0z" fill="#f59ec2"/><g stroke-width="2" stroke-linecap="round"><path d="M17 23l2-2" stroke="#fff"/><path d="M44 20l2 2" stroke="#6aa3f0"/><path d="M22 16l2 1" stroke="#f6c443"/><path d="M41 28l2-1" stroke="#6cc58c"/></g>${kawaii({ ey: 41, dx: 7, my: 47 })}`,
  ],
  [
    "f-onigiri",
    "Onigiri",
    `<path d="M32 8c6 0 26 33 26 42 0 6-4 8-10 8H16c-6 0-10-2-10-8 0-9 20-42 26-42z" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><rect x="21" y="42" width="22" height="16" rx="2" fill="#2f4a3a"/>${kawaii({ ey: 31, dx: 7, my: 37 })}`,
  ],
  [
    "f-melon",
    "Semangka",
    `<path d="M4 20h56a28 28 0 0 1-56 0z" fill="#5aa86a"/><path d="M8 20h48a24 24 0 0 1-48 0z" fill="#fff4e3"/><path d="M11 20h42a21 21 0 0 1-42 0z" fill="#f2667a"/><g fill="#3b2b25">${pts(
      "20,27 44,27 26,36 38,36"
    )
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="2"/>`)
      .join("")}</g>${kawaii({ ey: 27, dx: 6, my: 33 })}`,
  ],
  [
    "f-avocado",
    "Alpukat",
    `<path d="M32 4c10 0 14 14 18 26s2 30-18 30S10 42 14 30 22 4 32 4z" fill="#5f9e45"/><path d="M32 9c7 0 11 12 14 22s1 25-14 25-17-15-14-25S25 9 32 9z" fill="#d6ec9a"/><circle cx="32" cy="43" r="9" fill="#a8744f"/><circle cx="29" cy="40" r="2.5" fill="#c8946a"/>${kawaii({ ey: 25, dx: 6, my: 31 })}`,
  ],
  [
    "f-toast",
    "Roti",
    `<path d="M12 27c-6 0-8-6-6-11s8-9 26-9 24 4 26 9 0 11-6 11v27a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#e3a764"/><path d="M16 28c-4 0-6-4-4-8s6-7 20-7 18 3 20 7 0 8-4 8v26H16z" fill="#fbe2b4"/>${kawaii({ ey: 37, dx: 7, my: 43 })}`,
  ],
  [
    "f-pudding",
    "Puding",
    `<ellipse cx="32" cy="54" rx="27" ry="6" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><path d="M18 22h28l6 31H12z" fill="#f6c766"/><path d="M18 23c0-8 6-12 14-12s14 4 14 12c-3 4-6 0-9 3s-6 0-9 2-7-1-10-5z" fill="#8a5a2b"/><circle cx="32" cy="9" r="4" fill="#e8524a"/>${kawaii({ ey: 38, dx: 7, my: 44 })}`,
  ],
  [
    "f-cookie",
    "Kue kering",
    `<circle cx="32" cy="32" r="25" fill="#e3a764"/><circle cx="32" cy="32" r="21" fill="#eab676"/><g fill="#6b4a2b">${pts(
      "20,20 42,18 47,34 17,40 30,48 44,47 27,15"
    )
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="2"/>`)
      .join("")}</g>${kawaii({ ey: 31, dx: 7, my: 37 })}`,
  ],
  [
    "f-milk",
    "Susu kotak",
    `<path d="M20 18l6-10h12l6 10z" fill="#9fc8f5"/><path d="M38 8l4-6" stroke="#f2668b" stroke-width="3" stroke-linecap="round"/><rect x="20" y="18" width="24" height="40" rx="3" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><path d="M20.8 44h22.4v11a2.2 2.2 0 0 1-2.2 2.2H23a2.2 2.2 0 0 1-2.2-2.2z" fill="#9fc8f5"/>${kawaii({ ey: 30, dx: 6, my: 36 })}`,
  ],
  [
    "f-macaron",
    "Makaron",
    `<ellipse cx="32" cy="22" rx="24" ry="12" fill="#ffb3c9"/><rect x="10" y="28" width="44" height="9" rx="4.5" fill="#fff4e3"/><ellipse cx="32" cy="43" rx="24" ry="12" fill="#ffb3c9"/><path d="M14 33h36" stroke="#f59ec2" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round"/>${kawaii({ ey: 43, dx: 7, my: 49 })}`,
  ],
  [
    "f-sushi",
    "Sushi",
    `<rect x="8" y="30" width="48" height="22" rx="10" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><path d="M8 32c4-14 44-14 48 0-4 6-44 6-48 0z" fill="#ff9a6b"/><path d="M19 23l4 7M29 21l2 8M38 21l1 8M47 24l-3 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>${kawaii({ ey: 42, dx: 7, my: 47 })}`,
  ],
].map(([id, n, svg]) => ({ id, n, vb: "0 0 64 64", svg, kind: "deco" }));

// Kata-kata dalam gelembung. Hurufnya tebal dan pendek supaya terbaca walau stikernya kecil.
const word = (w, txt, fill, fs = 22) => ({
  vb: `0 0 ${w} 44`,
  svg: `<rect x="3" y="5" width="${w - 6}" height="34" rx="17" fill="${fill}" stroke="#3b3f4a" stroke-width="2.5"/><text x="${w / 2}" y="23" text-anchor="middle" dominant-baseline="central" font-family="'Bricolage Grotesque', system-ui, sans-serif" font-size="${fs}" font-weight="800" fill="#3b3f4a">${txt}</text>`,
});

// Benda lucu, cuaca, dan kata-kata.
const CUTES = [
  [
    "c-star",
    "Bintang lucu",
    "0 0 64 64",
    `<path d="M32 4l8.5 17.5 19 2.5-14 13.5 3.5 19L32 47.5 15 56.5l3.5-19L4.5 24l19-2.5z" fill="#ffd45e" stroke="#e8a92e" stroke-width="2" stroke-linejoin="round"/>${kawaii({ ey: 33, dx: 6, my: 39 })}`,
  ],
  [
    "c-moon",
    "Bulan tidur",
    "0 0 64 64",
    `<path d="M26.7 8.2A26 26 0 1 0 54.8 41.9A22 22 0 0 1 26.7 8.2z" fill="#ffe08a" stroke="#f0bf4c" stroke-width="1.5"/><path d="M10 33q3 3 6 1M19 43q3 2 6-1" stroke="#2b2b2b" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="41" rx="3" ry="2" fill="#ff8fab" opacity=".7"/><text x="46" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#8e9bd8">z</text><text x="54" y="8" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#8e9bd8">z</text>`,
  ],
  [
    "c-cloud",
    "Awan lucu",
    "0 0 64 64",
    `<path d="M15 50a11 11 0 0 1-1-22 14 14 0 0 1 27-6 11 11 0 0 1 15 10 9 9 0 0 1-2 18z" fill="#fff" stroke="#c6d4e8" stroke-width="2" stroke-linejoin="round"/>${kawaii({ ey: 38, dx: 6, my: 43 })}`,
  ],
  [
    "c-heart",
    "Hati lucu",
    "0 0 64 64",
    `<path d="M32 57S5 41 5 22a13.5 13.5 0 0 1 27-6 13.5 13.5 0 0 1 27 6c0 19-27 35-27 35z" fill="#ff7f9e"/><ellipse cx="16" cy="19" rx="3" ry="5" fill="#fff" opacity=".5" transform="rotate(30 16 19)"/>${kawaii({ ey: 31, dx: 7, my: 37 })}`,
  ],
  [
    "c-rain",
    "Tetes hujan",
    "0 0 64 64",
    `<path d="M32 4C24 18 14 28 14 40a18 18 0 0 0 36 0C50 28 40 18 32 4z" fill="#8fd3f4"/><ellipse cx="23" cy="36" rx="2.5" ry="5" fill="#fff" opacity=".6"/>${kawaii({ ey: 40, dx: 6, my: 46 })}`,
  ],
  [
    "c-candy",
    "Permen",
    "0 0 64 64",
    `<path d="M20 32L4 21v22zM44 32l16-11v22z" fill="#f59ec2"/><circle cx="32" cy="32" r="15" fill="#ffb3c9"/><path d="M22 25c6-4 14-4 20 3M20 35c8 4 16 4 24-2" stroke="#fff" stroke-width="3" fill="none" opacity=".75" stroke-linecap="round"/>`,
  ],
  [
    "c-lolly",
    "Lolipop",
    "0 0 64 64",
    `<path d="M32 38v24" stroke="#e6dcd3" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="21" r="18" fill="#8fd3f4"/><path d="M32 21m-4 0a4 4 0 1 1 8 0a8 8 0 1 1-16 0a12 12 0 1 1 24 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 43l-8-5v10zM32 43l8-5v10z" fill="#f2668b"/>`,
  ],
  [
    "c-bone",
    "Tulang",
    "0 0 64 32",
    `<g fill="#e3d3b8"><circle cx="10" cy="10" r="8.5"/><circle cx="10" cy="22" r="8.5"/><circle cx="54" cy="10" r="8.5"/><circle cx="54" cy="22" r="8.5"/><rect x="10" y="9.5" width="44" height="13"/></g><g fill="#fff8ec"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="22" r="7"/><circle cx="54" cy="10" r="7"/><circle cx="54" cy="22" r="7"/><rect x="10" y="11" width="44" height="10"/></g>`,
  ],
  [
    "c-shell",
    "Kerang",
    "0 0 64 64",
    `<path d="M24 52h16l-8 9z" fill="#f0a88a"/><path d="M32 6C14 6 4 26 8 46l24 10 24-10c4-20-6-40-24-40z" fill="#ffc9b0"/><path d="M32 8v47M21 10l6 45M43 10l-6 45M10 24l15 30M54 24L39 54" stroke="#f0a88a" stroke-width="2" stroke-linecap="round"/>`,
  ],
  [
    "c-letter",
    "Surat cinta",
    "0 0 64 64",
    `<rect x="6" y="14" width="52" height="36" rx="4" fill="#fff" stroke="#e6dcd3" stroke-width="2"/><path d="M8 16l24 18 24-18" stroke="#e6dcd3" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M32 42s-7-4-7-9a3.5 3.5 0 0 1 7-1.5 3.5 3.5 0 0 1 7 1.5c0 5-7 9-7 9z" fill="#f2668b"/>`,
  ],
  [
    "c-plant",
    "Pot tanaman",
    "0 0 64 64",
    `<path d="M32 30c-2-10-10-16-18-14 0 8 8 14 18 14zM32 30c2-12 10-18 20-16 0 9-9 16-20 16z" fill="#6cc58c"/><path d="M32 32V22" stroke="#5aa86a" stroke-width="3"/><path d="M16 34h32l-4 24H20z" fill="#f0a272"/><rect x="14" y="30" width="36" height="7" rx="2" fill="#e58b5a"/>${kawaii({ ey: 45, dx: 6, my: 51 })}`,
  ],
  [
    "c-camera",
    "Kamera",
    "0 0 64 64",
    `<rect x="14" y="12" width="14" height="8" rx="2" fill="#6a95cc"/><rect x="6" y="18" width="52" height="36" rx="8" fill="#8fb7e8"/><circle cx="34" cy="36" r="12" fill="#fff"/><circle cx="34" cy="36" r="8" fill="#3b3f4a"/><circle cx="31" cy="33" r="2.5" fill="#fff"/><circle cx="50" cy="25" r="2.5" fill="#ffe08a"/>`,
  ],
  [
    "c-book",
    "Buku",
    "0 0 64 64",
    `<path d="M32 16c-8-6-18-6-26-4v40c8-2 18-2 26 4 8-6 18-6 26-4V12c-8-2-18-2-26 4z" fill="#fff" stroke="#b99cf2" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 16v40" stroke="#b99cf2" stroke-width="2.5"/><path d="M12 22h14M12 28h14M12 34h10M38 22h14M38 28h14M38 34h10" stroke="#d9cdf7" stroke-width="2" stroke-linecap="round"/>`,
  ],
  ["w-yay", "Yay!", ...Object.values(word(80, "Yay!", "#ffd45e"))],
  ["w-semangat", "Semangat!", ...Object.values(word(132, "Semangat!", "#9be2c8"))],
  ["w-love", "Love", ...Object.values(word(86, "Love ♥", "#ffb3c9", 20))],
  ["w-wah", "Wah!", ...Object.values(word(80, "Wah!", "#9fc8f5"))],
  ["w-hebat", "Hebat!", ...Object.values(word(100, "Hebat!", "#ffc9b0"))],
].map(([id, n, vb, svg]) => ({ id, n, vb, svg, kind: "deco" }));

// Bentuk tanda rasa untuk template lucu (viewBox 0 0 24 24). Dipakai di CSS (mask) dan di gambar PNG (Path2D).
const SHAPES = {
  candy: "M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0zM8.6 10.4L3 7v10l5.6-3.4zM15.4 10.4L21 7v10l-5.6-3.4z",
  heart: "M12 21s-9-5.6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-9 12-9 12z",
  flower: [0, 72, 144, 216, 288]
    .map(a => {
      const r = (a - 90) * (Math.PI / 180),
        x = 12 + Math.cos(r) * 6.2,
        y = 12.6 + Math.sin(r) * 6.2;
      return `M${(x - 4.6).toFixed(2)} ${y.toFixed(2)}a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0z`;
    })
    .join(""),
  paw: "M2.5 10.5a2.6 2.9 0 1 0 5.2 0a2.6 2.9 0 1 0-5.2 0zM6.9 5.5a2.6 3 0 1 0 5.2 0a2.6 3 0 1 0-5.2 0zM11.9 5.5a2.6 3 0 1 0 5.2 0a2.6 3 0 1 0-5.2 0zM16.3 10.5a2.6 2.9 0 1 0 5.2 0a2.6 2.9 0 1 0-5.2 0zM6.5 17a5.5 4.6 0 1 0 11 0a5.5 4.6 0 1 0-11 0z",
  bubble: "M2.5 12a9.5 9.5 0 1 0 19 0a9.5 9.5 0 1 0-19 0zM6.6 9.2a2 2.6 0 1 0 4 0a2 2.6 0 1 0-4 0z",
  cloud: "M6.5 19a4.5 4.5 0 0 1-.7-8.9 6.5 6.5 0 0 1 12.4 1.4A3.8 3.8 0 0 1 17.6 19z",
};
// Bentuk dengan lubang (gelembung punya kilau) memakai aturan evenodd.
const SHAPE_EVENODD = { bubble: true };
const shapeUrl = k =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='${SHAPE_EVENODD[k] ? "evenodd" : "nonzero"}' d='${SHAPES[k]}'/></svg>`)}")`;

// Template lucu: warna halaman, pola latar, bentuk tanda rasa, dan tiga hiasan tetap di sudut.
// bg: warna dasar atau [atas, bawah]; dot: [warna, jari-jari, jarak]; stripe: warna garis miring.
const CUTE_TPL = {
  permen: {
    fg: "#5a3848",
    mu: "#a07a8c",
    cell: "rgba(255,255,255,.78)",
    bg: "#fff0f5",
    stripe: "#ffe0eb",
    shape: "candy",
    motif: ["c-lolly", "c-candy", "f-macaron"],
  },
  hati: {
    fg: "#5b2f3a",
    mu: "#a8737f",
    cell: "rgba(255,255,255,.72)",
    bg: "#fff1f3",
    dot: ["#ffd3dc", 1.6, 18],
    shape: "heart",
    motif: ["c-heart", "c-letter", "bow"],
  },
  kebun: {
    fg: "#2f4a2c",
    mu: "#6f8a68",
    cell: "rgba(255,255,255,.68)",
    bg: "#f1f8ea",
    dot: ["#d9edcb", 2, 20],
    shape: "flower",
    motif: ["a-bee", "tulip", "a-butterfly"],
  },
  kaki: {
    fg: "#4a3b2c",
    mu: "#8f7a64",
    cell: "rgba(255,255,255,.72)",
    bg: "#fbf4ea",
    dot: ["#efdfc8", 2, 24],
    shape: "paw",
    motif: ["a-cat", "c-bone", "a-dog"],
  },
  laut: {
    fg: "#1f3c55",
    mu: "#55758e",
    cell: "rgba(255,255,255,.58)",
    bg: ["#e3f5ff", "#b9dff5"],
    dot: ["rgba(255,255,255,.75)", 2.5, 46],
    shape: "bubble",
    motif: ["a-whale", "c-shell", "a-fish"],
  },
  awan: {
    fg: "#3a3f63",
    mu: "#7a7fa6",
    cell: "rgba(255,255,255,.74)",
    bg: ["#e4efff", "#fbefff"],
    shape: "cloud",
    motif: ["c-cloud", "rainbow", "c-star"],
  },
};
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
