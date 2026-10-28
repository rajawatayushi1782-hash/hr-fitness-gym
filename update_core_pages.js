const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

// --- 1. Update we-are-go180.html ---
let weAre = fs.readFileSync(path.join(pDir, 'we-are-go180.html'), 'utf8');

weAre = weAre.replace(/Wij helpen jou met het bouwen van een gezonde leefstijl\./g, 'We help you build a healthy, energetic lifestyle.');
weAre = weAre.replace(/>Voeding</g, '>Nutrition<');
weAre = weAre.replace(/>Herstel</g, '>Recovery<');
weAre = weAre.replace(/Veelgestelde vragen over GO180/g, 'Frequently Asked Questions About HR Fitness Club');
weAre = weAre.replace(/Oprichter en Coach/g, 'Founder & Coach');
weAre = weAre.replace(/Oprichter & Coach/g, 'Founder & Coach');
weAre = weAre.replace(/Personal Trainer en Coach/g, 'Personal Trainer & Coach');
weAre = weAre.replace(/Coach en Personal Trainer/g, 'Coach & Personal Trainer');
weAre = weAre.replace(/Leeuwarden/g, 'Thatipur, Gwalior');
weAre = weAre.replace(/Build your tomorrow/g, 'Build Your Tomorrow');
weAre = weAre.replace(/>We are GO180</g, '>About Us<');

// Fix any FAQ schema in we-are-go180
weAre = weAre.replace(/Waarom kiezen voor GO180 als your fitness Leeuwarden voor blijvende resultaten\?/g, 'Why choose HR Fitness Club in Thatipur, Gwalior for lasting results?');
weAre = weAre.replace(/Hoe helpt our sportschool Leeuwarden jou om sterker, fitter en energieker te worden\?/g, 'How does HR Fitness Club help you become stronger, fitter, and more energetic?');
weAre = weAre.replace(/Wat maakt GO180 anders dan andere gym Leeuwarden locaties\?/g, 'What sets HR Fitness Club apart from other gyms in Gwalior?');
weAre = weAre.replace(/Welke doelen kun je bereiken bij our fitness Leeuwarden\?/g, 'What fitness goals can you achieve at HR Fitness Club?');
weAre = weAre.replace(/Waar kan our sportschool Leeuwarden jou concreet bij helpen\?/g, 'How does HR Fitness Club guide your long-term fitness journey?');

fs.writeFileSync(path.join(pDir, 'we-are-go180.html'), weAre, 'utf8');
console.log('Updated we-are-go180.html');

// --- 2. Update club-leeuwarden.html ---
let club = fs.readFileSync(path.join(pDir, 'club-leeuwarden.html'), 'utf8');

club = club.replace(/Dé plek voor personal training in Leeuwarden/g, 'The Premier Fitness Centre in Thatipur, Gwalior');
club = club.replace(/Ben je op zoek naar een effectieve manier om je doelen op het gebied van sport en gezondheid te behalen\? Volg een personal training in Leeuwarden die jou helpt bij het bereiken van your personal doelen\. In HR Fitness Club werk je aan persoonlijke doelen die je met je coach hebt opgezet\. Dit is de plek voor fysieke en sportieve doelen, voor verbinding en voor persoonlijke groei\. Lees hier hoe your personal training eruitziet\./g, 'Are you looking for an effective way to achieve your health and fitness goals? Experience dedicated fitness and personal coaching at HR Fitness Club in Thatipur, Gwalior. Here you work toward personalized goals set together with your trainer. This is your destination for strength, stamina, community, and personal growth.');
club = club.replace(/Op loopafstand van hartje centrum Leeuwarden is GO180’s boutique club gevestigd\. Hier vind je de perfecte omgeving om aan je doelen te werken, aan de hand van een/g, 'Conveniently located near Axis Bank, Suresh Nagar Chauraha in Thatipur, Gwalior, HR Fitness Club provides a modern, motivating environment equipped with high-grade strength and cardio gear.');
club = club.replace(/Personal trainers in Leeuwarden/g, 'Certified Trainers & Coaches in Thatipur, Gwalior');
club = club.replace(/>Voeding</g, '>Nutrition<');
club = club.replace(/>Leeuwarden</g, '>Thatipur Club<');
club = club.replace(/>Bekijk club</g, '>View Club<');
club = club.replace(/Build your tomorrow/g, 'Build Your Tomorrow');
club = club.replace(/Waarom kiezen voor personal training in Leeuwarden bij GO180\?/g, 'Why choose personal training at HR Fitness Club in Thatipur, Gwalior?');
club = club.replace(/Wat doet een personal trainer in Leeuwarden bij GO180 precies\?/g, 'What does a personal trainer at HR Fitness Club do?');
club = club.replace(/Voor wie is personal training Leeuwarden bij GO180 geschikt\?/g, 'Who is personal training at HR Fitness Club suitable for?');
club = club.replace(/Hoe ziet personal training in Leeuwarden bij GO180 eruit\?/g, 'What does personal training at HR Fitness Club look like?');
club = club.replace(/Wat levert personal training bij GO180 Leeuwarden jou op\?/g, 'What results can you expect from training at HR Fitness Club?');
club = club.replace(/Je start met een persoonlijk assessment waarin we your goals en drijfveren bepalen[\s\S]*?zodat je stap voor stap vooruitgang boekt\./g, 'You start with a personalized fitness assessment where we understand your goals and daily lifestyle. You then train with your coach in our modern Thatipur fitness centre. Proper training technique, nutritional guidance, and habit building come together in one clear plan for consistent progress.');
club = club.replace(/Personal training bij GO180 helpt je om structuur, vertrouwen en energie op te bouwen[\s\S]*?waar je altijd op kunt terugvallen\./g, 'Training at HR Fitness Club helps you build discipline, strength, and daily energy. You develop sustainable fitness habits, feel fitter, and live healthier every day.');
club = club.replace(/Personal training Leeuwarden\? \[Build Your Tomorrow\] \| HR Fitness Club/g, 'Thatipur Club | HR Fitness Club - Suresh Nagar Chauraha, Gwalior');
club = club.replace(/Personal training Leeuwarden, bij GO180 \[Build Your Tomorrow\]/g, 'Fitness & Personal Training at HR Fitness Club, Thatipur, Gwalior');
club = club.replace(/Personal training Leeuwarden, bij GO180/g, 'Fitness & Personal Training at HR Fitness Club');

fs.writeFileSync(path.join(pDir, 'club-leeuwarden.html'), club, 'utf8');
console.log('Updated club-leeuwarden.html');
