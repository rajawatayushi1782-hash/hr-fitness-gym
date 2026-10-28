const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

// --- 9. story-waarom-stop-ik-steeds-met-sporten.html ---
let s9 = fs.readFileSync(path.join(pDir, 'story-waarom-stop-ik-steeds-met-sporten.html'), 'utf8');

s9 = s9.replace(/Kennis \| Hielke van der Lei \| 22 april 2026/g, 'Fitness Guide | HR Fitness Team | April 22, 2026');
s9 = s9.replace(/<h2>Waarom het geen kwestie is van wilskracht<\/h2>/g, '<h2>Why Quitting Is Rarely a Lack of Willpower</h2>');
s9 = s9.replace(/<h2>Wat zijn de meest voorkomende redenen om te stoppen\?<\/h2>/g, '<h2>The Most Common Reasons People Stop Working Out</h2>');
s9 = s9.replace(/<h2>Hoe bouw je een gewoonte die wél blijft\?<\/h2>/g, '<h2>How to Build an Exercise Habit That Sticks</h2>');
s9 = s9.replace(/<h2>Wat als je toch een week overslaat\?<\/h2>/g, '<h2>What to Do When You Miss a Workout</h2>');
s9 = s9.replace(/<h2>Hoe doorbreek je het patroon structureel\?<\/h2>/g, '<h2>How to Break the All-or-Nothing Cycle Structurally</h2>');
s9 = s9.replace(/<h2>Zet de stap die je steeds uitstelt<\/h2>/g, '<h2>Take the Step You Keep Postponing</h2>');

s9 = s9.replace(
  /<p>De meest voorkomende verklaring die mensen zichzelf geven[\s\S]*?echte oorzaak\.<\/p>/,
  '<p>When people repeatedly quit working out, the most common self-criticism is: "I just lack discipline." In reality, discipline is almost never the root issue. Relying strictly on raw willpower is unsustainable when life gets demanding.</p>'
);

s9 = s9.replace(
  /<p>Mensen stoppen zelden omdat ze sporten haten[\s\S]*?valkuilen:<\/p>/,
  '<p>People stop because their initial expectations are unrealistic: attempting to go from zero workouts to six days a week, slashing calories drastically, and expecting dramatic overnight changes. When extreme routines inevitably clash with work and family life, the "all-or-nothing" mindset triggers complete abandonment.</p>'
);

s9 = s9.replace(
  /<p>Om het patroon structureel te doorbreken, pas je deze principes toe:<\/p>/,
  '<p>To break this frustrating cycle permanently, implement these foundational principles:</p>'
);

s9 = s9.replace(
  /<p>Verlaag de drempel en kies voor haalbaarheid[\s\S]*?overwinning\.<\/p>/,
  '<p><strong>1. Lower the Friction & Prioritize Achievability:</strong> Start with just two 45-minute sessions per week. A modest routine executed consistently for 6 months beats an extreme routine abandoned in 3 weeks.</p>'
);

s9 = s9.replace(
  /<p>Omarm het 'nooit twee keer achter elkaar missen'-principe[\s\S]*?vooruitgang\.<\/p>/,
  '<p><strong>2. The "Never Miss Twice" Rule:</strong> Missing one workout due to a late shift is normal life. Do not let one missed session spiral into weeks off. Reset immediately the next scheduled day.</p>'
);

s9 = s9.replace(
  /<p>Zorg voor externe verantwoording en een coach[\s\S]*?vol te houden\.<\/p>/,
  '<p><strong>3. Leverage Expert Coaching & Accountability:</strong> Having a dedicated trainer expecting you at the gym turns an optional chore into an empowering habit you look forward to.</p>'
);

s9 = s9.replace(
  /<p>Plan een intake, bespreek je patroon eerlijk, en bouw een trainingsleven[\s\S]*?realiteit\.<\/p>/,
  '<p>Schedule a friendly consultation at HR Fitness Club in Thatipur, Gwalior. Discuss your routine honestly with our coaches and design a workout plan that fits your real, everyday life—not an unrealistic ideal.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-waarom-stop-ik-steeds-met-sporten.html'), s9, 'utf8');
console.log('Translated story-waarom-stop-ik-steeds-met-sporten.html');

// --- 10. story-wat-zijn-de-kenmerken-van-een-gezonde-leefstijl.html ---
let s10 = fs.readFileSync(path.join(pDir, 'story-wat-zijn-de-kenmerken-van-een-gezonde-leefstijl.html'), 'utf8');

