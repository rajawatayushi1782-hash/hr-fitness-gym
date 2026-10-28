const fs = require('fs');
const path = require('path');

const list = JSON.parse(fs.readFileSync('all_extracted_images.json', 'utf8'));

const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.svg'];

const urlsToDownload = list.filter(u => {
  if (!u.includes('go180.nl')) return false;
  const clean = u.split('?')[0].toLowerCase();
  return imageExtensions.some(ext => clean.endsWith(ext));
});

console.log(`Found ${urlsToDownload.length} image URLs on go180.nl to download.`);

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed (HTTP ${res.status}): ${url}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (e) {
    console.error(`Error downloading ${url}:`, e.message);
    return false;
  }
}

async function main() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  fs.mkdirSync(imagesDir, { recursive: true });

  const mapping = {};
  let count = 0;

  for (const url of urlsToDownload) {
    const filename = path.basename(url.split('?')[0]);
    const dest = path.join(imagesDir, filename);
    if (!fs.existsSync(dest)) {
      const ok = await downloadFile(url, dest);
      if (ok) count++;
    }
    mapping[url] = `/images/${filename}`;
  }

  fs.writeFileSync('image_mapping.json', JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`Downloaded ${count} new images. Total mapped: ${Object.keys(mapping).length}`);
}

main().catch(console.error);
