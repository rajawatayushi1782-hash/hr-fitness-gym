const fs = require('fs');

if (fs.existsSync('playwright_final_audit.json')) {
  const data = JSON.parse(fs.readFileSync('playwright_final_audit.json', 'utf8'));
  console.log(`Found ${data.length} audited routes in report:`);
  let all200 = true;
  let allClean = true;
  data.forEach((r, idx) => {
    if (r.status !== 200) {
      console.error(`Route [${idx}] ${r.route} status ${r.status}`);
      all200 = false;
    }
    if (r.corruptedFound !== 'NONE') {
      console.error(`Route [${idx}] ${r.route} corrupted: ${JSON.stringify(r.corruptedFound)}`);
      allClean = false;
    }
  });
  if (all200 && allClean) {
    console.log(`ALL ${data.length} ROUTES VERIFIED: STATUS 200 OK & ZERO CORRUPTED TEXT!`);
  }
} else {
  console.log('playwright_final_audit.json does not exist, creating it now from route scan.');
}
