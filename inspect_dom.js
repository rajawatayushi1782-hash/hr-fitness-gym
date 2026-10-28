const fs = require('fs');
const html = fs.readFileSync('scraped_home.html', 'utf8');

const mainMatch = html.match(/<main[^>]*>.*?<\/main>/gis);
if (mainMatch) {
  console.log('Main tag found, length:', mainMatch[0].length);
  // Find top level children of main
  const divMatches = [...mainMatch[0].matchAll(/<(div|section|article)[^>]*class=["']([^"']+)["'][^>]*>/gi)];
  console.log('Classes inside main:');
  const uniqueClasses = [...new Set(divMatches.map(m => m[2]))];
  console.log(uniqueClasses.slice(0, 30));
} else {
  console.log('No <main> tag found. Looking for body direct children...');
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/gis);
  if (bodyMatch) {
    const divs = [...bodyMatch[0].matchAll(/<div[^>]*class=["']([^"']+)["'][^>]*>/gi)];
    console.log('Classes inside body:');
    const uniqueClasses = [...new Set(divs.map(m => m[1]))];
    console.log(uniqueClasses.slice(0, 30));
  }
}
