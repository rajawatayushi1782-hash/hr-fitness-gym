const fs = require('fs');
const path = require('path');
const dir = './public/pages';

let fixedCount = 0;
let fileCount = 0;

fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let changed = false;

  // Replace images that have placeholder svg as src and a real data-src
  const updated = content.replace(/<img\b([^>]*?)>/gi, (tag) => {
    if (tag.includes('data:image/svg') && tag.includes('data-src=')) {
      const dataSrcMatch = tag.match(/data-src=["']([^"']+)["']/i);
      if (dataSrcMatch && dataSrcMatch[1]) {
        const realSrc = dataSrcMatch[1];
        let newTag = tag.replace(/src=["']data:image\/svg[^"']*["']/i, `src="${realSrc}"`);
        // Ensure lazyloaded class is present and lazyload removed
        if (newTag.includes('lazyload')) {
          newTag = newTag.replace(/\blazyload\b/g, 'lazyloaded');
        } else if (!newTag.includes('lazyloaded')) {
          newTag = newTag.replace(/class=["']([^"']*)["']/i, 'class="$1 lazyloaded"');
        }
        fixedCount++;
        changed = true;
        return newTag;
      }
    }
    return tag;
  });

  if (changed) {
    fileCount++;
    fs.writeFileSync(p, updated, 'utf8');
    console.log(`Fixed images in ${f}`);
  }
});

console.log(`Successfully updated ${fixedCount} images across ${fileCount} files.`);
