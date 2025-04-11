const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get a completion from OpenAI's ChatGPT 4o model
 * @param {string} message - The user's message
 * @param {Array} messageHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI's response
 */
const getChatCompletion = async (message, messageHistory = []) => {
  try {
    // Prepare the messages array with a system message and the conversation history
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant named Higher Self. You provide insightful, thoughtful responses to help users with their questions and concerns.'
      },
      ...messageHistory,
      { role: 'user', content: message }
    ];

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Return the assistant's message
    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};

module.exports = {
  getChatCompletion,
};
