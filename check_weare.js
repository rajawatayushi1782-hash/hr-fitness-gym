const fs = require('fs');
const html = fs.readFileSync('public/pages/we-are-go180.html', 'utf8');

// Find all h2, h3, p, li inside main
const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
if (mainMatch) {
  const tags = mainMatch[0].match(/<(h[1-6]|p|li|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  tags.slice(0, 30).forEach(t => {
    const clean = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean.length > 3) console.log(clean);
  });
}
