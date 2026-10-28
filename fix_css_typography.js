const fs = require('fs');
const filePath = 'public/css/main.css';
let css = fs.readFileSync(filePath, 'utf8');

// Replace the restrictive clip-path with overflow visible and no clipping
css = css.replace(
  '.slide__line{-webkit-clip-path:inset(0 0 -13% 0);clip-path:inset(0 0 -13% 0)}',
  '.slide__line{-webkit-clip-path:none;clip-path:none;overflow:visible;padding-bottom:4px}'
);

// Improve mobile line-height and margin for slide__title
css = css.replace(
  '@media (max-width:47.99em){.slide__title{padding:0 7vw}}',
  '@media (max-width:47.99em){.slide__title{padding:0 5vw;line-height:1.2;margin-bottom:18px}}'
);

fs.writeFileSync(filePath, css, 'utf8');
console.log('Successfully updated main.css typography and line wrapping!');
