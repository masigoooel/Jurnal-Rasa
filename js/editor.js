/* Editor: menulis catatan harian, isi cepat (energi, tidur, syukur, kebiasaan, foto), draf otomatis, dan kata penyemangat. */

const CHEER = [
  "Hari yang berat tidak membuatmu jadi orang yang lebih lemah.",
  "Kamu sudah melewati hari ini. Itu sudah cukup.",
  "Tidak apa-apa merasa seperti ini. Perasaan ini juga akan berlalu.",
  "Terima kasih sudah jujur pada dirimu sendiri hari ini.",
  "Pelan-pelan saja. Kamu tidak harus baik-baik saja setiap hari.",
  "Menuliskannya adalah langkah kecil yang berarti.",
  "Istirahat juga bagian dari berjuang.",
  "Kamu tetap berharga, bahkan di hari seperti ini.",
  "Besok adalah halaman baru.",
  "Semoga malam ini kamu bisa beristirahat dengan tenang.",
];

const DRAFT_KEY = "jurnal-rasa:draft";

// Momen (fitur lama yang sudah dibuang) tetap ikut disimpan supaya data lama tidak hilang.
function loadDraft() {
  const e = S.entries[S.sel] || {};
  S.draft = {
    mood: e.mood || 0,
    tags: [...(e.tags || [])],
    note: e.note || "",
    energy: e.energy || 0,
    sleep: typeof e.sleep === "number" ? e.sleep : null,
    grat: [0, 1, 2].map(i => (e.grat || [])[i] || ""),
    photo: typeof e.photo === "string" && e.photo.startsWith("data:image/") ? e.photo : "",
    moments: (e.moments || []).map(m => ({ ...m })),
    habits: [...(e.habits || [])],
    emo: [...(e.emo || [])],
    weather: isWeather(e.weather) ? e.weather : "",
    doodle: typeof e.doodle === "string" && e.doodle.startsWith("data:image/") ? e.doodle : "",
  };
  S.showAll = false;
  S.dirty = false;
  S.restored = false;
  const saved = readDraft();
  if (saved && saved.k === S.sel) {
    Object.assign(S.draft, saved.d);
    S.dirty = S.restored = true;
  }
  $("#note").value = S.draft.note;
  renderExtras();
  paintDoodle();
}

function buildEntry() {
  const d = S.draft,
    b = {
      mood: d.mood,
      tags: [...d.tags],
      note: $("#note").value.trim(),
      updatedAt: new Date().toISOString(),
    };
  if (d.energy) b.energy = d.energy;
  if (d.sleep !== null) b.sleep = d.sleep;
  const g = d.grat.map(x => x.trim()).filter(Boolean);
  if (g.length) b.grat = g;
  if (d.photo) b.photo = d.photo;
  if (d.moments.length) b.moments = d.moments.map(m => ({ ...m }));
  if (d.habits.length) b.habits = [...d.habits];
  if (d.emo.length) b.emo = [...d.emo];
  if (d.weather) b.weather = d.weather;
  if (d.doodle) b.doodle = d.doodle;
  return b;
}

/* ===== Draf otomatis ===== */
// Perubahan yang belum disimpan ditulis ke penyimpanan tiap kali berubah, jadi tidak hilang kalau tab tertutup.
function readDraft() {
  try {
    const s = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (!s || typeof s.k !== "string" || !s.d) return null;
    const d = s.d;
    return {
      k: s.k,
      d: {
        mood: [1, 2, 3, 4, 5].includes(d.mood) ? d.mood : 0,
        tags: Array.isArray(d.tags) ? d.tags.filter(x => typeof x === "string") : [],
        note: typeof d.note === "string" ? d.note : "",
        energy: [1, 2, 3, 4, 5].includes(d.energy) ? d.energy : 0,
        sleep: typeof d.sleep === "number" ? d.sleep : null,
        grat: [0, 1, 2].map(i => (typeof d.grat?.[i] === "string" ? d.grat[i] : "")),
        photo: typeof d.photo === "string" && d.photo.startsWith("data:image/") ? d.photo : "",
        moments: Array.isArray(d.moments) ? d.moments : [],
        habits: Array.isArray(d.habits) ? d.habits.filter(x => typeof x === "string") : [],
        emo: Array.isArray(d.emo) ? d.emo.filter(x => typeof x === "string").slice(0, EMO_MAX) : [],
        weather: isWeather(d.weather) ? d.weather : "",
        doodle: typeof d.doodle === "string" && d.doodle.startsWith("data:image/") ? d.doodle : "",
      },
    };
  } catch (_) {
    return null;
  }
}
let draftT = 0;
function queueDraft() {
  clearTimeout(draftT);
  draftT = setTimeout(() => {
    try {
      if (S.dirty)
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ k: S.sel, d: { ...S.draft, note: $("#note").value } })
        );
      else if (readDraft()?.k === S.sel) localStorage.removeItem(DRAFT_KEY);
    } catch (_) {}
  }, 400);
}
function clearDraft() {
  clearTimeout(draftT);
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (_) {}
  S.restored = false;
}

