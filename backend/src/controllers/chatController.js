const { getChatCompletion } = require('../services/openaiService');

/**
 * Controller for handling chat messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message, messageHistory } = req.body;
    
    // Log incoming request (without sensitive data)
    console.log(`Received message request. Length: ${message.length} characters`);
    
    // Call the OpenAI service to get a response
    const response = await getChatCompletion(message, messageHistory);
    
    // Return the response
    return res.status(200).json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
};

module.exports = {
  sendMessage
};
