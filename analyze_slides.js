const fs = require('fs');
const html = fs.readFileSync('scraped_home.html', 'utf8');

// Find all slide elements
const slides = [...html.matchAll(/<div[^>]*class=["'][^"']*slide\b[^"']*["'][^>]*>(.*?)<\/div>\s*(?=<div[^>]*class=["'][^"']*slide\b|<\/div>\s*<\/div>\s*<footer)/gis)];
console.log('Found slides:', slides.length);

slides.forEach((s, idx) => {
  const text = s[1].replace(/<script[^>]*>.*?<\/script>/gis, '')
                  .replace(/<style[^>]*>.*?<\/style>/gis, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
  console.log(`\n=== Slide ${idx + 1} ===`);
  console.log(text.substring(0, 300));
});
