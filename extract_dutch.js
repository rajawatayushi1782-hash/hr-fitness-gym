const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

// Detect Dutch words commonly appearing in sentences
const dutchRegex = /\b(van|het|een|voor|met|jouw|onze|ook|maar|naar|geen|blijvende|resultaten|afgestemd|persoonlijke|ervaring|bekijk|leeuwarden|groningen|toekomst|proefweek|lidmaatschap|tarieven|leefstijl|voeding|sportschool|krachtoefeningen|spieropbouw|vetverlies|afvallen|waarom|kiezen|doelen|lichaam|gezondheid|niveau|tempo|verhaal|wensen|agenda|programma|begeleiding|wetenschappelijk|coaches|trainers|afspraak|gratis)\b/i;

const report = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  
  // Find paragraphs, headings, list items, buttons, spans with Dutch
  const tags = content.match(/<(p|h1|h2|h3|h4|h5|h6|li|a|span|div|button|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  
  const dutchSnippets = [];
  tags.forEach(t => {
    // Strip child tags
    const text = t.replace(/<[^>]+>/g, ' ').replace(/[\r\n\t]+/g, ' ').trim();
    if (text.length > 5 && dutchRegex.test(text)) {
      // Don't include if it is just a URL or asset path
      if (!text.startsWith('http') && !text.includes('/app/uploads/') && !text.includes('wp-theme')) {
        // Count how many dutch words
        const words = text.toLowerCase().split(/\s+/);
        const matches = words.filter(w => ['van', 'het', 'een', 'voor', 'met', 'jouw', 'onze', 'ook', 'maar', 'naar', 'geen', 'blijvende', 'resultaten', 'afgestemd', 'persoonlijke', 'ervaring', 'bekijk', 'leeuwarden', 'groningen', 'toekomst', 'proefweek', 'lidmaatschap', 'tarieven', 'leefstijl', 'voeding', 'sportschool', 'afvallen', 'waarom', 'kiezen'].includes(w));
        if (matches.length >= 2 || (matches.length >= 1 && text.length < 50)) {
          dutchSnippets.push(text);
        }
      }
    }
  });

  report[f] = {
    totalSnippets: dutchSnippets.length,
    snippets: [...new Set(dutchSnippets)]
  };
});

fs.writeFileSync('dutch_scan_report.json', JSON.stringify(report, null, 2), 'utf8');

let totalPagesWithDutch = 0;
for (const f in report) {
  if (report[f].totalSnippets > 0) {
    totalPagesWithDutch++;
    console.log(`${f}: ${report[f].snippets.length} unique Dutch text blocks`);
  }
}
console.log(`Summary: ${totalPagesWithDutch} of ${files.length} pages contain Dutch text blocks.`);
