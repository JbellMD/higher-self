# Higher Self - ChatGPT 4o Chatbot

A customized chatbot application built with React and Node.js that integrates with the OpenAI ChatGPT 4o API.

## Features

- Real-time chat interface with ChatGPT 4o
- Custom UI with animations and transitions
- Dark/light mode toggle
- Chat history management
- Responsive design for all devices

## Project Structure

- `frontend/`: React application with TypeScript
- `backend/`: Node.js Express server for API integration

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```
3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development servers:
   ```
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm start
   ```

## Technologies Used

- React
- TypeScript
- Node.js
- Express
- OpenAI API
- Chakra UI
- Framer Motion
