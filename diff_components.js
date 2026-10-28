const fs = require('fs');
const live = JSON.parse(fs.readFileSync('live_homepage_components.json', 'utf8'));
const replicaHTML = fs.readFileSync('public/pages/home.html', 'utf8');

console.log('--- COMPONENT COMPARISON ---');
for (const [key, val] of Object.entries(live)) {
  if (!val) {
    console.log(`[${key}] Not present in live data`);
    continue;
  }
  // Check if key exists in replica
  let needle = '';
  if (key === 'slidesHTML') needle = 'class="slides"';
  else if (key === 'slideNavHTML') needle = 'class="slide__navigation"';
  else if (key === 'arrowScrollHTML') needle = 'class="arrowScroll"';
  else if (key === 'headerHTML') needle = 'class="header"';
  else if (key === 'mobileMenuHTML') needle = 'class="mobile__menu"';
  else if (key === 'wipeHTML') needle = 'class="wipe"';

  const inReplica = replicaHTML.includes(needle);
  console.log(`[${key}] Live length: ${val.length}, In replica: ${inReplica}`);
}

// Check slide-1 diff specifically
const liveS1 = live.slidesHTML.match(/<div id="slide-1"[^>]*>([\s\S]*?)<\/div>\s*<div id="slide-2"/);
const replicaS1 = replicaHTML.match(/<div id="slide-1"[^>]*>([\s\S]*?)<\/div>\s*<div id="slide-2"/);
if (liveS1 && replicaS1) {
  console.log('\n--- LIVE SLIDE-1 ATTRIBUTES ---');
  console.log(live.slidesHTML.match(/<div id="slide-1"[^>]*>/)[0]);
  console.log('\n--- REPLICA SLIDE-1 ATTRIBUTES ---');
  console.log(replicaHTML.match(/<div id="slide-1"[^>]*>/)[0]);
}

// Check all slide attributes
for (let i = 1; i <= 6; i++) {
  const liveMatch = live.slidesHTML.match(new RegExp(`<div id="slide-${i}"[^>]*>`));
  const repMatch = replicaHTML.match(new RegExp(`<div id="slide-${i}"[^>]*>`));
  console.log(`Slide ${i}:`);
  console.log('  Live:   ', liveMatch ? liveMatch[0] : 'MISSING');
  console.log('  Replica:', repMatch ? repMatch[0] : 'MISSING');
}
