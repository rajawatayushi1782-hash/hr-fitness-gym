const fs = require('fs');
const live = JSON.parse(fs.readFileSync('live_homepage_components.json', 'utf8'));

// Clean live slides HTML by converting live domain URLs to local replica URLs
let cleanSlides = live.slidesHTML
  .replace(/https:\/\/go180\.nl\/video\/header\.mp4/g, '/video/header.mp4')
  .replace(/https:\/\/go180\.nl\/app\/smush-webp\/[^"]*\/([^"]+)/g, '/images/$1')
  .replace(/https:\/\/go180\.nl\/app\/uploads\/[^"]*\/([^"]+)/g, '/images/$1')
  .replace(/https:\/\/go180\.nl\//g, '/')
  .replace(/https:\/\/go180\.nl/g, '');

fs.writeFileSync('clean_live_slides.html', cleanSlides);
console.log('Saved clean_live_slides.html, length:', cleanSlides.length);
