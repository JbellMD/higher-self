/**
 * Deployment script for the Higher Self frontend
 * This script prepares the frontend for production deployment
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log with colors
const log = {
  info: (message) => console.log(`${colors.blue}[INFO]${colors.reset} ${message}`),
  success: (message) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
  warning: (message) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
  error: (message) => console.log(`${colors.red}[ERROR]${colors.reset} ${message}`),
  step: (message) => console.log(`${colors.cyan}[STEP]${colors.reset} ${message}`),
};

// Main deployment function
async function deploy() {
  try {
    log.info('Starting deployment process for Higher Self frontend...');
    
    // Step 1: Check if .env.production exists
    log.step('Checking for production environment variables...');
    const envPath = path.join(__dirname, '.env.production');
    
    if (!fs.existsSync(envPath)) {
      log.error('.env.production file not found. Please create it before deploying.');
      process.exit(1);
    }
    
    log.success('Found .env.production file');
    
    // Step 2: Install dependencies
    log.step('Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
    log.success('Dependencies installed');
    
    // Step 3: Create production build
    log.step('Creating production build...');
    // Copy .env.production to .env for the build process
    fs.copyFileSync(envPath, path.join(__dirname, '.env'));
    
    // Run the build command
    execSync('npm run build', { stdio: 'inherit' });
    log.success('Production build created');
    
    // Step 4: Create a deployment package
    log.step('Creating deployment package...');
    const deployDir = path.join(__dirname, 'deploy');
    
    // Create deploy directory if it doesn't exist
    if (fs.existsSync(deployDir)) {
      fs.rmSync(deployDir, { recursive: true, force: true });
    }
    fs.mkdirSync(deployDir, { recursive: true });
    
    // Copy build directory to deploy directory
    copyDirectory(path.join(__dirname, 'build'), path.join(deployDir, 'build'));
    
    // Create a simple server for the static files
    const serverContent = `
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Adjust as needed for your application
}));

// Performance middleware
app.use(compression());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// All requests that don't match a static file should serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Frontend server running on port \${PORT}\`);
});
`;
    
    // Write server.js to deploy directory
    fs.writeFileSync(path.join(deployDir, 'server.js'), serverContent);
    
    // Create package.json for the deployment
    const packageJson = {
      name: 'higher-self-frontend',
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'node server.js'
      },
      dependencies: {
        express: '^4.18.2',
        compression: '^1.7.4',
        helmet: '^7.1.0'
      },
      engines: {
        node: '>=14.0.0'
      }
    };
    
    fs.writeFileSync(
      path.join(deployDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create a README for deployment
    const readmeContent = `
# Higher Self Frontend Deployment

This directory contains the production build of the Higher Self frontend application.

## Deployment Instructions

1. Upload the contents of this directory to your hosting provider.

2. Install the dependencies:
   \`\`\`
   npm install --production
   \`\`\`

3. Start the server:
   \`\`\`
   npm start
   \`\`\`

4. The application will be available at http://localhost:3000 (or the port specified by the PORT environment variable).

## Environment Variables

- PORT: The port on which to run the server (default: 3000)

## Static Hosting

If you prefer to use a static hosting service (like Netlify, Vercel, or AWS S3), you can simply upload the contents of the \`build\` directory.
`;
    
    fs.writeFileSync(path.join(deployDir, 'README.md'), readmeContent.trim());
    
    log.success('Deployment package created in the deploy directory');
    log.info('Deployment preparation complete!');
    log.info('The production-ready application is available in the deploy directory.');
    log.info('To deploy, follow the instructions in deploy/README.md');
    
  } catch (error) {
    log.error(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// Helper function to copy a directory recursively
function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  // Get all files and directories in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  // Process each entry
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Run the deployment script
deploy().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
