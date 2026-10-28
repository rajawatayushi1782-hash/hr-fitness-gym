const fs = require('fs');
const path = require('path');
const dir = './public/pages';

fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  if (content.includes('js-form') || content.includes('gfid')) {
    const ids = [];
    const re = /data-id=["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      ids.push(m[1]);
    }
    console.log(f, 'has js-form/gfid, IDs:', ids);
  }
});

