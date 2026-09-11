// Response Helper

// Format success response
function successResponse(data = null, message = 'Success', statusCode = 200) {
  return {
    statusCode,
    body: {
      success: true,
      message,
      data
    }
  };
}

// Format error response
function errorResponse(message = 'Error', statusCode = 400, data = null) {
  return {
    statusCode,
    body: {
      success: false,
      message,
      data
    }
  };
}

// Format paginated response
function paginatedResponse(data, page, limit, total) {
  const pages = Math.ceil(total / limit);
  
  return {
    statusCode: 200,
    body: {
      success: true,
      message: 'Success',
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    }
  };
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
