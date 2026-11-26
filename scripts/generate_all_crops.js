const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('public/images/indian_fitness');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Plan of all required variations and crops
const cropJobs = [
  // --- HOMEPAGE HERO & SLIDES ---
  {
    name: 'hero_slide1_indian_gym.jpg',
    src: 'public/images/indian_fitness/hero_indian_gym_main.jpg',
    w: 1376, h: 768, crop: { sx: 0, sy: 0, sw: 1376, sh: 768 }
  },
  {
    name: 'programs_slide2_indian_gym.jpg',
    src: 'public/images/indian_fitness/indian_fitness_programs_overview.jpg',
    w: 1376, h: 768, crop: { sx: 0, sy: 0, sw: 1376, sh: 768 }
  },
  {
    name: 'coaches_slide3_indian_gym.jpg',
    src: 'public/images/indian_fitness/indian_coaches_trainers_group.jpg',
    w: 1376, h: 768, crop: { sx: 0, sy: 0, sw: 1376, sh: 768 }
  },
  {
    name: 'our_club_slide4_indian_gym.jpg',
    src: 'public/images/indian_fitness/indian_gym_interior_thatipur.jpg',
    w: 1376, h: 768, crop: { sx: 0, sy: 0, sw: 1376, sh: 768 }
  },
  {
    name: 'stories_slide5_indian_gym.jpg',
    src: 'public/images/indian_fitness/indian_fitness_real_results.jpg',
    w: 1376, h: 768, crop: { sx: 0, sy: 0, sw: 1376, sh: 768 }
  },
  {
    name: 'join_now_slide6_indian_gym.jpg',
    src: 'public/images/indian_fitness/indian_gym_community_welcome.jpg',
    w: 1376, h: 768, crop: { sx: 0, sy: 0, sw: 1376, sh: 768 }
  },

  // --- COACHES (Portraits for Coaches Grid & Coach Profiles) ---
  // Coach 1 (Head Strength - Male, Vikram)
  {
    name: 'coach_vikram_strength.jpg',
    src: 'public/images/indian_fitness/indian_coaches_trainers_group.jpg',
    w: 760, h: 990, crop: { sx: 100, sy: 20, sw: 560, sh: 730 }
  },
  // Coach 2 (Lifestyle & Nutrition - Female, Priya)
  {
    name: 'coach_priya_nutrition.jpg',
    src: 'public/images/indian_fitness/indian_coaches_trainers_group.jpg',
    w: 760, h: 990, crop: { sx: 720, sy: 20, sw: 560, sh: 730 }
  },
  // Coach 3 (Personal Trainer Female, Ananya)
  {
    name: 'coach_ananya_personal_trainer.jpg',
    src: 'public/images/indian_fitness/test_female_trainer.jpg',
    w: 760, h: 990, crop: { sx: 120, sy: 30, sw: 560, sh: 730 }
  },
  // Coach 4 (Functional & Athletic Coach, Rohan)
  {
    name: 'coach_rohan_functional.jpg',
    src: 'gym website (1)/gym website/ai-created-images/ai-generated/ai_coach_portrait_trainer.jpg',
    w: 760, h: 990, crop: { sx: 60, sy: 40, sw: 780, sh: 1020 }
  },
  // Coach 5 (Strength & Conditioning Transformation, Amit)
  {
    name: 'coach_amit_transformation.jpg',
    src: 'public/images/indian_fitness/indian_fitness_real_results.jpg',
    w: 760, h: 990, crop: { sx: 380, sy: 30, sw: 580, sh: 738 }
  },
  // Coach 6 (High-Performance Movement Coach, Rahul)
  {
    name: 'coach_rahul_performance.jpg',
    src: 'public/images/indian_fitness/hero_indian_gym_main.jpg',
    w: 760, h: 990, crop: { sx: 750, sy: 30, sw: 550, sh: 720 }
  },

  // --- PROGRAM & WORKOUT FEATURE CARDS (790x860 & 760x990) ---
  {
    name: 'program_card_kettlebell_female.jpg',
    src: 'public/images/indian_fitness/indian_fitness_programs_overview.jpg',
    w: 790, h: 860, crop: { sx: 80, sy: 20, sw: 620, sh: 680 }
  },
  {
    name: 'program_card_hydration_male.jpg',
    src: 'public/images/indian_fitness/indian_fitness_programs_overview.jpg',
    w: 790, h: 860, crop: { sx: 680, sy: 30, sw: 620, sh: 680 }
  },
  {
    name: 'program_card_cable_training.jpg',
    src: 'public/images/indian_fitness/hero_indian_gym_main.jpg',
    w: 790, h: 860, crop: { sx: 600, sy: 40, sw: 650, sh: 710 }
  },
  {
    name: 'program_card_dumbbell_curl.jpg',
    src: 'public/images/indian_fitness/hero_indian_gym_main.jpg',
    w: 790, h: 860, crop: { sx: 80, sy: 40, sw: 620, sh: 680 }
  },
  {
    name: 'program_card_battle_ropes.jpg',
    src: 'gym website (1)/gym website/ai-created-images/ai-generated/ai_gym_workout_battle_ropes.jpg',
    w: 790, h: 860, crop: { sx: 100, sy: 50, sw: 950, sh: 800 }
  },
  {
    name: 'program_card_coaching_guidance.jpg',
    src: 'public/images/indian_fitness/test_female_trainer.jpg',
    w: 790, h: 860, crop: { sx: 350, sy: 30, sw: 680, sh: 730 }
  },
  {
    name: 'program_card_community_celebration.jpg',
    src: 'public/images/indian_fitness/indian_gym_community_welcome.jpg',
    w: 790, h: 860, crop: { sx: 250, sy: 30, sw: 700, sh: 720 }
  },

  // --- CLUB FACILITY CARDS & GALLERIES ---
  {
    name: 'facility_racks_and_barbells.jpg',
    src: 'public/images/indian_fitness/indian_gym_interior_thatipur.jpg',
    w: 790, h: 860, crop: { sx: 50, sy: 40, sw: 650, sh: 700 }
  },
  {
    name: 'facility_dumbbells_mirrors.jpg',
    src: 'public/images/indian_fitness/indian_gym_interior_thatipur.jpg',
    w: 790, h: 860, crop: { sx: 680, sy: 40, sw: 650, sh: 700 }
  },
  {
    name: 'thatipur_interior_verified_1.jpg',
    src: 'public/images/verified_business/jd_hr_fitness_interior_1.jpg',
    w: 1200, h: 800, crop: { sx: 0, sy: 100, sw: 1728, sh: 1150 }
  },
  {
    name: 'thatipur_interior_verified_2.jpg',
    src: 'public/images/verified_business/jd_hr_fitness_interior_2.jpg',
    w: 1200, h: 800, crop: { sx: 0, sy: 100, sw: 1728, sh: 1150 }
  },
  {
    name: 'thatipur_interior_verified_3.jpg',
    src: 'public/images/verified_business/jd_hr_fitness_interior_3.jpg',
    w: 1200, h: 800, crop: { sx: 0, sy: 100, sw: 1728, sh: 1150 }
  },
  {
    name: 'thatipur_facade_verified.jpg',
    src: 'public/images/verified_business/jd_hr_fitness_facade.jpg',
    w: 1200, h: 800, crop: { sx: 0, sy: 100, sw: 1728, sh: 1150 }
  },

  // --- WIDE PANORAMIC CHAPTER BANNERS (1920x648 / ~3:1 ratio) ---
  {
    name: 'banner_hero_panoramic.jpg',
    src: 'public/images/indian_fitness/hero_indian_gym_main.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 120, sw: 1376, sh: 464 }
  },
  {
    name: 'banner_facility_panoramic.jpg',
    src: 'public/images/indian_fitness/indian_gym_interior_thatipur.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 150, sw: 1376, sh: 464 }
  },
  {
    name: 'banner_programs_panoramic.jpg',
    src: 'public/images/indian_fitness/indian_fitness_programs_overview.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 120, sw: 1376, sh: 464 }
  },
  {
    name: 'banner_coaches_panoramic.jpg',
    src: 'public/images/indian_fitness/indian_coaches_trainers_group.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 120, sw: 1376, sh: 464 }
  },
  {
    name: 'banner_community_panoramic.jpg',
    src: 'public/images/indian_fitness/indian_gym_community_welcome.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 120, sw: 1376, sh: 464 }
  },
  {
    name: 'banner_luxury_panoramic.jpg',
    src: 'gym website (1)/gym website/ai-created-images/ai-generated/ai_gym_hero_modern_luxury.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 150, sw: 1376, sh: 464 }
  },
  {
    name: 'banner_real_thatipur_panoramic.jpg',
    src: 'public/images/verified_business/jd_hr_fitness_interior_1.jpg',
    w: 1920, h: 648, crop: { sx: 0, sy: 350, sw: 1728, sh: 583 }
  }
];

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(`Processing ${cropJobs.length} image crop and optimization tasks...`);

  for (const job of cropJobs) {
    const srcPath = path.resolve(job.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source missing: ${job.src}`);
      continue;
    }
    const base64 = fs.readFileSync(srcPath).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const croppedBase64 = await page.evaluate(async ({ url, job }) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = job.w;
          canvas.height = job.h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          const c = job.crop;
          ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, job.w, job.h);
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        };
        img.src = url;
      });
    }, { url: dataUrl, job });

    const raw = croppedBase64.replace(/^data:image\/jpeg;base64,/, '');
    const outPath = path.join(targetDir, job.name);
    fs.writeFileSync(outPath, raw, 'base64');
    console.log(`[DONE] ${job.name} (${job.w}x${job.h}) -> Size: ${fs.statSync(outPath).size} bytes`);
  }

  await browser.close();
  console.log('All image variations generated and saved successfully!');
}

run().catch(console.error);
