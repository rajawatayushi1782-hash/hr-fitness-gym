const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
const snap = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_inventory_snapshot.json'), 'utf8'));

const HEADER_LOGO = '<a class="logo" href="/" style="text-decoration:none;display:inline-flex;align-items:center;height:28px;"><span style="font-family:\'Gilroy\',sans-serif;font-weight:700;font-size:20px;letter-spacing:1px;color:#ffffff;white-space:nowrap;">HR FITNESS CLUB</span></a>';
const FOOTER_LOGO = '<a class="logo -footer" href="/" style="text-decoration:none;display:inline-flex;align-items:center;height:28px;"><span style="font-family:\'Gilroy\',sans-serif;font-weight:700;font-size:20px;letter-spacing:1px;color:#e1e1e1;white-space:nowrap;">HR FITNESS CLUB</span></a>';
const WIPE_SPINNER = '<svg class="wipe_spinner" width="180" height="28" viewBox="0 0 180 28" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="\'Gilroy\',sans-serif" font-weight="700" font-size="18" letter-spacing="1.5">HR FITNESS CLUB</text></svg>';

let totalFilesModified = 0;

files.forEach(f => {
  let content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  const originalImgs = snap[f].imgs;

  // 1. Logos & Wipe Spinner
  content = content.replace(/<a class="logo" href="\/">[\s\S]*?<\/svg>\s*<\/a>/i, HEADER_LOGO);
  content = content.replace(/<a class="logo -footer" href="\/">[\s\S]*?<\/svg>\s*<\/a>/i, FOOTER_LOGO);
  content = content.replace(/<svg class="wipe_spinner"[\s\S]*?<\/svg>/i, WIPE_SPINNER);

  // 2. Navigation bar
  content = content.replace(/<a href="\/we-are-go180\/">We are GO180<\/a>/g, '<a href="/we-are-go180/">About Us</a>');
  content = content.replace(/<a href="\/clubs\/leeuwarden\/">Club<\/a>/g, '<a href="/clubs/leeuwarden/">Thatipur Club</a>');

  // 3. Contact Banner / Callout
  content = content.replace(/Direct al zin om te starten bij GO180\?[\s\S]*?Onderstaand formulier invullen kan en mag natuurlijk ook\.(?:<\/div>|<\/p>)/gi, (m) => {
    const isP = m.endsWith('</p>');
    const tag = isP ? 'p' : 'div';
    const cls = isP ? '' : ' class="contact__contentright"';
    return `<${tag}${cls}>Ready to start at HR Fitness Club? Contact our trainers directly by calling <a href="tel:+918319950446">+91 83199 50446</a> or email <a href="mailto:info@hrfitnessclub.com">info@hrfitnessclub.com</a>. Visit us at 312, Near Axis Bank, Suresh Nagar Chauraha, Thatipur, Gwalior – 474011, or submit the form below.</${tag}>`;
  });

  // 4. Phone & Email links
  content = content.replace(/href="tel:0582038080"/g, 'href="tel:+918319950446"');
  content = content.replace(/href="mailto:info@go180\.nl"/g, 'href="mailto:info@hrfitnessclub.com"');
  content = content.replace(/href="mailto:administratie@go180\.nl"/g, 'href="mailto:info@hrfitnessclub.com"');
  content = content.replace(/info@go180\.nl/gi, 'info@hrfitnessclub.com');
  content = content.replace(/058\s*203\s*8080/g, '+91 83199 50446');

  // 5. Social Links
  content = content.replace(/https:\/\/www\.facebook\.com\/GO180official\//g, 'https://www.facebook.com/');
  content = content.replace(/https:\/\/twitter\.com\/go180pt/g, 'https://twitter.com/');
  content = content.replace(/https:\/\/nl\.linkedin\.com\/company\/go180-personal-trainers/g, 'https://www.linkedin.com/');
  content = content.replace(/https:\/\/www\.instagram\.com\/go180_official\//g, 'https://www.instagram.com/');

  // 6. Title and meta tag brand name update
  content = content.replace(/\|\s*GO180/gi, '| HR Fitness Club');
  content = content.replace(/content="GO180"/g, 'content="HR Fitness Club"');
  content = content.replace(/"name":\s*"GO180"/g, '"name": "HR Fitness Club"');
  content = content.replace(/"name":"GO180"/g, '"name":"HR Fitness Club"');

  // Strict Image Check
  const updatedImgs = content.match(/<img[^>]+>/gi) || [];
  if (originalImgs.length !== updatedImgs.length) {
    throw new Error(`IMG count mismatch in ${f}: before=${originalImgs.length}, after=${updatedImgs.length}`);
  }
  for (let i = 0; i < originalImgs.length; i++) {
    if (originalImgs[i] !== updatedImgs[i]) {
      throw new Error(`IMG mismatch in ${f} at index ${i}`);
    }
  }

  fs.writeFileSync(path.join(pagesDir, f), content, 'utf8');
  totalFilesModified++;
});
console.log(`Global replacements applied to ${totalFilesModified} files with 100% image preservation.`);