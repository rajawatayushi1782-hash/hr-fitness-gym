const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve('public/pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const map = JSON.parse(fs.readFileSync('image_replacement_map.json', 'utf8'));

// Also add variants without leading slash or with /app/uploads...
const expandedMap = {};
for (const [k, v] of Object.entries(map)) {
  expandedMap[k] = v;
  if (k.startsWith('/')) {
    expandedMap[k.substring(1)] = v;
  }
}

// Additional specific semantic mappings
expandedMap['/images/Appie-Kooistra.jpg.webp'] = '/images/indian_fitness/coach_vikram_strength.jpg';
expandedMap['/images/Thomas-Kramer-e1765522106800.jpg.webp'] = '/images/indian_fitness/coach_rahul_performance.jpg';
expandedMap['/images/AronWeidenaar_LR-8501-e1748354122881.jpg.webp'] = '/images/indian_fitness/coach_rohan_functional.jpg';
expandedMap['/images/GO180-72-scaled-e1700061605559.jpg.webp'] = '/images/indian_fitness/coach_priya_nutrition.jpg';
expandedMap['/images/GO180-112-scaled-e1700061683370.jpg.webp'] = '/images/indian_fitness/coach_amit_transformation.jpg';
expandedMap['/images/GO180-126-scaled-e1700061695914.jpg.webp'] = '/images/indian_fitness/coach_ananya_personal_trainer.jpg';

expandedMap['/images/GO180-72-760x990.jpg.webp'] = '/images/indian_fitness/coach_priya_nutrition.jpg';
expandedMap['/images/GO180-112-760x990.jpg.webp'] = '/images/indian_fitness/coach_amit_transformation.jpg';
expandedMap['/images/GO180-126-760x990.jpg.webp'] = '/images/indian_fitness/coach_ananya_personal_trainer.jpg';

// Homepage slides
expandedMap['/images/GO180-81-scaled-e1695809915448.jpg.webp'] = '/images/indian_fitness/hero_slide1_indian_gym.jpg';
expandedMap['/images/GO180-46-scaled-e1695809932401.jpg.webp'] = '/images/indian_fitness/programs_slide2_indian_gym.jpg';
expandedMap['/images/GO180-7-scaled-e1695809883842.jpg.webp'] = '/images/indian_fitness/coaches_slide3_indian_gym.jpg';
expandedMap['/images/GO180-scaled-e1695809865642.jpg.webp'] = '/images/indian_fitness/our_club_slide4_indian_gym.jpg';
expandedMap['/images/GO180-150-scaled-e1695809898674.jpg.webp'] = '/images/indian_fitness/stories_slide5_indian_gym.jpg';
expandedMap['/images/GO180-86-scaled-e1695809946906.jpg.webp'] = '/images/indian_fitness/join_now_slide6_indian_gym.jpg';

let totalReplacements = 0;
const pageReport = [];

// Sort keys by length descending so longer paths match first
const sortedKeys = Object.keys(expandedMap).sort((a, b) => b.length - a.length);

for (const page of pages) {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');
  let countForPage = 0;

  for (const oldSrc of sortedKeys) {
    if (content.includes(oldSrc)) {
      const newSrc = expandedMap[oldSrc];
      // Escape for regex
      const escaped = oldSrc.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const re = new RegExp(escaped, 'g');
      const matches = content.match(re);
      if (matches) {
        countForPage += matches.length;
        content = content.replace(re, newSrc);
      }
    }
  }

  // Also clean up any lingering Dutch alt tags on coaches
  content = content.replace(/alt="eigenaar en personal coach 180"/g, 'alt="Head Strength Coach | HR Fitness Club"');
  content = content.replace(/alt="Thomas Kramer"/g, 'alt="High-Performance Movement Coach | HR Fitness Club"');
  content = content.replace(/alt="Hielke Feenstra"/g, 'alt="Functional Fitness Coach | HR Fitness Club"');
  content = content.replace(/alt="Annick Douma"/g, 'alt="Certified Fitness & Nutrition Coach | HR Fitness Club"');
  content = content.replace(/alt="Hielke van der Lei"/g, 'alt="Transformation Specialist | HR Fitness Club"');
  content = content.replace(/alt="Arjon van der Wal"/g, 'alt="Personal Training Specialist | HR Fitness Club"');

  if (countForPage > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplacements += countForPage;
    pageReport.push({ page, count: countForPage });
  }
}

console.log(`\n========================================`);
console.log(`TOTAL REPLACEMENTS ACROSS WEBSITE: ${totalReplacements}`);
console.log(`PAGES MODIFIED: ${pageReport.length}`);
console.log(`========================================`);
pageReport.forEach(r => console.log(`  ${r.page}: ${r.count} replacements`));
