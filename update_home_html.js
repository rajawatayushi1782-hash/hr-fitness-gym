const fs = require('fs');

const cleanSlides = fs.readFileSync('clean_live_slides.html', 'utf8');
let homeHTML = fs.readFileSync('public/pages/home.html', 'utf8');

// Replace the slides block
const slidesRegex = /<div data-scroll-section="" class="slides"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<footer/i;
const footerIdx = homeHTML.indexOf('<footer');
const slidesStartIdx = homeHTML.indexOf('<div data-scroll-section="" class="slides"');

if (slidesStartIdx !== -1 && footerIdx !== -1) {
  homeHTML = homeHTML.slice(0, slidesStartIdx) + cleanSlides + '\n\n' + homeHTML.slice(footerIdx);
  console.log('Replaced slides block successfully.');
} else {
  console.error('Could not locate slides block in home.html');
}

// Remove <script src="/js/app.js"></script>
homeHTML = homeHTML.replace(/<script src="\/js\/app\.js"><\/script>/g, '');

fs.writeFileSync('public/pages/home.html', homeHTML);
console.log('Updated public/pages/home.html successfully.');
