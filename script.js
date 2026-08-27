(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Skills toggle
  const buttons = document.querySelectorAll('.switch-btn');
  const views = document.querySelectorAll('.skill-view');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  }));

  // Tap support for skill details on touch devices; desktop uses hover/focus.
  document.querySelectorAll('.skill-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      if (window.matchMedia('(pointer:coarse)').matches) {
        const was = tile.classList.contains('touch-open');
        document.querySelectorAll('.skill-tile.touch-open').forEach(t => t.classList.remove('touch-open'));
        if (!was) tile.classList.add('touch-open');
      }
    });
  });

  // Lightweight hero tilt on desktop only.
  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    const object = document.querySelector('.hero-object');
    object.addEventListener('pointermove', e => {
      const r = object.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      object.style.transform = `rotateY(${x*3}deg) rotateX(${y*-3}deg)`;
    });
    object.addEventListener('pointerleave', () => object.style.transform='');
  }

  // Bottom navigation: highlight current section using IntersectionObserver.
  const navItems = [...document.querySelectorAll('.bottom-item')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === '#'+entry.target.id));
    });
  }, {rootMargin:'-42% 0px -48% 0px', threshold:0});
  sections.forEach(section => sectionObserver.observe(section));

  // Smooth scrolling for in-page links.
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'start'});
  }));

  // WhatsApp hiring form -> Saurabh's own number.
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    phoneInput.setCustomValidity(phoneInput.value.length === 10 ? '' : 'Enter exactly 10 digits.');
  });

  document.getElementById('hireForm').addEventListener('submit', e => {
    e.preventDefault();
    const company = document.getElementById('company').value.trim();
    const executive = document.getElementById('executive').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!/^\d{10}$/.test(phone)) {
      phoneInput.setCustomValidity('Enter exactly 10 digits.');
      phoneInput.reportValidity();
      return;
    }
    phoneInput.setCustomValidity('');
    const position = document.getElementById('position').value.trim() || 'Not specified';
    const message = document.getElementById('message').value.trim() || 'I would like to connect regarding a job opportunity.';
    const text = `Hello Saurabh,\n\nI am interested in discussing a job opportunity with you.\n\nCOMPANY DETAILS\nCompany Name: ${company}\nHR / Executive Name: ${executive}\nContact Number: ${phone}\nPosition / Job Role: ${position}\n\nMESSAGE\n${message}`;
    window.location.href = 'https://wa.me/917389135888?text=' + encodeURIComponent(text);
  });
})();

// Text-first micro-interactions: on touch devices, tap a highlighted text item
// to keep its glow visible briefly. Desktop still uses native hover.
document.querySelectorAll('.text-hover').forEach((el) => {
  el.addEventListener('click', (event) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.text-hover.touch-open').forEach((other) => {
        if (other !== el) other.classList.remove('touch-open');
      });
      el.classList.toggle('touch-open');
      event.stopPropagation();
    }
  });
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.text-hover')) {
    document.querySelectorAll('.text-hover.touch-open').forEach((el) => el.classList.remove('touch-open'));
  }
});
