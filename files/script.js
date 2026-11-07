(function(){
var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(pointer: fine)').matches;
// playful letters
document.querySelectorAll('.play').forEach(function(el){
  var label=el.textContent.replace(/\s+/g,' ').trim();
  el.setAttribute('aria-label',label);
  (function walk(node){
    Array.from(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var f=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if(!part)return;
          if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(' '));return;}
          var w=document.createElement('span');w.className='word';w.setAttribute('aria-hidden','true');
          part.split('').forEach(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;w.appendChild(s);});
          f.appendChild(w);
        });
        node.replaceChild(f,n);
      }else if(n.nodeType===1){walk(n);}
    });
  })(el);
});
// scroll reveal
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12}):null;
document.querySelectorAll('.reveal').forEach(function(el){io?io.observe(el):el.classList.add('in');});
if(calm||!fine)return;
// cursor glow
var g=document.createElement('div');g.className='glow';document.body.appendChild(g);
addEventListener('pointermove',function(e){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';});
// tilt + magnetic
document.addEventListener('pointermove',function(e){
  var t=e.target.closest&&e.target.closest('.tile,.shot');
  document.querySelectorAll('.tile,.shot').forEach(function(c){if(c!==t){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');}});
  if(t){var r=t.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.setProperty('--ry',(x*10)+'deg');t.style.setProperty('--rx',(-y*10)+'deg');}
  document.querySelectorAll('.btn').forEach(function(b){
    var r=b.getBoundingClientRect();var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
    if(Math.hypot(dx,dy)<90){b.style.setProperty('--mx',dx*.25+'px');b.style.setProperty('--my',dy*.25+'px');}
    else{b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px');}
  });
});
})();
