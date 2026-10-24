<div align="center">

# Jurnal Rasa

**Catat rasamu, kenali polanya.**

Jurnal mood harian buat kamu yang pengen lebih kenal sama perasaan sendiri.
Privat, bisa dipakai offline, dan nggak perlu bikin akun.

</div>

![Jurnal Rasa di laptop: kalender bertema Herbarium di halaman kiri, grafik dan ringkasan setahun di halaman kanan](docs/screenshots/desktop-kalender.png)

<table>
  <tr>
    <td align="center" width="25%"><img src="docs/screenshots/tulis.png" alt="Menulis catatan harian"><br><sub><b>Tulis</b><br>Pilih rasa, lalu ceritakan harimu</sub></td>
    <td align="center" width="25%"><img src="docs/screenshots/kalender.png" alt="Kalender rasa bertema Herbarium, rasa jadi daun"><br><sub><b>Kalender</b><br>Sebulan rasamu dalam satu halaman</sub></td>
    <td align="center" width="25%"><img src="docs/screenshots/hias.png" alt="Menghias halaman bulan dengan pakis, selotip, bulan, dan tulisan"><br><sub><b>Hias</b><br>Tempel stiker di mana saja</sub></td>
    <td align="center" width="25%"><img src="docs/screenshots/rekap.png" alt="Rekap bulanan bergaya Wrapped"><br><sub><b>Rekap</b><br>Cerita singkat tiap bulan</sub></td>
  </tr>
</table>

<details>
<summary><b>Halaman tulis di laptop</b></summary>

![Halaman tulis di laptop: menulis catatan di halaman kiri, ringkasan minggu ini dan refleksi mingguan di halaman kanan](docs/screenshots/desktop.png)

</details>

## Kenapa Jurnal Rasa

- **Privat sepenuhnya.** Semua catatan disimpan di perangkatmu sendiri. Tidak ada server, tidak ada akun, tidak ada yang ikut membaca.
- **Ringan dan cepat.** Cuma HTML, CSS, dan JavaScript. Bisa dipasang di HP seperti aplikasi biasa dan tetap jalan tanpa internet.
- **Lembut, bukan menuntut.** Tidak ada target menulis yang bikin merasa bersalah. Saat beberapa hari terasa berat, aplikasinya menawarkan latihan napas dan kontak bantuan.
- **Terasa seperti buku.** Di laptop, setiap tab terbuka sebagai dua halaman buku dengan pita pembatas. Di HP, kertasnya penuh layar dan kolom tulisnya bergaris.
- **Nyaman di mata.** Palet Lumut & Pasir yang redup dan tidak silau, mode gelap, pilihan huruf lebih besar, dan opsi mengurangi animasi.

## Fitur

### Menulis
- Pilih rasa dari **Berat** sampai **Senang**, lalu kata perasaan yang lebih tepat seperti cemas, lega, atau bangga
- Pertanyaan pemantik yang menyesuaikan rasa, atau pilih tema: diri sendiri, hubungan, kerja, masa depan, syukur
- Mode menulis fokus layar penuh, dan bicara jadi tulisan lewat mikrofon
- Isi cepat yang boleh dilewati: label, energi, jam tidur, tiga hal yang disyukuri, kebiasaan, cuaca, coretan tangan, dan satu foto
- Di hari yang berat, halaman tulis dibuat lebih sederhana
- Niat harian, refleksi mingguan, dan kilas balik catatan seminggu, sebulan, atau setahun lalu
- Draf tersimpan otomatis, dan hapus catatan bisa diurungkan

### Kalender yang bisa dihias
- Kalender rasa, grafik naik turun bulanan, dan ringkasan setahun
- **8 template halaman** yang senada tema, dari Bulatan dan Buku bergaris sampai Herbarium, Embun pagi, Teh sore, dan Malam tenang. Di sebagian template, tanda rasa berubah jadi daun, tetes embun, kerikil, cangkir, cap, atau bulan
- Stiker dan hiasan Alam, Langit, Meja, dan Kata-kata. Bisa ditempel di tanggal atau di mana saja di halaman, lalu digeser, diputar, diubah ukurannya, atau ditaruh di balik tanggal
- Bikin stiker sendiri dari emoji atau tulisan pendek
- Simpan halaman bulan sebagai gambar PNG, atau satu **buku tahunan**: sampul, rekap setahun dan empat musim, lalu semua halaman bulan dalam satu gambar

### Wawasan
- Apa yang membuat harimu lebih baik, dilihat dari label, kebiasaan, tidur, dan energi
- Perasaan yang paling sering muncul tiap bulan, dan rasa per hari dalam seminggu
- **Rekap bulanan bergaya Wrapped** yang bisa disimpan sebagai gambar, dan rekap musim (tiga bulan terakhir)

