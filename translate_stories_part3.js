const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

// --- 6. story-sportschool-intake.html ---
let s6 = fs.readFileSync(path.join(pDir, 'story-sportschool-intake.html'), 'utf8');

s6 = s6.replace(/Kennis \| Hielke van der Lei \| 13 mei 2026/g, 'Fitness Guide | HR Fitness Team | May 13, 2026');
s6 = s6.replace(/<h2>Wat veel sporters doen als ze beginnen<\/h2>/g, '<h2>What Most People Do When Starting Out</h2>');
s6 = s6.replace(/<h2>Wat houdt een sportschool intake precies in\?<\/h2>/g, '<h2>What Does a Fitness Assessment Entail?</h2>');
s6 = s6.replace(/<h2>Waarom is de motivatie achter je doel zo belangrijk\?<\/h2>/g, '<h2>Why the Motivation Behind Your Goal Matters</h2>');
s6 = s6.replace(/<h2>Welke vragen komen aan bod tijdens een intake\?<\/h2>/g, '<h2>What Topics Are Covered During an Assessment?</h2>');
s6 = s6.replace(/<h2>Wat zegt je basis over het type training dat bij je past\?<\/h2>/g, '<h2>What Your Baseline Says About the Right Workout Plan</h2>');
s6 = s6.replace(/<h2>Wat levert een plan op ten opzichte van freestyle trainen\?<\/h2>/g, '<h2>Why Having a Plan Beats "Freestyle" Workouts</h2>');
s6 = s6.replace(/<h2>Hoe voorkom je dat je na zes weken stopt\?<\/h2>/g, '<h2>How to Prevent Quitting After Six Weeks</h2>');
s6 = s6.replace(/<h2>Hoe ziet de intake at HR Fitness Club eruit\?<\/h2>/g, '<h2>What Does the Intake at HR Fitness Club Look Like?</h2>');
s6 = s6.replace(/<h2>Waar begin je\?<\/h2>/g, '<h2>Where Do You Begin?</h2>');

s6 = s6.replace(
  /<p>De meeste mensen die een sportschool binnenwandelen voor het eerst[\s\S]*?ervan aankomt\.<\/p>/,
  '<p>Most people who join a gym for the first time rely on mimicry: looking around at what others are doing, randomly picking machines, copying exercises seen on social media, and hoping it produces results. Without clear direction, this trial-and-error approach leads to frustration or injury.</p>'
);

s6 = s6.replace(
  /<p>Een professionele sportschool intake voorkomt doelloos trainen[\s\S]*?stap voor stap:<\/p>/,
  '<p>A professional fitness assessment eliminates guesswork. It establishes your physical starting point, uncovers potential muscular imbalances, and outlines a structured path to success:</p>'
);

s6 = s6.replace(
  /<p>Gezondheidsgeschiedenis en blessureverleden[\s\S]*?veilige training\.<\/p>/,
  '<p><strong>1. Health Background & Injury History:</strong> Understanding past sprains, joint discomfort, or back issues allows our trainers to customize exercise variations that build strength while protecting vulnerable areas.</p>'
);

s6 = s6.replace(
  /<p>Beweeganalyse en mobiliteitsmeting[\s\S]*?techniek\.<\/p>/,
  '<p><strong>2. Movement & Mobility Screening:</strong> Evaluating hip flexibility, thoracic spine mobility, and core engagement helps select the right lifting mechanics for your body type.</p>'
);

s6 = s6.replace(
  /<p>Doelstelling en realistische planning[\s\S]*?resultaten\.<\/p>/,
  '<p><strong>3. Clear Milestones & Realistic Timelines:</strong> Whether you want to lose body fat, build lean muscle, or boost daily energy, we map out actionable monthly benchmarks that keep you accountable.</p>'
);

s6 = s6.replace(
  /<p>Neem contact op met HR Fitness Club en discover wat een goede start voor jou betekent[\s\S]*?daarna\.<\/p>/,
  '<p>Contact HR Fitness Club in Thatipur, Gwalior and discover what starting with a personalized plan can do for your fitness journey. Investing in a structured start saves months of wasted effort.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-sportschool-intake.html'), s6, 'utf8');
