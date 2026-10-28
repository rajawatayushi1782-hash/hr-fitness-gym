const fs = require('fs');
const c = fs.readFileSync('public/pages/we-are-go180.html', 'utf8');

// Find headings and paragraphs
const headings = c.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
console.log('=== WE ARE GO180 HEADINGS ===');
headings.forEach(h => console.log(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

console.log('\n=== INTRO TEXT ===');
const introIdx = c.indexOf('class="intro');
if (introIdx !== -1) {
  console.log(c.slice(introIdx, introIdx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
} else {
  // Let's find first paragraph
  const pIdx = c.indexOf('<p');
  console.log(c.slice(pIdx, pIdx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
