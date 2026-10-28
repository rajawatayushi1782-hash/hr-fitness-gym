const fs = require('fs');

const html = fs.readFileSync('scraped_home.html', 'utf8');

console.log('=== Meta tags ===');
const metas = html.match(/<meta[^>]+>/gi) || [];
metas.forEach(m => console.log(m));

console.log('\n=== Stylesheet Links ===');
const links = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
links.forEach(l => console.log(l));

console.log('\n=== Scripts ===');
const scripts = html.match(/<script[^>]+src=["'][^"']+["'][^>]*><\/script>/gi) || [];
scripts.forEach(s => console.log(s));

console.log('\n=== Navigation Links ===');
const navLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis)]
  .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
  .filter(l => l.href.startsWith('/') || l.href.includes('go180.nl'));

const uniqueLinks = Array.from(new Set(navLinks.map(l => l.href))).map(href => {
  return navLinks.find(l => l.href === href);
});
console.log('Found', uniqueLinks.length, 'unique internal links:');
console.log(JSON.stringify(uniqueLinks, null, 2));
