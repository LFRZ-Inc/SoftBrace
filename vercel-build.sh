#!/bin/bash

# Run the standard build
npm run build

# Ensure the images directory exists
mkdir -p build/images

# Copy all images from public to build
cp -R public/images/* build/images/

echo "Vercel build completed with image copy" 