### Koleksi
- Dinding syukur, daftar refleksi mingguan, buku stiker, kapsul waktu (surat untuk dirimu beberapa bulan lagi), dan lencana

### Privasi dan kenyamanan
- Kunci PIN, dan pilihan menyembunyikan isi catatan sampai disentuh
- Backup ke satu file dan pulihkan kapan saja
- Pengingat harian, tema terang dan gelap, huruf lebih besar, kurangi animasi, pilihan sampul buku, dan suara kertas (mati secara bawaan)
- Semua fitur pilihan (niat, kata perasaan, energi, kebiasaan, cuaca, coretan, foto, kenangan, rekap musim, refleksi, kapsul waktu, lencana) diatur di satu tempat: Pengaturan > Fitur yang ditampilkan
- Panduan singkat tiga halaman untuk pengguna baru, bisa dibuka lagi dari Pengaturan

## Mencoba

Tidak perlu install apa pun. Klik dua kali `index.html`, dan aplikasinya langsung terbuka di browser.

Supaya bisa dipasang di HP dan dipakai offline, aplikasinya perlu dibuka dari alamat web (https), misalnya lewat GitHub Pages atau Netlify. Setelah itu:

- **Android (Chrome):** buka Pengaturan, lalu Pasang di HP, atau lewat menu ⋮, lalu Instal aplikasi
- **iPhone (Safari):** tombol Bagikan, lalu Tambahkan ke Layar Utama

<details>
<summary><b>Coba di HP lewat Wi-Fi yang sama</b></summary>

1. Di folder proyek, jalankan `python -m http.server 8765 --bind 0.0.0.0`
2. Di HP yang terhubung ke Wi-Fi yang sama, buka `http://<IP-laptop>:8765`
3. Kalau tidak terbuka, izinkan Python di Windows Firewall untuk jaringan privat

Cara ini cukup untuk mencoba, tapi aplikasinya belum bisa dipasang atau dipakai offline karena belum https.

</details>

## Dibuat dengan

- **HTML, CSS, dan JavaScript murni.** Tanpa framework, tanpa proses build, tanpa dependensi.
- **Progressive Web App:** service worker untuk mode offline, dan manifest supaya bisa dipasang.
- **Canvas API** untuk menyimpan halaman kalender, rekap, dan buku tahunan sebagai gambar, serta untuk coretan tangan.
- **Web Speech API** untuk bicara jadi tulisan, dan **Web Audio API** untuk suara kertas yang dibuat langsung tanpa file suara.
- **localStorage** untuk menyimpan semua data di perangkat.

<details>
<summary><b>Struktur proyek</b></summary>

| File | Isi |
|---|---|
| `index.html` | Struktur halaman dan dialog |
| `manifest.webmanifest` | Nama, ikon, dan warna aplikasi saat dipasang di HP |
| `sw.js` | Service worker untuk mode offline. Kalau menambah file baru, tambahkan ke `CORE` dan naikkan versi `CACHE` |
| `icons/` | Ikon aplikasi dan logo Rembulan (`logo.svg`) |
| `docs/screenshots/` | Gambar untuk README ini |
| `css/dasar.css` | Reset, warna tema terang dan gelap, huruf, komponen kecil |
| `css/tata-letak.css` | Header, banner, grid, panel, tab, dan penyesuaian HP |
| `css/editor.css` | Halaman menulis |
| `css/kalender.css` | Kalender, grafik, setahun rasa, menu halaman |
| `css/wawasan.css` | Wawasan dan daftar rekap |
| `css/catatan.css` | Daftar catatan, cari dan saring, cetak |
| `css/hidup.css` | Latar, gradasi rasa, animasi kecil |
| `css/koleksi.css` | Dinding syukur, refleksi, kapsul waktu, lencana |
| `css/dialog.css` | Semua dialog, termasuk pengaturan |
| `css/stiker.css` | Stiker di tanggal, laci stiker, buku stiker |
| `css/template.css` | Template halaman bulan dan layar hias |
| `css/tenang.css` | Tampilan "buku terbuka": dua halaman di desktop, pita pembatas, kertas penuh layar di HP, logo, kalender bulatan |
| `css/cetak.css` | Tampilan saat dicetak atau disimpan ke PDF |
| `js/inti.js` | Konstanta, helper, state, dan penyimpanan bersama |
| `js/editor.js` | Menulis catatan, isi cepat, draf otomatis |
| `js/menulis.js` | Mode fokus, bicara jadi tulisan, tema pertanyaan |
| `js/refleksi.js` | Niat harian dan refleksi mingguan |
| `js/dukungan.js` | Kartu dukungan dan kontak bantuan (`HELP_LINES`) |
| `js/kalender.js` | Kalender, pemilih bulan, grafik, setahun rasa |
| `js/wawasan.js` | Faktor yang memengaruhi rasa dan rasa per hari |
| `js/rekap.js` | Rekap bulanan bergaya Wrapped |
| `js/catatan.js` | Cari, saring, daftar catatan, cetak |
| `js/koleksi.js` | Dinding syukur, kapsul waktu, lencana |
| `js/stiker.js` | Stiker bawaan, stiker buatan sendiri, mode tempel |
| `js/hiasan.js` | Mesin template berbentuk (`CUTE_TPL`, `SHAPES`), stiker dan hiasan Alam, Langit, Meja, Kata-kata, template Herbarium, Embun pagi, Taman batu, Teh sore, Kertas kraft, Malam tenang, dan `muatLama` |
| `js/lama.js` | Stiker dan hiasan versi lama (hewan, makanan, selotip warna-warni). Tidak dimuat di awal; hanya dimuat kalau masih ada yang tertempel |
| `js/hias.js` | Template, mode hias, dan simpan halaman sebagai PNG |
| `js/napas.js` | Latihan napas |
| `js/pengaturan.js` | Tema, backup, pengingat, PIN, pilihan tampilan, dan daftar fitur pilihan (`FEATS`) |
| `js/sambutan.js` | Panduan tiga halaman untuk pengguna baru |
| `js/fitur.js` | Cuaca, coretan tangan, mode hari yang berat, rekap musim, sampul buku, pembatas terakhir dibaca, suara kertas (Web Audio), buku tahunan |
| `js/main.js` | Tab, susunan dua halaman buku di desktop (`SPREADS`, `layoutBook`), dan urutan saat aplikasi dibuka (dimuat paling akhir) |

