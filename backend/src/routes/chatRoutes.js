const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Route for sending a message to the chatbot
router.post('/send', chatController.sendMessage);

module.exports = router;
