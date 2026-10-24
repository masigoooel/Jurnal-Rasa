/* Kalender: bulan ini, pemilih bulan, grafik naik turun, dan rekap setahun. */

function monthKeys() {
  const dim = new Date(S.vm, S.vmo + 1, 0).getDate();
  return Array.from({ length: dim }, (_, i) => `${S.vm}-${pad(S.vmo + 1)}-${pad(i + 1)}`);
}

// Kalender bisa dilihat sampai 12 bulan ke depan, supaya stiker bisa ditempel untuk acara yang akan datang.
const AHEAD = 12,
  monthIdx = (y, m) => y * 12 + m,
  maxMonth = () => monthIdx(new Date().getFullYear(), new Date().getMonth()) + AHEAD;

const legendHtml = () =>
  [1, 2, 3, 4, 5]
    .map(l => `<span><i style="background:var(--m${l})"></i>${MOODS[l].n}</span>`)
    .join("");

// Kotak-kotak tanggal satu bulan. live=false dipakai di layar hias: hanya tampilan, tidak bisa diklik.
function monthCells(y, mo, live) {
  const first = new Date(y, mo, 1),
    dim = new Date(y, mo + 1, 0).getDate(),
    lead = (first.getDay() + 6) % 7,
    tk = todayKey(),
    tag = live ? "button" : "div";
  let h = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
    .map(d => `<div class="dow">${d}</div>`)
    .join("");
  for (let i = 0; i < lead; i++) h += `<div class="day pad"></div>`;
  for (let i = 0; i < dim; i++) {
    const k = `${y}-${pad(mo + 1)}-${pad(i + 1)}`,
      e = S.entries[k],
      fut = k > tk,
      stk = dayStickers(k),
      ph = e?.photo?.startsWith("data:image/");
    h += `<${tag} style="--i:${i}" class="day ${e ? "has" : ""} ${k === tk ? "today" : ""} ${live && k === S.sel ? "sel" : ""} ${fut ? "future" : ""}" ${live && fut && !S.stkMode ? "disabled" : ""} ${e ? `data-c="${e.mood}"` : ""} ${ph ? `data-ph="1"` : ""} data-day="${k}" ${live ? `aria-label="${fmtLong(k)}${e ? ", " + MOODS[e.mood].n : ""}${stk.length ? ", stiker " + esc(stk.map(s => s.n).join(", ")) : ""}"` : ""}><span class="n">${i + 1}</span>${stk.length ? `<span class="dstk" style="--r:${tilt(k)}deg">${stickerSvg(stk[0])}${stk.length > 1 ? `<b>+${stk.length - 1}</b>` : ""}</span>` : ""}</${tag}>`;
  }
  return h;
}

function renderMonth() {
  const first = new Date(S.vm, S.vmo, 1),
    now = new Date();
  $("#monthTitle").textContent = first.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  $("#nextM").disabled = monthIdx(S.vm, S.vmo) >= maxMonth();
  const keys = monthKeys(),
    filled = keys.filter(k => S.entries[k]);
  const avg = filled.length ? filled.reduce((s, k) => s + S.entries[k].mood, 0) / filled.length : 0;
  const st = streak(),
    total = Object.keys(S.entries).length;
  $("#stats").innerHTML =
    `<div class="stat"><b class="tnum" data-count="${filled.length}">${filled.length}</b><span>hari tercatat</span></div>
    <div class="stat"${avg ? ` style="--sc:var(--m${Math.round(avg)})" title="Rata-rata rasa: ${MOODS[Math.round(avg)].n.toLowerCase()}"` : ""}><b class="tnum" ${avg ? `data-count="${avg.toFixed(1)}" data-dec="1"` : ""}>${avg ? num(avg) : "–"}</b><span>rata-rata</span></div>
    ${S.set.fBadge ? `<div class="stat${st >= 3 ? " hot" : ""}"><b class="tnum" data-count="${st}">${st}</b>${st >= 3 ? `<svg class="flame" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 5 1-1 1-3 0-9z"/></svg>` : ""}<span>hari beruntun</span></div>` : `<div class="stat"><b class="tnum" data-count="${total}">${total}</b><span>catatan total</span></div>`}`;
  countUp($("#stats"));
  $("#cal").innerHTML = monthCells(S.vm, S.vmo, true);
  $("#cal").classList.toggle("stkmode", !!S.stkMode);
  $("#legend").innerHTML = legendHtml();
  renderChart(keys);
  renderPage();
}

