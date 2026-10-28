const fs = require('fs');
const path = require('path');

const liveHtml = fs.readFileSync(path.join(__dirname, 'original_live_dom.html'), 'utf8');
const replicaHtml = fs.readFileSync(path.join(__dirname, 'public', 'pages', 'home.html'), 'utf8');

console.log('Live HTML size:', liveHtml.length);
console.log('Replica HTML size:', replicaHtml.length);

// Compare elements
function analyzeHtml(html, label) {
  const sections = (html.match(/<section[^>]*>/gi) || []).map(s => s.slice(0, 80));
  const ids = (html.match(/id="[^"]+"/gi) || []).map(s => s.replace(/id="/, '').replace(/"/, ''));
  const dataScrolls = (html.match(/data-scroll[^= >]*/gi) || []);
  const svgs = (html.match(/<svg[^>]*>/gi) || []).length;
  const imgs = (html.match(/<img[^>]*>/gi) || []).length;
  const videos = (html.match(/<video[^>]*>/gi) || []).length;
  const iframes = (html.match(/<iframe[^>]*>/gi) || []).length;

  console.log(`\n=== Analysis for ${label} ===`);
  console.log('Sections count:', sections.length);
  console.log('Unique IDs count:', new Set(ids).size);
  console.log('data-scroll attributes count:', dataScrolls.length);
  console.log('SVGs count:', svgs);
  console.log('Images count:', imgs);
  console.log('Videos count:', videos);
  console.log('iFrames count:', iframes);

  return { sections, ids: new Set(ids) };
}

const liveAnalysis = analyzeHtml(liveHtml, 'ORIGINAL LIVE');
const replicaAnalysis = analyzeHtml(replicaHtml, 'LOCAL REPLICA');

// Missing IDs in replica
const missingInReplica = [...liveAnalysis.ids].filter(id => !replicaAnalysis.ids.has(id));
console.log('\nIDs in Live but NOT in Replica (first 30):', missingInReplica.slice(0, 30));

// Missing IDs in live
const extraInReplica = [...replicaAnalysis.ids].filter(id => !liveAnalysis.ids.has(id));
console.log('\nIDs in Replica but NOT in Live (first 30):', extraInReplica.slice(0, 30));
