/* Hewan: stiker hewan lucu (bisa ditempel di tanggal maupun di halaman bulan) dan hiasan tambahan.
   Semua digambar sebagai SVG 64×64 supaya tajam di semua ukuran dan bisa ikut tersimpan di gambar PNG. */

// Daftar titik "x,y x,y ..." jadi [[x, y], ...].
const pts = t => t.split(" ").map(p => p.split(",").map(Number));

// Wajah kawaii: dua mata berkilau, pipi merona, dan mulut kecil "w". cx = tengah wajah.
function kawaii({ cx = 32, ey = 34, dx = 8, my = ey + 6, mouth = true, blush = true } = {}) {
  let h = [cx - dx, cx + dx]
    .map(
      x =>
        `<circle cx="${x}" cy="${ey}" r="2.6" fill="#2b2b2b"/><circle cx="${x - 0.9}" cy="${ey - 0.9}" r=".9" fill="#fff"/>`
    )
    .join("");
  if (blush)
    h += `<ellipse cx="${cx - dx - 5}" cy="${ey + 5}" rx="3.6" ry="2.2" fill="#ff8fab" opacity=".7"/><ellipse cx="${cx + dx + 5}" cy="${ey + 5}" rx="3.6" ry="2.2" fill="#ff8fab" opacity=".7"/>`;
  if (mouth)
    h += `<path d="M${cx - 3} ${my}q1.5 2 3 0q1.5 2 3 0" fill="none" stroke="#2b2b2b" stroke-width="1.6" stroke-linecap="round"/>`;
  return h;
}

