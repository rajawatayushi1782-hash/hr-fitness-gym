const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const filePath = 'public/pages/programs-adaptable.html';
let content = fs.readFileSync(filePath, 'utf8');

// Remove the wrongly inserted block near the top
const wrongStart = content.indexOf('<div data-slide-index="2" class="dragSlider__slide spacer-h ">\r\n\t\t\t\t<div class="imageText flex-s">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="imageText__imgholder">\r\n\t\t\t\t\t\t\t<img alt="GO180 receptenboek HR23"');
const wrongStartLF = content.indexOf('<div data-slide-index="2" class="dragSlider__slide spacer-h ">\n\t\t\t\t<div class="imageText flex-s">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="imageText__imgholder">\n\t\t\t\t\t\t\t<img alt="GO180 receptenboek HR23"');
const start = wrongStart !== -1 ? wrongStart : wrongStartLF;

// Find where it ends
const wrongEnd = content.indexOf('<img data-slide-index="2"', start);

if (start !== -1 && wrongEnd !== -1) {
  content = content.substring(0, start) + content.substring(wrongEnd);
  console.log('Removed top mistaken insertion');
}

// Now find where slide index 2 is in the actual slider container (after data-slide-index="1")
const s1 = content.indexOf('<div data-slide-index="1"');
const s1End = content.indexOf('</div>\r\n\t\t\t</div>', s1);
const s1EndLF = content.indexOf('</div>\n\t\t\t</div>', s1);
const realS1End = (s1End !== -1 ? s1End : s1EndLF) + (s1End !== -1 ? 16 : 14);

const s5 = content.indexOf('<div data-slide-index="5"', realS1End);

if (realS1End !== -1 && s5 !== -1) {
  const slidesContent = `
					<div data-slide-index="2" class="dragSlider__slide spacer-h ">
				<div class="imageText flex-s">
																																				<div class="imageText__imgholder">
							<img alt="GO180 receptenboek HR23" class="imageText__img -full lazyloaded" data-src="/images/GO180-receptenboek-HR23.jpg.webp" src="/images/GO180-receptenboek-HR23.jpg.webp" style="--smush-placeholder-width: 790px; --smush-placeholder-aspect-ratio: 790/860;" data-smush-webp-fallback="{&quot;data-src&quot;:&quot;https:\/\/go180.nl\/app\/uploads\/2021\/06\/GO180-receptenboek-HR23.jpg&quot;}">
						</div>
										<div class="imageText__txt">
						<h2>Nutrition Guidance &amp; Support</h2>
						<p><span style="font-weight: 400;">A healthy, goal-oriented diet is essential for achieving lasting results. We provide practical dietary advice and sustainable meal planning tailored to energy levels, workout intensity, and body composition.</span></p>
											</div>
									</div>
			</div>
					<div data-slide-index="3" class="dragSlider__slide spacer-h ">
				<div class="imageText flex-s">
																																				<div class="imageText__imgholder">
							<img alt="Fit na zwangerschap" class="imageText__img -full lazyloaded" data-src="/images/GO180-32-790x860.jpg.webp" src="/images/GO180-32-790x860.jpg.webp" style="--smush-placeholder-width: 790px; --smush-placeholder-aspect-ratio: 790/860;" data-smush-webp-fallback="{&quot;data-src&quot;:&quot;https:\/\/go180.nl\/app\/uploads\/2023\/06\/GO180-32-790x860.jpg&quot;}">
						</div>
										<div class="imageText__txt">
						<h2>Training Guide &amp; Workout Log</h2>
						<p><span style="font-weight: 400;">Every participant receives structured fitness guidelines and a tracking workbook. Through guided exercises and consistent progress tracking, members build sustainable training habits and athletic confidence.</span></p>
											</div>
									</div>
			</div>
					<div data-slide-index="4" class="dragSlider__slide spacer-h ">
				<div class="imageText flex-s">
																																				<div class="imageText__imgholder">
							<img alt="GO180 105" class="imageText__img -full lazyloaded" data-src="/images/GO180-105-790x860.jpg.webp" src="/images/GO180-105-790x860.jpg.webp" style="--smush-placeholder-width: 790px; --smush-placeholder-aspect-ratio: 790/860;" data-smush-webp-fallback="{&quot;data-src&quot;:&quot;https:\/\/go180.nl\/app\/uploads\/2023\/06\/GO180-105-790x860.jpg&quot;}">
						</div>
										<div class="imageText__txt">
						<h2>Continuous Progress Monitoring</h2>
						<p><span style="font-weight: 400;">We leave nothing to chance. Our trainers regularly evaluate workout execution, track strength improvements, and make proactive adjustments to keep everyone progressing toward their health and fitness goals.</span></p>
											</div>
									</div>
			</div>
					`;

  content = content.substring(0, realS1End) + slidesContent + content.substring(s5);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed adaptable slides placement!');
}
