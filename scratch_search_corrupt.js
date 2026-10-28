const fs = require('fs');
const path = require('path');

const targets = ['byouild', 'your', 'tomorrow', 'bouw', 'toekomst', 'jouw'];

function searchDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    if (f.name === 'node_modules' || f.name === '.git' || f.name === 'package-lock.json') continue;
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      searchDir(fullPath);
    } else if (f.isFile()) {
      if (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.woff') || f.name.endsWith('.woff2') || f.name.endsWith('.ttf') || f.name.endsWith('.eot')) continue;
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const t of targets) {
          if (content.toLowerCase().indexOf(t) !== -1) {
            let idx = 0;
            const lower = content.toLowerCase();
            while ((idx = lower.indexOf(t, idx)) !== -1) {
              const snippet = content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 60)).replace(/[\r\n]+/g, ' ');
              if (snippet.indexOf('Byouild') !== -1 || snippet.indexOf('tOmOrrOw') !== -1 || snippet.indexOf('yOur') !== -1 || t === 'bouw' || t === 'toekomst' || t === 'jouw') {
                console.log('[' + f.name + '] match for   + t +  : ...' + snippet + '...');
              }
              idx += t.length;
            }
          }
        }
      } catch (err) {}
    }
  }
}

searchDir('.');
console.log('Search complete.');