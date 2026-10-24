/* Catatan: cari, saring, daftar semua catatan, dan cetak/PDF per bulan. */

function renderHistControls() {
  $("#fMoods").innerHTML = [1, 2, 3, 4, 5]
    .map(
      l =>
        `<button class="fm" data-fmood="${l}" aria-pressed="${S.fMood.includes(l)}" aria-label="${MOODS[l].n}" title="${MOODS[l].n}">${face(l, 26)}</button>`
    )
    .join("");
  const used = new Set(S.tags);
  Object.values(S.entries).forEach(e => (e.tags || []).forEach(t => used.add(t)));
  if (S.fTag && !used.has(S.fTag)) S.fTag = "";
  $("#fTag").innerHTML =
    `<option value="">Semua label</option>` +
    [...used]
      .map(t => `<option value="${esc(t)}"${t === S.fTag ? " selected" : ""}>${esc(t)}</option>`)
      .join("");
}

function filtered() {
  const q = S.q.trim().toLowerCase();
  return Object.keys(S.entries)
    .sort()
    .reverse()
    .filter(k => {
      const e = S.entries[k];
      if (S.fMood.length && !S.fMood.includes(e.mood)) return false;
      if (S.fTag && !(e.tags || []).includes(S.fTag)) return false;
      if (
        q &&
        !(
          (e.note || "").toLowerCase().includes(q) ||
          (e.tags || []).some(t => t.toLowerCase().includes(q)) ||
          (e.emo || []).some(t => t.toLowerCase().includes(q))
        )
      )
        return false;
      return true;
    });
}

// Potong catatan di sekitar kata yang dicari, lalu tandai kata itu dengan <mark>.
function snippet(text) {
  const q = S.q.trim();
  if (!q) return esc(text);
  const at = text.toLowerCase().indexOf(q.toLowerCase());
  if (at > 60) text = "…" + text.slice(at - 40);
  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  let out = "",
    i = 0;
  text.replace(re, (m, o) => {
    out += esc(text.slice(i, o)) + `<mark>${esc(m)}</mark>`;
    i = o + m.length;
    return m;
  });
  return out + esc(text.slice(i));
}

const moodText = e =>
  MOODS[e.mood].n + (e.emo?.length ? ` (${e.emo.map(x => x.toLowerCase()).join(", ")})` : "");

function renderHistory() {
  const all = Object.keys(S.entries).length;
  $("#histTools").hidden = !all;
  $("#printOpen").hidden = !all;
  if (!all) {
    $("#histCount").textContent = "";
    $("#hist").innerHTML =
      `<div class="empty">${face(4, 56)}<b>Halaman pertamamu masih kosong</b>Pilih wajah yang paling menggambarkan harimu, lalu tekan Simpan.</div>`;
    return;
  }
  const ks = filtered(),
    shown = ks.slice(0, S.histLimit),
    filt = S.q.trim() || S.fMood.length || S.fTag;
  $("#histCount").innerHTML = filt
    ? `${ks.length} dari ${all} catatan cocok · <button class="link" id="fClear">Hapus filter</button>`
    : `${all} catatan`;
  let h = "",
    cur = "";
  shown.forEach(k => {
    const e = S.entries[k],
      mk = k.slice(0, 7);
    if (mk !== cur) {
      cur = mk;
      h += `<p class="mgroup">${fromKey(k).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>`;
    }
    const ph = typeof e.photo === "string" && e.photo.startsWith("data:image/");
    h += `<button class="entry${ph ? " wp" : ""}${k === S.readK ? " on" : ""}${k === S.lastRead ? " mark" : ""}" data-day="${k}"${k === S.lastRead ? ' title="Terakhir dibaca"' : ""}>${face(e.mood, 34)}<div style="min-width:0"><div class="d">${fmtShort(k)}${dayStickers(
      k
    )
      .map(s => stickerSvg(s, 16))
      .join(
        ""
      )} <span class="t">· ${esc(moodText(e))}${e.tags?.length ? " · " + snippet(e.tags.join(", ")) : ""}</span></div>${e.note ? `<div class="note">${snippet(e.note)}</div>` : ""}</div>${ph ? `<img class="thumb" src="${esc(e.photo)}" alt="">` : ""}</button>`;
  });
  if (!ks.length) h = emptyBox("Tidak ada catatan yang cocok dengan pencarian ini.");
  if (ks.length > shown.length)
    h += `<button class="btn ghost more" id="more">Tampilkan lebih banyak (${ks.length - shown.length} lagi)</button>`;
  $("#hist").innerHTML = h;
}

