const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));

['story-hoe-blijf-je-gezond-met-een-drukke-baan.html', 'story-ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen.html', 'story-is-krachttraining-voor-kinderen-slecht-voor-de-groei.html'].forEach(f => {
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
