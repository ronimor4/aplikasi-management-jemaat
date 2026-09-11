const pool = require('../config/database');
const moment = require('moment');

class JemaatController {
  // Get all jemaat with filters
  static async getAllJemaat(req, res) {
    try {
      const { nama_lengkap, sektor_id, jenis_kelamin, jenis_jemaat, status_jemaat, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          j.id,
          j.nama_lengkap,
          j.sektor_id,
          s.nama_sektor,
          j.tanggal_lahir,
          j.jenis_kelamin,
          j.pekerjaan,
          j.peran_keluarga,
          j.no_hp,
          j.alamat,
          j.tanggal_baptis,
          j.tanggal_sidi,
          j.tanggal_nikah,
          j.jenis_jemaat,
          j.status_jemaat,
          j.status_meninggal,
          j.tanggal_meninggal
        FROM jemaat j
        JOIN sektor s ON j.sektor_id = s.id
        WHERE j.status_meninggal = 'Tidak'
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM jemaat j WHERE j.status_meninggal = "Tidak"';
      let params = [];

      if (nama_lengkap) {
        query += ' AND j.nama_lengkap LIKE ?';
        countQuery += ' AND j.nama_lengkap LIKE ?';
        params.push(`%${nama_lengkap}%`);
      }

      if (sektor_id) {
        query += ' AND j.sektor_id = ?';
        countQuery += ' AND j.sektor_id = ?';
        params.push(sektor_id);
      }

      if (jenis_kelamin) {
        query += ' AND j.jenis_kelamin = ?';
        countQuery += ' AND j.jenis_kelamin = ?';
        params.push(jenis_kelamin);
      }

      if (jenis_jemaat) {
        query += ' AND j.jenis_jemaat = ?';
        countQuery += ' AND j.jenis_jemaat = ?';
        params.push(jenis_jemaat);
      }

      if (status_jemaat) {
        query += ' AND j.status_jemaat = ?';
        countQuery += ' AND j.status_jemaat = ?';
        params.push(status_jemaat);
      }

      query += ' ORDER BY j.nama_lengkap ASC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const connection = await pool.getConnection();
      const [data] = await connection.execute(query, params);
      const [countResult] = await connection.execute(countQuery, params.slice(0, -2));
      connection.release();

      res.json({
        success: true,
        data,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].total / limit)
        }
      });
    } catch (error) {
      console.error('Get all jemaat error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Get jemaat by ID
  static async getJemaatById(req, res) {
    try {
      const { id } = req.params;
      const connection = await pool.getConnection();
      const [jemaat] = await connection.execute(
        'SELECT * FROM jemaat WHERE id = ?',
        [id]
      );
      connection.release();

      if (jemaat.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Jemaat tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: jemaat[0]
      });
    } catch (error) {
      console.error('Get jemaat by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Create jemaat
  static async createJemaat(req, res) {
    try {
      const {
        nama_lengkap,
        sektor_id,
        tanggal_lahir,
        jenis_kelamin,
        pekerjaan,
        peran_keluarga,
        no_hp,
        alamat,
        tanggal_baptis,
        tanggal_sidi,
        tanggal_nikah,
        jenis_jemaat,
        status_jemaat,
        status_meninggal,
        tanggal_meninggal
      } = req.body;

      // Validation
      if (!nama_lengkap || !sektor_id || !tanggal_lahir || !jenis_kelamin || !peran_keluarga) {
        return res.status(400).json({
          success: false,
          message: 'Data wajib harus diisi'
        });
      }

      // Determine jenis_jemaat based on tanggal_sidi
      let finalJenisjemaat = jenis_jemaat;
      if (!finalJenisjemaat) {
        if (tanggal_sidi && tanggal_sidi !== 'Belum') {
          finalJenisjemaat = 'Jemaat Penuh';
        } else {
          finalJenisjemaat = 'Jemaat Persiapan';
        }
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(`
        INSERT INTO jemaat (
          nama_lengkap, sektor_id, tanggal_lahir, jenis_kelamin, pekerjaan,
          peran_keluarga, no_hp, alamat, tanggal_baptis, tanggal_sidi,
          tanggal_nikah, jenis_jemaat, status_jemaat, status_meninggal, tanggal_meninggal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        nama_lengkap,
        sektor_id,
        tanggal_lahir,
        jenis_kelamin,
        pekerjaan || null,
        peran_keluarga,
        no_hp || null,
        alamat || null,
        tanggal_baptis || null,
        tanggal_sidi || null,
        tanggal_nikah || null,
        finalJenisjemaat,
        status_jemaat || 'Aktif',
        status_meninggal || 'Tidak',
        tanggal_meninggal || null
      ]);
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Jemaat berhasil ditambahkan',
        data: {
          id: result.insertId
        }
      });
    } catch (error) {
      console.error('Create jemaat error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Update jemaat
  static async updateJemaat(req, res) {
    try {
      const { id } = req.params;
      const {
        nama_lengkap,
        sektor_id,
        tanggal_lahir,
        jenis_kelamin,
        pekerjaan,
        peran_keluarga,
        no_hp,
        alamat,
        tanggal_baptis,
        tanggal_sidi,
        tanggal_nikah,
        jenis_jemaat,
        status_jemaat,
        status_meninggal,
        tanggal_meninggal
      } = req.body;

      if (!nama_lengkap || !sektor_id || !tanggal_lahir || !jenis_kelamin || !peran_keluarga) {
        return res.status(400).json({
          success: false,
          message: 'Data wajib harus diisi'
        });
      }

      // Determine jenis_jemaat based on tanggal_sidi
      let finalJenisjemaat = jenis_jemaat;
      if (!finalJenisjemaat) {
        if (tanggal_sidi && tanggal_sidi !== 'Belum') {
          finalJenisjemaat = 'Jemaat Penuh';
        } else {
          finalJenisjemaat = 'Jemaat Persiapan';
        }
      }

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM jemaat WHERE id = ?', [id]);

      if (existing.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Jemaat tidak ditemukan'
        });
      }

      await connection.execute(`
        UPDATE jemaat SET
          nama_lengkap = ?, sektor_id = ?, tanggal_lahir = ?, jenis_kelamin = ?,
          pekerjaan = ?, peran_keluarga = ?, no_hp = ?, alamat = ?,
          tanggal_baptis = ?, tanggal_sidi = ?, tanggal_nikah = ?,
          jenis_jemaat = ?, status_jemaat = ?, status_meninggal = ?, tanggal_meninggal = ?
        WHERE id = ?
      `, [
        nama_lengkap,
        sektor_id,
        tanggal_lahir,
        jenis_kelamin,
        pekerjaan || null,
        peran_keluarga,
        no_hp || null,
        alamat || null,
        tanggal_baptis || null,
        tanggal_sidi || null,
        tanggal_nikah || null,
        finalJenisjemaat,
        status_jemaat,
        status_meninggal,
        tanggal_meninggal || null,
        id
      ]);
      connection.release();

      res.json({
        success: true,
        message: 'Jemaat berhasil diubah'
      });
    } catch (error) {
      console.error('Update jemaat error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Delete jemaat
  static async deleteJemaat(req, res) {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM jemaat WHERE id = ?', [id]);

      if (existing.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Jemaat tidak ditemukan'
        });
      }

      await connection.execute('DELETE FROM jemaat WHERE id = ?', [id]);
      connection.release();

      res.json({
        success: true,
        message: 'Jemaat berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete jemaat error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = JemaatController;
