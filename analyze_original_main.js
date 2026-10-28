const fs = require('fs');
const content = fs.readFileSync('original_main.js', 'utf8');

console.log('Total length of original_main.js:', content.length);

const patterns = [
  /slide__navigationBullet/g,
  /has-scroll-smooth/g,
  /locomotive/gi,
  /data-scroll/g,
  /dragslider/gi,
  /header/gi,
  /hamburger/gi,
  /sub-menu/gi,
  /scrollContainer/gi,
  /\.wipe/gi,
  /barba/gi,
  /slick/gi
];

patterns.forEach(p => {
  const matches = content.match(p);
  console.log(`${p}: ${matches ? matches.length : 0} occurrences`);
});

// Find occurrences of slide__navigationBullet with surrounding context
let idx = 0;
while ((idx = content.indexOf('slide__navigationBullet', idx)) !== -1) {
  console.log('\n--- Match around slide__navigationBullet at ' + idx + ' ---');
  console.log(content.slice(Math.max(0, idx - 200), Math.min(content.length, idx + 300)));
  idx += 23;
}