/* ===== Baca catatan (halaman kanan tab Catatan di desktop) ===== */
// Hanya untuk membaca. Mengubah catatan tetap lewat tab Tulis, jadi halaman tulis tidak muncul dobel.
function renderRead() {
  const el = $("#readView");
  if (!el) return;
  const ks = Object.keys(S.entries).sort().reverse();
  if (!S.readK || !S.entries[S.readK]) S.readK = ks[0] || "";
  document.querySelectorAll("#hist .entry").forEach(b => {
    b.classList.toggle("on", b.dataset.day === S.readK);
    b.classList.toggle("mark", b.dataset.day === S.lastRead);
  });
  const k = S.readK,
    e = S.entries[k];
  if (!e) {
    el.innerHTML = emptyBox("Pilih catatan di sebelah kiri untuk membacanya di sini.");
    return;
  }
  const d = fromKey(k),
    ph = typeof e.photo === "string" && e.photo.startsWith("data:image/");
  el.innerHTML = `<div class="rhead"><div><p class="label">${d.toLocaleDateString("id-ID", { weekday: "long" })} · ${d.getFullYear()}</p><h2>${d.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}</h2></div><span class="rmood">${face(e.mood, 28)}${esc(moodText(e))}</span></div>${
    e.tags?.length
      ? `<div class="rtags">${e.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>`
      : ""
  }${e.weather ? `<p class="rweather">${wIcon(e.weather, 18)}${weatherName(e.weather)}</p>` : ""}${e.note ? `<p class="rnote">${esc(e.note)}</p>` : `<p class="muted">Hari ini dicatat tanpa cerita.</p>`}${e.doodle ? `<img class="rdoodle" src="${esc(e.doodle)}" alt="Coretan ${esc(fmtShort(k))}">` : ""}${
    e.grat?.length
      ? `<div class="rgrat"><p class="label">Disyukuri</p><ul>${e.grat.map(g => `<li>${esc(g)}</li>`).join("")}</ul></div>`
      : ""
  }${ph ? `<img class="rphoto" src="${esc(e.photo)}" alt="Foto ${esc(fmtShort(k))}">` : ""}<div class="row"><button class="btn ghost" data-day="${k}">Ubah catatan</button></div>`;
}

/* ===== Minggu ini (halaman kanan tab Tulis di desktop) ===== */
function renderSide() {
  const el = $("#wkStrip");
  if (!el) return;
  const t = fromKey(todayKey()),
    mon = new Date(t);
  mon.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  const tk = todayKey();
  let h = "";
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const k = keyOf(d),
      e = S.entries[k],
      fut = k > tk;
    h += `<button class="wkd${e ? " has" : ""}${k === tk ? " today" : ""}${k === S.sel ? " sel" : ""}" ${fut ? "disabled" : `data-day="${k}"`} ${e ? `style="--c:var(--m${e.mood})"` : ""} aria-label="${fmtLong(k)}${e ? ", " + MOODS[e.mood].n : fut ? "" : ", belum diisi"}"><small>${d.toLocaleDateString("id-ID", { weekday: "short" })}</small><span>${d.getDate()}</span></button>`;
  }
  el.innerHTML = h;
}

/* ===== Cetak / PDF ===== */
function openPrint() {
  const ks = Object.keys(S.entries),
    ms = [...new Set(ks.map(k => k.slice(0, 7)))].sort().reverse();
  if (!ms.length) return;
  const cur = `${S.vm}-${pad(S.vmo + 1)}`,
    sel = ms.includes(cur) ? cur : ms[0];
  $("#prMonth").innerHTML = ms
    .map(m => {
      const [y, mo] = m.split("-").map(Number);
      return `<option value="${m}"${m === sel ? " selected" : ""}>${monthName(y, mo - 1)} · ${ks.filter(k => k.startsWith(m)).length} catatan</option>`;
    })
    .join("");
  $("#dlgPrint").showModal();
}