console.log('Translated story-sportschool-intake.html');

// --- 7. story-teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180.html ---
let s7 = fs.readFileSync(path.join(pDir, 'story-teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180.html'), 'utf8');

s7 = s7.replace(/Kennis \| Hielke van der Lei \| 6 mei 2026/g, 'Corporate Wellness | HR Fitness Team | May 6, 2026');
s7 = s7.replace(/<h2>Waarom sport zo krachtig werkt voor teambuilding<\/h2>/g, '<h2>Why Fitness Training Is Powerful for Team Building</h2>');
s7 = s7.replace(/<h2>Geen standaard bedrijfsuitje<\/h2>/g, '<h2>Beyond the Standard Corporate Outing</h2>');
s7 = s7.replace(/<h2>Voor welke bedrijven is dit geschikt\?<\/h2>/g, '<h2>Who Benefits Most from Corporate Wellness?</h2>');
s7 = s7.replace(/<h2>Meer dan alleen sporten<\/h2>/g, '<h2>More Than Just a Workout</h2>');
s7 = s7.replace(/<h2>Waarom bedrijven kiezen voor HR Fitness Club<\/h2>/g, '<h2>Why Organizations Choose HR Fitness Club</h2>');
s7 = s7.replace(/<h2>Teambuilding in Thatipur, Gwalior die impact maakt<\/h2>/g, '<h2>Team Building in Thatipur, Gwalior with Real Impact</h2>');

s7 = s7.replace(
  /<p>Tijdens een training vallen functies, hiërarchie en dagelijkse werkdruk vaak even weg[\s\S]*?hetzelfde doel\.<\/p>/,
  '<p>During fitness training, job titles, workplace hierarchy, and daily corporate stress naturally fade into the background. Colleagues step out of routine office roles and work together toward common physical and mental challenges.</p>'
);

s7 = s7.replace(
  /<p>Veel teambuildingactiviteiten blijven beperkt tot een borrel of etentje[\s\S]*?blijvende band\.<\/p>/,
  '<p>Standard team outings often consist of sedentary dinners or passive activities. Group fitness, by contrast, releases endorphins, builds genuine trust, and fosters mutual encouragement as team members cheer each other on through shared achievements.</p>'
);

s7 = s7.replace(
  /<p>Bedrijfsfitness bij HR Fitness Club biedt tal van voordelen:<\/p>/,
  '<p>Corporate wellness training at HR Fitness Club delivers tangible benefits for modern workplaces:</p>'
);

s7 = s7.replace(
  /<p>Verhoogde energie en productiviteit op de werkvloer[\s\S]*?focus\.<\/p>/,
  '<p><strong>1. Heightened Workplace Energy & Focus:</strong> Regular aerobic and strength training combats afternoon fatigue, sharpens cognitive problem-solving, and elevates day-to-day focus.</p>'
);

s7 = s7.replace(
  /<p>Minder ziekteverzuim en klachten door zittend werk[\s\S]*?rugklachten\.<\/p>/,
  '<p><strong>2. Reduced Absenteeism & Ergonomic Strain:</strong> Targeted core and posterior chain exercises relieve neck and back stiffness caused by prolonged desk and computer work.</p>'
);

s7 = s7.replace(
  /<p>Sterkere teamdynamiek en collegialiteit[\s\S]*?teamgevoel\.<\/p>/,
  '<p><strong>3. Enhanced Camaraderie & Morale:</strong> Shared sweat, laughs, and fitness milestones build deep interpersonal connection that carries positively back into the office environment.</p>'
);

s7 = s7.replace(
  /<p>Meer weten over teambuilding in Thatipur, Gwalior\?[\s\S]*?HR Fitness Club<\/p>/,
  '<p>Want to discover corporate fitness and team training partnerships in Thatipur, Gwalior? Contact HR Fitness Club today to discuss a tailored program for your team.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180.html'), s7, 'utf8');
