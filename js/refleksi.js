/* Refleksi: niat harian (pagi pasang niat, malam cek tercapai) dan refleksi mingguan. */

const INT_KEY = "jurnal-rasa:intents",
  REF_KEY = "jurnal-rasa:reflections",
  REFHIDE_KEY = "jurnal-rasa:refHide";
const INT_RES = { 2: "Tercapai", 1: "Sebagian", 0: "Belum" };
const REF_Q = [
  ["good", "Apa yang berjalan baik minggu ini?", "Sekecil apa pun boleh"],
  ["hard", "Apa yang terasa berat?", "Tidak apa-apa menuliskannya"],
  ["next", "Satu hal yang mau kamu coba minggu depan?", "Misalnya: tidur sebelum jam 11"],
];
S.intents = loadObj(INT_KEY);
S.refs = loadObj(REF_KEY);
S.refLimit = 3;

const addDays = (k, n) => {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return keyOf(d);
};
// Minggu dimulai hari Senin; kuncinya tanggal Senin itu.
const weekOf = k => addDays(k, -((fromKey(k).getDay() + 6) % 7));
const weekRange = w => {
  const a = fromKey(w),
    b = fromKey(addDays(w, 6)),
    o = { day: "numeric", month: "short" };
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()}–${b.toLocaleDateString("id-ID", o)}`
    : `${a.toLocaleDateString("id-ID", o)} – ${b.toLocaleDateString("id-ID", o)}`;
};

/* ===== Niat harian ===== */
// Sebelum jam 18: pasang niat hari ini. Setelah itu: pasang niat untuk besok. Jam 17 ke atas ditanya "tercapai?".
// Selama belum diisi, niat hanya tampil sebagai satu baris ajakan; formnya baru terbuka saat diketuk.
function renderIntent() {
  const el = $("#intent"),
    k = S.sel,
    today = todayKey(),
    isToday = k === today,
    hour = new Date().getHours(),
    it = S.intents[k],
    editing = S.intEdit === k;
  let h = "",
    slim = false;
  if (it && !editing) {
    const ask = it.r === undefined && (!isToday || hour >= 17);
    h = `<div class="ihead"><span class="label">${isToday ? "Niat hari ini" : "Niat hari itu"}</span>${
      it.r === undefined && !ask
        ? `<button class="link small" data-int-edit="${k}">Ubah</button>`
        : ""
    }</div><p class="itext">${esc(it.t)}</p>`;
    if (ask)
      h += `<div class="ires"><span class="muted small">Tercapai?</span>${[2, 1, 0]
        .map(r => `<button class="tag" data-ires="${r}">${INT_RES[r]}</button>`)
        .join("")}</div>`;
    else if (it.r !== undefined)
      h += `<div class="ires"><span class="ichip r${it.r}">${INT_RES[it.r]}</span><button class="link small" id="intReset">ubah</button></div>`;
  } else if (isToday && (hour < 18 || editing)) {
    if (editing) h = intentForm(k, "Niat hari ini", "Misalnya: lebih sabar dengan diri sendiri");
    else (h = intentSlim(k, "Pasang niat hari ini")), (slim = true);
  }
  if (isToday && hour >= 18 && !editing) {
    const tk = addDays(today, 1),
      tt = S.intents[tk];
    if (S.intEdit === tk)
      h += intentForm(tk, "Niat untuk besok", "Apa yang ingin kamu jaga besok?", !!h);
    else if (!tt) {
      slim = !h;
      h += intentSlim(tk, "Pasang niat untuk besok", !!h);
    } else
      h += `<div class="ihead${h ? " sep" : ""}"><span class="label">Niat untuk besok</span><button class="link small" data-int-edit="${tk}">Ubah</button></div><p class="itext">${esc(tt.t)}</p>`;
  }
  const plan = isToday && S.refs[addDays(weekOf(today), -7)]?.next;
  if (plan) {
    slim = false;
    h += `<p class="iplan${h ? " sep" : ""}"><span class="label">Rencana minggu ini</span>${esc(plan)}</p>`;
  }
  el.hidden = !h;
  el.classList.toggle("slim", slim);
  el.innerHTML = h;
}
function intentSlim(k, label, sep) {
  return `<button class="islim${sep ? " sep" : ""}" data-int-edit="${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>${label}<span>opsional</span></button>`;
}
function intentForm(k, label, ph, sep) {
  const v = S.intents[k]?.t || "";
  return `<div class="ihead${sep ? " sep" : ""}"><label class="label" for="intIn">${label}</label><button class="link small" id="intCancel">Batal</button></div>
    <div class="iform"><input id="intIn" data-k="${k}" maxlength="80" placeholder="${ph}" value="${esc(v)}"><button class="btn primary sm" id="intSave">Pasang</button></div>`;
}
function saveIntent() {
  const inp = $("#intIn"),
    t = inp.value.replace(/\s+/g, " ").trim(),
    k = inp.dataset.k;
  if (!t) return inp.focus();
  S.intents[k] = { t };
  saveObj(INT_KEY, S.intents);
  S.intEdit = false;
  renderIntent();
}

