
const canvas=document.getElementById('space'),ctx=canvas.getContext('2d');let W,H,dpr,pts=[],mx=0,my=0;function resize(){dpr=Math.min(devicePixelRatio||1, window.innerWidth < 600 ? 1 : 1.5);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);pts=Array.from({length:Math.min(window.innerWidth < 600 ? 45 : 85,Math.floor(W/(window.innerWidth < 600 ? 20 : 14)))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.7+.35}))}resize();addEventListener('resize',resize);addEventListener('pointermove',e=>{mx=(e.clientX/W-.5)*2;my=(e.clientY/H-.5)*2});function draw(){ctx.clearRect(0,0,W,H);for(const p of pts){p.x+=p.vx+mx*.025;p.y+=p.vy+my*.018;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(180,220,255,.5)';ctx.fill()}for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){let a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);if(dist<115){ctx.strokeStyle='rgba(101,230,255,'+((1-dist/115)*.11)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}requestAnimationFrame(draw)}draw();
const hero=document.getElementById('tiltHero');addEventListener('pointermove',e=>{if(innerWidth<800)return;const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.transform='rotateY('+(x*3)+'deg) rotateX('+(-y*3)+'deg)'});addEventListener('pointerleave',()=>hero.style.transform='');
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
document.getElementById('hireForm').addEventListener('submit',e=>{e.preventDefault();const company=document.getElementById('company').value.trim(),executive=document.getElementById('executive').value.trim(),phone=document.getElementById('phone').value.trim(),position=document.getElementById('position').value.trim(),message=document.getElementById('message').value.trim();const text='Hello Saurabh,\n\nI am interested in discussing a job opportunity with you.\n\nCOMPANY DETAILS\nCompany Name: '+company+'\nHR / Executive Name: '+executive+'\nContact Number: '+phone+'\nPosition / Job Role: '+(position||'Not specified')+'\n\nMESSAGE\n'+(message||'I would like to connect with you regarding a job opportunity.')+'\n\nI found your profile through your professional CV portfolio.';window.open('https://wa.me/917389135888?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')});

// Soft / Technical skills toggle
document.querySelectorAll('.toggle-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.skill-panel').forEach(p=>p.classList.remove('active-panel'));btn.classList.add('active');document.getElementById(btn.dataset.skill==='soft'?'softSkills':'techSkills').classList.add('active-panel')}));


// Mobile-friendly interaction layer
(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (reduce) return;
  if (coarse) {
    document.querySelectorAll('.skill,.project,.cert,.about-card,.t-card').forEach(el=>{
      el.addEventListener('touchstart',()=>el.classList.add('touch-active'),{passive:true});
      el.addEventListener('touchend',()=>setTimeout(()=>el.classList.remove('touch-active'),180),{passive:true});
    });
  }
})();
