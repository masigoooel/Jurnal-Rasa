/* Dukungan: kartu lembut saat beberapa hari terasa berat, dan dialog kontak bantuan. */

// Nomor layanan bisa berubah. Cek ulang informasi terbaru sebelum aplikasi dibagikan ke orang lain.
const HELP_LINES = [
  { n: "Darurat (polisi, ambulans, pemadam)", num: "112", tel: "112" },
  {
    n: "Layanan konseling kesehatan jiwa Kemenkes (SEJIWA)",
    num: "119 ext 8",
    tel: "119",
  },
];
const CARE_KEY = "jurnal-rasa:careHide";

// Berat = rasa Berat atau Kurang. Muncul kalau 3 hari berturut-turut, atau 4 dari 7 hari terakhir.
function heavyDays() {
  const day = i => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return S.entries[keyOf(d)];
  };
  let run = 0;
  for (let i = day(0) ? 0 : 1; day(i) && day(i).mood <= 2; i++) run++;
  const week = Array.from({ length: 7 }, (_, i) => day(i)).filter(e => e && e.mood <= 2).length;
  return { run, week, heavy: run >= 3 || week >= 4 };
}

function renderCare() {
  const el = $("#care");
  let hide = "";
  try {
    hide = localStorage.getItem(CARE_KEY) || "";
  } catch (_) {}
  const h = heavyDays(),
    snoozed = hide && (fromKey(todayKey()) - fromKey(hide)) / 864e5 < 3;
  el.hidden = !(S.sel === todayKey() && h.heavy && !snoozed);
  if (el.hidden) return;
  const why = h.run >= 3 ? `${h.run} hari berturut-turut` : `${h.week} dari 7 hari terakhir`;
  el.innerHTML = `<span class="calmic" style="--cc:var(--m1)">${bsvg("heart")}</span>
    <div><b>Beberapa hari ini terasa berat</b><span>Tercatat berat ${why}. Kamu tidak harus menghadapinya sendirian.</span>
    <div class="row"><button class="btn primary sm" data-help>Cari dukungan</button><button class="btn ghost sm" id="careBreath">Latihan napas</button></div></div>
    <button class="mx" id="careHide" aria-label="Tutup selama 3 hari" title="Tutup selama 3 hari">×</button>`;
}

function renderHelp() {
  const tr = S.set.trust || {},
    has = tr.name || tr.phone,
    phone = (tr.phone || "").replace(/[^\d+]/g, "");
  const trust = S.trustEdit
    ? `<div class="hform"><label class="pf"><span>Nama</span><input id="trName" maxlength="40" value="${esc(tr.name || "")}" placeholder="Misalnya: Kak Rina"></label>
       <label class="pf"><span>Nomor HP</span><input id="trPhone" type="tel" maxlength="20" value="${esc(tr.phone || "")}" placeholder="08…"></label>
       <div class="row"><button class="btn primary sm" id="trSave">Simpan</button><button class="btn ghost sm" id="trCancel">Batal</button></div></div>`
    : has
      ? `<div class="hline"><div><b>${esc(tr.name || "Orang yang kamu percaya")}</b><span class="muted small">${esc(tr.phone || "")}</span></div>
         <span class="row">${phone ? `<a class="btn primary sm" href="tel:${esc(phone)}">Telepon</a>` : ""}<button class="btn text sm" id="trEdit">Ubah</button></span></div>`
      : `<div class="hline"><span class="muted small">Simpan satu kontak yang bisa kamu hubungi saat butuh teman bicara.</span><button class="btn ghost sm" id="trEdit">Tambah</button></div>`;
  $("#dlgHelp").innerHTML =
    `<form method="dialog" class="dhead"><h2><span class="hi" style="--hc:var(--m1)">${bsvg("heart")}</span>Kamu tidak sendirian</h2>
      <button class="iconbtn sm" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></form>
    <p class="muted">Merasa berat itu manusiawi. Bercerita ke orang lain sering membuat beban terasa lebih ringan.</p>
    <p class="label">Orang yang kamu percaya</p>${trust}
    <p class="label">Bantuan profesional</p>
    ${HELP_LINES.map(l => `<div class="hline"><div><b>${l.n}</b><span class="muted small tnum">${l.num}</span></div><a class="btn ghost sm" href="tel:${l.tel}">Telepon</a></div>`).join("")}
    <p class="hwarn">Kalau kamu berpikir untuk menyakiti diri sendiri, segera hubungi <b>112</b> atau datang ke IGD rumah sakit terdekat.</p>
    <p class="label">Yang bisa membantu sekarang</p>
    <ul class="helplist"><li>Minum segelas air dan duduk sebentar.</li><li>Kirim pesan singkat ke satu orang: “Lagi berat, boleh ngobrol?”</li><li>Keluar sebentar, lihat langit atau berjalan pelan.</li>
    <li><button class="link" id="helpBreath">Latihan napas 1 menit</button></li></ul>
    <p class="muted small">Nomor layanan bisa berubah. Kontak yang kamu simpan hanya ada di browser ini.</p>`;
}
function openHelp() {
  S.trustEdit = false;
  renderHelp();
  if (!$("#dlgHelp").open) $("#dlgHelp").showModal();
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.hasAttribute("data-help")) {
    if ($("#dlgSet").open) $("#dlgSet").close();
    openHelp();
    return;
  }
  if (t.id === "careHide") {
    try {
      localStorage.setItem(CARE_KEY, todayKey());
    } catch (_) {}
    renderCare();
    return;
  }
  if (t.id === "careBreath" || t.id === "helpBreath") {
    if ($("#dlgHelp").open) $("#dlgHelp").close();
    startBreath();
    return;
  }
  if (t.id === "trEdit") {
    S.trustEdit = true;
    renderHelp();
    $("#trName").focus();
    return;
  }
  if (t.id === "trCancel") {
    S.trustEdit = false;
    renderHelp();
    return;
  }
  if (t.id === "trSave") {
    const name = $("#trName").value.trim(),
      phone = $("#trPhone").value.trim();
    S.set.trust = name || phone ? { name, phone } : undefined;
    saveSet();
    S.trustEdit = false;
    renderHelp();
    return;
  }
});
