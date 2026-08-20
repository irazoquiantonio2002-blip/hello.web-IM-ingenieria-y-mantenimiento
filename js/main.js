(() => {
  'use strict';

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 400);
  });

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  hamburger.addEventListener('click', () => {
    const open = mobMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Marquee content ---------- */
  const marqueeItems = [
    'Reparación de Maquinaria Pesada', 'Cilindros Hidráulicos', 'Bombas y Motores Hidráulicos',
    'Retroexcavadoras', 'Cargadores Frontales', 'Excavadoras', 'Motoconformadoras',
    'Maquinaria para Minería', 'Grúas y Camiones', 'Fabricación y Maquinado de Precisión',
    'Garantía por Escrito', 'Cobertura Nacional'
  ];
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const build = () => marqueeItems.map(t => `<span><i class="fa-solid fa-circle"></i>${t}</span>`).join('');
    marquee.innerHTML = build() + build();
  }

  /* ---------- Hero canvas: drifting particle orbs ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const palette = ['42,93,148', '201,143,31'];
    const makeParticles = () => {
      const count = w < 700 ? 14 : 26;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.35 + 0.12,
        c: palette[Math.random() < 0.7 ? 0 : 1]
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      if (!reduceMotion) requestAnimationFrame(draw);
    };

    resize();
    makeParticles();
    draw();
    window.addEventListener('resize', () => { resize(); makeParticles(); }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form → WhatsApp ---------- */
  const form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      const text =
        `Hola, soy ${name}. Me interesa una cotización de: ${interest}.\n\n` +
        `Detalle: ${msg}`;

      const url = `https://wa.me/524421141164?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
