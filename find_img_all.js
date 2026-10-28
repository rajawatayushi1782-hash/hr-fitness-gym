const fs = require('fs');
const files = fs.readdirSync('public/pages').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync('public/pages/' + f, 'utf8');
  if (c.includes('GO180-32-790x860')) {
    console.log(`Found GO180-32-790x860 in ${f}`);
    const idx = c.indexOf('GO180-32-790x860');
    console.log(c.substring(idx - 200, idx + 400));
  }
});
