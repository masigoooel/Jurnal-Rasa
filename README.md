# Jurnal Rasa

Jurnal mood harian berbasis web. Catat perasaan setiap hari, beri label, tulis cerita singkat,
lalu lihat kalender rasa, grafik bulanan, dan pola hari baik maupun hari berat.

## Fitur

**Tulis**
- Pilih rasa (Berat sampai Senang), lalu kata perasaan yang lebih tepat (misalnya cemas, lega, bangga; maksimal 3)
- Label buatan sendiri, serta pertanyaan pemantik yang menyesuaikan rasa atau tema pilihan (diri sendiri, hubungan, kerja & belajar, masa depan, syukur)
- Mode menulis fokus: layar penuh dengan penghitung kata, untuk menulis panjang
- Bicara jadi tulisan (tombol mikrofon), kalau browser mendukung. Di Chrome suaranya diproses server Google, jadi butuh internet
- Niat harian: pasang niat di pagi hari (atau untuk besok kalau sudah malam), lalu malamnya cek apakah tercapai
- "Isi cepat" (boleh dilewati, terbuka satu per satu): label, energi dan jam tidur, tiga hal yang disyukuri, kebiasaan harian, dan satu foto
- Draf tersimpan otomatis; ada konfirmasi kalau pindah tanggal sebelum menyimpan
- Hapus catatan bisa diurungkan, dan ada tawaran mengisi hari kemarin yang terlewat
- Latihan napas 1 menit, ditawarkan saat memilih rasa Berat atau Kurang
- Kata penyemangat yang lembut setelah menyimpan hari yang berat
- Kartu dukungan kalau 3 hari berturut-turut (atau 4 dari 7 hari) terasa berat, berisi ajakan napas dan kontak bantuan: orang yang kamu percaya, layanan darurat 112, dan layanan kesehatan jiwa Kemenkes
- Refleksi mingguan: 3 pertanyaan singkat yang ditawarkan Sabtu–Senin. Jawaban "minggu depan mau mencoba" muncul lagi di minggu berikutnya
- Kilas balik: catatan seminggu, sebulan, dan setahun lalu

**Kalender**
- Kalender heatmap (klik judul bulan untuk lompat ke bulan mana saja, sampai 12 bulan ke depan), grafik naik turun, dan rekap setahun
- Stiker: 24 stiker bawaan, 20 stiker hewan lucu (kucing, kelinci, panda, katak, unicorn, dan lain-lain), plus stiker buatan sendiri (emoji atau tulisan pendek, 9 pilihan warna). Maksimal 3 per tanggal, ditempel lewat tombol di samping judul catatan atau lewat mode tempel di kalender, yang juga bisa dipakai untuk tanggal yang akan datang sebagai penanda acara
- Halaman bulan yang bisa dihias:
  - 13 template: Klasik, Buku tulis, Scrapbook (foto jadi isi kotak), Bullet journal, Langit malam (rasa jadi bintang), Musim (hiasan berganti tiap bulan), Teman hewan (tiga hewan lucu mengintip, berganti tiap bulan), serta template lucu yang mengubah tanda rasa jadi bentuk: Toko permen (permen), Penuh cinta (hati), Kebun bunga (bunga), Jejak kaki (jejak kucing), Bawah laut (gelembung), dan Awan kapas (awan). Tiap bulan boleh beda template, dan ada pilihan template bawaan
  - Judul bulan yang ditulis sendiri
  - Mode hias (khusus hiasan halaman; stiker rasa dan stiker buatanmu ditempel per tanggal): 30 dekorasi, 28 hewan lucu, 10 makanan, dan 18 stiker lucu & kata-kata (Yay!, Semangat!, dan lain-lain). Hiasan baru otomatis ditaruh di tempat yang masih kosong. Semua stiker ini juga bisa ditempel di tanggal (selotip washi, bunga, sakura, jamur, kaktus, es krim, boba, balon, planet, balon kata, coretan, dan lain-lain) di mana saja, lalu geser, putar, ubah ukuran, taruh di atas atau di balik tanggal, atur ke depan atau ke belakang, gandakan, atau hapus (bisa juga dengan panah keyboard dan tombol Delete)
  - Simpan halaman bulan sebagai gambar PNG

**Wawasan**
- "Apa yang membuat harimu lebih baik": satu daftar dari label, kebiasaan, tidur, dan energi (bulan ini atau semua waktu), plus kebiasaan bulan ini
- Perasaan bulan ini: kata perasaan yang paling sering muncul dan label yang biasanya menyertainya
- Rekap bulanan bergaya "Wrapped" untuk bulan-bulan yang punya minimal 5 catatan, bisa disimpan sebagai gambar PNG
- Ringkasan niat harian yang tercapai bulan ini
- Rasa per hari dalam seminggu

**Koleksi**
- Dinding syukur (dengan navigasi bulan sendiri), daftar refleksi mingguan, buku stiker (acara yang akan datang dan stiker yang paling sering dipakai), kapsul waktu (surat untuk dirimu 3, 6, atau 12 bulan lagi), dan 13 lencana

