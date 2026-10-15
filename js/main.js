/* Main: tab, render semua bagian, dan urutan saat halaman dibuka. File ini dimuat paling akhir. */

function renderAll() {
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
}

// Di HP satu tab tampil penuh; di desktop editor selalu di kiri dan tab hanya mengganti isi kolom kanan.
function setTab(tab, quiet) {
  const b = document.body;
  b.dataset.tab = tab;
  if (tab !== "tulis") {
    b.dataset.rtab = tab;
    try {
      localStorage.setItem("jurnal-rasa:rtab", tab);
    } catch (_) {}
  }
  document.querySelectorAll("button[data-tab]").forEach(x => {
    const cur = x.closest(".rtabs") ? b.dataset.rtab : tab;
    if (x.dataset.tab === cur) x.setAttribute("aria-current", "page");
    else x.removeAttribute("aria-current");
  });
  if (!quiet) {
    if (isMobile()) window.scrollTo({ top: 0 });
    else {
      const top = $(".right").getBoundingClientRect().top + scrollY - 16;
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
{
  let rt = "";
  try {
    rt = localStorage.getItem("jurnal-rasa:rtab") || "";
  } catch (_) {}
  document.body.dataset.rtab = ["kalender", "wawasan", "koleksi", "catatan"].includes(rt)
    ? rt
    : "kalender";
  setTab("tulis", true);
}
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
// Minta browser tidak menghapus data situs ini saat ruang penyimpanan HP menipis.
navigator.storage?.persist?.().catch(() => {});
