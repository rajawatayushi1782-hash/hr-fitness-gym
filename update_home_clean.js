const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'public', 'pages', 'home.html');
let content = fs.readFileSync(homePath, 'utf8');

// 1. Hero heading capitalization
content = content.replace(
  '<h1 class="slide__title slide__titleAnimation h1">Build your tomorrow</h1>',
  '<h1 class="slide__title slide__titleAnimation h1">Build Your Tomorrow</h1>'
);

// 2. Reviews translation
content = content.replace(
  /GO180 is de fijnste sportschool waar ik ooit lid ben geweest\. De reden dat ik voor G0180 gekozen heb is: building and breaking habbits\. Dat heeft absoluut gewerkt\. Ik ben oprecht iedere week minimaal 2x per week gaan trainen\. Dat komt doordat GO180 inzet op je het gevoel te geven het samen te doen en echt ergens bij te horen\./g,
  'HR Fitness Club is the best gym I have ever joined. The focus on building healthy habits and consistent workouts really worked for me. I train at least twice every week because the trainers make you feel supported and part of an encouraging fitness community.'
);

content = content.replace(
  /GO180 is de fijnste sportschool waar ik ooit lid ben geweest\. De reden dat ik voor G0180 gekozen…/g,
  'HR Fitness Club is the best gym I have ever joined. The focus on building healthy habits and…'
);

content = content.replace(
  /Een fijne sportschool,niet zo massaal\.Proffesionele trainers en helpen je goed bij your personal wensen qua sporten en afvallen\(voeding\)\.Ze motiveren je om je grenzen te verleggen\.Ik ben erg blij met mijn personal trainer Arjon\./g,
  'A fantastic fitness club with great personal attention. The trainers are highly professional and guide you according to your fitness goals and weight management. They constantly motivate you to push your limits. Very happy with the personal training here!'
);

content = content.replace(
  /Een fijne sportschool,niet zo massaal\.Proffesionele trainers en helpen je goed bij your persoonli…/g,
  'A fantastic fitness club with great personal attention. The trainers are highly professional and…'
);

content = content.replace(
  /Top  gym waar echt aandacht is voor de persoon lichamelijk en geestelijk  om het beste uit je leven te halen\. Vriendelijk en professioneel personeel\. Heel schoon en goede apparatuur\. Heel positief 👍🏻👌/g,
  'Top-notch gym that truly focuses on your physical fitness and overall well-being. Friendly and professional staff, spotless clean environment, and high-quality workout equipment. Highly recommended! 👍🏻👌'
);

content = content.replace(
  /Top gym waar echt aandacht is voor de persoon lichamelijk en geestelijk om het beste uit je lev…/g,
  'Top-notch gym that truly focuses on your physical fitness and overall well-being. Friendly and…'
);

content = content.replace(
  /3 maanden trainen als prijs gewonnen en nu zelf door omdat het echt een hele fijne sportschool is met goede persoonlijke aandacht en begeleiding!/g,
  'Joined for a 3-month training package and continuing on because it is truly a wonderful fitness club with exceptional personal attention and coaching guidance!'
);

content = content.replace(
  /3 maanden trainen als prijs gewonnen en nu zelf door omdat het echt een hele fijne sportscho…/g,
  'Joined for a 3-month training package and continuing on because it is truly a wonderful fitness club…'
);

content = content.replace(
  /Als lid dat nu 10 maanden bij Go180 sport, sluit ik me volledig aan bij alle andere positieve reviews\. Wat mij vooral opvalt is dat ze consequent hun hoge niveau weten vast te houden\. Het woord 'klantvriendelijkheid' dekt hier niet de lading - wat je ervaart is oprechte gastvrijheid in een aangename, rustige sfeer\. De trainer\/coaches zijn uitzonderlijk betrokken; ze komen regelmatig even bij je oefening staan om je techniek te verfijnen en net dat beetje extra uit je training te halen\. Go180 verdient absoluut vijf sterren\. Ja, het prijskaartje is wat hoger, maar daar krijg je veel voor terug: een totaalmoment voor jezelf in een sportschool die nooit te druk is, heerlijke douchemogelijkheden en na je training staat er altijd een shake voor je klaar\. Wat deze plek extra bijzonder maakt is de onderlinge sfeer tussen de leden\. Iedereen is vriendelijk tegen elkaar, waardoor er echt een clubgevoel is ontstaan\. Ga zo door team Go180!/g,
  'Having been a member at HR Fitness Club for 10 months, I completely agree with all the positive reviews. They consistently maintain top standards. The coaches are exceptionally dedicated, refining your workout technique and helping you get the most out of every session. Five stars all the way! You get incredible value with modern facilities, clean environment, and motivating trainers. What makes this place special is the friendly atmosphere among all members. Keep up the great work, team HR Fitness Club!'
);

content = content.replace(
  /Als lid dat nu 10 maanden bij Go180 sport, sluit ik me volledig aan bij alle andere positieve revi…/g,
  'Having been a member at HR Fitness Club for 10 months, I completely agree with all the positive reviews…'
);

