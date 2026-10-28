const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

// --- 1. story-beste-glute-oefeningen.html ---
let s1 = fs.readFileSync(path.join(pDir, 'story-beste-glute-oefeningen.html'), 'utf8');

s1 = s1.replace(/Kennis \| Hielke van der Lei \| 17 juni 2026/g, 'Fitness Guide | HR Fitness Team | June 17, 2026');
s1 = s1.replace(/<h2>Waardoor jij niet het gewenste resultaat boekt<\/h2>/g, '<h2>Why You Might Not Be Getting the Results You Want</h2>');
s1 = s1.replace(/<h2>Welke oefeningen leveren wél resultaat op\?<\/h2>/g, '<h2>Which Exercises Actually Deliver Results?</h2>');
s1 = s1.replace(/<h2>Hoe vaak en hoe zwaar moet je trainen\?<\/h2>/g, '<h2>How Often and How Heavy Should You Train?</h2>');
s1 = s1.replace(/<h2>Veelgemaakte fouten bij glute training<\/h2>/g, '<h2>Common Mistakes in Glute Training</h2>');
s1 = s1.replace(/<h2>Aan de slag met your glutes<\/h2>/g, '<h2>Getting Started with Your Glute Training</h2>');

s1 = s1.replace(
  /<p><strong>Glute oefeningen<\/strong> zijn geen luxe voor wie iets mooiers wil zien in de spiegel[\s\S]*?hele beweging\.<\/p>/,
  '<p><strong>Glute exercises</strong> are not merely aesthetic; they are the foundation of a strong lower back, stable knees, and optimal physical movement. The gluteus muscles are the largest muscle group in the human body. Under-training them leads to compensations and strain in your lower back, hips, and knees. Training them with targeted compound movements strengthens your entire posture and daily athletic performance.</p>'
);

s1 = s1.replace(
  /<p>Veel mensen die regelmatig squatten, denken automatisch dat ze hun bilspieren trainen[\s\S]*?krachtontwikkeling\.<\/p>/,
  '<p>Many people who squat regularly assume they are automatically developing their glutes. That is only partly true. In a conventional barbell squat, the quadriceps (front thigh) quickly take over the majority of the mechanical load. The glutes assist, but often do not receive the targeted stimulus necessary for maximum hypertrophy and strength gains.</p>'
);

s1 = s1.replace(
  /<p>Gerichte glute training vraagt om specifieke bewegingen waarbij de heup strekt, abduc eert of extern roteert[\s\S]*?spieren:<\/p>/,
  '<p>Targeted glute training requires specific movement patterns where the hips actively extend, abduct, or externally rotate. That is how you engage the gluteus maximus, gluteus medius, and gluteus minimus. Here are the most effective, research-backed exercises for strong, sculpted glutes:</p>'
);

s1 = s1.replace(
  /<p>De hip thrust is de meest effectieve oefening voor de bilspieren die je kunt doen[\s\S]*?gluteus maximus\.<\/p>/,
  '<p><strong>1. The Barbell Hip Thrust:</strong> The hip thrust is widely recognized in sports science as one of the most effective glute exercises. EMG muscle activation studies consistently show the hip thrust achieves superior gluteus maximus recruitment compared to squats, deadlifts, and standard lunges.</p>'
);

s1 = s1.replace(
  /<p>Je legt je schouderbladen op een bankje, plaatst een barbell over je heupen[\s\S]*?even vast\.<\/p>/,
  '<p><em>Execution:</em> Rest your upper shoulder blades securely on a flat bench, position a cushioned barbell across your hips, and plant your feet flat on the floor at shoulder width. Drive through your heels to extend your hips upward until your torso and thighs form a straight, horizontal line. Squeeze your glutes firmly at the top for a two-second pause before descending with control.</p>'
);

s1 = s1.replace(
  /<p>De Romanian deadlift werkt de bilspieren via een verlengende bewegingsbaan[\s\S]*?sterker worden\.<\/p>/,
  '<p><strong>2. Romanian Deadlifts (RDLs):</strong> The Romanian deadlift challenges the posterior chain through eccentric loaded stretching. Loading the muscle actively under tension provides the essential mechanical stimulus for muscle strength and tone.</p>'
);

s1 = s1.replace(
  /<p>Strek je heupen en zet je voeten heupbreedte uit elkaar[\s\S]*?vooruit te duwen\.<\/p>/,
  '<p><em>Execution:</em> Stand with feet hip-width apart holding dumbbells or a barbell. Keeping your spine neutral and shoulders back, hinge at your hips and push your pelvis rearward. Lower the weight along your shins until you feel a deep stretch in your hamstrings and glutes, then drive your hips forward to lockout.</p>'
);

s1 = s1.replace(
  /<p>De glute bridge lijkt op de hip thrust, maar dan op de grond[\s\S]*?your training\.<\/p>/,
  '<p><strong>3. Glute Bridges:</strong> The glute bridge provides horizontal hip extension mechanics performed directly on the floor. It is exceptional for warm-up muscle activation or focused burnout sets without lower back strain.</p>'
);

s1 = s1.replace(
  /<p>Lig op je rug, voeten plat op de grond, knieën gebogen[\s\S]*?boven je knieën\.<\/p>/,
  '<p><em>Execution:</em> Lie on your back with knees bent and feet planted flat. Press through your heels to bridge your hips upward toward the ceiling, contracting your glutes hard at the apex. Add a resistance band above the knees to stimulate the gluteus medius simultaneously.</p>'
);

