const fs = require('fs');

const ess = fs.readFileSync('public/pages/programs-essentials.html', 'utf8');

// Find where GO180-32-790x860 or GO180-105 is in essentials or other program files
['programs-essentials.html', 'programs-fundamentals.html', 'programs-go2gether.html'].forEach(f => {
  const c = fs.readFileSync('public/pages/' + f, 'utf8');
  if (c.includes('GO180-32-790x860') || c.includes('GO180-105')) {
    console.log(`Found in ${f}:`);
    let idx = c.indexOf('GO180-32-790x860');
    if (idx !== -1) console.log(c.substring(idx - 100, idx + 400));
  }
});
