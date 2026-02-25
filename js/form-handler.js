/* ======================================================
   LONTARA — FORM HANDLER (FIXED DATA INTEGRATION)
====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Inisialisasi EmailJS dengan Public Key Lontara
  emailjs.init("UYXE1DX3pWfcDCIU8");

  const contactForm = document.getElementById("contact-form");
  const gatedForm = document.getElementById("gated-access-form");

  // 2. Kredensial Lontara
  const serviceID = "service_1gevel5";
  const templateID = "template_n753lnf"; 

  /* --- 1. GENERAL CONTACT FORM HANDLER --- */
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector("button[type='submit']");
      const originalText = btn ? btn.innerText : "Kirim Pesan";

      if (btn) {
        btn.innerText = "Mengirim...";
        btn.disabled = true;
      }

      // PERBAIKAN: Menggunakan selector string '#contact-form' 
      // agar EmailJS menarik ulang semua atribut 'name' dari DOM secara paksa.
      emailjs.sendForm(serviceID, templateID, '#contact-form')
        .then(function() {
            alert("Sukses! Pesan Anda telah terkirim ke tim Lontara.");
            contactForm.reset();
            if (btn) {
              btn.innerText = originalText;
              btn.disabled = false;
            }
        }, function(error) {
            alert("Gagal mengirim pesan. Error: " + JSON.stringify(error));
            if (btn) {
              btn.innerText = originalText;
              btn.disabled = false;
            }
        });
    });
  }

  /* --- 2. GATED CONTENT HANDLER --- */
  if (gatedForm) {
    gatedForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = gatedForm.querySelector("button[type='submit']");
      const originalText = btn ? btn.innerText : "Kirim Permintaan";
      
      if (btn) {
        btn.innerText = "Memproses...";
        btn.disabled = true;
      }

      // Menggunakan selector string '#gated-access-form'.
      emailjs.sendForm(serviceID, templateID, '#gated-access-form')
        .then(function() {
            alert("Sukses! Permintaan akses toolkit Anda telah kami terima.");
            gatedForm.reset();
            if (btn) {
              btn.innerText = originalText;
              btn.disabled = false;
            }
        }, function(error) {
            alert("Terjadi kesalahan. Error: " + JSON.stringify(error));
            if (btn) {
              btn.innerText = originalText;
              btn.disabled = false;
            }
        });
    });
  }
});
