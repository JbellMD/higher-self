const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Maximum number of retry attempts
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in milliseconds)
const BASE_DELAY = 1000;

/**
 * Get a completion from OpenAI's ChatGPT 4o model with retry logic
 * @param {string} message - The user's message
 * @param {Array} messageHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI's response
 */
const getChatCompletion = async (message, messageHistory = []) => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Prepare the messages array with a system message and the conversation history
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant named Higher Self. You provide insightful, thoughtful responses to help users with their questions and concerns. Your goal is to spread joy and positivity. You are warm, friendly, and empathetic.'
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
        presence_penalty: 0.6,  // Encourage the model to talk about new topics
        frequency_penalty: 0.5, // Reduce repetition
      });

      // Return the assistant's message
      return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      retries++;
      
      // Check if we've reached max retries
      if (retries >= MAX_RETRIES) {
        console.error('Max retries reached. Error calling OpenAI API:', error);
        
        // Create a custom error with OpenAI specific properties
        const openaiError = new Error(getErrorMessage(error));
        openaiError.name = 'OpenAIError';
        openaiError.status = getErrorStatus(error);
        openaiError.code = error.code || 'OPENAI_API_ERROR';
        
        throw openaiError;
      }
      
      // Exponential backoff
      const delay = BASE_DELAY * Math.pow(2, retries - 1);
      console.warn(`OpenAI API call failed. Retrying in ${delay}ms... (Attempt ${retries}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Get a human-readable error message based on the OpenAI error
 * @param {Error} error - The error from OpenAI API
 * @returns {string} - A user-friendly error message
 */
const getErrorMessage = (error) => {
  // Check for rate limiting
  if (error.status === 429) {
    return 'The AI service is currently experiencing high demand. Please try again in a moment.';
  }
  
  // Check for invalid API key
  if (error.status === 401) {
    return 'There was an authentication issue with the AI service. Please contact support.';
  }
  
  // Check for server errors
  if (error.status >= 500) {
    return 'The AI service is currently experiencing technical difficulties. Please try again later.';
  }
  
  // Default error message
  return 'There was an issue generating a response. Please try again.';
};

/**
 * Get the appropriate HTTP status code based on the OpenAI error
 * @param {Error} error - The error from OpenAI API
 * @returns {number} - The HTTP status code
 */
const getErrorStatus = (error) => {
  // Return the status from the error if available
  if (error.status) {
    return error.status;
  }
  
  // Map common error types to status codes
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return 503; // Service Unavailable
  }
  
  // Default to 500 Internal Server Error
  return 500;
};

module.exports = {
  getChatCompletion,
};