**Catatan**
- Cari dan saring semua catatan
- Cetak atau simpan sebagai PDF per bulan

**Pengaturan** (ikon gerigi)
- Backup: unduh semua data sebagai file JSON, lalu pulihkan (gabungkan atau ganti semua)
- Kapasitas penyimpanan yang terpakai
- Fitur yang ditampilkan: niat harian, kebiasaan, kapsul waktu, serta lencana & hari beruntun (mati sejak awal) bisa dinyalakan atau dimatikan. Yang dimatikan hanya disembunyikan, datanya tetap ada
- Huruf lebih besar, dan kurangi animasi (tanpa konfeti, gerakan, dan getar) untuk tampilan yang lebih tenang
- Pengingat harian, kunci PIN, pilihan menyembunyikan isi catatan, panduan untuk pengguna baru, serta bantuan & dukungan
- Tema terang atau gelap (ikon di sebelah gerigi)

## Cara menjalankan

Klik dua kali `index.html`, maka halaman terbuka di browser. Tidak perlu install apa pun.

Opsional, kalau memakai VS Code: install ekstensi **Live Server**, klik kanan `index.html`,
lalu pilih **Open with Live Server** supaya halaman otomatis refresh saat file diubah.

## Membuka di HP

Jurnal Rasa adalah PWA: setelah dibuka dari alamat web (https), aplikasi bisa dipasang ke layar utama HP
dan tetap bisa dibuka tanpa internet.

**Coba cepat lewat Wi-Fi yang sama** (tanpa pasang, tanpa offline):
1. Di folder ini jalankan `python -m http.server 8765 --bind 0.0.0.0`
2. Di HP (terhubung ke Wi-Fi yang sama) buka `http://<IP-laptop>:8765`, misalnya `http://192.168.1.2:8765`
3. Kalau tidak terbuka, izinkan Python di Windows Firewall untuk jaringan privat

**Online permanen (gratis), misalnya dengan Netlify Drop:**
1. Buka https://app.netlify.com/drop lalu masuk atau daftar akun
2. Seret folder `jurnal-rasa` ke halaman itu, dan alamatnya langsung jadi (misalnya `nama-acak.netlify.app`)
3. Buka alamat itu di HP:
   - **Android (Chrome):** Pengaturan, lalu Pasang di HP, atau menu ⋮, lalu Instal aplikasi
   - **iPhone (Safari):** tombol Bagikan, lalu Tambahkan ke Layar Utama
4. Setiap kali kode diubah, seret ulang foldernya ke situs yang sama (menu Deploys di Netlify)

Yang online hanya kode aplikasinya. Catatan tetap tersimpan di masing-masing perangkat dan tidak dikirim ke server.
Catatan di laptop **tidak otomatis pindah** ke HP. Untuk memindahkan, unduh backup di laptop,
kirim filenya ke HP, lalu buka Pengaturan, Pulihkan di HP.

## Struktur file

| File | Isi |
|---|---|
| `index.html` | Struktur halaman dan dialog |
| `manifest.webmanifest` | Nama, ikon, dan warna aplikasi saat dipasang di HP |
| `sw.js` | Service worker: menyimpan file aplikasi supaya bisa dibuka offline. Kalau menambah file baru, tambahkan ke `CORE` dan naikkan versi `CACHE` |
| `icons/` | Ikon aplikasi (192, 512, maskable, Apple, favicon) |
| `css/dasar.css` | Reset, warna tema (terang/gelap), huruf, dan komponen kecil (tombol, toast, kotak kosong) |
| `css/tata-letak.css` | Header, banner, grid dua kolom, panel, tab kanan (desktop) dan tab bawah (HP) |
| `css/editor.css` | Wajah rasa, kata perasaan, label, pertanyaan pemantik, isi cepat, kebiasaan, foto, kartu dukungan, niat, refleksi |
| `css/kalender.css` | Navigasi dan pemilih bulan, kalender, grafik, setahun rasa |
| `css/wawasan.css` | Faktor yang memengaruhi rasa, kebiasaan bulan ini, perasaan bulan ini, rasa per hari |
| `css/catatan.css` | Daftar catatan, cari & saring, sembunyikan isi, dialog cetak |
| `css/hidup.css` | Latar bergerak, wajah berkedip, api streak, konfeti |
| `css/koleksi.css` | Dinding syukur, refleksi mingguan, kapsul waktu, lencana |
| `css/dialog.css` | Dialog umum, napas, rekap, pengaturan, layar kunci, sambutan, layar pembuka, menulis fokus, bantuan, refleksi |
| `css/stiker.css` | Stiker di kalender dan judul catatan, laci stiker, pembuat stiker, buku stiker |
| `css/template.css` | Template halaman bulan, kartu pratinjau template, dan layar hias |
| `css/cetak.css` | Tampilan saat dicetak / disimpan ke PDF |
| `js/inti.js` | Konstanta, helper, state, penyimpanan, dan efek kecil yang dipakai semua fitur |
| `js/editor.js` | Menulis catatan, isi cepat, kebiasaan, draf otomatis, hapus/urungkan, dan kata penyemangat |
| `js/kalender.js` | Kalender bulan, pemilih bulan, grafik, dan rekap setahun |
| `js/wawasan.js` | Daftar faktor yang memengaruhi rasa, kebiasaan bulan ini, dan rasa per hari |
| `js/catatan.js` | Cari, saring, daftar catatan, dan cetak/PDF |
| `js/koleksi.js` | Dinding syukur, kapsul waktu, dan lencana |
| `js/napas.js` | Latihan napas |
| `js/menulis.js` | Mode menulis fokus, bicara jadi tulisan, dan tema pertanyaan pemantik |
| `js/refleksi.js` | Niat harian dan refleksi mingguan |
| `js/dukungan.js` | Kartu dukungan saat hari berat beruntun dan dialog kontak bantuan (nomor layanan ada di `HELP_LINES`) |
| `js/stiker.js` | Daftar stiker bawaan dan dekorasi, stiker buatan sendiri, laci stiker, mode tempel di kalender, buku stiker |
| `js/hewan.js` | Stiker hewan lucu dan hiasan tambahan (sakura, es krim, boba, balon, dan lain-lain) |
| `js/lucu.js` | Hewan tambahan, stiker makanan, stiker lucu & kata-kata, serta bentuk dan warna template lucu (`CUTE_TPL`, `SHAPES`) |
| `js/hias.js` | Template dan judul halaman bulan, mode hias (geser, putar, ubah ukuran), dan simpan halaman sebagai PNG |
| `js/rekap.js` | Rekap bulanan bergaya "Wrapped" dan daftarnya di tab Wawasan |
| `js/pengaturan.js` | Tema, backup, kapasitas, pengingat backup, pengingat harian, kunci PIN, sembunyikan catatan, fitur yang ditampilkan, dan kurangi animasi |
| `js/sambutan.js` | Panduan untuk pengguna baru |
| `js/main.js` | Tab, render semua bagian, dan urutan saat halaman dibuka (dimuat paling akhir) |

