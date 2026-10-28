const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const idx = html.indexOf('swiper-slide');
console.log('swiper-slide full content sample:');
console.log(html.substring(idx, idx + 1500));
