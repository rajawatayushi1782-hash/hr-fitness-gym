const fs = require('fs');

const data = JSON.parse(fs.readFileSync('detailed_image_slots.json', 'utf8'));

const categories = {
  homepage_slides: [],
  coaches: [],
  programs: [],
  club_facilities: [],
  stories: [],
  conversion_and_about: [],
  banners: [],
  other: []
};

for (const item of data.uniqueImages) {
  const pList = item.pages.join(' ');
  const s = item.src;
  
  if (pList === 'home.html' && (s.includes('GO180-81') || s.includes('GO180-46') || s.includes('GO180-7-') || s.includes('GO180-scaled') || s.includes('GO180-150') || s.includes('GO180-86'))) {
    categories.homepage_slides.push(item);
  } else if (pList.includes('coach-') || pList === 'coaches.html') {
    categories.coaches.push(item);
  } else if (pList.includes('programs-') || pList === 'programs.html') {
    categories.programs.push(item);
  } else if (pList.includes('club-leeuwarden.html')) {
    categories.club_facilities.push(item);
  } else if (pList.includes('story-') || pList === 'stories.html') {
    categories.stories.push(item);
  } else if (pList.includes('free-trial.html') || pList.includes('join-now.html') || pList.includes('pricing.html') || pList.includes('we-are-go180.html') || pList.includes('contact.html')) {
    categories.conversion_and_about.push(item);
  } else if (s.includes('1920x648') || s.includes('1800x648')) {
    categories.banners.push(item);
  } else {
    categories.other.push(item);
  }
}

for (const [k, v] of Object.entries(categories)) {
  console.log(`=== ${k.toUpperCase()} (${v.length} images) ===`);
  v.slice(0, 8).forEach(img => {
    console.log(`  ${img.src} -> ${img.pages.slice(0, 3).join(', ')} [${img.headings.join(' | ')}]`);
  });
}
