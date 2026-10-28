const fs = require('fs');
const path = require('path');
const homePath = path.join(__dirname, 'public', 'pages', 'home.html');
const snap = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_inventory_snapshot.json'), 'utf8'));

let c = fs.readFileSync(homePath, 'utf8');

// Title & Meta
c = c.replace(/<title>[\s\S]*?<\/title>/i, '<title>HR Fitness Club | Best Gym and Fitness Centre in Thatipur, Gwalior</title>');
c = c.replace(/<meta\s+name="description"\s+content="[\s\S]*?"/i, '<meta name="description" content="Welcome to HR Fitness Club, Thatipur, Gwalior. Modern gym equipment, fitness training, cardio, strength workout, and dedicated personal trainers. Join today!"');
c = c.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"/i, '<meta property="og:title" content="HR Fitness Club | Best Gym and Fitness Centre in Thatipur, Gwalior"');
c = c.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"/i, '<meta property="og:description" content="Welcome to HR Fitness Club, Thatipur, Gwalior. Modern gym equipment, fitness training, cardio, strength workout, and dedicated personal trainers. Join today!"');
c = c.replace(/<meta\s+property="og:site_name"\s+content="[\s\S]*?"/i, '<meta property="og:site_name" content="HR Fitness Club"');

// Slide 1
c = c.replace('Bij GO180 doen we er alles aan om jou je beste zelf te laten worden, de rest van je leven.', 'At HR Fitness Club, we are dedicated to helping you achieve your personal fitness and health goals in Thatipur, Gwalior.');

// Slide 2
c = c.replace('Onze programma’s zijn speciaal ontworpen om jou een gezond en fit leven te laten en blijven leiden.', 'Our fitness training programs are designed to help you build strength, improve endurance, and lead a healthy, energetic lifestyle.');

// Slide 3
c = c.replace('<h1 class="slide__title  h1">Coaches</h1>', '<h1 class="slide__title  h1">Coaches &amp; Trainers</h1>');
c = c.replace('Wat je doel ook is, onze ervaren coaches helpen je niet alleen op weg, maar zijn er voor je gedurende het gehele proces. ', 'Whatever your fitness goal, our experienced trainers guide and motivate you with proper workout techniques and personalized fitness support. ');
c = c.replace('<a href="/coaches" class="btn">De coaches', '<a href="/coaches" class="btn">Our coaches');

// Slide 4
c = c.replace('<h1 class="slide__title  h1">Onze club</h1>', '<h1 class="slide__title  h1">Our Club</h1>');
c = c.replace('In Leeuwarden vind je onze privéclub, voorzien van alle gemakken om jou te inspireren en motiveren. Je kunt bij ons fitnessen in Leeuwarden, maar ook onze programma\'s volgen.', 'Located near Axis Bank, Suresh Nagar Chauraha in Thatipur, Gwalior, HR Fitness Club provides modern gym equipment, cardio, and strength training facilities.');

// Slide 5
c = c.replace('<h1 class="slide__title  h1">Stories</h1>', '<h1 class="slide__title  h1">Stories &amp; Results</h1>');
c = c.replace('Leer de verhalen van de mensen kennen die dankzij GO180 hun doelen hebben bereikt en hoe ze dat hebben gedaan. ', 'Discover real transformation stories and fitness achievements from members who reached their goals at HR Fitness Club in Gwalior. ');
c = c.replace('<a href="/stories/" class="btn">Lees de verhalen', '<a href="/stories/" class="btn">Read stories');

// Slide 6
c = c.replace('<h1 class="slide__title  h1">GO180?</h1>', '<h1 class="slide__title  h1">HR Fitness Club</h1>');
c = c.replace('Waar draait het voor jou om? Neem contact met ons op wanneer jij je leefstijl op een verantwoorde en actieve manier wilt veranderen.', 'Ready to elevate your health and fitness? Contact HR Fitness Club in Thatipur, Gwalior, or visit our gym to start your journey today.');

// Reviews Widget
c = c.replace('Wat onze klanten zeggen', 'What our members say');
c = c.replace('Beoordelingen', 'Reviews');
c = c.replace('Beoordeel ons op Google', 'Review us on Google');
c = c.replace(/>4,8<\/div>/g, '>4.9</div>');
c = c.replace(/\(73\)/g, '(70+)');

// Newsletter popup
c = c.replace('Join us!', 'Join HR Fitness Club!');
c = c.replace('Schrijf je in voor onze nieuwsbrief.', 'Stay connected for workout tips and club announcements from Thatipur, Gwalior.');

// Image Check
const originalImgs = snap['home.html'].imgs;
const updatedImgs = c.match(/<img[^>]+>/gi) || [];
if (originalImgs.length !== updatedImgs.length) {
  throw new Error(`IMG count mismatch in home.html: before=${originalImgs.length}, after=${updatedImgs.length}`);
}
for (let i = 0; i < originalImgs.length; i++) {
  if (originalImgs[i] !== updatedImgs[i]) {
    throw new Error(`IMG mismatch in home.html at index ${i}`);
  }
}

fs.writeFileSync(homePath, c, 'utf8');
console.log('home.html successfully updated with 100% image preservation!');