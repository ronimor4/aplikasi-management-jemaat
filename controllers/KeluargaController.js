const pool = require('../config/database');

class KeluargaController {
  // Get all keluarga
  static async getAllKeluarga(req, res) {
    try {
      const connection = await pool.getConnection();
      const [keluarga] = await connection.execute(`
        SELECT 
          k.id,
          k.sektor_id,
          s.nama_sektor,
          k.bapak_id,
          k.ibu_id,
          jb.nama_lengkap as nama_bapak,
          ji.nama_lengkap as nama_ibu,
          (SELECT COUNT(*) FROM jemaat WHERE 
            peran_keluarga LIKE 'Anak%' AND 
            (bapak_id = k.bapak_id OR ibu_id = k.ibu_id)) as total_anak
        FROM keluarga k
        JOIN sektor s ON k.sektor_id = s.id
        LEFT JOIN jemaat jb ON k.bapak_id = jb.id
        LEFT JOIN jemaat ji ON k.ibu_id = ji.id
        ORDER BY s.nama_sektor ASC, jb.nama_lengkap ASC
      `);
      connection.release();

      res.json({
        success: true,
        data: keluarga
      });
    } catch (error) {
      console.error('Get all keluarga error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Get keluarga detail by ID
  static async getKeluargaById(req, res) {
    try {
      const { id } = req.params;
      const connection = await pool.getConnection();
      
      const [keluarga] = await connection.execute(`
        SELECT 
          k.id,
          k.sektor_id,
          s.nama_sektor,
          k.bapak_id,
          k.ibu_id,
          jb.nama_lengkap as nama_bapak,
          jb.tanggal_lahir as bapak_tanggal_lahir,
          jb.jenis_kelamin as bapak_jenis_kelamin,
          jb.pekerjaan as bapak_pekerjaan,
          jb.no_hp as bapak_no_hp,
          jb.alamat as bapak_alamat,
          ji.nama_lengkap as nama_ibu,
          ji.tanggal_lahir as ibu_tanggal_lahir,
          ji.jenis_kelamin as ibu_jenis_kelamin,
          ji.pekerjaan as ibu_pekerjaan,
          ji.no_hp as ibu_no_hp,
          ji.alamat as ibu_alamat
        FROM keluarga k
        JOIN sektor s ON k.sektor_id = s.id
        LEFT JOIN jemaat jb ON k.bapak_id = jb.id
        LEFT JOIN jemaat ji ON k.ibu_id = ji.id
        WHERE k.id = ?
      `, [id]);

      if (keluarga.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Keluarga tidak ditemukan'
        });
      }

      // Get anak-anak (sorted by urutan anak)
      const [anak] = await connection.execute(`
        SELECT 
          id,
          nama_lengkap,
          tanggal_lahir,
          jenis_kelamin,
          pekerjaan,
          no_hp,
          alamat,
          peran_keluarga
        FROM jemaat
        WHERE peran_keluarga LIKE 'Anak%' AND status_meninggal = 'Tidak'
        ORDER BY peran_keluarga ASC
      `);

      connection.release();

      res.json({
        success: true,
        data: {
          ...keluarga[0],
          anak
        }
      });
    } catch (error) {
      console.error('Get keluarga by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Create keluarga
  static async createKeluarga(req, res) {
    try {
      const { sektor_id, bapak_id, ibu_id } = req.body;

      if (!sektor_id) {
        return res.status(400).json({
          success: false,
          message: 'Sektor harus dipilih'
        });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO keluarga (sektor_id, bapak_id, ibu_id) VALUES (?, ?, ?)',
        [sektor_id, bapak_id || null, ibu_id || null]
      );
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Keluarga berhasil ditambahkan',
        data: {
          id: result.insertId
        }
      });
    } catch (error) {
      console.error('Create keluarga error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Update keluarga
  static async updateKeluarga(req, res) {
    try {
      const { id } = req.params;
      const { sektor_id, bapak_id, ibu_id } = req.body;

      if (!sektor_id) {
        return res.status(400).json({
          success: false,
          message: 'Sektor harus dipilih'
        });
      }

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM keluarga WHERE id = ?', [id]);

      if (existing.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Keluarga tidak ditemukan'
        });
      }

      await connection.execute(
        'UPDATE keluarga SET sektor_id = ?, bapak_id = ?, ibu_id = ? WHERE id = ?',
        [sektor_id, bapak_id || null, ibu_id || null, id]
      );
      connection.release();

      res.json({
        success: true,
        message: 'Keluarga berhasil diubah'
      });
    } catch (error) {
      console.error('Update keluarga error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Delete keluarga
  static async deleteKeluarga(req, res) {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();
      const [existing] = await connection.execute('SELECT id FROM keluarga WHERE id = ?', [id]);

      if (existing.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Keluarga tidak ditemukan'
        });
      }

      await connection.execute('DELETE FROM keluarga WHERE id = ?', [id]);
      connection.release();

      res.json({
        success: true,
        message: 'Keluarga berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete keluarga error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = KeluargaController;
