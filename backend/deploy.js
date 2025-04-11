/**
 * Deployment script for the Higher Self backend
 * This script prepares the backend for production deployment
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
    log.info('Starting deployment process for Higher Self backend...');
    
    // Step 1: Check if .env.production exists
    log.step('Checking for production environment variables...');
    const envPath = path.join(__dirname, '.env.production');
    
    if (!fs.existsSync(envPath)) {
      log.error('.env.production file not found. Please create it before deploying.');
      process.exit(1);
    }
    
    log.success('Found .env.production file');
    
    // Step 2: Install production dependencies
    log.step('Installing production dependencies...');
    execSync('npm ci --only=production', { stdio: 'inherit' });
    log.success('Production dependencies installed');
    
    // Step 3: Create dist directory if it doesn't exist
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      log.step('Creating dist directory...');
      fs.mkdirSync(distDir, { recursive: true });
      log.success('Created dist directory');
    }
    
    // Step 4: Copy source files to dist
    log.step('Copying source files to dist directory...');
    copyDirectory(path.join(__dirname, 'src'), path.join(distDir, 'src'));
    
    // Step 5: Copy package.json and .env.production to dist
    fs.copyFileSync(path.join(__dirname, 'package.json'), path.join(distDir, 'package.json'));
    fs.copyFileSync(envPath, path.join(distDir, '.env'));
    log.success('Files copied to dist directory');
    
    // Step 6: Create start script
    const startScript = `
    #!/usr/bin/env node
    
    /**
     * Higher Self Backend Server
     * Production entry point
     */
    
    // Set environment to production
    process.env.NODE_ENV = 'production';
    
    // Start the server
    require('./src/server.js');
    `;
    
    fs.writeFileSync(path.join(distDir, 'index.js'), startScript.trim());
    log.success('Created production start script');
    
    log.info('Deployment preparation complete!');
    log.info('The production-ready application is available in the dist directory.');
    log.info('To start the server in production mode, run: NODE_ENV=production node dist/index.js');
    
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
