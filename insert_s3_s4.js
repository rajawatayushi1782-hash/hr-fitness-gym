const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const filePath = 'public/pages/programs-adaptable.html';
let content = fs.readFileSync(filePath, 'utf8');

const s2End = content.indexOf('data-slide-index="2" class="dragSlider__slide');
const s2DivEnd = content.indexOf('</div>\r\n\t\t\t</div>', s2End);
const s2DivEndLF = content.indexOf('</div>\n\t\t\t</div>', s2End);
const realS2End = (s2DivEnd !== -1 ? s2DivEnd : s2DivEndLF) + (s2DivEnd !== -1 ? 16 : 14);

const s5 = content.indexOf('data-slide-index="5" class="dragSlider__slide', realS2End);

const slide3And4 = `
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

content = content.substring(0, realS2End) + slide3And4 + content.substring(s5);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Inserted slide 3 and 4 properly!');