content = content.replace(
  /Erg goede ondersteuning tijdens fitnessen!/g,
  'Extremely good coaching and support during daily workout sessions!'
);

content = content.replace(
  /Zeker aan te raden! Een goede sportschool met personal training\. Waarbij samen met leuke motiverende personal trainers een doel voor jou wordt samengesteld, op een goede gezonde manier met training en voeding\./g,
  'Definitely recommended! A fantastic fitness club with dedicated personal trainers who create tailored workout and nutrition plans to help you achieve your goals in a healthy and sustainable way.'
);

content = content.replace(
  /Zeker aan te raden! Een goede sportschool met personal training\. Waarbij samen met leuke motive…/g,
  'Definitely recommended! A fantastic fitness club with dedicated personal trainers who create tailored…'
);

// 3. Schema.org JSON-LD
content = content.replace(
  '\"name\":\"Samen naar een gezonde leefstijl, o.a. PT, fitness | HR Fitness Club\"',
  '\"name\":\"Personal Training, Fitness & Healthy Lifestyle | HR Fitness Club, Thatipur, Gwalior\"'
);

content = content.replace(
  '\"brand\":{\"@type\":\"Brand\",\"name\":\"Samen naar een gezonde leefstijl, o.a. PT, fitness | HR Fitness Club\"}',
  '\"brand\":{\"@type\":\"Brand\",\"name\":\"HR Fitness Club, Thatipur, Gwalior\"}'
);

content = content.replace(
  '\"description\":\"Met GO180 op naar een gezonde leefstijl? Het beste uit jezelf halen, de rest van je leven? Begin vandaag &amp; meld je aan! O.a. 24/7 advies.\"',
  '\"description\":\"Build Your Tomorrow at HR Fitness Club, Thatipur, Gwalior. Premium gym facilities, certified trainers, personalized workout and nutrition guidance.\"'
);

content = content.replace(
  /\"reviewBody\":\"Twee jaar lang met zoveel plezier getraind bij GO180[\s\S]*?die hij\/zij verder brengt\.\"/,
  '\"reviewBody\":\"Training at HR Fitness Club has been an exceptional experience. The modern equipment, welcoming team, and personal attention make it stand out. Highly recommended in Thatipur, Gwalior!\"'
);

// 4. Form i18n
content = content.replace(
  '\"dayNamesMin\":[\"Zo\",\"Ma\",\"Di\",\"Wo\",\"Do\",\"Vr\",\"Za\"]',
  '\"dayNamesMin\":[\"Su\",\"Mo\",\"Tu\",\"We\",\"Th\",\"Fr\",\"Sa\"]'
);

content = content.replace(
  '\"monthNames\":[\"Januari\",\"Februari\",\"Maart\",\"April\",\"Mei\",\"Juni\",\"Juli\",\"Augustus\",\"September\",\"Oktober\",\"November\",\"December\"]',
  '\"monthNames\":[\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"]'
);

content = content.replace(
  '\"iconText\":\"Selecteer een datum\"',
  '\"iconText\":\"Select a date\"'
);

content = content.replace(
  '\"invalid_file_extension\":\"This file type is not allowed. Moet \\u00e9\\u00e9n van de volgende zijn:\"',
  '\"invalid_file_extension\":\"This file type is not allowed. Must be one of the following:\"'
);

content = content.replace('\"delete_file\":\"Dit bestand verwijderen\"', '\"delete_file\":\"Delete this file\"');
content = content.replace('\"in_progress\":\"in behandeling\"', '\"in_progress\":\"in progress\"');
content = content.replace('\"file_exceeds_limit\":\"Bestand overschrijdt limiet bestandsgrootte\"', '\"file_exceeds_limit\":\"File exceeds size limit\"');
content = content.replace('\"illegal_extension\":\"Dit type bestand is niet toegestaan.\"', '\"illegal_extension\":\"This file type is not allowed.\"');
content = content.replace('\"max_reached\":\"Maximale aantal bestanden bereikt\"', '\"max_reached\":\"Maximum number of files reached\"');
content = content.replace('\"unknown_error\":\"Er was een probleem bij het opslaan van het bestand op de server\"', '\"unknown_error\":\"There was a problem saving the file on the server\"');
content = content.replace('\"currently_uploading\":\"Wacht tot het uploaden is voltooid\"', '\"currently_uploading\":\"Please wait until the upload is complete\"');
content = content.replace('\"cancel\":\"Annuleren\"', '\"cancel\":\"Cancel\"');
content = content.replace('\"cancel_upload\":\"Deze upload annuleren\"', '\"cancel_upload\":\"Cancel this upload\"');
content = content.replace('\"cancelled\":\"Geannuleerd\"', '\"cancelled\":\"Cancelled\"');

fs.writeFileSync(homePath, content, 'utf8');
console.log('Successfully updated home.html!');
