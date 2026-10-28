const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Remove polyfill.io and babel-polyfill
  content = content.replace(/<script[^>]*polyfill\.io[^>]*><\/script>\s*/gi, '');
  content = content.replace(/<script[^>]*babel-polyfill[^>]*><\/script>\s*/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
}

console.log(`Cleaned polyfills from ${count} HTML files.`);
