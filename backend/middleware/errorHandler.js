// Error Handler Middleware

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let data = null;

  // Handle specific error types
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    message = err.message;

    // Handle common error messages
    if (err.message.includes('ECONNREFUSED')) {
      statusCode = 503;
      message = 'Database connection failed';
    } else if (err.message.includes('Unauthorized')) {
      statusCode = 401;
    } else if (err.message.includes('Forbidden')) {
      statusCode = 403;
    } else if (err.message.includes('not found')) {
      statusCode = 404;
    }
  }

  // Log error untuk debugging
  if (process.env.NODE_ENV === 'development') {
    data = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message,
    data
  });
}

// 404 Not Found Handler
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null
  });
}

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError
};
