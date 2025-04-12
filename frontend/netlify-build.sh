#!/bin/bash

# Copy the environment variables file
cp .env.production .env

# Run the build
npm run build
