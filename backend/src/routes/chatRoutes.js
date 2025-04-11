const express = require('express');
const chatController = require('../controllers/chatController');
const { validateChatRequest } = require('../middleware/validator');

const router = express.Router();

// Route for sending a message to the chatbot
router.post('/send', validateChatRequest, chatController.sendMessage);

module.exports = router;
