# Aplikasi Manajemen Jemaat

Sistem informasi terpadu untuk mengelola data jemaat gereja secara efisien dan terorganisir.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Menggunakan](#cara-menggunakan)
- [Struktur Proyek](#struktur-proyek)
- [API Documentation](#api-documentation)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## ✨ Fitur Utama

### 1. Manajemen Keluarga
- Tambah, edit, dan hapus data keluarga
- Input data orang tua (bapak & ibu)
- Pencatatan nomor identitas dan data pribadi
- Generate Kartu Keluarga (PDF)
- Kategorisasi berdasarkan sektor

### 2. Tracking Ulang Tahun
- Lihat daftar jemaat yang ulang tahun
- Filter berdasarkan range tanggal
- Hitung usia secara otomatis
- Tampilkan kategori berdasarkan jenis kelamin
- Sortir berdasarkan sektor

### 3. Pencatatan Meninggal
- Rekam data jemaat yang meninggal
- Filter berdasarkan bulan dan tahun
- Hitung umur saat meninggal
- Tracking data historis
- Generate laporan

### 4. Dashboard
- Statistik total keluarga
- Info ulang tahun bulan ini
- Info meninggal bulan ini
- Quick access ke semua fitur

### 5. Keamanan
- Authentication dengan JWT Token
- Role-based access control
- Password encryption
- Session management

## 🛠 Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **Bootstrap 5** - UI Framework
- **JavaScript (ES6+)** - Client logic
- **Fetch API** - HTTP requests

## 📦 Instalasi

### Prerequisites
- Node.js v14.x atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- npm atau yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/ronimor4/aplikasi-management-jemaat.git
cd aplikasi-management-jemaat
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (jika ada)
cd ../frontend
npm install
```

### Step 3: Setup Database

```bash
# Import database schema
mysql -u root -p < database/schema.sql
```

### Step 4: Konfigurasi Environment

Lihat bagian [Konfigurasi](#konfigurasi) di bawah

### Step 5: Jalankan Aplikasi

```bash
# Terminal 1: Jalankan Backend
cd backend
npm start

# Terminal 2: Jalankan Frontend (jika diperlukan)
cd frontend
npm start

# Atau buka public/index.html di browser
```

## ⚙️ Konfigurasi

### Backend Configuration (.env)

Buat file `.env` di folder `backend`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jemaat_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:8000

# Email Configuration (opsional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend Configuration

File `public/js/api.js` sudah dikonfigurasi dengan:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Jika mengubah URL backend, update di file ini.

## 🚀 Cara Menggunakan

### Login
1. Buka `http://localhost:8000/login.html`
2. Masukkan username dan password
3. Klik tombol "Masuk"
4. (Opsional) Centang "Ingat saya" untuk auto-fill next time

### Dashboard
Setelah login, Anda akan melihat dashboard dengan:
- Total keluarga yang terdaftar
- Jumlah ulang tahun bulan ini
- Jumlah meninggal bulan ini

### Manajemen Keluarga
1. Klik "Lihat Data" pada card Keluarga
2. Gunakan tombol "+" untuk tambah keluarga baru
3. Klik edit (✏) untuk mengubah data
4. Klik delete (🗑) untuk menghapus
5. Klik view (👁) untuk detail lengkap
6. Klik PDF (📄) untuk generate Kartu Keluarga

### Filter Ulang Tahun
1. Buka halaman Ulang Tahun
2. Pilih rentang tanggal (awal dan akhir)
3. Klik "Filter" untuk melihat data

### Filter Meninggal
1. Buka halaman Meninggal
2. Pilih bulan dan tahun
3. Klik "Filter" untuk melihat data

## 📁 Struktur Proyek

```
aplikasi-management-jemaat/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── keluargaController.js
│   │   ├── jemaatController.js
│   │   └── kartuKeluargaController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── keluarga.js
│   │   ├── jemaat.js
│   │   └── kartuKeluarga.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├─── models/
│   │   ├── User.js
│   │   ├── Keluarga.js
│   │   └── Jemaat.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   ├── server.js
│   └── package.json
├── public/
│   ├── index.html
│   ├── login.html
│   ├── keluarga.html
│   ├── ulang-tahun.html
│   ├── meninggal.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── keluarga.js
│       ├── ulang-tahun.js
│       └── meninggal.js
├── README.md
├── .gitignore
└── package.json
```

## 📚 API Documentation

Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk dokumentasi lengkap semua endpoint.

### Ringkasan Endpoint

#### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

#### Keluarga
- `GET /api/keluarga` - Get all keluarga
- `GET /api/keluarga/:id` - Get keluarga by ID
- `POST /api/keluarga` - Create keluarga baru
- `PUT /api/keluarga/:id` - Update keluarga
- `DELETE /api/keluarga/:id` - Delete keluarga

#### Jemaat
- `GET /api/jemaat` - Get all jemaat
- `GET /api/ulang-tahun` - Get jemaat ulang tahun (filter by date range)
- `GET /api/meninggal` - Get jemaat meninggal (filter by month/year)

#### Kartu Keluarga
- `GET /api/kartu-keluarga/generate/:keluargaId` - Generate Kartu Keluarga PDF

## 🔒 Keamanan

### Best Practices yang Diimplementasikan

1. **Password Hashing**
   - Menggunakan bcrypt untuk hashing password
   - Salt rounds: 10

2. **JWT Authentication**
   - Token expiry: 7 hari
   - Secure headers

3. **Input Validation**
   - Server-side validation untuk semua input
   - SQL injection prevention

4. **CORS Protection**
   - Whitelist origin tertentu
   - Preflight requests handling

5. **Environment Variables**
   - Sensitive data di .env file
   - Never commit .env ke git

## 🧪 Testing

### Menggunakan Postman

1. Import collection dari file `postman/collection.json`
2. Setup environment variables
3. Run requests

### Testing Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

## 📖 Dokumentasi Lebih Lanjut

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./database/schema.sql)
- [Setup Guide](./CONFIGURATION.md)

## 🐛 Bug Report & Feature Request

Jika Anda menemukan bug atau ingin mengusulkan fitur baru, silakan buat issue di [GitHub Issues](https://github.com/ronimor4/aplikasi-management-jemaat/issues).

## 👥 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📧 Kontak

- Author: ronimor4
- Email: ronimor4@gmail.com
- GitHub: [@ronimor4](https://github.com/ronimor4)

---

**Terima kasih telah menggunakan Aplikasi Manajemen Jemaat!** 🙏
