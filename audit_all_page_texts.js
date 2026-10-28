const fs = require('fs');
const path = require('path');

const pagesDir = 'public/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const inventory = [];

files.forEach(file => {
  const c = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  
  // Extract title
  const titleM = c.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleM ? titleM[1].trim() : 'NO TITLE';

  // Extract meta description
  const metaDescM = c.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const metaDesc = metaDescM ? metaDescM[1].trim() : 'NO META DESC';

  // Count go180, leeuwarden, phone, email
  const go180Count = (c.match(/go180/gi) || []).length;
  const leeuwardenCount = (c.match(/leeuwarden/gi) || []).length;
  const phoneCount = (c.match(/058|2038080|203 8080/g) || []).length;
  const emailCount = (c.match(/info@go180\.nl|administratie@go180\.nl/gi) || []).length;

  inventory.push({
    file,
    title,
    go180Count,
    leeuwardenCount,
    phoneCount,
    emailCount
  });
});

console.log(`Audited ${inventory.length} HTML files.`);
inventory.forEach(inv => {
  console.log(`[${inv.file}] (GO180: ${inv.go180Count}, Leeuwarden: ${inv.leeuwardenCount}, Phone: ${inv.phoneCount}, Email: ${inv.emailCount}) Title: "${inv.title}"`);
});
fs.writeFileSync('page_text_audit.json', JSON.stringify(inventory, null, 2), 'utf8');