/* ===== Pemilih bulan ===== */
function renderPicker() {
  const y = S.py,
    now = new Date(),
    cy = now.getFullYear();
  const ks = Object.keys(S.entries),
    has = new Set(ks.map(k => k.slice(0, 7)));
  const minY = Math.min(cy - 1, ...ks.map(k => +k.slice(0, 4)));
  const arrow = d =>
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="${d}"/></svg>`;
  $("#mpick").innerHTML =
    `<div class="mphead"><button class="iconbtn sm" id="pyPrev" ${y <= minY ? "disabled" : ""} aria-label="Tahun sebelumnya">${arrow("M15 5l-7 7 7 7")}</button><b>${y}</b><button class="iconbtn sm" id="pyNext" ${monthIdx(y + 1, 0) > maxMonth() ? "disabled" : ""} aria-label="Tahun berikutnya">${arrow("M9 5l7 7-7 7")}</button></div>
    <div class="mpgrid">${Array.from({ length: 12 }, (_, m) => {
      const fut = monthIdx(y, m) > maxMonth();
      return `<button data-pm="${m}" ${fut ? "disabled" : ""} class="${y === S.vm && m === S.vmo ? "cur" : ""}${has.has(`${y}-${pad(m + 1)}`) ? " has" : ""}">${new Date(y, m, 1).toLocaleDateString("id-ID", { month: "short" })}</button>`;
    }).join("")}</div>
    <button class="link small" id="pmToday">Kembali ke bulan ini</button>`;
}
function togglePicker(open) {
  const p = $("#mpick");
  open ??= p.hidden;
  p.hidden = !open;
  $("#monthTitle").setAttribute("aria-expanded", open);
  if (open) {
    S.py = S.vm;
    renderPicker();
  }
}

/* ===== Grafik ===== */
// Kurva halus (monotone cubic) supaya garis tidak melewati batas skala mood 1–5.
function smoothPath(P) {
  const f = v => v.toFixed(1),
    n = P.length;
  if (n < 3) return P.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join(" ");
  const dx = [],
    m = [],
    t = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = P[i + 1][0] - P[i][0];
    m[i] = (P[i + 1][1] - P[i][1]) / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i],
      b = t[i + 1] / m[i],
      q = a * a + b * b;
    if (q > 9) {
      const k = 3 / Math.sqrt(q);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${f(P[i][0] + h)} ${f(P[i][1] + t[i] * h)} ${f(P[i + 1][0] - h)} ${f(P[i + 1][1] - t[i + 1] * h)} ${f(P[i + 1][0])} ${f(P[i + 1][1])}`;
  }
  return d;
}

function renderChart(keys) {
  const pts = keys.map((k, i) => ({ k, d: i + 1, e: S.entries[k] })).filter(p => p.e);
  const box = $("#chart");
  if (pts.length < 2) {
    box.innerHTML = emptyBox("Grafik muncul setelah ada minimal 2 hari tercatat di bulan ini.");
    return;
  }
  // Di HP kanvasnya lebih sempit supaya tulisan sumbu tidak ikut mengecil saat grafik diskalakan.
  const W = isMobile() ? 340 : 620,
    H = isMobile() ? 200 : 220,
    L = isMobile() ? 54 : 62,
    R = 14,
    T = 14,
    B = 30,
    dim = keys.length;
  const x = d => L + ((d - 1) / (dim - 1)) * (W - L - R),
    y = m => T + ((5 - m) / 4) * (H - T - B);
  let g = "";
  for (let m = 1; m <= 5; m++)
    g += `<line x1="${L}" x2="${W - R}" y1="${y(m)}" y2="${y(m)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 10}" y="${y(m) + 4}" text-anchor="end" font-size="12" fill="var(--muted)">${MOODS[m].n}</text>`;
  const ticks = [1, ...[5, 10, 15, 20, 25].filter(t => t < dim - 2), dim];
  ticks.forEach(
    t =>
      (g += `<text x="${x(t)}" y="${H - 8}" text-anchor="middle" font-size="12" fill="var(--muted)" style="font-variant-numeric:tabular-nums">${t}</text>`)
  );
  const path = smoothPath(pts.map(p => [x(p.d), y(p.e.mood)]));
  const area = `${path} L${x(pts[pts.length - 1].d).toFixed(1)} ${y(1)} L${x(pts[0].d).toFixed(1)} ${y(1)} Z`;
  g += `<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>`;
  g += `<path d="${area}" fill="url(#fade)"/><path class="line" pathLength="1" d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  g += `<line id="xh" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="var(--muted)" stroke-dasharray="3 3" visibility="hidden"/>`;
  pts.forEach(
    (p, i) =>
      (g += `<circle class="pt" style="animation-delay:${(0.3 + (i / pts.length) * 0.6).toFixed(2)}s" cx="${x(p.d)}" cy="${y(p.e.mood)}" r="5.5" fill="var(--m${p.e.mood})" stroke="var(--surface)" stroke-width="2"/>`)
  );
  g += `<rect x="${L}" y="0" width="${W - L - R}" height="${H}" fill="transparent" id="hit"/>`;
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik rasa harian bulan ini">${g}</svg><div class="tip" hidden id="tip"></div>`;
  const svg = box.querySelector("svg"),
    tip = box.querySelector("#tip"),
    xh = box.querySelector("#xh");
  svg.addEventListener("pointermove", ev => {
    const r = svg.getBoundingClientRect(),
      sx = ((ev.clientX - r.left) / r.width) * W;
    let best = pts[0];
    pts.forEach(p => {
      if (Math.abs(x(p.d) - sx) < Math.abs(x(best.d) - sx)) best = p;
    });
    xh.setAttribute("x1", x(best.d));
    xh.setAttribute("x2", x(best.d));
    xh.setAttribute("visibility", "visible");
    tip.hidden = false;
    tip.style.left = (x(best.d) / W) * r.width + "px";
    tip.style.top = (y(best.e.mood) / H) * r.height - 12 + "px";
    tip.innerHTML = `<b>${fmtShort(best.k)} · ${MOODS[best.e.mood].n}</b>${best.e.tags?.length ? `<small>${esc(best.e.tags.join(", "))}</small>` : ""}`;
  });
  svg.addEventListener("pointerleave", () => {
    tip.hidden = true;
    xh.setAttribute("visibility", "hidden");
  });
}

