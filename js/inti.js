/* Inti: konstanta, helper, state, penyimpanan, dan efek kecil yang dipakai semua fitur. */

const MOODS = [
  null,
  { n: "Berat" },
  { n: "Kurang" },
  { n: "Biasa" },
  { n: "Baik" },
  { n: "Senang" },
];
const TAGS = [
  "Keluarga",
  "Pekerjaan",
  "Sekolah/Kuliah",
  "Teman",
  "Pasangan",
  "Kesehatan",
  "Tidur",
  "Ibadah",
  "Olahraga",
  "Uang",
  "Makanan",
  "Hobi",
  "Cuaca",
  "Istirahat",
];
const HABITS = ["Minum air cukup", "Jalan kaki", "Baca buku"];
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const ENERGY = ["", "Lelah", "Lesu", "Cukup", "Segar", "Penuh"];
const PROMPTS = {
  low: [
    "Apa yang paling berat hari ini?",
    "Apa yang kamu butuhkan sekarang?",
    "Siapa yang bisa kamu ajak bicara soal ini?",
    "Apa satu hal kecil yang bisa bikin besok sedikit lebih ringan?",
    "Kalau sahabatmu mengalami hari seperti ini, apa yang akan kamu katakan padanya?",
  ],
  mid: [
    "Apa satu hal kecil yang kamu syukuri hari ini?",
    "Apa yang paling menyita pikiranmu hari ini?",
    "Momen apa yang paling kamu ingat dari hari ini?",
    "Apa yang ingin kamu lakukan berbeda besok?",
    "Apa yang kamu pelajari hari ini?",
  ],
  high: [
    "Apa yang bikin hari ini menyenangkan?",
    "Siapa yang ikut membuat harimu baik?",
    "Bagaimana caranya supaya hari seperti ini terulang?",
    "Momen apa yang ingin kamu ingat terus?",
    "Apa yang kamu banggakan dari dirimu hari ini?",
  ],
};
// Kata perasaan yang lebih spesifik untuk tiap tingkat rasa (boleh pilih sampai 3).
const EMOS = {
  1: ["Sedih", "Cemas", "Kesal", "Kecewa", "Kesepian", "Takut", "Putus asa"],
  2: ["Gelisah", "Lelah", "Bosan", "Bingung", "Tertekan", "Jenuh", "Kecewa"],
  3: ["Tenang", "Datar", "Sibuk", "Lelah", "Santai", "Bingung"],
  4: ["Lega", "Tenang", "Puas", "Bersyukur", "Optimis", "Santai"],
  5: ["Bahagia", "Bangga", "Bersemangat", "Dicintai", "Gembira", "Lega"],
};
const EMO_MAX = 3;
// Tema pertanyaan pemantik. "auto" memakai PROMPTS sesuai rasa yang dipilih.
const PROMPT_THEMES = {
  auto: { n: "Sesuai rasa" },
  diri: {
    n: "Diri sendiri",
    q: [
      "Apa yang sedang kamu butuhkan dari dirimu sendiri?",
      "Kapan hari ini kamu merasa paling jadi dirimu?",
      "Apa yang kamu pelajari tentang dirimu minggu ini?",
      "Pikiran apa yang paling sering muncul hari ini?",
      "Apa satu hal yang ingin kamu maafkan dari dirimu?",
      "Apa yang membuatmu bangga, sekecil apa pun?",
    ],
  },
  hubungan: {
    n: "Hubungan",
    q: [
      "Siapa yang paling kamu pikirkan hari ini, dan kenapa?",
      "Percakapan apa yang paling berkesan hari ini?",
      "Siapa yang ingin kamu ucapkan terima kasih?",
      "Apakah ada yang ingin kamu sampaikan tapi belum sempat?",
      "Dengan siapa kamu merasa paling nyaman akhir-akhir ini?",
      "Hubungan mana yang ingin kamu rawat lebih baik?",
    ],
  },
  kerja: {
    n: "Kerja & belajar",
    q: [
      "Apa yang berhasil kamu selesaikan hari ini?",
      "Apa yang paling menguras tenagamu hari ini?",
      "Apa hal baru yang kamu pelajari?",
      "Apa yang bisa dibuat lebih ringan besok?",
      "Kapan kamu merasa paling fokus hari ini?",
      "Apa yang ingin kamu tunda dulu supaya tidak terlalu penuh?",
    ],
  },
  depan: {
    n: "Masa depan",
    q: [
      "Apa yang sedang kamu nantikan?",
      "Seperti apa hari yang ideal bagimu setahun lagi?",
      "Apa satu langkah kecil yang bisa kamu ambil minggu ini?",
      "Apa yang ingin kamu katakan pada dirimu sebulan dari sekarang?",
      "Kebiasaan apa yang ingin kamu mulai?",
      "Apa yang membuatmu khawatir tentang besok, dan apa yang bisa kamu kendalikan?",
    ],
  },
  syukur: {
    n: "Syukur",
    q: [
      "Apa hal kecil yang membuatmu tersenyum hari ini?",
      "Siapa yang membuat harimu lebih mudah?",
      "Apa dari tubuhmu yang patut kamu syukuri hari ini?",
      "Tempat mana yang membuatmu merasa nyaman?",
      "Apa yang dulu kamu harapkan dan sekarang sudah kamu miliki?",
      "Momen sederhana apa yang ingin kamu ingat?",
    ],
  },
};
const MOUTHS = {
  1: "M15 31 Q22 24 29 31",
  2: "M15.5 30 Q22 27 28.5 30",
  3: "M16 29 L28 29",
  4: "M15.5 27 Q22 32 28.5 27",
  5: "M14 26 Q22 36 30 26 Z",
};

