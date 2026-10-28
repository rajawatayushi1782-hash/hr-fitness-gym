const fs = require('fs');
const html = fs.readFileSync('scraped_pages/we-are-go180.html', 'utf8');

console.log('HTML length:', html.length);

// Look for elements with full-screen or preloader styles
const preloaderMatches = [...html.matchAll(/<div[^>]*class=["']([^"']*)["'][^>]*>/gi)]
  .map(m => m[1])
  .filter(c => c.toLowerCase().includes('loader') || c.toLowerCase().includes('transition') || c.toLowerCase().includes('curtain') || c.toLowerCase().includes('overlay'));

console.log('Preloader/transition classes found:', preloaderMatches);

// Look for all top-level divs directly under body
const bodyInner = html.match(/<body[^>]*>(.*?)<\/body>/gis);
if (bodyInner) {
  const topDivs = [...bodyInner[0].matchAll(/<body[^>]*>\s*(<div[^>]*>.*?<\/div>)/gis)];
  console.log('Body classes:', html.match(/<body[^>]*class=["']([^"']*)["']/i)?.[1]);
}

// Find all headings
const headings = [...html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis)].map(m => m[0].replace(/<[^>]+>/g, '').trim());
console.log('Headings in we-are-go180:', headings);
