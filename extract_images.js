const fs = require('fs');

const html = fs.readFileSync('scraped_home.html', 'utf8');

// Find all img src, data-src, srcset
const imgSrcs = [...html.matchAll(/(?:src|data-src|srcset)=["']([^"']+)["']/gi)]
  .flatMap(m => m[1].split(',').map(s => s.trim().split(' ')[0]))
  .filter(s => s.startsWith('http') || s.startsWith('/'));

console.log('Found image URLs:', imgSrcs.length);
const uniqueImages = [...new Set(imgSrcs)];
console.log('Unique images:', uniqueImages.length);

// Find background images
const bgMatches = [...html.matchAll(/url\(([^)]+)\)/gi)]
  .map(m => m[1].replace(/['"]/g, '').trim())
  .filter(s => s.startsWith('http') || s.startsWith('/'));
console.log('Background images:', bgMatches);

// Find SVGs
const svgMatches = html.match(/<svg[^>]*>.*?<\/svg>/gis) || [];
console.log('Inline SVGs count:', svgMatches.length);

fs.writeFileSync('extracted_homepage_images.json', JSON.stringify(uniqueImages, null, 2), 'utf8');
