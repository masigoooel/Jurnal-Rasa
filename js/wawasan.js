/* Wawasan: satu daftar "apa yang membuat harimu lebih baik" (label, kebiasaan, tidur, energi) dan rasa per hari. */

// Tiap faktor membandingkan rata-rata rasa di hari yang "ada" dengan hari yang "tidak ada",
// hanya di antara hari yang bisa dinilai (misalnya jam tidur hanya dihitung di hari yang diisi jam tidurnya).
function factorRows(pairs, min) {
  const firstHab = pairs
    .map(p => p[0])
    .sort()
    .find(k => S.entries[k].habits?.length);
  const F = [];
  new Set(pairs.flatMap(([, e]) => e.tags || [])).forEach(t =>
    F.push({ n: t, type: "Label", app: () => true, has: e => (e.tags || []).includes(t) })
  );
  if (firstHab)
    new Set([...S.habits, ...pairs.flatMap(([, e]) => e.habits || [])]).forEach(h =>
      F.push({
        n: h,
        type: "Kebiasaan",
        app: k => k >= firstHab,
        has: e => (e.habits || []).includes(h),
      })
    );
  const slept = (k, e) => typeof e.sleep === "number";
  F.push({ n: "Tidur kurang dari 6 jam", type: "Tidur", app: slept, has: e => e.sleep < 6 });
  F.push({ n: "Tidur 8 jam atau lebih", type: "Tidur", app: slept, has: e => e.sleep >= 8 });
  F.push({
    n: "Energi tinggi (segar/penuh)",
    type: "Energi",
    app: (k, e) => !!e.energy,
    has: e => e.energy >= 4,
  });
  return F.map(f => {
    const ap = pairs.filter(([k, e]) => f.app(k, e)),
      yes = ap.filter(([, e]) => f.has(e)).map(([, e]) => e.mood),
      no = ap.filter(([, e]) => !f.has(e)).map(([, e]) => e.mood);
    return yes.length >= min && no.length >= min
      ? { n: f.n, type: f.type, c: yes.length, d: avgOf(yes) - avgOf(no) }
      : null;
  })
    .filter(r => r && Math.abs(r.d) >= 0.15)
    .sort((a, b) => b.d - a.d);
}

function renderFactors() {
  const month = S.facMode !== "all",
    cur = todayKey().slice(0, 7);
  document
    .querySelectorAll("#facSeg [data-fac]")
    .forEach(b => b.setAttribute("aria-pressed", (b.dataset.fac === "month") === month));
  const pairs = Object.entries(S.entries).filter(([k]) => !month || k.startsWith(cur)),
    el = $("#factors"),
    need = month ? 5 : 7;
  if (pairs.length < need) {
    el.innerHTML = emptyBox(
      month
        ? `Bulan ini baru ${pairs.length} catatan. Butuh minimal ${need}, atau lihat “Semua waktu”.`
        : `Butuh minimal ${need} catatan. Sekarang baru ${pairs.length}.`
    );
  } else {
    const rows = factorRows(pairs, month ? 2 : 3);
    if (!rows.length)
      el.innerHTML = emptyBox(
        "Belum terlihat pengaruh yang jelas. Terus beri label dan isi bagian Isi cepat, polanya akan muncul."
      );
    else {
      const pos = rows.filter(r => r.d > 0).slice(0, 5),
        neg = rows.filter(r => r.d < 0).slice(-5),
        show = [...pos, ...neg],
        max = Math.max(1, ...show.map(r => Math.abs(r.d)));
      let lead = "";
      if (pos[0])
        lead += `Saat <b>${esc(pos[0].n.toLowerCase())}</b>, rasamu rata-rata <b>${num(pos[0].d)} poin lebih baik</b>. `;
      if (neg.length) {
        const n = neg[neg.length - 1];
        lead += `Saat <b>${esc(n.n.toLowerCase())}</b>, rata-rata <b>${num(-n.d)} poin lebih berat</b>.`;
      }
      el.innerHTML =
        `<p class="lead">${lead}</p><div class="imps">` +
        show
          .map(
            r => `<div class="imp"><span class="it">${esc(r.n)}<small><span class="ftype">${r.type}</span> ${r.c} hari</small></span>
        <div class="ibar"><i class="${r.d > 0 ? "pos" : "neg"}" style="width:${((Math.abs(r.d) / max) * 50).toFixed(1)}%"></i></div>
        <b class="tnum ${r.d > 0 ? "up" : "down"}">${r.d > 0 ? "+" : "−"}${num(Math.abs(r.d))}</b></div>`
          )
          .join("") +
        `</div>`;
    }
  }
  renderHabitDone();
}

