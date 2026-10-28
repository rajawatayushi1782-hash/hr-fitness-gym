const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'pages', 'programs-adaptable.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the broken slice between slide 1 and slide 5
const slide1End = content.indexOf('<div data-slide-index="2"');
const slide5Start = content.indexOf('<div data-slide-index="5"');

if (slide1End !== -1 && slide5Start !== -1) {
  const replacement = `<div data-slide-index="2" class="dragSlider__slide spacer-h ">
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

  content = content.substring(0, slide1End) + replacement + content.substring(slide5Start);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully restored slides 2, 3, and 4 in programs-adaptable.html');
} else {
  console.error('Could not find slide markers!');
}
