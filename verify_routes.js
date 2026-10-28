const http = require('http');

const routes = [
  { name: 'Home', path: '/' },
  { name: 'We are GO180', path: '/we-are-go180/' },
  { name: 'Programs', path: '/programs/' },
  { name: 'Programs Essentials', path: '/programs/essentials/' },
  { name: 'Coaches', path: '/coaches/' },
  { name: 'Club Leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'Stories', path: '/stories/' },
  { name: 'Pricing', path: '/pricing/' },
  { name: 'Contact', path: '/contact/' },
  { name: 'Join Now', path: '/join-now/' },
  { name: 'Free Trial', path: '/free-trial/' }
];

async function checkAll() {
  console.log('--- Checking HTTP Status for All GO180 Replica Routes ---');
  let allOk = true;

  for (const r of routes) {
    await new Promise(resolve => {
      http.get('http://127.0.0.1:3000' + r.path, res => {
        let size = 0;
        res.on('data', chunk => size += chunk.length);
        res.on('end', () => {
          const ok = res.statusCode === 200;
          if (!ok) allOk = false;
          console.log(`[HTTP ${res.statusCode}] ${r.name.padEnd(22)} ${r.path.padEnd(25)} (${size.toLocaleString()} bytes)`);
          resolve();
        });
      }).on('error', err => {
        allOk = false;
        console.log(`[FAIL] ${r.name}: ${err.message}`);
        resolve();
      });
    });
  }

  // Also check static assets
  const staticAssets = [
    '/css/main.css',
    '/js/original_main.js',
    '/fonts/Gilroy-Bold.woff2',
    '/fonts/Gilroy-Medium.woff2',
    '/fonts/Gilroy-Semibold.woff2',
    '/video/header.mp4',
    '/img/arrow-select.svg'
  ];

  console.log('\n--- Checking Core Static Assets ---');
  for (const asset of staticAssets) {
    await new Promise(resolve => {
      http.get('http://127.0.0.1:3000' + asset, res => {
        let size = 0;
        res.on('data', chunk => size += chunk.length);
        res.on('end', () => {
          console.log(`[HTTP ${res.statusCode}] ${asset.padEnd(30)} (${size.toLocaleString()} bytes)`);
          resolve();
        });
      }).on('error', err => {
        console.log(`[FAIL] ${asset}: ${err.message}`);
        resolve();
      });
    });
  }

  console.log('\nAll routes and assets verified!');
}

checkAll();
