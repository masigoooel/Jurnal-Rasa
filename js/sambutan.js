/* Sambutan: tiga halaman singkat untuk pengguna baru (pilih rasa, tulis, lihat pola), bergaya halaman buku.
   Bisa dibuka lagi dari Pengaturan > Panduan. */

const WELCOME_KEY = "jurnal-rasa:welcome";
const WSV = d =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const WELCOME = [
  {
    t: "Pilih rasamu",
    p: "Setiap hari, pilih satu wajah yang paling dekat dengan perasaanmu. Setelah itu kamu boleh menambahkan kata perasaan yang lebih tepat.",
    h: "tidak ada jawaban yang salah",
    art: () => `<div class="wart faces">${[1, 2, 3, 4, 5].map(l => face(l, 46)).join("")}</div>`,
  },
  {
    t: "Tulis sedikit",
    p: "Ceritakan harimu, sependek apa pun. Isi cepat seperti label, cuaca, coretan, dan foto boleh dilewati. Di hari yang berat, halamannya dibuat lebih sederhana.",
    h: "satu kalimat juga cukup",
    art: () =>
      `<div class="wart wnote"><div class="wpaper"><span class="wq">Apa yang paling kamu ingat hari ini?</span><span class="wline">Hujan dari sore, jadi baca di rumah sambil minum teh.</span></div><div class="wplus">${["Label", "Cuaca", "Coretan", "Foto"].map(x => `<span>+ ${x}</span>`).join("")}</div></div>`,
  },
  {
    t: "Lihat polamu",
    p: "Semakin sering menulis, semakin jelas polanya. Fitur yang tidak kamu perlukan bisa dimatikan di Pengaturan.",
    h: "semua tersimpan di browser ini saja",
    art: () =>
      `<div class="wart tabs">${[
        [
          "--accent",
          '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
          "Kalender",
          "Rasa per bulan",
        ],
        [
          "--m5",
          '<path d="M3 20h18M6 16v-5M11 16V6M16 16v-8"/>',
          "Wawasan",
          "Pola dan rekap musim",
        ],
        ["--m4", '<path d="M6 3h12v18l-6-4-6 4z"/>', "Koleksi", "Syukur dan stiker"],
        [
          "--m1",
          '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
          "Catatan",
          "Baca halaman lama",
        ],
      ]
        .map(
          ([c, d, n, s]) =>
            `<div class="wtab"><span class="hi" style="--hc:var(${c})">${WSV(d)}</span><div><b>${n}</b><small>${s}</small></div></div>`
        )
        .join("")}</div>`,
  },
];

function openWelcome() {
  S.wi = 0;
  renderWelcome();
  $("#dlgWelcome").showModal();
}
// Tiap layar dibuat seperti satu halaman buku: kepala halaman, gambar, tulisan tangan, dan nomor halaman.
// dir: 1 = maju, -1 = mundur (arah balikan halaman).
function renderWelcome(dir = 0) {
  const w = WELCOME[S.wi],
    last = S.wi === WELCOME.length - 1;
  $("#dlgWelcome").innerHTML =
    `<div class="wel"><div class="wpage${dir ? (dir > 0 ? " fwd" : " back") : ""}">
      <p class="wrun">Jurnal Rasa · cara memakai</p>
      ${w.art()}<h2>${w.t}</h2><p class="muted">${w.p}</p><p class="whand">${w.h}</p>
      <span class="wfolio">${S.wi + 1}</span></div>
    <div class="wdots2" aria-label="Halaman ${S.wi + 1} dari ${WELCOME.length}">${WELCOME.map((_, i) => `<i class="${i === S.wi ? "on" : ""}"></i>`).join("")}</div>
    <div class="wbtnrow">${S.wi ? `<button class="btn ghost" id="welBack">Kembali</button>` : `<button class="btn ghost" id="welSkip">Lewati</button>`}<button class="btn primary" id="welNext">${last ? "Mulai menulis" : "Lanjut"}</button></div></div>`;
  if (dir) kertas("balik");
}
function checkWelcome() {
  let seen = false;
  try {
    seen = !!localStorage.getItem(WELCOME_KEY);
  } catch (_) {}
  if (!seen && !Object.keys(S.entries).length && !isLocked()) openWelcome();
}

document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "welNext") {
    if (S.wi < WELCOME.length - 1) {
      S.wi++;
      renderWelcome(1);
    } else $("#dlgWelcome").close();
    return;
  }
  if (t.id === "welBack") {
    S.wi--;
    renderWelcome(-1);
    return;
  }
  if (t.id === "welSkip") {
    $("#dlgWelcome").close();
    return;
  }
  if (t.id === "welcomeAgain") {
    $("#dlgSet").close();
    openWelcome();
    return;
  }
});
$("#dlgWelcome").addEventListener("close", () => {
  try {
    localStorage.setItem(WELCOME_KEY, "1");
  } catch (_) {}
});
