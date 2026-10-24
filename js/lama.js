/* Lama: stiker dan hiasan dari versi sebelum tema Lumut & Pasir (hewan, makanan, benda lucu, selotip warna-warni).
   Tidak lagi ditawarkan di laci stiker. File ini hanya dimuat (oleh muatLama di js/hiasan.js) kalau masih ada
   hiasan lama yang tertempel di tanggal atau halaman bulan, supaya hiasan itu tetap tampil dan ikut tersimpan di PNG. */
(() => {
  // Stiker dekorasi untuk menghias halaman bulan (bentuknya bebas, tidak bulat). [id, nama, viewBox, isi SVG]

  const DECOS = [
    [
      "tape-pink",
      "Selotip merah muda",
      "0 0 120 36",
      `<path d="${TAPE}" fill="#deafbb" opacity=".9"/><path d="M18 4l-8 28M38 4l-8 28M58 4l-8 28M78 4l-8 28M98 4l-8 28M116 6l-7 26" stroke="#fff" stroke-width="5" opacity=".45"/>`,
    ],
    [
      "tape-mint",
      "Selotip mint",
      "0 0 120 36",
      `<path d="${TAPE}" fill="#9acbc0" opacity=".9"/><g fill="#fff" opacity=".7"><circle cx="16" cy="12" r="3"/><circle cx="36" cy="24" r="3"/><circle cx="56" cy="12" r="3"/><circle cx="76" cy="24" r="3"/><circle cx="96" cy="12" r="3"/><circle cx="108" cy="25" r="3"/></g>`,
    ],
    [
      "tape-yellow",
      "Selotip kuning",
      "0 0 120 36",
      `<path d="${TAPE}" fill="#d6c494" opacity=".9"/><path d="M8 13h104M8 23h104M30 4v28M60 4v28M90 4v28" stroke="#fff" stroke-width="2" opacity=".6"/>`,
    ],
    [
      "flower",
      "Bunga",
      "0 0 64 64",
      `<g fill="#dbabbb"><circle cx="32" cy="16" r="11"/><circle cx="47" cy="27" r="11"/><circle cx="41" cy="45" r="11"/><circle cx="23" cy="45" r="11"/><circle cx="17" cy="27" r="11"/></g><circle cx="32" cy="32" r="9" fill="#c9b070"/>`,
    ],
    [
      "daisy",
      "Aster",
      "0 0 64 64",
      `<g fill="#fff" stroke="#d9d3c8" stroke-width="1.5">${[0, 45, 90, 135, 180, 225, 270, 315]
        .map(a => `<ellipse cx="32" cy="14" rx="7" ry="13" transform="rotate(${a} 32 32)"/>`)
        .join("")}</g><circle cx="32" cy="32" r="8" fill="#c7aa6c"/>`,
    ],
    [
      "leaf-sprig",
      "Daun",
      "0 0 64 64",
      `<path d="M14 54C26 40 36 26 50 10" stroke="#53956c" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M26 40c-12-2-16-12-14-20 10 2 16 10 14 20zM36 28c2-12 12-16 20-14-2 10-10 16-20 14zM31 33c-8-6-6-17 0-22 6 6 6 16 0 22z" fill="#7bb790"/>`,
    ],
    [
      "cloud",
      "Awan",
      "0 0 80 50",
      `<path d="M18 42a12 12 0 0 1-1-24 16 16 0 0 1 30-6 12 12 0 0 1 19 9 9 9 0 0 1-2 21z" fill="#fff" stroke="#c0cbdc" stroke-width="2.5" stroke-linejoin="round"/>`,
    ],
    [
      "sparkle",
      "Kilau",
      "0 0 64 64",
      `<path d="M26 6l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="#ccb675"/><path d="M48 36l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ccb675" opacity=".8"/>`,
    ],
    [
      "star-deco",
      "Bintang",
      "0 0 64 64",
      `<path d="M32 5l8 17 18 2-13 13 4 19-17-9-17 9 4-19L6 24l18-2z" fill="#d2bd86" stroke="#bb9e61" stroke-width="2" stroke-linejoin="round"/>`,
    ],
    [
      "heart-doodle",
      "Hati coretan",
      "0 0 64 64",
      `<path d="M32 54S9 40 9 23a12 12 0 0 1 23-5 12 12 0 0 1 23 5c0 17-23 31-23 31z" fill="none" stroke="#c27685" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 8l4-4M56 14l5-1M44 6l-1-4" stroke="#c27685" stroke-width="3" stroke-linecap="round"/>`,
    ],
    [
      "rainbow",
      "Pelangi",
      "0 0 80 46",
      `<g fill="none" stroke-width="6" stroke-linecap="round"><path d="M8 42a32 32 0 0 1 64 0" stroke="#d09396"/><path d="M15 42a25 25 0 0 1 50 0" stroke="#c9b070"/><path d="M22 42a18 18 0 0 1 36 0" stroke="#7bb790"/><path d="M29 42a11 11 0 0 1 22 0" stroke="#88a3cd"/></g>`,
    ],
    [
      "bow",
      "Pita",
      "0 0 80 50",
      `<path d="M40 25C28 8 10 8 10 20s18 14 30 5zM40 25c12-17 30-17 30-5s-18 14-30 5z" fill="#ce92a0"/><path d="M36 26l-10 20 8-3 4 6 2-20M44 26l10 20-8-3-4 6-2-20" fill="#b97989"/><circle cx="40" cy="25" r="5" fill="#b97989"/>`,
    ],
    [
      "squiggle",
      "Garis coretan",
      "0 0 120 24",
      `<path d="M4 12c8-10 16-10 22 0s14 10 22 0 16-10 22 0 14 10 22 0 16-10 24 0" fill="none" stroke="#7f97c9" stroke-width="4" stroke-linecap="round"/>`,
    ],
    [
      "arrow",
      "Panah coretan",
      "0 0 80 50",
      `<path d="M6 40C20 14 44 8 68 16" fill="none" stroke="#3f4146" stroke-width="3.5" stroke-linecap="round"/><path d="M56 8l13 8-11 10" fill="none" stroke="#3f4146" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    ],
    [
      "clip",
      "Penjepit kertas",
      "0 0 40 80",
      `<path d="M26 18v38a8 8 0 0 1-16 0V12a6 6 0 0 1 12 0v40a3 3 0 0 1-6 0V20" fill="none" stroke="#9aa1ac" stroke-width="3.5" stroke-linecap="round"/>`,
    ],
    [
      "sun-doodle",
      "Matahari",
      "0 0 64 64",
      `<circle cx="32" cy="32" r="12" fill="#c9ad6d"/><g stroke="#c9a66d" stroke-width="4" stroke-linecap="round"><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.7 5.7M44.7 44.7l5.7 5.7M13.6 50.4l5.7-5.7M44.7 19.3l5.7-5.7"/></g>`,
    ],
    [
      "moon-stars",
      "Bulan & bintang",
      "0 0 64 64",
      `<path d="M40 52A22 22 0 0 1 28 10a20 20 0 1 0 24 30 22 22 0 0 1-12 12z" fill="#d0bd89"/><path d="M50 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM56 30l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#d0bd89"/>`,
    ],
    [
      "flag-id",
      "Merah putih",
      "0 0 60 64",
      `<path d="M10 6v54" stroke="#8a715b" stroke-width="3.5" stroke-linecap="round"/><path d="M12 8c12-4 22 4 36 0v14c-14 4-24-4-36 0z" fill="#ba696a"/><path d="M12 22c12-4 22 4 36 0v14c-14 4-24-4-36 0z" fill="#fff" stroke="#d6d3cd" stroke-width="1.5"/>`,
    ],
  ].map(([id, n, vb, svg]) => ({ id, n, vb, svg, kind: "deco" }));

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
      h += `<ellipse cx="${cx - dx - 5}" cy="${ey + 5}" rx="3.6" ry="2.2" fill="#dda4b1" opacity=".7"/><ellipse cx="${cx + dx + 5}" cy="${ey + 5}" rx="3.6" ry="2.2" fill="#dda4b1" opacity=".7"/>`;
    if (mouth)
      h += `<path d="M${cx - 3} ${my}q1.5 2 3 0q1.5 2 3 0" fill="none" stroke="#2b2b2b" stroke-width="1.6" stroke-linecap="round"/>`;
    return h;
  }

  // [id, nama, isi SVG] dengan viewBox 0 0 64 64
  const ANIMALS = [
    [
      "a-cat",
      "Kucing",
      `<path d="M13 30L15 8l14 11zM51 30L49 8 35 19z" fill="#cea682"/><path d="M17 24l1-11 7 6zM47 24l-1-11-7 6z" fill="#f2e0e0"/><circle cx="32" cy="36" r="21" fill="#cea682"/><path d="M24 17c2 2 2 5 0 7M32 15v6M40 17c-2 2-2 5 0 7" stroke="#b58d6c" stroke-width="2.4" fill="none" stroke-linecap="round"/>${kawaii()}<path d="M7 37h9M8 43l8-2M57 37h-9M56 43l-8-2" stroke="#7f634a" stroke-width="1.3" stroke-linecap="round"/>`,
    ],
    [
      "a-dog",
      "Anjing",
      `<circle cx="32" cy="35" r="20" fill="#dbc9b5"/><ellipse cx="13" cy="31" rx="7" ry="14" fill="#a07c62" transform="rotate(18 13 31)"/><ellipse cx="51" cy="31" rx="7" ry="14" fill="#a07c62" transform="rotate(-18 51 31)"/><circle cx="41" cy="26" r="5" fill="#c3ab94"/><ellipse cx="32" cy="43" rx="9" ry="7" fill="#f8f5ee"/><ellipse cx="32" cy="40" rx="3.6" ry="2.6" fill="#342e2b"/>${kawaii({ ey: 32, my: 45 })}`,
    ],
    [
      "a-bunny",
      "Kelinci",
      `<ellipse cx="23" cy="16" rx="6" ry="15" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><ellipse cx="41" cy="16" rx="6" ry="15" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><ellipse cx="23" cy="17" rx="3" ry="10" fill="#f2e0e0"/><ellipse cx="41" cy="17" rx="3" ry="10" fill="#f2e0e0"/><circle cx="32" cy="41" r="19" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><ellipse cx="32" cy="44" rx="2" ry="1.4" fill="#dda4b1"/>${kawaii({ ey: 39, my: 46 })}`,
    ],
    [
      "a-bear",
      "Beruang",
      `<circle cx="15" cy="20" r="8" fill="#a0795d"/><circle cx="49" cy="20" r="8" fill="#a0795d"/><circle cx="15" cy="20" r="4" fill="#c0a490"/><circle cx="49" cy="20" r="4" fill="#c0a490"/><circle cx="32" cy="36" r="21" fill="#a0795d"/><ellipse cx="32" cy="43" rx="9" ry="7" fill="#d2bdab"/><ellipse cx="32" cy="40" rx="3.4" ry="2.4" fill="#312721"/>${kawaii({ ey: 32, my: 44 })}`,
    ],
    [
      "a-panda",
      "Panda",
      `<circle cx="15" cy="20" r="8" fill="#2f2f35"/><circle cx="49" cy="20" r="8" fill="#2f2f35"/><circle cx="32" cy="36" r="21" fill="#fff" stroke="#e3e3e8" stroke-width="1.5"/><ellipse cx="23" cy="34" rx="6" ry="7.5" fill="#2f2f35" transform="rotate(25 23 34)"/><ellipse cx="41" cy="34" rx="6" ry="7.5" fill="#2f2f35" transform="rotate(-25 41 34)"/><circle cx="24" cy="34" r="2.4" fill="#fff"/><circle cx="40" cy="34" r="2.4" fill="#fff"/><ellipse cx="32" cy="41" rx="3" ry="2.2" fill="#2f2f35"/><path d="M29 45q1.5 2 3 0q1.5 2 3 0" fill="none" stroke="#2f2f35" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="16" cy="43" rx="3.6" ry="2.2" fill="#dda4b1" opacity=".7"/><ellipse cx="48" cy="43" rx="3.6" ry="2.2" fill="#dda4b1" opacity=".7"/>`,
    ],
    [
      "a-chick",
      "Anak ayam",
      `<path d="M30 14c-2-5 3-7 3-2M34 14c2-5 7-3 3 1" stroke="#bb9c47" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="12" cy="41" rx="5" ry="8" fill="#c8af6b" transform="rotate(25 12 41)"/><ellipse cx="52" cy="41" rx="5" ry="8" fill="#c8af6b" transform="rotate(-25 52 41)"/><circle cx="32" cy="36" r="21" fill="#ceba7b"/><path d="M28 38l4 5 4-5z" fill="#c7986b"/>${kawaii({ ey: 32, mouth: false })}`,
    ],
    [
      "a-frog",
      "Katak",
      `<ellipse cx="32" cy="40" rx="24" ry="18" fill="#9ec389"/><circle cx="20" cy="22" r="9" fill="#9ec389"/><circle cx="44" cy="22" r="9" fill="#9ec389"/><circle cx="20" cy="22" r="5.5" fill="#fff"/><circle cx="44" cy="22" r="5.5" fill="#fff"/><circle cx="21" cy="23" r="3" fill="#2b2b2b"/><circle cx="45" cy="23" r="3" fill="#2b2b2b"/><circle cx="20" cy="22" r="1" fill="#fff"/><circle cx="44" cy="22" r="1" fill="#fff"/><path d="M22 42q10 8 20 0" stroke="#487f49" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="15" cy="40" rx="4" ry="2.4" fill="#dda4b1" opacity=".7"/><ellipse cx="49" cy="40" rx="4" ry="2.4" fill="#dda4b1" opacity=".7"/>`,
    ],
    [
      "a-fox",
      "Rubah",
      `<path d="M12 32L14 7l17 13zM52 32L50 7 33 20z" fill="#c79574"/><path d="M17 24l1-10 8 7zM47 24l-1-10-8 7z" fill="#4f413a"/><path d="M11 31c0-12 9-19 21-19s21 7 21 19c0 13-9 21-21 25-12-4-21-12-21-25z" fill="#c79574"/><path d="M11 34c6 0 12 4 21 16 9-12 15-16 21-16-2 11-10 18-21 22-11-4-19-11-21-22z" fill="#f8f4ed"/><ellipse cx="32" cy="47" rx="3" ry="2.2" fill="#2b2b2b"/>${kawaii({ ey: 33, dx: 9, mouth: false })}`,
    ],
    [
      "a-penguin",
      "Penguin",
      `<ellipse cx="14" cy="40" rx="4" ry="10" fill="#383d47" transform="rotate(15 14 40)"/><ellipse cx="50" cy="40" rx="4" ry="10" fill="#383d47" transform="rotate(-15 50 40)"/><ellipse cx="32" cy="36" rx="20" ry="23" fill="#474d59"/><path d="M32 18c-10 0-14 8-14 16 0 10 6 20 14 20s14-10 14-20c0-8-4-16-14-16z" fill="#fff"/><path d="M28 36l4 4 4-4z" fill="#c7986b"/><ellipse cx="25" cy="59" rx="5" ry="2.5" fill="#c7986b"/><ellipse cx="39" cy="59" rx="5" ry="2.5" fill="#c7986b"/>${kawaii({ ey: 31, dx: 6, mouth: false })}`,
    ],
    [
      "a-hamster",
      "Hamster",
      `<circle cx="16" cy="20" r="6" fill="#c8a588"/><circle cx="48" cy="20" r="6" fill="#c8a588"/><circle cx="16" cy="20" r="3" fill="#f2e0e0"/><circle cx="48" cy="20" r="3" fill="#f2e0e0"/><ellipse cx="32" cy="38" rx="23" ry="20" fill="#d6baa1"/><path d="M14 44c4 8 11 12 18 12s14-4 18-12c-6 3-12 4-18 4s-12-1-18-4z" fill="#f8f5ee"/><ellipse cx="32" cy="40" rx="2.4" ry="1.7" fill="#be8991"/>${kawaii({ ey: 34, dx: 10, my: 43 })}`,
    ],
    [
      "a-duck",
      "Bebek",
      `<ellipse cx="35" cy="45" rx="22" ry="14" fill="#d4c38b"/><path d="M42 40c6-3 11-1 13 4-5 2-11 2-13-4z" fill="#c9b26c"/><circle cx="25" cy="26" r="14" fill="#d4c38b"/><path d="M12 27c-5 0-7 3-5 5 3 2 8 1 10-1z" fill="#c7986b"/><circle cx="22" cy="23" r="2.6" fill="#2b2b2b"/><circle cx="21.2" cy="22.2" r=".9" fill="#fff"/><ellipse cx="27" cy="30" rx="3.4" ry="2" fill="#dda4b1" opacity=".7"/><path d="M30 8c-1-3 2-4 3-1" stroke="#bb9c47" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    ],
    [
      "a-owl",
      "Burung hantu",
      `<path d="M15 16l6 9M49 16l-6 9" stroke="#896951" stroke-width="5" stroke-linecap="round"/><ellipse cx="32" cy="37" rx="21" ry="22" fill="#a0826c"/><ellipse cx="32" cy="45" rx="12" ry="12" fill="#d6cab8"/><circle cx="24" cy="30" r="8" fill="#fff"/><circle cx="40" cy="30" r="8" fill="#fff"/><circle cx="25" cy="31" r="3.5" fill="#2b2b2b"/><circle cx="39" cy="31" r="3.5" fill="#2b2b2b"/><circle cx="24" cy="30" r="1.2" fill="#fff"/><circle cx="38" cy="30" r="1.2" fill="#fff"/><path d="M29 36l3 5 3-5z" fill="#c5a26a"/><path d="M26 47q2 2 4 0M34 47q2 2 4 0M30 52q2 2 4 0" stroke="#bba48c" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    ],
    [
      "a-whale",
      "Paus",
      `<path d="M46 34c4-7 10-9 13-7-2 4-2 9 0 13-4 1-9-1-13-6z" fill="#87a0c6"/><ellipse cx="28" cy="39" rx="23" ry="16" fill="#94aed2"/><path d="M7 43c6 6 14 9 22 9s15-2 19-6c-8 2-26 3-41-3z" fill="#f0f2f3"/><path d="M26 22c0-5-3-8-6-8M26 22c0-5 3-8 6-8M26 22v-7" stroke="#a0b9da" stroke-width="2.5" fill="none" stroke-linecap="round"/>${kawaii({ cx: 26, ey: 36, dx: 7 })}`,
    ],
    [
      "a-turtle",
      "Kura-kura",
      `<ellipse cx="13" cy="40" rx="8" ry="7" fill="#a6c692"/><ellipse cx="22" cy="53" rx="5" ry="4" fill="#a6c692"/><ellipse cx="46" cy="53" rx="5" ry="4" fill="#a6c692"/><path d="M56 46l5 2-5 2z" fill="#a6c692"/><path d="M18 48c0-15 8-23 18-23s20 8 20 23z" fill="#70a47c"/><path d="M28 29l8 6 9-6M23 40l13-5 14 5M30 48l6-13 6 13" stroke="#5c8d68" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="11" cy="38" r="2" fill="#2b2b2b"/><ellipse cx="14" cy="43" rx="2.4" ry="1.5" fill="#dda4b1" opacity=".7"/><path d="M6 42q2 1.5 3 0" stroke="#2b2b2b" stroke-width="1.3" fill="none" stroke-linecap="round"/>`,
    ],
    [
      "a-bee",
      "Lebah",
      `<ellipse cx="21" cy="20" rx="9" ry="7" fill="#fff" stroke="#e4e9ec" stroke-width="1.5" transform="rotate(-25 21 20)"/><ellipse cx="43" cy="20" rx="9" ry="7" fill="#fff" stroke="#e4e9ec" stroke-width="1.5" transform="rotate(25 43 20)"/><ellipse cx="32" cy="39" rx="20" ry="18" fill="#ceba7b"/><path d="M15 46h34M19 53h26" stroke="#34322c" stroke-width="5" stroke-linecap="round"/><path d="M27 23c-2-6-5-8-8-8M37 23c2-6 5-8 8-8" stroke="#34322c" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="19" cy="15" r="2" fill="#34322c"/><circle cx="45" cy="15" r="2" fill="#34322c"/>${kawaii({ ey: 33, my: 38 })}`,
    ],
    [
      "a-ladybug",
      "Kepik",
      `<circle cx="32" cy="39" r="20" fill="#c17375"/><path d="M32 24v35" stroke="#2f2f35" stroke-width="2"/><circle cx="22" cy="36" r="3.5" fill="#2f2f35"/><circle cx="42" cy="36" r="3.5" fill="#2f2f35"/><circle cx="24" cy="49" r="3" fill="#2f2f35"/><circle cx="40" cy="49" r="3" fill="#2f2f35"/><circle cx="32" cy="20" r="11" fill="#2f2f35"/><circle cx="28" cy="19" r="2.6" fill="#fff"/><circle cx="36" cy="19" r="2.6" fill="#fff"/><circle cx="28.5" cy="19.5" r="1.3" fill="#2b2b2b"/><circle cx="36.5" cy="19.5" r="1.3" fill="#2b2b2b"/><path d="M28 11c-2-4-4-5-6-5M36 11c2-4 4-5 6-5" stroke="#2f2f35" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    ],
    [
      "a-butterfly",
      "Kupu-kupu",
      `<path d="M32 32C24 14 8 10 8 22s10 14 24 10z" fill="#dbabbb"/><path d="M32 32c8-18 24-22 24-10S46 36 32 32z" fill="#baa9d9"/><path d="M32 34c-10 0-18 6-16 14 2 6 10 4 16-8z" fill="#eedddf"/><path d="M32 34c10 0 18 6 16 14-2 6-10 4-16-8z" fill="#e4deeb"/><circle cx="18" cy="22" r="2.5" fill="#fff" opacity=".8"/><circle cx="46" cy="22" r="2.5" fill="#fff" opacity=".8"/><ellipse cx="32" cy="36" rx="3.5" ry="13" fill="#645871"/><path d="M31 23c-2-6-5-9-8-9M33 23c2-6 5-9 8-9" stroke="#645871" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    ],
    [
      "a-snail",
      "Siput",
      `<path d="M6 52c0-4 4-6 10-6h32c7 0 11 3 11 7H10c-3 0-4-0-4-1z" fill="#dac1ac"/><path d="M12 47c-2-6-1-12 2-16M18 47c0-6 2-11 5-14" stroke="#dac1ac" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="14" cy="30" r="2.2" fill="#2b2b2b"/><circle cx="23" cy="32" r="2.2" fill="#2b2b2b"/><circle cx="37" cy="33" r="16" fill="#b89ec9"/><path d="M37 33m-2 0a2 2 0 1 1 4 0 6 6 0 1 1-12 0 10 10 0 1 1 20 0" stroke="#9b7cb4" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="50" rx="2.4" ry="1.4" fill="#dda4b1" opacity=".7"/>`,
    ],
    [
      "a-fish",
      "Ikan",
      `<path d="M44 32l15-11v22z" fill="#c7986b"/><ellipse cx="28" cy="32" rx="20" ry="14" fill="#d2aa85"/><path d="M24 18c4-5 10-5 13 1z" fill="#c7986b"/><path d="M31 20c2 5 2 19 0 24" stroke="#c7986b" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="18" cy="29" r="3" fill="#2b2b2b"/><circle cx="17" cy="28" r="1" fill="#fff"/><ellipse cx="20" cy="36" rx="3" ry="1.8" fill="#dda4b1" opacity=".8"/><path d="M9 33q2 1.5 3 0" stroke="#2b2b2b" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
    ],
    [
      "a-unicorn",
      "Unicorn",
      `<path d="M32 3l4.5 17h-9z" fill="#cfb97f" stroke="#b79d5e" stroke-width="1"/><path d="M29.5 9h5M28.5 14h7" stroke="#b79d5e" stroke-width="1.2"/><path d="M14 29l2-12 9 8zM50 29l-2-12-9 8z" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><path d="M38 19c9-1 15 5 16 13-4-3-8-4-12-3z" fill="#baa9d9"/><path d="M41 24c7 1 12 7 12 14-3-4-7-6-11-6z" fill="#8ac3bd"/><circle cx="31" cy="39" r="19" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><path d="M40 21c6 3 9 9 8 16" stroke="#dbabbb" stroke-width="4" fill="none" stroke-linecap="round"/>${kawaii({ cx: 31, ey: 38, my: 45 })}`,
    ],
  ].map(([id, n, svg]) => ({ id, n, vb: "0 0 64 64", svg, kind: "deco" }));

  // Hiasan tambahan untuk menghias halaman bulan.
  DECOS.push(
    ...[
      [
        "sakura",
        "Sakura",
        "0 0 64 64",
        `<g fill="#f1dfe1">${[0, 72, 144, 216, 288].map(a => `<path d="M32 32c-7-6-8-16-3-21l3 3 3-3c5 5 4 15-3 21z" transform="rotate(${a} 32 32)"/>`).join("")}</g><circle cx="32" cy="32" r="4" fill="#d195a6"/><g fill="#c57f93">${[0, 72, 144, 216, 288].map(a => `<circle cx="32" cy="24" r="1.2" transform="rotate(${a} 32 32)"/>`).join("")}</g>`,
      ],
      [
        "tulip",
        "Tulip",
        "0 0 64 64",
        `<path d="M32 60V30" stroke="#6c9f79" stroke-width="3" stroke-linecap="round"/><path d="M32 52c-8 0-14-6-16-14 8 0 14 6 16 14zM32 47c8 0 14-6 16-14-8 0-14 6-16 14z" fill="#7bb790"/><path d="M20 12l6 6 6-8 6 8 6-6v12c0 8-5 12-12 12S20 32 20 24z" fill="#ce8697"/>`,
      ],
      [
        "mushroom",
        "Jamur",
        "0 0 64 64",
        `<path d="M8 32c0-13 11-21 24-21s24 8 24 21z" fill="#c17375"/><circle cx="21" cy="22" r="3.5" fill="#fff"/><circle cx="35" cy="17" r="3" fill="#fff"/><circle cx="45" cy="26" r="3" fill="#fff"/><circle cx="29" cy="27" r="2.5" fill="#fff"/><path d="M22 32h20v18c0 5-4 8-10 8s-10-3-10-8z" fill="#f7f3eb" stroke="#ded3bf" stroke-width="1.5"/>${kawaii({ ey: 41, dx: 5, my: 46 })}`,
      ],
      [
        "cactus",
        "Kaktus",
        "0 0 64 64",
        `<path d="M18 46h28l-3 15H21z" fill="#c2977c"/><rect x="16" y="43" width="32" height="6" rx="2" fill="#cfa88e"/><path d="M26 44V18a6 6 0 0 1 12 0v26z" fill="#7bb790"/><path d="M26 32h-5a4 4 0 0 1-4-4v-6a3 3 0 0 1 6 0v4h3M38 28h5v-8a3 3 0 0 1 6 0v8a6 6 0 0 1-6 6h-5" fill="#7bb790"/><circle cx="32" cy="11" r="4" fill="#dbabbb"/>${kawaii({ ey: 25, dx: 3.5, my: 30, blush: false })}`,
      ],
      [
        "icecream",
        "Es krim",
        "0 0 64 64",
        `<path d="M21 34l11 27 11-27z" fill="#d3bb93"/><path d="M24 38l14 6M26 44l10 4M23 36l17 0" stroke="#b79470" stroke-width="1.4"/><circle cx="25" cy="30" r="10" fill="#a7cdc3"/><circle cx="39" cy="30" r="10" fill="#e6bbc5"/><circle cx="32" cy="19" r="10" fill="#f3eee0"/><circle cx="33" cy="8" r="3.5" fill="#c17375"/><path d="M33 5c1-3 3-4 5-4" stroke="#6c9f79" stroke-width="1.5" fill="none"/>`,
      ],
      [
        "boba",
        "Es boba",
        "0 0 64 64",
        `<path d="M37 4l-4 22" stroke="#ce8697" stroke-width="4" stroke-linecap="round"/><path d="M16 22h32l-4 36a4 4 0 0 1-4 3H24a4 4 0 0 1-4-3z" fill="#ddcbb9" opacity=".95"/><path d="M14 18h36v6H14z" fill="#fff" stroke="#ebe6df" stroke-width="1.5" rx="2"/><g fill="#413630">${pts(
          "24,50 30,53 36,50 41,54 27,56 34,57"
        )
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`)
          .join("")}</g>${kawaii({ ey: 34, dx: 5, my: 39 })}`,
      ],
      [
        "cupcake",
        "Kue mangkuk",
        "0 0 64 64",
        `<path d="M16 36h32l-4 22H20z" fill="#abbfdc"/><path d="M22 36l2 22M28 36l1 22M36 36l-1 22M42 36l-2 22" stroke="#95abca" stroke-width="1.5"/><path d="M14 37c-3-8 4-14 10-12 1-7 15-7 16 0 6-2 13 4 10 12z" fill="#f2e0e1"/><circle cx="32" cy="16" r="4" fill="#c17375"/><g stroke-width="2.2" stroke-linecap="round"><path d="M22 30l2-2" stroke="#c9b070"/><path d="M38 28l2 1" stroke="#7bb790"/><path d="M30 33l1-2" stroke="#88a3cd"/><path d="M44 33l-1-2" stroke="#baa9d9"/></g>`,
      ],
      [
        "balloon",
        "Balon",
        "0 0 64 64",
        `<path d="M22 38c0 8 6 10 4 24M42 34c0 8-4 12 0 28" stroke="#9da2ad" stroke-width="1.4" fill="none"/><ellipse cx="22" cy="24" rx="12" ry="15" fill="#ce8697"/><ellipse cx="42" cy="21" rx="12" ry="15" fill="#88a3cd"/><path d="M20 39l2-2 2 2zM40 36l2-2 2 2z" fill="#555"/><ellipse cx="18" cy="18" rx="3" ry="5" fill="#fff" opacity=".45"/><ellipse cx="38" cy="15" rx="3" ry="5" fill="#fff" opacity=".45"/>`,
      ],
      [
        "notes",
        "Not balok",
        "0 0 64 64",
        `<path d="M22 46V14l28-6v32" stroke="#8579b1" stroke-width="4" fill="none" stroke-linejoin="round"/><ellipse cx="16" cy="46" rx="7" ry="5.5" fill="#8579b1" transform="rotate(-20 16 46)"/><ellipse cx="44" cy="40" rx="7" ry="5.5" fill="#8579b1" transform="rotate(-20 44 40)"/><path d="M22 20l28-6" stroke="#8579b1" stroke-width="4"/>`,
      ],
      [
        "strawberry",
        "Stroberi",
        "0 0 64 64",
        `<path d="M32 60C16 50 10 36 14 26c4-8 14-8 18-4 4-4 14-4 18 4 4 10-2 24-18 34z" fill="#c77781"/><path d="M22 18l10 6 10-6-4-2 2-6-8 4-8-4 2 6z" fill="#6c9f79"/><g fill="#dccca1">${pts(
          "23,34 32,33 41,34 27,42 37,42 32,50 24,50 40,50"
        )
          .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.2" ry="1.8"/>`)
          .join("")}</g>`,
      ],
      [
        "planet",
        "Planet",
        "0 0 64 64",
        `<circle cx="32" cy="32" r="16" fill="#d5bc93"/><path d="M19 26c6-3 20-3 26 2M18 36c8 3 20 3 28-1" stroke="#c29d76" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="34" rx="30" ry="8" fill="none" stroke="#baa9d9" stroke-width="4" transform="rotate(-15 32 34)"/><circle cx="54" cy="10" r="2" fill="#ccb675"/><circle cx="8" cy="54" r="1.6" fill="#ccb675"/>`,
      ],
      [
        "bubble",
        "Balon kata",
        "0 0 80 56",
        `<path d="M10 4h60a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H30l-12 11 2-11h-10a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8z" fill="#fff" stroke="#3f4146" stroke-width="2.5" stroke-linejoin="round"/><text x="40" y="25" text-anchor="middle" dominant-baseline="central" font-family="Caveat, cursive" font-size="22" font-weight="700" fill="#3f4146">Hai!</text>`,
      ],
    ].map(([id, n, vb, svg]) => ({ id, n, vb, svg, kind: "deco" }))
  );

  // Hewan tambahan, digabung ke daftar ANIMALS dari hewan.js.
  ANIMALS.push(
    ...[
      [
        "a-koala",
        "Koala",
        `<circle cx="13" cy="24" r="11" fill="#aaafb9"/><circle cx="51" cy="24" r="11" fill="#aaafb9"/><circle cx="13" cy="24" r="6" fill="#f0e5e4"/><circle cx="51" cy="24" r="6" fill="#f0e5e4"/><circle cx="32" cy="37" r="20" fill="#c1c5cd"/><ellipse cx="32" cy="41" rx="5" ry="6" fill="#3f4146"/>${kawaii({ ey: 33, dx: 10, my: 50 })}`,
      ],
      [
        "a-pig",
        "Babi",
        `<path d="M14 26l2-14 11 8zM50 26l-2-14-11 8z" fill="#e1aeba"/><circle cx="32" cy="36" r="21" fill="#f2e0e0"/><ellipse cx="32" cy="43" rx="9" ry="6.5" fill="#e1aeba"/><ellipse cx="28.5" cy="43" rx="1.8" ry="2.4" fill="#b57282"/><ellipse cx="35.5" cy="43" rx="1.8" ry="2.4" fill="#b57282"/>${kawaii({ ey: 32, dx: 10, mouth: false })}`,
      ],
      [
        "a-sheep",
        "Domba",
        `<g fill="#fff" stroke="#ebe6df" stroke-width="1.5">${pts(
          "16,24 23,15 32,12 41,15 48,24 51,34 13,34 18,44 46,44"
        )
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`)
          .join(
            ""
          )}</g><ellipse cx="11" cy="36" rx="6" ry="3.5" fill="#c3ae9a" transform="rotate(-20 11 36)"/><ellipse cx="53" cy="36" rx="6" ry="3.5" fill="#c3ae9a" transform="rotate(20 53 36)"/><ellipse cx="32" cy="38" rx="13" ry="15" fill="#dbc9b5"/>${kawaii({ ey: 37, dx: 6, my: 45 })}`,
      ],
      [
        "a-mouse",
        "Tikus",
        `<circle cx="15" cy="20" r="12" fill="#c3c7cf"/><circle cx="49" cy="20" r="12" fill="#c3c7cf"/><circle cx="15" cy="20" r="7" fill="#f2e0e0"/><circle cx="49" cy="20" r="7" fill="#f2e0e0"/><circle cx="32" cy="39" r="19" fill="#e8e9e9"/><circle cx="32" cy="44" r="2.4" fill="#dda4b1"/><path d="M8 42h11M9 48l10-3M56 42H45M55 48l-10-3" stroke="#9da2ad" stroke-width="1.3" stroke-linecap="round"/>${kawaii({ ey: 37, dx: 7, my: 48, blush: false })}`,
      ],
      [
        "a-monkey",
        "Monyet",
        `<circle cx="10" cy="34" r="8" fill="#a07c62"/><circle cx="54" cy="34" r="8" fill="#a07c62"/><circle cx="10" cy="34" r="4.5" fill="#dbc9b5"/><circle cx="54" cy="34" r="4.5" fill="#dbc9b5"/><circle cx="32" cy="34" r="21" fill="#a07c62"/><g fill="#dbc9b5"><circle cx="25" cy="32" r="8"/><circle cx="39" cy="32" r="8"/><ellipse cx="32" cy="43" rx="13" ry="9"/></g>${kawaii({ ey: 32, dx: 7, my: 45 })}`,
      ],
      [
        "a-lion",
        "Singa",
        `<g fill="#c19773">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
          .map(a => `<circle cx="32" cy="10" r="8" transform="rotate(${a} 32 34)"/>`)
          .join(
            ""
          )}</g><circle cx="32" cy="34" r="20" fill="#c19773"/><circle cx="32" cy="35" r="17" fill="#d3bd89"/><path d="M29 40h6l-3 3z" fill="#7f634a"/>${kawaii({ ey: 33, dx: 7, my: 45 })}`,
      ],
      [
        "a-elephant",
        "Gajah",
        `<ellipse cx="12" cy="32" rx="11" ry="15" fill="#aabad3"/><ellipse cx="52" cy="32" rx="11" ry="15" fill="#aabad3"/><ellipse cx="12" cy="32" rx="6" ry="9" fill="#f0e5e4"/><ellipse cx="52" cy="32" rx="6" ry="9" fill="#f0e5e4"/><circle cx="32" cy="31" r="18" fill="#bdc8d9"/><path d="M27 38c0 10 1 17 8 20 4 1 5-4 1-5-4-1-3-7-3-15z" fill="#bdc8d9"/>${kawaii({ ey: 29, dx: 8, mouth: false })}`,
      ],
      [
        "a-dino",
        "Dino",
        `<path d="M12 28l5-11 5 9 5-12 5 12 5-12 5 12 5-9 5 11z" fill="#70a47b"/><ellipse cx="32" cy="40" rx="22" ry="18" fill="#93c497"/><ellipse cx="32" cy="47" rx="12" ry="7" fill="#d1dfc3"/>${kawaii({ ey: 36, dx: 8, my: 43 })}`,
      ],
    ].map(([id, n, svg]) => ({ id, n, vb: "0 0 64 64", svg, kind: "deco" }))
  );

  // Makanan lucu.
  const SNACKS = [
    [
      "f-donut",
      "Donat",
      `<path fill-rule="evenodd" d="M8 35a24 21 0 1 0 48 0a24 21 0 1 0-48 0zM27 27a5 4 0 1 0 10 0a5 4 0 1 0-10 0z" fill="#cbae92"/><path fill-rule="evenodd" d="M10 31c1-10 10-17 22-17s21 7 22 17c-3 4-6 0-8 3s-6 1-8-1-5 3-8 0-5 3-8 0-6 2-8-1-4 2-6-1zM27 27a5 4 0 1 0 10 0a5 4 0 1 0-10 0z" fill="#dbabbb"/><g stroke-width="2" stroke-linecap="round"><path d="M17 23l2-2" stroke="#fff"/><path d="M44 20l2 2" stroke="#88a3cd"/><path d="M22 16l2 1" stroke="#c9b070"/><path d="M41 28l2-1" stroke="#7bb790"/></g>${kawaii({ ey: 41, dx: 7, my: 47 })}`,
    ],
    [
      "f-onigiri",
      "Onigiri",
      `<path d="M32 8c6 0 26 33 26 42 0 6-4 8-10 8H16c-6 0-10-2-10-8 0-9 20-42 26-42z" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><rect x="21" y="42" width="22" height="16" rx="2" fill="#36433b"/>${kawaii({ ey: 31, dx: 7, my: 37 })}`,
    ],
    [
      "f-melon",
      "Semangka",
      `<path d="M4 20h56a28 28 0 0 1-56 0z" fill="#6c9f79"/><path d="M8 20h48a24 24 0 0 1-48 0z" fill="#f7f3eb"/><path d="M11 20h42a21 21 0 0 1-42 0z" fill="#ce8691"/><g fill="#352e2b">${pts(
        "20,27 44,27 26,36 38,36"
      )
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="2"/>`)
        .join("")}</g>${kawaii({ ey: 27, dx: 6, my: 33 })}`,
    ],
    [
      "f-avocado",
      "Alpukat",
      `<path d="M32 4c10 0 14 14 18 26s2 30-18 30S10 42 14 30 22 4 32 4z" fill="#739858"/><path d="M32 9c7 0 11 12 14 22s1 25-14 25-17-15-14-25S25 9 32 9z" fill="#c6d4a7"/><circle cx="32" cy="43" r="9" fill="#a07c62"/><circle cx="29" cy="40" r="2.5" fill="#b9967a"/>${kawaii({ ey: 25, dx: 6, my: 31 })}`,
    ],
    [
      "f-toast",
      "Roti",
      `<path d="M12 27c-6 0-8-6-6-11s8-9 26-9 24 4 26 9 0 11-6 11v27a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#c3a283"/><path d="M16 28c-4 0-6-4-4-8s6-7 20-7 18 3 20 7 0 8-4 8v26H16z" fill="#e5d6b9"/>${kawaii({ ey: 37, dx: 7, my: 43 })}`,
    ],
    [
      "f-pudding",
      "Puding",
      `<ellipse cx="32" cy="54" rx="27" ry="6" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><path d="M18 22h28l6 31H12z" fill="#d1b987"/><path d="M18 23c0-8 6-12 14-12s14 4 14 12c-3 4-6 0-9 3s-6 0-9 2-7-1-10-5z" fill="#7f634a"/><circle cx="32" cy="9" r="4" fill="#c17375"/>${kawaii({ ey: 38, dx: 7, my: 44 })}`,
    ],
    [
      "f-cookie",
      "Kue kering",
      `<circle cx="32" cy="32" r="25" fill="#c3a283"/><circle cx="32" cy="32" r="21" fill="#cbae8f"/><g fill="#594a3d">${pts(
        "20,20 42,18 47,34 17,40 30,48 44,47 27,15"
      )
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="2"/>`)
        .join("")}</g>${kawaii({ ey: 31, dx: 7, my: 37 })}`,
    ],
    [
      "f-milk",
      "Susu kotak",
      `<path d="M20 18l6-10h12l6 10z" fill="#abbfdc"/><path d="M38 8l4-6" stroke="#ce8697" stroke-width="3" stroke-linecap="round"/><rect x="20" y="18" width="24" height="40" rx="3" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><path d="M20.8 44h22.4v11a2.2 2.2 0 0 1-2.2 2.2H23a2.2 2.2 0 0 1-2.2-2.2z" fill="#abbfdc"/>${kawaii({ ey: 30, dx: 6, my: 36 })}`,
    ],
    [
      "f-macaron",
      "Makaron",
      `<ellipse cx="32" cy="22" rx="24" ry="12" fill="#e6bbc5"/><rect x="10" y="28" width="44" height="9" rx="4.5" fill="#f7f3eb"/><ellipse cx="32" cy="43" rx="24" ry="12" fill="#e6bbc5"/><path d="M14 33h36" stroke="#dbabbb" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round"/>${kawaii({ ey: 43, dx: 7, my: 49 })}`,
    ],
    [
      "f-sushi",
      "Sushi",
      `<rect x="8" y="30" width="48" height="22" rx="10" fill="#fff" stroke="#ebe6df" stroke-width="1.5"/><path d="M8 32c4-14 44-14 48 0-4 6-44 6-48 0z" fill="#d5a78e"/><path d="M19 23l4 7M29 21l2 8M38 21l1 8M47 24l-3 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>${kawaii({ ey: 42, dx: 7, my: 47 })}`,
    ],
  ].map(([id, n, svg]) => ({ id, n, vb: "0 0 64 64", svg, kind: "deco" }));

  // Kata-kata dalam gelembung. Hurufnya tebal dan pendek supaya terbaca walau stikernya kecil.
  const word = (w, txt, fill, fs = 22) => ({
    vb: `0 0 ${w} 44`,
    svg: `<rect x="3" y="5" width="${w - 6}" height="34" rx="17" fill="${fill}" stroke="#3f4146" stroke-width="2.5"/><text x="${w / 2}" y="23" text-anchor="middle" dominant-baseline="central" font-family="'Fraunces', system-ui, sans-serif" font-size="${fs}" font-weight="800" fill="#3f4146">${txt}</text>`,
  });

  // Benda lucu, cuaca, dan kata-kata.
  const CUTES = [
    [
      "c-star",
      "Bintang lucu",
      "0 0 64 64",
      `<path d="M32 4l8.5 17.5 19 2.5-14 13.5 3.5 19L32 47.5 15 56.5l3.5-19L4.5 24l19-2.5z" fill="#d2bd86" stroke="#bb9e61" stroke-width="2" stroke-linejoin="round"/>${kawaii({ ey: 33, dx: 6, my: 39 })}`,
    ],
    [
      "c-moon",
      "Bulan tidur",
      "0 0 64 64",
      `<path d="M26.7 8.2A26 26 0 1 0 54.8 41.9A22 22 0 0 1 26.7 8.2z" fill="#dccca1" stroke="#c7ae75" stroke-width="1.5"/><path d="M10 33q3 3 6 1M19 43q3 2 6-1" stroke="#2b2b2b" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="13" cy="41" rx="3" ry="2" fill="#dda4b1" opacity=".7"/><text x="46" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#96a1ca">z</text><text x="54" y="8" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#96a1ca">z</text>`,
    ],
    [
      "c-cloud",
      "Awan lucu",
      "0 0 64 64",
      `<path d="M15 50a11 11 0 0 1-1-22 14 14 0 0 1 27-6 11 11 0 0 1 15 10 9 9 0 0 1-2 18z" fill="#fff" stroke="#c0cbdc" stroke-width="2" stroke-linejoin="round"/>${kawaii({ ey: 38, dx: 6, my: 43 })}`,
    ],
    [
      "c-heart",
      "Hati lucu",
      "0 0 64 64",
      `<path d="M32 57S5 41 5 22a13.5 13.5 0 0 1 27-6 13.5 13.5 0 0 1 27 6c0 19-27 35-27 35z" fill="#da9aa8"/><ellipse cx="16" cy="19" rx="3" ry="5" fill="#fff" opacity=".5" transform="rotate(30 16 19)"/>${kawaii({ ey: 31, dx: 7, my: 37 })}`,
    ],
    [
      "c-rain",
      "Tetes hujan",
      "0 0 64 64",
      `<path d="M32 4C24 18 14 28 14 40a18 18 0 0 0 36 0C50 28 40 18 32 4z" fill="#a1bfd8"/><ellipse cx="23" cy="36" rx="2.5" ry="5" fill="#fff" opacity=".6"/>${kawaii({ ey: 40, dx: 6, my: 46 })}`,
    ],
    [
      "c-candy",
      "Permen",
      "0 0 64 64",
      `<path d="M20 32L4 21v22zM44 32l16-11v22z" fill="#dbabbb"/><circle cx="32" cy="32" r="15" fill="#e6bbc5"/><path d="M22 25c6-4 14-4 20 3M20 35c8 4 16 4 24-2" stroke="#fff" stroke-width="3" fill="none" opacity=".75" stroke-linecap="round"/>`,
    ],
    [
      "c-lolly",
      "Lolipop",
      "0 0 64 64",
      `<path d="M32 38v24" stroke="#ebe6df" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="21" r="18" fill="#a1bfd8"/><path d="M32 21m-4 0a4 4 0 1 1 8 0a8 8 0 1 1-16 0a12 12 0 1 1 24 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 43l-8-5v10zM32 43l8-5v10z" fill="#ce8697"/>`,
    ],
    [
      "c-bone",
      "Tulang",
      "0 0 64 32",
      `<g fill="#d7ccb6"><circle cx="10" cy="10" r="8.5"/><circle cx="10" cy="22" r="8.5"/><circle cx="54" cy="10" r="8.5"/><circle cx="54" cy="22" r="8.5"/><rect x="10" y="9.5" width="44" height="13"/></g><g fill="#f8f6ef"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="22" r="7"/><circle cx="54" cy="10" r="7"/><circle cx="54" cy="22" r="7"/><rect x="10" y="11" width="44" height="10"/></g>`,
    ],
    [
      "c-shell",
      "Kerang",
      "0 0 64 64",
      `<path d="M24 52h16l-8 9z" fill="#d4b09d"/><path d="M32 6C14 6 4 26 8 46l24 10 24-10c4-20-6-40-24-40z" fill="#e5c9b9"/><path d="M32 8v47M21 10l6 45M43 10l-6 45M10 24l15 30M54 24L39 54" stroke="#d4b09d" stroke-width="2" stroke-linecap="round"/>`,
    ],
    [
      "c-letter",
      "Surat cinta",
      "0 0 64 64",
      `<rect x="6" y="14" width="52" height="36" rx="4" fill="#fff" stroke="#ebe6df" stroke-width="2"/><path d="M8 16l24 18 24-18" stroke="#ebe6df" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M32 42s-7-4-7-9a3.5 3.5 0 0 1 7-1.5 3.5 3.5 0 0 1 7 1.5c0 5-7 9-7 9z" fill="#ce8697"/>`,
    ],
    [
      "c-plant",
      "Pot tanaman",
      "0 0 64 64",
      `<path d="M32 30c-2-10-10-16-18-14 0 8 8 14 18 14zM32 30c2-12 10-18 20-16 0 9-9 16-20 16z" fill="#7bb790"/><path d="M32 32V22" stroke="#6c9f79" stroke-width="3"/><path d="M16 34h32l-4 24H20z" fill="#cfa88e"/><rect x="14" y="30" width="36" height="7" rx="2" fill="#c2977c"/>${kawaii({ ey: 45, dx: 6, my: 51 })}`,
    ],
    [
      "c-camera",
      "Kamera",
      "0 0 64 64",
      `<rect x="14" y="12" width="14" height="8" rx="2" fill="#7a94bd"/><rect x="6" y="18" width="52" height="36" rx="8" fill="#9fb2cf"/><circle cx="34" cy="36" r="12" fill="#fff"/><circle cx="34" cy="36" r="8" fill="#3f4146"/><circle cx="31" cy="33" r="2.5" fill="#fff"/><circle cx="50" cy="25" r="2.5" fill="#dccca1"/>`,
    ],
    [
      "c-book",
      "Buku",
      "0 0 64 64",
      `<path d="M32 16c-8-6-18-6-26-4v40c8-2 18-2 26 4 8-6 18-6 26-4V12c-8-2-18-2-26 4z" fill="#fff" stroke="#baa9d9" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 16v40" stroke="#baa9d9" stroke-width="2.5"/><path d="M12 22h14M12 28h14M12 34h10M38 22h14M38 28h14M38 34h10" stroke="#e8e3ec" stroke-width="2" stroke-linecap="round"/>`,
    ],
    ["w-yay", "Yay!", ...Object.values(word(80, "Yay!", "#d2bd86"))],
    ["w-semangat", "Semangat!", ...Object.values(word(132, "Semangat!", "#a7cdc3"))],
    ["w-love", "Love", ...Object.values(word(86, "Love ♥", "#e6bbc5", 20))],
    ["w-wah", "Wah!", ...Object.values(word(80, "Wah!", "#abbfdc"))],
    ["w-hebat", "Hebat!", ...Object.values(word(100, "Hebat!", "#e5c9b9"))],
  ].map(([id, n, vb, svg]) => ({ id, n, vb, svg, kind: "deco" }));

  window.LEGACY_STK = new Map([...DECOS, ...ANIMALS, ...SNACKS, ...CUTES].map(s => [s.id, s]));
})();
