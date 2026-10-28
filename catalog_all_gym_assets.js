const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, 'gym website (1)', 'gym website');

function hashFile(file) {
  try {
    return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
  } catch(e) { return null; }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const allFiles = walk(baseDir);
const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const imgFiles = allFiles.filter(f => imgExts.some(ext => f.toLowerCase().endsWith(ext)));

console.log('Total media files in gym website:', imgFiles.length);

const uniqueHashes = new Map();
for (const f of imgFiles) {
  const h = hashFile(f);
  if (!uniqueHashes.has(h)) {
    uniqueHashes.set(h, []);
  }
  uniqueHashes.get(h).push(path.relative(baseDir, f));
}

console.log('Unique media content hashes:', uniqueHashes.size);

const categories = {
  ai_generated: [],
  copyright_free_photos: [],
  original_scraped_dutch: [],
  icons_and_logos: [],
  other: []
};

for (const [hash, fileList] of uniqueHashes.entries()) {
  const sample = fileList[0];
  if (sample.includes('ai-generated') || sample.startsWith('ai-created-images\\ai_')) {
    categories.ai_generated.push({ hash, files: fileList });
  } else if (sample.includes('copyright-free-gym-assets\\images') || sample.includes('replacement-gym-images')) {
    categories.copyright_free_photos.push({ hash, files: fileList });
  } else if (sample.includes('original-assets-backup')) {
    categories.original_scraped_dutch.push({ hash, files: fileList });
  } else if (sample.includes('icons') || sample.includes('logos') || sample.endsWith('.svg')) {
    categories.icons_and_logos.push({ hash, files: fileList });
  } else {
    categories.other.push({ hash, files: fileList });
  }
}

console.log('Unique assets by category:');
console.log(' - AI Generated:', categories.ai_generated.length);
console.log(' - Copyright-free fitness photographs (Unsplash/Pexels):', categories.copyright_free_photos.length);
console.log(' - Original scraped Dutch assets in backup:', categories.original_scraped_dutch.length);
console.log(' - Icons and logos (SVG/PNG):', categories.icons_and_logos.length);
console.log(' - Other:', categories.other.length);

for (const item of categories.ai_generated) {
  console.log('   AI:', item.files[0]);
}
for (const item of categories.other) {
  console.log('   Other:', item.files[0]);
}
