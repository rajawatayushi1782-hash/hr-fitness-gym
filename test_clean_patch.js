const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// First restore original
const oldCode = 'e(window).on("load",(function(){(new Date).getTime();var t=setInterval((function(){(new Date).getTime()-o>1800&&(clearInterval(t),function(){e("body").removeClass("loading");var t=new Ft({}),i=new Zs(e(".slide__titleAnimation"),{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars;t.set(e(".arrowScroll__circle circle"),{drawSVG:"0"}),t.set(e(".arrowScroll__arrow"),{opacity:"0",translateY:"-20%"}),t.set(i,{translateY:"100%",rotate:"20deg"}),t.set(e(".slide__textAnimation"),{translateY:"100%"}),t.to(e(".wipe"),1.2,{rotate:"-180deg",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut}),t.to(e(".wipe_spinner"),.4,{opacity:"0",ease:Oi.easeInOut,delay:-.8}),t.to(i,{duration:.6,translateY:"0%",rotate:"0deg",force3D:!0,transformOrigin:"top left",ease:Ii.easeOut,delay:-1,stagger:{amount:.6}}),t.to(e(".slide__textAnimation"),.8,{translateY:"0%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-1.2}),t.to(e(".arrowScroll__circle--first circle"),.8,{drawSVG:"50% 0%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-.6}),t.to(e(".arrowScroll__circle--second circle"),.8,{drawSVG:"0% 50%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-.8}),t.to(e(".arrowScroll__arrow"),.6,{translateY:"0%",opacity:"1",ease:Oi.easeInOut,delay:-.4}),t.set(e(".wipe"),{opacity:0,zIndex:"1000"}),t.set(e(".wipe_circle"),{opacity:1}),t.set(e(".wipe_spinner"),{zIndex:-10}),t.eventCallback("onComplete",(function(){e(".wipe_spinner").remove()}))}())}),100);L(),s(),e("body';

const currentPatch = 'var _pageRevealed=!1;function _revealPage(){if(_pageRevealed)return;_pageRevealed=!0;e("body").removeClass("loading").removeClass("is-animating");try{var t=new Ft({}),charsElements=e(".slide__titleAnimation"),i=charsElements.length?new Zs(charsElements,{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars:[];t.set(e(".arrowScroll__circle circle"),{drawSVG:"0"}),t.set(e(".arrowScroll__arrow"),{opacity:"0",translateY:"-20%"}),i&&i.length&&t.set(i,{translateY:"100%",rotate:"20deg"}),t.set(e(".slide__textAnimation"),{translateY:"100%"}),t.to(e(".wipe"),1.2,{rotate:"-180deg",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut}),t.to(e(".wipe_spinner"),.4,{opacity:"0",ease:Oi.easeInOut,delay:-.8}),i&&i.length&&t.to(i,{duration:.6,translateY:"0%",rotate:"0deg",force3D:!0,transformOrigin:"top left",ease:Ii.easeOut,delay:-1,stagger:{amount:.6}}),t.to(e(".slide__textAnimation"),.8,{translateY:"0%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-1.2}),t.to(e(".arrowScroll__circle--first circle"),.8,{drawSVG:"50% 0%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-.6}),t.to(e(".arrowScroll__circle--second circle"),.8,{drawSVG:"0% 50%",force3D:!0,transformOrigin:"top left",ease:Oi.easeInOut,delay:-.8}),t.to(e(".arrowScroll__arrow"),.6,{translateY:"0%",opacity:"1",ease:Oi.easeInOut,delay:-.4}),t.set(e(".wipe"),{opacity:0,zIndex:"-10"}),t.set(e(".wipe_circle"),{opacity:1}),t.set(e(".wipe_spinner"),{zIndex:-10,display:"none"}),t.eventCallback("onComplete",(function(){e(".wipe_spinner").remove()}))}catch(err){console.warn("Reveal fallback:",err);e(".wipe").css({opacity:0,zIndex:-10,display:"none"});e(".wipe_spinner").remove()}}e(window).on("load",(function(){setTimeout(_revealPage,300)}));setTimeout(_revealPage,1200);L(),s(),e("body';

let restored = code.replace(currentPatch, oldCode);
restored = restored.replace('window.addEventListener("resize",d);', 'window.addEventListener("resize",d),');

// Target inside the inner reveal function of oldCode:
// i=new Zs(e(".slide__titleAnimation"),{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars
// Change to:
// _el=e(".slide__titleAnimation"),i=_el.length?new Zs(_el,{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars:[]
const targetSub = 'i=new Zs(e(".slide__titleAnimation"),{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars';
const replacementSub = '_el=e(".slide__titleAnimation"),i=_el.length?new Zs(_el,{type:"lines,chars",charsClass:"slide__char",linesClass:"slide__line"}).chars:[]';

let patched = restored.replace(targetSub, replacementSub);

// Also in the interval condition: (new Date).getTime()-o>1800
// We can make it 400ms or instant: (new Date).getTime()-o>400
patched = patched.replace('(new Date).getTime()-o>1800', '(new Date).getTime()-o>400');

console.log('Includes targetSub:', restored.includes(targetSub));

try {
  new vm.Script(patched);
  console.log('SUCCESS! Patched code is completely 100% VALID syntax!');
  fs.writeFileSync('public/js/original_main.js', patched, 'utf8');
  if (fs.existsSync('original_main.js')) fs.writeFileSync('original_main.js', patched, 'utf8');
} catch (e) {
  console.error('Failed syntax:', e.message);
}