function renderStatus() {
  const st = $("#status");
  st.className = "status local";
  st.innerHTML = `<i></i>Tersimpan di browser ini`;
}

function renderEditor() {
  const isToday = S.sel === todayKey();
  {
    const d = fromKey(S.sel);
    $("#edDay").textContent =
      (isToday ? "Hari ini · " : "") + d.toLocaleDateString("id-ID", { weekday: "long" });
    $("#edTitle").textContent = d.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
  }
  $("#toToday").hidden = isToday;
  const mo = $("#moods");
  mo.classList.toggle("picked", !!S.draft.mood);
  mo.innerHTML = [1, 2, 3, 4, 5]
    .map(
      l =>
        `<button class="mood${S.pop === l ? " pop" : ""}" style="--c:var(--m${l})" data-mood="${l}" aria-pressed="${S.draft.mood === l}">${face(l)}${MOODS[l].n}</button>`
    )
    .join("");
  S.pop = 0;
  const tint = S.draft.mood ? `var(--m${S.draft.mood})` : "";
  document.body.style.setProperty("--tint", tint || "var(--m4)");
  $("#tags").style.setProperty("--tc", tint || "var(--fg)");
  $("#tags").style.setProperty("--tcf", tint ? "var(--face)" : "var(--bg)");
  applyHeavy();
  renderWeather();
  renderEmos();
  renderTags();
  renderPrompt();
  renderFlash();
  renderEnergy();
  renderHabits();
  renderQuick();
  renderMissed();
  renderCare();
  renderWeekly();
  renderIntent();
  renderEstk();
  // Saran napas kecil tidak perlu kalau kartu dukungan (yang juga mengajak napas) sudah tampil.
  $("#calm").hidden =
    !(S.draft.mood && S.draft.mood <= 2 && S.calmHide !== S.sel) || !$("#care").hidden;
  const exists = !!S.entries[S.sel];
  let a = `<button class="btn primary" id="save" ${!S.draft.mood || S.saving ? "disabled" : ""}>${S.saving ? "Menyimpan…" : exists ? "Simpan perubahan" : "Simpan catatan"}</button>`;
  if (exists) a += `<button class="btn text" id="del">Hapus</button>`;
  if (S.justSaved)
    a += `<span class="saved" style="width:100%"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>Tersimpan.</span>`;
  else if (S.restored)
    a += `<span class="muted" style="font-size:13px;width:100%">Draf yang belum disimpan dipulihkan. <button class="link" id="draftDrop">Buang draf</button></span>`;
  else if (!S.draft.mood)
    a += `<span class="muted" style="font-size:13px;width:100%">Pilih salah satu wajah dulu untuk menyimpan.</span>`;
  else if (S.dirty && exists)
    a += `<span class="muted" style="font-size:13px;width:100%">Ada perubahan yang belum disimpan.</span>`;
  $("#actions").innerHTML = a;
  // Di HP tombol simpan menempel di bawah layar selama ada perubahan yang belum disimpan.
  $("#actions").classList.toggle("stick", S.dirty && !!S.draft.mood && !S.saving);
  fitNote();
  queueDraft();
}

// Kotak tulisan ikut memanjang mengikuti isinya, jadi tidak perlu menggulir di dalam kotak kecil.
function fitNote() {
  const n = $("#note");
  n.style.height = "auto";
  n.style.height = `${n.scrollHeight + 3}px`;
}
// Getar halus di HP (Android) saat memilih rasa dan menyimpan. Ikut mati kalau animasi dikurangi.
const buzz = () => !reducedMotion() && navigator.vibrate?.(8);

