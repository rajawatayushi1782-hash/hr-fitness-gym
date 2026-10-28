const fs = require('fs');
const vm = require('vm');

const filePath = 'public/js/original_main.js';
let js = fs.readFileSync(filePath, 'utf8');

const start = js.indexOf('function initReviewsSwiper');
const end = js.indexOf('var h=0;fu', start);

if (start === -1 || end === -1) {
  console.error('Target not found!');
  process.exit(1);
}

const newCode = `function initReviewsSwiper(){
  if(window._reviewsSwiperBound) return;
  window._reviewsSwiperBound = true;

  var $swiper = e('.swiper');
  if(!$swiper.length) return;
  var $wrapper = $swiper.find('.swiper-wrapper');
  var $slides = $wrapper.find('.swiper-slide');
  if(!$slides.length) return;

  var currentIdx = 0;
  var slideStride = 325;

  function updateSwiper(animate){
    var containerWidth = $swiper.width() || window.innerWidth;
    var visibleCards = Math.max(1, Math.floor(containerWidth / slideStride));
    var maxIdx = Math.max(0, $slides.length - visibleCards);

    if(currentIdx < 0) currentIdx = 0;
    if(currentIdx > maxIdx) currentIdx = maxIdx;

    var translateX = -(currentIdx * slideStride);
    var transition = (animate !== false) ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    $wrapper.css({
      'transform': 'translate3d(' + translateX + 'px, 0px, 0px)',
      'transition': transition
    });

    var $prev = e('.es-carousel-arrow-control-container-previous');
    var $next = e('.es-carousel-arrow-control-container-next');
    var isBeginning = (currentIdx === 0);
    var isEnd = (currentIdx >= maxIdx);

    $prev.attr('aria-disabled', isBeginning ? 'true' : 'false').css('opacity', isBeginning ? '0.4' : '1');
    $next.attr('aria-disabled', isEnd ? 'true' : 'false').css('opacity', isEnd ? '0.4' : '1');
  }

  var lastClick = 0;
  e(document).on('click', '.es-carousel-arrow-control-container-next, .es-carousel-arrow-control-right', function(evt){
    evt.preventDefault();
    evt.stopPropagation();
    var now = Date.now();
    if(now - lastClick < 200) return;
    lastClick = now;

    var containerWidth = $swiper.width() || window.innerWidth;
    var visibleCards = Math.max(1, Math.floor(containerWidth / slideStride));
    var maxIdx = Math.max(0, $slides.length - visibleCards);
    if(currentIdx < maxIdx){
      currentIdx++;
      updateSwiper(true);
    }
  });

  e(document).on('click', '.es-carousel-arrow-control-container-previous, .es-carousel-arrow-control-left', function(evt){
    evt.preventDefault();
    evt.stopPropagation();
    var now = Date.now();
    if(now - lastClick < 200) return;
    lastClick = now;

    if(currentIdx > 0){
      currentIdx--;
      updateSwiper(true);
    }
  });

  var startX = 0, currentX = 0, isDragging = false, dragMoved = false, startTranslate = 0;
  $swiper.on('pointerdown touchstart mousedown', function(evt){
    var pt = evt.touches ? evt.touches[0] : (evt.originalEvent && evt.originalEvent.touches ? evt.originalEvent.touches[0] : evt);
    startX = pt.clientX;
    currentX = startX;
    isDragging = true;
    dragMoved = false;
    startTranslate = -(currentIdx * slideStride);
    $wrapper.css('transition', 'none');
  });

  e(window).on('pointermove touchmove mousemove', function(evt){
    if(!isDragging) return;
    var pt = evt.touches ? evt.touches[0] : (evt.originalEvent && evt.originalEvent.touches ? evt.originalEvent.touches[0] : evt);
    currentX = pt.clientX;
    var dx = currentX - startX;
    if(Math.abs(dx) > 10){
      dragMoved = true;
      var curTrans = startTranslate + dx;
      $wrapper.css('transform', 'translate3d(' + curTrans + 'px, 0px, 0px)');
    }
  });

  e(window).on('pointerup touchend mouseup pointercancel', function(evt){
    if(!isDragging) return;
    isDragging = false;
    var dx = currentX - startX;
    var containerWidth = $swiper.width() || window.innerWidth;
    var visibleCards = Math.max(1, Math.floor(containerWidth / slideStride));
    var maxIdx = Math.max(0, $slides.length - visibleCards);
    if(dragMoved && Math.abs(dx) > 40){
      if(dx < 0 && currentIdx < maxIdx) currentIdx++;
      else if(dx > 0 && currentIdx > 0) currentIdx--;
    }
    updateSwiper(true);
  });

  updateSwiper(false);
  e(window).on('resize', function(){ updateSwiper(false); });
}
initReviewsSwiper();`;

js = js.slice(0, start) + newCode + js.slice(end);

try {
  new vm.Script(js);
  console.log('Compiled successfully with 0 errors!');
  fs.writeFileSync(filePath, js, 'utf8');
  console.log('Successfully wrote updated public/js/original_main.js');
} catch (err) {
  console.error('Syntax error:', err);
  process.exit(1);
}
