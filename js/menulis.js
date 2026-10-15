/* Menulis: mode menulis fokus (layar penuh), bicara jadi tulisan, dan tema pertanyaan pemantik. */

/* ===== Tema pertanyaan ===== */
const PTHEME_KEY = "jurnal-rasa:ptheme";
try {
  const t = localStorage.getItem(PTHEME_KEY);
  S.ptheme = PROMPT_THEMES[t] ? t : "auto";
} catch (_) {
  S.ptheme = "auto";
}
$("#pTheme").innerHTML = Object.entries(PROMPT_THEMES)
  .map(([k, t]) => `<option value="${k}">${t.n}</option>`)
  .join("");
$("#pTheme").addEventListener("change", e => {
  S.ptheme = e.target.value;
  S.promptIdx = Math.floor(Math.random() * 50);
  try {
    S.ptheme === "auto"
      ? localStorage.removeItem(PTHEME_KEY)
      : localStorage.setItem(PTHEME_KEY, S.ptheme);
  } catch (_) {}
  renderPrompt();
});

/* ===== Mode menulis fokus ===== */
// Textarea besar yang selalu disalin ke catatan utama, jadi draf otomatis dan tombol Simpan tetap bekerja seperti biasa.
const words = t => (t.trim() ? t.trim().split(/\s+/).length : 0);
function renderCount() {
  const n = words($("#fnote").value);
  $("#fCount").textContent = n ? `${n} kata` : "Belum ada tulisan";
}
function openFocus() {
  $("#fDate").textContent = S.sel === todayKey() ? "Hari ini" : fmtLong(S.sel);
  $("#fPrompt").textContent = currentPrompt();
  const f = $("#fnote");
  f.value = $("#note").value;
  renderCount();
  $("#dlgFocus").showModal();
  f.focus();
  f.setSelectionRange(f.value.length, f.value.length);
}
// Salin isi textarea fokus ke catatan utama lewat event input yang sama dengan mengetik biasa.
function syncNote(v) {
  const n = $("#note");
  n.value = v;
  n.dispatchEvent(new Event("input"));
}
$("#fnote").addEventListener("input", e => {
  syncNote(e.target.value);
  renderCount();
});
$("#dlgFocus").addEventListener("close", () => {
  stopMic();
  $("#note").scrollTop = $("#note").scrollHeight;
});

/* ===== Bicara jadi tulisan ===== */
// Memakai pengenal suara bawaan browser. Di Chrome suaranya diproses di server Google, jadi butuh internet.
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
function renderMic() {
  document.querySelectorAll("[data-mic]").forEach(b => {
    b.hidden = !SR;
    const on = !!rec && rec.target === b.dataset.mic;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
    b.title = on ? "Berhenti mendengarkan" : "Bicara untuk menulis";
  });
}
function micLine(target, html) {
  document.querySelectorAll("[data-micline]").forEach(p => {
    const show = p.dataset.micline === target && html;
    p.hidden = !show;
    if (show) p.innerHTML = html;
  });
}
function startMic(target) {
  stopMic();
  const r = new SR();
  r.lang = "id-ID";
  r.continuous = true;
  r.interimResults = true;
  r.target = target;
  r.onresult = ev => {
    let fin = "",
      mid = "";
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      const t = ev.results[i][0].transcript;
      ev.results[i].isFinal ? (fin += t) : (mid += t);
    }
    if (fin.trim()) {
      const ta = $("#" + target),
        v = ta.value,
        sep = !v || /\s$/.test(v) ? "" : " ";
      ta.value = v + sep + fin.trim();
      if (target === "fnote") {
        syncNote(ta.value);
        renderCount();
      } else ta.dispatchEvent(new Event("input"));
      ta.scrollTop = ta.scrollHeight;
    }
    micLine(target, `<i></i>Mendengarkan… ${mid ? `<span>${esc(mid)}</span>` : ""}`);
  };
  r.onerror = ev => {
    const msg =
      ev.error === "not-allowed" || ev.error === "service-not-allowed"
        ? "Izin mikrofon ditolak. Izinkan mikrofon di pengaturan browser."
        : ev.error === "network"
          ? "Butuh koneksi internet untuk mengubah suara jadi tulisan."
          : ev.error === "no-speech"
            ? "Tidak terdengar suara. Coba lagi."
            : "";
    if (msg) {
      rec = null;
      renderMic();
      micLine(target, msg);
    }
  };
  r.onend = () => {
    if (rec !== r) return;
    rec = null;
    renderMic();
    micLine(target, "");
  };
  try {
    r.start();
  } catch (_) {
    return;
  }
  rec = r;
  renderMic();
  micLine(
    target,
    `<i></i>Mendengarkan… <span class="muted">Suara diubah jadi tulisan oleh layanan browser (Chrome memakai server Google).</span>`
  );
}
function stopMic() {
  if (!rec) return;
  const r = rec;
  rec = null;
  try {
    r.stop();
  } catch (_) {}
  renderMic();
  micLine(r.target, "");
}
renderMic();

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "focusOpen") {
    openFocus();
    return;
  }
  if (t.id === "focusDone") {
    $("#dlgFocus").close();
    return;
  }
  if (t.id === "fPromptNext") {
    S.promptIdx++;
    renderPrompt();
    return;
  }
  if (t.id === "fPrompt") {
    const f = $("#fnote"),
      v = f.value.trimEnd();
    f.value = (v ? v + "\n\n" : "") + t.textContent + "\n";
    syncNote(f.value);
    renderCount();
    f.focus();
    f.setSelectionRange(f.value.length, f.value.length);
    return;
  }
  if (t.dataset.mic) {
    rec && rec.target === t.dataset.mic ? stopMic() : startMic(t.dataset.mic);
    return;
  }
});
