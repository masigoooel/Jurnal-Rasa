/* Koleksi: dinding syukur, kapsul waktu, dan lencana. */

// Dinding syukur punya navigasi bulan sendiri, terpisah dari tab Kalender.
function renderGratWall() {
  const y = S.gy,
    mo = S.gmo,
    now = new Date(),
    pre = `${y}-${pad(mo + 1)}-`,
    items = [];
  Object.keys(S.entries)
    .filter(k => k.startsWith(pre))
    .sort()
    .forEach(k => {
      const e = S.entries[k];
      (e.grat || []).forEach(t => items.push({ k, t, m: e.mood }));
    });
  const name = monthName(y, mo);
  $("#gNext").disabled = y > now.getFullYear() || (y === now.getFullYear() && mo >= now.getMonth());
  $("#gratSum").textContent = items.length
    ? `${items.length} hal yang kamu syukuri di ${name}.`
    : `Belum ada catatan syukur di ${name}.`;
  $("#gwall").innerHTML = items.length
    ? items
        .slice()
        .reverse()
        .slice(0, 12)
        .map(
          (g, i) =>
            `<button class="gcard" data-day="${g.k}" style="--gc:var(--m${g.m});--rot:${[-1.5, 1, -0.5, 1.5, -1, 0.5][i % 6]}deg"><p>${esc(g.t)}</p><small>${fmtShort(g.k)}</small></button>`
        )
        .join("") +
      (items.length > 12 ? `<p class="muted small gmore">dan ${items.length - 12} lagi</p>` : "")
    : emptyBox(
        "Buka “Syukur” di bagian Isi cepat saat menulis. Hal yang kamu syukuri akan terkumpul di sini.",
        4
      );
}

/* ===== Kapsul waktu ===== */
const CAP_KEY = "jurnal-rasa:capsules";
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>`;
const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>`;
function loadCaps() {
  try {
    const a = JSON.parse(localStorage.getItem(CAP_KEY));
    return Array.isArray(a)
      ? a.filter(c => c && typeof c.text === "string" && typeof c.openAt === "string")
      : [];
  } catch (_) {
    return [];
  }
}
function saveCaps() {
  try {
    localStorage.setItem(CAP_KEY, JSON.stringify(S.caps));
    return true;
  } catch (_) {
    return false;
  }
}

function renderCapForm() {
  document
    .querySelectorAll("#capSeg [data-cap]")
    .forEach(b => b.setAttribute("aria-pressed", +b.dataset.cap === S.capMonths));
  $("#capSave").disabled = !$("#capText").value.trim();
}

function renderCaps() {
  const tk = todayKey(),
    el = $("#caps");
  const list = [...S.caps].sort((a, b) => a.opened - b.opened || a.openAt.localeCompare(b.openAt));
  const del = c =>
    `<button class="link small capdel" data-capdel="${c.id}">${S.capDelArm === c.id ? "Yakin hapus?" : "Hapus"}</button>`;
  el.innerHTML = list
    .map(c => {
      if (c.opened)
        return `<article class="cap open${S.capJust === c.id ? " reveal" : ""}"><div class="caph"><span class="capic">${ICON_MAIL}</span><div><b>Surat dari ${fmtDate(c.created)}</b><small>Dibuka ${fmtDate(c.openedOn || c.openAt)}</small></div>${del(c)}</div><p class="captext">${esc(c.text)}</p></article>`;
      if (c.openAt <= tk)
        return `<article class="cap ready"><div class="caph"><span class="capic">${ICON_MAIL}</span><div><b>Kapsul siap dibuka!</b><small>Ditulis ${fmtDate(c.created)}</small></div></div><button class="btn primary sm" data-capopen="${c.id}">Buka sekarang</button></article>`;
      const days = Math.round((fromKey(c.openAt) - fromKey(tk)) / 864e5);
      return `<article class="cap locked"><div class="caph"><span class="capic">${ICON_LOCK}</span><div><b>Terkunci sampai ${fmtDate(c.openAt)}</b><small>Ditulis ${fmtDate(c.created)} · ${days} hari lagi</small></div>${del(c)}</div></article>`;
    })
    .join("");
  S.capJust = null;
}