// Ringkasan niat untuk Wawasan: berapa yang tercapai bulan ini.
function intentStat() {
  const cur = todayKey().slice(0, 7),
    xs = Object.entries(S.intents).filter(([k, v]) => k.startsWith(cur) && v.r !== undefined),
    n = r => xs.filter(([, v]) => v.r === r).length;
  if (!xs.length) return "";
  return `<p class="label">Niat bulan ini</p><p class="istat"><b class="tnum">${n(2)}</b> dari ${xs.length} niat tercapai${n(1) ? `, ${n(1)} sebagian` : ""}.</p>`;
}

/* ===== Refleksi mingguan ===== */
// Kartu muncul Sabtu–Minggu untuk minggu ini, dan Senin untuk minggu lalu, kalau minggu itu ada catatannya.
function refTarget() {
  const today = todayKey(),
    dow = fromKey(today).getDay();
  return dow === 1 ? addDays(weekOf(today), -7) : weekOf(today);
}
function renderWeekly() {
  const el = $("#weekly"),
    today = todayKey(),
    dow = fromKey(today).getDay(),
    w = refTarget();
  let hide = "";
  try {
    hide = localStorage.getItem(REFHIDE_KEY) || "";
  } catch (_) {}
  const days = Array.from({ length: 7 }, (_, i) => addDays(w, i)),
    n = days.filter(k => S.entries[k]).length;
  el.hidden = !(S.sel === today && [0, 1, 6].includes(dow) && !S.refs[w] && hide !== w && n >= 2);
  if (el.hidden) return;
  el.innerHTML = `<div class="wkdots">${days.map(k => `<i style="${S.entries[k] ? `background:var(--m${S.entries[k].mood})` : ""}"></i>`).join("")}</div>
    <div><b>Refleksi ${w === weekOf(today) ? "minggu ini" : "minggu lalu"}</b><span>${weekRange(w)} · 3 pertanyaan</span></div>
    <button class="btn primary sm" data-ref="${w}">Mulai</button><button class="mx" id="refHide" aria-label="Lewati minggu ini">×</button>`;
}