/* ===== Setahun ===== */
function renderYear() {
  const y = S.vy,
    tk = todayKey(),
    now = new Date();
  const years = Object.keys(S.entries).map(k => +k.slice(0, 4));
  $("#yearTitle").textContent = `Tahun ${y}`;
  $("#nextY").disabled = y >= now.getFullYear();
  $("#prevY").disabled = y <= Math.min(now.getFullYear(), ...years);
  const start = new Date(y, 0, 1),
    lead = (start.getDay() + 6) % 7,
    days = new Date(y, 1, 29).getMonth() === 1 ? 366 : 365;
  const cols = Math.ceil((lead + days) / 7);
  let mh = "",
    cells = "";
  for (let m = 0; m < 12; m++) {
    const doy = Math.round((new Date(y, m, 1) - start) / 864e5);
    mh += `<span style="grid-column:${Math.floor((lead + doy) / 7) + 1}">${new Date(y, m, 1).toLocaleDateString("id-ID", { month: "short" })}</span>`;
  }
  for (let i = 0; i < lead; i++) cells += `<i></i>`;
  const ys = [];
  for (let i = 0; i < days; i++) {
    const k = keyOf(new Date(y, 0, 1 + i)),
      e = S.entries[k],
      fut = k > tk;
    if (e) ys.push(e.mood);
    cells += `<button class="yc${e ? " has" : ""}${k === tk ? " today" : ""}" tabindex="-1" ${fut ? "disabled" : ""} ${e ? `style="--c:var(--m${e.mood})"` : ""} data-day="${k}" title="${fmtShort(k)}${e ? " · " + MOODS[e.mood].n : ""}"></button>`;
  }
  const tpl = `grid-template-columns:repeat(${cols},minmax(0,1fr))`;
  $("#year").innerHTML =
    `<div class="ymonths" style="${tpl}">${mh}</div><div class="ygrid" style="${tpl}">${cells}</div>`;
  if (ys.length) {
    const cnt = [0, 0, 0, 0, 0, 0];
    ys.forEach(m => cnt[m]++);
    const top = cnt.indexOf(Math.max(...cnt));
    $("#yearSum").textContent =
      `${ys.length} hari tercatat · rata-rata ${num(avgOf(ys))} · paling sering ${MOODS[top].n.toLowerCase()}`;
  } else $("#yearSum").textContent = `Belum ada catatan di tahun ${y}.`;
  scrollYear();
}
// Geser grid tahunan ke bulan ini; dipanggil lagi saat tab Kalender dibuka karena grid yang tersembunyi tidak punya ukuran.
function scrollYear() {
  const w = $("#yearWrap"),
    now = new Date();
  w.scrollLeft =
    S.vy === now.getFullYear() ? (w.scrollWidth * (now.getMonth() + 1)) / 12 - w.clientWidth : 0;
}

/* ===== Event ===== */
document.addEventListener("click", e => {
  const p = $("#mpick");
  if (!p.hidden && !e.target.closest("#mpick,#monthTitle")) togglePicker(false);
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "monthTitle") {
    togglePicker();
    return;
  }
  if (t.id === "pyPrev") {
    S.py--;
    renderPicker();
    return;
  }
  if (t.id === "pyNext") {
    S.py++;
    renderPicker();
    return;
  }
  if (t.dataset.pm) {
    S.vm = S.py;
    S.vmo = +t.dataset.pm;
    togglePicker(false);
    renderMonth();
    return;
  }
  if (t.id === "pmToday") {
    const n = new Date();
    S.vm = n.getFullYear();
    S.vmo = n.getMonth();
    togglePicker(false);
    renderMonth();
    return;
  }
  if (t.id === "prevM") {
    S.vmo--;
    if (S.vmo < 0) {
      S.vmo = 11;
      S.vm--;
    }
    renderMonth();
    return;
  }
  if (t.id === "nextM") {
    S.vmo++;
    if (S.vmo > 11) {
      S.vmo = 0;
      S.vm++;
    }
    renderMonth();
    return;
  }
  if (t.id === "prevY") {
    S.vy--;
    renderYear();
    return;
  }
  if (t.id === "nextY") {
    S.vy++;
    renderYear();
    return;
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("#mpick").hidden) {
    togglePicker(false);
    $("#monthTitle").focus();
  }
});

// Gambar ulang grafik saat layar berpindah antara ukuran HP dan desktop.
matchMedia("(max-width:820px)").addEventListener("change", renderMonth);