function saveCapsule() {
  const text = $("#capText").value.trim(),
    msg = $("#capMsg");
  if (!text) return;
  const n = new Date(),
    c = {
      id: Date.now().toString(36),
      created: todayKey(),
      openAt: sameDay(n.getFullYear(), n.getMonth() + S.capMonths, n.getDate()),
      text,
      opened: false,
    };
  S.caps.push(c);
  if (!saveCaps()) {
    S.caps.pop();
    msg.textContent = "Gagal menyimpan kapsul. Penyimpanan browser mungkin penuh.";
    return;
  }
  msg.textContent = "";
  $("#capText").value = "";
  renderCapForm();
  renderCaps();
  toast(
    `<span class="bdg" style="--bc:var(--m1)">${ICON_LOCK}</span><div><small>Kapsul waktu</small><b>Kapsul terkunci sampai ${fmtDate(c.openAt)}</b><span>Sampai jumpa di masa depan.</span></div>`
  );
  addBadge("capsule");
}

// Saat halaman dibuka, beri tahu kalau ada kapsul yang waktunya sudah tiba.
function checkCapsules() {
  const n = S.caps.filter(c => !c.opened && c.openAt <= todayKey()).length;
  if (n)
    toast(
      `<span class="bdg" style="--bc:var(--m1)">${ICON_MAIL}</span><div><small>Kapsul waktu</small><b>${n} kapsul siap dibuka</b><span><button class="link" data-tab="koleksi">Lihat di Koleksi</button></span></div>`,
      9000
    );
}

