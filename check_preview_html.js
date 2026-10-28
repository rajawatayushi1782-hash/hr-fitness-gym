const fs = require('fs');
const path = require('path');

const p1 = path.join(__dirname, 'gym website (1)', 'gym website', 'contact_sheet.html');
const p2 = path.join(__dirname, 'gym website (1)', 'gym website', 'asset-preview', 'index.html');

console.log('contact_sheet.html exists:', fs.existsSync(p1), 'size:', fs.existsSync(p1) ? fs.statSync(p1).size : 0);
console.log('asset-preview/index.html exists:', fs.existsSync(p2), 'size:', fs.existsSync(p2) ? fs.statSync(p2).size : 0);

if (fs.existsSync(p2)) {
  const content = fs.readFileSync(p2, 'utf8');
  console.log('asset-preview/index.html snippet:');
  console.log(content.slice(0, 1000));
}