// Kalau kemarin kosong, tawarkan untuk mengisinya (bisa ditutup).
function renderMissed() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yk = keyOf(d),
    el = $("#missed");
  const show =
    S.sel === todayKey() &&
    !S.entries[yk] &&
    Object.keys(S.entries).length > 0 &&
    S.missHide !== yk;
  el.hidden = !show;
  if (show)
    el.innerHTML = `<span>Kemarin belum diisi. Masih ingat rasanya?</span><button class="link" data-day="${yk}">Isi kemarin</button><button class="mx" id="missHide" aria-label="Tutup">×</button>`;
}

/* ===== Kata perasaan ===== */
// Muncul setelah wajah dipilih; kata yang sudah dipilih tetap tampil walau bukan dari daftar rasa ini.
function renderEmos() {
  const m = S.draft.mood,
    el = $("#emos");
  el.hidden = !m;
  if (!m) return;
  const picked = S.draft.emo,
    list = [...EMOS[m], ...picked.filter(x => !EMOS[m].includes(x))],
    full = picked.length >= EMO_MAX;
  el.style.setProperty("--tc", `var(--m${m})`);
  el.style.setProperty("--tcf", "var(--face)");
  el.innerHTML =
    `<p class="label">Lebih tepatnya? <span class="xhint">${full ? `maksimal ${EMO_MAX}` : `pilih sampai ${EMO_MAX}`}</span></p><div class="emolist">` +
    list
      .map(x => {
        const on = picked.includes(x);
        return `<button class="tag emo" data-emo="${esc(x)}" aria-pressed="${on}"${!on && full ? " disabled" : ""}>${esc(x)}</button>`;
      })
      .join("") +
    `</div>`;
}

/* ===== Label ===== */
function renderTags() {
  const list = [...S.tags, ...S.draft.tags.filter(t => !S.tags.includes(t))];
  let h = list
    .map(
      t =>
        `<button class="tag${S.tagEdit ? " editing" : ""}" data-tag="${esc(t)}" ${S.tagEdit ? `aria-label="Hapus label ${esc(t)}"` : `aria-pressed="${S.draft.tags.includes(t)}"`}>${esc(t)}${S.tagEdit ? `<span class="x" aria-hidden="true">×</span>` : ""}</button>`
    )
    .join("");
  if (S.tagAdding)
    h += `<span class="tagadd"><input id="tagInput" maxlength="24" placeholder="Nama label" aria-label="Nama label baru" value="${esc(S.tagNew)}"><button class="tag" id="tagSave">Tambah</button><button class="tag ghost" id="tagCancel">Batal</button></span>`;
  else if (!S.tagEdit) h += `<button class="tag new" id="tagAdd">+ Label</button>`;
  $("#tags").innerHTML = h;
  $("#tagEdit").textContent = S.tagEdit ? "Selesai" : "Atur";
}

// Tambah nama baru ke daftar (label atau kebiasaan) tanpa duplikat, lalu langsung pilih untuk hari ini.
function addToList(list, picked, raw, save) {
  const name = raw.replace(/\s+/g, " ").trim();
  if (!name) return;
  const t = list.find(x => x.toLowerCase() === name.toLowerCase()) || name;
  if (!list.includes(t)) {
    list.push(t);
    save();
  }
  if (!picked.includes(t)) {
    picked.push(t);
    S.dirty = true;
  }
}
function addTag() {
  addToList(S.tags, S.draft.tags, S.tagNew, saveTags);
  S.tagAdding = false;
  S.tagNew = "";
  renderEditor();
  renderHistControls();
}
function addHabit() {
  addToList(S.habits, S.draft.habits, S.habNew, saveHabits);
  S.habAdding = false;
  S.habNew = "";
  renderEditor();
}

// Pertanyaan pemantik: sesuai rasa (bawaan) atau dari tema yang dipilih.
function promptPool() {
  const th = PROMPT_THEMES[S.ptheme];
  if (th?.q) return th.q;
  const m = S.draft.mood;
  return m && m <= 2 ? PROMPTS.low : m >= 4 ? PROMPTS.high : PROMPTS.mid;
}
function currentPrompt() {
  const pool = promptPool();
  return pool[S.promptIdx % pool.length];
}
function renderPrompt() {
  $("#promptUse").textContent = currentPrompt();
  $("#pTheme").value = S.ptheme;
  const pt = $("#pThemeBtn");
  pt.title = `Tema pertanyaan: ${PROMPT_THEMES[S.ptheme]?.n || "Sesuai rasa"}`;
  pt.classList.toggle("on", S.ptheme !== "auto");
  if ($("#fPrompt")) $("#fPrompt").textContent = currentPrompt();
}

