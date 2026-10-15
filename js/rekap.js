/* Rekap bulanan bergaya "Wrapped": slide cerita dan kartu PNG untuk dibagikan. */

const WRAP_KEY = "jurnal-rasa:wrapSeen";

function wrapData(y, mo) {
  const dim = new Date(y, mo + 1, 0).getDate(),
    days = Array.from({ length: dim }, (_, i) => `${y}-${pad(mo + 1)}-${pad(i + 1)}`),
    ks = days.filter(k => S.entries[k]);
  if (ks.length < 5) return null;
  const es = ks.map(k => S.entries[k]),
    cnt = [0, 0, 0, 0, 0, 0];
  es.forEach(e => cnt[e.mood]++);
  let top = 5;
  for (let l = 5; l >= 1; l--) if (cnt[l] > cnt[top]) top = l;
  const words = es.reduce(
    (s, e) => s + ((e.note || "").trim() ? e.note.trim().split(/\s+/).length : 0),
    0
  );
  const maxM = Math.max(...es.map(e => e.mood)),
    cands = ks.filter(k => S.entries[k].mood === maxM),
    bk = cands.find(k => S.entries[k].note) || cands[0];
  const by = {};
  es.forEach(e => (e.tags || []).forEach(t => (by[t] ??= []).push(e.mood)));
  const total = es.reduce((s, e) => s + e.mood, 0);
  const imp = Object.entries(by)
    .filter(([, a]) => a.length >= 2 && a.length < es.length)
    .map(([t, a]) => {
      const sw = a.reduce((x, v) => x + v, 0);
      return { t, d: sw / a.length - (total - sw) / (es.length - a.length) };
    })
    .sort((a, b) => b.d - a.d)[0];
  const freq = Object.entries(by).sort((a, b) => b[1].length - a[1].length)[0];
  const tag =
    imp && imp.d >= 0.3 ? { t: imp.t, d: imp.d } : freq ? { t: freq[0], n: freq[1].length } : null;
  const grats = [];
  ks.forEach(k => (S.entries[k].grat || []).forEach(t => grats.push({ k, t })));
  const grat = grats.sort((a, b) => b.t.length - a.t.length)[0] || null;
  return {
    y,
    mo,
    days,
    ks,
    n: ks.length,
    cnt,
    top,
    avg: avgOf(es.map(e => e.mood)),
    words,
    best: { k: bk, e: S.entries[bk] },
    tag,
    run: longestRun(ks),
    grat,
    name: monthName(y, mo),
  };
}

function openWrap(y, mo) {
  const d = wrapData(y, mo);
  if (!d) return;
  try {
    localStorage.setItem(WRAP_KEY, `${y}-${mo}`);
  } catch (_) {}
  $("#wrapNote").hidden = true;
  const flame = `<svg class="wflame" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 5 1-1 1-3 0-9z"/></svg>`;
  const sl = [];
  sl.push({
    c: `var(--m${d.top})`,
    h: `<p class="wk">Rekap rasa</p><h3 class="wbig">${d.name}</h3><p class="wtxt">Bulan ini kamu menulis <b>${d.n} hari</b>${d.words ? ` dan <b>${d.words.toLocaleString("id-ID")} kata</b>` : ""}.</p><div class="wdots">${d.days
      .map(k => {
        const e = S.entries[k];
        return `<i${e ? ` style="background:var(--m${e.mood})"` : ""}></i>`;
      })
      .join("")}</div>`,
  });
  sl.push({
    c: `var(--m${d.top})`,
    h: `<p class="wk">Paling sering kamu merasa</p><div class="wface">${face(d.top, 150)}</div><h3 class="wbig">${MOODS[d.top].n}</h3><p class="wtxt">${d.cnt[d.top]} dari ${d.n} hari · rata-rata ${num(d.avg)}</p><div class="wdist">${[
      5, 4, 3, 2, 1,
    ]
      .filter(l => d.cnt[l])
      .map(
        l =>
          `<i style="flex:${d.cnt[l]};background:var(--m${l})" title="${MOODS[l].n}: ${d.cnt[l]}"></i>`
      )
      .join("")}</div>`,
  });
  sl.push({
    c: `var(--m${d.best.e.mood})`,
    h: `<p class="wk">Salah satu hari terbaikmu</p><div class="wface">${face(d.best.e.mood, 110)}</div><h3 class="wmid">${fmtLong(d.best.k)}</h3>${d.best.e.note ? `<blockquote class="wq">${esc(trunc(d.best.e.note, 180))}</blockquote>` : ""}`,
  });
  if (d.tag)
    sl.push({
      c: "var(--m4)",
      h:
        d.tag.d !== undefined
          ? `<p class="wk">Yang paling bikin harimu cerah</p><h3 class="wbig">${esc(d.tag.t)}</h3><p class="wtxt">Saat ada ${esc(d.tag.t)}, rasamu rata-rata <b>${num(d.tag.d)} poin lebih baik</b>.</p>`
          : `<p class="wk">Paling sering muncul</p><h3 class="wbig">${esc(d.tag.t)}</h3><p class="wtxt">Ada di <b>${d.tag.n} hari</b> bulan ini.</p>`,
    });
  if (S.set.fBadge)
    sl.push({
      c: "var(--m5)",
      h: `<p class="wk">Rekor beruntun</p>${flame}<h3 class="wbig">${d.run} hari</h3><p class="wtxt">${d.run >= 7 ? "Konsisten sekali. Hebat!" : d.run >= 3 ? "Kebiasaan baik mulai terbentuk." : "Setiap catatan tetap berarti."}</p>`,
    });
  if (d.grat)
    sl.push({
      c: "var(--m2)",
      h: `<p class="wk">Salah satu hal yang kamu syukuri</p><blockquote class="wq big">“${esc(trunc(d.grat.t, 140))}”</blockquote><p class="wtxt">${fmtLong(d.grat.k)}</p>`,
    });
  sl.push({
    c: `var(--m${d.top})`,
    h: `<p class="wk">Itu tadi</p><h3 class="wbig">${d.name}</h3><p class="wtxt">Terima kasih sudah jujur pada dirimu sendiri. Sampai jumpa di catatan berikutnya.</p><div class="wbtns"><button class="btn primary" id="wrapImg">Simpan sebagai gambar</button><button class="btn ghost" id="wrapClose">Tutup</button></div>`,
  });
  S.wrap = { d, i: 0, n: sl.length };
  const dlg = $("#dlgWrap");
  dlg.innerHTML = `<div class="wbars">${sl.map(() => `<span><i></i></span>`).join("")}</div><button class="wx" id="wrapX" aria-label="Tutup">×</button>${sl.map(x => `<section class="slide" style="--sc:${x.c}">${x.h}</section>`).join("")}<button class="wnav prev" id="wPrev" aria-label="Sebelumnya"></button><button class="wnav next" id="wNext" aria-label="Berikutnya"></button>`;
  dlg.showModal();
  goSlide(0);
}

