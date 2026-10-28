const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

const coachReplacements = [
  // Hielke van der Lei
  {
    search: 'Ik ben oprichter en coach van HR Fitness Club, dat ik in 2013 samen met mijn oud compagnon begon. Sinds 2005 ben ik al actief in de gezondheids- en fitnessbranche.',
    replace: 'As founder and head coach of HR Fitness Club, I have been actively passionate about health, strength conditioning, and fitness for over a decade.'
  },
  {
    search: 'In de afgelopen jaren heb ik diverse opleidingen, specialisaties en mentorships gevolgd die in het teken stonden van coaching, trainings- en voedingsleer, gedragsverandering en ondernemers- en leiderschap. Voor de oprichting van HR Fitness Club was ik werkzaam binnen diverse sport- en gezondheidscentra als trainer, coach en manager van diverse beweeg- en leefstijlprogramma’s.',
    replace: 'Throughout my career, I have completed specialized certifications in exercise physiology, functional strength, nutrition planning, and behavioral coaching. Prior to establishing HR Fitness Club, I worked across leading fitness and wellness centers managing tailored movement and lifestyle training programs.'
  },
  {
    search: 'In de afgelopen jaren heb ik veel geleerd en ondervonden, daardoor heb ik mijn eigen visie en missie kraakhelder voor ogen. at HR Fitness Club helpen we &nbsp;jou je optimale kwaliteit van leven te bereiken, fysiek, mentaal en emotioneel. Dat doen we samen. Ik en mijn team helpen je niet alleen op weg, maar zijn er voor je gedurende het gehele proces.',
    replace: 'My mission is crystal clear: at HR Fitness Club in Thatipur, Gwalior, we help you achieve your peak physical strength, mental clarity, and vitality. We do this together. My dedicated coaching team and I guide you every step of the way with personalized support.'
  },

  // Thomas Kramer
  {
    search: 'Mijn missie is om mensen te helpen een leefstijl te creëren die écht werkt — gezond, energiek en duurzaam. Een leefstijl die past bij your goals én die je vol kunt houden op de lange termijn. Met de juiste combinatie van coaching, kennis en structuur begeleid ik je stap voor stap naar een sterker, fitter en vitaler lichaam.',
    replace: 'My mission is to help people build a sustainable fitness routine that truly works—healthy, energetic, and long-lasting. A routine tailored to your personal goals and daily life. Through the right combination of structured coaching, lifting technique, and habit building, I guide you step by step toward a stronger, fitter physique.'
  },
  {
    search: 'Samen bouwen we aan een plan dat past binnen your dagelijkse leven, zodat jij niet alleen resultaat behaalt, maar ook leert hoe je dit resultaat behoudt. Zo haal je elke dag het maximale uit jezelf.',
    replace: 'Together we design an achievable workout regimen that seamlessly fits your schedule, ensuring you not only attain impressive fitness results but also develop the confidence to maintain them for life.'
  },
  {
    search: 'Leefstijl- en gedragsverandering',
    replace: 'Lifestyle & Habit Transformation'
  },
  {
    search: 'Als coach ben ik rustig, betrokken en doelgericht. Ik vind het belangrijk dat jij begrijpt waarom je iets doet, zodat je niet alleen begeleid wordt, maar ook zelf de kennis en motivatie ontwikkelt om het vol te houden. Training Philosophy & Approach draait niet om snelle resultaten, maar om duurzame verandering, met balans, structuur en plezier als fundament.',
    replace: 'As a trainer, I am dedicated, approachable, and result-oriented. I ensure you understand proper biomechanics and exercise selection so you develop autonomous confidence and lasting drive. My training philosophy focuses on sustainable transformation built on balance, progressive overload, and consistent workout enjoyment.'
  },

  // Appie Kooistra
  {
    search: /Sinds mijn jeugd ben ik al gefascineerd door sport en bewegen[\s\S]*?progressie/g,
    replace: 'Dedicated to fitness coaching and functional movement, I specialize in athletic conditioning, progressive resistance training, and injury prevention to help every member achieve measurable physical progress'
  },
  {
    search: /Mijn passie ligt in het motiveren van mensen om hun grenzen te verleggen[\s\S]*?doelen/g,
    replace: 'My passion lies in motivating gym members to surpass self-imposed limits with safe form and enthusiastic coaching support'
  },

  // Arjon van der Wal
  {
    search: /Mijn naam is Arjon van der Wal en ik ben personal trainer[\s\S]*?kracht/g,
    replace: 'I am Arjon van der Wal, certified personal trainer and strength coach at HR Fitness Club, focused on helping members master compound lifts and athletic performance'
  },
  {
    search: /In mijn coaching leg ik de nadruk op techniek, discipline en motivatie[\s\S]*?resultaten/g,
    replace: 'In my coaching, I prioritize lifting mechanics, mental focus, and tailored nutrition to deliver real, sustainable results'
  },

  // Annick Douma
  {
    search: /Als personal trainer en coach help ik mensen graag om met plezier[\s\S]*?leven/g,
    replace: 'As a dedicated personal trainer, I love guiding members to train with confidence, build functional strength, and lead vibrant, active lifestyles'
  },
  {
    search: /Ik focus me op functionele krachttraining en een gezonde levensstijl[\s\S]*?bereiken/g,
    replace: 'I focus on functional resistance training, core stability, and healthy lifestyle habits to help members achieve their personal targets'
  },

  // Hielke Feenstra
  {
    search: /Mijn doel als personal coach is om je te laten ervaren hoe fit en vitaal[\s\S]*?voelen/g,
    replace: 'My goal as your personal trainer is to help you experience how energized and strong your body can truly feel with proper workout habits'
  },
  {
    search: /Met persoonlijke aandacht en gerichte oefeningen help ik je[\s\S]*?doelen/g,
    replace: 'Through personalized coaching and structured training programs, I guide you toward your personal fitness and wellness milestones'
  },

  // Common titles & roles
  { search: /Oprichter en Coach/g, replace: 'Founder & Head Coach' },
  { search: /Oprichter & Coach/g, replace: 'Founder & Head Coach' },
  { search: /Personal trainer, coach, HYROX coach/g, replace: 'Personal Trainer & Performance Coach' },
  { search: /Personal trainer en coach/g, replace: 'Personal Trainer & Coach' },
  { search: /Coach en Personal Trainer/g, replace: 'Coach & Personal Trainer' },
  { search: />Bekijk coach</g, replace: '>View Coach<' },
  { search: />Onze coaches</g, replace: '>Our Coaches<' },
  { search: />Voeding</g, replace: '>Nutrition<' },
  { search: />Herstel</g, replace: '>Recovery<' },
  { search: />Leeuwarden</g, replace: '>Thatipur Club<' },
  { search: /Build your tomorrow/g, replace: 'Build Your Tomorrow' },
  { search: />We are GO180</g, replace: '>About Us<' }
];

const coachFiles = [
  'coaches.html',
  'coach-annick-douma.html',
  'coach-appie-kooistra.html',
  'coach-arjon-van-der-wal.html',
  'coach-hielke-feenstra.html',
  'coach-hielke-van-der-lei.html',
  'coach-thomas-kramer.html'
];

coachFiles.forEach(f => {
  const filePath = path.join(pDir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  coachReplacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${f}`);
});
