const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  // Login
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password harus diisi'
        });
      }

      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      connection.release();

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      if (user.status !== 'aktif') {
        return res.status(403).json({
          success: false,
          message: 'Akun Anda telah dinonaktifkan'
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          username: user.username,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Register (hanya superadmin)
  static async register(req, res) {
    try {
      const { username, email, password, nama_lengkap, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, dan password harus diisi'
        });
      }

      const connection = await pool.getConnection();
      
      // Check if username already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUsers.length > 0) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Username atau email sudah terdaftar'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password, nama_lengkap, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, nama_lengkap || username, role || 'admin']
      );

      connection.release();

      res.status(201).json({
        success: true,
        message: 'User berhasil dibuat',
        data: {
          id: result.insertId,
          username,
          email,
          nama_lengkap,
          role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT id, username, email, nama_lengkap, role, status FROM users WHERE id = ?',
        [req.user.id]
      );
      connection.release();

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: users[0]
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password lama dan password baru harus diisi'
        });
      }

      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT password FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, users[0].password);

      if (!isPasswordValid) {
        connection.release();
        return res.status(401).json({
          success: false,
          message: 'Password lama tidak sesuai'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await connection.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, req.user.id]
      );

      connection.release();

      res.json({
        success: true,
        message: 'Password berhasil diubah'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
