const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'indian_fitness');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Registry of generated images
const registryFile = path.join(__dirname, '..', 'indian_image_registry.json');
let registry = {};
if (fs.existsSync(registryFile)) {
  try { registry = JSON.parse(fs.readFileSync(registryFile, 'utf8')); } catch(e) {}
}

function registerImage(key, sourcePath) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return false;
  }
  const ext = path.extname(sourcePath) || '.jpg';
  const destName = `${key}${ext}`;
  const destPath = path.join(targetDir, destName);
  fs.copyFileSync(sourcePath, destPath);
  const webPath = `/images/indian_fitness/${destName}`;
  registry[key] = {
    key,
    sourcePath,
    destPath,
    webPath,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2));
  console.log(`Registered [${key}] -> ${webPath}`);
  return webPath;
}

module.exports = {
  registerImage,
  registry
};

if (require.main === module) {
  console.log('Current registered images:', Object.keys(registry));
}