/* ===== Lencana ===== */
const BADGE_KEY = "jurnal-rasa:badges";
const BADGES = [
  ["first", "Langkah pertama", "Menulis catatan pertama", "star"],
  ["streak7", "Seminggu penuh", "7 hari beruntun", "flame"],
  ["streak30", "Sebulan penuh", "30 hari beruntun", "crown"],
  ["n30", "Tiga puluh cerita", "30 catatan", "book"],
  ["n100", "Seratus hari", "100 catatan", "trophy"],
  ["writer", "Penulis", "Satu catatan lebih dari 100 kata", "pen"],
  ["rainbow", "Pelangi rasa", "Pernah merasakan kelima rasa", "palette"],
  ["grateful", "Hati yang bersyukur", "Menulis syukur di 10 hari", "heart"],
  ["photo", "Penyimpan kenangan", "Menambahkan foto pertama", "camera"],
  ["sleep", "Pengamat tidur", "Mengisi jam tidur 7 hari", "moon"],
  ["calm", "Tenang", "Menyelesaikan latihan napas", "wind"],
  ["habit", "Rutin kecil", "Mencentang kebiasaan di 7 hari", "check"],
  ["capsule", "Surat untuk nanti", "Menulis kapsul waktu pertama", "mail"],
];
const BCOL = ["--m5", "--m4", "--accent", "--m1", "--m2"];
const BICON = {
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  flame: '<path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 5 1-1 1-3 0-9z"/>',
  crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  trophy:
    '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  palette:
    '<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7"/>',
  check: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 12.5l3 3 5-6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
};
const bsvg = ic =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BICON[ic]}</svg>`;
const badgeIcon = id => {
  const i = BADGES.findIndex(b => b[0] === id);
  return `<span class="bdg" style="--bc:var(${BCOL[i % BCOL.length]})">${bsvg(BADGES[i][3])}</span>`;
};

function loadBadges() {
  try {
    const a = JSON.parse(localStorage.getItem(BADGE_KEY));
    return Array.isArray(a) ? a : [];
  } catch (_) {
    return [];
  }
}
function saveBadges() {
  try {
    localStorage.setItem(BADGE_KEY, JSON.stringify(S.badges));
  } catch (_) {}
}

function earnedNow() {
  const ks = Object.keys(S.entries),
    es = Object.values(S.entries),
    got = new Set(),
    run = longestRun(ks);
  if (ks.length) got.add("first");
  if (run >= 7) got.add("streak7");
  if (run >= 30) got.add("streak30");
  if (ks.length >= 30) got.add("n30");
  if (ks.length >= 100) got.add("n100");
  if (es.some(e => (e.note || "").trim().split(/\s+/).length > 100)) got.add("writer");
  if (new Set(es.map(e => e.mood)).size === 5) got.add("rainbow");
  if (es.filter(e => e.grat?.length).length >= 10) got.add("grateful");
  if (es.some(e => e.photo)) got.add("photo");
  if (es.filter(e => typeof e.sleep === "number").length >= 7) got.add("sleep");
  if (es.filter(e => e.habits?.length).length >= 7) got.add("habit");
  if (S.caps.length) got.add("capsule");
  return got;
}

// Lencana tidak pernah dicabut. Saat halaman dibuka disinkronkan diam-diam; setelah menyimpan, lencana baru dirayakan.
function syncBadges(celebrate) {
  const fresh = [...earnedNow()].filter(id => !S.badges.includes(id));
  if (!fresh.length) return;
  S.badges.push(...fresh);
  saveBadges();
  renderBadges();
  if (celebrate) fresh.forEach((id, i) => setTimeout(() => badgeToast(id), 600 + i * 900));
}
function addBadge(id) {
  if (S.badges.includes(id)) return;
  S.badges.push(id);
  saveBadges();
  renderBadges();
  badgeToast(id);
}
function badgeToast(id) {
  if (!S.set.fBadge) return;
  const b = BADGES.find(x => x[0] === id);
  burst(
    toast(
      `${badgeIcon(id)}<div><small>Lencana baru!</small><b>${b[1]}</b><span>${b[2]}</span></div>`
    ),
    4
  );
}

function renderBadges() {
  const got = new Set(S.badges),
    n = BADGES.filter(b => got.has(b[0])).length;
  $("#badgeSum").textContent = `${n} dari ${BADGES.length} lencana terkumpul.`;
  $("#badges").innerHTML = [
    ...BADGES.filter(b => got.has(b[0])),
    ...BADGES.filter(b => !got.has(b[0])),
  ]
    .map(
      ([id, n, d]) =>
        `<div class="bd${got.has(id) ? " on" : ""}">${badgeIcon(id)}<b>${n}</b><small>${d}</small></div>`
    )
    .join("");
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.cap) {
    S.capMonths = +t.dataset.cap;
    renderCapForm();
    return;
  }
  if (t.id === "gPrev" || t.id === "gNext") {
    const d = new Date(S.gy, S.gmo + (t.id === "gNext" ? 1 : -1), 1);
    S.gy = d.getFullYear();
    S.gmo = d.getMonth();
    renderGratWall();
    return;
  }
  if (t.id === "capSave") {
    saveCapsule();
    return;
  }
  if (t.dataset.capopen) {
    const c = S.caps.find(x => x.id === t.dataset.capopen);
    if (!c) return;
    c.opened = true;
    c.openedOn = todayKey();
    saveCaps();
    S.capJust = c.id;
    renderCaps();
    burst($(".cap.reveal"), 5);
    return;
  }
  if (t.dataset.capdel) {
    const id = t.dataset.capdel;
    if (S.capDelArm !== id) {
      S.capDelArm = id;
      renderCaps();
      return;
    }
    S.caps = S.caps.filter(c => c.id !== id);
    S.capDelArm = null;
    saveCaps();
    renderCaps();
    return;
  }
});
$("#capText").addEventListener("input", renderCapForm);
