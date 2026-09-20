# Portofolio Web - Enjel Ayuti Napitupulu

Tugas Mandiri Mata Kuliah Pemrograman dan Pengujian Aplikasi Web (12S3101)
Institut Teknologi Del - Semester Genap 2025/2026

## Deskripsi

Halaman web portofolio profil profesional satu halaman (*single page showcase*)
yang menampilkan identitas akademik, riwayat proyek dalam bentuk tabel semantik,
galeri keahlian, dan formulir konsultasi/kontak yang accessible sesuai
WCAG 2.2 Level AA. Menggunakan nuansa warna coklat tua dan cream yang hangat
dan elegan.

## Teknologi yang Digunakan

- HTML5 (elemen semantik: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
- CSS3 (Flexbox, Grid, CSS Custom Properties, Media Queries)
- Git & GitHub Pages untuk version control dan deployment

## Fitur

- Struktur semantik HTML5 tanpa `div` berlebihan
- Kartu profil dengan foto bulat, banner gradien, dan badge status
- Tabel data semantik (`caption`, `thead`, `tbody`, `tfoot`, `scope`)
- Dua jenis HTML list: `<ul>` (keahlian) dan `<ol>` (alur kerja proyek)
- Formulir interaktif dengan `fieldset`, `legend`, label eksplisit, dan validasi native HTML5
- Aksesibilitas: `aria-describedby`, `aria-label`, `focus-visible` dengan outline jelas
- Palet warna coklat-cream (aturan 60-30-10) menggunakan CSS Variables
- Desain responsif (mobile & desktop) dengan sudut membulat, bayangan halus, dan transisi hover

## Struktur Folder

```
├── index.html
├── style.css
└── README.md
```

## Cara Menjalankan Secara Lokal

1. Clone atau unduh repository ini
2. Buka file `index.html` langsung di browser, atau gunakan ekstensi
   **Live Server** di VS Code untuk preview otomatis

## Cara Deploy ke GitHub Pages

```bash
git init
git add .
git commit -m "feat: complete week 2 html5 and modern css assignment"
git remote add origin https://github.com/[username]/ppw-2026-week2-[NIM].git
git branch -M main
git push -u origin main
```

Lalu aktifkan di GitHub: **Settings → Pages → Branch: main → Save**

## Live Demo

https://USERNAME_KAMU.github.io/ppw-2026-week2-NIM/

## Screenshot

*(Tambahkan screenshot tampilan halaman di sini setelah selesai styling)*

## Penulis

[Nama Kamu] - [NIM] - Sistem Informasi, Institut Teknologi Del