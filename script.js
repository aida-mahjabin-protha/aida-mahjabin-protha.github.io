(function(){
var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
// split headings into letters
document.querySelectorAll('.play').forEach(function(el){
  var label=el.textContent.replace(/\s+/g,' ').trim(),n=0;
  el.setAttribute('aria-label',label);
  (function walk(node){
    Array.from(node.childNodes).forEach(function(c){
      if(c.nodeType===3){
        var f=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function(part){
          if(!part)return;
          if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(' '));return;}
          var w=document.createElement('span');w.className='word';w.setAttribute('aria-hidden','true');
          part.split('').forEach(function(ch){var s=document.createElement('span');s.className='ch';s.style.setProperty('--i',n++);s.textContent=ch;w.appendChild(s);});
          f.appendChild(w);
        });
        node.replaceChild(f,c);
      }else if(c.nodeType===1){walk(c);}
    });
  })(el);
});
// scroll reveal
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12}):null;
document.querySelectorAll('.reveal').forEach(function(el){io?io.observe(el):el.classList.add('in');});
if(calm)return;

// letter pop (tap or drag a finger across a heading)
function pop(ch){ch.classList.remove('pop');void ch.offsetWidth;ch.classList.add('pop');setTimeout(function(){ch.classList.remove('pop');},650);}
function popAt(x,y){var t=document.elementFromPoint(x,y);if(t&&t.classList&&t.classList.contains('ch'))pop(t);}
document.querySelectorAll('.play').forEach(function(el){
  el.addEventListener('touchstart',function(e){var t=e.touches[0];popAt(t.clientX,t.clientY);},{passive:true});
  el.addEventListener('touchmove',function(e){var t=e.touches[0];popAt(t.clientX,t.clientY);},{passive:true});
});
// idle: a random letter in the main heading hops now and then (helps on phones)
var main=document.querySelector('h1.play');
if(main){var chs=main.querySelectorAll('.ch');if(chs.length)setInterval(function(){pop(chs[Math.floor(Math.random()*chs.length)]);},1800);}

// glow follows mouse or finger
var g=document.createElement('div');g.className='glow';document.body.appendChild(g);
function moveGlow(x,y){g.style.left=x+'px';g.style.top=y+'px';g.classList.add('on');}
addEventListener('pointermove',function(e){if(e.pointerType==='mouse')moveGlow(e.clientX,e.clientY);});
addEventListener('touchstart',function(e){moveGlow(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
addEventListener('touchmove',function(e){moveGlow(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
addEventListener('touchend',function(){g.classList.remove('on');},{passive:true});

// tilt on cards, magnetic buttons (mouse only for buttons)
function resetTilt(except){document.querySelectorAll('.tile,.shot,.badge').forEach(function(c){if(c!==except){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');}});}
document.addEventListener('pointermove',function(e){
  var t=e.target.closest&&e.target.closest('.tile,.shot,.badge');
  resetTilt(t);
  if(t){var r=t.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.setProperty('--ry',(x*10)+'deg');t.style.setProperty('--rx',(-y*10)+'deg');t.style.setProperty('--gx',((x+.5)*100)+'%');t.style.setProperty('--gy',((y+.5)*100)+'%');}
  if(e.pointerType==='mouse'){
    document.querySelectorAll('.btn').forEach(function(b){
      var r=b.getBoundingClientRect();var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      if(Math.hypot(dx,dy)<90){b.style.setProperty('--mx',dx*.25+'px');b.style.setProperty('--my',dy*.25+'px');}
      else{b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px');}
    });
  }
});
['pointerup','pointercancel'].forEach(function(ev){document.addEventListener(ev,function(e){if(e.pointerType!=='mouse')resetTilt(null);});});
var bd=document.querySelector('.badge');
if(bd){bd.addEventListener('click',function(){bd.classList.remove('spin');void bd.offsetWidth;bd.classList.add('spin');});bd.addEventListener('animationend',function(e){if(e.animationName==='spin')bd.classList.remove('spin');});}
})();