console.log('Translated story-teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180.html');

// --- 8. story-waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken.html ---
let s8 = fs.readFileSync(path.join(pDir, 'story-waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken.html'), 'utf8');

s8 = s8.replace(/Kennis \| Hielke van der Lei \| 29 april 2026/g, 'Nutrition Guide | HR Fitness Team | April 29, 2026');
s8 = s8.replace(/<h2>Wat gaat er mis met alleen een voedingsschema\?<\/h2>/g, '<h2>Why Static Diet Charts Always Fail</h2>');
s8 = s8.replace(/<h2>Wat doet een dieetcoach dan wel\?<\/h2>/g, '<h2>What Does a Dedicated Nutrition Coach Actually Do?</h2>');
s8 = s8.replace(/<h2>Is een dieetcoach hetzelfde als een diëtist\?<\/h2>/g, '<h2>Is a Nutrition Coach the Same as a Dietitian?</h2>');
s8 = s8.replace(/<h2>Hoe kies je een coach die bij je past\?<\/h2>/g, '<h2>How to Choose the Right Coach for Your Goals</h2>');
s8 = s8.replace(/<h2>Hoe benadert HR Fitness Club voeding\?<\/h2>/g, '<h2>How HR Fitness Club Approaches Nutrition</h2>');
s8 = s8.replace(/<h2>Wat levert de juiste begeleiding je op\?<\/h2>/g, '<h2>What Proper Nutritional Coaching Delivers</h2>');

s8 = s8.replace(
  /<p>Bijna iedereen die weleens wilde afvallen, heeft er een gehad[\s\S]*?weegschaal beweegt\.<\/p>/,
  '<p>Nearly everyone who has attempted weight loss has been handed a generic diet chart: a rigid list of meal times, gram measurements, and banned foods. In week one, willpower carries you through. But life quickly happens—birthdays, late meetings, travel—and when real life collides with an inflexible paper chart, the entire diet collapses.</p>'
);

s8 = s8.replace(
  /<p>Een dieetcoach kijkt daarom niet alleen naar wat je eet, maar vooral naar waarom[\s\S]*?patronen:<\/p>/,
  '<p>A great nutrition coach examines not merely what you eat, but why and how you eat. We focus on behavioral psychology, hunger cues, sleep quality, and practical habit modification:</p>'
);

s8 = s8.replace(
  /<p>Duurzame gedragsverandering in plaats van tijdelijke restricties[\s\S]*?gewoontes\.<\/p>/,
  '<p><strong>1. Sustainable Habit Change Over Severe Restriction:</strong> We teach you how to make mindful, nutrient-dense choices while maintaining the flexibility to enjoy meals with friends and family.</p>'
);

s8 = s8.replace(
  /<p>Inzicht in portiegroottes en macronutriënten[\s\S]*?energie\.<\/p>/,
  '<p><strong>2. Education on Protein & Energy Balance:</strong> Understanding protein requirements, healthy fats, and complex carbohydrates empowers you to fuel your workouts and protect lean muscle mass.</p>'
);

s8 = s8.replace(
  /<p>Verantwoording en wekelijkse aanpassingen[\s\S]*?succes\.<\/p>/,
  '<p><strong>3. Personalized Accountability & Continuous Guidance:</strong> Your trainer reviews your energy levels, digestion, and recovery weekly, adapting your nutritional roadmap as your body composition evolves.</p>'
);

s8 = s8.replace(
  /<p>Wil je ontdekken wat persoonlijke voedingsbegeleiding voor jou kan betekenen\?[\s\S]*?bij your past\.<\/p>/,
  '<p>Want to discover what personalized nutrition coaching can achieve for your energy and fitness? Schedule a consultation at HR Fitness Club in Thatipur, Gwalior and begin building healthy habits for life.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken.html'), s8, 'utf8');
console.log('Translated story-waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken.html');
