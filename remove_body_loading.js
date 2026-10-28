const fs = require('fs');
const path = require('path');
const dir = './public/pages';

let count = 0;
fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
  const p = path.join(dir, f);
  const content = fs.readFileSync(p, 'utf8');
  // Match <body ... class="... loading ..."
  const updated = content.replace(/(<body[^>]*class=["'][^"']*)(\bloading\b\s*)/gi, (match, prefix) => {
    count++;
    console.log(`Removed hardcoded 'loading' from ${f}`);
    return prefix;
  });
  if (updated !== content) {
    fs.writeFileSync(p, updated, 'utf8');
  }
});
console.log(`Total removed: ${count}`);
