const fs = require('fs');
const path = require('path');

const svgs = [
  'arrow-select.svg',
  'arrow-not-filled-white.svg',
  'play-button-2.svg',
  'play.svg',
  'usp-list.svg'
];

async function downloadSVGs() {
  const imgDir = path.join(__dirname, 'public', 'img');
  fs.mkdirSync(imgDir, { recursive: true });

  for (const name of svgs) {
    const url = `https://go180.nl/app/themes/go180/assets/img/${name}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(imgDir, name), text);
        console.log(`Downloaded ${name} (${text.length} bytes)`);
      } else {
        console.log(`Failed ${name}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${name}:`, e.message);
    }
  }
}

downloadSVGs();
