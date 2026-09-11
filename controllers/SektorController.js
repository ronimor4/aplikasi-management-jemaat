const pool = require('../config/database');

class SektorController {
  // Get all sektor
  static async getAllSektor(req, res) {
    try {
      const connection = await pool.getConnection();
      const [sektor] = await connection.execute(`
        SELECT 
          s.id, 
          s.nama_sektor,
          s.nama_ketua,
          s.nama_sekretaris,
          s.nama_bendahara,
          jk.nama_lengkap as nama_ketua_text,
          js.nama_lengkap as nama_sekretaris_text,
          jb.nama_lengkap as nama_bendahara_text
        FROM sektor s
        LEFT JOIN jemaat jk ON s.nama_ketua = jk.id
        LEFT JOIN jemaat js ON s.nama_sekretaris = js.id
        LEFT JOIN jemaat jb ON s.nama_bendahara = jb.id
        ORDER BY s.nama_sektor ASC
      `);
      connection.release();

      res.json({
        success: true,
        data: sektor
      });
    } catch (error) {
      console.error('Get all sektor error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Get sektor by ID
  static async getSektorById(req, res) {
    try {
      const { id } = req.params;
      const connection = await pool.getConnection();
      const [sektor] = await connection.execute(`
        SELECT 
          s.id, 
          s.nama_sektor,
          s.nama_ketua,
          s.nama_sekretaris,
          s.nama_bendahara,
          jk.nama_lengkap as nama_ketua_text,
          js.nama_lengkap as nama_sekretaris_text,
          jb.nama_lengkap as nama_bendahara_text
        FROM sektor s
        LEFT JOIN jemaat jk ON s.nama_ketua = jk.id
        LEFT JOIN jemaat js ON s.nama_sekretaris = js.id
        LEFT JOIN jemaat jb ON s.nama_bendahara = jb.id
        WHERE s.id = ?
      `, [id]);
      connection.release();

      if (sektor.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sektor tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: sektor[0]
      });
    } catch (error) {
      console.error('Get sektor by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Create sektor
  static async createSektor(req, res) {
    try {
      const { nama_sektor, nama_ketua, nama_sekretaris, nama_bendahara } = req.body;

      if (!nama_sektor) {
        return res.status(400).json({
          success: false,
          message: 'Nama sektor harus diisi'
        });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sektor (nama_sektor, nama_ketua, nama_sekretaris, nama_bendahara) VALUES (?, ?, ?, ?)',
        [nama_sektor, nama_ketua || null, nama_sekretaris || null, nama_bendahara || null]
      );
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Sektor berhasil ditambahkan',
        data: {
          id: result.insertId,
          nama_sektor,
          nama_ketua,
          nama_sekretaris,
          nama_bendahara
        }
      });
    } catch (error) {
      console.error('Create sektor error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Nama sektor sudah ada'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Update sektor
  static async updateSektor(req, res) {
    try {
      const { id } = req.params;
      const { nama_sektor, nama_ketua, nama_sekretaris, nama_bendahara } = req.body;

      if (!nama_sektor) {
        return res.status(400).json({
          success: false,
          message: 'Nama sektor harus diisi'
        });
      }

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM sektor WHERE id = ?', [id]);

      if (existing.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Sektor tidak ditemukan'
        });
      }

      await connection.execute(
        'UPDATE sektor SET nama_sektor = ?, nama_ketua = ?, nama_sekretaris = ?, nama_bendahara = ? WHERE id = ?',
        [nama_sektor, nama_ketua || null, nama_sekretaris || null, nama_bendahara || null, id]
      );
      connection.release();

      res.json({
        success: true,
        message: 'Sektor berhasil diubah',
        data: {
          id,
          nama_sektor,
          nama_ketua,
          nama_sekretaris,
          nama_bendahara
        }
      });
    } catch (error) {
      console.error('Update sektor error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Delete sektor
  static async deleteSektor(req, res) {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM sektor WHERE id = ?', [id]);

      if (existing.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Sektor tidak ditemukan'
        });
      }

      // Check if there are jemaat in this sektor
      const [jemaat] = await connection.execute('SELECT COUNT(*) as count FROM jemaat WHERE sektor_id = ?', [id]);
      
      if (jemaat[0].count > 0) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat menghapus sektor yang memiliki anggota jemaat'
        });
      }

      await connection.execute('DELETE FROM sektor WHERE id = ?', [id]);
      connection.release();

      res.json({
        success: true,
        message: 'Sektor berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete sektor error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = SektorController;
