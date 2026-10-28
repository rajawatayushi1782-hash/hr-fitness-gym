const fs = require('fs');
const path = require('path');

const dir = 'public/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const inventory = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Check 1: Slick carousels (.carousel__holder)
  if (content.includes('carousel__holder')) {
    const hasNav = content.includes('carousel__nav');
    const slides = (content.match(/class=["'][^"']*carousel__slide[^"']*["']/g) || []).length;
    inventory.push({
      page: file,
      type: 'Slick Carousel (.carousel__holder)',
      slidesCount: slides,
      hasNavContainer: hasNav,
      selector: '.carousel__holder'
    });
  }

  // Check 2: DragSlider (.dragSlider)
  if (content.includes('dragSlider')) {
    const slides = (content.match(/class=["'][^"']*dragSlider__slide[^"']*["']/g) || []).length;
    const navPoints = (content.match(/class=["'][^"']*dragSlider__navPoint[^"']*["']/g) || []).length;
    inventory.push({
      page: file,
      type: 'GSAP DragSlider (.dragSlider)',
      slidesCount: slides,
      navPointsCount: navPoints,
      selector: '.dragSlider'
    });
  }

  // Check 3: ArchiveSlider (.archiveSlider)
  if (content.includes('archiveSlider')) {
    const slides = (content.match(/class=["'][^"']*archiveSlider__slide[^"']*["']/g) || []).length;
    inventory.push({
      page: file,
      type: 'Archive Slider (.archiveSlider)',
      slidesCount: slides,
      selector: '.archiveSlider'
    });
  }

  // Check 4: Swiper / Elfsight Reviews Carousel
  if (content.includes('es-carousel') || content.includes('swiper-wrapper')) {
    const slides = (content.match(/class=["'][^"']*swiper-slide[^"']*["']/g) || []).length;
    inventory.push({
      page: file,
      type: 'Reviews Swiper Carousel',
      slidesCount: slides,
      selector: '.swiper'
    });
  }

  // Check 5: Any other horizontal gallery or cards
  const otherMatches = content.match(/<div[^>]*class=["'][^"']*(?:gallery|horizontal|side-scroll|card-slider)[^"']*["']/gi) || [];
  if (otherMatches.length) {
    inventory.push({
      page: file,
      type: 'Other gallery/slider',
      matches: otherMatches
    });
  }
}

console.log('Complete Carousel Inventory (', inventory.length, 'sections found ):');
console.log(JSON.stringify(inventory, null, 2));
fs.writeFileSync('full_carousel_inventory.json', JSON.stringify(inventory, null, 2), 'utf8');
