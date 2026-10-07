/* Marlow Vale Shopify theme: interactions (GSAP + ScrollTrigger loaded in theme.liquid) */
(function(){var d=document,h=d.getElementById('hdr');
function onS(){h&&h.classList.toggle('solid',scrollY>40)}addEventListener('scroll',onS,{passive:true});onS();
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
d.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(window.gsap&&window.ScrollTrigger&&!rm){gsap.registerPlugin(ScrollTrigger)}
/* membership buttons choose the matching tier radio */
d.querySelectorAll('[data-tier]').forEach(function(a){a.addEventListener('click',function(){var r=d.querySelector('input[name=tier][value="'+a.dataset.tier+'"]');if(r)r.checked=true})});
/* join form: validate, build customer tags, then let Shopify submit it natively */
var f=d.getElementById('joinForm');
if(f){f.addEventListener('submit',function(e){var err=d.getElementById('joinErr'),m=[];
var nm=f.querySelector('[name="contact[first_name]"]'),em=f.querySelector('[name="contact[email]"]'),age=f.querySelector('[name=age]'),news=f.querySelector('[name=news]');
if(!nm.value.trim())m.push('Please enter your name.');
if(!/^\S+@\S+\.\S+$/.test(em.value))m.push('Please enter a valid email.');
if(!age.checked)m.push('Please confirm you are 18 or older.');
if(m.length){e.preventDefault();err.textContent=m.join(' ');err.hidden=false;return}
var t=f.querySelector('input[name=tier]:checked');var tags=['wine-club','tier-'+(t?t.value:'Reserve').toLowerCase().replace(/\s+/g,'-')];if(news&&news.checked)tags.push('marketing-ok');
f.querySelector('[name="contact[tags]"]').value=tags.join(', ')})}
})();

