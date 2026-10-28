const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

console.log('Total pages found:', pages.length);

const inventory = [];

for (const pageFile of pages) {
  const content = fs.readFileSync(path.join(pagesDir, pageFile), 'utf8');
  
  // 1. Find all <img> tags
  const imgRegex = /<img\b([^>]*)>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const attrs = match[1];
    
    // Extract src, data-src, alt, class, data-smush-webp-fallback
    const srcMatch = attrs.match(/\bsrc=["']([^"']*)["']/i);
    const dataSrcMatch = attrs.match(/\bdata-src=["']([^"']*)["']/i);
    const altMatch = attrs.match(/\balt=["']([^"']*)["']/i);
    const classMatch = attrs.match(/\bclass=["']([^"']*)["']/i);
    const fallbackMatch = attrs.match(/\bdata-smush-webp-fallback=["']([^"']*)["']/i);
    
    const src = srcMatch ? srcMatch[1] : '';
    const dataSrc = dataSrcMatch ? dataSrcMatch[1] : '';
    const effectiveSrc = dataSrc || src;
    const alt = altMatch ? altMatch[1] : '';
    const className = classMatch ? classMatch[1] : '';
    
    // Get context snippet around image
    const idx = match.index;
    const start = Math.max(0, idx - 400);
    const end = Math.min(content.length, idx + 400);
    const context = content.slice(start, end).replace(/\s+/g, ' ');
    
    // Determine section name from context or classes
    let section = 'General Content';
    if (className.includes('slide__img') || context.includes('class="slide')) section = 'Hero / Slider';
    else if (className.includes('imageText') || context.includes('imageText')) section = 'Image & Text Feature';
    else if (className.includes('carousel') || context.includes('carousel')) section = 'Carousel / Gallery';
    else if (className.includes('headerLower') || context.includes('headerLower')) section = 'Header Banner';
    else if (className.includes('nextPage') || context.includes('nextPage')) section = 'Next Page Teaser';
    else if (context.includes('coach') || context.includes('trainer')) section = 'Coach / Trainer Profile';
    else if (context.includes('review') || context.includes('testimonial')) section = 'Reviews / Testimonials';
    else if (context.includes('footer')) section = 'Footer';
    
    // Extract heading near context
    const headingMatch = context.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
    const nearbyHeading = headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    inventory.push({
      page: pageFile,
      section,
      effectiveSrc,
      alt,
      className,
      nearbyHeading,
      type: 'img'
    });
  }

  // 2. Find background-image in inline style
  const bgRegex = /style=["'][^"']*background(?:-image)?\s*:\s*url\((?:'|")?([^'"\)]+)(?:'|")?\)/gi;
  let bgMatch;
  while ((bgMatch = bgRegex.exec(content)) !== null) {
    inventory.push({
      page: pageFile,
      section: 'CSS Background',
      effectiveSrc: bgMatch[1],
      alt: 'Inline Background',
      className: '',
      nearbyHeading: '',
      type: 'background'
    });
  }
}

console.log('Total image instances across all pages:', inventory.length);
fs.writeFileSync('website_image_instances.json', JSON.stringify(inventory, null, 2), 'utf8');

// Group by unique image sources
const uniqueSources = new Map();
for (const item of inventory) {
  const s = item.effectiveSrc;
  if (!uniqueSources.has(s)) uniqueSources.set(s, []);
  uniqueSources.get(s).push(item.page);
}

console.log('Unique image URLs referenced in pages:', uniqueSources.size);

// Print sample
let count = 0;
for (const [src, pagesList] of uniqueSources.entries()) {
  if (count++ < 20) {
    console.log(src, '-> used on', pagesList.length, 'pages:', pagesList.slice(0, 3).join(', '));
  }
}
