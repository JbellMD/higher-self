/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Check if the error is from OpenAI API
  if (err.name === 'OpenAIError') {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Error communicating with OpenAI API',
      code: err.code || 'OPENAI_ERROR'
    });
  }

  // Default error response
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
};

module.exports = errorHandler;
