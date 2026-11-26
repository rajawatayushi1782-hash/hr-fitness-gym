const fs = require('fs');
const path = require('path');

const pagesDir = path.join('public', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const slots = [];

for (const page of pages) {
  const content = fs.readFileSync(path.join(pagesDir, page), 'utf8');
  
  // Find all img tags
  const imgRegex = /<img\b([^>]*)>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const attrs = match[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const dataSrcMatch = attrs.match(/data-src=["']([^"']+)["']/i);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
    const classMatch = attrs.match(/class=["']([^"']*)["']/i);
    
    const src = dataSrcMatch ? dataSrcMatch[1] : (srcMatch ? srcMatch[1] : null);
    if (!src || src.endsWith('.svg') || src.includes('data:image')) continue;
    
    // Find nearby heading or section
    const idx = match.index;
    const start = Math.max(0, idx - 400);
    const end = Math.min(content.length, idx + 400);
    const context = content.substring(start, end);
    
    const hMatch = context.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
    const heading = hMatch ? hMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    slots.push({
      page,
      src,
      alt: altMatch ? altMatch[1] : '',
      class: classMatch ? classMatch[1] : '',
      heading
    });
  }
}

console.log(`Found ${slots.length} image slots across ${pages.length} pages.`);

// Group by source image
const byImage = {};
for (const s of slots) {
  if (!byImage[s.src]) {
    byImage[s.src] = { src: s.src, occurrences: 0, pages: new Set(), headings: new Set(), alts: new Set() };
  }
  byImage[s.src].occurrences++;
  byImage[s.src].pages.add(s.page);
  if (s.heading) byImage[s.src].headings.add(s.heading);
  if (s.alt) byImage[s.src].alts.add(s.alt);
}

const uniqueImages = Object.values(byImage).map(b => ({
  src: b.src,
  occurrences: b.occurrences,
  pages: Array.from(b.pages),
  headings: Array.from(b.headings).slice(0, 3),
  alts: Array.from(b.alts).slice(0, 2)
})).sort((a, b) => b.occurrences - a.occurrences);

fs.writeFileSync('detailed_image_slots.json', JSON.stringify({ totalSlots: slots.length, uniqueImages }, null, 2));
console.log(`Saved detailed breakdown to detailed_image_slots.json (${uniqueImages.length} unique images).`);
