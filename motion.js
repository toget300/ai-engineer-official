(()=>{
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $=(s,r=document)=>[...r.querySelectorAll(s)];

// 捲動進度條 + 頁首收合
const bar=document.createElement('div');bar.className='progress-bar';document.body.append(bar);
const header=document.querySelector('.site-header');
let ticking=false;
function onScroll(){const h=document.documentElement,max=h.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?scrollY/max:0)+')';header.classList.toggle('scrolled',scrollY>40);ticking=false}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

// 標題逐行遮罩
const h1=document.querySelector('.hero h1');
if(h1&&!reduce){h1.innerHTML=h1.innerHTML.split(/<br\s*\/?>/i).map((t,i)=>'<span class="ln" style="--l:'+i+'"><span>'+t+'</span></span>').join('')}

// 跑馬燈
const hero=document.querySelector('.hero');
if(hero){const words=['流程自動化','紙本數位化','文件擷取','知識問答','系統整合','權限與稽核','教育訓練','上線維運'];
 const set=words.map(w=>'<span>'+w+'</span>').join('');
 const m=document.createElement('div');m.className='marquee';m.setAttribute('aria-hidden','true');m.innerHTML='<div class="marquee-track">'+set+set+set+set+'</div>';
 hero.after(m)}

// 群組階梯進場
const groups=['.service-grid','.problem-list','.case-modules','.engagement-grid','.fit-list','.hero-proof','.offer-output ol','.process-track'];
groups.forEach(s=>$(s).forEach(g=>{[...g.children].forEach((c,i)=>c.style.setProperty('--i',i));if(s!=='.process-track')g.classList.add('stagger')}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);setTimeout(()=>[...e.target.children].forEach(c=>c.style.setProperty('--i',0)),2200)}}),{threshold:.15});
$('.stagger,.process-track').forEach(el=>io.observe(el));

if(reduce||!fine)return;

// 磁吸按鈕
$('.button,.nav-cta').forEach(b=>{
 b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)'});
 b.addEventListener('mouseleave',()=>b.style.transform='')});

// 卡片聚光與傾斜
$('.service-card,.flow-card,.case-modules article,.engagement-grid article').forEach(c=>{
 c.classList.add('spot');
 const tilt=c.classList.contains('service-card');
 c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
  if(tilt)c.style.transform='perspective(900px) rotateX('+((.5-y/r.height)*5)+'deg) rotateY('+((x/r.width-.5)*6)+'deg) translateY(-6px)'});
 c.addEventListener('mouseleave',()=>{if(tilt)c.style.transform=''})});

// 主視覺視差
const hv=document.querySelector('.hero-visual');
if(hv&&hero){
 hero.addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;hv.style.transform='perspective(1000px) rotateY('+(x*-6)+'deg) rotateX('+(y*5)+'deg)'});
 hero.addEventListener('mouseleave',()=>hv.style.transform='')}
const orbit=document.querySelector('.cta-orbit');
if(orbit)addEventListener('scroll',()=>{const r=orbit.parentElement.getBoundingClientRect();orbit.style.translate='0 '+(r.top*-.08)+'px'},{passive:true});

// 游標
const ring=document.createElement('div'),dot=document.createElement('div');ring.className='cursor';dot.className='cursor-dot';document.body.append(ring,dot);
let tx=0,ty=0,rx=0,ry=0;
addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;ring.classList.add('on');dot.classList.add('on');dot.style.transform='translate('+tx+'px,'+ty+'px)'},{passive:true});
document.addEventListener('mouseleave',()=>{ring.classList.remove('on');dot.classList.remove('on')});
(function loop(){rx+=(tx-rx)*.16;ry+=(ty-ry)*.16;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();
document.addEventListener('mouseover',e=>ring.classList.toggle('big',!!e.target.closest('a,button,summary,select,.service-card')));
})();
