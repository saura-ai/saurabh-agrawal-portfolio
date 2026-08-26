/* Lightweight 3D portfolio interactions — optimized for iOS/Android */
(() => {
  const canvas = document.getElementById('space');
  const ctx = canvas?.getContext('2d', { alpha: true });
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const lowPower = coarse || innerWidth < 700;
  let W = 0, H = 0, dpr = 1, pts = [], mx = 0, my = 0;
  let running = true, last = 0, frame = 0;

  function makePoints() {
    const count = lowPower ? 24 : Math.min(55, Math.max(34, Math.floor(W / 28)));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * (lowPower ? .12 : .18),
      vy: (Math.random() - .5) * (lowPower ? .12 : .18),
      r: Math.random() * 1.35 + .35
    }));
  }

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(devicePixelRatio || 1, lowPower ? 1 : 1.25);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makePoints();
  }

  function draw(now) {
    if (!running || !ctx) return;
    // Cap animation at ~30fps on phones and ~45fps on desktop.
    const interval = lowPower ? 33 : 22;
    if (now - last < interval) { requestAnimationFrame(draw); return; }
    last = now;
    ctx.clearRect(0, 0, W, H);

    for (const p of pts) {
      p.x += p.vx + mx * (lowPower ? .008 : .012);
      p.y += p.vy + my * (lowPower ? .006 : .01);
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
      if (p.y < -4) p.y = H + 4;
      if (p.y > H + 4) p.y = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,220,255,.38)';
      ctx.fill();
    }

    // Draw connections every other frame; this removes most of the expensive work.
    if (++frame % 2 === 0) {
      const maxDist = lowPower ? 82 : 105;
      const maxDist2 = maxDist * maxDist;
      ctx.lineWidth = .7;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < maxDist2) {
            const alpha = (1 - Math.sqrt(d2) / maxDist) * .075;
            ctx.strokeStyle = `rgba(101,230,255,${alpha})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(draw);
  }

  if (canvas && ctx && !reduceMotion) {
    resize();
    addEventListener('resize', resize, { passive: true });
    if (!coarse) addEventListener('pointermove', e => {
      mx = (e.clientX / W - .5) * 2;
      my = (e.clientY / H - .5) * 2;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { last = performance.now(); requestAnimationFrame(draw); }
    });
    requestAnimationFrame(draw);
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  // Lightweight hero tilt; disabled on touch devices.
  const hero = document.getElementById('tiltHero');
  if (hero && !coarse && !reduceMotion) {
    addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        hero.style.transform = '';
        return;
      }
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      hero.style.transform = `rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg)`;
    }, { passive: true });
  }

  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(x => obs.observe(x));

  const form = document.getElementById('hireForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => document.getElementById(id)?.value.trim() || '';
    const text = `Hello Saurabh,\n\nI am interested in discussing a job opportunity with you.\n\nCOMPANY DETAILS\nCompany Name: ${v('company')}\nHR / Executive Name: ${v('executive')}\nContact Number: ${v('phone')}\nPosition / Job Role: ${v('position') || 'Not specified'}\n\nMESSAGE\n${v('message') || 'I would like to connect with you regarding a job opportunity.'}\n\nI found your profile through your professional CV portfolio.`;
    location.href = 'https://wa.me/917389135888?text=' + encodeURIComponent(text);
  });

  document.querySelectorAll('.toggle-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active-panel'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.skill === 'soft' ? 'softSkills' : 'techSkills')?.classList.add('active-panel');
  }));

  if (!reduceMotion && coarse) {
    document.querySelectorAll('.skill,.project,.cert,.about-card,.t-card').forEach(el => {
      el.addEventListener('touchstart', () => el.classList.add('touch-active'), { passive: true });
      el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('touch-active'), 160), { passive: true });
    });
  }
})();
