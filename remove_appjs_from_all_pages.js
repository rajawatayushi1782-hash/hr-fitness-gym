const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(pagesDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('/js/app.js')) {
    content = content.replace(/<script src="\/js\/app\.js"><\/script>\s*/g, '');
    fs.writeFileSync(filePath, content);
    console.log(`Removed app.js from ${f}`);
  }
});

console.log('Finished stripping app.js from all pages.');