Semua file JS dimuat berurutan sebagai skrip biasa (tanpa build), jadi fungsi di satu file bisa dipakai file lain.
File CSS juga dimuat berurutan seperti di `index.html`; urutannya penting karena `hidup.css` menimpa sebagian gaya sebelumnya.
Kalau mengubah bentuk tanda rasa di `css/template.css`, ubah juga `drawCell` di `js/hias.js` supaya gambar PNG tetap sama dengan tampilan.

Kode diformat dengan [Prettier](https://prettier.io) (aturannya di `.prettierrc`). Setelah mengubah kode, rapikan lagi dengan:

```
npx prettier --write index.html "css/*.css" "js/*.js"
```

## Penyimpanan data

Semua data disimpan di `localStorage` browser, jadi hanya ada di browser dan perangkat itu saja.

| Kunci | Isi |
|---|---|
| `jurnal-rasa:entries` | Catatan per tanggal (termasuk kata perasaan, foto, syukur, dan kebiasaan) |
| `jurnal-rasa:intents` | Niat harian per tanggal dan hasilnya |
| `jurnal-rasa:reflections` | Refleksi mingguan, per tanggal Senin |
| `jurnal-rasa:stickers` | Stiker yang ditempel per tanggal dan stiker buatan sendiri |
| `jurnal-rasa:calpages` | Template bawaan, serta template, judul, dan hiasan tiap bulan |
| `jurnal-rasa:draft` | Draf yang belum disimpan |
| `jurnal-rasa:lastBackup` | Tanggal backup terakhir |
| `jurnal-rasa:tags` | Daftar label |
| `jurnal-rasa:habits` | Daftar kebiasaan |
| `jurnal-rasa:capsules` | Kapsul waktu |
| `jurnal-rasa:badges` | Lencana yang sudah didapat |
| `jurnal-rasa:settings` | Pengingat, PIN (disimpan sebagai hash), pilihan sembunyikan catatan, dan kontak orang yang kamu percaya |
| `jurnal-rasa:ptheme` | Tema pertanyaan pemantik yang dipilih |
| `jurnal-rasa:theme` | Tema terang atau gelap |

Batasan yang perlu diketahui:
- Kapasitas `localStorage` sekitar 5 MB. Foto dikecilkan sampai sekitar 30–60 KB, jadi muat kira-kira 80–150 foto.
- Kunci PIN dan kapsul waktu hanya mengunci tampilan. Isinya tidak dienkripsi.
- Nomor layanan bantuan bisa berubah; cek ulang `HELP_LINES` di `js/dukungan.js` sebelum aplikasi dibagikan.
- Pengingat hanya bisa muncul selama aplikasi terbuka. Notifikasi saat aplikasi tertutup butuh server push, dan itu belum ada.
- Perubahan kode yang sudah di-upload baru terlihat di HP pada kali kedua aplikasi dibuka, karena versi lama dipakai dulu dari cache.

## Ide pengembangan

- Stiker dari foto (dipotong bulat dan dikecilkan)
- Login dan database online (misalnya Firebase atau Supabase) supaya bisa dibuka dari perangkat lain
