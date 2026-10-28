const fs = require('fs');
const homeHtml = fs.readFileSync('public/pages/home.html', 'utf8');

// Find all paragraphs or slide text holders
const slideTxts = homeHtml.match(/<div class="slide__txtHolder[^>]*>([\s\S]*?)<\/div>/gi) || [];
console.log(`Found ${slideTxts.length} slide__txtHolders on home.html:`);
slideTxts.forEach((st, i) => {
  const text = st.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Slide ${i + 1}: ${text.slice(0, 200)}...`);
});

// Check "Onze club" section
const clubIdx = homeHtml.indexOf('Onze club');
if (clubIdx !== -1) {
  console.log('\n--- "Onze club" section excerpt: ---');
  console.log(homeHtml.slice(clubIdx - 200, clubIdx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}

// Check "GO180?" section
const go180Idx = homeHtml.indexOf('GO180?');
if (go180Idx !== -1) {
  console.log('\n--- "GO180?" section excerpt: ---');
  console.log(homeHtml.slice(go180Idx - 200, go180Idx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
