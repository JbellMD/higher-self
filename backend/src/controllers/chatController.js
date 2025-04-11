const openaiService = require('../services/openaiService');

/**
 * Send a message to the OpenAI API and get a response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendMessage = async (req, res) => {
  try {
    const { message, messageHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message',
      });
    }

    // Get response from OpenAI
    const response = await openaiService.getChatCompletion(message, messageHistory);

    return res.status(200).json({
      success: true,
      data: {
        message: response,
      },
    });
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your request',
    });
  }
};

module.exports = {
  sendMessage,
};
