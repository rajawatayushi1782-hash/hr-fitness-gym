const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

const replacements = [
  // Common program elements
  {
    search: /Persoonlijke assessment/g,
    replace: 'Personal Fitness Assessment'
  },
  {
    search: /Doelgerichte persoonlijke training/g,
    replace: 'Goal-Oriented Personal Training'
  },
  {
    search: /We beginnen met een uitgebreid assessment[\s\S]*?vragen om inzicht te krijgen in je/g,
    replace: 'We begin with an in-depth fitness assessment where our trainers discuss your goals, daily routine, and'
  },
  {
    search: /Op basis van de informatie die tijdens het assessment verzameld hebben, gaan we aan de slag\. We ontw[\s\S]*?plan/g,
    replace: 'Based on the insights gathered during your assessment, we design a customized workout program tailored to your fitness goals and daily schedule'
  },
  {
    search: /Een gezond en doelgericht voedingspatroon is essentieel voor het bereiken van your doel[\s\S]*?voedings/g,
    replace: 'A healthy and goal-oriented diet is essential for achieving lasting results. We provide practical guidance and sustainable nutrition'
  },
  {
    search: /We laten niets aan het toeval over\. Daarom monitoren we your progressie en sturen we waar nodig bij[\s\S]*?\./g,
    replace: 'We leave nothing to chance. We track your workout consistency, evaluate strength gains, and fine-tune your routine for continuous improvement.'
  },
  {
    search: /We laten niets aan het toeval over\. Daarom ga je wekelijks in gesprek met je coach[\s\S]*?\./g,
    replace: 'We leave nothing to chance. You have regular check-ins with your trainer to evaluate progress, review technique, and stay fully motivated.'
  },
  {
    search: /Tijdens your programma wordt er maandelijks een thema-educatie en coachingsessie georganiseerd[\s\S]*?\./g,
    replace: 'Throughout your training journey, we offer personalized guidance on exercise mechanics, mobility, and injury prevention.'
  },
  {
    search: /Tijdens het programma wordt er maandelijks een thema-educatie en coachingsessie georganiseerd[\s\S]*?\./g,
    replace: 'Throughout the training journey, we offer personalized guidance on exercise mechanics, mobility, and injury prevention.'
  },
  {
    search: /handboek en werkboek\. Aan de hand van de theorie en opdrachten in deze boeken leren de deelnemers de[\s\S]*?\./g,
    replace: 'guidelines and workout logs. Through structured fitness tracking, participants build sustainable exercise habits.'
  },
  {
    search: /De officiële start van het programma is een gezamenlijke kick-off[\s\S]*?\./g,
    replace: 'The program begins with a dedicated kick-off session where members receive their training plans and set milestones with our coaches.'
  },
  {
    search: /Tijdens de eerste afspraak met your personal coach ontvang je het Fundamentals handboek en werkboek[\s\S]*?\./g,
    replace: 'During your first one-on-one session with your trainer, you receive your workout plan and structured fitness guidance.'
  },
  {
    search: /Het Fundamentals-programma is de basis die je nodig hebt voor een duurzaam resultaat[\s\S]*?\./g,
    replace: 'The Fundamentals program establishes the solid foundation you need for sustainable health, functional strength, and long-term vitality.'
  },
  {
    search: /Tijdens dit programma staat coaching op mindset en gedrag centraal\. your trainer brengt je met behul[\s\S]*?\./g,
    replace: 'This program focuses on consistency, discipline, and proper technique. Your trainer guides you step by step to overcome challenges and stay motivated.'
  },
  // programs.html specific
  {
    search: /Professionele begeleiding, persoonlijke aandacht en trainen in een inspirerende trainingsomgeving[\s\S]*?resultaat/g,
    replace: 'Professional guidance, dedicated personal attention, and training in a motivating gym environment help you achieve lasting fitness results'
  },
  {
    search: /The ultimate combination of strength, stamina, and functional fitness\. HYROX is een wereldwijde fitn[\s\S]*?race/g,
    replace: 'The ultimate combination of strength, stamina, and functional fitness. HYROX is a global fitness competition format combining running and functional workouts'
  },
  {
    search: /Train je het liefst in een rustige gym, waar de coaches je kennen\? En wil je vandaag nog een sessie[\s\S]*?\?/g,
    replace: 'Prefer working out in a welcoming gym with friendly trainers who know your goals? Experience flexible gym sessions with expert guidance at HR Fitness Club.'
  },
  {
    search: /Gezond en vitaal ouder worden\? Dan is ons Healthy Ageing programma voor jou\! Je traint en leert same[\s\S]*?\./g,
    replace: 'Want to stay active, strong, and healthy as you age? Our Healthy Ageing program focuses on joint mobility, functional strength, and balance.'
  },
  {
    search: /Gooi het roer om in twaalf weken\! Met dit programma verander je in korte tijd je lichaam en je gezon[\s\S]*?\./g,
    replace: 'Transform your fitness in twelve weeks! This intensive program helps you build strength, burn fat, and develop lifelong healthy habits.'
  },
  {
    search: /Met dit programma werk je aan het creëren van een krachtige mindset en het veranderen van je gedrag[\s\S]*?\./g,
    replace: 'With this program, you develop mental discipline, overcome workout plateaus, and build long-term exercise consistency.'
  },
  {
    search: /Vind je samen sporten leuker dan alleen\? Dan is GO2gether het programma voor jou\. Werk aan your pers[\s\S]*?\./g,
    replace: 'Love training with workout partners? Our small group training program combines energetic group motivation with individualized coach attention.'
  },
  {
    search: /Door het creëren van een vitale en veerkrachtige leefstijl werken we aan de duurzame inzetbaarheid v[\s\S]*?\./g,
    replace: 'Build vitality and team stamina with our corporate fitness programs, designed to boost workplace wellness, energy, and productivity.'
  },
  {
    search: /Door het creëren van een vitale en veerkrachtige leefstijl werken we aan de Sustainable Team Wellnes[\s\S]*?\./g,
    replace: 'Build vitality and team stamina with our corporate fitness programs, designed to boost workplace wellness, energy, and productivity.'
  },
  {
    search: /Met een persoonlijk trainingsplan werk je op afstand naar een fitter en vitaler leven\. Dankzij het w[\s\S]*?\./g,
    replace: 'With a structured workout plan, you train toward a fitter and stronger body with regular trainer check-ins and expert coaching advice.'
  },
  // Digital coaching
  {
    search: /Na je inschrijving ontvang je binnen 24 uur een intakeformulier met vragen over je doelen, je leef-,[\s\S]*?\./g,
    replace: 'After enrolling, you complete an initial fitness questionnaire detailing your health background, schedule, and personal goals.'
  },
  {
    search: /Elke week heb je digitaal contact met je coach via de mail\. Aan de hand van je voortgang en stellen[\s\S]*?\./g,
    replace: 'Each week you connect with your coach to review workout logs, discuss form improvements, and update your routine for maximum progress.'
  },
  {
    search: /Je wordt uitgenodigd om lid van our online community te worden, waarop je vragen kunt stellen en adv[\s\S]*?\./g,
    replace: 'You join our fitness community where you can exchange motivation, ask questions, and receive tips from certified trainers.'
  },
  {
    search: /Starten met digital coaching of eerst nog meer informatie inwinnen\?/g,
    replace: 'Ready to start your fitness program or have questions? Contact us today!'
  },
  // Healthy ageing
  {
    search: /Wil je investeren in je gezondheid en vitaliteit, zodat je volop kunt blijven genieten van bijvoorbe[\s\S]*?\?/g,
    replace: 'Invest in your health and mobility so you can stay active, energetic, and independent for years to come.'
  },
  {
    search: /Dit programma richt zich op het verbeteren van dagelijkse bewegingen, mobiliteit en valpreventie, me[\s\S]*?\./g,
    replace: 'This program focuses on joint health, core stability, balance, and posture through low-impact, guided strength exercises.'
  },
  {
    search: /Met ons Healthy Ageing programma investeer je niet alleen in je fysieke gezondheid, maar ook in je a[\s\S]*?\./g,
    replace: 'With our Healthy Ageing program, you strengthen both physical endurance and overall well-being in a supportive environment.'
  },
  {
    search: /Om de week bieden we leuke en informatieve sessies aan van 30 minuten over verschillende gezondheids[\s\S]*?\./g,
    replace: 'We provide practical workshops on hydration, mobility routines, balanced diet, and active recovery.'
  },
  {
    search: /Training in groepsverband, maar wél persoonlijk\? Meld je dan nu aan voor ons Healthy Ageing programm[\s\S]*?\!/g,
    replace: 'Looking for guided training in a supportive community? Join our Healthy Ageing program at HR Fitness Club today!'
  },
  // HYROX
  {
    search: /at HR Fitness Club, biedt een unieke trainingservaring waarin je werkt aan je kracht, conditie en techniek\. Elke sessie bestaat uit een combinatie van hardlopen en functionele oefeningen, zoals sled pushes, burpees en lunges\./g,
    replace: 'at HR Fitness Club offers a high-energy training experience combining functional strength and cardio conditioning. Each session includes targeted running and functional movements like sled pushes, kettlebell carries, and lunges.'
  },
  {
    search: /Train in een motiverende community/g,
    replace: 'Train in a Motivating Fitness Community'
  },
  {
    search: /begeleiden je in elke training en helpen je om your prestaties naar een hoger niveau te tillen\./g,
    replace: 'guide you in every workout and help elevate your performance safely and effectively.'
  },
  {
    search: /HYROX is toegankelijk voor \*\*alle niveaus\*\*[\s\S]*?bepalen\./g,
    replace: 'HYROX functional training is suitable for all fitness levels. Whether you are a beginner building stamina or an athlete aiming for peak endurance, workouts are scaled to your individual pace.'
  },
  {
    search: /Elke training start met een uitgebreide warming-up en techniektraining om blessures te voorkomen en bewegingen optimaal uit te voeren\./g,
    replace: 'Every workout begins with dynamic warm-ups and movement preparation to prevent injury and master proper lifting mechanics.'
  },
  {
    search: /Elke training bestaat uit een combinatie van hardlopen en functionele oefeningen zoals lunges, sled pushes en burpees\. De intensiteit wordt afgestemd op your fitness level\./g,
    replace: 'Workouts blend interval running with functional resistance exercises like lunges, sled pushes, and burpees, scaled to your current fitness level.'
  },
  {
    search: /We werken met een gestructureerd programma waarbij je steeds sterker en fitter wordt\. Je ziet meetbare vooruitgang in kracht, uithoudingsvermogen en snelheid\./g,
    replace: 'Our structured training blocks ensure progressive overload so you see measurable improvements in strength, endurance, and agility.'
  },
  {
    search: /Nee, je kunt HYROX in Thatipur, Gwalior trainen zonder direct voor een officiële race ingeschreven te staan[\s\S]*?verplichting\./g,
    replace: 'No, you do not need to register for an official race. Our functional training is ideal for anyone wanting to get stronger, leaner, and more conditioned.'
  },
  {
    search: /De trainingen combineren hardlopen met functionele oefeningen zoals sled pushes, lunges, burpees en andere kracht- en conditieonderdelen[\s\S]*?bewegen\./g,
    replace: 'Sessions combine cardio conditioning with functional strength stations, emphasizing proper technique, pacing, and movement efficiency.'
  },
  {
    search: /Ja, je hoeft bij de start nog geen ervaren hardloper te zijn[\s\S]*?uithoudingsvermogen\./g,
    replace: 'Yes, no prior competitive experience is required. Running intervals and exercise loads are adjusted to your current fitness baseline.'
  },
  {
    search: /Hoe bereid HYROX training in Thatipur, Gwalior mij voor op een officiële race\?/g,
    replace: 'How does functional training prepare you for fitness competitions?'
  },
  {
    search: /Je werkt aan de specifieke combinatie van lopen en functionele stations die kenmerkend is voor HYROX[\s\S]*?verbeteren\./g,
    replace: 'You practice the exact workout movements, transition pacing, and mental endurance needed for high-intensity functional events.'
  },
  {
    search: /Iedere sessie begint met warming-up en techniek, waarna de intensiteit wordt afgestemd op your fitness level[\s\S]*?overbelasting\./g,
    replace: 'Each class includes structured warm-ups and form checks. Our coaches monitor your intensity to maximize results while preventing fatigue and strain.'
  },
  {
    search: /Zorg voor vitale werknemers met ons Adaptable programma\? Meld je nu aan\!/g,
    replace: 'Boost workplace vitality and fitness with our corporate wellness training. Contact HR Fitness Club today!'
  }
];

const progFiles = [
  'programs.html',
  'programs-adaptable.html',
  'programs-digital-coaching.html',
  'programs-essentials.html',
  'programs-fundamentals.html',
  'programs-go2day.html',
  'programs-go2gether.html',
  'programs-healthy-ageing.html',
  'programs-hyrox.html'
];

progFiles.forEach(f => {
  const filePath = path.join(pDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });

  // Common cleanup across all program pages
  content = content.replace(/>Voeding</g, '>Nutrition<');
  content = content.replace(/>Herstel</g, '>Recovery<');
  content = content.replace(/>Leeuwarden</g, '>Thatipur Club<');
  content = content.replace(/>Bekijk programma</g, '>View Program<');
  content = content.replace(/Build your tomorrow/g, 'Build Your Tomorrow');
  content = content.replace(/>We are GO180</g, '>About Us<');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${f}`);
});
