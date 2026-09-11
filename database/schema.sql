-- Database Schema for Aplikasi Manajemen Jemaat
-- Created: 2024-01-15

-- Create Database
CREATE DATABASE IF NOT EXISTS jemaat_db;
USE jemaat_db;

-- ===================================
-- Users Table
-- ===================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
);

-- ===================================
-- Keluarga Table (Kepala Keluarga)
-- ===================================
CREATE TABLE IF NOT EXISTS keluarga (
  id VARCHAR(36) PRIMARY KEY,
  nama_bapak VARCHAR(100) NOT NULL,
  nama_ibu VARCHAR(100) NOT NULL,
  nomor_identitas_bapak VARCHAR(20),
  nomor_identitas_ibu VARCHAR(20),
  tempat_lahir_bapak VARCHAR(100),
  tanggal_lahir_bapak DATE,
  tempat_lahir_ibu VARCHAR(100),
  tanggal_lahir_ibu DATE,
  alamat TEXT,
  nomor_telepon VARCHAR(15),
  sektor VARCHAR(5),
  jumlah_anak INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nama_bapak (nama_bapak),
  INDEX idx_sektor (sektor),
  FULLTEXT idx_alamat (alamat)
);

-- ===================================
-- Jemaat Table (Anggota Jemaat)
-- ===================================
CREATE TABLE IF NOT EXISTS jemaat (
  id VARCHAR(36) PRIMARY KEY,
  keluarga_id VARCHAR(36) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  nomor_identitas VARCHAR(20),
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
  tempat_lahir VARCHAR(100),
  status ENUM('hidup', 'meninggal') DEFAULT 'hidup',
  tanggal_meninggal DATE NULL,
  hubungan_keluarga VARCHAR(50),
  nomor_telepon VARCHAR(15),
  email VARCHAR(100),
  alamat TEXT,
  pekerjaan VARCHAR(100),
  pendidikan VARCHAR(50),
  status_perkawinan ENUM('belum kawin', 'kawin', 'cerai hidup', 'cerai mati') DEFAULT 'belum kawin',
  tanggal_perkawinan DATE NULL,
  catatan TEXT,
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (keluarga_id) REFERENCES keluarga(id) ON DELETE CASCADE,
  INDEX idx_nama_lengkap (nama_lengkap),
  INDEX idx_tanggal_lahir (tanggal_lahir),
  INDEX idx_jenis_kelamin (jenis_kelamin),
  INDEX idx_status (status),
  INDEX idx_keluarga_id (keluarga_id),
  FULLTEXT idx_nama_alamat (nama_lengkap, alamat)
);

-- ===================================
-- Ulang Tahun (View untuk convenience)
-- ===================================
CREATE VIEW v_ulang_tahun AS
SELECT 
  j.id,
  j.keluarga_id,
  j.nama_lengkap,
  j.nomor_identitas,
  j.tanggal_lahir,
  j.jenis_kelamin,
  j.tempat_lahir,
  j.nomor_telepon,
  k.sektor,
  YEAR(CURDATE()) - YEAR(j.tanggal_lahir) - 
    (MONTH(CURDATE()) < MONTH(j.tanggal_lahir) OR 
     (MONTH(CURDATE()) = MONTH(j.tanggal_lahir) AND DAY(CURDATE()) < DAY(j.tanggal_lahir))) AS usia,
  j.created_at,
  j.updated_at
FROM jemaat j
JOIN keluarga k ON j.keluarga_id = k.id
WHERE j.status = 'hidup';

-- ===================================
-- Meninggal (View untuk convenience)
-- ===================================
CREATE VIEW v_meninggal AS
SELECT 
  j.id,
  j.keluarga_id,
  j.nama_lengkap,
  j.nomor_identitas,
  j.tanggal_lahir,
  j.tanggal_meninggal,
  j.jenis_kelamin,
  j.tempat_lahir,
  YEAR(j.tanggal_meninggal) - YEAR(j.tanggal_lahir) - 
    (MONTH(j.tanggal_meninggal) < MONTH(j.tanggal_lahir) OR 
     (MONTH(j.tanggal_meninggal) = MONTH(j.tanggal_lahir) AND DAY(j.tanggal_meninggal) < DAY(j.tanggal_lahir))) AS usia_saat_meninggal,
  k.sektor,
  j.created_at,
  j.updated_at
FROM jemaat j
JOIN keluarga k ON j.keluarga_id = k.id
WHERE j.status = 'meninggal';

-- ===================================
-- Insert Default Admin User
-- ===================================
INSERT INTO users (username, email, password, role) 
VALUES 
  ('admin', 'admin@jemaat.com', '$2b$10$1234567890123456789012345678901234567890123456789012', 'admin');

-- Note: Password hash di atas adalah placeholder
-- Gunakan bcrypt untuk hash password yang sebenarnya
-- Contoh: bcrypt('password', 10)

-- ===================================
-- Create Indexes untuk Performance
-- ===================================
CREATE INDEX idx_jemaat_status_tanggal ON jemaat(status, tanggal_lahir);
CREATE INDEX idx_jemaat_keluarga_status ON jemaat(keluarga_id, status);
CREATE INDEX idx_keluarga_sektor_created ON keluarga(sektor, created_at);
