const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));

['story-beste-glute-oefeningen.html', 'story-hoe-begin-je-weer-met-sporten-na-een-lange-pauze.html'].forEach(f => {
  const c = fs.readFileSync('public/pages/' + f, 'utf8');
  const imgs = c.match(/<img[^>]+>/gi) || [];
  const exp = snap[f].imgs;
  if (imgs.length !== exp.length) console.error(`${f} count mismatch!`);
  else {
    let ok = true;
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i] !== exp[i]) { console.error(`${f} img ${i} mismatch!`); ok = false; break; }
    }
    if (ok) console.log(`${f}: 100% PERFECT IMAGE MATCH!`);
  }
});
