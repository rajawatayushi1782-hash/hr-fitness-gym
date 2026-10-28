const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

console.log('Auditing pages in:', pagesDir);
files.forEach(f => {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf-8');
  const hasSubMenu = content.includes('sub-menu');
  const hasItem17 = content.includes('id="menu-item-17"') || content.includes("id='menu-item-17'");
  const hasEssentials = content.includes('/programs/essentials/');
  const hasHyrox = content.includes('/programs/hyrox/');
  
  // Check if header exists
  const hasHeader = content.includes('<header') || content.includes('class="header');
  const hasFooter = content.includes('<footer') || content.includes('class="footer');
  
  console.log(f, {
    hasSubMenu,
    hasItem17,
    hasEssentials,
    hasHyrox,
    hasHeader,
    hasFooter
  });
});
