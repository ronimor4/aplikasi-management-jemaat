const express = require('express');
const router = express.Router();
const MeninggalController = require('../controllers/MeninggalController');
const { verifyToken } = require('../middleware/authMiddleware');

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Get jemaat yang meninggal berdasarkan bulan dan tahun
// Query params: bulan (1-12) dan tahun (yyyy)
router.get('/', MeninggalController.getMeninggal);

module.exports = router;
