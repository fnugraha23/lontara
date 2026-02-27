// =======================
// MAP INIT
// =======================
// Perubahan: Menambahkan opsi scrollWheelZoom: false agar tidak mengganggu scroll halaman utama
var map = L.map("map", {
  scrollWheelZoom: false,
}).setView([-5.2, 119.7], 11);

// Aktifkan zoom kembali hanya jika user mengklik peta (fokus)
map.on("focus", function () {
  map.scrollWheelZoom.enable();
});
map.on("blur", function () {
  map.scrollWheelZoom.disable();
});

// =======================
// BASEMAP
// =======================
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
});

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles &copy; Esri" },
);

satellite.addTo(map);

var baseMaps = {
  OpenStreetMap: osm,
  Satelit: satellite,
};

var overlayMaps = {};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// =======================
// LEGEND SYSTEM
// =======================
var activeLegends = {};

function renderLegend() {
  var legend = document.getElementById("legend");
  legend.innerHTML = "";

  for (var layerName in activeLegends) {
    legend.innerHTML += `<h4>${layerName}</h4>`;

    activeLegends[layerName].forEach((item) => {
      legend.innerHTML += `
        <div class="legend-item">
          <span class="legend-color" style="background:${item.color}"></span>
          ${item.label}
        </div>
      `;
    });
  }
}

// =======================
// COLOR GENERATOR
// =======================
function generateColors(values) {
  var palette = [
    "#1b9e77",
    "#d95f02",
    "#7570b3",
    "#e7298a",
    "#66a61e",
    "#e6ab02",
    "#a6761d",
    "#666666",
    "#1f78b4",
    "#b2df8a",
    "#fb9a99",
    "#fdbf6f",
  ];

  var colors = {};
  values.forEach((val, i) => {
    colors[val] = palette[i % palette.length];
  });

  return colors;
}

// =======================
// INFO PANEL UPDATE
// =======================
function updateInfo(properties) {
  var content = "<ul>";
  for (var key in properties) {
    content += `<li><b>${key}</b>: ${properties[key]}</li>`;
  }
  content += "</ul>";
  document.getElementById("info-content").innerHTML = content;
}

// =======================
// LOAD LAYER FUNCTION
// =======================
function loadUniqueLayer(path, fieldName, layerName) {
  fetch(path)
    .then((res) => res.json())
    .then((data) => {
      var uniqueSet = {};
      data.features.forEach((f) => {
        uniqueSet[f.properties[fieldName]] = true;
      });

      var uniqueValues = Object.keys(uniqueSet);
      var colors = generateColors(uniqueValues);

      var layer = L.geoJSON(data, {
        style: function (feature) {
          return {
            fillColor: colors[feature.properties[fieldName]],
            color: "#333",
            weight: 1,
            fillOpacity: 0.7,
          };
        },

        onEachFeature: function (feature, layerObj) {
          layerObj.on({
            mouseover: function (e) {
              e.target.setStyle({
                weight: 3,
                color: "#000",
              });
            },
            mouseout: function (e) {
              layer.resetStyle(e.target);
            },
            click: function (e) {
              updateInfo(feature.properties);
            },
          });
        },
      });

      overlayMaps[layerName] = layer;
      layerControl.addOverlay(layer, layerName);

      layer.on("add", function () {
        activeLegends[layerName] = uniqueValues.map((val) => ({
          label: val,
          color: colors[val],
        }));

        renderLegend();
        // map.fitBounds(layer.getBounds()); // Matikan ini jika tidak ingin peta bergeser otomatis saat layer baru nyala di Home
      });

      layer.on("remove", function () {
        delete activeLegends[layerName];
        renderLegend();
      });
    });
}

// =======================
// LOAD DATA
// =======================
loadUniqueLayer("data/PL_KLHK_2024.geojson", "PL_2024", "LULC");
// loadUniqueLayer("data/Tanah_BBSDLP.geojson", "JNTNH1", "Tanah");
loadUniqueLayer("data/Geologi_Regional_ESDM.geojson", "FORMASI", "Geologi");
// loadUniqueLayer("data/RTRW_ATRBPN.geojson", "NAMOBJ", "RTRW");
