/* Fitur: cuaca, coretan tangan, mode hari yang berat, rekap musim, sampul buku, pembatas "terakhir dibaca",
   suara kertas, dan buku tahunan.
   Dimuat sebelum main.js. Data cuaca dan coretan disimpan di catatan (e.weather, e.doodle). */

/* ===== Cuaca ===== */
const WEATHER = [
  [
    "cerah",
    "Cerah",
    `<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>`,
  ],
  [
    "berawan",
    "Berawan",
    `<path d="M7 18.5a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1-.5 9z"/><path d="M15 5.5a3 3 0 0 1 5 2.5"/>`,
  ],
  [
    "mendung",
    "Mendung",
    `<path d="M6.5 18a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 16.5 9a4.5 4.5 0 0 1 .5 9z"/>`,
  ],
  [
    "hujan",
    "Hujan",
    `<path d="M6.5 14a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 16.5 5a4.5 4.5 0 0 1 .5 9z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>`,
  ],
];
const isWeather = w => WEATHER.some(x => x[0] === w);
const weatherName = w => WEATHER.find(x => x[0] === w)?.[1] || "";
const wIcon = (w, size = 22) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${WEATHER.find(x => x[0] === w)?.[2] || ""}</svg>`;

function renderWeather() {
  const el = $("#weather");
  if (!el) return;
  el.innerHTML = WEATHER.map(
    ([id, n]) =>
      `<button class="wbtn" data-weather="${id}" aria-pressed="${S.draft.weather === id}">${wIcon(id)}${n}</button>`
  ).join("");
}

/* ===== Coretan tangan ===== */
// Kanvas kecil untuk menggambar dengan jari atau pena. Disimpan sebagai PNG transparan di catatan.
const DOODLE_W = 560,
  DOODLE_H = 280,
  INKS = ["#4a4d40", "var(--m1)", "var(--m2)", "var(--m4)", "var(--m5)", "#6a7b4e"];
let ink = INKS[0],
  pen = null;
function renderDoodle() {
  const el = $("#doodle");
  if (!el) return;
  if (!el.dataset.ready) {
    el.innerHTML = `<canvas id="dcanvas" width="${DOODLE_W}" height="${DOODLE_H}" aria-label="Kanvas coretan"></canvas>
      <div class="drow"><div class="inks">${INKS.map((c, i) => `<button class="ink" data-ink="${i}" style="--ic:${c}" aria-label="Warna ${i + 1}" aria-pressed="${i === 0}"></button>`).join("")}</div><button class="btn text sm" id="doodleClear">Hapus coretan</button></div>`;
    el.dataset.ready = "1";
    const c = $("#dcanvas");
    c.addEventListener("pointerdown", e => {
      const r = c.getBoundingClientRect(),
        g = c.getContext("2d");
      pen = { g, r };
      g.strokeStyle = resolveInk(ink);
      g.lineWidth = 3.2;
      g.lineCap = g.lineJoin = "round";
      g.beginPath();
      g.moveTo(
        ((e.clientX - r.left) * DOODLE_W) / r.width,
        ((e.clientY - r.top) * DOODLE_H) / r.height
      );
      c.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    c.addEventListener("pointermove", e => {
      if (!pen) return;
      const { g, r } = pen;
      g.lineTo(
        ((e.clientX - r.left) * DOODLE_W) / r.width,
        ((e.clientY - r.top) * DOODLE_H) / r.height
      );
      g.stroke();
    });
    const end = () => {
      if (!pen) return;
      pen = null;
      S.draft.doodle = c.toDataURL("image/png");
      S.dirty = true;
      S.justSaved = false;
      renderEditor();
    };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
  }
  paintDoodle();
}
function resolveInk(v) {
  if (!v.startsWith("var(")) return v;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(v.slice(4, -1)).trim() || "#4a4d40"
  );
}
function paintDoodle() {
  const c = $("#dcanvas");
  if (!c) return;
  const g = c.getContext("2d");
  g.clearRect(0, 0, DOODLE_W, DOODLE_H);
  if (S.draft.doodle) {
    const im = new Image();
    im.onload = () => g.drawImage(im, 0, 0, DOODLE_W, DOODLE_H);
    im.src = S.draft.doodle;
  }
}

/* ===== Mode hari yang berat ===== */
// Saat rasa Berat atau Kurang dipilih, halaman tulis disederhanakan: isi cepat dan niat disembunyikan.
function applyHeavy() {
  const m = S.draft.mood,
    heavy = m && m <= 2 && !S.showAll;
  document.body.classList.toggle("heavy", !!heavy);
  const b = $("#heavyMore");
  if (b) b.hidden = !heavy;
}

/* ===== Ringkasan rasa (rekap musim dan buku tahunan) ===== */
function ringkasRasa(es) {
  const cnt = [0, 0, 0, 0, 0, 0];
  es.forEach(e => cnt[e.mood]++);
  const count = list => {
    const c = {};
    list.forEach(x => (c[x] = (c[x] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  };
  return {
    cnt,
    top: [1, 2, 3, 4, 5].sort((a, b) => cnt[b] - cnt[a] || b - a)[0],
    emos: count(es.flatMap(e => e.emo || [])).slice(0, 3),
    goodTags: count(es.filter(e => e.mood >= 4).flatMap(e => e.tags || [])).slice(0, 2),
    wth: count(es.filter(e => e.weather).map(e => e.weather))[0],
  };
}
// Kalimat ringkasan dengan <b> untuk bagian penting.
function kalimatRasa(r, n, waktu) {
  let w = `Kamu menulis <b>${n} hari</b> ${waktu}, paling sering terasa <b>${MOODS[r.top].n.toLowerCase()}</b>.`;
  if (r.emos.length)
    w += ` Kata yang paling sering kamu pilih: <b>${r.emos.map(x => esc(x[0].toLowerCase())).join(", ")}</b>.`;
  if (r.goodTags.length)
    w += ` Hari-hari baikmu sering ditemani <b>${r.goodTags.map(x => esc(x[0].toLowerCase())).join(" dan ")}</b>.`;
  if (r.wth)
    w += ` Cuaca yang paling sering kamu catat: <b>${weatherName(r.wth[0]).toLowerCase()}</b>.`;
  return w;
}

/* ===== Rekap musim (tiga bulan terakhir) ===== */
function renderSeason() {
  const el = $("#season");
  if (!el) return;
  const t = fromKey(todayKey()),
    months = [2, 1, 0].map(i => {
      const d = new Date(t.getFullYear(), t.getMonth() - i, 1);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    }),
    ks = Object.keys(S.entries).filter(k => months.includes(k.slice(0, 7))),
    name = mk => fromKey(mk + "-01").toLocaleDateString("id-ID", { month: "short" });
  $("#seasonRange").textContent = `${name(months[0])}–${name(months[2])} ${t.getFullYear()}`;
  if (ks.length < 5) {
    el.innerHTML = emptyBox(
      `Rekap musim muncul setelah ada minimal 5 catatan dalam tiga bulan ini. Sekarang baru ${ks.length}.`
    );
    return;
  }
  const es = ks.map(k => S.entries[k]),
    r = ringkasRasa(es);
  const bar = [1, 2, 3, 4, 5]
    .filter(l => r.cnt[l])
    .map(
      l =>
        `<i style="flex:${r.cnt[l]};background:var(--m${l})" title="${MOODS[l].n}: ${r.cnt[l]} hari"></i>`
    )
    .join("");
  const legend = [1, 2, 3, 4, 5]
    .filter(l => r.cnt[l])
    .map(
      l =>
        `<span><i style="background:var(--m${l})"></i>${MOODS[l].n} ${Math.round((r.cnt[l] / es.length) * 100)}%</span>`
    )
    .join("");
  const words = kalimatRasa(r, es.length, "musim ini");
  const fern = stickerById("n-fern");
  el.innerHTML = `<div class="sbar" role="img" aria-label="Sebaran rasa musim ini">${bar}</div><div class="slegend">${legend}</div><p class="stext">${words}</p>${fern ? `<span class="sfern" aria-hidden="true">${stickerSvg(fern)}</span>` : ""}`;
}

/* ===== Sampul buku (layar pembuka) ===== */
const COVER_KEY = "jurnal-rasa:cover",
  COVERS = [
    ["lumut", "Kain lumut"],
    ["kraft", "Kertas kraft"],
    ["malam", "Malam"],
  ];
function curCover() {
  try {
    const c = localStorage.getItem(COVER_KEY);
    return COVERS.some(x => x[0] === c) ? c : "lumut";
  } catch (_) {
    return "lumut";
  }
}
function renderCoverPick() {
  const el = $("#coverPick");
  if (!el) return;
  const cur = curCover();
  el.innerHTML = COVERS.map(
    ([id, n]) =>
      `<button class="cvr" data-cover="${id}" aria-pressed="${cur === id}"><i></i>${n}</button>`
  ).join("");
}

/* ===== Pembatas "terakhir dibaca" ===== */
const LASTREAD_KEY = "jurnal-rasa:lastread";
function setLastRead(k) {
  S.lastRead = k;
  try {
    localStorage.setItem(LASTREAD_KEY, k);
  } catch (_) {}
}
try {
  S.lastRead = localStorage.getItem(LASTREAD_KEY) || "";
  S.readK = S.lastRead;
} catch (_) {
  S.lastRead = "";
}

/* ===== Suara kertas ===== */
// Dibuat langsung dengan Web Audio (desis kertas dari derau yang disaring), jadi tidak perlu file suara.
// Mati secara bawaan; dinyalakan di Pengaturan > Tampilan.
let audioCtx = null;
function kertas(jenis) {
  if (!S.set.sound) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (_) {
    return;
  }
  const a = audioCtx,
    t = a.currentTime;
  // Derau: desis kertas.
  const desis = (mulai, lama, f0, f1, q, vol) => {
    const n = Math.ceil(a.sampleRate * lama),
      buf = a.createBuffer(1, n, a.sampleRate),
      d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.random());
    const src = a.createBufferSource(),
      bp = a.createBiquadFilter(),
      g = a.createGain();
    src.buffer = buf;
    bp.type = "bandpass";
    bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t + mulai);
    bp.frequency.exponentialRampToValueAtTime(f1, t + mulai + lama);
    g.gain.setValueAtTime(0.0001, t + mulai);
    g.gain.exponentialRampToValueAtTime(vol, t + mulai + lama * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + mulai + lama);
    src.connect(bp).connect(g).connect(a.destination);
    src.start(t + mulai);
    src.stop(t + mulai + lama + 0.02);
  };
  if (jenis === "balik") {
    // Halaman dibalik: desis naik lalu turun, ditutup tepukan kecil saat kertas jatuh.
    desis(0, 0.32, 700, 2600, 0.7, 0.07);
    desis(0.26, 0.12, 1400, 500, 0.9, 0.05);
  } else {
    // Menyimpan: dua goresan pensil pendek dan bunyi "tok" lembut.
    desis(0, 0.07, 3200, 2200, 1.2, 0.04);
    desis(0.09, 0.09, 3000, 1800, 1.2, 0.04);
    const o = a.createOscillator(),
      g = a.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(540, t + 0.2);
    o.frequency.exponentialRampToValueAtTime(380, t + 0.38);
    g.gain.setValueAtTime(0.0001, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.215);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g).connect(a.destination);
    o.start(t + 0.2);
    o.stop(t + 0.45);
  }
}

/* ===== Buku tahunan ===== */
// Satu gambar PNG panjang: sampul, rekap setahun (rasa per bulan, empat musim, ringkasan), lalu semua
// halaman bulan tahun itu dengan template dan hiasannya. Halaman digambar satu per satu lewat pageCanvas
// (js/hias.js), jadi tahun yang sedang dibuka di kalender sementara berpindah bulan lalu dikembalikan.
const teksPolos = html => {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent;
};
function wrapLines(g, text, maxW) {
  const out = [];
  let line = "";
  text.split(" ").forEach(w => {
    const t = line ? line + " " + w : w;
    if (g.measureText(t).width > maxW && line) {
      out.push(line);
      line = w;
    } else line = t;
  });
  if (line) out.push(line);
  return out;
}
function drawMoon(g, cx, cy, r, c) {
  const o = document.createElement("canvas");
  o.width = o.height = Math.ceil(r * 3.4);
  const h = o.getContext("2d"),
    k = r / 31,
    X = v => (v - 47) * k + r * 1.4,
    Y = v => (v - 53) * k + r * 1.7;
  h.fillStyle = c.m1;
  h.beginPath();
  h.arc(X(47), Y(53), 31 * k, 0, 7);
  h.fill();
  h.globalCompositeOperation = "destination-out";
  h.beginPath();
  h.arc(X(64), Y(40), 25 * k, 0, 7);
  h.fill();
  h.globalCompositeOperation = "source-over";
  h.strokeStyle = c.cover;
  h.lineWidth = 3 * k;
  h.lineCap = "round";
  h.beginPath();
  h.moveTo(X(29), Y(58));
  h.quadraticCurveTo(X(33), Y(61.6), X(37), Y(58));
  h.stroke();
  h.fillStyle = c.m4;
  h.translate(X(72), Y(36));
  h.beginPath();
  [
    [0, -10],
    [2.2, -2.2],
    [10, 0],
    [2.2, 2.2],
    [0, 10],
    [-2.2, 2.2],
    [-10, 0],
    [-2.2, -2.2],
  ].forEach(([x, y]) => h.lineTo(x * k, y * k));
  h.fill();
  g.drawImage(o, cx - r * 1.4, cy - r * 1.7);
}
async function bukuTahunan(btn) {
  const y = S.vm,
    keep = S.vmo,
    now = new Date(),
    last = y === now.getFullYear() ? now.getMonth() : 11,
    ks = Object.keys(S.entries).filter(k => k.startsWith(y + "-"));
  if (!ks.length) {
    toast(
      `<span class="bdg" style="--bc:var(--m3)">${bsvg("check")}</span><div><small>Buku tahunan</small><b>Belum ada catatan di tahun ${y}.</b></div>`
    );
    return;
  }
  if (btn) btn.disabled = true;
  toast(
    `<span class="bdg" style="--bc:var(--accent)">${bsvg("check")}</span><div><small>Buku tahunan ${y}</small><b>Sedang menyusun ${last + 1} halaman…</b></div>`,
    3000
  );
  const b = document.body.classList,
    calm = b.contains("calm-motion"),
    pages = [];
  b.add("calm-motion");
  try {
    for (let m = 0; m <= last; m++) {
      S.vmo = m;
      renderMonth();
      pages.push(await pageCanvas("calpage", true));
    }
  } catch (_) {
    pages.length = 0;
  } finally {
    S.vm = y;
    S.vmo = keep;
    renderMonth();
    if (!calm) b.remove("calm-motion");
    if (btn) btn.disabled = false;
  }
  if (!pages.length) {
    toast(
      `<span class="bdg" style="--bc:var(--danger)">${bsvg("check")}</span><div><small>Buku tahunan</small><b>Gagal menyusun gambar. Coba dari tab Kalender.</b></div>`
    );
    return;
  }
  const root = getComputedStyle(document.documentElement),
    v = n => root.getPropertyValue(n).trim(),
    c = {
      paper: v("--page2") || v("--surface"),
      fg: v("--fg"),
      mu: v("--muted"),
      line: v("--line"),
      cover: "#6a7b4e",
      onCover: "#f9f8f2",
      m1: v("--m1"),
      m4: v("--m4"),
    },
    mc = [0, 1, 2, 3, 4, 5].map(l => v(`--m${l}`));
  // Sampul selalu hijau lumut dengan tulisan krem, di tema terang maupun gelap.
  const W = 2160,
    M = 96,
    GAP = 40,
    CW = (W - 2 * M - 2 * GAP) / 3,
    COVER = 640,
    CH = 340,
    QH = 150,
    es = ks.map(k => S.entries[k]),
    r = ringkasRasa(es),
    words = teksPolos(kalimatRasa(r, es.length, `sepanjang ${y}`));
  const meas = document.createElement("canvas").getContext("2d");
  meas.font = `400 36px Figtree, system-ui, sans-serif`;
  const lines = wrapLines(meas, words, W - 2 * M);
  const rows = [];
  for (let i = 0; i < pages.length; i += 3) {
    const row = pages.slice(i, i + 3);
    rows.push(Math.max(...row.map(p => (p.height * CW) / p.width)));
  }
  const recapH = 120 + 70 + CH + 70 + 60 + QH + 60 + lines.length * 54 + 40,
    gridH = 130 + rows.reduce((a, h) => a + h + GAP, 0),
    H = Math.round(COVER + recapH + gridH + 120);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  g.fillStyle = c.paper;
  g.fillRect(0, 0, W, H);

  // Sampul
  g.fillStyle = c.cover;
  g.fillRect(0, 0, W, COVER);
  g.fillStyle = "rgba(0,0,0,.12)";
  g.fillRect(0, 0, 36, COVER);
  drawMoon(g, W - M - 150, 250, 120, c);
  g.fillStyle = c.onCover;
  g.textBaseline = "alphabetic";
  g.textAlign = "left";
  g.globalAlpha = 0.8;
  g.font = `700 34px Figtree, system-ui, sans-serif`;
  if ("letterSpacing" in g) g.letterSpacing = "6px";
  g.fillText("BUKU TAHUNAN", M + 20, 190);
  if ("letterSpacing" in g) g.letterSpacing = "0px";
  g.globalAlpha = 1;
  g.font = `600 220px Fraunces, Georgia, serif`;
  g.fillText(String(y), M + 10, 410);
  g.globalAlpha = 0.85;
  g.font = `500 40px Figtree, system-ui, sans-serif`;
  g.fillText(`Jurnal Rasa · ${es.length} hari tercatat`, M + 20, 500);
  g.globalAlpha = 1;
  g.fillStyle = mc[4];
  g.fillRect(0, COVER - 18, W, 18);

  // Rekap setahun
  let top = COVER + 120;
  g.fillStyle = c.fg;
  g.font = `500 64px Fraunces, Georgia, serif`;
  g.fillText("Setahun dalam rasa", M, top);
  top += 70;
  const bw = (W - 2 * M) / 12,
    mon = m => new Date(y, m, 1).toLocaleDateString("id-ID", { month: "short" }),
    perM = Array.from({ length: 12 }, (_, m) => {
      const n = [0, 0, 0, 0, 0, 0];
      ks.filter(k => +k.slice(5, 7) === m + 1).forEach(k => n[S.entries[k].mood]++);
      return n;
    }),
    maxN = Math.max(1, ...perM.map(n => n.reduce((a, x) => a + x, 0)));
  perM.forEach((n, m) => {
    const tot = n.reduce((a, x) => a + x, 0),
      x = M + m * bw + 14,
      w = bw - 28,
      base = top + CH;
    let yy = base;
    if (!tot) {
      g.fillStyle = c.line;
      g.beginPath();
      g.roundRect(x, base - 8, w, 8, 4);
      g.fill();
    } else {
      g.save();
      g.beginPath();
      g.roundRect(x, base - (tot / maxN) * CH, w, (tot / maxN) * CH, 14);
      g.clip();
      [1, 2, 3, 4, 5].forEach(l => {
        const h = (n[l] / maxN) * CH;
        g.fillStyle = mc[l];
        g.fillRect(x, yy - h, w, h);
        yy -= h;
      });
      g.restore();
      g.fillStyle = c.mu;
      g.font = `600 26px Figtree, system-ui, sans-serif`;
      g.textAlign = "center";
      g.fillText(String(tot), x + w / 2, base - (tot / maxN) * CH - 14);
    }
    g.fillStyle = c.fg;
    g.font = `600 28px Figtree, system-ui, sans-serif`;
    g.textAlign = "center";
    g.fillText(mon(m), x + w / 2, base + 48);
  });
  g.textAlign = "left";
  top += CH + 70 + 60;
  // Empat musim (per tiga bulan)
  const qw = (W - 2 * M - 3 * 28) / 4;
  [0, 1, 2, 3].forEach(q => {
    const x = M + q * (qw + 28),
      qes = ks.filter(k => Math.floor((+k.slice(5, 7) - 1) / 3) === q).map(k => S.entries[k]);
    g.fillStyle = c.line;
    g.beginPath();
    g.roundRect(x, top, qw, QH, 22);
    g.globalAlpha = 0.55;
    g.fill();
    g.globalAlpha = 1;
    g.fillStyle = c.mu;
    g.font = `700 24px Figtree, system-ui, sans-serif`;
    g.fillText(`${mon(q * 3)} – ${mon(q * 3 + 2)}`.toUpperCase(), x + 28, top + 46);
    if (qes.length) {
      const t = ringkasRasa(qes).top;
      g.fillStyle = mc[t];
      g.beginPath();
      g.arc(x + 44, top + 98, 16, 0, 7);
      g.fill();
      g.fillStyle = c.fg;
      g.font = `600 34px Figtree, system-ui, sans-serif`;
      g.fillText(MOODS[t].n, x + 72, top + 110);
      g.fillStyle = c.mu;
      g.font = `500 26px Figtree, system-ui, sans-serif`;
      g.textAlign = "right";
      g.fillText(`${qes.length} hari`, x + qw - 28, top + 108);
      g.textAlign = "left";
    } else {
      g.fillStyle = c.mu;
      g.font = `500 30px Figtree, system-ui, sans-serif`;
      g.fillText("Belum ada catatan", x + 28, top + 108);
    }
  });
  top += QH + 60;
  g.fillStyle = c.fg;
  g.font = `400 36px Figtree, system-ui, sans-serif`;
  lines.forEach((l, i) => g.fillText(l, M, top + 36 + i * 54));
  top += lines.length * 54 + 40;

  // Halaman bulan
  top += 110;
  g.fillStyle = c.fg;
  g.font = `500 64px Fraunces, Georgia, serif`;
  g.fillText(`${pages.length} halaman bulan`, M, top);
  top += 20;
  rows.forEach((rh, ri) => {
    pages.slice(ri * 3, ri * 3 + 3).forEach((p, i) => {
      const x = M + i * (CW + GAP),
        h = (p.height * CW) / p.width;
      g.save();
      g.shadowColor = "rgba(0,0,0,.14)";
      g.shadowBlur = 24;
      g.shadowOffsetY = 6;
      g.beginPath();
      g.roundRect(x, top, CW, h, 18);
      g.fillStyle = c.paper;
      g.fill();
      g.shadowColor = "transparent";
      g.clip();
      g.drawImage(p, x, top, CW, h);
      g.restore();
    });
    top += rh + GAP;
  });
  g.fillStyle = c.mu;
  g.font = `500 28px Figtree, system-ui, sans-serif`;
  g.fillText(`Dibuat dengan Jurnal Rasa · ${fmtLong(todayKey())}`, M, H - 56);

  cv.toBlob(blob => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `jurnal-rasa-buku-tahunan-${y}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, "image/png");
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.weather) {
    S.draft.weather = S.draft.weather === t.dataset.weather ? "" : t.dataset.weather;
    S.dirty = true;
    S.justSaved = false;
    renderEditor();
    return;
  }
  if (t.dataset.ink) {
    ink = INKS[+t.dataset.ink];
    document.querySelectorAll("#doodle .ink").forEach(b => b.setAttribute("aria-pressed", b === t));
    return;
  }
  if (t.id === "doodleClear") {
    S.draft.doodle = "";
    S.dirty = true;
    S.justSaved = false;
    paintDoodle();
    renderEditor();
    return;
  }
  if (t.id === "yearBook") {
    bukuTahunan(t);
    return;
  }
  if (t.id === "heavyMore") {
    S.showAll = true;
    renderEditor();
    return;
  }
  if (t.dataset.cover) {
    try {
      localStorage.setItem(COVER_KEY, t.dataset.cover);
    } catch (_) {}
    document.documentElement.dataset.cover = t.dataset.cover;
    renderCoverPick();
  }
});
