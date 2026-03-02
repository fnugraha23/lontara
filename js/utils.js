/* ======================================================
   LONTARA — UTILITIES
   Helper functions & Micro-interactions
====================================================== */

/**
 * 1. RIPPLE EFFECT
 * Memberikan feedback visual berupa gelombang air saat tombol diklik.
 * Sesuai dengan estetika desain tombol Lontara.
 */
function initRippleEffect() {
  const buttons = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .nav-cta",
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Menghapus ripple lama jika pengguna mengklik sangat cepat
      const existingRipple = this.querySelector(".ripple");
      if (existingRipple) existingRipple.remove();

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      // Mengatur ukuran dan posisi agar tepat di titik klik
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      this.appendChild(ripple);

      // Menghapus elemen setelah animasi selesai (600ms sesuai components.css)
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * 2. DEBOUNCE FUNCTION
 * Berguna untuk membatasi eksekusi fungsi yang berat saat window di-resize.
 * Sangat penting agar WebGIS tidak "lag" saat browser berubah ukuran.
 */
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * 3. COPY TO CLIPBOARD
 * Memudahkan pengunjung menyalin potongan kode Python atau ID dataset
 * dari halaman Aset Digital Anda.
 */
async function copyToClipboard(text, element) {
  try {
    await navigator.clipboard.writeText(text);

    // Memberikan feedback visual pada elemen yang diklik
    const originalText = element.innerText;
    element.innerText = "Tersalin!";
    element.style.color = "var(--accent)";

    setTimeout(() => {
      element.innerText = originalText;
      element.style.color = "";
    }, 2000);
  } catch (err) {
    console.error("Gagal menyalin teks: ", err);
  }
}

/**
 * 4. SAFE IMAGE LOADER
 * Mencegah layout bergeser saat foto profil atau logo baru selesai dimuat.
 * Menjaga kesimetrisan tampilan halaman.
 */
function initImageLoaders() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
    }
  });
}

/* ======================================================
   INISIALISASI GLOBAL
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initRippleEffect();
  initImageLoaders();

  // Contoh penggunaan Debounce pada resize window
  window.addEventListener(
    "resize",
    debounce(() => {
      console.log("Layout Lontara disesuaikan...");
    }),
  );
});
