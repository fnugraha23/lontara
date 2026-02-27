/* ======================================================
   LONTARA — GLOBAL FORM HANDLER (EMAILJS)
   Mendukung Form Kontak & Akses Aset Digital
====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Inisialisasi Kredensial EmailJS Lontara
  // Tetap menggunakan Public Key resmi Anda sesuai permintaan
  emailjs.init("UYXE1DX3pWfcDCIU8");

  const serviceID = "service_1gevel5";
  const templateID = "template_n753lnf";

  /**
   * Fungsi untuk menampilkan pesan status secara inline
   * @param {HTMLElement} form - Elemen form terkait
   * @param {string} message - Pesan yang ingin ditampilkan
   * @param {string} type - 'success' atau 'error'
   */
  const showStatus = (form, message, type) => {
    // Cari atau buat elemen status jika belum ada di HTML
    let statusEl = form.querySelector(".form-status");
    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "form-status";
      form.appendChild(statusEl);
    }

    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`; // Menggunakan class dari components.css

    // Hilangkan pesan setelah 6 detik agar UI kembali bersih
    setTimeout(() => {
      statusEl.style.display = "none";
    }, 6000);
  };

  /**
   * Fungsi Helper Utama untuk Menangani Pengiriman Form
   */
  const setupFormHandler = (formId, successMsg) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = form.querySelector("button[type='submit']");
      const originalText = btn ? btn.innerHTML : "Kirim";

      // Feedback Visual: Loading State
      if (btn) {
        btn.innerHTML = `
          <span style="display: flex; align-items: center; gap: 10px; justify-content: center;">
            Memproses...
          </span>
        `;
        btn.disabled = true;
      }

      // Kirim data menggunakan EmailJS
      emailjs
        .sendForm(serviceID, templateID, `#${formId}`)
        .then(() => {
          showStatus(form, successMsg, "success");
          form.reset();
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          showStatus(
            form,
            "Maaf, terjadi gangguan koneksi. Sila coba lagi nanti.",
            "error",
          );
        })
        .finally(() => {
          // Kembalikan tombol ke kondisi semula
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        });
    });
  };

  // 2. Registrasi Form Sesuai Struktur Website Lontara
  // Form di halaman kontak.html
  setupFormHandler(
    "contact-form",
    "Terima kasih! Pesan Anda telah terkirim ke tim intelijen Lontara.",
  );

  // Form di halaman aset-digital.html (Gated Access)
  setupFormHandler(
    "gated-access-form",
    "Sukses! Permintaan akses toolkit Anda telah kami terima. Sila cek email Anda secara berkala.",
  );
});
