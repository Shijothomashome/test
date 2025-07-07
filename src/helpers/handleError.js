/**
 * Standardized error handler for API responses
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} customMessage - Optional custom message
 */

export const handleError = (res, error, customMessage = null) => {
  console.error('API Error:', error);

  const statusCode = error.statusCode || 500;
  const message = customMessage || error.message || 'Something went wrong';
  
  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(el => el.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors.join(' | '),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }

  // Handle duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: 'Duplicate Field',
      message: `${field} already exists`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Invalid token',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }

  // Generic error response
  res.status(statusCode).json({
    success: false,
    error: error.name || 'Error',
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};