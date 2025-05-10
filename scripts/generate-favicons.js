import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the source favicon
const sourcePath = path.join(__dirname, '../attached_assets/favicon.png');
const publicDir = path.join(__dirname, '../public');

// Sizes for the different favicon versions
const sizes = {
  favicon16: 16,
  favicon32: 32,
  favicon64: 64,
  appleTouch: 180
};

// Function to generate favicon
async function generateFavicon() {
  try {
    console.log('Reading source favicon...');
    const sourceBuffer = fs.readFileSync(sourcePath);
    
    // Generate favicon.ico (multi-size ICO)
    console.log('Generating favicon.ico...');
    await sharp(sourceBuffer)
      .resize(64, 64)
      .toFile(path.join(publicDir, 'favicon.ico'));
    
    // Generate favicon-16x16.png
    console.log('Generating favicon-16x16.png...');
    await sharp(sourceBuffer)
      .resize(sizes.favicon16, sizes.favicon16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    
    // Generate favicon-32x32.png
    console.log('Generating favicon-32x32.png...');
    await sharp(sourceBuffer)
      .resize(sizes.favicon32, sizes.favicon32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    
    // Generate apple-touch-icon.png
    console.log('Generating apple-touch-icon.png...');
    await sharp(sourceBuffer)
      .resize(sizes.appleTouch, sizes.appleTouch)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    
    // Copy the original as favicon.png
    console.log('Copying original as favicon.png...');
    await sharp(sourceBuffer)
      .resize(sizes.favicon64, sizes.favicon64)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

// Run the function
generateFavicon();