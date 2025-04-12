/**
 * Validates chat message request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateChatRequest = (req, res, next) => {
  const { message } = req.body;

  // Check if message exists
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid message',
      code: 'INVALID_MESSAGE'
    });
  }

  // Check message length
  if (message.length > 4000) {
    return res.status(400).json({
      success: false,
      error: 'Message exceeds maximum length of 4000 characters',
      code: 'MESSAGE_TOO_LONG'
    });
  }

  // Validate message history if provided
  if (req.body.messageHistory) {
    if (!Array.isArray(req.body.messageHistory)) {
      return res.status(400).json({
        success: false,
        error: 'Message history must be an array',
        code: 'INVALID_MESSAGE_HISTORY'
      });
    }

    // Check each message in history
    for (const historyMessage of req.body.messageHistory) {
      if (!historyMessage.role || !historyMessage.content || 
          !['user', 'assistant', 'system'].includes(historyMessage.role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid message in history. Each message must have role and content properties',
          code: 'INVALID_MESSAGE_FORMAT'
        });
      }
    }
  }

  next();
};

module.exports = {
  validateChatRequest
};
