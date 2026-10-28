const fs = require('fs');
const path = require('path');

const pagesDir = 'public/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const imageSnapshot = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  imageSnapshot[file] = imgMatches;
});

fs.writeFileSync('images_before_snapshot.json', JSON.stringify(imageSnapshot, null, 2), 'utf8');

let totalImgs = 0;
Object.values(imageSnapshot).forEach(arr => totalImgs += arr.length);
console.log(`Snapshot recorded: ${totalImgs} images across ${files.length} pages.`);
