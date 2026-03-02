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

  // Create Overlay secara dinamis untuk efek blur/gelap saat menu buka
  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  document.body.appendChild(overlay);

  if (navToggle) {
    // Toggle Menu
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("show");
      overlay.classList.toggle("active");
    });

    // Close on Overlay Click
    overlay.addEventListener("click", () => {
      closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    if (navToggle) navToggle.classList.remove("active");
    if (navMenu) navMenu.classList.remove("show");
    overlay.classList.remove("active");
  }

  /* ===============================
      MOBILE DROPDOWN ACCORDION
  =============================== */
  const dropdownLinks = document.querySelectorAll(".has-dropdown > a");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Logic khusus Mobile (< 768px) agar dropdown bisa diklik
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.parentElement.classList.toggle("active");
      }
    });
  });

  /* ===============================
      ACTIVE LINK DETECTION
  =============================== */
  const currentURL = window.location.href;
  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach((link) => {
    // Memberikan class active jika URL cocok dengan link
    if (link.href === currentURL) {
      link.classList.add("active");
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

        // Tutup menu mobile jika link anchor diklik
        if (navMenu && navMenu.classList.contains("show")) {
          closeMobileMenu();
        }
      }
    });
  });

  /* ===============================
      SCROLL REVEAL ORCHESTRATOR
  =============================== */
  // Mendaftarkan elemen, termasuk kontainer WebGIS agar muncul dengan animasi
  const revealElements = document.querySelectorAll(
    ".section, .card, .hero-content, .reveal-init, .webgis-container",
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        // Berhenti mengobservasi setelah elemen muncul (opsional)
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    // Tambahkan class awal reveal-init jika belum ada di HTML
    if (!el.classList.contains("reveal-init")) {
      el.classList.add("reveal-init");
    }
    observer.observe(el);
  });
});
