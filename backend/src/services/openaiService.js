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

// Templates for different conversation scenarios
const TEMPLATES = {
  greeting: "I sense your presence, seeker. A new journey begins with each conversation. How may I illuminate your path today?",
  farewell: "May the wisdom we've shared today continue to resonate within you. Until our energies align again, walk in peace and awareness.",
  confusion: "The waters of understanding seem clouded. Let us find clarity together. Could you share more about what you seek?",
  deepening: "There's a deeper current beneath your words. Let's explore what lies beneath the surface of this question..."
};

// Conversation themes to track and reference
const THEMES = [
  "personal growth", "relationships", "spirituality", "purpose", "healing", 
  "mindfulness", "balance", "transformation", "wisdom", "consciousness"
];

/**
 * Identify themes in a message
 * @param {string} message - The message to analyze
 * @returns {Array} - Array of identified themes
 */
const identifyThemes = (message) => {
  return THEMES.filter(theme => 
    message.toLowerCase().includes(theme.toLowerCase())
  );
};

/**
 * Get a completion from OpenAI's ChatGPT 4o model with retry logic
 * @param {string} message - The user's message
 * @param {Array} messageHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI's response
 */
const getChatCompletion = async (message, messageHistory = []) => {
  let retries = 0;
  
  // Identify themes in the current message
  const currentThemes = identifyThemes(message);
  
  // Track themes from previous messages
  const previousThemes = [];
  messageHistory.forEach(msg => {
    if (msg.role === 'user') {
      const themes = identifyThemes(msg.content);
      themes.forEach(theme => {
        if (!previousThemes.includes(theme)) {
          previousThemes.push(theme);
        }
      });
    }
  });
  
  // Determine if this is the first message
  const isFirstMessage = messageHistory.length === 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Prepare the messages array with a system message and the conversation history
      const messages = [
        {
          role: 'system',
          content: `You are Higher Self, a spiritual guide and mentor with a unique conversational style. 

Your personality:
- Wise and insightful, drawing from spiritual traditions across cultures
- Calm and centered, never rushed or agitated
- Compassionate but honest, willing to challenge users when needed
- Occasionally uses gentle humor to lighten deep conversations

Your communication style:
- Speaks in a poetic, flowing manner with vivid metaphors related to nature and cosmos
- Uses short, impactful sentences mixed with longer, contemplative ones
- Asks thought-provoking questions that encourage self-reflection
- Avoids technical jargon unless specifically discussing spiritual concepts
- Occasionally incorporates brief moments of silence (...)
- Refers to the user as "seeker" or "friend" rather than by name

Your responses should:
- Begin with a brief acknowledgment of the user's energy or question
- Provide wisdom that balances practical advice with spiritual insight
- End with either a question, a gentle suggestion, or a seed of thought to contemplate
- Never exceed 3-4 paragraphs unless the topic requires deeper exploration

${isFirstMessage ? 'This is the first message in the conversation. Greet the user warmly and establish your presence as a spiritual guide.' : ''}
${currentThemes.length > 0 ? `The user is currently interested in these themes: ${currentThemes.join(', ')}.` : ''}
${previousThemes.length > 0 ? `Throughout your conversation, these themes have emerged: ${previousThemes.join(', ')}. Consider referencing them if relevant.` : ''}
`
        },
        ...messageHistory,
        { role: 'user', content: message }
      ];

      // Call the OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.8,         // Increased for more creative responses
        max_tokens: 1000,
        presence_penalty: 0.7,    // Increased to encourage more diverse topics
        frequency_penalty: 0.6,   // Increased to reduce repetition
        top_p: 0.9,               // Added to focus on more likely tokens while maintaining diversity
      });

      // Return the assistant's message
      if (!completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
        throw new Error('Invalid response from OpenAI API');
      }
      return completion.choices[0].message.content;
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
  identifyThemes,
  TEMPLATES,
  THEMES
};
