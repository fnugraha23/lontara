/* ==========================================================================
   LontaraGeo Engine - Map Logic
   Folder: frontend/js/map.js
   Fungsi: Mengatur inisiasi Leaflet, tools Leaflet.Draw (AOI), dan interaksi UI
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. INISIASI PETA & BASEMAPS
  // ==========================================

  // Set koordinat awal (Fokus area Sulawesi Selatan)
  const map = L.map("map", {
    zoomControl: false, // Dinonaktifkan untuk kustomisasi posisi
  }).setView([-5.15, 119.55], 10);

  // Memindahkan Zoom Control ke pojok kanan atas agar tidak bertabrakan dengan tool Draw
  L.control.zoom({ position: "topright" }).addTo(map);

  // Pilihan Basemap 1: Carto Light (Tampilan bersih untuk analisis)
  const cartoLight = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    },
  );

  // Pilihan Basemap 2: Citra Satelit Esri
  const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 19,
    },
  );

  // Tambahkan basemap default
  cartoLight.addTo(map);

  const baseMaps = {
    "Peta Dasar (Bersih)": cartoLight,
    "Citra Satelit": satellite,
  };
  L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

  // ==========================================
  // 2. KONTROL MENGGAMBAR (LEAFLET.DRAW)
  // ==========================================

  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    position: "topleft",
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
    draw: {
      polygon: {
        allowIntersection: false, // Mencegah poligon menyilang (GEE mensyaratkan poligon bersih)
        shapeOptions: {
          color: "#00b8a9",
          weight: 3,
          fillOpacity: 0, // PERBAIKAN: Dibuat transparan agar tidak menutupi hasil citra satelit
        },
      },
      rectangle: {
        shapeOptions: {
          color: "#00b8a9",
          weight: 3,
          fillOpacity: 0, // PERBAIKAN: Dibuat transparan
        },
      },
      polyline: false,
      circle: false,
      marker: false,
      circlemarker: false,
    },
  });
  map.addControl(drawControl);

  // ==========================================
  // 3. VARIABEL GLOBAL
  // ==========================================
  window.currentAOI = null;
  window.geeResultLayer = null;

  // ==========================================
  // 4. FUNGSI UPDATE UI SIDEBAR
  // ==========================================
  function updateSidebarUI(hasAOI) {
    const btnProcess = document.getElementById("btnProcess");
    const btnText = document.getElementById("btnText");
    const hintBox = document.getElementById("aoiStatus");
    const resultPanel = document.getElementById("resultPanel");

    if (hasAOI) {
      if (btnProcess) btnProcess.disabled = false;
      if (btnText) btnText.innerText = "Mulai Analisis GEE";
      if (hintBox) {
        hintBox.classList.add("active");
        hintBox.innerHTML =
          "<strong>✅ Area Terpilih</strong><br>Batas analisis spasial siap diproses.";
      }
      if (resultPanel) resultPanel.style.display = "none";
    } else {
      if (btnProcess) btnProcess.disabled = true;
      if (btnText) btnText.innerText = "Pilih AOI di Peta Dulu";
      if (hintBox) {
        hintBox.classList.remove("active");
        hintBox.innerHTML =
          "<strong>1. Tentukan Area (AOI)</strong><br>Gunakan alat gambar poligon di pojok kiri atas peta.";
      }
      if (resultPanel) resultPanel.style.display = "none";
    }
  }

  // ==========================================
  // 5. EVENT LISTENER UNTUK DRAWING
  // ==========================================

  map.on(L.Draw.Event.CREATED, function (e) {
    drawnItems.clearLayers();
    const layer = e.layer;

    // Memastikan styling tetap transparan saat baru dibuat
    layer.setStyle({ fillOpacity: 0 });

    drawnItems.addLayer(layer);
    window.currentAOI = layer.toGeoJSON();
    updateSidebarUI(true);
  });

  map.on(L.Draw.Event.EDITED, function (e) {
    drawnItems.eachLayer(function (layer) {
      window.currentAOI = layer.toGeoJSON();
    });
    const resPanel = document.getElementById("resultPanel");
    if (resPanel) resPanel.style.display = "none";
  });

  map.on(L.Draw.Event.DELETED, function (e) {
    if (drawnItems.getLayers().length === 0) {
      window.currentAOI = null;
      if (window.geeResultLayer) {
        map.removeLayer(window.geeResultLayer);
        window.geeResultLayer = null;
      }
      updateSidebarUI(false);
    }
  });

  // ==========================================
  // 6. RENDER LAYER DARI GEE (Dipanggil oleh api.js)
  // ==========================================
  window.renderGEELayer = function (tileUrl) {
    if (window.geeResultLayer) {
      map.removeLayer(window.geeResultLayer);
    }

    window.geeResultLayer = L.tileLayer(tileUrl, {
      attribution:
        'Map Data &copy; <a href="https://earthengine.google.com/">Google Earth Engine</a>',
      maxZoom: 19,
      opacity: 0.9,
    }).addTo(map);

    // Memastikan citra satelit berada di tumpukan paling atas agar tidak tertutup basemap
    window.geeResultLayer.bringToFront();
  };
});
