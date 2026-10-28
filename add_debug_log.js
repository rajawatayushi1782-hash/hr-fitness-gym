const fs = require('fs');
let code = fs.readFileSync('./public/js/original_main.js', 'utf8');
code = code.replace('function initReviewsSwiper(){', 'function initReviewsSwiper(){console.log("DEBUG: INIT_REVIEWS_SWIPER CALLED!");');
fs.writeFileSync('./public/js/original_main.js', code, 'utf8');
console.log('Added log to initReviewsSwiper');