function renderFlash() {
  const d = fromKey(S.sel),
    y = d.getFullYear(),
    m = d.getMonth(),
    dd = d.getDate();
  const found = [
    ["Setahun lalu", sameDay(y - 1, m, dd)],
    ["Sebulan lalu", sameDay(y, m - 1, dd)],
    ["Seminggu lalu", keyOf(new Date(y, m, dd - 7))],
  ].filter(([, k]) => S.entries[k]);
  const el = $("#flash");
  el.hidden = !found.length;
  el.innerHTML = found.length
    ? `<p class="label">Kilas balik</p>` +
      found
        .map(([l, k]) => {
          const e = S.entries[k];
          return `<button class="entry${l === "Setahun lalu" ? " yearago" : ""}" data-day="${k}">${face(e.mood, 30)}<div style="min-width:0"><div class="d">${l} <span class="t">· ${fmtShort(k)} · ${MOODS[e.mood].n}</span></div>${e.note ? `<div class="note">${esc(e.note)}</div>` : ""}</div></button>`;
        })
        .join("")
    : "";
}

/* ===== Isi cepat ===== */
// Hanya satu panel terbuka; tiap tombol menampilkan ringkasan isinya.
function renderQuick() {
  const d = S.draft,
    v = d.energy,
    sl = d.sleep,
    g = d.grat.filter(x => x.trim()).length;
  $("#sBody").textContent = [
    v ? ENERGY[v] : "",
    sl !== null ? `${num(sl, sl % 1 ? 1 : 0)} jam` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  $("#sGrat").textContent = g ? `${g}/3` : "";
  $("#sTags").textContent = d.tags.length ? `${d.tags.length}` : "";
  $("#sHab").textContent = d.habits.length ? `${d.habits.length}` : "";
  $("#sPhoto").textContent = d.photo ? "✓" : "";
  $("#sWeather").textContent = weatherName(d.weather);
  $("#sDoodle").textContent = d.doodle ? "✓" : "";
  if (S.xopen === "doodle") renderDoodle();
  document
    .querySelectorAll(".xchip")
    .forEach(c => c.setAttribute("aria-expanded", c.dataset.x === S.xopen));
  document.querySelectorAll(".xpanel").forEach(p => (p.hidden = p.dataset.xp !== S.xopen));
}

function renderEnergy() {
  const v = S.draft.energy,
    sl = S.draft.sleep;
  $("#energy").innerHTML = [1, 2, 3, 4, 5]
    .map(
      l =>
        `<button class="en${l <= v ? " on" : ""}" data-energy="${l}" aria-pressed="${v === l}" aria-label="Energi ${ENERGY[l]}" title="${ENERGY[l]}"></button>`
    )
    .join("");
  $("#enVal").textContent = v ? ENERGY[v] : "belum diisi";
  $("#energy").style.setProperty("--ec", `var(--m${v || 3})`);
  $("#sleepVal").textContent = sl === null ? "belum diisi" : `${num(sl, sl % 1 ? 1 : 0)} jam`;
  $("#sleep").classList.toggle("unset", sl === null);
}

function renderExtras() {
  document.querySelectorAll("[data-g]").forEach(i => (i.value = S.draft.grat[+i.dataset.g]));
  $("#sleep").value = S.draft.sleep === null ? 7 : S.draft.sleep;
  renderPhoto();
}

function renderHabits() {
  const list = [...S.habits, ...S.draft.habits.filter(h => !S.habits.includes(h))];
  let h = list
    .map(
      x =>
        `<button class="hab${S.habEdit ? " editing" : ""}" data-hab="${esc(x)}" ${S.habEdit ? `aria-label="Hapus kebiasaan ${esc(x)}"` : `aria-pressed="${S.draft.habits.includes(x)}"`}><span class="hcheck" aria-hidden="true"></span>${esc(x)}${S.habEdit ? `<span class="x" aria-hidden="true">×</span>` : ""}</button>`
    )
    .join("");
  if (S.habAdding)
    h += `<span class="tagadd"><input id="habInput" maxlength="30" placeholder="Nama kebiasaan" aria-label="Nama kebiasaan baru" value="${esc(S.habNew)}"><button class="tag" id="habSave">Tambah</button><button class="tag ghost" id="habCancel">Batal</button></span>`;
  else if (!S.habEdit) h += `<button class="tag new" id="habAdd">+ Kebiasaan</button>`;
  if (list.length)
    h += `<button class="tag ghost" id="habEditBtn">${S.habEdit ? "Selesai" : "Atur"}</button>`;
  $("#habits").innerHTML = h;
}

function renderPhoto() {
  const p = S.draft.photo;
  $("#photo").innerHTML = p
    ? `<img src="${esc(p)}" alt="Foto hari ini"><div class="row"><button class="btn ghost sm" id="photoPick">Ganti</button><button class="btn text sm" id="photoDel">Hapus</button></div>`
    : `<button class="photo-add" id="photoPick"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>Tambah foto<small>Foto otomatis dikecilkan supaya hemat tempat</small></button>`;
}

// Kecilkan foto ke sisi terpanjang 560px (JPEG) supaya muat di penyimpanan browser.
function readPhoto(file) {
  return new Promise((res, rej) => {
    const img = new Image(),
      url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 560 / Math.max(img.width, img.height)),
        c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res(c.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rej(new Error("bukan gambar"));
    };
    img.src = url;
  });
}

