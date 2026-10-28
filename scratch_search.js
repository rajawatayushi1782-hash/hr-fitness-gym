const fs = require('fs');
const path = require('path');

function search(dir) {
  const entries = fs.readdirSync(dir);
  for (const f of entries) {
    if (f === 'node_modules' || f === '.git' || f === '.gemini') continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      search(p);
    } else if (f.endsWith('.js')) {
      const content = fs.readFileSync(p, 'utf8');
      if (content.includes('class="header"') || content.includes('<header') || content.includes('header.cloneNode') || content.includes('js-form')) {
        console.log('Found match in JS file:', p);
      }
    }
  }
}

search('.');
