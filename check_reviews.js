const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

// Search for review / testimonial content
const reviewIdx = html.indexOf('reviews');
console.log('reviewIdx:', reviewIdx);

let idx = 0;
while ((idx = html.indexOf('eapps-widget', idx)) !== -1) {
  console.log('eapps-widget at', idx);
  console.log(html.substring(idx, idx + 800));
  idx += 12;
}

const swiperMatches = html.match(/<div[^>]*class="[^"]*swiper-slide[^"]*"[^>]*>([\s\S]*?)<\/div>/gi) || [];
console.log('Swiper slides found:', swiperMatches.length);
swiperMatches.slice(0, 3).forEach((s, i) => console.log(`Slide ${i}:`, s.substring(0, 300)));