/* ===== Kata penyemangat ===== */
// Setelah menyimpan hari berat: satu kalimat lembut. Kalau berat terus seminggu terakhir, tambahkan ajakan bercerita (sekali per sesi).
function encourage() {
  const t = CHEER[Math.floor(Math.random() * CHEER.length)];
  let extra = "";
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return S.entries[keyOf(d)];
  }).filter(Boolean);
  if (!S.careShown && week.filter(e => e.mood <= 2).length >= 5) {
    S.careShown = true;
    extra = `<span>Beberapa hari ini terasa berat. Bercerita ke orang yang kamu percaya, atau ke tenaga profesional, bisa sangat membantu. <button class="link" data-help>Cari dukungan</button></span>`;
  }
  toast(
    `<span class="bdg" style="--bc:var(--m2)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg></span><div><small>Untukmu</small><b>${t}</b>${extra}</div>`,
    extra ? 11000 : 7000
  );
}

/* ===== Pindah tanggal, simpan, hapus ===== */
// Kalau ada perubahan yang belum disimpan, tanya dulu sebelum pindah ke tanggal lain.
function select(k) {
  if (k > todayKey()) return;
  if (S.dirty && k !== S.sel) {
    S.pendingSel = k;
    $("#unsDate").textContent = fmtLong(S.sel);
    $("#unsSave").disabled = !S.draft.mood;
    $("#dlgUnsaved").showModal();
    return;
  }
  goTo(k);
}
function goTo(k) {
  S.sel = k;
  S.justSaved = false;
  S.tagEdit = S.tagAdding = S.habEdit = S.habAdding = false;
  const d = fromKey(k);
  S.vm = S.vy = d.getFullYear();
  S.vmo = d.getMonth();
  loadDraft();
  renderAll();
  if (isMobile() || document.body.dataset.tab !== "tulis") setTab("tulis");
  else if ($(".editor").getBoundingClientRect().top < 0)
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveEntry() {
  const k = S.sel,
    body = buildEntry(),
    prev = S.entries[k];
  S.saving = true;
  renderEditor();
  S.entries[k] = body;
  if (!persist()) {
    if (prev) S.entries[k] = prev;
    else delete S.entries[k];
    S.saving = false;
    renderEditor();
    $("#actions").insertAdjacentHTML(
      "beforeend",
      `<span style="color:var(--danger);font-size:13px;width:100%">Gagal menyimpan. Penyimpanan browser mungkin penuh (foto memakan banyak tempat) atau diblokir (mode private). Cek kapasitas di Pengaturan.</span>`
    );
    return false;
  }
  clearDraft();
  S.dirty = false;
  S.justSaved = true;
  S.saving = false;
  buzz();
  kertas("simpan");
  renderAll();
  if (body.mood >= 3) burst($("#save"), body.mood);
  else encourage();
  syncBadges(true);
  return true;
}

// Hapus langsung, tapi bisa diurungkan beberapa detik lewat tombol di notifikasi.
function deleteEntry() {
  const k = S.sel,
    prev = S.entries[k];
  if (!prev) return;
  delete S.entries[k];
  if (!persist()) {
    S.entries[k] = prev;
    $("#actions").insertAdjacentHTML(
      "beforeend",
      `<span style="color:var(--danger);font-size:13px;width:100%">Gagal menghapus. Coba muat ulang halaman.</span>`
    );
    return;
  }
  S.undo = { k, e: prev };
  clearDraft();
  loadDraft();
  renderAll();
  toast(
    `<span class="bdg" style="--bc:var(--m3)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></span><div><small>Dihapus</small><b>Catatan ${fmtShort(k)} dihapus</b><span><button class="link" id="undoDel">Urungkan</button></span></div>`,
    7000
  );
}
function undoDelete() {
  const u = S.undo;
  if (!u || S.entries[u.k]) return;
  S.entries[u.k] = u.e;
  S.undo = null;
  if (!persist()) {
    delete S.entries[u.k];
    return;
  }
  document.querySelectorAll(".toast").forEach(t => {
    if (t.querySelector("#undoDel")) t.remove();
  });
  S.dirty = false;
  goTo(u.k);
  toast(
    `<span class="bdg" style="--bc:var(--accent)">${bsvg("check")}</span><div><small>Dipulihkan</small><b>Catatan ${fmtShort(u.k)} kembali</b></div>`,
    3500
  );
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  const d = S.draft,
    touch = () => {
      S.dirty = true;
      S.justSaved = false;
    };
  if (t.dataset.mood) {
    d.mood = +t.dataset.mood;
    d.emo = d.emo.filter(x => EMOS[d.mood].includes(x));
    S.pop = d.mood;
    touch();
    buzz();
    renderEditor();
    return;
  }
  if (t.dataset.emo) {
    const x = t.dataset.emo;
    if (d.emo.includes(x)) d.emo.splice(d.emo.indexOf(x), 1);
    else if (d.emo.length < EMO_MAX) d.emo.push(x);
    touch();
    renderEditor();
    return;
  }
  if (t.dataset.tag && S.tagEdit) {
    const g = t.dataset.tag;
    S.tags = S.tags.filter(x => x !== g);
    saveTags();
    if (d.tags.includes(g)) {
      d.tags.splice(d.tags.indexOf(g), 1);
      S.dirty = true;
    }
    renderEditor();
    renderHistControls();
    return;
  }
  if (t.dataset.tag) {
    const g = t.dataset.tag;
    d.tags.includes(g) ? d.tags.splice(d.tags.indexOf(g), 1) : d.tags.push(g);
    touch();
    renderEditor();
    return;
  }
  if (t.id === "tagAdd") {
    S.tagAdding = true;
    S.tagNew = "";
    renderEditor();
    $("#tagInput").focus();
    return;
  }
  if (t.id === "tagSave") {
    addTag();
    return;
  }
  if (t.id === "tagCancel") {
    S.tagAdding = false;
    S.tagNew = "";
    renderEditor();
    return;
  }
  if (t.id === "tagEdit") {
    S.tagEdit = !S.tagEdit;
    S.tagAdding = false;
    renderEditor();
    return;
  }
  if (t.id === "promptNext") {
    S.promptIdx++;
    renderPrompt();
    return;
  }
  if (t.id === "promptUse") {
    const ta = $("#note"),
      q = t.textContent,
      v = ta.value.trimEnd();
    ta.value = (v ? v + "\n\n" : "") + q + "\n";
    d.note = ta.value;
    touch();
    renderEditor();
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    return;
  }
  if (t.dataset.x) {
    S.xopen = S.xopen === t.dataset.x ? "" : t.dataset.x;
    renderQuick();
    return;
  }
  if (t.dataset.energy) {
    const l = +t.dataset.energy;
    d.energy = d.energy === l ? 0 : l;
    touch();
    renderEditor();
    return;
  }
  if (t.id === "sleepClear") {
    d.sleep = null;
    S.dirty = true;
    renderExtras();
    renderEditor();
    return;
  }
  if (t.dataset.hab && S.habEdit) {
    const g = t.dataset.hab;
    S.habits = S.habits.filter(x => x !== g);
    saveHabits();
    if (d.habits.includes(g)) {
      d.habits.splice(d.habits.indexOf(g), 1);
      S.dirty = true;
    }
    renderEditor();
    return;
  }
  if (t.dataset.hab) {
    const g = t.dataset.hab;
    d.habits.includes(g) ? d.habits.splice(d.habits.indexOf(g), 1) : d.habits.push(g);
    touch();
    renderEditor();
    return;
  }
  if (t.id === "habAdd") {
    S.habAdding = true;
    S.habNew = "";
    renderEditor();
    $("#habInput").focus();
    return;
  }
  if (t.id === "habSave") {
    addHabit();
    return;
  }
  if (t.id === "habCancel") {
    S.habAdding = false;
    S.habNew = "";
    renderEditor();
    return;
  }
  if (t.id === "habEditBtn") {
    S.habEdit = !S.habEdit;
    S.habAdding = false;
    renderEditor();
    return;
  }
  if (t.id === "photoPick") {
    $("#photoIn").click();
    return;
  }
  if (t.id === "photoDel") {
    d.photo = "";
    touch();
    renderPhoto();
    renderEditor();
    return;
  }
  if (t.id === "calmHide") {
    S.calmHide = S.sel;
    renderEditor();
    return;
  }
  if (t.id === "missHide") {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    S.missHide = keyOf(y);
    renderMissed();
    return;
  }
  if (t.dataset.day) {
    // Di desktop, catatan yang diklik di tab Catatan cukup dibuka di halaman baca sebelahnya.
    if (t.closest("#hist")) setLastRead(t.dataset.day);
    if (!isMobile() && document.body.dataset.tab === "catatan" && t.closest("#hist")) {
      S.readK = t.dataset.day;
      renderRead();
      return;
    }
    select(t.dataset.day);
    return;
  }
  if (t.id === "toToday") {
    select(todayKey());
    return;
  }
  if (t.id === "save") {
    saveEntry();
    return;
  }
  if (t.id === "del") {
    deleteEntry();
    return;
  }
  if (t.id === "undoDel") {
    undoDelete();
    return;
  }
  if (t.id === "draftDrop") {
    clearDraft();
    loadDraft();
    renderEditor();
    return;
  }
  if (t.id === "unsSave") {
    $("#dlgUnsaved").close();
    if (saveEntry()) goTo(S.pendingSel);
    return;
  }
  if (t.id === "unsDiscard") {
    $("#dlgUnsaved").close();
    clearDraft();
    S.dirty = false;
    goTo(S.pendingSel);
    return;
  }
  if (t.id === "unsCancel") {
    $("#dlgUnsaved").close();
    return;
  }
});

