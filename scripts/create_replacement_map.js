const fs = require('fs');

const data = JSON.parse(fs.readFileSync('detailed_image_slots.json', 'utf8'));

// Build replacement mapping
const replacements = {};

for (const item of data.uniqueImages) {
  const s = item.src;
  const pList = item.pages.join(' ');
  const alts = item.alts.join(' ');
  const headings = item.headings.join(' ');

  let newSrc = '/images/indian_fitness/hero_slide1_indian_gym.jpg';

  // 1. Homepage slides
  if (s.includes('GO180-81-scaled')) {
    newSrc = '/images/indian_fitness/hero_slide1_indian_gym.jpg';
  } else if (s.includes('GO180-46-scaled')) {
    newSrc = '/images/indian_fitness/programs_slide2_indian_gym.jpg';
  } else if (s.includes('GO180-7-scaled')) {
    newSrc = '/images/indian_fitness/coaches_slide3_indian_gym.jpg';
  } else if (s.includes('GO180-scaled-e1695809865642')) {
    newSrc = '/images/indian_fitness/our_club_slide4_indian_gym.jpg';
  } else if (s.includes('GO180-150-scaled')) {
    newSrc = '/images/indian_fitness/stories_slide5_indian_gym.jpg';
  } else if (s.includes('GO180-86-scaled')) {
    newSrc = '/images/indian_fitness/join_now_slide6_indian_gym.jpg';
  }

  // 2. Wide Banners (1920x648, 1800x648)
  else if (s.includes('1920x648') || s.includes('1800x648')) {
    if (pList.includes('coach') || headings.includes('Coach')) {
      newSrc = '/images/indian_fitness/banner_coaches_panoramic.jpg';
    } else if (pList.includes('program') || headings.includes('Program')) {
      newSrc = '/images/indian_fitness/banner_programs_panoramic.jpg';
    } else if (pList.includes('club') || pList.includes('contact')) {
      newSrc = '/images/indian_fitness/banner_facility_panoramic.jpg';
    } else if (pList.includes('join') || pList.includes('trial') || pList.includes('pricing')) {
      newSrc = '/images/indian_fitness/banner_community_panoramic.jpg';
    } else {
      newSrc = '/images/indian_fitness/banner_hero_panoramic.jpg';
    }
  }

  // 3. Coaches & Trainer Portraits (Coaches page, Coach detail pages)
  else if (s.includes('Appie-Kooistra')) {
    newSrc = '/images/indian_fitness/coach_vikram_strength.jpg';
  } else if (s.includes('Thomas-Kramer')) {
    newSrc = '/images/indian_fitness/coach_rahul_performance.jpg';
  } else if (s.includes('AronWeidenaar_LR-8501')) {
    newSrc = '/images/indian_fitness/coach_rohan_functional.jpg';
  } else if (s.includes('GO180-72-scaled') || s.includes('GO180-72-760x990')) {
    newSrc = '/images/indian_fitness/coach_priya_nutrition.jpg';
  } else if (s.includes('GO180-112-scaled') || s.includes('GO180-112-760x990')) {
    newSrc = '/images/indian_fitness/coach_amit_transformation.jpg';
  } else if (s.includes('GO180-126-scaled') || s.includes('GO180-126-760x990')) {
    newSrc = '/images/indian_fitness/coach_ananya_personal_trainer.jpg';
  }

  // 4. Thatipur Club facilities
  else if (pList.includes('club-leeuwarden.html') || headings.includes('Thatipur') || headings.includes('Club')) {
    if (s.includes('verified')) {
      newSrc = s; // Keep verified Thatipur photos
    } else if (s.includes('790x860') || s.includes('760x990')) {
      newSrc = '/images/indian_fitness/facility_racks_and_barbells.jpg';
    } else {
      newSrc = '/images/indian_fitness/thatipur_interior_verified_1.jpg';
    }
  }

  // 5. Programs and Workouts
  else if (pList.includes('programs-hyrox')) {
    newSrc = '/images/indian_fitness/program_card_battle_ropes.jpg';
  } else if (pList.includes('programs-essentials')) {
    newSrc = '/images/indian_fitness/program_card_dumbbell_curl.jpg';
  } else if (pList.includes('programs-fundamentals')) {
    newSrc = '/images/indian_fitness/program_card_cable_training.jpg';
  } else if (pList.includes('programs-adaptable')) {
    newSrc = '/images/indian_fitness/program_card_coaching_guidance.jpg';
  } else if (pList.includes('programs-digital-coaching')) {
    newSrc = '/images/indian_fitness/program_card_hydration_male.jpg';
  } else if (pList.includes('programs-go2day') || pList.includes('programs-go2gether')) {
    newSrc = '/images/indian_fitness/program_card_kettlebell_female.jpg';
  } else if (pList.includes('programs-healthy-ageing')) {
    newSrc = '/images/indian_fitness/program_card_community_celebration.jpg';
  }

  // 6. Stories & Results
  else if (pList.includes('story-') || pList.includes('stories.html')) {
    if (s.includes('glute')) {
      newSrc = '/images/indian_fitness/program_card_kettlebell_female.jpg';
    } else if (s.includes('blijf-je-gezond') || s.includes('drukke-baan')) {
      newSrc = '/images/indian_fitness/program_card_hydration_male.jpg';
    } else if (s.includes('teambuilding')) {
      newSrc = '/images/indian_fitness/program_card_community_celebration.jpg';
    } else {
      newSrc = '/images/indian_fitness/stories_slide5_indian_gym.jpg';
    }
  }

  // 7. General feature cards (790x860, 760x990, etc.)
  else if (s.includes('790x860') || s.includes('760x990')) {
    newSrc = '/images/indian_fitness/program_card_coaching_guidance.jpg';
  } else {
    newSrc = '/images/indian_fitness/hero_slide1_indian_gym.jpg';
  }

  replacements[s] = newSrc;
}

fs.writeFileSync('image_replacement_map.json', JSON.stringify(replacements, null, 2));
console.log(`Generated replacements for ${Object.keys(replacements).length} image paths.`);
