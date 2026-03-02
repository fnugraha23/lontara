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

      // Memicu blur pada main/visi-misi melalui class di body
      document.body.classList.toggle("nav-open");
    });

    // Close on Overlay Click
    overlay.addEventListener("click", () => {
      closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    if (navToggle) navToggle.classList.remove("active");
    if (navMenu) navMenu.classList.remove("show");
    if (overlay) overlay.classList.remove("active");

    // Menghilangkan efek blur saat menu ditutup
    document.body.classList.remove("nav-open");
  }

  /* ===============================
      MOBILE DROPDOWN ACCORDION
  =============================== */
  const dropdownLinks = document.querySelectorAll(".has-dropdown > a");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
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

        if (navMenu && navMenu.classList.contains("show")) {
          closeMobileMenu();
        }
      }
    });
  });

  /* ===============================
      SCROLL REVEAL ORCHESTRATOR
  =============================== */
  // Menambahkan .vm-card agar visi dan misi ikut dalam animasi muncul
  const revealElements = document.querySelectorAll(
    ".section, .card, .hero-content, .reveal-init, .webgis-container, .vm-card, .founder-section",
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
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
