const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve('public/pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

function getReplacement(filename, page) {
  // Homepage slides
  if (filename.includes('GO180-81')) return '/images/indian_fitness/hero_slide1_indian_gym.jpg';
  if (filename.includes('GO180-46-scaled')) return '/images/indian_fitness/programs_slide2_indian_gym.jpg';
  if (filename.includes('GO180-7-scaled')) return '/images/indian_fitness/coaches_slide3_indian_gym.jpg';
  if (filename.includes('GO180-scaled')) return '/images/indian_fitness/our_club_slide4_indian_gym.jpg';
  if (filename.includes('GO180-150')) return '/images/indian_fitness/stories_slide5_indian_gym.jpg';
  if (filename.includes('GO180-86-scaled')) return '/images/indian_fitness/join_now_slide6_indian_gym.jpg';

  // Banners
  if (filename.includes('1920x648') || filename.includes('1800x648')) {
    if (page.includes('coach')) return '/images/indian_fitness/banner_coaches_panoramic.jpg';
    if (page.includes('program')) return '/images/indian_fitness/banner_programs_panoramic.jpg';
    if (page.includes('club') || page.includes('contact')) return '/images/indian_fitness/banner_facility_panoramic.jpg';
    if (page.includes('story') || page.includes('stories')) return '/images/indian_fitness/banner_community_panoramic.jpg';
    return '/images/indian_fitness/banner_hero_panoramic.jpg';
  }

  // Coaches
  if (filename.includes('Appie-Kooistra')) return '/images/indian_fitness/coach_vikram_strength.jpg';
  if (filename.includes('Thomas-Kramer')) return '/images/indian_fitness/coach_rahul_performance.jpg';
  if (filename.includes('AronWeidenaar_LR-8501')) return '/images/indian_fitness/coach_rohan_functional.jpg';
  if (filename.includes('GO180-72')) return '/images/indian_fitness/coach_priya_nutrition.jpg';
  if (filename.includes('GO180-112')) return '/images/indian_fitness/coach_amit_transformation.jpg';
  if (filename.includes('GO180-126')) return '/images/indian_fitness/coach_ananya_personal_trainer.jpg';

  // Club Thatipur
  if (page.includes('club-leeuwarden')) {
    if (filename.includes('790x860') || filename.includes('760x990')) {
      return '/images/indian_fitness/facility_racks_and_barbells.jpg';
    }
    return '/images/indian_fitness/thatipur_interior_verified_1.jpg';
  }

  // Programs
  if (page.includes('hyrox')) return '/images/indian_fitness/program_card_battle_ropes.jpg';
  if (page.includes('essentials')) return '/images/indian_fitness/program_card_dumbbell_curl.jpg';
  if (page.includes('fundamentals')) return '/images/indian_fitness/program_card_cable_training.jpg';
  if (page.includes('adaptable')) return '/images/indian_fitness/program_card_coaching_guidance.jpg';
  if (page.includes('digital-coaching')) return '/images/indian_fitness/program_card_hydration_male.jpg';
  if (page.includes('go2day') || page.includes('go2gether')) return '/images/indian_fitness/program_card_kettlebell_female.jpg';
  if (page.includes('healthy-ageing')) return '/images/indian_fitness/program_card_community_celebration.jpg';

  // Stories
  if (page.includes('glute')) return '/images/indian_fitness/program_card_kettlebell_female.jpg';
  if (page.includes('blijf-je-gezond') || page.includes('drukke-baan')) return '/images/indian_fitness/program_card_hydration_male.jpg';
  if (page.includes('teambuilding')) return '/images/indian_fitness/program_card_community_celebration.jpg';
  if (page.includes('story-') || page.includes('stories')) return '/images/indian_fitness/stories_slide5_indian_gym.jpg';

  // General cards
  if (filename.includes('790x860') || filename.includes('760x990')) {
    return '/images/indian_fitness/program_card_coaching_guidance.jpg';
  }

  return '/images/indian_fitness/hero_slide1_indian_gym.jpg';
}

let grandTotal = 0;

for (const page of pages) {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match any URL or path or escaped JSON path containing GO180, AronWeidenaar, Appie, Thomas-Kramer
  const pattern = /(?:https?:\\\/\\\/[^"'\s]*|https?:\/\/[^"'\s]*|\/images\/|\/app\/uploads\/[^\s"']*\/|[\w\-\.]*\/)*(?:GO180|AronWeidenaar|Appie-Kooistra|Thomas-Kramer)[\w\-\.]*\.(?:jpg|jpeg|png|webp)/gi;

  let replacedCount = 0;
  content = content.replace(pattern, (match) => {
    replacedCount++;
    return getReplacement(match, page);
  });

  // Also clean up any lingering data-smush-webp-fallback that points to old Dutch assets
  content = content.replace(/data-smush-webp-fallback="\{&quot;data-src&quot;:&quot;[^&]*&quot;\}"/g, '');

  if (replacedCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    grandTotal += replacedCount;
    console.log(`[${page}] Replaced ${replacedCount} references`);
  }
}

console.log(`\nDONE: Replaced a grand total of ${grandTotal} references.`);
