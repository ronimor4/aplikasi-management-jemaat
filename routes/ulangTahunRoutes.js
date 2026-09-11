const express = require('express');
const router = express.Router();
const UlangTahunController = require('../controllers/UlangTahunController');
const { verifyToken } = require('../middleware/authMiddleware');

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Get jemaat dengan ulang tahun dalam range tanggal
// Query params: tanggal_lahir_awal (dd/mm/yyyy) dan tanggal_lahir_akhir (dd/mm/yyyy)
router.get('/', UlangTahunController.getUlangTahun);

module.exports = router;
