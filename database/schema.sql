-- Database for Management Data Jemaat Gereja
CREATE DATABASE IF NOT EXISTS jemaat_gereja;
USE jemaat_gereja;

-- Table: Users (Admin)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(150),
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Gereja
CREATE TABLE IF NOT EXISTS gereja (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_gereja VARCHAR(255) NOT NULL,
  alamat_gereja TEXT NOT NULL,
  nama_pimpinan VARCHAR(150) NOT NULL,
  logo_gereja LONGBLOB,
  logo_filename VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Sektor
CREATE TABLE IF NOT EXISTS sektor (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_sektor VARCHAR(100) NOT NULL UNIQUE,
  nama_ketua INT,
  nama_sekretaris INT,
  nama_bendahara INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (nama_ketua) REFERENCES jemaat(id),
  FOREIGN KEY (nama_sekretaris) REFERENCES jemaat(id),
  FOREIGN KEY (nama_bendahara) REFERENCES jemaat(id)
);

-- Table: Jemaat
CREATE TABLE IF NOT EXISTS jemaat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_lengkap VARCHAR(150) NOT NULL,
  sektor_id INT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin ENUM('Pria', 'Wanita') NOT NULL,
  pekerjaan VARCHAR(100),
  peran_keluarga VARCHAR(50) NOT NULL,
  no_hp VARCHAR(20),
  alamat TEXT,
  tanggal_baptis DATE,
  tanggal_sidi VARCHAR(50),
  tanggal_nikah DATE,
  jenis_jemaat ENUM('Jemaat Penuh', 'Jemaat Persiapan') NOT NULL,
  status_jemaat ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
  status_meninggal ENUM('Tidak', 'Ya') DEFAULT 'Tidak',
  tanggal_meninggal DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sektor_id) REFERENCES sektor(id),
  INDEX idx_nama_lengkap (nama_lengkap),
  INDEX idx_sektor_id (sektor_id),
  INDEX idx_jenis_kelamin (jenis_kelamin),
  INDEX idx_jenis_jemaat (jenis_jemaat),
  INDEX idx_status_jemaat (status_jemaat),
  INDEX idx_tanggal_lahir (tanggal_lahir),
  INDEX idx_tanggal_meninggal (tanggal_meninggal)
);

-- Add Foreign Key for Sektor after Jemaat is created
ALTER TABLE sektor ADD FOREIGN KEY (nama_ketua) REFERENCES jemaat(id) ON DELETE SET NULL;
ALTER TABLE sektor ADD FOREIGN KEY (nama_sekretaris) REFERENCES jemaat(id) ON DELETE SET NULL;
ALTER TABLE sektor ADD FOREIGN KEY (nama_bendahara) REFERENCES jemaat(id) ON DELETE SET NULL;

-- Table: Keluarga (untuk mengelompokkan anggota keluarga)
CREATE TABLE IF NOT EXISTS keluarga (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sektor_id INT NOT NULL,
  bapak_id INT,
  ibu_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sektor_id) REFERENCES sektor(id) ON DELETE CASCADE,
  FOREIGN KEY (bapak_id) REFERENCES jemaat(id) ON DELETE CASCADE,
  FOREIGN KEY (ibu_id) REFERENCES jemaat(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_jemaat_sektor ON jemaat(sektor_id);
CREATE INDEX idx_keluarga_bapak ON keluarga(bapak_id);
CREATE INDEX idx_keluarga_ibu ON keluarga(ibu_id);
