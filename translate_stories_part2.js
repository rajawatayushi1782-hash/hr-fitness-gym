const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

// --- 3. story-hoe-blijf-je-gezond-met-een-drukke-baan.html ---
let s3 = fs.readFileSync(path.join(pDir, 'story-hoe-blijf-je-gezond-met-een-drukke-baan.html'), 'utf8');

s3 = s3.replace(/Kennis \| Hielke van der Lei \| 3 juni 2026/g, 'Fitness Guide | HR Fitness Team | June 3, 2026');
s3 = s3.replace(/<h2>Waarom een drukke baan vaak ten koste gaat van je gezondheid<\/h2>/g, '<h2>Why a Busy Career Often Compromises Personal Health</h2>');
s3 = s3.replace(/<h2>Gezond leven hoeft niet perfect te zijn<\/h2>/g, '<h2>Living Healthy Does Not Mean Living Perfectly</h2>');
s3 = s3.replace(/<h2>5 praktische tips om gezond te blijven met een drukke baan<\/h2>/g, '<h2>5 Practical Tips to Stay Fit with a Busy Career</h2>');
s3 = s3.replace(/<h2>Gezond leven geeft juist méér energie voor je werk<\/h2>/g, '<h2>Regular Exercise Generates Greater Workplace Energy</h2>');
s3 = s3.replace(/<h2>Begin klein, maar begin wel<\/h2>/g, '<h2>Start Small, but Start Today</h2>');

s3 = s3.replace(
  /<p>at HR Fitness Club geloven we niet in extreem diëten of urenlang sporten[\s\S]*?leven!<\/p>/,
  '<p>At HR Fitness Club, we don’t believe in extreme crash diets or spending three hours a day in the gym. We believe in building an enjoyable, realistic fitness lifestyle that fits alongside a demanding career and busy family commitments.</p>'
);

s3 = s3.replace(
  /<p>Lange werkdagen, deadlines en stress zorgen er vaak voor dat sport en voeding[\s\S]*?vicieuze cirkel\.<\/p>/,
  '<p>Long work hours, client deadlines, and business stress frequently push exercise and nutritious meals down the priority list. Fast food, skipping meals, and sedentary desk hours lead to low stamina and fatigue, creating a frustrating cycle that diminishes daily productivity.</p>'
);

s3 = s3.replace(
  /<p>Hier zijn vijf bewezen strategieën om fit te blijven ondanks een overvolle agenda:<\/p>/,
  '<p>Here are five proven, actionable strategies for busy professionals to stay healthy, active, and focused:</p>'
);

s3 = s3.replace(
  /<p>Plan je trainingen in je agenda zoals elke belangrijke werkafspraak[\s\S]*?gewoonte\.<\/p>/,
  '<p><strong>1. Schedule Workouts in Your Calendar:</strong> Treat gym sessions like unmissable client appointments. Booking 45 minutes 3 days a week creates non-negotiable boundaries that protect your health and sharpen mental acuity.</p>'
);

s3 = s3.replace(
  /<p>Kies voor efficiënte krachttraining met compound oefeningen[\s\S]*?tijdswinst\.<\/p>/,
  '<p><strong>2. Choose High-Yield Compound Exercises:</strong> Focus your training around squats, presses, rows, and deadlifts. Compound multi-joint lifts recruit more muscle mass in less time, maximizing calorie expenditure and metabolic conditioning.</p>'
);

s3 = s3.replace(
  /<p>Bereid maaltijden voor of zorg voor gezonde opties binnen handbereik[\s\S]*?verleidingen\.<\/p>/,
  '<p><strong>3. Streamline Your Nutrition:</strong> Keep wholesome protein and fiber snacks within easy reach at your desk. Preparing balanced meals in advance prevents impulsive ordering when fatigue hits in the afternoon.</p>'
);

s3 = s3.replace(
  /<p>Beweeg meer tijdens je werkdag[\s\S]*?frisse energie\.<\/p>/,
  '<p><strong>4. Incorporate Movement Throughout Your Workday:</strong> Take standing breaks, walk during phone calls, and stretch your hip flexors and chest. Simple physical movement elevates circulation and reduces postural stiffness.</p>'
);

s3 = s3.replace(
  /<p>Investeer in kwaliteitsslaap en stressmanagement[\s\S]*?heldere focus\.<\/p>/,
  '<p><strong>5. Protect Your Sleep & Recovery:</strong> Quality sleep is when your muscles repair and mental reserves replenish. Aim for consistent sleep timings and unwind without screens prior to bed.</p>'
);