// Susun halaman cetak yang rapi: ringkasan bulan, sebaran rasa, lalu semua catatan lengkap.
function buildPrint(y, mo, opt) {
  const dim = new Date(y, mo + 1, 0).getDate(),
    days = Array.from({ length: dim }, (_, i) => `${y}-${pad(mo + 1)}-${pad(i + 1)}`);
  const ks = days.filter(k => S.entries[k]),
    es = ks.map(k => S.entries[k]),
    cnt = [0, 0, 0, 0, 0, 0];
  es.forEach(e => cnt[e.mood]++);
  const sl = es.filter(e => typeof e.sleep === "number").map(e => e.sleep),
    en = es.filter(e => e.energy).map(e => e.energy),
    tags = topTags(es);
  const hrs = v => num(v, v % 1 ? 1 : 0);
  const entry = k => {
    const e = S.entries[k];
    const meta = [
      esc(moodText(e)),
      e.energy ? `energi ${ENERGY[e.energy].toLowerCase()}` : "",
      typeof e.sleep === "number" ? `tidur ${hrs(e.sleep)} jam` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    let h = `<article class="pent"><div class="phead">${face(e.mood, 26)}<b>${fmtLong(k)}</b>${dayStickers(
      k
    )
      .map(s => stickerSvg(s, 20))
      .join("")}<span>${meta}</span></div>`;
    if (e.tags?.length) h += `<p class="ptags">${esc(e.tags.join(", "))}</p>`;
    if (e.note) h += `<p class="pnote">${esc(e.note)}</p>`;
    if (opt.extra) {
      if (e.grat?.length)
        h += `<p class="pex"><b>Bersyukur atas:</b> ${esc(e.grat.join("; "))}</p>`;
      if (e.habits?.length) h += `<p class="pex"><b>Kebiasaan:</b> ${esc(e.habits.join(", "))}</p>`;
      const it = S.intents[k];
      if (it)
        h += `<p class="pex"><b>Niat:</b> ${esc(it.t)}${it.r !== undefined ? ` (${INT_RES[it.r].toLowerCase()})` : ""}</p>`;
      if (e.moments?.length)
        h += `<p class="pex"><b>Momen:</b> ${e.moments.map(m => `${m.time ? m.time + " " : ""}${MOODS[m.mood].n}${m.note ? " – " + esc(m.note) : ""}`).join("; ")}</p>`;
    }
    if (opt.photo && e.photo?.startsWith("data:image/")) h += `<img src="${esc(e.photo)}" alt="">`;
    return h + `</article>`;
  };
  $("#printArea").innerHTML =
    `<header class="phd"><p>Jurnal Rasa</p><h1>${monthName(y, mo)}</h1><p>Dicetak ${fmtLong(todayKey())}</p></header>
    <section class="psum"><div><b>${ks.length}</b><span>hari tercatat</span></div><div><b>${es.length ? num(avgOf(es.map(e => e.mood))) : "–"}</b><span>rata-rata rasa (1–5)</span></div>
      ${sl.length ? `<div><b>${hrs(avgOf(sl))} jam</b><span>rata-rata tidur</span></div>` : ""}${en.length ? `<div><b>${num(avgOf(en))}</b><span>rata-rata energi (1–5)</span></div>` : ""}</section>
    <section><h2>Sebaran rasa</h2><div class="pdist">${[1, 2, 3, 4, 5].map(l => `<span><i style="background:var(--m${l})"></i>${MOODS[l].n}: ${cnt[l]}</span>`).join("")}</div>
      <div class="pstrip">${days
        .map((k, i) => {
          const e = S.entries[k];
          return `<i${e ? ` style="background:var(--m${e.mood})"` : ""}><small>${i + 1}</small></i>`;
        })
        .join("")}</div></section>
    ${tags.length ? `<section><h2>Label yang sering muncul</h2><p>${tags.map(([t, n]) => `${esc(t)} (${n}×)`).join(", ")}</p></section>` : ""}
    <section><h2>Catatan harian</h2>${ks.map(entry).join("")}</section>`;
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.fmood) {
    const l = +t.dataset.fmood,
      a = S.fMood;
    a.includes(l) ? a.splice(a.indexOf(l), 1) : a.push(l);
    S.histLimit = 10;
    renderHistControls();
    renderHistory();
    return;
  }
  if (t.id === "fClear") {
    S.q = "";
    S.fMood = [];
    S.fTag = "";
    S.histLimit = 10;
    $("#q").value = "";
    renderHistControls();
    renderHistory();
    return;
  }
  if (t.id === "more") {
    S.histLimit += 10;
    renderHistory();
    return;
  }
  if (t.id === "printOpen") {
    openPrint();
    return;
  }
  if (t.id === "printGo") {
    const [y, mo] = $("#prMonth").value.split("-").map(Number);
    buildPrint(y, mo - 1, { photo: $("#prPhoto").checked, extra: $("#prExtra").checked });
    $("#dlgPrint").close();
    setTimeout(() => window.print(), 60);
    return;
  }
});
document.addEventListener("input", e => {
  if (e.target.id === "q") {
    S.q = e.target.value;
    S.histLimit = 10;
    renderHistory();
  }
});
$("#fTag").addEventListener("change", e => {
  S.fTag = e.target.value;
  S.histLimit = 10;
  renderHistory();
});
