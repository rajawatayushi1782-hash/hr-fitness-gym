const fs = require('fs');
const vm = require('vm');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'js', 'original_main.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Expose window.locomotive
const targetLoco = 'var t=new n.a({el:document.querySelector("#js-scroll"),smooth:!0,smartphone:{smooth:!1},tablet:{smooth:!1},repeat:!0,getSpeed:!0,reloadOnContextChange:!0}),i=1,r=!1;';
const replaceLoco = 'var t=new n.a({el:document.querySelector("#js-scroll"),smooth:!0,smartphone:{smooth:!1},tablet:{smooth:!1},repeat:!0,getSpeed:!0,reloadOnContextChange:!0}),i=1,r=!1;window.locomotive=t;window.locomotiveScroll=t;';

if (!code.includes(targetLoco)) {
  console.error('ERROR: targetLoco not found in code!');
  process.exit(1);
}
code = code.replace(targetLoco, replaceLoco);
console.log('Replaced Locomotive target.');

// 2. Improve Slick Carousel initialization
const targetSlick = 'e(".carousel__holder").slick({infinite:!0,variableWidth:!0,centerMode:!0,dots:!0,controls:!0,appendArrows:e(".carousel__nav"),appendDots:e(".carousel__nav"),easing:"easeOutElastic",nextArrow:\'<div class="carousel__next"><svg width="29" height="8" viewBox="0 0 29 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.3536 4.35355C28.5488 4.15829 28.5488 3.84171 28.3536 3.64645L25.1716 0.464466C24.9763 0.269204 24.6597 0.269204 24.4645 0.464466C24.2692 0.659728 24.2692 0.976311 24.4645 1.17157L27.2929 4L24.4645 6.82843C24.2692 7.02369 24.2692 7.34027 24.4645 7.53553C24.6597 7.7308 24.9763 7.7308 25.1716 7.53553L28.3536 4.35355ZM0 4.5L28 4.5V3.5L0 3.5L0 4.5Z" fill="#E9E9E9"/></svg></div>\',prevArrow:\'<div class="carousel__prev"><svg width="29" height="8" viewBox="0 0 29 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82842L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659726 4.53553 0.464464C4.34027 0.269202 4.02369 0.269202 3.82843 0.464464L0.646446 3.64644ZM29 3.5L1 3.5L1 4.5L29 4.5L29 3.5Z" fill="#E9E9E9"/></svg></div>\',responsive:[{breakpoint:767,settings:{centerMode:!1}}]})';

const replaceSlick = 'e(".carousel__holder").each(function(){var c=e(this);if(c.hasClass("slick-initialized"))return;var v=c.closest(".carousel").find(".carousel__nav");v.length||(v=c.siblings(".carousel__nav")),v.length||(v=e(\'<div class="carousel__nav flex-jc"></div>\').insertAfter(c)),c.slick({infinite:!0,variableWidth:!0,centerMode:!0,dots:!0,draggable:!0,swipe:!0,touchMove:!0,controls:!0,appendArrows:v,appendDots:v,easing:"easeOutElastic",nextArrow:\'<div class="carousel__next slick-arrow" role="button" aria-label="Next slide"><svg width="29" height="8" viewBox="0 0 29 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.3536 4.35355C28.5488 4.15829 28.5488 3.84171 28.3536 3.64645L25.1716 0.464466C24.9763 0.269204 24.6597 0.269204 24.4645 0.464466C24.2692 0.659728 24.2692 0.976311 24.4645 1.17157L27.2929 4L24.4645 6.82843C24.2692 7.02369 24.2692 7.34027 24.4645 7.53553C24.6597 7.7308 24.9763 7.7308 25.1716 7.53553L28.3536 4.35355ZM0 4.5L28 4.5V3.5L0 3.5L0 4.5Z" fill="#E9E9E9"/></svg></div>\',prevArrow:\'<div class="carousel__prev slick-arrow" role="button" aria-label="Previous slide"><svg width="29" height="8" viewBox="0 0 29 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.646446 3.64644C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82842L1.70711 4L4.53553 1.17157C4.7308 0.976309 4.7308 0.659726 4.53553 0.464464C4.34027 0.269202 4.02369 0.269202 3.82843 0.464464L0.646446 3.64644ZM29 3.5L1 3.5L1 4.5L29 4.5L29 3.5Z" fill="#E9E9E9"/></svg></div>\',responsive:[{breakpoint:767,settings:{centerMode:!1}}]});c.on("afterChange",function(){t&&t.update&&t.update()})})';

if (!code.includes(targetSlick)) {
  console.error('ERROR: targetSlick not found in code!');
  process.exit(1);
}
code = code.replace(targetSlick, replaceSlick);
console.log('Replaced Slick target.');

// 3. Add DragSlider card dragging and Reviews Swiper
const targetDragPointClick = 'p(e(this).data("slide-index"))}));';

