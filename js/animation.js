/* ======================================================
   LONTARA — ANIMATIONS
   Scroll effects, Reveals, Ripple, & Header transitions
====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* 1. HEADER SHRINK & SCROLL TRACKING */
  const header = document.getElementById("header");
  const progressBar = document.getElementById("progress-bar");

  const handleScroll = () => {
    const scrollTop = window.scrollY;

    // Efek menyusut pada header saat scroll
    if (scrollTop > 50) {
      header.classList.add("shrink");
    } else {
      header.classList.remove("shrink");
    }

    // Update Progress Bar
    if (progressBar) {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + "%";
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  /* 2. SCROLL REVEAL (Intersection Observer) */
  // Mendeteksi section, card, dan elemen spesifik lainnya
  const revealElements = document.querySelectorAll(
    ".section, .card, .hero-content, .reveal-init, .founder-image-container, .contact-form-card",
  );

  const revealOptions = {
    threshold: 0.1, // Elemen mulai muncul saat 10% terlihat
    rootMargin: "0px 0px -50px 0px", // Offset agar muncul sedikit sebelum benar-benar di tengah layar
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        // Hapus baris di bawah jika ingin animasi diputar berulang saat scroll naik-turun
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => {
    // Pastikan elemen mendapatkan status inisiasi sebelum diobservasi
    if (!el.classList.contains("reveal-init")) {
      el.classList.add("reveal-init");
    }
    revealObserver.observe(el);
  });

  /* 3. BUTTON RIPPLE EFFECT */
  // Memberikan umpan balik visual saat tombol diklik
  const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY - e.target.offsetTop;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Bersihkan elemen span setelah animasi selesai
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  /* 4. SMOOTH INTERNAL ANCHORS */
  // Memastikan scroll antar bagian di dalam halaman terasa elegan
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
