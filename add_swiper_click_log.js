const fs = require('fs');
let code = fs.readFileSync('./public/js/original_main.js', 'utf8');

code = code.replace(
  'e("body").on("click",".es-carousel-arrow-control-right",function(evt){evt.preventDefault(),evt.stopPropagation();',
  'e("body").on("click",".es-carousel-arrow-control-right",function(evt){evt.preventDefault(),evt.stopPropagation();console.log("DEBUG: RBTN CLICKED! currentIdx:",currentIdx,"maxIdx:",maxIdx);'
);

code = code.replace(
  'var translateX=-(currentIdx*slideStride);$wrapper.css({"transform":"translate3d("+translateX+"px, 0px, 0px)"',
  'var translateX=-(currentIdx*slideStride);console.log("DEBUG: Setting transform to", translateX);$wrapper.css({"transform":"translate3d("+translateX+"px, 0px, 0px)"'
);

fs.writeFileSync('./public/js/original_main.js', code, 'utf8');
console.log('Added logs to rBtn click and updateSwiper');