// [id, nama, isi SVG] dengan viewBox 0 0 64 64
const ANIMALS = [
  [
    "a-cat",
    "Kucing",
    `<path d="M13 30L15 8l14 11zM51 30L49 8 35 19z" fill="#f4a95f"/><path d="M17 24l1-11 7 6zM47 24l-1-11-7 6z" fill="#ffc2cf"/><circle cx="32" cy="36" r="21" fill="#f4a95f"/><path d="M24 17c2 2 2 5 0 7M32 15v6M40 17c-2 2-2 5 0 7" stroke="#d98a43" stroke-width="2.4" fill="none" stroke-linecap="round"/>${kawaii()}<path d="M7 37h9M8 43l8-2M57 37h-9M56 43l-8-2" stroke="#8a5a2b" stroke-width="1.3" stroke-linecap="round"/>`,
  ],
  [
    "a-dog",
    "Anjing",
    `<circle cx="32" cy="35" r="20" fill="#f1d3ae"/><ellipse cx="13" cy="31" rx="7" ry="14" fill="#a8744f" transform="rotate(18 13 31)"/><ellipse cx="51" cy="31" rx="7" ry="14" fill="#a8744f" transform="rotate(-18 51 31)"/><circle cx="41" cy="26" r="5" fill="#dcae80"/><ellipse cx="32" cy="43" rx="9" ry="7" fill="#fff6ea"/><ellipse cx="32" cy="40" rx="3.6" ry="2.6" fill="#3a2b25"/>${kawaii({ ey: 32, my: 45 })}`,
  ],
  [
    "a-bunny",
    "Kelinci",
    `<ellipse cx="23" cy="16" rx="6" ry="15" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><ellipse cx="41" cy="16" rx="6" ry="15" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><ellipse cx="23" cy="17" rx="3" ry="10" fill="#ffc2cf"/><ellipse cx="41" cy="17" rx="3" ry="10" fill="#ffc2cf"/><circle cx="32" cy="41" r="19" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><ellipse cx="32" cy="44" rx="2" ry="1.4" fill="#ff8fab"/>${kawaii({ ey: 39, my: 46 })}`,
  ],
  [
    "a-bear",
    "Beruang",
    `<circle cx="15" cy="20" r="8" fill="#a8714a"/><circle cx="49" cy="20" r="8" fill="#a8714a"/><circle cx="15" cy="20" r="4" fill="#d9a07a"/><circle cx="49" cy="20" r="4" fill="#d9a07a"/><circle cx="32" cy="36" r="21" fill="#a8714a"/><ellipse cx="32" cy="43" rx="9" ry="7" fill="#e8c4a0"/><ellipse cx="32" cy="40" rx="3.4" ry="2.4" fill="#3a2418"/>${kawaii({ ey: 32, my: 44 })}`,
  ],
  [
    "a-panda",
    "Panda",
    `<circle cx="15" cy="20" r="8" fill="#2f2f35"/><circle cx="49" cy="20" r="8" fill="#2f2f35"/><circle cx="32" cy="36" r="21" fill="#fff" stroke="#e3e3e8" stroke-width="1.5"/><ellipse cx="23" cy="34" rx="6" ry="7.5" fill="#2f2f35" transform="rotate(25 23 34)"/><ellipse cx="41" cy="34" rx="6" ry="7.5" fill="#2f2f35" transform="rotate(-25 41 34)"/><circle cx="24" cy="34" r="2.4" fill="#fff"/><circle cx="40" cy="34" r="2.4" fill="#fff"/><ellipse cx="32" cy="41" rx="3" ry="2.2" fill="#2f2f35"/><path d="M29 45q1.5 2 3 0q1.5 2 3 0" fill="none" stroke="#2f2f35" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="16" cy="43" rx="3.6" ry="2.2" fill="#ff8fab" opacity=".7"/><ellipse cx="48" cy="43" rx="3.6" ry="2.2" fill="#ff8fab" opacity=".7"/>`,
  ],
  [
    "a-chick",
    "Anak ayam",
    `<path d="M30 14c-2-5 3-7 3-2M34 14c2-5 7-3 3 1" stroke="#f2b705" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="12" cy="41" rx="5" ry="8" fill="#ffc933" transform="rotate(25 12 41)"/><ellipse cx="52" cy="41" rx="5" ry="8" fill="#ffc933" transform="rotate(-25 52 41)"/><circle cx="32" cy="36" r="21" fill="#ffd84d"/><path d="M28 38l4 5 4-5z" fill="#f59a3c"/>${kawaii({ ey: 32, mouth: false })}`,
  ],
  [
    "a-frog",
    "Katak",
    `<ellipse cx="32" cy="40" rx="24" ry="18" fill="#8fd17e"/><circle cx="20" cy="22" r="9" fill="#8fd17e"/><circle cx="44" cy="22" r="9" fill="#8fd17e"/><circle cx="20" cy="22" r="5.5" fill="#fff"/><circle cx="44" cy="22" r="5.5" fill="#fff"/><circle cx="21" cy="23" r="3" fill="#2b2b2b"/><circle cx="45" cy="23" r="3" fill="#2b2b2b"/><circle cx="20" cy="22" r="1" fill="#fff"/><circle cx="44" cy="22" r="1" fill="#fff"/><path d="M22 42q10 8 20 0" stroke="#3f7d35" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="15" cy="40" rx="4" ry="2.4" fill="#ff8fab" opacity=".7"/><ellipse cx="49" cy="40" rx="4" ry="2.4" fill="#ff8fab" opacity=".7"/>`,
  ],
  [
    "a-fox",
    "Rubah",
    `<path d="M12 32L14 7l17 13zM52 32L50 7 33 20z" fill="#f08a4b"/><path d="M17 24l1-10 8 7zM47 24l-1-10-8 7z" fill="#5b3a2e"/><path d="M11 31c0-12 9-19 21-19s21 7 21 19c0 13-9 21-21 25-12-4-21-12-21-25z" fill="#f08a4b"/><path d="M11 34c6 0 12 4 21 16 9-12 15-16 21-16-2 11-10 18-21 22-11-4-19-11-21-22z" fill="#fff4e8"/><ellipse cx="32" cy="47" rx="3" ry="2.2" fill="#2b2b2b"/>${kawaii({ ey: 33, dx: 9, mouth: false })}`,
  ],
  [
    "a-penguin",
    "Penguin",
    `<ellipse cx="14" cy="40" rx="4" ry="10" fill="#2f3a50" transform="rotate(15 14 40)"/><ellipse cx="50" cy="40" rx="4" ry="10" fill="#2f3a50" transform="rotate(-15 50 40)"/><ellipse cx="32" cy="36" rx="20" ry="23" fill="#3d4a63"/><path d="M32 18c-10 0-14 8-14 16 0 10 6 20 14 20s14-10 14-20c0-8-4-16-14-16z" fill="#fff"/><path d="M28 36l4 4 4-4z" fill="#f59a3c"/><ellipse cx="25" cy="59" rx="5" ry="2.5" fill="#f59a3c"/><ellipse cx="39" cy="59" rx="5" ry="2.5" fill="#f59a3c"/>${kawaii({ ey: 31, dx: 6, mouth: false })}`,
  ],
  [
    "a-hamster",
    "Hamster",
    `<circle cx="16" cy="20" r="6" fill="#e9a66b"/><circle cx="48" cy="20" r="6" fill="#e9a66b"/><circle cx="16" cy="20" r="3" fill="#ffc2cf"/><circle cx="48" cy="20" r="3" fill="#ffc2cf"/><ellipse cx="32" cy="38" rx="23" ry="20" fill="#f2c08f"/><path d="M14 44c4 8 11 12 18 12s14-4 18-12c-6 3-12 4-18 4s-12-1-18-4z" fill="#fff6ea"/><ellipse cx="32" cy="40" rx="2.4" ry="1.7" fill="#d9707f"/>${kawaii({ ey: 34, dx: 10, my: 43 })}`,
  ],
  [
    "a-duck",
    "Bebek",
    `<ellipse cx="35" cy="45" rx="22" ry="14" fill="#ffe066"/><path d="M42 40c6-3 11-1 13 4-5 2-11 2-13-4z" fill="#f7cf3d"/><circle cx="25" cy="26" r="14" fill="#ffe066"/><path d="M12 27c-5 0-7 3-5 5 3 2 8 1 10-1z" fill="#f59a3c"/><circle cx="22" cy="23" r="2.6" fill="#2b2b2b"/><circle cx="21.2" cy="22.2" r=".9" fill="#fff"/><ellipse cx="27" cy="30" rx="3.4" ry="2" fill="#ff8fab" opacity=".7"/><path d="M30 8c-1-3 2-4 3-1" stroke="#f2b705" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  ],
  [
    "a-owl",
    "Burung hantu",
    `<path d="M15 16l6 9M49 16l-6 9" stroke="#8a5f3f" stroke-width="5" stroke-linecap="round"/><ellipse cx="32" cy="37" rx="21" ry="22" fill="#a97c5a"/><ellipse cx="32" cy="45" rx="12" ry="12" fill="#e8d2b4"/><circle cx="24" cy="30" r="8" fill="#fff"/><circle cx="40" cy="30" r="8" fill="#fff"/><circle cx="25" cy="31" r="3.5" fill="#2b2b2b"/><circle cx="39" cy="31" r="3.5" fill="#2b2b2b"/><circle cx="24" cy="30" r="1.2" fill="#fff"/><circle cx="38" cy="30" r="1.2" fill="#fff"/><path d="M29 36l3 5 3-5z" fill="#f2a33a"/><path d="M26 47q2 2 4 0M34 47q2 2 4 0M30 52q2 2 4 0" stroke="#c7a982" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  ],
  [
    "a-whale",
    "Paus",
    `<path d="M46 34c4-7 10-9 13-7-2 4-2 9 0 13-4 1-9-1-13-6z" fill="#6aa3e6"/><ellipse cx="28" cy="39" rx="23" ry="16" fill="#7cb4f2"/><path d="M7 43c6 6 14 9 22 9s15-2 19-6c-8 2-26 3-41-3z" fill="#e6f1ff"/><path d="M26 22c0-5-3-8-6-8M26 22c0-5 3-8 6-8M26 22v-7" stroke="#8ec3f7" stroke-width="2.5" fill="none" stroke-linecap="round"/>${kawaii({ cx: 26, ey: 36, dx: 7 })}`,
  ],
  [
    "a-turtle",
    "Kura-kura",
    `<ellipse cx="13" cy="40" rx="8" ry="7" fill="#9bd38a"/><ellipse cx="22" cy="53" rx="5" ry="4" fill="#9bd38a"/><ellipse cx="46" cy="53" rx="5" ry="4" fill="#9bd38a"/><path d="M56 46l5 2-5 2z" fill="#9bd38a"/><path d="M18 48c0-15 8-23 18-23s20 8 20 23z" fill="#5fae6e"/><path d="M28 29l8 6 9-6M23 40l13-5 14 5M30 48l6-13 6 13" stroke="#4b8f58" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="11" cy="38" r="2" fill="#2b2b2b"/><ellipse cx="14" cy="43" rx="2.4" ry="1.5" fill="#ff8fab" opacity=".7"/><path d="M6 42q2 1.5 3 0" stroke="#2b2b2b" stroke-width="1.3" fill="none" stroke-linecap="round"/>`,
  ],
  [
    "a-bee",
    "Lebah",
    `<ellipse cx="21" cy="20" rx="9" ry="7" fill="#fff" stroke="#cfe3f5" stroke-width="1.5" transform="rotate(-25 21 20)"/><ellipse cx="43" cy="20" rx="9" ry="7" fill="#fff" stroke="#cfe3f5" stroke-width="1.5" transform="rotate(25 43 20)"/><ellipse cx="32" cy="39" rx="20" ry="18" fill="#ffd84d"/><path d="M15 46h34M19 53h26" stroke="#3a3326" stroke-width="5" stroke-linecap="round"/><path d="M27 23c-2-6-5-8-8-8M37 23c2-6 5-8 8-8" stroke="#3a3326" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="19" cy="15" r="2" fill="#3a3326"/><circle cx="45" cy="15" r="2" fill="#3a3326"/>${kawaii({ ey: 33, my: 38 })}`,
  ],
  [
    "a-ladybug",
    "Kepik",
    `<circle cx="32" cy="39" r="20" fill="#e8524a"/><path d="M32 24v35" stroke="#2f2f35" stroke-width="2"/><circle cx="22" cy="36" r="3.5" fill="#2f2f35"/><circle cx="42" cy="36" r="3.5" fill="#2f2f35"/><circle cx="24" cy="49" r="3" fill="#2f2f35"/><circle cx="40" cy="49" r="3" fill="#2f2f35"/><circle cx="32" cy="20" r="11" fill="#2f2f35"/><circle cx="28" cy="19" r="2.6" fill="#fff"/><circle cx="36" cy="19" r="2.6" fill="#fff"/><circle cx="28.5" cy="19.5" r="1.3" fill="#2b2b2b"/><circle cx="36.5" cy="19.5" r="1.3" fill="#2b2b2b"/><path d="M28 11c-2-4-4-5-6-5M36 11c2-4 4-5 6-5" stroke="#2f2f35" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  ],
  [
    "a-butterfly",
    "Kupu-kupu",
    `<path d="M32 32C24 14 8 10 8 22s10 14 24 10z" fill="#f59ec2"/><path d="M32 32c8-18 24-22 24-10S46 36 32 32z" fill="#b99cf2"/><path d="M32 34c-10 0-18 6-16 14 2 6 10 4 16-8z" fill="#f7c0d8"/><path d="M32 34c10 0 18 6 16 14-2 6-10 4-16-8z" fill="#d4c2f7"/><circle cx="18" cy="22" r="2.5" fill="#fff" opacity=".8"/><circle cx="46" cy="22" r="2.5" fill="#fff" opacity=".8"/><ellipse cx="32" cy="36" rx="3.5" ry="13" fill="#5b4a6b"/><path d="M31 23c-2-6-5-9-8-9M33 23c2-6 5-9 8-9" stroke="#5b4a6b" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  ],
  [
    "a-snail",
    "Siput",
    `<path d="M6 52c0-4 4-6 10-6h32c7 0 11 3 11 7H10c-3 0-4-0-4-1z" fill="#f2c9a0"/><path d="M12 47c-2-6-1-12 2-16M18 47c0-6 2-11 5-14" stroke="#f2c9a0" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="14" cy="30" r="2.2" fill="#2b2b2b"/><circle cx="23" cy="32" r="2.2" fill="#2b2b2b"/><circle cx="37" cy="33" r="16" fill="#c98fe0"/><path d="M37 33m-2 0a2 2 0 1 1 4 0 6 6 0 1 1-12 0 10 10 0 1 1 20 0" stroke="#a46ec0" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="50" rx="2.4" ry="1.4" fill="#ff8fab" opacity=".7"/>`,
  ],
  [
    "a-fish",
    "Ikan",
    `<path d="M44 32l15-11v22z" fill="#f59a3c"/><ellipse cx="28" cy="32" rx="20" ry="14" fill="#ffb15c"/><path d="M24 18c4-5 10-5 13 1z" fill="#f59a3c"/><path d="M31 20c2 5 2 19 0 24" stroke="#f59a3c" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="18" cy="29" r="3" fill="#2b2b2b"/><circle cx="17" cy="28" r="1" fill="#fff"/><ellipse cx="20" cy="36" rx="3" ry="1.8" fill="#ff8fab" opacity=".8"/><path d="M9 33q2 1.5 3 0" stroke="#2b2b2b" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
  ],
  [
    "a-unicorn",
    "Unicorn",
    `<path d="M32 3l4.5 17h-9z" fill="#f7cf5a" stroke="#e3ad2c" stroke-width="1"/><path d="M29.5 9h5M28.5 14h7" stroke="#e3ad2c" stroke-width="1.2"/><path d="M14 29l2-12 9 8zM50 29l-2-12-9 8z" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><path d="M38 19c9-1 15 5 16 13-4-3-8-4-12-3z" fill="#b99cf2"/><path d="M41 24c7 1 12 7 12 14-3-4-7-6-11-6z" fill="#7fd1c7"/><circle cx="31" cy="39" r="19" fill="#fff" stroke="#e6dcd3" stroke-width="1.5"/><path d="M40 21c6 3 9 9 8 16" stroke="#f59ec2" stroke-width="4" fill="none" stroke-linecap="round"/>${kawaii({ cx: 31, ey: 38, my: 45 })}`,
  ],
].map(([id, n, svg]) => ({ id, n, vb: "0 0 64 64", svg, kind: "deco" }));

// Hiasan tambahan untuk menghias halaman bulan.
DECOS.push(
  ...[
    [
      "sakura",
      "Sakura",
      "0 0 64 64",
      `<g fill="#ffc0d6">${[0, 72, 144, 216, 288].map(a => `<path d="M32 32c-7-6-8-16-3-21l3 3 3-3c5 5 4 15-3 21z" transform="rotate(${a} 32 32)"/>`).join("")}</g><circle cx="32" cy="32" r="4" fill="#f07ea5"/><g fill="#e85d8f">${[0, 72, 144, 216, 288].map(a => `<circle cx="32" cy="24" r="1.2" transform="rotate(${a} 32 32)"/>`).join("")}</g>`,
    ],
    [
      "tulip",
      "Tulip",
      "0 0 64 64",
      `<path d="M32 60V30" stroke="#5aa86a" stroke-width="3" stroke-linecap="round"/><path d="M32 52c-8 0-14-6-16-14 8 0 14 6 16 14zM32 47c8 0 14-6 16-14-8 0-14 6-16 14z" fill="#6cc58c"/><path d="M20 12l6 6 6-8 6 8 6-6v12c0 8-5 12-12 12S20 32 20 24z" fill="#f2668b"/>`,
    ],
    [
      "mushroom",
      "Jamur",
      "0 0 64 64",
      `<path d="M8 32c0-13 11-21 24-21s24 8 24 21z" fill="#e8524a"/><circle cx="21" cy="22" r="3.5" fill="#fff"/><circle cx="35" cy="17" r="3" fill="#fff"/><circle cx="45" cy="26" r="3" fill="#fff"/><circle cx="29" cy="27" r="2.5" fill="#fff"/><path d="M22 32h20v18c0 5-4 8-10 8s-10-3-10-8z" fill="#fff4e3" stroke="#eadbc4" stroke-width="1.5"/>${kawaii({ ey: 41, dx: 5, my: 46 })}`,
    ],
    [
      "cactus",
      "Kaktus",
      "0 0 64 64",
      `<path d="M18 46h28l-3 15H21z" fill="#e58b5a"/><rect x="16" y="43" width="32" height="6" rx="2" fill="#f0a272"/><path d="M26 44V18a6 6 0 0 1 12 0v26z" fill="#6cc58c"/><path d="M26 32h-5a4 4 0 0 1-4-4v-6a3 3 0 0 1 6 0v4h3M38 28h5v-8a3 3 0 0 1 6 0v8a6 6 0 0 1-6 6h-5" fill="#6cc58c"/><circle cx="32" cy="11" r="4" fill="#f59ec2"/>${kawaii({ ey: 25, dx: 3.5, my: 30, blush: false })}`,
    ],
    [
      "icecream",
      "Es krim",
      "0 0 64 64",
      `<path d="M21 34l11 27 11-27z" fill="#f3c27a"/><path d="M24 38l14 6M26 44l10 4M23 36l17 0" stroke="#d99a4a" stroke-width="1.4"/><circle cx="25" cy="30" r="10" fill="#9be2c8"/><circle cx="39" cy="30" r="10" fill="#ffb3c9"/><circle cx="32" cy="19" r="10" fill="#fff1c9"/><circle cx="33" cy="8" r="3.5" fill="#e8524a"/><path d="M33 5c1-3 3-4 5-4" stroke="#5aa86a" stroke-width="1.5" fill="none"/>`,
    ],
    [
      "boba",
      "Es boba",
      "0 0 64 64",
      `<path d="M37 4l-4 22" stroke="#f2668b" stroke-width="4" stroke-linecap="round"/><path d="M16 22h32l-4 36a4 4 0 0 1-4 3H24a4 4 0 0 1-4-3z" fill="#e9d4bd" opacity=".95"/><path d="M14 18h36v6H14z" fill="#fff" stroke="#e6dcd3" stroke-width="1.5" rx="2"/><g fill="#4b3226">${pts(
        "24,50 30,53 36,50 41,54 27,56 34,57"
      )
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`)
        .join("")}</g>${kawaii({ ey: 34, dx: 5, my: 39 })}`,
    ],
    [
      "cupcake",
      "Kue mangkuk",
      "0 0 64 64",
      `<path d="M16 36h32l-4 22H20z" fill="#9fc8f5"/><path d="M22 36l2 22M28 36l1 22M36 36l-1 22M42 36l-2 22" stroke="#7fb0e6" stroke-width="1.5"/><path d="M14 37c-3-8 4-14 10-12 1-7 15-7 16 0 6-2 13 4 10 12z" fill="#ffc2d6"/><circle cx="32" cy="16" r="4" fill="#e8524a"/><g stroke-width="2.2" stroke-linecap="round"><path d="M22 30l2-2" stroke="#f6c443"/><path d="M38 28l2 1" stroke="#6cc58c"/><path d="M30 33l1-2" stroke="#6aa3f0"/><path d="M44 33l-1-2" stroke="#b99cf2"/></g>`,
    ],
    [
      "balloon",
      "Balon",
      "0 0 64 64",
      `<path d="M22 38c0 8 6 10 4 24M42 34c0 8-4 12 0 28" stroke="#9aa3b2" stroke-width="1.4" fill="none"/><ellipse cx="22" cy="24" rx="12" ry="15" fill="#f2668b"/><ellipse cx="42" cy="21" rx="12" ry="15" fill="#6aa3f0"/><path d="M20 39l2-2 2 2zM40 36l2-2 2 2z" fill="#555"/><ellipse cx="18" cy="18" rx="3" ry="5" fill="#fff" opacity=".45"/><ellipse cx="38" cy="15" rx="3" ry="5" fill="#fff" opacity=".45"/>`,
    ],
    [
      "notes",
      "Not balok",
      "0 0 64 64",
      `<path d="M22 46V14l28-6v32" stroke="#6a5acd" stroke-width="4" fill="none" stroke-linejoin="round"/><ellipse cx="16" cy="46" rx="7" ry="5.5" fill="#6a5acd" transform="rotate(-20 16 46)"/><ellipse cx="44" cy="40" rx="7" ry="5.5" fill="#6a5acd" transform="rotate(-20 44 40)"/><path d="M22 20l28-6" stroke="#6a5acd" stroke-width="4"/>`,
    ],
    [
      "strawberry",
      "Stroberi",
      "0 0 64 64",
      `<path d="M32 60C16 50 10 36 14 26c4-8 14-8 18-4 4-4 14-4 18 4 4 10-2 24-18 34z" fill="#ef4f5f"/><path d="M22 18l10 6 10-6-4-2 2-6-8 4-8-4 2 6z" fill="#5aa86a"/><g fill="#ffe08a">${pts(
        "23,34 32,33 41,34 27,42 37,42 32,50 24,50 40,50"
      )
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.2" ry="1.8"/>`)
        .join("")}</g>`,
    ],
    [
      "planet",
      "Planet",
      "0 0 64 64",
      `<circle cx="32" cy="32" r="16" fill="#f6c27a"/><path d="M19 26c6-3 20-3 26 2M18 36c8 3 20 3 28-1" stroke="#e8a54f" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="34" rx="30" ry="8" fill="none" stroke="#b99cf2" stroke-width="4" transform="rotate(-15 32 34)"/><circle cx="54" cy="10" r="2" fill="#f8cf4a"/><circle cx="8" cy="54" r="1.6" fill="#f8cf4a"/>`,
    ],
    [
      "bubble",
      "Balon kata",
      "0 0 80 56",
      `<path d="M10 4h60a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H30l-12 11 2-11h-10a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8z" fill="#fff" stroke="#3b3f4a" stroke-width="2.5" stroke-linejoin="round"/><text x="40" y="25" text-anchor="middle" dominant-baseline="central" font-family="Caveat, cursive" font-size="22" font-weight="700" fill="#3b3f4a">Hai!</text>`,
    ],
  ].map(([id, n, vb, svg]) => ({ id, n, vb, svg, kind: "deco" }))
);