const extraDragLogic = 'p(e(this).data("slide-index"))}));function goToDragSlide(targetIdx){var total=e(".dragSlider__slide").length;if(!total)return;targetIdx<0&&(targetIdx=0),targetIdx>=total&&(targetIdx=total-1);if(targetIdx===h)return;var pt=e(".dragSlider__navPoint[data-slide-index=\'"+targetIdx+"\']");if(pt.length&&e(".dragSlider__navPointFirst").length){var firstLeft=e(".dragSlider__navPointFirst").offset().left,targetX=pt.offset().left+pt.width()/2-firstLeft-e(".dragSlider__navPoint").width()/2;tr.to(e(".dragSlider__navActive"),.8,{x:targetX,y:0,ease:Ii.easeOut}),e(".dragSlider__navPoint").removeClass("-next"),targetIdx+1<total&&e(".dragSlider__navPoint[data-slide-index=\'"+(targetIdx+1)+"\']").addClass("-next")}p(targetIdx);t&&t.update&&t.update()}(function(){var startX=0,startY=0,currentX=0,currentY=0,isDragging=false,hasMoved=false;e("body").on("pointerdown touchstart",".dragSlider__viewer",function(evt){var pt=evt.touches?evt.touches[0]:evt;startX=pt.clientX,startY=pt.clientY,currentX=startX,currentY=startY,isDragging=true,hasMoved=false});e("body").on("pointermove touchmove",".dragSlider__viewer",function(evt){if(!isDragging)return;var pt=evt.touches?evt.touches[0]:evt;currentX=pt.clientX,currentY=pt.clientY;var dx=currentX-startX,dy=currentY-startY;if(Math.abs(dx)>10){hasMoved=true;if(Math.abs(dx)>Math.abs(dy)&&evt.cancelable){evt.preventDefault()}}});e("body").on("pointerup touchend pointercancel",".dragSlider__viewer",function(evt){if(!isDragging)return;isDragging=false;var dx=currentX-startX,dy=currentY-startY;if(hasMoved&&Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){dx<0?goToDragSlide(h+1):goToDragSlide(h-1)}setTimeout(function(){hasMoved=false},120)});e("body").on("click",".dragSlider__viewer a",function(evt){if(hasMoved){evt.preventDefault();evt.stopImmediatePropagation();return false}});e(document).on("keydown",function(evt){if(e(".dragSlider").length&&e(".dragSlider").is(":visible")){if(evt.keyCode===37){goToDragSlide(h-1)}else if(evt.keyCode===39){goToDragSlide(h+1)}}})})();function initReviewsSwiper(){var $swiper=e(".swiper");if(!$swiper.length)return;var $wrapper=$swiper.find(".swiper-wrapper"),$slides=$wrapper.find(".swiper-slide");if(!$slides.length)return;var currentIdx=0,slideStride=325;function updateSwiper(){var containerWidth=$swiper.width()||window.innerWidth,visibleCards=Math.max(1,Math.floor(containerWidth/slideStride)),maxIdx=Math.max(0,$slides.length-visibleCards);currentIdx>maxIdx&&(currentIdx=maxIdx),currentIdx<0&&(currentIdx=0);var translateX=-(currentIdx*slideStride);$wrapper.css({"transform":"translate3d("+translateX+"px, 0px, 0px)","transition":"transform 0.4s ease-out"});$slides.each(function(i){var $s=e(this);$s.removeClass("swiper-slide-active swiper-slide-next swiper-slide-visible");i===currentIdx&&$s.addClass("swiper-slide-active");i===currentIdx+1&&$s.addClass("swiper-slide-next");i>=currentIdx&&i<currentIdx+visibleCards&&$s.addClass("swiper-slide-visible")});var $prev=e(".es-carousel-arrow-control-container-previous"),$next=e(".es-carousel-arrow-control-container-next");currentIdx<=0?$prev.attr("aria-disabled","true").css("opacity","0.4"):$prev.attr("aria-disabled","false").css("opacity","1");currentIdx>=maxIdx?$next.attr("aria-disabled","true").css("opacity","0.4"):$next.attr("aria-disabled","false").css("opacity","1")}e("body").on("click",".es-carousel-arrow-control-left",function(evt){evt.preventDefault(),evt.stopPropagation();if(currentIdx>0){currentIdx--;updateSwiper()}});e("body").on("click",".es-carousel-arrow-control-right",function(evt){evt.preventDefault(),evt.stopPropagation();var containerWidth=$swiper.width()||window.innerWidth,visibleCards=Math.max(1,Math.floor(containerWidth/slideStride)),maxIdx=Math.max(0,$slides.length-visibleCards);if(currentIdx<maxIdx){currentIdx++;updateSwiper()}});var startX=0,currentX=0,isDragging=false,dragMoved=false,startTranslate=0;$swiper.on("pointerdown touchstart",function(evt){var pt=evt.touches?evt.touches[0]:evt;startX=pt.clientX,currentX=startX,isDragging=true,dragMoved=false,startTranslate=-(currentIdx*slideStride),$wrapper.css("transition","none")});e(window).on("pointermove touchmove",function(evt){if(!isDragging)return;var pt=evt.touches?evt.touches[0]:evt;currentX=pt.clientX;var dx=currentX-startX;if(Math.abs(dx)>10){dragMoved=true;var curTrans=startTranslate+dx;$wrapper.css("transform","translate3d("+curTrans+"px, 0px, 0px)")}});e(window).on("pointerup touchend pointercancel",function(evt){if(!isDragging)return;isDragging=false;var dx=currentX-startX,containerWidth=$swiper.width()||window.innerWidth,visibleCards=Math.max(1,Math.floor(containerWidth/slideStride)),maxIdx=Math.max(0,$slides.length-visibleCards);if(dragMoved&&Math.abs(dx)>45){dx<0&&currentIdx<maxIdx?currentIdx++:dx>0&&currentIdx>0&&currentIdx--}updateSwiper();setTimeout(function(){dragMoved=false},120)});updateSwiper();e(window).on("resize",updateSwiper)}initReviewsSwiper();';

if (!code.includes(targetDragPointClick)) {
  console.error('ERROR: targetDragPointClick not found in code!');
  process.exit(1);
}
code = code.replace(targetDragPointClick, extraDragLogic);
console.log('Replaced DragPointClick target.');

// Validate syntax before writing!
try {
  new vm.Script(code);
  console.log('SUCCESS: Generated code compiles with 0 syntax errors!');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Wrote updated code to', filePath);
} catch (e) {
  console.error('COMPILATION FAILED:', e);
  process.exit(1);
}
