const fs = require('fs');
const path = require('path');

const pagesDir = 'public/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const results = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');

  // Search for address, phone, email, and club name mentions
  const patterns = [
    /Tesselschadestraat[^\s<]*/gi,
    /info@go180\.nl/gi,
    /058[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}/gi,
    /tel:[^\s"'>]+/gi,
    /mailto:[^\s"'>]+/gi,
    /Leeuwarden/gi
  ];

  patterns.forEach(p => {
    let match;
    while ((match = p.exec(content)) !== null) {
      const start = Math.max(0, match.index - 60);
      const end = Math.min(content.length, match.index + match[0].length + 60);
      results.push({
        file,
        match: match[0],
        snippet: content.slice(start, end).replace(/\s+/g, ' ')
      });
    }
  });
});

console.log(`Total occurrences found: ${results.length}`);
// Show unique snippets
const uniqueSnippets = [];
const seen = new Set();
results.forEach(r => {
  const key = `${r.file}:${r.match}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueSnippets.push(r);
  }
});
console.log('Sample unique matches:');
uniqueSnippets.slice(0, 40).forEach(u => {
  console.log(`[${u.file}] "${u.match}": ...${u.snippet}...`);
});
fs.writeFileSync('address_phone_matches.json', JSON.stringify(results, null, 2), 'utf8');
