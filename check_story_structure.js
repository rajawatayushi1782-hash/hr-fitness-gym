const fs = require('fs');
const html = fs.readFileSync('public/pages/story-beste-glute-oefeningen.html', 'utf8');

const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('H1:', title ? title[1] : 'NONE');

// Find the main text container
const idx = html.indexOf('<div class="editor');
if (idx !== -1) {
  console.log('Editor container found at', idx);
  console.log(html.substring(idx, idx + 1200));
} else {
  // Search for h2 or p
  const pMatch = html.match(/<p>[\s\S]*?<\/p>/gi) || [];
  console.log(`Found ${pMatch.length} paragraphs. First 3:`);
  pMatch.slice(0, 3).forEach(p => console.log(p.substring(0, 150)));
}
