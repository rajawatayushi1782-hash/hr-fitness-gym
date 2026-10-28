const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const dutchPhrases = [
  'van je', 'van het', 'voor je', 'met onze', 'met jouw', 'in onze', 'op onze', 'naar een',
  'Lees meer', 'Bekijk onze', 'Neem contact', 'Gratis proefles', 'Gratis proefweek',
  'Bouwen aan', 'toekomst', 'jouw doelen', 'jouw lichaam', 'jouw gezondheid', 'jouw leefstijl',
  'jouw niveau', 'jouw tempo', 'jouw verhaal', 'jouw wensen', 'jouw agenda', 'jouw programma',
  'Waarom kiezen voor', 'blijvende resultaten', 'afgestemd op', 'persoonlijke begeleiding',
  'wetenschappelijk onderbouwd', 'ervaren coaches', 'krachtoefeningen', 'spieropbouw',
  'vetverlies', 'afvallen', 'geen sprake', 'geen probleem', 'verder lezen', 'meer informatie',
  'Maak kennis met', 'Wat anderen zeggen', 'Onze leden', 'Schrijf je in', 'Lid worden',
  'Leeuwarden', 'Groningen', 'GO180', 'go180'
];

const auditResults = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const issues = [];

  // Check title
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Check h1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // Check for Build your tomorrow vs Build Your Tomorrow
  if (content.includes('Build your tomorrow')) {
    issues.push({ type: 'casing', detail: 'Contains uncapitalized "Build your tomorrow"' });
  }

  // Check for Byouild or tOmOrrOw
  if (content.toLowerCase().includes('byouild') || (content.toLowerCase().includes('tomorrow') && content.includes('tOmOrrOw'))) {
    issues.push({ type: 'corruption', detail: 'Contains corrupted heading text' });
  }

  // Strip scripts and styles to check visible text only
  const visible = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Check for Dutch phrases in visible content
  for (const phrase of dutchPhrases) {
    let searchIdx = 0;
    while ((searchIdx = visible.indexOf(phrase, searchIdx)) !== -1) {
      // Ignore if inside an image src/data-src attribute
      const before = visible.substring(Math.max(0, searchIdx - 60), searchIdx);
      if (!before.includes('src=') && !before.includes('srcset=') && !before.includes('href="/app/') && !before.includes('data-src=')) {
        const snippet = visible.substring(Math.max(0, searchIdx - 30), Math.min(visible.length, searchIdx + phrase.length + 40)).replace(/[\r\n\t]+/g, ' ').trim();
        issues.push({ type: 'dutch_phrase', phrase, snippet });
        break; // Log once per phrase per file to keep it manageable
      }
      searchIdx += phrase.length;
    }
  }

  auditResults[file] = {
    title,
    h1,
    issueCount: issues.length,
    issues
  };
}

fs.writeFileSync('audit_summary.json', JSON.stringify(auditResults, null, 2));

const filesWithIssues = Object.keys(auditResults).filter(f => auditResults[f].issueCount > 0);
console.log('Total pages audited:', files.length);
console.log('Pages with issues:', filesWithIssues.length);
filesWithIssues.forEach(f => {
  console.log(`- ${f}: ${auditResults[f].issueCount} issues (H1: "${auditResults[f].h1}")`);
});
