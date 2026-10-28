const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const snapshot = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const imgMatches = content.match(/<img[^>]+>/gi) || [];
  const bgMatches = content.match(/background(?:-image)?:\s*url\([^)]+\)/gi) || [];
  const videoMatches = content.match(/<video[^>]+>|<source[^>]+>|data-video-src="[^"]+"/gi) || [];
  snapshot[f] = {
    imgs: imgMatches,
    bgs: bgMatches,
    videos: videoMatches
  };
});

fs.writeFileSync(path.join(__dirname, 'pre_edit_image_snapshot.json'), JSON.stringify(snapshot, null, 2), 'utf8');
console.log('Saved snapshot of', Object.keys(snapshot).length, 'files.');
let totalImgs = 0;
for (let f in snapshot) totalImgs += snapshot[f].imgs.length;
console.log('Total img tags recorded:', totalImgs);
