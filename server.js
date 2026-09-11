const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.SERVER_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/gereja', require('./routes/gereja'));
app.use('/api/sektor', require('./routes/sektor'));
app.use('/api/jemaat', require('./routes/jemaat'));
app.use('/api/keluarga', require('./routes/keluarga'));
app.use('/api/ulang-tahun', require('./routes/ultahun'));
app.use('/api/meninggal', require('./routes/meninggal'));
app.use('/api/kartu-keluarga', require('./routes/kartuKeluarga'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