s3 = s3.replace(
  /<p>Wil je ontdekken hoe je gezond en fit kunt blijven ondanks een drukke agenda\?[\s\S]*?lifestyle past\.<\/p>/,
  '<p>Want to discover how to stay fit, energized, and strong alongside a busy schedule? Visit HR Fitness Club in Thatipur, Gwalior and speak with our trainers to design an efficient, custom workout routine.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-hoe-blijf-je-gezond-met-een-drukke-baan.html'), s3, 'utf8');
console.log('Translated story-hoe-blijf-je-gezond-met-een-drukke-baan.html');

// --- 4. story-ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen.html ---
let s4 = fs.readFileSync(path.join(pDir, 'story-ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen.html'), 'utf8');

s4 = s4.replace(/Kennis \| Hielke van der Lei \| 27 mei 2026/g, 'Fitness Guide | HR Fitness Team | May 27, 2026');
s4 = s4.replace(/<h2>Wat er eigenlijk achter die drempel zit<\/h2>/g, '<h2>What Really Lies Behind Gym Hesitation</h2>');
s4 = s4.replace(/<h2>Waarom helpt “gewoon gaan” niet als advies<\/h2>/g, '<h2>Why "Just Go" Is Unhelpful Advice</h2>');
s4 = s4.replace(/<h2>Wat helpt wél\?<\/h2>/g, '<h2>What Actually Helps Overcome Gym Anxiety</h2>');
s4 = s4.replace(/<h2>Wat als de angst dieper gaat\?<\/h2>/g, '<h2>What If the Hesitation Feels Overwhelming?</h2>');
s4 = s4.replace(/<h2>Hoe maak je de eerste stap concreet\?<\/h2>/g, '<h2>How to Make Your First Step Tangible</h2>');
s4 = s4.replace(/<h2>at HR Fitness Club hoef je er niet alleen in te staan<\/h2>/g, '<h2>At HR Fitness Club, You Never Have to Train Alone</h2>');

s4 = s4.replace(
  /<p>Het gevoel is herkenbaar: je wíl bewegen, je weet dat het goed voor je is[\s\S]*?niet op\.<\/p>/,
  '<p>The feeling is remarkably common: you want to be active, you recognize the physical and mental benefits, but the thought of walking into a gym causes immediate hesitation. Gym anxiety is not a weakness; it is one of the most widespread psychological barriers keeping people from prioritizing their health. And it does not vanish on its own without a supportive environment.</p>'
);

s4 = s4.replace(
  /<p>De meeste mensen zijn bang dat anderen naar hen kijken of hen beoordelen[\s\S]*?eigen training bezig\.<\/p>/,
  '<p>The primary fear is often judgment: worrying that everyone is fitter, that you will use equipment incorrectly, or that people are watching you. In reality, nearly everyone at the gym is focused entirely on their own workout, managing their own challenges and personal goals.</p>'
);

s4 = s4.replace(
  /<p>Wat wél helpt, is de drempel zo laag mogelijk maken[\s\S]*?stap voor stap:<\/p>/,
  '<p>What genuinely helps is lowering the barrier to entry with concrete, manageable steps:</p>'
);

s4 = s4.replace(
  /<p>Plan eerst een rustige rondleiding zonder dat je direct hoeft te trainen[\s\S]*?veilig voelt\.<\/p>/,
  '<p><strong>1. Tour the Facility First:</strong> Visit the club casually without workout gear just to meet the trainers, see the space, and ask questions. Familiarity dissolves fear.</p>'
);

s4 = s4.replace(
  /<p>Kies voor persoonlijke begeleiding tijdens je eerste sessies[\s\S]*?vertrouwen op\.<\/p>/,
  '<p><strong>2. Work with a Dedicated Coach:</strong> Having a certified trainer beside you eliminates all guesswork. Your trainer demonstrates proper form, adjusts weights, and ensures every movement feels comfortable and safe.</p>'
);

s4 = s4.replace(
  /<p>Onthoud dat iedereen ergens is begonnen[\s\S]*?moed gevraagd\.<\/p>/,
  '<p><strong>3. Remember Every Fit Person Was Once a Beginner:</strong> Every experienced lifter at the gym once walked through the doors for the first time. Taking that step requires courage, and that courage deserves mutual respect.</p>'
);

s4 = s4.replace(
  /<p>Bij HR Fitness Club in Thatipur, Gwalior[\s\S]*?je klaar staat\.<\/p>/,
  '<p>At HR Fitness Club in Thatipur, Gwalior, we pride ourselves on fostering a friendly, zero-intimidation atmosphere where members of all fitness backgrounds feel genuinely welcome. Contact us for a relaxed visit and see the difference firsthand.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen.html'), s4, 'utf8');
console.log('Translated story-ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen.html');

// --- 5. story-is-krachttraining-voor-kinderen-slecht-voor-de-groei.html ---
let s5 = fs.readFileSync(path.join(pDir, 'story-is-krachttraining-voor-kinderen-slecht-voor-de-groei.html'), 'utf8');