(function(){var st=document.getElementById('stage');if(!st)return;
var sl=[].slice.call(st.querySelectorAll('.slide')),cur=0,busy=false,timer,cn=document.getElementById('cur'),
rm=matchMedia('(prefers-reduced-motion:reduce)').matches,g=window.gsap;
function parts(s){return{sc:s.querySelector('.scene'),nm:s.querySelector('.wname'),bt:s.querySelector('.bwrap'),inf:s.querySelector('.info')}}
function show(s,on){s.classList.toggle('active',on);s.setAttribute('aria-hidden',on?'false':'true')}
function go(n,dir){if(busy||n===cur)return;busy=true;var a=sl[cur],b=sl[n],pa=parts(a),pb=parts(b);dir=dir||1;
if(!g||rm){show(a,false);show(b,true);cur=n;cn.textContent='0'+(n+1);busy=false;return}
b.style.zIndex=3;a.style.zIndex=2;show(b,true);
var arch=st.querySelector('.arch'),badge=st.querySelector('.badge');
var d1=st.querySelector('.d1'),d2=st.querySelector('.d2');
g.set(pb.sc,{scale:1.4,rotation:-dir*22,opacity:1,filter:'blur(8px) brightness(.5)',clipPath:'circle(0% at 50% 62%)'});
g.set(d1,{xPercent:-50,yPercent:-50,x:0,y:0,scale:.2,rotation:0,opacity:0});g.set(d2,{xPercent:-50,yPercent:-50,x:-dir*420,y:300,scale:.25,rotation:-dir*40,opacity:0});
g.set(pb.nm,{opacity:0,y:34,filter:'blur(10px)'});
g.set(pb.bt,{transformOrigin:'50% 62%',rotation:-dir*80,x:-dir*420,y:340,opacity:0});
g.set(pb.inf,{opacity:0,y:20});g.set(pa.bt,{transformOrigin:'50% 62%'});
var tl=g.timeline({onComplete:function(){show(a,false);a.style.zIndex='';b.style.zIndex='';g.set([pa.sc,pa.nm,pa.bt,pa.inf],{clearProps:'all'});g.set([pb.bt],{clearProps:'transformOrigin'});g.set(pb.sc,{clearProps:'clipPath'});g.set([d1,d2],{opacity:0});cur=n;cn.textContent='0'+(n+1);busy=false}});
tl.to(pa.bt,{rotation:dir*85,x:dir*430,y:380,opacity:0,duration:1,ease:'power2.in'},0)
.to(pa.nm,{opacity:0,y:-24,filter:'blur(10px)',duration:.6,ease:'power2.in'},0)
.to(pa.inf,{opacity:0,duration:.35},0)
.to([arch,badge],{opacity:.15,duration:.5},0)
.to(pa.sc,{rotation:dir*22,scale:1.45,filter:'blur(5px) brightness(.62)',duration:1.5,ease:'power2.inOut'},.2)
.to(pa.sc,{opacity:0,duration:.5},1.35)
.to(pb.sc,{clipPath:'circle(150% at 50% 62%)',duration:1.5,ease:'power2.inOut'},.35)
.to(pb.sc,{rotation:0,scale:1,filter:'blur(0px) brightness(1)',duration:1.6,ease:'power3.out'},.35)
.to(d1,{opacity:.9,duration:.35,ease:'power1.out'},.2).to(d1,{scale:1.5,rotation:dir*70,duration:1.5,ease:'power2.inOut'},.2).to(d1,{opacity:0,duration:.6},1.1)
.to(d2,{opacity:.85,duration:.35},.4).to(d2,{x:0,y:0,scale:1.05,rotation:0,duration:1.5,ease:'power2.inOut'},.4).to(d2,{opacity:0,duration:.6},1.3)
.to(pb.bt,{rotation:0,x:0,y:0,opacity:1,duration:1.2,ease:'back.out(1.15)'},1)
.to(pb.nm,{opacity:1,y:0,filter:'blur(0px)',duration:1.1,ease:'power2.out'},1.1)
.to([arch,badge],{opacity:1,duration:.7},1.3)
.to(pb.inf,{opacity:1,y:0,duration:.7},1.5)}
function next(){go((cur+1)%sl.length,1)}function prev(){go((cur-1+sl.length)%sl.length,-1)}
st.querySelector('.next').addEventListener('click',function(){next();reset()});
st.querySelector('.prev').addEventListener('click',function(){prev();reset()});
addEventListener('keydown',function(e){if(e.key==='ArrowRight'){next();reset()}if(e.key==='ArrowLeft'){prev();reset()}});
function reset(){clearInterval(timer);if(!rm)timer=setInterval(next,7000)}
st.addEventListener('mouseenter',function(){clearInterval(timer)});st.addEventListener('mouseleave',reset);reset();
var t0=null;st.addEventListener('touchstart',function(e){t0=e.touches[0].clientX},{passive:true});
st.addEventListener('touchend',function(e){if(t0===null)return;var dx=e.changedTouches[0].clientX-t0;if(Math.abs(dx)>50){dx<0?next():prev();reset()}t0=null});
})();

(function(){var els=[].slice.call(document.querySelectorAll('[data-count]'));if(!els.length)return;
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;if(rm||!('IntersectionObserver' in window))return;
function run(el){var to=parseFloat(el.dataset.count),from=parseFloat(el.dataset.from||0),dec=parseInt(el.dataset.dec||0,10),dur=1800,t0=null;
function f(t){if(t0===null)t0=t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3),v=from+(to-from)*e;el.textContent=v.toFixed(dec);if(p<1)requestAnimationFrame(f);else el.textContent=to.toFixed(dec)}
el.textContent=from.toFixed(dec);requestAnimationFrame(f)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=els.indexOf(e.target);setTimeout(function(){run(e.target)},i*120);io.unobserve(e.target)}})},{threshold:.6});
els.forEach(function(el){el.textContent=(el.dataset.from||0);io.observe(el)})})();

