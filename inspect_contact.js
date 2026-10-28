const fs = require('fs');
const html = fs.readFileSync('scraped_pages/contact.html', 'utf8');

console.log('contact.html length:', html.length);
const bodyMatch = html.match(/<body[^>]*>/i);
console.log('Body tag:', bodyMatch ? bodyMatch[0] : 'None');

// Find all elements with inline style or class
const curtain = html.match(/<div[^>]*class=["'][^"']*(?:curtain|transition|loader|screen)[^"']*["'][^>]*>/gi);
console.log('Curtain / screen matches:', curtain);

// Print all direct children of body
const bodyContent = html.match(/<body[^>]*>(.*?)<\/body>/gis)?.[0] || '';
const directTags = [...bodyContent.matchAll(/<body[^>]*>|\s*(<(?:div|header|main|section|footer)[^>]*>)/gi)].map(m => m[1]);
console.log('Top level elements in body:', directTags.slice(0, 10));
