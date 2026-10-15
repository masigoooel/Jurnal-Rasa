/* Sambutan: tiga layar singkat untuk pengguna baru. Bisa dibuka lagi dari Pengaturan. */

const WELCOME_KEY = "jurnal-rasa:welcome";
const WSV = d =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const WELCOME = [
  {
    t: "Pilih rasamu",
    p: "Setiap hari, pilih satu wajah yang paling menggambarkan perasaanmu. Tidak ada jawaban yang salah.",
    art: () => `<div class="wart faces">${[1, 2, 3, 4, 5].map(l => face(l, 48)).join("")}</div>`,
  },
  {
    t: "Ceritakan sedikit",
    p: "Tandai apa yang memengaruhi harimu, lalu tulis cerita singkat. Bagian “Isi cepat” seperti energi, syukur, dan foto boleh dilewati.",
    art: () =>
      `<div class="wart chips">${["Keluarga", "Pekerjaan", "Olahraga", "Teman", "Tidur"].map((x, i) => `<span class="tag"${i % 2 ? "" : ` aria-pressed="true"`}>${x}</span>`).join("")}</div>`,
  },
  {
    t: "Temukan polamu",
    p: "Semakin sering kamu menulis, semakin jelas pola rasamu terlihat.",
    art: () =>
      `<div class="wart tabs">${[
        [
          "--accent",
          '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
          "Kalender",
          "Perjalanan rasamu per bulan dan tahun",
        ],
        [
          "--m5",
          '<path d="M3 20h18M6 16v-5M11 16V6M16 16v-8"/>',
          "Wawasan",
          "Apa yang membuat harimu baik atau berat",
        ],
        [
          "--m4",
          '<path d="M6 3h12v18l-6-4-6 4z"/>',
          "Koleksi",
          "Syukur, kapsul waktu, dan lencana",
        ],
        [
          "--m1",
          '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
          "Catatan",
          "Cari dan cetak tulisan lama",
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
function renderWelcome() {
  const w = WELCOME[S.wi],
    last = S.wi === WELCOME.length - 1;
  $("#dlgWelcome").innerHTML =
    `<div class="wel">${w.art()}<h2>${w.t}</h2><p class="muted">${w.p}</p>
    <div class="wdots2">${WELCOME.map((_, i) => `<i class="${i === S.wi ? "on" : ""}"></i>`).join("")}</div>
    <div class="wbtnrow">${S.wi ? `<button class="btn ghost" id="welBack">Kembali</button>` : `<button class="btn ghost" id="welSkip">Lewati</button>`}<button class="btn primary" id="welNext">${last ? "Mulai menulis" : "Lanjut"}</button></div>
    ${last ? `<p class="muted small">Semua catatan tersimpan di browser ini saja.</p>` : ""}</div>`;
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
      renderWelcome();
    } else $("#dlgWelcome").close();
    return;
  }
  if (t.id === "welBack") {
    S.wi--;
    renderWelcome();
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
