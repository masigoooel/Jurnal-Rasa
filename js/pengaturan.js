/* Pengaturan: tema, backup, kapasitas, pengingat, kunci PIN, dan sembunyikan isi catatan. */

/* ===== Tema ===== */
const THEME_KEY = "jurnal-rasa:theme",
  THEMES = ["auto", "light", "dark"];
const THEME_UI = {
  auto: {
    n: "Ikuti sistem",
    i: `<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor"/>`,
  },
  light: {
    n: "Terang",
    i: `<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>`,
  },
  dark: { n: "Gelap", i: `<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>` },
};
function applyTheme(t) {
  S.theme = t;
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  try {
    t === "auto" ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, t);
  } catch (_) {}
  const b = $("#theme"),
    u = THEME_UI[t];
  b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${u.i}</svg>`;
  b.title = `Tema: ${u.n} (klik untuk ganti)`;
  b.setAttribute("aria-label", `Tema: ${u.n}. Klik untuk ganti.`);
}

/* ===== Pengaturan ===== */
const SET_KEY = "jurnal-rasa:settings";
const SET_DEF = {
  remind: false,
  time: "20:00",
  hide: false,
  pinHash: "",
  pinSalt: "",
  pinLen: 0,
  calm: false,
  big: false,
  fIntent: true,
  fHabit: true,
  fCap: true,
  fBadge: false,
};
// Fitur tambahan yang boleh dimatikan. Saat mati hanya disembunyikan; datanya tidak dihapus.
const FEATS = [
  ["fIntent", "Niat harian", "Ajakan memasang niat di atas catatan"],
  ["fHabit", "Kebiasaan", "Daftar centang di Isi cepat"],
  ["fCap", "Kapsul waktu", "Surat untuk dirimu di masa depan"],
  ["fBadge", "Lencana & hari beruntun", "Hitungan hari berturut-turut dan lencana"],
];
function applyFeatures() {
  const b = document.body.classList;
  FEATS.forEach(([k]) => b.toggle("no-" + k.slice(1).toLowerCase(), !S.set[k]));
  b.toggle("calm-motion", !!S.set.calm);
  document.documentElement.classList.toggle("big-text", !!S.set.big);
}
function renderFeats() {
  const on = FEATS.filter(([k]) => S.set[k]).length;
  $("#featSum").textContent = `${on} dari ${FEATS.length} aktif`;
  $("#featBox").hidden = !S.featOpen;
  $("#featToggle").setAttribute("aria-expanded", !!S.featOpen);
  $("#featToggle").textContent = S.featOpen ? "Tutup" : "Atur";
  $("#feats").innerHTML = FEATS.map(
    ([k, n, d]) =>
      `<label class="feat"><span><b>${n}</b><small>${d}</small></span><span class="switch"><input type="checkbox" data-feat="${k}"${S.set[k] ? " checked" : ""}><span></span></span></label>`
  ).join("");
  $("#calmOn").checked = !!S.set.calm;
  $("#bigOn").checked = !!S.set.big;
}
function loadSet() {
  try {
    return { ...SET_DEF, ...JSON.parse(localStorage.getItem(SET_KEY) || "{}") };
  } catch (_) {
    return { ...SET_DEF };
  }
}
function saveSet() {
  try {
    localStorage.setItem(SET_KEY, JSON.stringify(S.set));
  } catch (_) {}
}

function openSettings() {
  S.pinMode = null;
  S.featOpen = false;
  S.instOpen = false;
  S.imp = null;
  renderSettings();
  renderImport();
  $("#dlgSet").showModal();
}
function renderSettings() {
  const st = S.set,
    perm = "Notification" in window ? Notification.permission : "unsupported";
  const last = lastBackup();
  const u = storageUsage(),
    pct = Math.min(100, (u.chars / STORAGE_LIMIT) * 100);
  $("#bkNote").textContent =
    `${last ? `Terakhir ${fmtDate(last)}` : "Belum pernah"} · terpakai ${size(u.chars)} dari ±5 MB`;
  // Rincian kapasitas baru ditampilkan kalau mulai penuh.
  $("#stoSub").hidden = pct <= 60;
  $("#stoNote").textContent =
    `Terpakai sekitar ${size(u.chars)} dari ±5 MB${u.photos ? ` · ${u.photos} foto memakai ${size(u.photoChars)}` : ""}.${pct > 80 ? " Hampir penuh: hapus beberapa foto atau unduh backup." : ""}`;
  $("#stoBar").style.width = `${Math.max(2, pct)}%`;
  $("#stoBar").className = pct > 80 ? "warn" : "";
  $("#remOn").checked = st.remind;
  $("#remTime").value = st.time;
  $("#remSub").hidden = !st.remind;
  $("#remNote").textContent =
    perm === "granted"
      ? "Notifikasi muncul selama Jurnal Rasa terbuka di salah satu tab. Kalau halaman sedang ditutup, pengingat muncul saat kamu membukanya lagi."
      : perm === "denied"
        ? "Browser menolak izin notifikasi, jadi pengingat hanya muncul di dalam halaman."
        : perm === "unsupported"
          ? "Browser ini tidak mendukung notifikasi, jadi pengingat hanya muncul di dalam halaman."
          : "Browser akan meminta izin untuk menampilkan notifikasi.";
  $("#hideOn").checked = st.hide;
  renderFeats();
  renderInstall();
  const has = !!st.pinHash;
  $("#pinNote").textContent = has
    ? `Aktif. Terkunci saat dibuka atau ditinggal 1 menit.`
    : "Minta PIN saat jurnal dibuka.";
  $("#pinAct").innerHTML = has
    ? `<button class="btn ghost sm" id="pinChange">Ganti</button><button class="btn text sm" id="pinRemove">Hapus</button>`
    : `<button class="btn ghost sm" id="pinSet">Pasang PIN</button>`;
  const f = $("#pinForm"),
    m = S.pinMode;
  f.hidden = !m;
  if (!m) {
    f.innerHTML = "";
    return;
  }
  const field = (id, l) =>
    `<label class="pf"><span>${l}</span><input id="${id}" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off"></label>`;
  f.innerHTML = `${m !== "set" ? field("pinOld", "PIN sekarang") : ""}${m !== "remove" ? field("pin1", "PIN baru (4–6 angka)") + field("pin2", "Ulangi PIN baru") : ""}
    <div class="row"><button class="btn primary sm" id="pinSave">${m === "remove" ? "Hapus PIN" : "Simpan PIN"}</button><button class="btn ghost sm" id="pinCancel">Batal</button></div>
    <p class="pmsg" id="pinMsg"></p>
    <p class="muted small">PIN hanya mengunci tampilan. Catatan tetap tersimpan biasa di browser, jadi orang yang paham teknis masih bisa membacanya.</p>`;
  f.querySelector("input").focus();
}

