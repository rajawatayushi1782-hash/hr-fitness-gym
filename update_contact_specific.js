const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'pages', 'contact.html');
const snap = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_inventory_snapshot.json'), 'utf8'));

let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<title>[\s\S]*?<\/title>/i, '<title>Contact Us | HR Fitness Club - Thatipur, Gwalior</title>');
c = c.replace(/<meta\s+name="description"\s+content="[\s\S]*?"/i, '<meta name="description" content="Contact HR Fitness Club in Thatipur, Gwalior. Call +91 83199 50446 or visit 312, Near Axis Bank, Suresh Nagar Chauraha, Thatipur, Gwalior – 474011.">');
c = c.replace(/<h1 class="h1">Contact<\/h1>/i, '<h1 class="h1">Contact Us</h1>');

// Address & contact block
const addressHtml = '<div class="contact__contentright">Ready to start at HR Fitness Club? Contact our trainers directly by calling <a class="_ar_hide_" href="tel:+918319950446">+91 83199 50446</a> or email <a class="_ar_hide_" href="mailto:info@hrfitnessclub.com">info@hrfitnessclub.com</a>.<br><br><strong>Address:</strong> 312, Near Axis Bank, Suresh Nagar Chauraha, Thatipur, Gwalior, Madhya Pradesh – 474011<br><strong>Hours:</strong> Monday – Saturday: 6:00 AM – 11:00 PM<br><br>You can also fill out the form below and our team will get back to you promptly.</div>';

c = c.replace(/<div class="contact__contentright">[\s\S]*?<\/div>/i, addressHtml);

// Form labels
c = c.replace(/>Naam</g, '>First Name<');
c = c.replace(/>Achternaam</g, '>Last Name<');
c = c.replace(/>E-mailadres</g, '>Email Address<');
c = c.replace(/>Telefoonnummer</g, '>Phone Number<');
c = c.replace(/>Wat is jouw focusgebied\?</g, '>What is your fitness focus?<');
c = c.replace(/>Waar kan GO180 mij mee helpen\?</g, '>How can HR Fitness Club help you?<');
c = c.replace(/value="Verstuur"/g, 'value="Submit"');
c = c.replace(/>Mindset</g, '>General Fitness<');
c = c.replace(/>Training</g, '>Strength Training<');
c = c.replace(/>Voeding</g, '>Personal Training<');
c = c.replace(/>Herstel</g, '>Cardio & Weight Loss<');

// Image Check
const originalImgs = snap['contact.html'].imgs;
const updatedImgs = c.match(/<img[^>]+>/gi) || [];
if (originalImgs.length !== updatedImgs.length) {
  throw new Error(`IMG count mismatch in contact.html: before=${originalImgs.length}, after=${updatedImgs.length}`);
}
for (let i = 0; i < originalImgs.length; i++) {
  if (originalImgs[i] !== updatedImgs[i]) {
    throw new Error(`IMG mismatch in contact.html at index ${i}`);
  }
}

fs.writeFileSync(file, c, 'utf8');
console.log('contact.html updated successfully!');