s5 = s5.replace(/Kennis \| Hielke van der Lei \| 20 mei 2026/g, 'Fitness Guide | HR Fitness Team | May 20, 2026');
s5 = s5.replace(/<h2>Waar komt het idee vandaan dat krachttraining de groei remt\?<\/h2>/g, '<h2>Where Did the Myth of Stunted Growth Originate?</h2>');
s5 = s5.replace(/<h2>Wat zijn groeischijven en lopen die gevaar\?<\/h2>/g, '<h2>What Are Growth Plates and Are They in Danger?</h2>');
s5 = s5.replace(/<h2>Wat zegt onderzoek over kinderen die aan kracht werken\?<\/h2>/g, '<h2>What Does Modern Medical Research Say?</h2>');
s5 = s5.replace(/<h2>Welke voordelen heeft krachttraining voor jongeren\?<\/h2>/g, '<h2>The Proven Health Benefits of Strength Training for Youth</h2>');
s5 = s5.replace(/<h2>Vanaf welke leeftijd kan een kind met krachttraining beginnen\?<\/h2>/g, '<h2>What Age Can Youth Begin Resistance Training?</h2>');
s5 = s5.replace(/<h2>Waar zitten de echte risico’s\?<\/h2>/g, '<h2>What Are the True Risks to Avoid?</h2>');
s5 = s5.replace(/<h2>Hoe ziet verantwoorde training voor tieners eruit\?<\/h2>/g, '<h2>What Does Responsible Youth Training Look Like?</h2>');
s5 = s5.replace(/<h2>Twijfel je of krachttraining bij je kind past\?<\/h2>/g, '<h2>Have Questions About Training for Your Teen?</h2>');

s5 = s5.replace(
  /<p>De mythe bestaat al tientallen jaren[\s\S]*?minder lang wordt\.<\/p>/,
  '<p>The myth that lifting weights stunts growth has circulated for decades, originally based on outdated, misinterpreted observations. The misconception was that lifting loads would compress bones and damage growth plates, preventing children from reaching their full biological height.</p>'
);

s5 = s5.replace(
  /<p>Grote medische organisaties zoals de American Academy of Pediatrics[\s\S]*?veilig en effectief\.<\/p>/,
  '<p>Major sports medicine institutions worldwide—including the American Academy of Pediatrics (AAP) and the British Journal of Sports Medicine—have conclusively debunked this myth. Scientific evidence demonstrates that properly supervised youth resistance training is not only safe, but profoundly beneficial for bone mineral density, neuromuscular coordination, and sports performance.</p>'
);

s5 = s5.replace(
  /<p>De krachten die vrijkomen bij springen, voetballen of turnen[\s\S]*?krachttraining\.<\/p>/,
  '<p>In fact, the ground reaction impact forces experienced during regular playground sports like basketball, football, or gymnastics often exceed multiple times a child’s body weight—far greater than the controlled, progressive loads applied in supervised strength training.</p>'
);

s5 = s5.replace(
  /<p>De voordelen van verantwoorde krachttraining voor jongeren zijn enorm:<\/p>/,
  '<p>The physical and mental benefits of supervised youth resistance training include:</p>'
);

s5 = s5.replace(
  /<p>Sterkere botten en verhoogde botdichtheid[\s\S]*?toekomst\.<\/p>/,
  '<p><strong>1. Increased Bone Mineral Density:</strong> Weight-bearing exercises stimulate optimal bone mineralization during critical growth years, providing long-term skeletal health.</p>'
);

s5 = s5.replace(
  /<p>Verbeterde motoriek, coördinatie en lichaamshouding[\s\S]*?zelfvertrouwen\.<\/p>/,
  '<p><strong>2. Enhanced Posture and Motor Skills:</strong> Learning compound mechanics improves body awareness, core stability, and athletic confidence while counteracting hours of desk sitting.</p>'
);

s5 = s5.replace(
  /<p>Verlaagd risico op sportblessures bij andere sporten[\s\S]*?beschermen\.<\/p>/,
  '<p><strong>3. Significant Reduction in Sports Injuries:</strong> Strengthening connective tissues, hamstrings, and stabilizer muscles directly prevents ACL sprains and overuse injuries in school sports.</p>'
);

s5 = s5.replace(
  /<p>Want to learn more about age-appropriate strength training for young athletes\?[\s\S]*?your kind\.<\/p>/,
  '<p>Want to learn more about safe, age-appropriate fitness and strength training for teens and young athletes? Contact HR Fitness Club in Thatipur, Gwalior. Our experienced trainers are delighted to guide your family toward healthy athletic development.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-is-krachttraining-voor-kinderen-slecht-voor-de-groei.html'), s5, 'utf8');
console.log('Translated story-is-krachttraining-voor-kinderen-slecht-voor-de-groei.html');