s10 = s10.replace(/Kennis \| Hielke van der Lei \| 15 april 2026/g, 'Health & Wellness | HR Fitness Team | April 15, 2026');
s10 = s10.replace(/<h2>Waarom gaat gezond leven niet over perfectie\?<\/h2>/g, '<h2>Why Healthy Living Is Not About Perfection</h2>');
s10 = s10.replace(/<h2>Welke pijlers bepalen hoe gezond je leeft\?<\/h2>/g, '<h2>The 5 Core Pillars of a Truly Healthy Lifestyle</h2>');
s10 = s10.replace(/<h2>Hoe herken je een gezonde leefstijl in het dagelijks leven\?<\/h2>/g, '<h2>Recognizing a Healthy Lifestyle in Daily Life</h2>');
s10 = s10.replace(/<h2>Waarom lukt gezonder leven vaak niet\?<\/h2>/g, '<h2>Why Good Intentions Often Falter</h2>');
s10 = s10.replace(/<h2>Waar begin je als je gezonder wilt leven\?<\/h2>/g, '<h2>Where to Start on Your Wellness Journey</h2>');
s10 = s10.replace(/<h2>Hoe helpt begeleiding bij een blijvende verandering\?<\/h2>/g, '<h2>How Dedicated Coaching Creates Lasting Change</h2>');

s10 = s10.replace(
  /<p>Veel mensen denken bij gezond leven aan strenge regels[\s\S]*?weinig op\.<\/p>/,
  '<p>Many people associate healthy living with rigid restrictions: zero sugar, punishing daily workouts, and extreme deprivation. Virtually no one sustains that long-term. And any lifestyle you cannot sustain produces very little lasting health benefit.</p>'
);

s10 = s10.replace(
  /<p>Een werkelijk gezonde leefstijl rust op vijf samenhangende pijlers:<\/p>/,
  '<p>A genuinely healthy, vibrant lifestyle is anchored in five interconnected pillars:</p>'
);

s10 = s10.replace(
  /<p>Regelmatige krachttraining en functionele beweging[\s\S]*?conditie\.<\/p>/,
  '<p><strong>1. Progressive Strength & Movement:</strong> Resistance training preserves bone density, increases basal metabolic rate, and keeps your muscles strong and functional for decades.</p>'
);

s10 = s10.replace(
  /<p>Voedzame, onbewerkte voeding en hydratatie[\s\S]*?vitaliteit\.<\/p>/,
  '<p><strong>2. Wholesome Nutrition & Hydration:</strong> Prioritizing lean protein, colorful vegetables, complex carbs, and adequate daily water intake fuels your physical performance and immune system.</p>'
);

s10 = s10.replace(
  /<p>Kwalitatieve slaap en herstel[\s\S]*?weefselherstel\.<\/p>/,
  '<p><strong>3. Restorative Sleep & Recovery:</strong> 7 to 8 hours of restful sleep regulates hunger hormones, manages cortisol, and enables full cellular repair.</p>'
);

s10 = s10.replace(
  /<p>Stressmanagement en mentale veerkracht[\s\S]*?balans\.<\/p>/,
  '<p><strong>4. Stress Resilience & Mental Balance:</strong> Physical exercise is an unmatched outlet for releasing mental tension and cultivating cognitive calm.</p>'
);

s10 = s10.replace(
  /<p>Consistentie en sociale verbinding[\s\S]*?motivatie\.<\/p>/,
  '<p><strong>5. Consistency & Community:</strong> Training with supportive workout partners and coaches reinforces positive habits and transforms fitness into a joyful part of your week.</p>'
);

s10 = s10.replace(
  /<p>Plan een vrijblijvende kennismaking at HR Fitness Club in Thatipur, Gwalior[\s\S]*?bij jou past\.<\/p>/,
  '<p>Schedule a personal health consultation at HR Fitness Club in Thatipur, Gwalior. Receive clear, actionable guidance on the first step tailored to your lifestyle and goals.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-wat-zijn-de-kenmerken-van-een-gezonde-leefstijl.html'), s10, 'utf8');
console.log('Translated story-wat-zijn-de-kenmerken-van-een-gezonde-leefstijl.html');

// --- 11. stories.html ---
let st = fs.readFileSync(path.join(pDir, 'stories.html'), 'utf8');

st = st.replace(/>Kennis</g, '>Fitness Guides<');
st = st.replace(/>Inspiratie</g, '>Inspiration<');
st = st.replace(/>Resultaten</g, '>Results<');
st = st.replace(/>Lees meer</g, '>Read more<');
st = st.replace(/>Verder lezen</g, '>Read more<');
st = st.replace(/Build your tomorrow/g, 'Build Your Tomorrow');
st = st.replace(/>We are GO180</g, '>About Us<');
st = st.replace(/>Leeuwarden</g, '>Thatipur Club<');

fs.writeFileSync(path.join(pDir, 'stories.html'), st, 'utf8');
console.log('Translated stories.html');
