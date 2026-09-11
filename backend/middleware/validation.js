// Input Validation Middleware

// Validate required fields
function validateRequired(fields) {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of fields) {
      if (!req.body[field] || (typeof req.body[field] === 'string' && !req.body[field].trim())) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        data: null
      });
    }

    next();
  };
}

// Validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate date format (YYYY-MM-DD)
function validateDate(date) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

// Validate phone number
function validatePhone(phone) {
  const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
}

// Validate ID card (KTP) - Indonesian
function validateKTP(ktp) {
  return /^[0-9]{16}$/.test(ktp);
}

// Middleware untuk validate login
function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Username is required',
      data: null
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      data: null
    });
  }

  next();
}

// Middleware untuk validate keluarga data
function validateKeluargaData(req, res, next) {
  const { nama_bapak, nama_ibu } = req.body;

  if (!nama_bapak || !nama_bapak.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nama bapak is required',
      data: null
    });
  }

  if (!nama_ibu || !nama_ibu.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nama ibu is required',
      data: null
    });
  }

  // Validate optional date fields
  if (req.body.tanggal_lahir_bapak && !validateDate(req.body.tanggal_lahir_bapak)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tanggal_lahir_bapak format (use YYYY-MM-DD)',
      data: null
    });
  }

  if (req.body.tanggal_lahir_ibu && !validateDate(req.body.tanggal_lahir_ibu)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tanggal_lahir_ibu format (use YYYY-MM-DD)',
      data: null
    });
  }

  next();
}

module.exports = {
  validateRequired,
  validateEmail,
  validateDate,
  validatePhone,
  validateKTP,
  validateLogin,
  validateKeluargaData
};
