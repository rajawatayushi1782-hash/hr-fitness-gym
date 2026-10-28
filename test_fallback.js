const fs = require('fs');
const path = require('path');

const missing = [
  'GO180-78-1920x648.jpg.webp',
  'begeleiding.svg',
  'community.svg',
  'GO180-79-790x860.jpg.webp',
  'AronWeidenaar_HR-53-1920x648.jpg.webp',
  'AronWeidenaar_HR-91-1920x648.jpg.webp',
  'AronWeidenaar_HR-49-scaled-e1776779429601.jpg.webp',
  'AronWeidenaar_HR-74-1920x648.jpg.webp',
  'AronWeidenaar_HR-34-scaled-e1776779544485.jpg.webp',
  'AronWeidenaar_HR-65-1920x648.jpg.webp',
  'AronWeidenaar_HR-77-scaled-e1776778991953.jpg.webp',
  'AronWeidenaar_HR-30-1920x648.jpg.webp',
  'AronWeidenaar_HR-45-scaled-e1776779443505.jpg.webp',
  'AronWeidenaar_HR-4807-scaled-e1776779716816.jpg.webp',
  'AronWeidenaar_HR-78-1920x648.jpg.webp',
  'AronWeidenaar_HR-44-scaled-e1776779454739.jpg.webp',
  'AronWeidenaar_HR-85-scaled-e1776778944169.jpg.webp',
  'AronWeidenaar_HR-42-scaled-e1776779461283.jpg.webp',
  'AronWeidenaar_HR-28-1920x648.jpg.webp',
  'AronWeidenaar_HR-55-scaled-e1776779379366.jpg.webp',
  'AronWeidenaar_HR-71-1920x648.jpg.webp',
  'AronWeidenaar_HR-58-scaled-e1776779329184.jpg.webp',
  'AronWeidenaar_HR-73-1920x648.jpg.webp'
];

const available = fs.readdirSync('./public/images');

function findFallback(target) {
  if (available.includes(target)) return target;
  // Match prefix before -1920x or -scaled or -790x
  const m = target.match(/^([a-zA-Z0-9_\-]+?)(?:-\d+x\d+|-scaled.*?)?\.(jpg|jpeg|png|webp|svg)/i);
  if (m) {
    const base = m[1];
    const match = available.find(f => f.startsWith(base));
    if (match) return match;
    // try looser match
    const sub = base.split('-')[0];
    const match2 = available.find(f => f.includes(base) || f.includes(sub));
    if (match2) return match2;
  }
  return null;
}

let resolved = 0;
missing.forEach(m => {
  const fb = findFallback(m);
  if (fb) {
    resolved++;
    console.log(`Resolved: ${m} -> ${fb}`);
  } else {
    console.log(`FAILED: ${m}`);
  }
});

console.log(`Resolved ${resolved} of ${missing.length}`);

