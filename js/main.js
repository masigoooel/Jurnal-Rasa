/* Main: tab, render semua bagian, dan urutan saat halaman dibuka. File ini dimuat paling akhir. */

function renderAll() {
  muatLama();
  renderStatus();
  renderBanner();
  renderEditor();
  renderMonth();
  renderYear();
  renderFactors();
  renderEmotions();
  renderWeek();
  renderWrapList();
  renderRefs();
  renderStkBook();
  renderGratWall();
  renderCaps();
  renderBadges();
  renderHistControls();
  renderHistory();
  renderRead();
  renderSide();
  renderSeason();
  renderCoverPick();
}

// Di HP satu tab tampil penuh (tab bawah). Di desktop setiap tab jadi dua halaman buku: bagian-bagiannya
// dipindah ke halaman kiri (#pgL) dan kanan (#pgR) menurut SPREADS; bagian lain menunggu di .right yang disembunyikan.
const SPREADS = {
  tulis: [["secTulis"], ["secSide"]],
  kalender: [["secMonth"], ["secChart", "secYear"]],
  wawasan: [
    ["secFactors", "secSeason"],
    ["secEmo", "secWeek", "secWrap"],
  ],
  koleksi: [
    ["secGrat", "secCap"],
    ["secStk", "secRefl", "secBadge"],
  ],
  catatan: [["secHist"], ["secRead"]],
};
// Urutan asli semua bagian, untuk dikembalikan saat layar menyempit jadi tampilan HP.
const BOOK_ORDER = [...document.querySelectorAll(".right > .panel")];
function layoutBook() {
  const grid = $(".grid"),
    right = $(".right"),
    ed = $("#secTulis");
  // index.html versi lama (tanpa halaman buku): biarkan susunan apa adanya.
  if (!grid || !right || !ed || !$("#pgL") || !$("#pgR")) return;
  // Kartu refleksi dan kilas balik: di HP tetap di bawah halaman tulis, di desktop pindah ke halaman kanan tab Tulis.
  const side = isMobile() ? ed : $("#secSide");
  ["#weekly", "#flash"].forEach(s => side.appendChild($(s)));
  if (isMobile()) {
    grid.insertBefore(ed, right);
    BOOK_ORDER.forEach(p => right.appendChild(p));
    return;
  }
  const [L, R] = SPREADS[document.body.dataset.tab] || SPREADS.tulis;
  const used = new Set([...L, ...R]);
  [ed, ...BOOK_ORDER].forEach(p => {
    if (!used.has(p.id) && p.parentNode !== right) right.appendChild(p);
  });
  L.forEach(id => $("#pgL").appendChild($("#" + id)));
  R.forEach(id => $("#pgR").appendChild($("#" + id)));
  // Saat pindah tab, halaman kanan dibalik pelan seperti kertas.
  const tab = document.body.dataset.tab;
  if (layoutBook.last && layoutBook.last !== tab) {
    const g = grid;
    g.classList.remove("turn");
    void g.offsetWidth;
    g.classList.add("turn");
  }
  layoutBook.last = tab;
}
matchMedia("(max-width:820px)").addEventListener("change", layoutBook);

function setTab(tab, quiet) {
  const b = document.body;
  if (!quiet && b.dataset.tab && b.dataset.tab !== tab) kertas("balik");
  b.dataset.tab = tab;
  if (tab !== "tulis") b.dataset.rtab = tab;
  document.querySelectorAll("button[data-tab]").forEach(x => {
    if (x.dataset.tab === tab) x.setAttribute("aria-current", "page");
    else x.removeAttribute("aria-current");
  });
  layoutBook();
  if (!quiet) {
    if (isMobile()) window.scrollTo({ top: 0 });
    else {
      const top = $(".grid").getBoundingClientRect().top + scrollY - 70;
      if (scrollY > top) window.scrollTo({ top });
    }
  }
  if (tab === "kalender") scrollYear();
}

// Layar pembuka tampil minimal 1,3 detik sejak halaman dibuka, menunggu font siap (paling lama 1,6 detik),
// lalu memudar. Setelah itu baru panduan atau pengingat boleh muncul.
function hideSplash(done) {
  const sp = $("#splash");
  if (!sp) return done();
  const calm = reducedMotion(),
    since = ms => new Promise(r => setTimeout(r, Math.max(0, ms - performance.now()))),
    fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([since(calm ? 0 : 1300), Promise.race([fonts, since(1600)])]).then(() => {
    sp.classList.add("out");
    setTimeout(
      () => {
        sp.remove();
        done();
      },
      calm ? 0 : 450
    );
  });
}

// Dijalankan setelah jurnal terbuka (langsung, atau setelah PIN benar).
function afterUnlock() {
  showDueReminder();
  checkCapsules();
  checkWelcome();
}

document.addEventListener("click", e => {
  const t = e.target.closest("button[data-tab]");
  if (t) setTab(t.dataset.tab);
});

/* ===== Mulai ===== */
S.entries = restore();
S.tags = loadList(TAG_KEY, TAGS);
S.habits = loadList(HABIT_KEY, HABITS);
S.badges = loadBadges();
S.caps = loadCaps();
S.set = loadSet();
document.body.classList.toggle("hide-notes", S.set.hide);
applyFeatures();
$("#keypad").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"]
  .map(k =>
    k
      ? `<button data-key="${k}" aria-label="${k === "del" ? "Hapus" : k}">${k === "del" ? "⌫" : k}</button>`
      : "<span></span>"
  )
  .join("");
$("#lockLogo").innerHTML = face(4, 56);
$("#bface").innerHTML = face(4, 80);
lockApp();
applyTheme(document.documentElement.dataset.theme || "auto");
$("#todayText").textContent = fmtLong(todayKey());
$("#todayShort").textContent = new Date().toLocaleDateString("id-ID", {
  weekday: "short",
  day: "numeric",
  month: "short",
});
{
  const h = new Date().getHours();
  $("#greet").textContent =
    h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
}
setTab("tulis", true);
loadDraft();
renderAll();
renderCapForm();
syncBadges(false);
checkWrapNote();
scheduleReminder();
hideSplash(() => {
  if (!isLocked()) afterUnlock();
});

// PWA: simpan file aplikasi untuk dipakai offline. Hanya bisa saat dibuka lewat http(s), bukan dari file langsung.
if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
// Safari lama di iPhone mengabaikan user-scalable=no, jadi gerakan cubit dicegah langsung.
["gesturestart", "gesturechange"].forEach(t =>
  document.addEventListener(t, e => e.preventDefault(), { passive: false })
);
// Minta browser tidak menghapus data situs ini saat ruang penyimpanan HP menipis.
navigator.storage?.persist?.().catch(() => {});
