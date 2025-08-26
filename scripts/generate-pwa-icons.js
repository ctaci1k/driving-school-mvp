// scripts/generate-pwa-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgTemplate = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3B82F6" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
        font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
    DS
  </text>
</svg>
`;

// Створюємо SVG для кожного розміру
sizes.forEach(size => {
  const svg = svgTemplate(size);
  const filename = path.join('public', 'icons', `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Created ${filename}`);
});

console.log('\n✅ SVG icons created!');
console.log('Now convert them to PNG using:');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- or install sharp: npm install sharp');