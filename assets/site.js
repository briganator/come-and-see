
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded',function(){
 var figs=document.querySelectorAll('.sketch-fig');
 if(!('IntersectionObserver' in window)){figs.forEach(function(f){f.classList.add('drawn')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('drawn');io.unobserve(e.target)}})},{threshold:0.35});
 figs.forEach(function(f){io.observe(f)});


 // ---- v3 cinematic motion: reveals, parallax, progress (all skipped under reduced motion) ----
 var still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var rv=[].slice.call(document.querySelectorAll('.rv'));
 if(still||!('IntersectionObserver' in window)){rv.forEach(function(e){e.classList.add('in')})}
 else{var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0.12});rv.forEach(function(e){ro.observe(e)})}
 var heroes=[].slice.call(document.querySelectorAll('.opener,.phero,.quote-band'));
 var bar=document.querySelector('.progress span'),main=document.querySelector('main');
 if(!still&&(heroes.length||bar)){
  var tk=false;
  function frame(){tk=false;var vh=window.innerHeight;
   heroes.forEach(function(h){var r=h.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var p=-r.top/Math.max(1,r.height);h.style.setProperty('--p',Math.max(-1,Math.min(1,p)).toFixed(4))});
   if(bar&&main){var r=main.getBoundingClientRect();var p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-vh)));bar.style.transform='scaleX('+p.toFixed(4)+')'}}
  window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(frame)}},{passive:true});window.addEventListener('resize',frame);frame();
 } else if(bar&&main){window.addEventListener('scroll',function(){var r=main.getBoundingClientRect();bar.style.transform='scaleX('+Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)))+')'},{passive:true})}
 // ---- chapter opener motion: size fx stage like the cover image; pause offscreen ----
 (function(){var o=document.querySelector('.opener[class*="m-ch"]');if(!o)return;var st=o.querySelector('.op-fx');
  function size(){var w=o.clientWidth,h=o.clientHeight,r=16/9;if(w/h>r){st.style.setProperty('--fw',w+'px');st.style.setProperty('--fh',w/r+'px')}else{st.style.setProperty('--fw',h*r+'px');st.style.setProperty('--fh',h+'px')}}
  size();window.addEventListener('resize',size);
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){o.classList.toggle('off',!es[0].isIntersecting)}).observe(o);
 })();
 // downloads: enable each file link only once the file exists on the server
 function fmt(b){if(!b)return '';b=+b;return b>1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB'}
 document.querySelectorAll('[data-file]').forEach(function(el){
  var f=el.getAttribute('data-file');
  fetch(f,{method:'HEAD'}).then(function(r){if(!r.ok)return;var a=el.querySelector('a.go,a.ch');if(a){a.setAttribute('href',f);a.removeAttribute('aria-disabled');a.removeAttribute('tabindex');a.setAttribute('download','')}
   el.classList.add('ready');var st=el.querySelector('.st,.size');if(st)st.textContent=fmt(r.headers.get('content-length'))||'Ready';
   var lab=el.querySelector('.go');if(lab&&lab.dataset.ready)lab.textContent=lab.dataset.ready}).catch(function(){});
 });
 // narration slots: show a player only when the audio file exists
 document.querySelectorAll('[data-audio]').forEach(function(el){
  var src=el.getAttribute('data-audio');
  fetch(src,{method:'HEAD'}).then(function(r){if(r.ok){el.innerHTML='<audio controls preload="none" src="'+src+'"></audio>'}}).catch(function(){});
 });
});
