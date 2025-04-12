# Higher Self - AI Chatbot

A modern chatbot application built with React, TypeScript, Node.js, and the OpenAI API. Higher Self provides a clean, intuitive interface for conversing with an AI assistant.

## Features

- Clean, responsive UI with dark blue and black color scheme
- Advanced chat history management
  - Categories (General, Personal, Work, Ideas)
  - Tagging functionality
  - Pinning important sessions
  - Search functionality
  - Multi-select mode for bulk actions
  - Import/export sessions
- Real-time typing indicators
- Error handling and notifications
- Performance optimizations
- Security measures

## Project Structure

```
higher-self/
├── frontend/           # React TypeScript frontend
│   ├── public/         # Static files
│   └── src/            # Source files
│       ├── components/ # React components
│       ├── hooks/      # Custom React hooks
│       └── styles/     # CSS and styling
└── backend/            # Node.js backend
    └── src/            # Source files
        ├── controllers/ # Request handlers
        ├── routes/      # API routes
        ├── middleware/  # Express middleware
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
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Start the development servers:
   ```
   # In the backend directory
   npm run dev
   
   # In the frontend directory (in a separate terminal)
   npm start
   ```

## Performance Optimizations

The application has been optimized for performance in several ways:

1. **React Optimizations**
   - Memoized components with React.memo
   - Optimized expensive calculations with useMemo
   - Prevented unnecessary re-renders with useCallback
   - Implemented proper dependency arrays in useEffect hooks

2. **Error Handling**
   - Global error boundary for React components
   - Custom error handling middleware for the backend
   - User-friendly error messages with toast notifications
   - Comprehensive API error handling

3. **Security Measures**
   - Input validation middleware
   - Rate limiting to prevent abuse
   - Helmet.js for HTTP header security
   - Request size limiting
   - CORS configuration

## Deployment

### Netlify (Frontend) and Render (Backend) Deployment

#### Frontend Deployment to Netlify

1. Create a Netlify account at [netlify.com](https://www.netlify.com/) if you don't have one already.

2. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

3. Login to Netlify:
   ```
   netlify login
   ```

4. Navigate to the frontend directory and deploy:
   ```
   cd frontend
   netlify deploy --prod
   ```

5. Alternatively, connect your GitHub repository to Netlify:
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your repository
   - Set build command to: `npm run build`
   - Set publish directory to: `build`
   - Set environment variables in the Netlify dashboard

#### Backend Deployment to Render

1. Create a Render account at [render.com](https://render.com/) if you don't have one already.

2. Create a new Web Service:
   - Go to the Render dashboard
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the backend directory
   - Render will automatically detect the `render.yaml` configuration

3. Set up the following environment variables in the Render dashboard:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `CORS_ORIGIN`: Your Netlify site URL (e.g., https://higher-self.netlify.app)
   - `RATE_LIMIT_WINDOW_MS`: 60000
   - `RATE_LIMIT_MAX`: 60

4. Deploy the service and wait for it to build and start.

5. Update your frontend `.env.production` file with the Render backend URL:
   ```
   REACT_APP_API_URL=https://your-render-service-name.onrender.com/api
   ```

6. Redeploy your frontend to Netlify to use the updated backend URL.

### Alternative Deployment Options

1. Create a production build:
   ```
   cd frontend
   npm run build
   ```

2. The build artifacts will be in the `build` directory, which can be deployed to any static hosting service like Vercel, AWS S3, or GitHub Pages.

### Backend Deployment

1. Run the deployment script:
   ```
   cd backend
   node deploy.js
   ```

2. The production-ready application will be in the `dist` directory.

3. Deploy the `dist` directory to your server or cloud provider (AWS, Heroku, DigitalOcean, etc.).

4. Start the server in production mode:
   ```
   NODE_ENV=production node dist/index.js
   ```

## Environment Variables

### Frontend (.env.production)
- `REACT_APP_API_URL`: URL of the backend API
- `GENERATE_SOURCEMAP`: Set to 'false' for production

### Backend (.env.production)
- `PORT`: Port number for the server
- `NODE_ENV`: Set to 'production'
- `OPENAI_API_KEY`: Your OpenAI API key
- `CORS_ORIGIN`: Allowed origins for CORS
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- `RATE_LIMIT_MAX`: Maximum requests per window

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the powerful GPT-4o API
- The React team for their excellent frontend library