/* ===== Pasang sebagai aplikasi (PWA) ===== */
// Chrome/Edge di Android dan desktop memberi event beforeinstallprompt; Safari di iPhone harus lewat menu Bagikan.
let installEvt = null;
addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  installEvt = e;
  if ($("#dlgSet").open) renderInstall();
});
addEventListener("appinstalled", () => {
  installEvt = null;
  if ($("#dlgSet").open) renderInstall();
});
function renderInstall() {
  const standalone =
      matchMedia("(display-mode: standalone)").matches || navigator.standalone === true,
    ios = /iphone|ipad|ipod/i.test(navigator.userAgent),
    web = location.protocol.startsWith("http");
  $("#instBtn").hidden = !installEvt || standalone;
  // Sudah dibuka sebagai aplikasi: tombolnya tidak perlu ada.
  $("#instOpen").hidden = standalone;
  $("#instBox").hidden = !S.instOpen || standalone;
  $("#instOpen").setAttribute("aria-expanded", !!S.instOpen);
  $("#instNote").textContent = standalone
    ? "Sudah terpasang. Kamu sedang membuka Jurnal Rasa sebagai aplikasi."
    : !web
      ? "Bisa dipasang setelah Jurnal Rasa dibuka dari alamat web (bukan file di komputer)."
      : installEvt
        ? "Pasang supaya muncul di layar utama dan bisa dibuka tanpa internet."
        : ios
          ? "Di Safari: ketuk tombol Bagikan, lalu pilih “Tambahkan ke Layar Utama”."
          : "Buka menu browser (⋮), lalu pilih “Instal aplikasi” atau “Tambahkan ke layar utama”.";
}

