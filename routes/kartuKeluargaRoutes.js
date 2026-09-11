const express = require('express');
const router = express.Router();
const KartuKeluargaController = require('../controllers/KartuKeluargaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Generate Kartu Keluarga PDF
router.get('/generate/:keluarga_id', KartuKeluargaController.generateKartuKeluarga);

module.exports = router;
