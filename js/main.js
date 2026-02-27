/* ======================================================
   LONTARA — MAIN CORE
   Navigation Logic, Global Orchestration & WebGIS Sync
====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ===============================
      MOBILE NAVIGATION SYSTEM
  =============================== */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navClose = document.getElementById("nav-close");
  
  // 1. Sinkronisasi Overlay
  // Mengecek apakah overlay sudah ada di HTML, jika tidak maka buat secara dinamis
  let overlay = document.getElementById("nav-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "nav-overlay";
    overlay.classList.add("nav-overlay");
    document.body.appendChild(overlay);
  }

  // 2. Fungsi Buka Menu
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden"; // Mencegah scroll saat menu buka
    });
  }

  // 3. Fungsi Tutup Menu (Lewat Tombol X, Overlay, atau Link)
  const closeMobileMenu = () => {
    navMenu.classList.remove("show");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto"; // Mengembalikan fungsi scroll
    
    // Reset state dropdown proyek saat menu ditutup
    document.querySelectorAll(".has-dropdown").forEach(item => {
      item.classList.remove("active");
    });
  };

  if (navClose) navClose.addEventListener("click", closeMobileMenu);
  if (overlay) overlay.addEventListener("click", closeMobileMenu);

  /* ===============================
      MOBILE DROPDOWN ACCORDION
  =============================== */
  // Memperbaiki susunan sub-menu agar tidak amburadul di layar kecil
  const dropdownLinks = document.querySelectorAll(".has-dropdown > a");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.parentElement;
        
        // Toggle class active untuk membuka sub-menu (Proyek) secara vertikal
        parent.classList.toggle("active");
        
        // Menutup dropdown lain jika ada yang terbuka (Accordion style)
        document.querySelectorAll(".has-dropdown").forEach(otherItem => {
          if (otherItem !== parent) {
            otherItem.classList.remove("active");
          }
        });
      }
    });
  });

  /* ===============================
      ACTIVE LINK DETECTION
  =============================== */
  const currentURL = window.location.href;
  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach((link) => {
    // Memberikan class active jika URL cocok untuk indikator halaman saat ini
    if (link.href === currentURL) {
      link.classList.add("active");
      
      // Jika link berada di dalam dropdown, pastikan parent tetap terlihat aktif
      const parentDropdown = link.closest(".has-dropdown");
      if (parentDropdown) {
        parentDropdown.querySelector(".nav-link-dropdown").classList.add("active");
      }
    }
  });

  /* ===============================
      SMOOTH SCROLL ANCHORING
  =============================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Otomatis tutup menu mobile jika anchor diklik
        if (navMenu && navMenu.classList.contains("show")) {
          closeMobileMenu();
        }
      }
    });
  });

  /* ===============================
      SCROLL REVEAL ORCHESTRATOR
  =============================== */
  // Memastikan Visi & Misi dan elemen lainnya muncul dengan animasi
  const revealElements = document.querySelectorAll(
    ".section, .card, .hero-content, .reveal-init, .webgis-container, .vm-card"
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        // Hapus unobserve jika ingin animasi berulang saat scroll balik
        // observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    if (!el.classList.contains("reveal-init")) {
      el.classList.add("reveal-init");
    }
    observer.observe(el);
  });
});
