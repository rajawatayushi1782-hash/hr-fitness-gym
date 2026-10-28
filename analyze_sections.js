const fs = require('fs');

const html = fs.readFileSync('scraped_home.html', 'utf8');

// Extract header
const headerMatch = html.match(/<header[^>]*>.*?<\/header>/gis);
console.log('Header length:', headerMatch ? headerMatch[0].length : 0);

// Extract main sections
const sectionMatches = [...html.matchAll(/<section[^>]*>(.*?)<\/section>/gis)];
console.log('Total <section> elements:', sectionMatches.length);
sectionMatches.forEach((s, idx) => {
  const openTag = s[0].match(/<section[^>]*>/)[0];
  const h = s[1].match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
  console.log(`Section ${idx + 1}: ${openTag.substring(0, 100)} | Heading: ${h ? h[1].replace(/<[^>]+>/g, '').trim() : 'None'}`);
});

// Extract footer
const footerMatch = html.match(/<footer[^>]*>.*?<\/footer>/gis);
console.log('Footer length:', footerMatch ? footerMatch[0].length : 0);
