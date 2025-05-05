// Simple script to ensure images are available in build
const fs = require('fs');
const path = require('path');

// Create build directory if it doesn't exist yet
if (!fs.existsSync(path.join(__dirname, 'build'))) {
  fs.mkdirSync(path.join(__dirname, 'build'));
}

// Create build/images directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'build/images'))) {
  fs.mkdirSync(path.join(__dirname, 'build/images'));
}

// Copy all files from public/images to build/images
const publicImagesDir = path.join(__dirname, 'public/images');
const buildImagesDir = path.join(__dirname, 'build/images');

fs.readdirSync(publicImagesDir).forEach(file => {
  const src = path.join(publicImagesDir, file);
  const dest = path.join(buildImagesDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${file} to build/images/`);
});

console.log('All images copied successfully'); 