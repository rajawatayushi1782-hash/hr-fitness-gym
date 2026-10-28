const fs = require('fs');
const path = require('path');

const fonts = [
  'Gilroy-Bold.woff2',
  'Gilroy-Bold.woff',
  'Gilroy-Bold.ttf',
  'Gilroy-Semibold.woff2',
  'Gilroy-Semibold.woff',
  'Gilroy-Semibold.ttf',
  'Gilroy-Medium.woff2',
  'Gilroy-Medium.woff',
  'Gilroy-Medium.ttf'
];

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed to fetch ${url} (status: ${res.status})`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
    console.log(`Saved: ${dest} (${buffer.length} bytes)`);
    return true;
  } catch (e) {
    console.error(`Error downloading ${url}:`, e.message);
    return false;
  }
}

async function main() {
  console.log('Downloading fonts...');
  for (const f of fonts) {
    const fontUrl = `https://go180.nl/app/themes/go180/assets/fonts/${f}`;
    const dest = path.join(__dirname, 'public', 'fonts', f);
    await downloadFile(fontUrl, dest);
  }

  console.log('\nDownloading video header...');
  await downloadFile('https://go180.nl/video/header.mp4', path.join(__dirname, 'public', 'video', 'header.mp4'));

  console.log('\nDone with fonts and video.');
}

main();
