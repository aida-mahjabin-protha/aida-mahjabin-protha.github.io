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

var WING='M30 17Q22 5 2 7Q7 11 8 18Q11 14 15 19Q18 15 22 21Q26 18 30 24Z';
var BODY='fill="#3a0f1c" stroke="#e0526e" stroke-width=".8" stroke-linejoin="round"';
var BAT='<svg viewBox="0 0 64 36" aria-hidden="true"><g class="wl"><path d="'+WING+'" '+BODY+'/></g><g class="wr"><path transform="translate(64 0) scale(-1 1)" d="'+WING+'" '+BODY+'/></g><ellipse cx="32" cy="21" rx="4.6" ry="8.5" '+BODY+'/><circle cx="32" cy="12" r="4" '+BODY+'/><path d="M28.6 10 28 3.5 31.2 8ZM35.4 10 36 3.5 32.8 8Z" '+BODY+'/><circle cx="30.7" cy="12" r=".9" fill="#ff4d5e"/><circle cx="33.3" cy="12" r=".9" fill="#ff4d5e"/></svg>';
function rnd(a,b){return a+Math.random()*(b-a);}
function bats(src){
  if(document.querySelectorAll('.bat').length>40)return;
  var r=src.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,W=innerWidth,H=innerHeight,n=W<600?12:18;
  var fl=document.createElement('div');fl.className='batflash';fl.style.setProperty('--fx',cx+'px');fl.style.setProperty('--fy',cy+'px');document.body.appendChild(fl);setTimeout(function(){fl.remove();},1200);
  for(var i=0;i<n;i++){
    var b=document.createElement('div');b.className='bat';b.setAttribute('aria-hidden','true');b.innerHTML=BAT;
    var w=rnd(34,66),h=w*.56;b.style.width=w+'px';b.style.height=h+'px';
    b.querySelectorAll('.wl,.wr').forEach(function(el){el.style.animationDuration=rnd(.14,.24)+'s';el.style.animationDelay=(-rnd(0,.2))+'s';});
    document.body.appendChild(b);
    var a=rnd(0,Math.PI*2),rad=rnd(60,180);
    var exit=Math.random();
    var end=exit<.4?{x:rnd(0,W),y:-100}:exit<.7?{x:-100,y:rnd(0,H*.8)}:{x:W+100,y:rnd(0,H*.8)};
    var pts=[{x:cx,y:cy},{x:cx+Math.cos(a)*rad,y:cy+Math.sin(a)*rad},{x:rnd(0,W),y:rnd(0,H*.9)},{x:rnd(0,W),y:rnd(0,H*.9)},{x:rnd(0,W),y:rnd(0,H*.9)},{x:rnd(0,W),y:rnd(0,H*.9)},end];
    var off=[0,.1,.3,.5,.7,.88,1],sc=rnd(.8,1.25),frames=pts.map(function(p,k){
      var prev=pts[Math.max(0,k-1)],tilt=Math.max(-18,Math.min(18,(p.x-prev.x)/20));
      return {transform:'translate('+(p.x-w/2)+'px,'+(p.y-h/2)+'px) rotate('+tilt+'deg) scale('+(k===0?.2:sc)+')',opacity:(k===0||k===pts.length-1)?0:1,offset:off[k],easing:k===0?'ease-out':'cubic-bezier(.35,0,.65,1)'};
    });
    if(b.animate){var an=b.animate(frames,{duration:rnd(3800,4800),delay:rnd(0,500),fill:'both'});an.onfinish=(function(el){return function(){el.remove();};})(b);}
    else{b.remove();}
    setTimeout((function(el){return function(){if(el.parentNode)el.remove();};})(b),7000);
  }
}
var bd=document.querySelector('.badge');
if(bd){bd.addEventListener('click',function(){bd.classList.remove('spin');void bd.offsetWidth;bd.classList.add('spin');bats(bd);});bd.addEventListener('animationend',function(e){if(e.animationName==='spin')bd.classList.remove('spin');});}
})();
