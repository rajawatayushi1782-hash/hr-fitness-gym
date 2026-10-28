const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'gym website (1)', 'gym website');
console.log('Inspecting baseDir:', baseDir);

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else {
        fileList.push({
          fullPath,
          relPath: path.relative(baseDir, fullPath),
          size: stat.size,
          ext: path.extname(file).toLowerCase()
        });
      }
    } catch(e) {}
  }
  return fileList;
}

const allFiles = getAllFiles(baseDir);
console.log('Total files in gym website:', allFiles.length);

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
const images = allFiles.filter(f => imageExtensions.includes(f.ext) || f.relPath.includes('.jpg.webp'));

console.log('Total image/media files:', images.length);

const grouped = {};
for (const img of images) {
  const topFolder = img.relPath.split(path.sep)[0];
  grouped[topFolder] = (grouped[topFolder] || 0) + 1;
}
console.log('Images by top folder:', grouped);

