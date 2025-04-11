# Higher Self - AI Chatbot

A modern chatbot application built with React, TypeScript, Node.js, and the OpenAI API. Higher Self provides a clean, intuitive interface for conversing with an AI assistant.

## Features

- Clean, responsive UI with animations
- Chat history management
- Real-time typing indicators
- Dark/light mode toggle
- Session management

## Project Structure

```
higher-self/
├── frontend/           # React TypeScript frontend
│   ├── public/         # Static files
│   └── src/            # Source files
│       ├── components/ # React components
│       ├── contexts/   # React context providers
│       └── styles/     # CSS and styling
└── backend/            # Node.js TypeScript backend
    └── src/            # Source files
        ├── controllers/ # Request handlers
        ├── routes/      # API routes
        └── services/    # Business logic
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/JbellMD/higher-self.git
   cd higher-self
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   cp .env.example .env
   ```

5. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Type your message in the input field at the bottom of the screen
2. Press Enter or click the Send button to send your message
3. The AI will respond with a thoughtful message

## Technologies Used

### Frontend
- React
- TypeScript
- CSS for styling

### Backend
- Node.js
- Express
- TypeScript
- OpenAI API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the powerful GPT-4o API
- The React team for their excellent frontend library
