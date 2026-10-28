const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashFile(file) {
  if (!fs.existsSync(file)) return null;
  const data = fs.readFileSync(file);
  return crypto.createHash('md5').update(data).digest('hex');
}

const pubImgDir = path.join(__dirname, 'public', 'images');
const copyFreeDir = path.join(__dirname, 'gym website (1)', 'gym website', 'copyright-free-gym-assets', 'images');
const origBackupDir = path.join(__dirname, 'gym website (1)', 'gym website', 'copyright-free-gym-assets', 'original-assets-backup', 'images');
const aiCreatedDir = path.join(__dirname, 'gym website (1)', 'gym website', 'ai-created-images', 'ai-generated');

console.log('Comparing samples:');
const sampleFiles = ['Appie-Kooistra-1920x648.jpg.webp', 'GO180-16-790x860.jpg.webp', 'AronWeidenaar_HR-18-scaled-e1776779630818.jpg.webp'];

for (const sf of sampleFiles) {
  const hPub = hashFile(path.join(pubImgDir, sf));
  const hCopy = hashFile(path.join(copyFreeDir, sf));
  const hOrig = hashFile(path.join(origBackupDir, sf));
  console.log(sf, {
    inPublic: !!hPub,
    matchesCopyFree: hPub === hCopy,
    matchesOrigBackup: hPub === hOrig
  });
}

