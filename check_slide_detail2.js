const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const idx = html.indexOf('swiper-slide');
console.log(html.substring(idx + 1500, idx + 4000));
