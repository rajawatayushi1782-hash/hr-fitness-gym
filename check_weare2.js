const fs = require('fs');
const html = fs.readFileSync('public/pages/we-are-go180.html', 'utf8');

const containerMatch = html.match(/<div data-barba="container"[\s\S]*?<\/footer>/i);
if (containerMatch) {
  const tags = containerMatch[0].match(/<(h[1-6]|p|li|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  tags.slice(0, 40).forEach(t => {
    const clean = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean.length > 5 && !clean.includes('http') && !clean.includes('wp-content')) {
      console.log('-', clean.substring(0, 120));
    }
  });
}
