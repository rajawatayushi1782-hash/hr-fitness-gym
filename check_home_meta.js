const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const title = html.match(/<title>[\s\S]*?<\/title>/i);
const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*>/i);
const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*>/i);
const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*>/i);

console.log('title:', title ? title[0] : null);
console.log('metaDesc:', metaDesc ? metaDesc[0] : null);
console.log('ogTitle:', ogTitle ? ogTitle[0] : null);
console.log('ogDesc:', ogDesc ? ogDesc[0] : null);
