/* Service worker: menyimpan file aplikasi di perangkat supaya Jurnal Rasa tetap bisa dibuka tanpa internet.
   Catatanmu tidak lewat sini; catatan tetap di localStorage browser.
   Kalau menambah file CSS/JS baru, tambahkan juga ke CORE di bawah, lalu naikkan nomor versi CACHE. */

const CACHE = "jurnal-rasa-v23";
const CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/catatan.css",
  "css/cetak.css",
  "css/dasar.css",
  "css/dialog.css",
  "css/editor.css",
  "css/hidup.css",
  "css/kalender.css",
  "css/koleksi.css",
  "css/stiker.css",
  "css/tata-letak.css",
  "css/template.css",
  "css/tenang.css",
  "css/wawasan.css",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/logo.svg",
  "js/catatan.js",
  "js/dukungan.js",
  "js/editor.js",
  "js/hiasan.js",
  "js/lama.js",
  "js/hias.js",
  "js/inti.js",
  "js/kalender.js",
  "js/koleksi.js",
  "js/fitur.js",
  "js/main.js",
  "js/menulis.js",
  "js/napas.js",
  "js/pengaturan.js",
  "js/refleksi.js",
  "js/rekap.js",
  "js/sambutan.js",
  "js/stiker.js",
  "js/wawasan.js",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

// Hapus cache versi lama.
self.addEventListener("activate", e => {
  e.waitUntil(
    caches
      .keys()
      .then(ks =>
        Promise.all(
          ks.filter(k => k.startsWith("jurnal-rasa-") && k !== CACHE).map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Ambil dari jaringan dulu supaya perubahan terbaru langsung terpakai, lalu simpan salinannya ke cache.
// Kalau sedang offline (atau jaringan gagal), pakai salinan dari cache.
// Dulu cache-first: setelah pembaruan, file lama dan baru bisa tercampur sehingga tab tidak bisa berpindah.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url),
    font = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !font) return;
  e.respondWith(
    caches.open(CACHE).then(c =>
      fetch(req)
        .then(res => {
          if (res.ok || res.type === "opaque") c.put(req, res.clone());
          return res;
        })
        .catch(async () => {
          const hit =
            (await c.match(req, { ignoreSearch: true })) ||
            (req.mode === "navigate" ? await c.match("./") : undefined);
          return hit || Response.error();
        })
    )
  );
});
