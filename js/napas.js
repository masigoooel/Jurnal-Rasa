/* Napas tenang: latihan napas 1 menit (tarik 4 detik, tahan 2, hembuskan 6). */

let breathT = [];
function clearBreath() {
  breathT.forEach(x => {
    clearTimeout(x);
    clearInterval(x);
  });
  breathT = [];
}
function startBreath() {
  $("#dlgBreath").showModal();
  runBreath();
}
function runBreath() {
  clearBreath();
  const c = $("#bcircle"),
    txt = $("#btext"),
    cnt = $("#bcount"),
    total = 60000,
    t0 = performance.now();
  const P = [
    ["Tarik napas", 4000, 1],
    ["Tahan", 2000, 1],
    ["Hembuskan pelan-pelan", 6000, 0.5],
  ];
  $("#bdone").hidden = true;
  $("#bmain").hidden = false;
  c.style.transitionDuration = "0ms";
  c.style.transform = "scale(.5)";
  const phase = i => {
    const [label, ms, sc] = P[i % 3];
    txt.textContent = label;
    c.style.transitionDuration = ms + "ms";
    c.style.transform = `scale(${sc})`;
    const last = i % 3 === 2 && performance.now() - t0 + ms >= total - 100;
    breathT.push(setTimeout(last ? doneBreath : () => phase(i + 1), ms));
  };
  breathT.push(setTimeout(() => phase(0), 400));
  const tick = () =>
    (cnt.textContent = `${Math.max(0, Math.ceil((total - (performance.now() - t0)) / 1000))} detik`);
  tick();
  breathT.push(setInterval(tick, 250));
}
function doneBreath() {
  clearBreath();
  $("#bmain").hidden = true;
  $("#bdone").hidden = false;
  addBadge("calm");
}

document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "breathOpen") {
    startBreath();
    return;
  }
  if (t.id === "breathAgain") {
    runBreath();
    return;
  }
});
$("#dlgBreath").addEventListener("close", clearBreath);
