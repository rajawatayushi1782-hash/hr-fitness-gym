const fs = require('fs');
const homeHtml = fs.readFileSync('public/pages/home.html', 'utf8');

// Find all slide titles and subtitles in homeHtml
const matches = homeHtml.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
console.log('Homepage Headings:');
matches.forEach((m, i) => {
  // Strip tags for clean preview
  const text = m.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  console.log(`${i + 1}: ${text}`);
});
