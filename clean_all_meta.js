const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(pDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Contact.html specific
  content = content.replace(
    /Heb je vragen over onze trainingen, coaches, werkwijze of visie van GO180\? Laat het ons vooral weten\. Wij helpen[\s\S]*?verder\./g,
    'Have questions about our training programs, coaches, facilities, or membership options at HR Fitness Club? Contact our team in Thatipur, Gwalior today. We are delighted to guide your fitness journey.'
  );

  // Meta titles & descriptions
  content = content.replace(
    /Meer weten\? Neem contact met ons op \| HR Fitness Club/g,
    'Contact HR Fitness Club | Thatipur, Gwalior'
  );
  content = content.replace(
    /De personal trainers van GO180 zijn van zeer hoge kwaliteit[\s\S]*?doelen\./g,
    'The certified personal trainers and coaches at HR Fitness Club guide and support you to reach your health and fitness goals in Thatipur, Gwalior.'
  );

  // Geertje review in home.html (with double newlines or any whitespace)
  content = content.replace(
    /Als lid dat nu 10 maanden bij Go180 sport[\s\S]*?Ga zo door team Go180\!/g,
    'Having been a member at HR Fitness Club for 10 months, I completely agree with all the positive reviews. They consistently maintain top standards. The coaches are exceptionally dedicated, refining your workout technique and helping you get the most out of every session. Five stars all the way! You get incredible value with modern facilities, clean environment, and motivating trainers. What makes this place special is the friendly atmosphere among all members. Keep up the great work, team HR Fitness Club!'
  );

  // Other remaining Dutch fragments in meta tags
  content = content.replace(
    /Met de juiste eet-, beweeg en leefstijladviezen is er meer mogelijk dan jij je nu voor kunt stellen\. Begin vandaag nog\!/g,
    'Build Your Tomorrow at HR Fitness Club, Thatipur, Gwalior. With customized workout guidance, proper form, and healthy lifestyle support, achieve lasting results.'
  );
  content = content.replace(
    /Persoonlijk betrokken ✓Serieus werken aan je gezondheid ✓24\/7 advies/g,
    'Personal attention, modern gym facilities, and expert guidance at HR Fitness Club, Thatipur, Gwalior.'
  );
  content = content.replace(
    /Personal training Leeuwarden, bij GO180 \[Build Your Tomorrow\]/g,
    'Build Your Tomorrow | HR Fitness Club - Thatipur, Gwalior'
  );
  content = content.replace(
    /Personal training Leeuwarden\? \[Build Your Tomorrow\]/g,
    'Build Your Tomorrow | HR Fitness Club - Thatipur, Gwalior'
  );

  // Form label & focus area cleanups
  content = content.replace(/>Wat is your focusgebied\?</g, '>What is your fitness focus?<');
  content = content.replace(/>Waar kan HR Fitness Club mij mee helpen\?</g, '>How can HR Fitness Club help you?<');
  content = content.replace(/>Naam</g, '>First Name<');
  content = content.replace(/>Achternaam</g, '>Last Name<');
  content = content.replace(/>E-mailadres</g, '>Email Address<');
  content = content.replace(/>Telefoonnummer</g, '>Phone Number<');

  // Any remaining "Build your tomorrow" -> "Build Your Tomorrow"
  content = content.replace(/Build your tomorrow/g, 'Build Your Tomorrow');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${f}`);
  }
});

console.log('Finished comprehensive sweep!');
