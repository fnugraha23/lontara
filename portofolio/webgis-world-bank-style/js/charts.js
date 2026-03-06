/* ========================================================
   File: js/charts.js
   Fungsi: Menginisiasi dan memperbarui visualisasi grafik Chart.js
======================================================== */

// Mengatur font default untuk semua grafik agar seragam dengan template
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#4b5563"; // Warna teks abu-abu gelap (Tailwind gray-600)

// ==========================================
// 1. INISIASI GRAFIK TUTUPAN LAHAN (DOUGHNUT)
// ==========================================
const ctxPie = document.getElementById("landUseChart").getContext("2d");
let landUseChart = new Chart(ctxPie, {
  type: "doughnut",
  data: {
    labels: [
      "Hutan",
      "Pertanian Campuran",
      "Pemukiman",
      "Semak Belukar",
      "Sawah",
    ],
    datasets: [
      {
        data: [35, 25, 10, 15, 15],
        backgroundColor: [
          "#166534",
          "#ca8a04",
          "#dc2626",
          "#84cc16",
          "#22c55e",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%", // Membuat lubang tengah lebih besar agar elegan
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 12, usePointStyle: true, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return " " + context.label + ": " + context.raw + "%";
          },
        },
      },
    },
  },
});

// ==========================================
// 2. INISIASI GRAFIK INDEKS KERENTANAN (BAR)
// ==========================================
const ctxBar = document.getElementById("vulnerabilityChart").getContext("2d");
let vulnerabilityChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: ["Limpasan Permukaan", "Erosi Tanah", "Kualitas Air"],
    datasets: [
      {
        label: "Skor Kerentanan",
        data: [75, 60, 40],
        backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"],
        borderRadius: 4, // Membuat ujung bar sedikit melengkung
      },
    ],
  },
  options: {
    indexAxis: "y", // Mengubah menjadi bar horizontal
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: { display: false }, // Menghilangkan garis grid vertikal
      },
      y: {
        grid: { borderDash: [2, 4] }, // Garis grid horizontal putus-putus
      },
    },
    plugins: {
      legend: { display: false }, // Menyembunyikan legenda karena hanya 1 dataset
    },
  },
});

// ==========================================
// 3. INISIASI GRAFIK FAKTOR PENENTU (RADAR)
// ==========================================
const ctxRadar = document.getElementById("radarChart").getContext("2d");
let radarChart = new Chart(ctxRadar, {
  type: "radar",
  data: {
    labels: [
      "Kelerengan",
      "Curah Hujan",
      "Jenis Tanah",
      "Vegetasi",
      "Aktivitas Manusia",
    ],
    datasets: [
      {
        label: "Bobot Pengaruh",
        data: [80, 70, 65, 40, 55],
        backgroundColor: "rgba(22, 101, 52, 0.2)", // Hijau transparan
        borderColor: "#166534",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#166534",
        pointHoverBackgroundColor: "#166534",
        pointHoverBorderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(0,0,0,0.1)" },
        grid: { color: "rgba(0,0,0,0.1)" },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false, stepSize: 20 }, // Menyembunyikan angka di tengah jaring
        pointLabels: {
          font: { size: 10, family: "'Inter', sans-serif" },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  },
});

// ==========================================
// 4. FUNGSI PEMBARUAN DATA (INTERAKTIVITAS)
// ==========================================
// Fungsi ini disiapkan untuk dipanggil dari map.js saat poligon di peta diklik
function updateDashboardCharts(properties) {
  if (!properties) return;

  // Contoh: Memperbarui data radar chart berdasarkan properti GeoJSON
  // Pastikan properti GeoJSON Anda memiliki key yang sesuai (misal: p_kelerengan)
  if (properties.p_kelerengan !== undefined) {
    radarChart.data.datasets[0].data = [
      properties.p_kelerengan,
      properties.p_hujan,
      properties.p_tanah,
      properties.p_vegetasi,
      properties.p_manusia,
    ];
    radarChart.update(); // Memicu animasi perubahan grafik
  }

  // Anda bisa menambahkan logika pembaruan untuk landUseChart dan vulnerabilityChart di sini
  // mengikuti format update di atas.
}