/* ===== Kapasitas penyimpanan ===== */
// Kuota localStorage sekitar 5 juta karakter di kebanyakan browser; angkanya perkiraan.
const STORAGE_LIMIT = 5e6;
const size = c => (c < 1e5 ? `${Math.max(1, Math.round(c / 1e3))} KB` : `${num(c / 1e6, 1)} MB`);
function storageUsage() {
  let chars = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith("jurnal-rasa:")) chars += k.length + (localStorage.getItem(k) || "").length;
  }
  const ph = Object.values(S.entries).filter(e => e.photo);
  return { chars, photos: ph.length, photoChars: ph.reduce((s, e) => s + e.photo.length, 0) };
}

/* ===== Backup ===== */
const BACKUP_KEY = "jurnal-rasa:lastBackup",
  NUDGE_KEY = "jurnal-rasa:nudgeHide";
const lastBackup = () => {
  try {
    return localStorage.getItem(BACKUP_KEY) || "";
  } catch (_) {
    return "";
  }
};

function exportBackup() {
  const data = {
    app: "jurnal-rasa",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: S.entries,
    tags: S.tags,
    habits: S.habits,
    capsules: S.caps,
    badges: S.badges,
    intents: S.intents,
    reflections: S.refs,
    stickers: S.stk,
    calpages: S.pages,
  };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
  a.download = `jurnal-rasa-backup-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  try {
    localStorage.setItem(BACKUP_KEY, todayKey());
  } catch (_) {}
  renderSettings();
  renderBanner();
  toast(
    `<span class="bdg" style="--bc:var(--accent)">${bsvg("check")}</span><div><small>Backup</small><b>File backup diunduh</b><span>${Object.keys(S.entries).length} catatan. Simpan filenya di tempat aman.</span></div>`
  );
}

// Data dari file dicek satu per satu; yang bentuknya tidak sesuai dibuang supaya tidak merusak aplikasi.
const strList = a => (Array.isArray(a) ? a.filter(x => typeof x === "string") : []);
function cleanEntries(obj) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [k, e] of Object.entries(obj)) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(k) ||
      !e ||
      typeof e !== "object" ||
      ![1, 2, 3, 4, 5].includes(e.mood)
    )
      continue;
    const x = {
      mood: e.mood,
      tags: strList(e.tags),
      note: typeof e.note === "string" ? e.note : "",
      updatedAt: typeof e.updatedAt === "string" ? e.updatedAt : "",
    };
    if ([1, 2, 3, 4, 5].includes(e.energy)) x.energy = e.energy;
    if (typeof e.sleep === "number" && e.sleep >= 0 && e.sleep <= 24) x.sleep = e.sleep;
    if (strList(e.grat).length) x.grat = strList(e.grat).slice(0, 3);
    if (strList(e.habits).length) x.habits = strList(e.habits);
    if (strList(e.emo).length) x.emo = strList(e.emo).slice(0, EMO_MAX);
    if (typeof e.photo === "string" && e.photo.startsWith("data:image/")) x.photo = e.photo;
    if (Array.isArray(e.moments))
      x.moments = e.moments
        .filter(m => m && [1, 2, 3, 4, 5].includes(m.mood))
        .map(m => ({
          time: typeof m.time === "string" ? m.time : "",
          mood: m.mood,
          note: typeof m.note === "string" ? m.note : "",
        }));
    out[k] = x;
  }
  return out;
}
// Objek berkunci tanggal (niat, refleksi): kunci harus tanggal, isinya dibersihkan oleh fn.
function cleanDated(obj, fn) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    const x = /^\d{4}-\d{2}-\d{2}$/.test(k) && fn(v);
    if (x) out[k] = x;
  }
  return out;
}
async function readBackup(file) {
  const j = JSON.parse(await file.text());
  if (!j || j.app !== "jurnal-rasa") throw new Error("bukan backup");
  const caps = Array.isArray(j.capsules)
    ? j.capsules
        .filter(
          c =>
            c &&
            typeof c.id === "string" &&
            typeof c.text === "string" &&
            typeof c.openAt === "string" &&
            typeof c.created === "string"
        )
        .map(c => ({
          id: c.id,
          created: c.created,
          openAt: c.openAt,
          text: c.text,
          opened: !!c.opened,
          openedOn: typeof c.openedOn === "string" ? c.openedOn : "",
        }))
    : [];
  return {
    entries: cleanEntries(j.entries),
    tags: strList(j.tags),
    habits: strList(j.habits),
    caps,
    badges: strList(j.badges),
    intents: cleanDated(j.intents, v =>
      typeof v?.t === "string" && v.t
        ? { t: v.t.slice(0, 200), ...([0, 1, 2].includes(v.r) ? { r: v.r } : {}) }
        : null
    ),
    refs: cleanDated(j.reflections, v => {
      if (!v || typeof v !== "object") return null;
      const r = {};
      ["good", "hard", "next", "at"].forEach(
        f => typeof v[f] === "string" && v[f] && (r[f] = v[f])
      );
      return Object.keys(r).some(f => f !== "at") ? r : null;
    }),
    stk: cleanStk(j.stickers),
    pages: cleanPages(j.calpages),
    exportedAt: typeof j.exportedAt === "string" ? j.exportedAt.slice(0, 10) : "",
  };
}

function renderImport() {
  const box = $("#impBox"),
    b = S.imp;
  box.hidden = !b;
  if (!b) {
    box.innerHTML = "";
    return;
  }
  if (b.error) {
    box.innerHTML = `<p class="pmsg">${b.error}</p><div class="row"><button class="btn ghost sm" id="impCancel">Tutup</button></div>`;
    return;
  }
  const ks = Object.keys(b.entries).sort();
  box.innerHTML = `<div class="impsum"><b>${ks.length} catatan</b>${ks.length ? ` dari ${fmtDate(ks[0])} sampai ${fmtDate(ks[ks.length - 1])}` : ""}${b.caps.length ? `, ${b.caps.length} kapsul waktu` : ""}${Object.keys(b.refs).length ? `, ${Object.keys(b.refs).length} refleksi` : ""}.${b.exportedAt ? `<br><span class="muted small">Backup dibuat ${fmtDate(b.exportedAt)}.</span>` : ""}</div>
    <div class="ucol"><button class="btn primary sm" id="impMerge">Gabungkan dengan catatan sekarang</button>
    <button class="btn ghost sm" id="impReplace">${S.impArm ? "Yakin? Semua catatan sekarang akan diganti" : "Ganti semua catatan sekarang"}</button>
    <button class="btn text sm" id="impCancel">Batal</button></div>
    <p class="muted small">Gabungkan: catatan dari backup ditambahkan. Kalau tanggalnya sama, yang paling baru diubah yang dipakai.</p>`;
}

function applyImport(replace) {
  const b = S.imp,
    snap = {
      entries: S.entries,
      tags: S.tags,
      habits: S.habits,
      caps: S.caps,
      badges: S.badges,
      intents: S.intents,
      refs: S.refs,
      stk: S.stk,
      pages: S.pages,
    };
  if (replace) {
    S.entries = b.entries;
    S.tags = b.tags.length ? b.tags : [...TAGS];
    S.habits = b.habits;
    S.caps = b.caps;
    S.badges = b.badges;
    S.intents = b.intents;
    S.refs = b.refs;
    S.stk = b.stk;
    S.pages = b.pages;
  } else {
    const m = { ...S.entries };
    for (const [k, e] of Object.entries(b.entries))
      if (!m[k] || (e.updatedAt || "") > (m[k].updatedAt || "")) m[k] = e;
    S.entries = m;
    S.tags = [...new Set([...S.tags, ...b.tags])];
    S.habits = [...new Set([...S.habits, ...b.habits])];
    const ids = new Set(S.caps.map(c => c.id));
    S.caps = [...S.caps, ...b.caps.filter(c => !ids.has(c.id))];
    S.badges = [...new Set([...S.badges, ...b.badges])];
    S.intents = { ...b.intents, ...S.intents };
    const refs = { ...S.refs };
    for (const [w, r] of Object.entries(b.refs))
      if (!refs[w] || (r.at || "") > (refs[w].at || "")) refs[w] = r;
    S.refs = refs;
    const stkIds = new Set(S.stk.custom.map(s => s.id)),
      placed = { ...S.stk.placed };
    for (const [k, a] of Object.entries(b.stk.placed))
      placed[k] = [...new Set([...(placed[k] || []), ...a])].slice(0, STK_MAX);
    S.stk = {
      custom: [...S.stk.custom, ...b.stk.custom.filter(s => !stkIds.has(s.id))].slice(
        0,
        STK_CUSTOM_MAX
      ),
      placed,
    };
    S.pages = { def: S.pages.def, months: { ...b.pages.months, ...S.pages.months } };
  }
  if (
    !persist() ||
    !saveCaps() ||
    !saveObj(INT_KEY, S.intents) ||
    !saveObj(REF_KEY, S.refs) ||
    !saveStk() ||
    !savePages()
  ) {
    Object.assign(S, snap);
    persist();
    saveCaps();
    saveObj(INT_KEY, S.intents);
    saveObj(REF_KEY, S.refs);
    saveStk();
    savePages();
    S.imp = {
      error: "Gagal memulihkan: penyimpanan browser tidak cukup. Coba hapus beberapa foto dulu.",
    };
    renderImport();
    return;
  }
  saveTags();
  saveHabits();
  saveBadges();
  const n = Object.keys(b.entries).length;
  S.imp = null;
  S.impArm = false;
  clearDraft();
  loadDraft();
  renderAll();
  syncBadges(false);
  renderSettings();
  renderImport();
  toast(
    `<span class="bdg" style="--bc:var(--accent)">${bsvg("check")}</span><div><small>Backup dipulihkan</small><b>${n} catatan dari backup ${replace ? "menggantikan catatan lama" : "digabungkan"}</b></div>`
  );
}

// Pengingat backup menggantikan banner lama: muncul kalau sudah ada catatan tapi backup belum pernah atau sudah lebih dari 30 hari.
function renderBanner() {
  const b = $("#banner"),
    n = Object.keys(S.entries).length,
    last = lastBackup();
  let hide = "";
  try {
    hide = localStorage.getItem(NUDGE_KEY) || "";
  } catch (_) {}
  const old = !last || (fromKey(todayKey()) - fromKey(last)) / 864e5 > 30,
    snoozed = hide && (fromKey(todayKey()) - fromKey(hide)) / 864e5 < 7;
  b.hidden = !(n >= 3 && old && !snoozed);
  if (!b.hidden)
    b.innerHTML = `<span class="hi" style="--hc:var(--accent)">${bsvg("book")}</span><div><b>Catatanmu hanya tersimpan di browser ini.</b><span class="muted small">${last ? `Backup terakhir ${fmtDate(last)}.` : "Belum pernah dibackup."} Unduh supaya tidak hilang.</span></div><button class="btn primary sm" id="bkExport2">Unduh</button><button class="mx" id="bannerHide" aria-label="Ingatkan lagi minggu depan" title="Ingatkan lagi minggu depan">×</button>`;
}

/* ===== Kunci PIN ===== */
async function hashPin(pin, salt) {
  const data = new TextEncoder().encode(salt + ":" + pin);
  if (crypto.subtle) {
    const b = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  let h = 2166136261;
  for (const c of data) {
    h ^= c;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return "f" + h.toString(16);
}

async function savePin() {
  const v = id => ($("#" + id)?.value || "").trim(),
    msg = $("#pinMsg"),
    m = S.pinMode;
  if (m !== "set" && (await hashPin(v("pinOld"), S.set.pinSalt)) !== S.set.pinHash) {
    msg.textContent = "PIN sekarang salah.";
    return;
  }
  if (m === "remove") {
    Object.assign(S.set, { pinHash: "", pinSalt: "", pinLen: 0 });
    saveSet();
    S.pinMode = null;
    renderSettings();
    return;
  }
  const pin = v("pin1");
  if (!/^\d{4,6}$/.test(pin)) {
    msg.textContent = "PIN harus 4 sampai 6 angka.";
    return;
  }
  if (pin !== v("pin2")) {
    msg.textContent = "Kedua PIN tidak sama.";
    return;
  }
  const salt = [...crypto.getRandomValues(new Uint8Array(8))]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
  Object.assign(S.set, { pinSalt: salt, pinHash: await hashPin(pin, salt), pinLen: pin.length });
  saveSet();
  S.pinMode = null;
  renderSettings();
}

const isLocked = () => !$("#lock").hidden;
function lockApp() {
  if (!S.set.pinHash) return;
  S.pinIn = "";
  S.wipeArm = false;
  $("#lock").hidden = false;
  $("#forgotBox").hidden = true;
  $("#wipe").textContent = "Hapus semua catatan & PIN";
  document.querySelectorAll(".wrap,.tabbar").forEach(el => (el.inert = true));
  document.querySelectorAll("dialog[open]").forEach(d => d.close());
  renderLock();
}
function renderLock() {
  $("#pdots").innerHTML = Array.from(
    { length: S.set.pinLen },
    (_, i) => `<i class="${i < S.pinIn.length ? "on" : ""}"></i>`
  ).join("");
}
async function pinKey(k) {
  if (k === "del") S.pinIn = S.pinIn.slice(0, -1);
  else if (S.pinIn.length < S.set.pinLen) S.pinIn += k;
  renderLock();
  if (S.pinIn.length !== S.set.pinLen) return;
  if ((await hashPin(S.pinIn, S.set.pinSalt)) === S.set.pinHash) {
    $("#lock").hidden = true;
    document.querySelectorAll(".wrap,.tabbar").forEach(el => (el.inert = false));
    afterUnlock();
  } else {
    const d = $("#pdots");
    d.classList.remove("shake");
    void d.offsetWidth;
    d.classList.add("shake");
    S.pinIn = "";
    setTimeout(renderLock, 400);
  }
}

/* ===== Pengingat ===== */
let remTimer = 0;
function scheduleReminder() {
  clearTimeout(remTimer);
  if (!S.set.remind) return;
  const [h, m] = S.set.time.split(":").map(Number),
    now = new Date(),
    at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  if (at <= now) at.setDate(at.getDate() + 1);
  remTimer = setTimeout(
    () => {
      fireReminder(true);
      scheduleReminder();
    },
    Math.min(at - now, 2147483647)
  );
}
function fireReminder(system) {
  if (S.entries[todayKey()]) return;
  const body = "Belum mengisi jurnal hari ini. Bagaimana perasaanmu?";
  if (system)
    try {
      if ("Notification" in window && Notification.permission === "granted")
        new Notification("Jurnal Rasa", { body });
    } catch (_) {}
  toast(
    `<span class="bdg" style="--bc:var(--accent)">${bsvg("clock")}</span><div><small>Pengingat</small><b>${body}</b></div>`
  );
}
// Kalau jam pengingat sudah lewat dan hari ini belum diisi, ingatkan di dalam halaman saat dibuka.
function showDueReminder() {
  if (!S.set.remind || isLocked()) return;
  const [h, m] = S.set.time.split(":").map(Number),
    now = new Date();
  if (now.getHours() * 60 + now.getMinutes() >= h * 60 + m) fireReminder(false);
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "featToggle") {
    S.featOpen = !S.featOpen;
    renderFeats();
    return;
  }
  if (t.id === "instOpen") {
    S.instOpen = !S.instOpen;
    renderInstall();
    return;
  }
  if (t.id === "instBtn" && installEvt) {
    installEvt.prompt();
    installEvt.userChoice.finally(() => {
      installEvt = null;
      renderInstall();
    });
    return;
  }
  if (t.id === "theme") {
    applyTheme(THEMES[(THEMES.indexOf(S.theme) + 1) % THEMES.length]);
    return;
  }
  if (t.id === "setOpen") {
    openSettings();
    return;
  }
  if (t.id === "bkExport" || t.id === "bkExport2") {
    exportBackup();
    return;
  }
  if (t.id === "bkImport") {
    $("#bkFile").click();
    return;
  }
  if (t.id === "impMerge") {
    applyImport(false);
    return;
  }
  if (t.id === "impReplace") {
    if (!S.impArm) {
      S.impArm = true;
      renderImport();
      return;
    }
    applyImport(true);
    return;
  }
  if (t.id === "impCancel") {
    S.imp = null;
    S.impArm = false;
    renderImport();
    return;
  }
  if (t.id === "bannerHide") {
    try {
      localStorage.setItem(NUDGE_KEY, todayKey());
    } catch (_) {}
    renderBanner();
    return;
  }
  if (t.id === "pinSet") {
    S.pinMode = "set";
    renderSettings();
    return;
  }
  if (t.id === "pinChange") {
    S.pinMode = "change";
    renderSettings();
    return;
  }
  if (t.id === "pinRemove") {
    S.pinMode = "remove";
    renderSettings();
    return;
  }
  if (t.id === "pinCancel") {
    S.pinMode = null;
    renderSettings();
    return;
  }
  if (t.id === "pinSave") {
    savePin();
    return;
  }
  if (t.dataset.key) {
    pinKey(t.dataset.key);
    return;
  }
  if (t.id === "forgot") {
    $("#forgotBox").hidden = false;
    return;
  }
  if (t.id === "wipe") {
    if (!S.wipeArm) {
      S.wipeArm = true;
      t.textContent = "Yakin? Klik sekali lagi untuk menghapus semuanya";
      return;
    }
    Object.keys(localStorage)
      .filter(k => k.startsWith("jurnal-rasa:"))
      .forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch (_) {}
      });
    location.reload();
  }
});
document.addEventListener("keydown", e => {
  if (!isLocked()) return;
  if (/^\d$/.test(e.key)) pinKey(e.key);
  else if (e.key === "Backspace") pinKey("del");
});
$("#remOn").addEventListener("change", async e => {
  S.set.remind = e.target.checked;
  if (S.set.remind && "Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch (_) {}
  }
  saveSet();
  scheduleReminder();
  renderSettings();
});
$("#bkFile").addEventListener("change", async e => {
  const f = e.target.files[0];
  e.target.value = "";
  if (!f) return;
  S.impArm = false;
  try {
    S.imp = await readBackup(f);
  } catch (_) {
    S.imp = { error: "File ini bukan backup Jurnal Rasa, atau isinya rusak." };
  }
  renderImport();
});
$("#remTime").addEventListener("change", e => {
  if (e.target.value) {
    S.set.time = e.target.value;
    saveSet();
    scheduleReminder();
  }
});
document.addEventListener("change", e => {
  const k = e.target.dataset?.feat,
    sw = { calmOn: "calm", bigOn: "big" }[e.target.id];
  if (!k && !sw) return;
  S.set[k || sw] = e.target.checked;
  saveSet();
  if (k)
    $("#featSum").textContent =
      `${FEATS.filter(([f]) => S.set[f]).length} dari ${FEATS.length} aktif`;
  applyFeatures();
  renderAll();
});
$("#hideOn").addEventListener("change", e => {
  S.set.hide = e.target.checked;
  saveSet();
  document.body.classList.toggle("hide-notes", S.set.hide);
});
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) hiddenAt = Date.now();
  else if (S.set.pinHash && hiddenAt && Date.now() - hiddenAt > 60000) lockApp();
});
