const pool = require('../config/database');

class MeninggalController {
  // Get jemaat yang meninggal by month
  static async getMeninggal(req, res) {
    try {
      const { bulan, tahun } = req.query;

      if (!bulan || !tahun) {
        return res.status(400).json({
          success: false,
          message: 'Bulan dan tahun harus diisi'
        });
      }

      const connection = await pool.getConnection();
      const [jemaat] = await connection.execute(`
        SELECT 
          j.id,
          j.nama_lengkap,
          j.tanggal_lahir,
          j.tanggal_meninggal,
          j.jenis_kelamin,
          j.jenis_jemaat,
          j.peran_keluarga,
          s.nama_sektor,
          DATEDIFF(j.tanggal_meninggal, j.tanggal_lahir) DIV 365 as umur_saat_meninggal
        FROM jemaat j
        JOIN sektor s ON j.sektor_id = s.id
        WHERE j.status_meninggal = 'Ya'
        AND MONTH(j.tanggal_meninggal) = ?
        AND YEAR(j.tanggal_meninggal) = ?
        ORDER BY j.tanggal_meninggal DESC
      `, [bulan, tahun]);
      connection.release();

      res.json({
        success: true,
        data: jemaat,
        filter: {
          bulan: parseInt(bulan),
          tahun: parseInt(tahun)
        }
      });
    } catch (error) {
      console.error('Get meninggal error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = MeninggalController;
