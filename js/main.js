/* ======================================================
    LONTARA — MAIN CORE
    Navigation Logic, Global Orchestration & Reveal Animations
   ====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ===============================
      1. SISTEM NAVIGASI MOBILE
  =============================== */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navClose = document.getElementById("nav-close");
  const navOverlay = document.getElementById("nav-overlay");

  /**
   * Fungsi untuk membuka menu mobile.
   * Menampilkan sidebar, mengaktifkan overlay, dan mengunci scroll.
   */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (navMenu) navMenu.classList.add("show");
      if (navOverlay) navOverlay.classList.add("show");
      // Mencegah scroll latar belakang agar navigasi stabil
      document.body.style.overflow = "hidden";
    });
  }

  /**
   * Fungsi untuk menutup menu mobile.
   * Menghapus class 'show' agar klik kembali berfungsi normal.
   */
  const closeMobileMenu = () => {
    if (navMenu) navMenu.classList.remove("show");
    if (navOverlay) navOverlay.classList.remove("show");
    // Mengembalikan fungsi scroll normal
    document.body.style.overflow = "auto";
  };

  // Event listener untuk menutup menu (X, Overlay, atau Link diklik)
  if (navClose) navClose.addEventListener("click", closeMobileMenu);
  if (navOverlay) navOverlay.addEventListener("click", closeMobileMenu);

  // Otomatis tutup menu jika link di dalam navigasi diklik (penting untuk mobile)
  const navLinksList = document.querySelectorAll(".nav a");
  navLinksList.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  /* ===============================
      2. DETEKSI HALAMAN AKTIF
  =============================== */
  /**
   * Memberikan class 'active' pada menu sesuai URL saat ini.
   * Menangani path root, beranda.html, dan file dalam sub-folder.
   */
  const currentPath = window.location.pathname;

  navLinksList.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (!linkPath) return;

    // Normalisasi path untuk pencocokan (menghapus ../ agar sinkron di sub-folder)
    const normalizedLink = linkPath.replace("../", "");

    if (
      (linkPath !== "beranda.html" && currentPath.includes(normalizedLink)) ||
      (currentPath.endsWith("beranda.html") && linkPath === "beranda.html") ||
      (currentPath === "/" &&
        (linkPath === "beranda.html" || linkPath === "index.html"))
    ) {
      link.classList.add("active");
    }
  });

  /* ===============================
      3. STICKY HEADER SCROLL
  ============================== */
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("shrink"); // Memberikan efek visual saat scroll
      } else {
        header.classList.remove("shrink");
      }
    }
  });

  /* ===============================
      4. GLOBAL REVEAL ORCHESTRATOR
  =============================== */
  /**
   * Intersection Observer untuk animasi muncul konten secara elegan.
   * Dioptimalkan untuk elemen WebGIS dan kartu riset Lontara.
   */
  const revealElements = document.querySelectorAll(
    ".section, .card, .hero-content, .reveal-init, .webgis-container, .founder-image-container",
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        revealObserver.unobserve(entry.target); // Animasi hanya berjalan satu kali untuk performa
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    // Inisialisasi state awal (transparan) jika belum ada di HTML
    if (!el.classList.contains("reveal-init")) {
      el.classList.add("reveal-init");
    }
    revealObserver.observe(el);
  });
});
