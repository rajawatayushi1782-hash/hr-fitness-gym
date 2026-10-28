const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// Let's test by removing characters one by one or testing prefixes
// Since code is of form:
// !function(e){ ... }([ ... ]);
// We can wrap slices in a dummy function and test:

console.log('Testing whole file:');
try {
  new vm.Script(code);
  console.log('WHOLE FILE IS VALID!');
} catch (e) {
  console.log('WHOLE FILE ERROR:', e.message);
}

// Let's check what was changed in patch_main_js.js:
// In patch_main_js.js:
// const oldCode = 'e(window).on("load",(function(){(new Date).getTime();var t=setInterval((function(){(new Date).getTime()-o>1800&&(clearInterval(t),function(){e("body").removeClass("loading");var t=new Ft({}),i=new Zs(e(".slide__titleAnimation"),{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars;t.set(e(".arrowScroll__circle circle"),{drawSVG:"0"}),t.set(e(".arrowScroll__arrow"),{opacity:"0",translateY:"-20%"}),t.set(i,{translateY:"100%",rotate:"20deg"}),t.set(e(".slide__textAnimation"),{translateY:"100%"}),t.to(e(".wipe"),1.2,{rotate:"-180deg",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut}),t.to(e(".wipe_spinner"),.4,{opacity:"0",ease:Oi.easeInOut,delay:-.8}),t.to(i,{duration:.6,translateY:"0%",rotate:"0deg",force3D:!0,transformOrigin:"top left",ease:Ii.easeOut,delay:-1,stagger:{amount:.6}}),t.to(e(".slide__textAnimation"),.8,{translateY:"0%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-1.2}),t.to(e(".arrowScroll__circle--first circle"),.8,{drawSVG:"50% 0%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-.6}),t.to(e(".arrowScroll__circle--second circle"),.8,{drawSVG:"0% 50%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-.8}),t.to(e(".arrowScroll__arrow"),.6,{translateY:"0%",opacity:"1",ease:Oi.easeInOut,delay:-.4}),t.set(e(".wipe"),{opacity:0,zIndex:"1000"}),t.set(e(".wipe_circle"),{opacity:1}),t.set(e(".wipe_spinner"),{zIndex:-10}),t.eventCallback("onComplete",(function(){e(".wipe_spinner").remove()}))}())}),100);L(),s(),e("body';

// Notice what oldCode began with:
// e(window).on("load", (function(){ ...
// In the original file, it was:
// window.addEventListener("resize",d), e(window).on("load", ...

// If we put back oldCode, does it parse cleanly?
const patchedRegion = code.slice(code.indexOf('_pageRevealed') - 40, code.indexOf('L(),s(),e("body') + 15);
console.log('Current patched region:');
console.log(patchedRegion);
