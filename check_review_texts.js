const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const swiperMatches = html.match(/<div[^>]*class="[^"]*swiper-slide[^"]*"[^>]*>([\s\S]*?)<\/div>/gi) || [];

swiperMatches.forEach((s, i) => {
  const text = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Review ${i}: ${text.substring(0, 160)}`);
});
