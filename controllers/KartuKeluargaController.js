const pool = require('../config/database');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class KartuKeluargaController {
  // Generate Kartu Keluarga PDF
  static async generateKartuKeluarga(req, res) {
    try {
      const { keluarga_id } = req.params;

      const connection = await pool.getConnection();

      // Get gereja data
      const [gereja] = await connection.execute('SELECT * FROM gereja LIMIT 1');

      if (gereja.length === 0) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Data gereja belum dikonfigurasi'
        });
      }

      // Get keluarga data
      const [keluargaData] = await connection.execute(`
        SELECT 
          k.id,
          k.sektor_id,
          s.nama_sektor,
          k.bapak_id,
          k.ibu_id,
          jb.nama_lengkap as nama_bapak,
          jb.tanggal_lahir as bapak_tanggal_lahir,
          jb.jenis_kelamin as bapak_jenis_kelamin,
          jb.peran_keluarga as bapak_peran_keluarga,
          jb.no_hp as bapak_no_hp,
          jb.alamat as bapak_alamat,
          ji.nama_lengkap as nama_ibu,
          ji.tanggal_lahir as ibu_tanggal_lahir,
          ji.jenis_kelamin as ibu_jenis_kelamin,
          ji.peran_keluarga as ibu_peran_keluarga,
          ji.no_hp as ibu_no_hp,
          ji.alamat as ibu_alamat
        FROM keluarga k
        JOIN sektor s ON k.sektor_id = s.id
        LEFT JOIN jemaat jb ON k.bapak_id = jb.id
        LEFT JOIN jemaat ji ON k.ibu_id = ji.id
        WHERE k.id = ?
      `, [keluarga_id]);

      if (keluargaData.length === 0) {
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Keluarga tidak ditemukan'
        });
      }

      // Get anak-anak
      const [anak] = await connection.execute(`
        SELECT 
          id,
          nama_lengkap,
          tanggal_lahir,
          jenis_kelamin,
          peran_keluarga,
          no_hp,
          alamat
        FROM jemaat
        WHERE status_meninggal = 'Tidak'
        ORDER BY peran_keluarga ASC
      `);

      connection.release();

      // Create PDF
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40
      });

      const filename = `Kartu_Keluarga_${keluargaData[0].nama_bapak || keluargaData[0].nama_ibu}_${Date.now()}.pdf`;
      const filepath = path.join(__dirname, '../public/kartu-keluarga', filename);

      // Create directory if not exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Add logo if exists
      if (gereja[0].logo_gereja) {
        try {
          doc.image(gereja[0].logo_gereja, 40, 30, { width: 60, height: 60 });
        } catch (e) {
          console.error('Logo error:', e);
        }
      }

      // Header - Nama Gereja
      doc.fontSize(16).font('Helvetica-Bold').text(gereja[0].nama_gereja, 110, 40, { align: 'center', width: 400 });
      doc.fontSize(10).font('Helvetica').text(gereja[0].alamat_gereja, 110, 70, { align: 'center', width: 400 });

      // Title
      doc.fontSize(14).font('Helvetica-Bold').text('KARTU KELUARGA', 40, 130, { align: 'center' });

      // Divider
      doc.moveTo(40, 155).lineTo(555, 155).stroke();

      // Sektor info
      doc.fontSize(10).font('Helvetica').text(`Sektor: ${keluargaData[0].nama_sektor}`, 50, 165);

      // Family members table
      let yPos = 200;
      const rowHeight = 30;

      // Table header
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('NO', 50, yPos);
      doc.text('NAMA LENGKAP', 80, yPos);
      doc.text('TGL LAHIR', 280, yPos);
      doc.text('JK', 370, yPos);
      doc.text('PERAN', 400, yPos);

      yPos += 15;
      doc.moveTo(40, yPos).lineTo(555, yPos).stroke();
      yPos += 10;

      // Table data
      let no = 1;
      doc.fontSize(9).font('Helvetica');

      // Bapak
      if (keluargaData[0].bapak_id) {
        doc.text(no.toString(), 50, yPos);
        doc.text(keluargaData[0].nama_bapak.substring(0, 40), 80, yPos);
        doc.text(keluargaData[0].bapak_tanggal_lahir || '-', 280, yPos);
        doc.text(keluargaData[0].bapak_jenis_kelamin || '-', 370, yPos);
        doc.text('Bapak', 400, yPos);
        yPos += rowHeight;
        no++;
      }

      // Ibu
      if (keluargaData[0].ibu_id) {
        doc.text(no.toString(), 50, yPos);
        doc.text(keluargaData[0].nama_ibu.substring(0, 40), 80, yPos);
        doc.text(keluargaData[0].ibu_tanggal_lahir || '-', 280, yPos);
        doc.text(keluargaData[0].ibu_jenis_kelamin || '-', 370, yPos);
        doc.text('Ibu', 400, yPos);
        yPos += rowHeight;
        no++;
      }

      // Anak-anak
      anak.forEach((child, index) => {
        if (child.peran_keluarga.startsWith('Anak')) {
          doc.text(no.toString(), 50, yPos);
          doc.text(child.nama_lengkap.substring(0, 40), 80, yPos);
          doc.text(child.tanggal_lahir || '-', 280, yPos);
          doc.text(child.jenis_kelamin || '-', 370, yPos);
          doc.text(child.peran_keluarga, 400, yPos);
          yPos += rowHeight;
          no++;
        }
      });

      // Divider before signature
      doc.moveTo(40, yPos).lineTo(555, yPos).stroke();
      yPos += 40;

      // Signature section
      doc.fontSize(10).text('Ditandatangani oleh:', 50, yPos);
      yPos += 40;

      // Signature line
      doc.moveTo(50, yPos).lineTo(200, yPos).stroke();
      yPos += 10;

      doc.fontSize(9).text(gereja[0].nama_pimpinan, 50, yPos, { width: 150, align: 'center' });
      doc.text('Pimpinan Jemaat', 50, yPos + 15, { width: 150, align: 'center' });

      doc.end();

      stream.on('finish', () => {
        res.json({
          success: true,
          message: 'Kartu Keluarga berhasil dibuat',
          download_url: `/kartu-keluarga/${filename}`
        });
      });

      stream.on('error', (err) => {
        console.error('PDF creation error:', err);
        res.status(500).json({
          success: false,
          message: 'Gagal membuat Kartu Keluarga',
          error: err.message
        });
      });
    } catch (error) {
      console.error('Generate kartu keluarga error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = KartuKeluargaController;
