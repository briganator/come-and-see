
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded',function(){
 var figs=document.querySelectorAll('.sketch-fig');
 if(!('IntersectionObserver' in window)){figs.forEach(function(f){f.classList.add('drawn')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('drawn');io.unobserve(e.target)}})},{threshold:0.35});
 figs.forEach(function(f){io.observe(f)});

 // gentle Ken Burns motion on paintings, tied to scroll; skipped entirely when reduced motion is requested
 var still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var arts=[].slice.call(document.querySelectorAll('.art-fig img'));
 if(!still&&arts.length){
  var dirs=[[1,1],[-1,1],[1,-1],[-1,-1]],ticking=false;
  function kb(){ticking=false;var vh=window.innerHeight;arts.forEach(function(im,i){var r=im.parentNode.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
   var p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));var d=dirs[i%4];
   im.style.transform='scale('+(1.03+0.07*p).toFixed(4)+') translate3d('+(d[0]*(p-0.5)*2.4).toFixed(3)+'%,'+(d[1]*(p-0.5)*1.6).toFixed(3)+'%,0)'})}
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(kb)}},{passive:true});window.addEventListener('resize',kb);kb();
 }
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
