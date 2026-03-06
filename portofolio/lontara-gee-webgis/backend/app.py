import os
import ee
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google.oauth2 import service_account

# 1. Muat konfigurasi dari file .env
load_dotenv()

# 2. Inisialisasi Aplikasi Flask
app = Flask(__name__)

# Aktifkan CORS agar frontend (index.html) diizinkan mengambil data dari backend
CORS(app)

# ==========================================
# INISIALISASI GOOGLE EARTH ENGINE
# ==========================================
def init_gee():
    try:
        # Ambil path file kredensial dan Project ID dari .env
        key_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        project_id = os.environ.get('EE_PROJECT_ID')

        if not key_path or not project_id:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS atau EE_PROJECT_ID tidak ditemukan di .env")

        # Baca file credentials.json sebagai Service Account
        credentials = service_account.Credentials.from_service_account_file(key_path)
        
        # Berikan izin/scope khusus untuk mengakses Earth Engine API
        scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/earthengine'])

        # Hubungkan ke Earth Engine menggunakan Service Account dan Project ID
        ee.Initialize(credentials=scoped_credentials, project=project_id)
        
        print("✅ Berhasil terhubung ke Google Earth Engine dengan Service Account!")
        
    except Exception as e:
        print("\n⚠️ Gagal inisialisasi GEE.")
        print(f"Detail error: {e}")
        print("Pastikan file credentials.json ada di folder backend dan nama file di .env sudah benar.\n")

# Panggil fungsi inisialisasi saat aplikasi pertama kali dijalankan
init_gee()

# ==========================================
# IMPORT MODUL PEMROSESAN GEE LOKAL
# ==========================================
try:
    import gee_modules
except ImportError:
    gee_modules = None
    print("⚠️ Peringatan: File gee_modules.py belum ditemukan atau ada error di dalamnya.")

# ==========================================
# ROUTING / ENDPOINT API
# ==========================================

@app.route('/', methods=['GET'])
def home():
    """Endpoint dasar untuk mengecek apakah server aktif."""
    return jsonify({
        "status": "success",
        "message": "Backend LontaraGeo (Flask) aktif dan siap memproses data GEE!"
    })

@app.route('/api/process-image', methods=['POST'])
def process_image():
    """Endpoint utama untuk menerima data poligon & parameter dari antarmuka WebGIS."""
    try:
        # Tangkap data JSON yang dikirimkan oleh file javascript frontend
        params = request.get_json()
        
        if not params:
            return jsonify({"status": "error", "error": "Tidak ada parameter yang dikirim dari peta"}), 400

        # Jika gee_modules.py sudah terhubung dengan baik
        if gee_modules:
            # CATATAN: Sesuaikan nama fungsi 'process_satellite_data' dengan 
            # nama fungsi utama yang ada di dalam file gee_modules.py Anda.
            # 
            result = gee_modules.process_satellite_data(params)
            return jsonify(result)
            
            return jsonify({
                "status": "success",
                "message": "Endpoint siap. Silakan buka comment pemanggilan gee_modules di app.py"
            })
        else:
            return jsonify({
                "status": "error", 
                "error": "Modul gee_modules.py tidak tersedia di server."
            }), 500

    except Exception as e:
        print(f"Error saat memproses data: {e}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

# ==========================================
# JALANKAN SERVER
# ==========================================
if __name__ == '__main__':
    # Mode debug=True membuat server otomatis me-restart diri jika ada file yang di-save
    app.run(debug=True, host='127.0.0.1', port=5000)