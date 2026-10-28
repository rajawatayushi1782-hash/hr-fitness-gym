const fs = require('fs');
const path = require('path');

const mapping = JSON.parse(fs.readFileSync('image_mapping.json', 'utf8'));

// Read forms
const formContact = fs.existsSync('form_contact.html') ? fs.readFileSync('form_contact.html', 'utf8') : '';
const formFreeTrial = fs.existsSync('form_free-trial.html') ? fs.readFileSync('form_free-trial.html', 'utf8') : '';
const formEssentials = fs.existsSync('form_programs-essentials.html') ? fs.readFileSync('form_programs-essentials.html', 'utf8') : '';

const outputDir = path.join(__dirname, 'public', 'pages');
fs.mkdirSync(outputDir, { recursive: true });

const pages = [
  { file: 'home.html', route: 'home' },
  { file: 'we-are-go180.html', route: 'we-are-go180' },
  { file: 'programs.html', route: 'programs' },
  { file: 'programs-essentials.html', route: 'programs-essentials' },
  { file: 'coaches.html', route: 'coaches' },
  { file: 'club-leeuwarden.html', route: 'club-leeuwarden' },
  { file: 'stories.html', route: 'stories' },
  { file: 'pricing.html', route: 'pricing' },
  { file: 'contact.html', route: 'contact' },
  { file: 'join-now.html', route: 'join-now' },
  { file: 'free-trial.html', route: 'free-trial' }
];

for (const p of pages) {
  let html = fs.readFileSync(path.join('scraped_pages', p.file), 'utf8');

  // 1. Replace all image URLs from mapping
  for (const [origUrl, localUrl] of Object.entries(mapping)) {
    html = html.split(origUrl).join(localUrl);
    // Also without query strings
    const noQuery = origUrl.split('?')[0];
    html = html.split(noQuery).join(localUrl);
  }

  // 2. Fix lazyload placeholder images: if src="data:image/svg+xml..." and data-src is present, replace src with data-src
  html = html.replace(/src=["']data:image\/svg\+xml;base64,[^"']+["']\s+class=["']([^"']+)["']\s+(?:style=["'][^"']*["']\s+)?data-src=["']([^"']+)["']/gi, 'src="$2" class="$1 lazyloaded"');
  html = html.replace(/src=["']data:image\/svg\+xml;base64,[^"']+["']\s+data-src=["']([^"']+)["']/gi, 'src="$1" class="lazyloaded"');
  html = html.replace(/data-src=["']([^"']+)["']\s+src=["']data:image\/svg\+xml;base64,[^"']+["']/gi, 'src="$1" class="lazyloaded"');

  // 3. Replace all remaining go180.nl internal links
  html = html.replace(/https:\/\/go180\.nl\//g, '/');
  html = html.replace(/https:\/\/go180\.nl/g, '/');

  // 4. Inject real form HTML where placeholders exist
  if (p.route === 'contact' && formContact) {
    html = html.replace(/<div class="gfid" data-id="2"[^>]*><\/div>/gi, formContact);
  } else if (p.route === 'free-trial' && formFreeTrial) {
    html = html.replace(/<div class="gfid" data-id="9"[^>]*><\/div>/gi, formFreeTrial);
  } else if (p.route === 'programs-essentials' && formEssentials) {
    html = html.replace(/<div class="gfid" data-id="2"[^>]*><\/div>/gi, formEssentials);
  }

  // 5. Replace stylesheet links with local stylesheet
  html = html.replace(/<link rel=["']stylesheet["'][^>]*href=["'][^"']*main\.css[^"']*["'][^>]*>/gi, '<link rel="stylesheet" href="/css/main.css">');
  html = html.replace(/<link rel=["']stylesheet["'][^>]*href=["'][^"']*popup-maker[^"']*["'][^>]*>/gi, '');

  // 6. Remove tracking & third-party scripts that cause delays or console errors
  html = html.replace(/<script[^>]*google-analytics\.com.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*googletagmanager\.com.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*facebook\.net.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*licdn\.com.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*mouseflow\.com.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*recaptcha.*?<\/script>/gis, '');
  html = html.replace(/<noscript>.*?googletagmanager.*?<\/noscript>/gis, '');
  html = html.replace(/<!-- Google Tag Manager[\s\S]*?<!-- End Google Tag Manager -->/gi, '');
  html = html.replace(/<!-- Google Tag Manager \(noscript\)[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/gi, '');
  html = html.replace(/<script[^>]*polyfill\.io.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*babel-polyfill.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*elfsight.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*activehosted\.com.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*youtube\.com.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*popup-maker.*?<\/script>/gis, '');
  html = html.replace(/<script[^>]*wp-smush-pro.*?<\/script>/gis, '');
  
  // 7. Remove loading class on body so it's not hidden
  html = html.replace(/<body([^>]*)\bloading\b([^>]*)>/gi, '<body$1$2>');

  // 8. Add local script tag before </body>
  const appScript = `
<script src="/js/app.js"></script>
</body>`;
  html = html.replace(/<\/body>/i, appScript);

  // 9. Save clean page
  fs.writeFileSync(path.join(outputDir, p.file), html, 'utf8');
  console.log(`Processed ${p.file} -> public/pages/${p.file} (${html.length} bytes)`);
}

console.log('All pages processed successfully!');