s1 = s1.replace(
  /<p>Bulgarian split squats pakken beide benen afzonderlijk aan[\s\S]*?stabiliteit en kracht\.<\/p>/,
  '<p><strong>4. Bulgarian Split Squats:</strong> Unilateral training corrects left-to-right strength imbalances and builds hip stability. Placing your rear foot on an elevated bench focuses deep tension on the front working leg and glute.</p>'
);

s1 = s1.replace(
  /<p>Voor maximale spieropbouw en krachtontwikkeling train je de bilspieren[\s\S]*?kwaliteit en consistentie\.<\/p>/,
  '<p>For optimal strength and development, train your glutes 2 to 3 times per week with progressive overload. Prioritize strict form, full range of motion, and mindful mind-muscle connection rather than swinging excessive weight.</p>'
);

s1 = s1.replace(
  /<p>Wil je your training professional aanpakken met deskundige begeleiding\?[\s\S]*?personal plan\.<\/p>/,
  '<p>Want to elevate your training with expert personal guidance? Contact HR Fitness Club in Thatipur, Gwalior today or visit our gym to start with a personalized workout roadmap.</p>'
);

fs.writeFileSync(path.join(pDir, 'story-beste-glute-oefeningen.html'), s1, 'utf8');
console.log('Translated story-beste-glute-oefeningen.html');

// --- 2. story-hoe-begin-je-weer-met-sporten-na-een-lange-pauze.html ---
let s2 = fs.readFileSync(path.join(pDir, 'story-hoe-begin-je-weer-met-sporten-na-een-lange-pauze.html'), 'utf8');

s2 = s2.replace(/Kennis \| Hielke van der Lei \| 10 juni 2026/g, 'Fitness Guide | HR Fitness Team | June 10, 2026');
s2 = s2.replace(/<h2>Waarom opnieuw beginnen moeilijker voelt dan de eerste keer<\/h2>/g, '<h2>Why Restarting Feels Harder Than Starting the First Time</h2>');
s2 = s2.replace(/<h2>De grootste valkuil: beginnen waar je gebleven was<\/h2>/g, '<h2>The Biggest Trap: Trying to Start Where You Left Off</h2>');
s2 = s2.replace(/<h2>Stap voor stap weer in het ritme komen<\/h2>/g, '<h2>Getting Back into the Rhythm Step by Step</h2>');
s2 = s2.replace(/<h2>Luister naar je lichaam en geef herstel prioriteit<\/h2>/g, '<h2>Listen to Your Body and Prioritize Recovery</h2>');
s2 = s2.replace(/<h2>Consistentie boven intensiteit<\/h2>/g, '<h2>Consistency Over Intensity</h2>');
s2 = s2.replace(/<h2>Starten met deskundige begeleiding<\/h2>/g, '<h2>Starting with Professional Guidance</h2>');

s2 = s2.replace(
  /<p>Na een lange periode van inactiviteit weer de sportschool binnenstappen[\s\S]*?blessures oplopen\.<\/p>/,
  '<p>Returning to the gym after months—or even years—of inactivity is an admirable decision, but it requires patience and a smart game plan. Many individuals make the mistake of attempting the same weights and intensity they handled years ago, leading to acute soreness or early burnout.</p>'
);

s2 = s2.replace(
  /<p>Je spiergeheugen is een echt biologisch fenomeen[\s\S]*?aanpassingstijd nodig\.<\/p>/,
  '<p>Muscle memory is a proven physiological advantage: your muscles regain strength faster the second time around. However, your tendons, ligaments, and joints adapt much slower than your muscles. Rushing heavy loads too quickly increases the risk of tendonitis or strain.</p>'
);

s2 = s2.replace(
  /<p>Begin daarom met lichte gewichten en focus op bewegingskwaliteit[\s\S]*?succesvol maakt:<\/p>/,
  '<p>Begin with manageable weights and prioritize movement quality, dynamic warm-ups, and mobility. Here are the core principles for a successful workout restart:</p>'
);

s2 = s2.replace(
  /<p>Stel realistische doelen voor de eerste vier weken[\s\S]*?goede basis\.<\/p>/,
  '<p><strong>1. Aim for Consistency First:</strong> For your first four weeks, focus solely on showing up 2 to 3 days per week. Establishing the gym habit is far more critical in the beginning than chasing heavy personal records.</p>'
);

s2 = s2.replace(
  /<p>Laat je ego bij de voordeur achter[\s\S]*?techniek en controle\.<\/p>/,
  '<p><strong>2. Check Your Ego at the Door:</strong> Select weights that allow you to complete 10 to 12 repetitions with pristine form. Training with control builds confidence, bulletproofs joints, and stimulates muscle adaptation safely.</p>'
);

s2 = s2.replace(
  /<p>Besteed voldoende aandacht aan warming-up en herstel[\s\S]*?optimaal herstel\.<\/p>/,
  '<p><strong>3. Prioritize Warm-ups and Recovery:</strong> Spend 5 to 10 minutes mobilizing your hips, shoulders, and spine prior to lifting. Prioritize quality sleep and balanced post-workout nutrition to support recovery.</p>'
);

s2 = s2.replace(
  /<p>Bij HR Fitness Club in Thatipur, Gwalior[\s\S]*?jouw fitnessreis\.<\/p>/,
  '<p>At HR Fitness Club in Thatipur, Gwalior, our certified trainers provide personalized guidance and tailored workouts to ensure you restart safely and build unstoppable momentum. Visit us to kickstart your journey today!</p>'
);

fs.writeFileSync(path.join(pDir, 'story-hoe-begin-je-weer-met-sporten-na-een-lange-pauze.html'), s2, 'utf8');
console.log('Translated story-hoe-begin-je-weer-met-sporten-na-een-lange-pauze.html');
