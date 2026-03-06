/* ==========================================================================
   LontaraGeo Engine - API Controller
   Folder: frontend/js/api.js
   Fungsi: Menangani HTTP Request ke Backend Python (Google Earth Engine)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // --- PERBAIKAN: MENGGUNAKAN URL PRODUKSI DARI KOYEB ---
  const API_URL = "https://historical-eleanor-lontara-2cc788bd.koyeb.app/api/process-image";

  // --- MATIKAN MOCK MODE AGAR TERHUBUNG KE PYTHON ---
  const USE_MOCK_API = false;

  const btnProcess = document.getElementById("btnProcess");
  const btnText = document.getElementById("btnText");
  const processLoader = document.getElementById("processLoader");
  const resultPanel = document.getElementById("resultPanel");

  btnProcess.addEventListener("click", async function () {
    if (!window.currentAOI) {
      alert("Silakan gambar Area of Interest (AOI) di peta terlebih dahulu.");
      return;
    }

    // Menyiapkan Payload Data untuk gee_modules.py
    const payloadData = {
      aoi: window.currentAOI.geometry.coordinates,
      satellite: document.getElementById("satelliteSelect").value,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      cloudCover: parseInt(document.getElementById("cloudCover").value),
      indexType: document.getElementById("indexSelect").value,
      cloudMask: document.getElementById("cloudMask")
        ? document.getElementById("cloudMask").checked
        : true,
      waterMask: document.getElementById("waterMask")
        ? document.getElementById("waterMask").checked
        : false,
    };

    if (new Date(payloadData.startDate) > new Date(payloadData.endDate)) {
      alert("Kesalahan: Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");
      return;
    }

    setLoadingState(true);

    try {
      let responseData;

      if (USE_MOCK_API) {
        console.log("⚙️ [MOCK MODE] Mengirim data:", payloadData);
        await new Promise((resolve) => setTimeout(resolve, 3500));
        responseData = {
          status: "success",
          tile_url: "https://earthengine.googleapis.com/v1alpha/mock-tiles/{z}/{x}/{y}",
          metadata: {
            satelliteName: getSatelliteNameUI(payloadData.satellite),
            acquisitionDate: "28 Agustus 2023, 10:24 WITA",
            cloudCoverActual: "4.2%",
            crs: "EPSG:4326",
          },
        };
      } else {
        console.log("🚀 Mengirim request ke Backend Koyeb:", API_URL);

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payloadData),
        });

        responseData = await response.json();

        if (!response.ok || responseData.status === "error") {
          throw new Error(
            responseData.error ||
              responseData.message ||
              "Gagal memproses data dari Earth Engine."
          );
        }
      }

      // --- PENANGANAN RESPON BERHASIL ---
      if (responseData.status === "success") {
        console.log("✅ Analisis Berhasil!", responseData);

        // Render layer GEE ke peta Leaflet/Mapbox
        if (window.renderGEELayer && responseData.tile_url) {
          window.renderGEELayer(responseData.tile_url);
        }

        // Perbarui Panel Informasi Hasil
        if (responseData.metadata) {
          updateResultPanel(responseData.metadata);
        } else {
          updateResultPanel({
            satelliteName: getSatelliteNameUI(payloadData.satellite),
            acquisitionDate: "Hasil Analisis GEE",
            cloudCoverActual: payloadData.cloudCover + "% (Max)",
            crs: "EPSG:4326",
          });
        }
      }
    } catch (error) {
      console.error("❌ Kesalahan Proses:", error);
      alert("Terjadi kesalahan pada server:\n" + error.message);
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      btnProcess.disabled = true;
      if (processLoader) processLoader.style.display = "block";
      btnText.innerText = "Komputasi Earth Engine...";
      if (resultPanel) resultPanel.style.display = "none";
    } else {
      btnProcess.disabled = false;
      if (processLoader) processLoader.style.display = "none";
      btnText.innerText = "Analisis Ulang Area";
    }
  }

  function updateResultPanel(metadata) {
    const resSat = document.getElementById("resSatellite");
    const resDate = document.getElementById("resDate");
    const resCloud = document.getElementById("resCloud");
    const resCRS = document.getElementById("resCRS");

    if (resSat) resSat.innerText = metadata.satelliteName || "-";
    if (resDate) resDate.innerText = metadata.acquisitionDate || "-";
    if (resCloud) resCloud.innerText = metadata.cloudCoverActual || "-";
    if (resCRS) resCRS.innerText = metadata.crs || "EPSG:4326";

    if (resultPanel) resultPanel.style.display = "block";
  }

  function getSatelliteNameUI(value) {
    if (value.includes("S2")) return "Sentinel-2 MSI";
    if (value.includes("LC08")) return "Landsat 8 OLI/TIRS";
    if (value.includes("LC09")) return "Landsat 9 OLI-2";
    return "Satelit Tidak Diketahui";
  }
});