const $ = s => document.querySelector(s);
const esc = s =>
  String(s).replace(
    /[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
const num = (v, d = 1) => v.toFixed(d).replace(".", ",");
const avgOf = a => a.reduce((x, y) => x + y, 0) / a.length;
const pad = n => String(n).padStart(2, "0");
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = k => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const todayKey = () => keyOf(new Date());
const fmtLong = k =>
  fromKey(k).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const fmtShort = k =>
  fromKey(k).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
const fmtDate = k =>
  fromKey(k).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const monthName = (y, mo) =>
  new Date(y, mo, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
const trunc = (t, n) => (t.length > n ? t.slice(0, n).trimEnd() + "…" : t);
const isMobile = () => matchMedia("(max-width:820px)").matches;
// Animasi dimatikan kalau sistem memintanya, atau kalau "Kurangi animasi" dinyalakan di Pengaturan.
const reducedMotion = () => !!S.set.calm || matchMedia("(prefers-reduced-motion:reduce)").matches;
const emptyBox = (txt, lvl = 3) => `<div class="empty">${face(lvl, 40)}${txt}</div>`;
// Tanggal yang sama di bulan lain; dibatasi ke akhir bulan supaya 31 Mar tidak jadi 3 Mar.
function sameDay(y, m, d) {
  const last = new Date(y, m + 1, 0).getDate();
  return keyOf(new Date(y, m, Math.min(d, last)));
}

function face(level, size = 44) {
  const c = level ? `var(--m${level})` : "var(--surface-2)";
  const m = MOUTHS[level || 3];
  return `<svg viewBox="0 0 44 44" width="${size}" height="${size}" aria-hidden="true"><circle cx="22" cy="22" r="20" fill="${c}"/>
  <g class="eyes"><circle cx="16" cy="18" r="2.2" fill="var(--face)"/><circle cx="28" cy="18" r="2.2" fill="var(--face)"/></g>
  <path d="${m}" fill="${level === 5 ? "var(--face)" : "none"}" stroke="var(--face)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

const S = {
  entries: {},
  tags: [],
  habits: [],
  badges: [],
  caps: [],
  set: {},
  sel: todayKey(),
  draft: {
    mood: 0,
    tags: [],
    note: "",
    energy: 0,
    sleep: null,
    grat: ["", "", ""],
    photo: "",
    moments: [],
    habits: [],
    emo: [],
  },
  dirty: false,
  saving: false,
  confirmDel: false,
  justSaved: false,
  vm: new Date().getFullYear(),
  vmo: new Date().getMonth(),
  vy: new Date().getFullYear(),
  tagEdit: false,
  tagAdding: false,
  tagNew: "",
  habEdit: false,
  habAdding: false,
  habNew: "",
  xopen: "",
  promptIdx: new Date().getDate(),
  q: "",
  fMood: [],
  fTag: "",
  histLimit: 10,
  capMonths: 3,
  facMode: "month",
  gy: new Date().getFullYear(),
  gmo: new Date().getMonth(),
};

/* ===== Penyimpanan (localStorage) ===== */
const STORE_KEY = "jurnal-rasa:entries",
  TAG_KEY = "jurnal-rasa:tags",
  HABIT_KEY = "jurnal-rasa:habits";
function loadList(key, def) {
  try {
    const a = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(a)) return a.filter(x => typeof x === "string");
  } catch (_) {}
  return [...def];
}
function saveList(key, a) {
  try {
    localStorage.setItem(key, JSON.stringify(a));
  } catch (_) {}
}
const saveTags = () => saveList(TAG_KEY, S.tags);
const saveHabits = () => saveList(HABIT_KEY, S.habits);
function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(S.entries));
    return true;
  } catch (_) {
    return false;
  }
}
// Simpan/muat objek sederhana (misalnya niat harian dan refleksi mingguan).
function loadObj(key) {
  try {
    const o = JSON.parse(localStorage.getItem(key) || "{}");
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch (_) {
    return {};
  }
}
function saveObj(key, o) {
  try {
    localStorage.setItem(key, JSON.stringify(o));
    return true;
  } catch (_) {
    return false;
  }
}
function restore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

/* ===== Hitungan bersama ===== */
function streak() {
  let d = new Date();
  if (!S.entries[keyOf(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (S.entries[keyOf(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
function longestRun(ks) {
  let best = 0,
    run = 0,
    prev = null;
  [...ks].sort().forEach(k => {
    const d = fromKey(k);
    run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  return best;
}
function topTags(list) {
  const c = {};
  list.forEach(e => (e.tags || []).forEach(t => (c[t] = (c[t] || 0) + 1)));
  return Object.entries(c)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

/* ===== Efek kecil ===== */
// Angka statistik menghitung naik dari 0.
function countUp(root) {
  if (reducedMotion()) return;
  root.querySelectorAll("[data-count]").forEach(el => {
    const to = +el.dataset.count,
      dec = +(el.dataset.dec || 0),
      t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / 700),
        v = to * (1 - Math.pow(1 - p, 3));
      el.textContent = dec ? num(v, dec) : Math.round(v);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Konfeti kecil dari sebuah elemen; makin senang, makin banyak.
function burst(el, mood) {
  if (!el || reducedMotion()) return;
  const r = el.getBoundingClientRect(),
    n = 8 + mood * 5;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i"),
      a = Math.random() * Math.PI * 2,
      d = 50 + Math.random() * 90;
    p.className = "confetti";
    p.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;--r:${Math.random() * 540 - 270}deg;background:var(--m${1 + Math.floor(Math.random() * 5)});${i % 3 ? "" : "border-radius:50%;"}`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
}

function toast(html, ms = 4500) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = html;
  $("#toasts").appendChild(t);
  setTimeout(() => t.classList.add("out"), ms);
  setTimeout(() => t.remove(), ms + 500);
  return t;
}
