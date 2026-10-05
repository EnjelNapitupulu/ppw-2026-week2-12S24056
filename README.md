# Portofolio Web - Enjel Ayuti Napitupulu

Tugas Praktikum Mata Kuliah Pemrograman dan Pengujian Aplikasi Web (12S3101)
Institut Teknologi Del - Semester Genap 2025/2026

**Nama:** Enjel Ayuti Napitupulu
**NIM:** 12S24056
**Kelas:** 13 SI 2

## Deskripsi

Portofolio ini merupakan hasil refactoring arsitektural dari proyek Minggu 3.
Seluruh konten yang sebelumnya ditulis statis (hardcoded) di dalam HTML kini
dipisahkan menjadi data provider JSON modular, dan dirender secara dinamis di
sisi klien (Client-Side Rendering) menggunakan JavaScript ES6+ dengan Fetch API.

## Diagram Arsitektur Sistem (C4 Container Model)

```mermaid
graph TD
    User["👤 Pengguna<br/>(Browser)"]

    subgraph Client["PRESENTATION TIER — Client / Browser"]
        HTML["index.html<br/>HTML5 Shell + Bootstrap 5"]
        CSS["custom-style.css<br/>Theming & CSS Variables"]
        AppJS["app.js<br/>Presentation Logic & DOM Rendering"]
    end

    subgraph Logic["APPLICATION / SERVICE LOGIC TIER"]
        ApiService["api-service.js<br/>Data Access Layer<br/>(Fetch, Error Handling, Mock REST Dispatch)"]
    end

    subgraph Data["DATA STORAGE TIER"]
        Profile["profile.json"]
        Projects["projects.json"]
        Services["services.json"]
    end

    CDN["🌐 GitHub Pages / CDN<br/>Static Hosting"]

    User -->|HTTP GET| CDN
    CDN -->|Serve static assets| HTML
    HTML --> CSS
    HTML --> AppJS
    AppJS -->|async/await fetch()| ApiService
    ApiService -->|GET /data/*.json| Profile
    ApiService -->|GET /data/*.json| Projects
    ApiService -->|GET /data/*.json| Services
    AppJS -->|Render DOM dinamis| HTML
    AppJS -->|Simpan riwayat pesanan| LocalStorage["💾 localStorage<br/>(Client-side Persistence)"]
```

### Narasi Separation of Concerns

Arsitektur ini membagi tanggung jawab ke dalam tiga lapisan terpisah:

1. **Presentation Tier** — `index.html` berperan sebagai *shell* minimal yang
   hanya memuat struktur semantik dan kontainer kosong. `app.js` mengatur
   seluruh manipulasi DOM, state UI (loading/success/empty/error), dan event
   interaksi pengguna. Lapisan ini tidak tahu-menahu *bagaimana* data didapat.

2. **Application / Service Logic Tier** — `api-service.js` bertindak sebagai
   *Data Access Layer* yang menjembatani presentation tier dengan sumber
   data. Seluruh pemanggilan `fetch()`, penanganan error jaringan, dan
   simulasi pengiriman form (mock REST endpoint) terpusat di sini. Perubahan
   sumber data (misal dari file JSON lokal menjadi API sungguhan) tidak akan
   mempengaruhi kode di `app.js`.

3. **Data Storage Tier** — `profile.json`, `projects.json`, dan `services.json`
   berperan sebagai *decoupled mock data provider*, mensimulasikan respons
   RESTful API tanpa memerlukan server backend sungguhan untuk keperluan
   praktikum ini.

Pemisahan ini membuat setiap lapisan bisa diuji, diganti, atau dikembangkan
secara independen — ciri khas arsitektur web kontemporer dibanding pendekatan
monolitik Minggu 2-3 yang menyatukan struktur, gaya, dan data dalam satu berkas.

## Tabel Komparasi: Sebelum vs Sesudah Refactoring

