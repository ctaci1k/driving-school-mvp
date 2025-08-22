// scripts/convert-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convertIcons() {
  for (const size of sizes) {
    const svgPath = path.join('public', 'icons', `icon-${size}x${size}.svg`);
    const pngPath = path.join('public', 'icons', `icon-${size}x${size}.png`);
    
    if (fs.existsSync(svgPath)) {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Converted icon-${size}x${size}.png`);
    }
  }
}

convertIcons().then(() => {
  console.log('\n🎉 All icons converted to PNG!');
}).catch(console.error);