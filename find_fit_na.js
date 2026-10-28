const fs = require('fs');
const path = require('path');

function searchAll(dir) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    if (item.name === 'node_modules' || item.name === '.git') continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      searchAll(full);
    } else if (item.isFile()) {
      try {
        const c = fs.readFileSync(full, 'utf8');
        if (c.includes('Fit na zwangerschap')) {
          console.log(`Found in: ${full}`);
        }
      } catch (e) {}
    }
  }
}

searchAll('.');