/* product cards: quantity stepper, favourites (saved on this device), Ajax add to cart */
(function(){
function cartCount(n){document.querySelectorAll('[data-cart-count]').forEach(function(el){el.textContent=n})}
function favs(){try{return JSON.parse(localStorage.getItem('mv_favs')||'[]')}catch(e){return[]}}
document.querySelectorAll('.pcard').forEach(function(c){
var o=c.querySelector('output'),qi=c.querySelector('[name=quantity]'),q=1;
function set(v){q=Math.max(1,Math.min(12,v));if(o)o.textContent=(q<10?'0':'')+q;if(qi)qi.value=q}
var mi=c.querySelector('.q-minus'),pl=c.querySelector('.q-plus');
if(mi)mi.addEventListener('click',function(){set(q-1)});if(pl)pl.addEventListener('click',function(){set(q+1)});
var h=c.querySelector('.heart');
if(h){var key=h.dataset.key||'';if(key&&favs().indexOf(key)>-1)h.setAttribute('aria-pressed','true');
h.addEventListener('click',function(){var on=h.getAttribute('aria-pressed')!=='true';h.setAttribute('aria-pressed',on?'true':'false');
if(key){var l=favs().filter(function(k){return k!==key});if(on)l.push(key);try{localStorage.setItem('mv_favs',JSON.stringify(l))}catch(e){}}})}
var form=c.querySelector('form[data-ajax-cart]'),btn=c.querySelector('.add'),t;
if(form&&btn){form.addEventListener('submit',function(e){e.preventDefault();var label=btn.dataset.label||'Add to cart';btn.disabled=true;
fetch('/cart/add.js',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
.then(function(r){if(!r.ok)throw new Error('add failed');return r.json()})
.then(function(){btn.textContent='Added \u2713 ('+q+')';btn.classList.add('done');return fetch('/cart.js').then(function(r){return r.json()}).then(function(cart){cartCount(cart.item_count)})})
.catch(function(){form.submit()})
.finally(function(){btn.disabled=false;clearTimeout(t);t=setTimeout(function(){btn.textContent=label;btn.classList.remove('done')},1800)})})}
else if(btn&&!form){btn.addEventListener('click',function(){var label=btn.dataset.label||'Add to cart';btn.textContent='Sample bottle: connect a product';clearTimeout(t);t=setTimeout(function(){btn.textContent=label},1800)})}
})})();

(function(){var g=window.gsap;if(!g||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var cm=document.querySelector('.c-main img'),cd=document.querySelector('.c-detail img'),col=document.querySelector('.collage');if(!col)return;
g.to(cm,{yPercent:-9,ease:'none',scrollTrigger:{trigger:col,start:'top bottom',end:'bottom top',scrub:true}});
g.to(cd,{yPercent:-11,ease:'none',scrollTrigger:{trigger:col,start:'top bottom',end:'bottom top',scrub:true}});
g.to('.c-detail',{y:-34,ease:'none',scrollTrigger:{trigger:col,start:'top bottom',end:'bottom top',scrub:true}})})();

(function(){var g=window.gsap,b=document.querySelector('.band-bg');if(!g||!b||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
g.to(b,{yPercent:8,ease:'none',scrollTrigger:{trigger:'.band',start:'top bottom',end:'bottom top',scrub:true}})})();

(function(){var g=window.gsap,t=document.querySelector('.trio');if(!g||!t||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
g.from('.chero-copy > *',{y:36,opacity:0,duration:1,stagger:.12,ease:'power3.out',delay:.15});
g.from('.trio-arch',{scaleY:.7,opacity:0,transformOrigin:'50% 100%',duration:1.1,ease:'power3.out',delay:.2});
g.from('.tb1',{y:300,rotation:-10,opacity:0,duration:1.2,ease:'back.out(1.1)',delay:.45});
g.from('.tb3',{y:300,rotation:10,opacity:0,duration:1.2,ease:'back.out(1.1)',delay:.6});
g.from('.tb2',{yPercent:30,opacity:0,duration:1.3,ease:'back.out(1.1)',delay:.3});
g.from('.trio-plinth',{scaleX:.4,opacity:0,duration:1,ease:'power3.out',delay:.2});
var bg=document.querySelector('.chero-bg');g.to(bg,{yPercent:10,ease:'none',scrollTrigger:{trigger:'.chero',start:'top top',end:'bottom top',scrub:true}});
g.to('.tb1',{y:-14,duration:3.4,ease:'sine.inOut',yoyo:true,repeat:-1,delay:1.8});g.to('.tb3',{y:-18,duration:4.1,ease:'sine.inOut',yoyo:true,repeat:-1,delay:2.1})})();