File JS dan CSS dimuat berurutan seperti di `index.html`, tanpa build. Kalau mengubah bentuk tanda rasa di `css/template.css`, ubah juga `drawCell` di `js/hias.js` supaya gambar PNG tetap sama dengan tampilan.

Kode dirapikan dengan [Prettier](https://prettier.io):

```
npx prettier --write index.html "css/*.css" "js/*.js"
```

</details>

<details>
<summary><b>Data dan privasi</b></summary>

Semua data disimpan di `localStorage` browser, jadi hanya ada di browser dan perangkat itu. Catatan di laptop tidak otomatis pindah ke HP. Untuk memindahkannya, unduh backup di laptop lalu pulihkan di HP lewat Pengaturan.

| Kunci | Isi |
|---|---|
| `jurnal-rasa:entries` | Catatan per tanggal, termasuk kata perasaan, cuaca, coretan, foto, syukur, dan kebiasaan |
| `jurnal-rasa:intents` | Niat harian dan hasilnya |
| `jurnal-rasa:reflections` | Refleksi mingguan |
| `jurnal-rasa:stickers` | Stiker per tanggal dan stiker buatan sendiri |
| `jurnal-rasa:calpages` | Template, judul, dan hiasan tiap bulan |
| `jurnal-rasa:draft` | Draf yang belum disimpan |
| `jurnal-rasa:tags`, `jurnal-rasa:habits` | Daftar label dan kebiasaan |
| `jurnal-rasa:capsules`, `jurnal-rasa:badges` | Kapsul waktu dan lencana |
| `jurnal-rasa:settings` | Pengaturan, PIN (disimpan sebagai hash), dan kontak yang dipercaya |
| `jurnal-rasa:theme`, `jurnal-rasa:ptheme` | Tema tampilan dan tema pertanyaan |
| `jurnal-rasa:cover`, `jurnal-rasa:lastread` | Sampul buku yang dipilih dan pembatas catatan terakhir dibaca |

**Batasan:**
- Kapasitas `localStorage` sekitar 5 MB. Foto dikecilkan sampai 30–60 KB, jadi muat kira-kira 80–150 foto. Coretan tangan juga disimpan sebagai gambar dan ikut memakai tempat.
- Kunci PIN dan kapsul waktu hanya mengunci tampilan. Isinya tidak dienkripsi.
- Pengingat hanya muncul selama aplikasi terbuka.
- Setelah aplikasi diperbarui, versi barunya baru terlihat saat aplikasi dibuka untuk kedua kalinya.

</details>

## Catatan penting

Jurnal Rasa adalah alat bantu untuk mengenali perasaan, **bukan pengganti bantuan profesional**. Kalau kamu sedang merasa sangat berat atau berpikir untuk menyakiti diri sendiri, hubungi **112** atau layanan kesehatan jiwa Kemenkes di **119 ext 8**. Kamu tidak harus menghadapinya sendirian.

---

<div align="center">
<sub>Dibuat oleh <a href="https://github.com/masigoooel">masigoooel</a></sub>
</div>
