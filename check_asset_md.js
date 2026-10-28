const fs = require('fs');
const md = fs.readFileSync('gym website (1)/gym website/ASSET_INVENTORY.md', 'utf8');

let idx = 0;
while ((idx = md.indexOf('GO180-32-790x860', idx)) !== -1) {
  console.log(md.substring(Math.max(0, idx - 100), Math.min(md.length, idx + 200)));
  idx += 16;
}
