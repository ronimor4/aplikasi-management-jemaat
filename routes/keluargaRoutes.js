const express = require('express');
const router = express.Router();
const KeluargaController = require('../controllers/KeluargaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Get all keluarga
router.get('/', KeluargaController.getAllKeluarga);

// Get keluarga by ID
router.get('/:id', KeluargaController.getKeluargaById);

// Create keluarga
router.post('/', KeluargaController.createKeluarga);

// Update keluarga
router.put('/:id', KeluargaController.updateKeluarga);

// Delete keluarga
router.delete('/:id', KeluargaController.deleteKeluarga);

module.exports = router;
