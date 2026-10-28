const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const filePath = 'public/pages/programs-adaptable.html';
let content = fs.readFileSync(filePath, 'utf8');

const sIdx = content.indexOf('<div class="slide__txtHolder -first">');
const vIdx = content.indexOf('<div class="dragSlider__viewer"');

const cleanSection = `<div class="slide__txtHolder -first">
					<h1 class="slide__title slide__titleAnimation h1">Adaptable</h1>	
							<div class="slide__textWrapper"><p class="slide__text slide__textAnimation">Tailored corporate wellness and team fitness programs for businesses and organizations in Thatipur, Gwalior.</p></div>
						
							</div>
			<div class="slide__shadow -first"></div>
				<div class="arrowScroll circle -outline -svg">
				
			<svg class="js-arrowScroll arrowScroll__arrow" width="8" height="29" viewBox="0 0 8 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64645 28.3536C3.84171 28.5488 4.15829 28.5488 4.35355 28.3536L7.53553 25.1716C7.7308 24.9763 7.7308 24.6597 7.53553 24.4645C7.34027 24.2692 7.02369 24.2692 6.82843 24.4645L4 27.2929L1.17157 24.4645C0.97631 24.2692 0.659727 24.2692 0.464465 24.4645C0.269203 24.6597 0.269203 24.9763 0.464465 25.1716L3.64645 28.3536ZM3.5 -2.18557e-08L3.5 28L4.5 28L4.5 2.18557e-08L3.5 -2.18557e-08Z" fill="#E9E9E9"></path></svg><svg class="js-arrowScroll arrowScroll__circle arrowScroll__circle--first" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="39.5" transform="rotate(90 40 40)" stroke="#E9E9E9"></circle></svg>
			<svg class="js-arrowScroll arrowScroll__circle arrowScroll__circle--second" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="39.5" transform="rotate(90 40 40)" stroke="#E9E9E9"></circle></svg>
		</div>
	</div><div data-scroll-section="" class="video" data-scroll-section-id="section2">
		<div class="video__title holder spacer-s">
			<h2 class="h2">Corporate Wellness &amp; Team Fitness in Thatipur, Gwalior</h2>
		</div>
		<div class="video__text spacer-t flex">
		<div class="video__textColumn">
			<p><span style="font-weight: 400;">Adaptable is a tailored corporate wellness and team fitness program for businesses in Gwalior. Workplace health is not one-size-fits-all, as every organization faces distinct demands. We help employees build physical resilience, improve posture, reduce stress, and sustain daily productivity.</span></p>
		</div>
		<div class="video__textColumn">
			<p><span style="font-weight: 400;">Our certified coaches conduct interactive wellness workshops, mobility sessions, and group workouts. Corporate fitness plans are custom-quoted in Indian Rupees (INR / ₹) based on team size and objectives. Contact HR Fitness Club to discuss corporate wellness partnerships.</span></p>
		</div>
	</div>
	
</div>			<div data-scroll-section="" class="dragSlider spacer-v" data-scroll-section-id="section3" style="opacity: 0; pointer-events: none; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);">
	<div class="spacer-h">
		<h2 class="h1 center titleMb splitText" data-scroll-offset="20%" id="animateTitle_3" data-scroll-call="animateTitle, #animateTitle_3" data-scroll="">Our Approach &amp; Method</h2>
		<div class="dragSlider__nav flex-c">
										
				<div data-slide-index="0" class="dragSlider__navPoint dragSlider__navPointFirst">
					
					<div class="dragSlider__navPointInner"></div>
				</div>	
							
				<div data-slide-index="1" class="dragSlider__navPoint -next">
					
					<div class="dragSlider__navPointInner"></div>
				</div>	
							
				<div data-slide-index="2" class="dragSlider__navPoint ">
					
					<div class="dragSlider__navPointInner"></div>
				</div>	
							
				<div data-slide-index="3" class="dragSlider__navPoint ">
					
					<div class="dragSlider__navPointInner"></div>
				</div>	
							
				<div data-slide-index="4" class="dragSlider__navPoint ">
					
					<div class="dragSlider__navPointInner"></div>
				</div>	
							
				<div data-slide-index="5" class="dragSlider__navPoint ">
					
					<div class="dragSlider__navPointInner"></div>
				</div>	
						<div class="dragSlider__navActive circle -outline">
									
																					<img data-slide-index="2" class="dragSlider__navSVG lazyloaded" data-src="/images/voeding.svg" src="/images/voeding.svg" style="touch-action: pan-y;">
										
																				
																				
																				
																					<img data-slide-index="5" class="dragSlider__navSVG lazyloaded" data-src="/images/coaching.svg" src="/images/coaching.svg" style="touch-action: pan-y;">
										
																						</div>	
		</div>
	</div>
		`;

content = content.substring(0, sIdx) + cleanSection + content.substring(vIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Restored adaptable clean section successfully!');
