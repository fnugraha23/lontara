# 🌍 LontaraGeo Engine

**Platform Analisis Citra Satelit On-the-Fly berbasis Google Earth Engine (GEE)**

![Versi](https://img.shields.io/badge/version-1.0.0--beta-00b8a9)
![Python](https://img.shields.io/badge/Python-3.9+-123b3a)
![Flask](https://img.shields.io/badge/Framework-Flask-white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Tentang Proyek

**LontaraGeo** adalah platform analisis geospasial berbasis web yang dirancang untuk memproses data penginderaan jauh secara _real-time_. Menggunakan kekuatan komputasi awan dari **Google Earth Engine**, pengguna dapat melakukan ekstraksi indeks spektral (seperti NDVI, NDWI, EVI) tanpa perlu mengunduh data citra berukuran besar (Gigabytes) ke komputer lokal.

### 📜 Filosofi Nama

Nama **Lontara** diambil dari aksara tradisional suku Bugis-Makassar. Sebagaimana Lontara digunakan untuk mencatat ilmu pengetahuan dan sejarah di masa lalu, **LontaraGeo** hadir sebagai media modern untuk "membaca" dan mencatat kondisi biofisik bumi melalui data satelit.

---

## 🚀 Fitur Utama

- **Multi-Satelit:** Dukungan penuh untuk Sentinel-2 (10m) dan Landsat 8/9 (30m).
- **Indeks Spektral Otomatis:** Kalkulasi NDVI, EVI, NDWI, dan NDBI secara instan.
- **Cloud Masking:** Algoritma pembersihan awan otomatis untuk menghasilkan citra komposit bebas gangguan.
- **Interactive Draw:** Gambar _Area of Interest_ (AOI) langsung di peta interaktif.
- **Topography Analysis:** Integrasi data NASADEM untuk analisis elevasi dan kelerengan (Slope).
- **Light/Dark Mode:** Antarmuka modern yang nyaman untuk bekerja di berbagai kondisi cahaya.

---

## 🛠️ Struktur Proyek

```text
LontaraGeo/
├── 📁 frontend/
│   ├── 📄 index.html        # Antarmuka Peta (Leaflet.js)
│   └── 📄 ui.js             # Library utilitas UI & Tema
├── 📁 backend/
│   ├── 📄 app.py            # Flask Server (Routing API)
│   ├── 📄 gee_modules.py    # Logika Pemrosesan Earth Engine
│   ├── 📄 .env              # Konfigurasi Environment (Secret)
│   ├── 📄 credentials.json  # Google Service Account Key
│   └── 📄 requirements.txt  # Daftar Library Python
├── 📄 .gitignore            # File yang diabaikan oleh Git
└── 📄 README.md             # Dokumentasi Proyek
```