document.addEventListener("input", e => {
  const el = e.target;
  if (el.id === "tagInput") S.tagNew = el.value;
  if (el.id === "habInput") S.habNew = el.value;
  if (el.dataset.g !== undefined) {
    S.draft.grat[+el.dataset.g] = el.value;
    const was = S.dirty;
    S.dirty = true;
    if (!was || S.justSaved) {
      S.justSaved = false;
      renderEditor();
    } else {
      renderQuick();
      queueDraft();
    }
  }
  if (el.id === "sleep") {
    S.draft.sleep = +el.value;
    S.dirty = true;
    S.justSaved = false;
    renderEditor();
  }
});

document.addEventListener("keydown", e => {
  const id = e.target.id;
  if (id === "tagInput") {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Escape") {
      S.tagAdding = false;
      S.tagNew = "";
      renderEditor();
    }
  }
  if (id === "habInput") {
    if (e.key === "Enter") {
      e.preventDefault();
      addHabit();
    }
    if (e.key === "Escape") {
      S.habAdding = false;
      S.habNew = "";
      renderEditor();
    }
  }
});

$("#note").addEventListener("input", e => {
  fitNote();
  S.draft.note = e.target.value;
  const was = S.dirty;
  S.dirty = true;
  if (S.justSaved || !was) {
    S.justSaved = false;
    renderEditor();
  } else queueDraft();
});

$("#photoIn").addEventListener("change", async e => {
  const f = e.target.files[0];
  e.target.value = "";
  if (!f) return;
  try {
    S.draft.photo = await readPhoto(f);
    S.dirty = true;
    S.justSaved = false;
    renderPhoto();
    renderEditor();
  } catch (_) {
    $("#photo").insertAdjacentHTML(
      "beforeend",
      `<p class="pmsg">File itu tidak bisa dibaca sebagai gambar.</p>`
    );
  }
});

// Peringatan bawaan browser kalau halaman ditutup saat masih ada perubahan (drafnya tetap tersimpan).
addEventListener("beforeunload", e => {
  if (S.dirty) {
    e.preventDefault();
    e.returnValue = "";
  }
});
