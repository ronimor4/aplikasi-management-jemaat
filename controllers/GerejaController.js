const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

class GerejaController {
  // Get gereja data
  static async getGereja(req, res) {
    try {
      const connection = await pool.getConnection();
      const [gereja] = await connection.execute('SELECT * FROM gereja LIMIT 1');
      connection.release();

      if (gereja.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Data gereja belum ada'
        });
      }

      const data = gereja[0];
      if (data.logo_gereja) {
        data.logo_gereja = data.logo_gereja.toString('base64');
      }

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get gereja error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Create or update gereja data
  static async saveGereja(req, res) {
    try {
      const { nama_gereja, alamat_gereja, nama_pimpinan, logo_gereja } = req.body;

      if (!nama_gereja || !alamat_gereja || !nama_pimpinan) {
        return res.status(400).json({
          success: false,
          message: 'Nama gereja, alamat, dan nama pimpinan harus diisi'
        });
      }

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM gereja LIMIT 1');

      let logoData = null;
      let logoFilename = null;

      // Handle logo upload
      if (logo_gereja && logo_gereja.startsWith('data:')) {
        const matches = logo_gereja.match(/data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches) {
          logoData = Buffer.from(matches[2], 'base64');
          logoFilename = `logo_${Date.now()}.png`;
        }
      }

      if (existing.length > 0) {
        // Update
        const query = logoData
          ? 'UPDATE gereja SET nama_gereja = ?, alamat_gereja = ?, nama_pimpinan = ?, logo_gereja = ?, logo_filename = ? WHERE id = ?'
          : 'UPDATE gereja SET nama_gereja = ?, alamat_gereja = ?, nama_pimpinan = ? WHERE id = ?';

        const params = logoData
          ? [nama_gereja, alamat_gereja, nama_pimpinan, logoData, logoFilename, existing[0].id]
          : [nama_gereja, alamat_gereja, nama_pimpinan, existing[0].id];

        await connection.execute(query, params);
      } else {
        // Create
        await connection.execute(
          'INSERT INTO gereja (nama_gereja, alamat_gereja, nama_pimpinan, logo_gereja, logo_filename) VALUES (?, ?, ?, ?, ?)',
          [nama_gereja, alamat_gereja, nama_pimpinan, logoData, logoFilename]
        );
      }

      connection.release();

      res.json({
        success: true,
        message: 'Data gereja berhasil disimpan'
      });
    } catch (error) {
      console.error('Save gereja error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = GerejaController;
