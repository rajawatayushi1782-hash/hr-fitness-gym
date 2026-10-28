const fs = require('fs');
const path = require('path');
const dir = './public/pages';

fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const bodyIdx = content.indexOf('<body');
  if (bodyIdx !== -1) {
    const bodyTag = content.substring(bodyIdx, content.indexOf('>', bodyIdx) + 1);
    if (bodyTag.includes('loading') || bodyTag.includes('is-animating')) {
      console.log(f, 'has loading/animating in body:', bodyTag);
    }
  }
});
