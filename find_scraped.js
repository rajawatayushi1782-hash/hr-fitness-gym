const fs = require('fs');

const dir = 'scraped_pages';
const files = fs.readdirSync(dir);

files.forEach(f => {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  if (c.includes('Fit na zwangerschap')) {
    console.log(`Found "Fit na zwangerschap" in scraped_pages/${f}`);
  }
});
