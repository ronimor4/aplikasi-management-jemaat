const pool = require('../config/database');

class DashboardController {
  // Get dashboard summary
  static async getSummary(req, res) {
    try {
      const connection = await pool.getConnection();

      // Total jemaat
      const [totalJemaat] = await connection.execute(
        'SELECT COUNT(*) as total FROM jemaat WHERE status_meninggal = "Tidak"'
      );

      // Total keluarga
      const [totalKeluarga] = await connection.execute(
        'SELECT COUNT(*) as total FROM keluarga'
      );

      // Total jemaat penuh dan persiapan
      const [jemiPenuhPersiapan] = await connection.execute(
        'SELECT jenis_jemaat, COUNT(*) as total FROM jemaat WHERE status_meninggal = "Tidak" GROUP BY jenis_jemaat'
      );

      // Total pria dan wanita
      const [priaWanita] = await connection.execute(
        'SELECT jenis_kelamin, COUNT(*) as total FROM jemaat WHERE status_meninggal = "Tidak" GROUP BY jenis_kelamin'
      );

      connection.release();

      const summary = {
        total_jemaat: totalJemaat[0].total,
        total_keluarga: totalKeluarga[0].total,
        jemaat_penuh_persiapan: jemiPenuhPersiapan.map(item => ({
          jenis: item.jenis_jemaat,
          total: item.total
        })),
        pria_wanita: priaWanita.map(item => ({
          jenis: item.jenis_kelamin,
          total: item.total
        }))
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = DashboardController;
