const pool = require('../config/database');
const moment = require('moment');

class UlangTahunController {
  // Get jemaat with ulang tahun between dates
  static async getUlangTahun(req, res) {
    try {
      const { tanggal_lahir_awal, tanggal_lahir_akhir } = req.query;

      if (!tanggal_lahir_awal || !tanggal_lahir_akhir) {
        return res.status(400).json({
          success: false,
          message: 'Tanggal lahir awal dan akhir harus diisi'
        });
      }

      // Parse dates in dd/mm/yyyy format
      const [hari1, bulan1, tahun1] = tanggal_lahir_awal.split('/');
      const [hari2, bulan2, tahun2] = tanggal_lahir_akhir.split('/');

      const tglAwal = `${tahun1}-${bulan1}-${hari1}`;
      const tglAkhir = `${tahun2}-${bulan2}-${hari2}`;

      const connection = await pool.getConnection();
      const [jemaat] = await connection.execute(`
        SELECT 
          j.id,
          j.nama_lengkap,
          j.tanggal_lahir,
          j.jenis_kelamin,
          j.jenis_jemaat,
          j.status_jemaat,
          s.nama_sektor,
          YEAR(NOW()) - YEAR(j.tanggal_lahir) as umur,
          MONTH(j.tanggal_lahir) as bulan_lahir,
          DAY(j.tanggal_lahir) as hari_lahir
        FROM jemaat j
        JOIN sektor s ON j.sektor_id = s.id
        WHERE j.status_meninggal = 'Tidak'
        AND DATE_FORMAT(j.tanggal_lahir, '%m-%d') BETWEEN DATE_FORMAT(?, '%m-%d') AND DATE_FORMAT(?, '%m-%d')
        ORDER BY MONTH(j.tanggal_lahir) ASC, DAY(j.tanggal_lahir) ASC
      `, [tglAwal, tglAkhir]);
      connection.release();

      res.json({
        success: true,
        data: jemaat,
        filter: {
          tanggal_awal: tanggal_lahir_awal,
          tanggal_akhir: tanggal_lahir_akhir
        }
      });
    } catch (error) {
      console.error('Get ulang tahun error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = UlangTahunController;
