import { Request, Response } from 'express';
import { getChatCompletion } from '../services/openaiService';

// Interface for the request body
interface SendMessageRequest {
  message: string;
  conversationId?: string;
  messageHistory?: Array<{ role: string; content: string }>;
}

/**
 * Controller for handling chat message requests
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, conversationId, messageHistory = [] } = req.body as SendMessageRequest;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get response from OpenAI
    const response = await getChatCompletion(message, messageHistory);

    // Return the response
    return res.status(200).json({
      success: true,
      data: {
        message: response,
        conversationId: conversationId || Date.now().toString(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get response from AI service'
    });
  }
};