| Aspek | Sebelum (Minggu 3 - Statis/Hardcoded) | Sesudah (Minggu 4 - Dynamic CSR) |
|---|---|---|
| **Sumber Data Kartu Proyek** | Ditulis langsung di `index.html` sebagai markup statis | Dimuat asinkron dari `data/projects.json` via `fetch()` |
| **Jumlah Modal** | 2 modal terpisah, masing-masing dengan markup duplikat | 1 **Universal Modal**, kontennya diinjeksi dinamis berdasarkan `data-ID` |
| **Pengiriman Formulir** | `action="#"`, tidak benar-benar terkirim kemana pun | Asinkron via `fetch POST` tiruan (`ApiService.submitServiceOrder`), tanpa reload halaman |
| **Status Antarmuka** | Tidak ada state loading/error eksplisit | 4 UI states dikelola: Loading (skeleton), Success, Empty, Error |
| **Filter Kategori** | Tidak ada fitur filter | Filter kategori proyek (Frontend/Backend) berfungsi instan tanpa reload |
| **Persistensi Data** | Tidak ada | Riwayat pesanan disimpan di `localStorage`, ditampilkan sebagai badge notifikasi |
| **Struktur Folder** | Flat (semua file di root) | Modular: `/css`, `/data`, `/js` dengan tanggung jawab terpisah |
| **Keamanan Input** | Tidak ada sanitasi khusus | Fungsi `escapeHTML()` diterapkan pada seluruh nilai dinamis sebelum disisipkan ke DOM, mencegah DOM-based XSS |

## Pengukuran Performa Jaringan (DevTools)

*(Isi tabel ini setelah melakukan pengujian sendiri lewat tab Network di DevTools —
lihat instruksi di bawah)*

| Metrik | Cold Load (cache kosong) | Warm Load (reload kedua) |
|---|---|---|
| Time to First Byte (TTFB) | ... ms | ... ms |
| First Contentful Paint (FCP) | ... ms | ... ms |
| Status HTTP `projects.json` | 200 OK | ... (cek apakah 304 Not Modified) |
| Total ukuran transfer | ... KB | ... KB |
| Jumlah request | ... | ... |

**Cara mengisi tabel di atas:**
1. Buka live demo di Chrome, tekan `F12` → tab **Network**
2. Centang **"Disable cache"** dimatikan, lalu refresh halaman dengan `Ctrl+Shift+R` (hard reload) — ini **Cold Load**
3. Catat nilai **TTFB** dan **FCP** dari tab **Performance** atau ringkasan di bagian bawah tab Network
4. Refresh sekali lagi dengan `Ctrl+R` biasa (bukan hard reload) — ini **Warm Load**, cek apakah request ke file `.json` menunjukkan status **304 Not Modified** (artinya cache browser bekerja)
5. Screenshot waterfall request-nya, simpan sebagai `waterfall-screenshot.png`, sisipkan di bawah ini:

*(Tambahkan screenshot waterfall DevTools di sini)*

## Teknologi yang Digunakan

- HTML5 semantik (shell bersih, tanpa hardcoded content)
- Bootstrap 5.3.3 (CSS & JS Bundle via CDN) + Bootstrap Icons
- JavaScript ES6+ (async/await, Fetch API, modular object pattern)
- JSON sebagai decoupled mock data provider
- localStorage untuk persistensi state sisi klien
- Git & GitHub Pages untuk version control dan deployment

## Struktur Folder

```
├── index.html
├── css/
│   └── custom-style.css
├── data/
│   ├── profile.json
│   ├── projects.json
│   └── services.json
├── js/
│   ├── api-service.js
│   └── app.js
└── README.md
```

## Cara Menjalankan Secara Lokal

> **Penting:** karena proyek ini memakai `fetch()` untuk membaca file JSON,
> file **tidak bisa** dibuka langsung lewat `file://` di browser (akan
> terblokir kebijakan CORS). Wajib dijalankan lewat **Live Server** di VS Code.

1. Clone repository ini, checkout ke branch `week4-architecture`:
   ```bash
   git checkout week4-architecture
   ```
2. Klik kanan `index.html` → **Open with Live Server**

## Cara Deploy ke GitHub Pages

```bash
git checkout week3-bootstrap
git checkout -b week4-architecture
git add .
git commit -m "feat(week4): decouple architecture to json data providers and async CSR"
git push -u origin week4-architecture
```

Lalu aktifkan di GitHub: **Settings → Pages → Branch: week4-architecture → Save**

## Live Demo

https://EnjelNapitupulu.github.io/ppw-2026-week2-12S24056/

## Penulis

Enjel Ayuti Napitupulu - 12S24056 - Sistem Informasi, Institut Teknologi Del