// Seberapa rutin tiap kebiasaan bulan ini (dihitung dari hari yang tercatat), ditambah ringkasan niat harian.
function renderHabitDone() {
  const cur = todayKey().slice(0, 7),
    ks = Object.keys(S.entries).filter(k => k.startsWith(cur)),
    el = $("#habDone");
  const names = [...new Set([...S.habits, ...ks.flatMap(k => S.entries[k].habits || [])])];
  if (!ks.some(k => S.entries[k].habits?.length)) {
    el.innerHTML = intentStat();
    return;
  }
  el.innerHTML = `${intentStat()}<p class="label">Kebiasaan bulan ini</p><div class="hrows">${names
    .map(n => {
      const done = ks.filter(k => (S.entries[k].habits || []).includes(n)).length;
      return `<div class="hrow"><span class="it">${esc(n)}</span><div class="hprog"><i style="width:${(done / ks.length) * 100}%"></i></div><b class="tnum">${done}/${ks.length}</b></div>`;
    })
    .join("")}</div>`;
}

// Kata perasaan yang paling sering dipilih bulan ini, warnanya dari rata-rata rasa saat kata itu muncul.
function renderEmotions() {
  const cur = todayKey().slice(0, 7),
    es = Object.entries(S.entries).filter(([k, e]) => k.startsWith(cur) && e.emo?.length),
    c = {};
  es.forEach(([, e]) =>
    e.emo.forEach(x => {
      (c[x] = c[x] || { n: 0, moods: [], tags: {} }).n++;
      c[x].moods.push(e.mood);
      (e.tags || []).forEach(t => (c[x].tags[t] = (c[x].tags[t] || 0) + 1));
    })
  );
  const rows = Object.entries(c)
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, 6);
  if (!rows.length) {
    $("#emoSum").textContent =
      "Setelah memilih wajah, pilih kata yang paling pas (misalnya cemas, lega, bangga). Polanya muncul di sini.";
    $("#emoList").innerHTML = "";
    return;
  }
  const [top, info] = rows[0],
    tag = Object.entries(info.tags).sort((a, b) => b[1] - a[1])[0];
  $("#emoSum").innerHTML =
    `Paling sering kamu merasa <b>${esc(top.toLowerCase())}</b> (${info.n}×).` +
    (tag && tag[1] >= 2 ? ` Biasanya muncul bersama label <b>${esc(tag[0])}</b>.` : "");
  const max = rows[0][1].n;
  $("#emoList").innerHTML = `<div class="hrows">${rows
    .map(
      ([x, v]) =>
        `<div class="hrow"><span class="it">${esc(x)}</span><div class="hprog"><i style="width:${(v.n / max) * 100}%;background:var(--m${Math.round(avgOf(v.moods))})"></i></div><b class="tnum">${v.n}×</b></div>`
    )
    .join("")}</div>`;
}

function renderWeek() {
  const es = Object.entries(S.entries),
    el = $("#week"),
    sum = $("#wkSum");
  if (es.length < 7) {
    sum.textContent = "Rata-rata rasa untuk tiap hari dalam seminggu.";
    el.innerHTML = emptyBox(`Butuh minimal 7 catatan. Sekarang baru ${es.length}.`);
    return;
  }
  const b = Array.from({ length: 7 }, () => []);
  es.forEach(([k, e]) => b[(fromKey(k).getDay() + 6) % 7].push(e.mood));
  const av = b.map(a => (a.length ? avgOf(a) : 0));
  const ok = av.map((v, i) => i).filter(i => b[i].length >= 2);
  if (ok.length >= 2) {
    const best = ok.reduce((x, i) => (av[i] > av[x] ? i : x)),
      worst = ok.reduce((x, i) => (av[i] < av[x] ? i : x));
    sum.innerHTML =
      av[best] - av[worst] >= 0.3
        ? `Hari terbaikmu biasanya <b>${DAYS[best]}</b> (${num(av[best])}). Yang paling berat <b>${DAYS[worst]}</b> (${num(av[worst])}).`
        : "Rasamu cukup merata sepanjang minggu.";
  } else sum.textContent = "Rata-rata rasa untuk tiap hari dalam seminggu.";
  el.innerHTML = av
    .map(
      (v, i) => `<div class="wd" title="${DAYS[i]}: ${b[i].length} catatan">
    <span class="tnum val">${v ? num(v) : "–"}</span>
    <div class="wbar"><i style="height:${v ? Math.max(8, ((v - 1) / 4) * 100) : 0}%;background:var(--m${Math.round(v) || 3})"></i></div>
    <span class="wn">${DAYS[i].slice(0, 3)}</span><small class="tnum">${b[i].length}×</small></div>`
    )
    .join("");
}

document.addEventListener("click", e => {
  const t = e.target.closest("button[data-fac]");
  if (!t) return;
  S.facMode = t.dataset.fac;
  renderFactors();
});
