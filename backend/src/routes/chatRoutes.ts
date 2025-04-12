import express from 'express';
import { sendMessage } from '../controllers/chatController';

const router = express.Router();

// POST route for sending a message to ChatGPT
router.post('/send', sendMessage);

export default router;