function openRef(w) {
  S.refWeek = w;
  const r = S.refs[w] || {},
    days = Array.from({ length: 7 }, (_, i) => addDays(w, i)),
    es = days.map(k => S.entries[k]).filter(Boolean),
    tags = topTags(es),
    emo = {};
  es.forEach(e => (e.emo || []).forEach(x => (emo[x] = (emo[x] || 0) + 1)));
  const topEmo = Object.entries(emo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([x]) => x.toLowerCase());
  const facts = [
    `${es.length} hari tercatat`,
    es.length ? `rata-rata ${num(avgOf(es.map(e => e.mood)))}` : "",
    topEmo.length ? `sering merasa ${topEmo.join(", ")}` : "",
    tags.length ? `banyak soal ${tags.map(([t]) => t.toLowerCase()).join(", ")}` : "",
  ].filter(Boolean);
  $("#dlgRef").innerHTML =
    `<form method="dialog" class="dhead"><h2><span class="hi" style="--hc:var(--m3)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14M4 19h16M8 8h8M8 12h5"/></svg></span>Refleksi ${weekRange(w)}</h2>
      <button class="iconbtn sm" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></form>
    <div class="rweek">${days
      .map(k => {
        const e = S.entries[k];
        return `<div>${e ? face(e.mood, 30) : `<span class="rnone"></span>`}<small>${DAYS[(fromKey(k).getDay() + 6) % 7].slice(0, 3)}</small></div>`;
      })
      .join("")}</div>
    <p class="muted small">${facts.join(" · ")}.</p>
    ${REF_Q.map(([id, q, ph]) => `<label class="rq"><span>${q}</span><textarea data-rq="${id}" maxlength="600" placeholder="${ph}">${esc(r[id] || "")}</textarea></label>`).join("")}
    <p class="pmsg" id="refMsg"></p>
    <div class="row"><button class="btn primary" id="refSave">Simpan refleksi</button><button class="btn ghost" id="refCancel">Nanti saja</button></div>`;
  if (!$("#dlgRef").open) $("#dlgRef").showModal();
}
function saveRef() {
  const r = {};
  document.querySelectorAll("[data-rq]").forEach(t => {
    const v = t.value.trim();
    if (v) r[t.dataset.rq] = v;
  });
  if (!Object.keys(r).length) {
    $("#refMsg").textContent = "Isi minimal satu pertanyaan dulu.";
    return;
  }
  r.at = new Date().toISOString();
  S.refs[S.refWeek] = r;
  if (!saveObj(REF_KEY, S.refs)) {
    $("#refMsg").textContent = "Gagal menyimpan. Penyimpanan browser mungkin penuh.";
    return;
  }
  $("#dlgRef").close();
  renderWeekly();
  renderIntent();
  renderRefs();
  toast(
    `<span class="bdg" style="--bc:var(--m3)">${bsvg("check")}</span><div><small>Refleksi</small><b>Refleksi ${weekRange(S.refWeek)} tersimpan</b></div>`
  );
}

function renderRefs() {
  const ws = Object.keys(S.refs).sort().reverse(),
    el = $("#refList");
  $("#refSum").textContent = ws.length
    ? `${ws.length} refleksi tersimpan.`
    : "Seminggu sekali, lihat kembali minggumu lewat 3 pertanyaan singkat.";
  if (!ws.length) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML =
    ws
      .slice(0, S.refLimit)
      .map(w => {
        const r = S.refs[w];
        return `<article class="ref"><div class="rhead"><b>${weekRange(w)} ${fromKey(w).getFullYear()}</b><button class="link small" data-ref="${w}">Ubah</button></div>
        ${REF_Q.filter(([id]) => r[id])
          .map(([id, q]) => `<p><span>${q}</span>${esc(r[id])}</p>`)
          .join("")}</article>`;
      })
      .join("") +
    (ws.length > S.refLimit
      ? `<button class="btn ghost more" id="refMore">Tampilkan lebih banyak (${ws.length - S.refLimit} lagi)</button>`
      : "");
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "intSave") {
    saveIntent();
    return;
  }
  if (t.id === "intCancel") {
    S.intEdit = false;
    renderIntent();
    return;
  }
  if (t.dataset.intEdit) {
    S.intEdit = t.dataset.intEdit;
    renderIntent();
    $("#intIn")?.focus();
    return;
  }
  if (t.dataset.ires) {
    S.intents[S.sel] = { ...S.intents[S.sel], r: +t.dataset.ires };
    saveObj(INT_KEY, S.intents);
    renderIntent();
    renderHabitDone();
    return;
  }
  if (t.id === "intReset") {
    delete S.intents[S.sel].r;
    saveObj(INT_KEY, S.intents);
    renderIntent();
    renderHabitDone();
    return;
  }
  if (t.dataset.ref) {
    openRef(t.dataset.ref);
    return;
  }
  if (t.id === "refOpen") {
    openRef(S.refs[refTarget()] ? weekOf(todayKey()) : refTarget());
    return;
  }
  if (t.id === "refSave") {
    saveRef();
    return;
  }
  if (t.id === "refCancel") {
    $("#dlgRef").close();
    return;
  }
  if (t.id === "refHide") {
    try {
      localStorage.setItem(REFHIDE_KEY, refTarget());
    } catch (_) {}
    renderWeekly();
    return;
  }
  if (t.id === "refMore") {
    S.refLimit += 5;
    renderRefs();
    return;
  }
});
document.addEventListener("keydown", e => {
  if (e.target.id === "intIn" && e.key === "Enter") {
    e.preventDefault();
    saveIntent();
  }
});
