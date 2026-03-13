/* ========================================================
   File: js/map.js
   Fungsi: Mengatur inisiasi peta Leaflet dan memuat data spasial
======================================================== */

// 1. Inisiasi Peta
// Mengatur koordinat awal ke area Sub-DAS Tanralili, Sulawesi Selatan
const map = L.map("map").setView([-5.15, 119.55], 11);

// 2. Pilihan Basemap
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors",
});

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 18,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
);

// Menambahkan basemap default ke peta
osm.addTo(map);

// Kontrol Layer untuk mengganti basemap
const baseMaps = {
  OpenStreetMap: osm,
  "Citra Satelit": satellite,
};
L.control.layers(baseMaps).addTo(map);

// 3. Fungsi Pewarnaan Poligon Berdasarkan Klasifikasi Lahan (Hasil Prediksi ML)
function getColor(kelasLahan) {
  switch (kelasLahan) {
    case "Hutan":
      return "#166534"; // Hijau tua
    case "Pertanian Campuran":
      return "#ca8a04"; // Kuning kecoklatan
    case "Pemukiman":
      return "#dc2626"; // Merah
    case "Semak Belukar":
      return "#84cc16"; // Hijau muda
    case "Sawah":
      return "#22c55e"; // Hijau terang
    default:
      return "#9ca3af"; // Abu-abu (Tidak terklasifikasi)
  }
}

// 4. Pengaturan Gaya (Style) Poligon
function stylePoligon(feature) {
  return {
    fillColor: getColor(feature.properties.kelas_lahan),
    weight: 1.5,
    opacity: 1,
    color: "white", // Warna garis batas poligon
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

// 5. Interaksi saat Poligon Diklik (Highlight & Popup)
function onEachFeature(feature, layer) {
  // Menyiapkan konten Popup
  if (feature.properties) {
    let popupContent = `
            <div class="font-bold text-green-800 mb-2 border-b border-green-200 pb-1">Detail Area Pengamatan</div>
            <table class="w-full text-sm">
                <tr><td class="font-semibold pr-2">Kelas Lahan:</td><td>${feature.properties.kelas_lahan || "N/A"}</td></tr>
                <tr><td class="font-semibold pr-2">Luas (Ha):</td><td>${feature.properties.luas || "N/A"}</td></tr>
                <tr><td class="font-semibold pr-2">Prediksi Limpasan (C):</td><td>${feature.properties.koefisien_limpasan || "N/A"}</td></tr>
            </table>
        `;
    layer.bindPopup(popupContent);
  }

  // Menambahkan efek visual saat mouse diarahkan ke poligon (Hover)
  layer.on({
    mouseover: function (e) {
      let layerTarget = e.target;
      layerTarget.setStyle({
        weight: 3,
        color: "#111827", // Garis batas menjadi hitam tebal
        dashArray: "",
        fillOpacity: 0.9,
      });
      layerTarget.bringToFront();
    },
    mouseout: function (e) {
      // Mengembalikan ke gaya semula
      geojsonLayer.resetStyle(e.target);
    },
    click: function (e) {
      // Memusatkan peta ke poligon yang diklik
      map.fitBounds(e.target.getBounds());

      // NANTINYA: Panggil fungsi dari charts.js untuk memperbarui grafik
      // berdasarkan data dari feature.properties poligon ini.
      // Contoh: updateDashboardCharts(feature.properties);
    },
  });
}

// 6. Memuat Data Spasial GeoJSON
let geojsonLayer;

fetch("data/batas_subdas.geojson")
  .then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    geojsonLayer = L.geoJSON(data, {
      style: stylePoligon,
      onEachFeature: onEachFeature,
    }).addTo(map);

    // Menyesuaikan tampilan peta agar mencakup seluruh wilayah DAS secara otomatis
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch((error) => {
    console.warn(
      "GeoJSON belum tersedia. Menampilkan peta kosong. Error:",
      error,
    );
    // Fallback: Tambahkan marker default jika GeoJSON gagal dimuat
    L.marker([-5.15, 119.55])
      .addTo(map)
      .bindPopup(
        "<b>Titik Pengamatan</b><br>Outlet Sub-DAS (Menunggu data spasial).",
      )
      .openPopup();
  });
