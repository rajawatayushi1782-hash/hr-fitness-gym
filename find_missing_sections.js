const fs = require('fs');

function inspectDiff(filename) {
  const c1 = fs.readFileSync('public/pages/' + filename, 'utf-8');
  const c2 = fs.readFileSync('scraped_pages/' + filename, 'utf-8');

  // Extract all IDs, section classes, and headings
  const getStructure = (html) => {
    const ids = Array.from(html.matchAll(/id="([^"]+)"/g)).map(m => m[1]);
    const sections = Array.from(html.matchAll(/<section[^>]*class="([^"]+)"/g)).map(m => m[1]);
    const h2s = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const h3s = Array.from(html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const imgs = Array.from(html.matchAll(/src="([^"]+)"/g)).map(m => m[1]);
    return { ids, sections, h2s, h3s, imgsCount: imgs.length };
  };

  const s1 = getStructure(c1);
  const s2 = getStructure(c2);

  console.log(`=== ${filename} ===`);
  console.log('Public H2s:', s1.h2s);
  console.log('Scraped H2s:', s2.h2s);

  // Missing H2s
  const missingH2s = s2.h2s.filter(h => !s1.h2s.includes(h));
  console.log('Missing H2s in public:', missingH2s);

  // Missing IDs
  const missingIds = s2.ids.filter(id => !s1.ids.includes(id));
  console.log('Missing IDs in public:', missingIds);
}

inspectDiff('club-leeuwarden.html');
inspectDiff('we-are-go180.html');
inspectDiff('programs.html');
inspectDiff('pricing.html');
