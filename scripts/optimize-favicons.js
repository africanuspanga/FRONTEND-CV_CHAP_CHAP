import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const sourceImagePath = path.join(__dirname, '../attached_assets/favicon.png');

async function generateFavicons() {
  console.log('Reading source image...');
  const imageBuffer = await fs.readFile(sourceImagePath);
  
  // Generate favicon.ico (16x16 and 32x32)
  console.log('Generating favicon.ico...');
  const favicon = await sharp(imageBuffer)
    .resize(32, 32)
    .toBuffer();
  
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), favicon);
  
  // Generate regular PNG favicon with various sizes
  console.log('Generating PNG favicons...');
  
  // 16x16
  await sharp(imageBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  
  // 32x32
  await sharp(imageBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  
  // Regular favicon 64x64
  await sharp(imageBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  
  // Apple Touch Icon (180x180)
  await sharp(imageBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  
  console.log('All favicons generated successfully!');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
});