function goSlide(i) {
  const w = S.wrap,
    dlg = $("#dlgWrap");
  if (!w || i < 0 || i >= w.n) return;
  w.i = i;
  dlg.querySelectorAll(".slide").forEach((x, j) => x.classList.toggle("on", j === i));
  dlg.querySelectorAll(".wbars span").forEach((b, j) => {
    b.className = j < i || (j === i && i === w.n - 1) ? "done" : j === i ? "run" : "";
    if (j === i)
      b.firstChild.onanimationend = () => {
        if (S.wrap?.i === i) goSlide(i + 1);
      };
  });
}

function roundRect(x, X, Y, W, H, R) {
  x.beginPath();
  if (x.roundRect) x.roundRect(X, Y, W, H, R);
  else x.rect(X, Y, W, H);
}
function drawFace(x, l, X, Y, size, M, fc) {
  x.save();
  x.translate(X, Y);
  x.scale(size / 44, size / 44);
  x.fillStyle = M[l];
  x.beginPath();
  x.arc(22, 22, 20, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = fc;
  [16, 28].forEach(cx => {
    x.beginPath();
    x.arc(cx, 18, 2.2, 0, Math.PI * 2);
    x.fill();
  });
  const p = new Path2D(MOUTHS[l]);
  x.strokeStyle = fc;
  x.lineWidth = 2.4;
  x.lineCap = "round";
  x.lineJoin = "round";
  if (l === 5) x.fill(p);
  x.stroke(p);
  x.restore();
}

// Gambar kartu rekap 1080×1350 (pas untuk Instagram) lalu unduh sebagai PNG.
async function wrapImage(d) {
  try {
    await document.fonts.ready;
  } catch (_) {}
  const W = 1080,
    H = 1350,
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  const cs = getComputedStyle(document.documentElement),
    v = n => cs.getPropertyValue(n).trim();
  const M = [null, v("--m1"), v("--m2"), v("--m3"), v("--m4"), v("--m5")],
    fg = v("--fg"),
    mu = v("--muted"),
    sf = v("--surface"),
    s2 = v("--surface-2");
  const D = "'Bricolage Grotesque', sans-serif",
    B = "Figtree, sans-serif";
  x.fillStyle = v("--bg");
  x.fillRect(0, 0, W, H);
  [
    [160, 120, M[d.top]],
    [W - 80, H - 120, M[2]],
  ].forEach(([gx, gy, col]) => {
    const g = x.createRadialGradient(gx, gy, 0, gx, gy, 850);
    g.addColorStop(0, col + "99");
    g.addColorStop(1, col + "00");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
  });
  x.fillStyle = sf;
  roundRect(x, 70, 70, W - 140, H - 140, 56);
  x.fill();
  const L = 140;
  x.fillStyle = mu;
  x.font = `700 30px ${B}`;
  x.fillText("JURNAL RASA · REKAP BULANAN", L, 180);
  x.fillStyle = fg;
  x.font = `800 92px ${D}`;
  x.fillText(d.name, L, 285, W - 2 * L);
  drawFace(x, d.top, L, 340, 210, M, v("--face"));
  x.fillStyle = mu;
  x.font = `600 34px ${B}`;
  x.fillText("Paling sering kamu merasa", L + 250, 415);
  x.fillStyle = fg;
  x.font = `800 84px ${D}`;
  x.fillText(MOODS[d.top].n, L + 250, 510);
  const bw = (W - 2 * L - 2 * 28) / 3;
  [
    [String(d.n), "hari tercatat"],
    [num(d.avg), "rata-rata rasa"],
    S.set.fBadge
      ? [String(d.run), "hari beruntun"]
      : [d.words.toLocaleString("id-ID"), "kata ditulis"],
  ].forEach(([n, l], i) => {
    const bx = L + i * (bw + 28);
    x.fillStyle = s2;
    roundRect(x, bx, 610, bw, 190, 36);
    x.fill();
    x.fillStyle = fg;
    x.font = `800 80px ${D}`;
    x.fillText(n, bx + 30, 712);
    x.fillStyle = mu;
    x.font = `500 30px ${B}`;
    x.fillText(l, bx + 30, 765);
  });
  x.fillStyle = mu;
  x.font = `700 28px ${B}`;
  x.fillText("SEBARAN RASA", L, 880);
  let bx = L;
  const tw = W - 2 * L;
  x.save();
  roundRect(x, L, 905, tw, 52, 26);
  x.clip();
  [1, 2, 3, 4, 5].forEach(l => {
    if (!d.cnt[l]) return;
    const w = (tw * d.cnt[l]) / d.n;
    x.fillStyle = M[l];
    x.fillRect(bx, 905, w, 52);
    bx += w;
  });
  x.restore();
  if (d.tag) {
    x.fillStyle = mu;
    x.font = `700 28px ${B}`;
    x.fillText(
      d.tag.d !== undefined ? "YANG PALING BIKIN HARIMU CERAH" : "PALING SERING MUNCUL",
      L,
      1045
    );
    x.fillStyle = fg;
    x.font = `800 70px ${D}`;
    x.fillText(d.tag.t, L, 1125, tw);
  }
  x.fillStyle = mu;
  x.font = `500 28px ${B}`;
  x.fillText("Dibuat dengan Jurnal Rasa", L, 1210);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = `rekap-rasa-${d.y}-${pad(d.mo + 1)}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Daftar rekap di tab Wawasan: bulan-bulan (paling lama setahun ke belakang) yang punya minimal 5 catatan.
function renderWrapList() {
  const now = new Date(),
    list = [];
  for (let i = 0; i < 12 && list.length < 6; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1),
      d = wrapData(m.getFullYear(), m.getMonth());
    if (d) list.push(d);
  }
  $("#secWrap").hidden = !list.length;
  $("#wrapList").innerHTML = list
    .map(
      d =>
        `<button class="wrapit" data-wrap="${d.y}-${d.mo}" style="--wc:var(--m${d.top})">${face(d.top, 36)}<span><b>${d.name}</b><small>${d.n} hari · rata-rata ${num(d.avg)}${d.y === now.getFullYear() && d.mo === now.getMonth() ? " · masih berjalan" : ""}</small></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>`
    )
    .join("");
}

// Di 7 hari pertama tiap bulan, tawarkan rekap bulan lalu (sekali saja).
function checkWrapNote() {
  const now = new Date();
  if (now.getDate() > 7) return;
  const p = new Date(now.getFullYear(), now.getMonth() - 1, 1),
    y = p.getFullYear(),
    mo = p.getMonth();
  let seen = "";
  try {
    seen = localStorage.getItem(WRAP_KEY) || "";
  } catch (_) {}
  if (seen === `${y}-${mo}` || !wrapData(y, mo)) return;
  const el = $("#wrapNote");
  el.hidden = false;
  el.innerHTML = `<span class="hi" style="--hc:var(--m5)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg></span><div><b>Rekap ${monthName(y, mo)} sudah siap!</b><span class="muted small">Lihat perjalanan rasamu sebulan kemarin.</span></div><button class="btn primary sm" data-wrap="${y}-${mo}">Lihat rekap</button>`;
}

document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.wrap) {
    const [y, m] = t.dataset.wrap.split("-").map(Number);
    openWrap(y, m);
    return;
  }
  if (t.id === "wPrev") {
    goSlide(S.wrap.i - 1);
    return;
  }
  if (t.id === "wNext") {
    goSlide(S.wrap.i + 1);
    return;
  }
  if (t.id === "wrapImg") {
    wrapImage(S.wrap.d);
    return;
  }
  if (t.id === "wrapClose" || t.id === "wrapX") {
    $("#dlgWrap").close();
    return;
  }
});
document.addEventListener("keydown", e => {
  if (!$("#dlgWrap").open) return;
  if (e.key === "ArrowRight") goSlide(S.wrap.i + 1);
  if (e.key === "ArrowLeft") goSlide(S.wrap.i - 1);
});
$("#dlgWrap").addEventListener("close", () => {
  S.wrap = null;
});
