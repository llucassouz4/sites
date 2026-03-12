/* ================================================================
   INOVACRIA — script.js
   Clean, intentional interactions. No fluff.
   ================================================================ */

'use strict';


/* ---- Navbar: scrolled state ---- */
(function navScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();


/* ---- Mobile menu ---- */
(function mobileMenu() {
  const burger  = document.getElementById('burger');
  const menu    = document.getElementById('mobileNav');
  const overlay = document.getElementById('navOverlay');
  if (!burger || !menu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (overlay) { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); }
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => isOpen ? close() : open());
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  if (overlay) overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
})();


/* ---- Smooth scroll ---- */
(function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68');
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();


/* ---- Scroll reveal ---- */
(function scrollReveal() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ---- Hero reveal on load (staggered) ---- */
(function heroReveal() {
  const els = document.querySelectorAll('.hero .reveal-up');
  const run = () => els.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 60 + i * 90);
  });
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
})();


/* ---- Active nav link on scroll ---- */
(function activeLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.style.color = '');
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.style.color = 'var(--ink)';
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  sections.forEach(s => io.observe(s));
})();


/* ---- Portfolio image: graceful fallback ---- */
(function projImgFallback() {
  document.querySelectorAll('.proj-img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
  });
})();


/* ---- Hero 3D particle canvas ---- */
(function heroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx   = canvas.getContext('2d');
  const mobile = () => window.innerWidth < 768;
  let W, H, particles, raf;
  let mouse = { x: -9999, y: -9999, active: false };

  const COLORS = ['40,199,255', '91,63,255', '139,92,246', '99,179,255'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
  }

  function Particle() {
    this.reset(true);
  }

  Particle.prototype.reset = function(init) {
    this.x    = Math.random() * W;
    this.y    = init ? Math.random() * H : H + 10;
    this.z    = Math.random() * 0.75 + 0.25;   /* depth 0.25–1 */
    this.vx   = (Math.random() - 0.5) * 0.28 * this.z;
    this.vy   = -(0.08 + Math.random() * 0.14) * this.z;
    this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.r    = this.z * 1.6 + 0.4;
    this.alpha= this.z * 0.42 + 0.06;
  };

  Particle.prototype.update = function() {
    if (mouse.active) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 180 * 180) {
        const d   = Math.sqrt(d2) || 1;
        const f   = (1 - d / 180) * 0.016 * this.z;
        this.vx  += (dx / d) * f;
        this.vy  += (dy / d) * f;
      }
    }
    /* damping */
    this.vx *= 0.985;
    this.vy  = (this.vy + (-(0.08 + 0.06 * this.z) - this.vy) * 0.012);

    this.x  += this.vx;
    this.y  += this.vy;

    if (this.y < -8 || this.x < -8 || this.x > W + 8) this.reset(false);
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* connections */
    const N   = particles.length;
    const MAX = mobile() ? 100 : 145;
    for (let i = 0; i < N; i++) {
      const a = particles[i];
      for (let j = i + 1; j < N; j++) {
        const b  = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          const alpha = (1 - d / MAX) * 0.13 * ((a.z + b.z) * 0.5);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(91,63,255,${alpha.toFixed(3)})`;
          ctx.lineWidth   = 0.55;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    /* dots */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.alpha.toFixed(3)})`;
      ctx.fill();
    });
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    particles.forEach(p => p.update());
    draw();
  }

  function init() {
    resize();
    const N = mobile() ? 38 : 78;
    particles = Array.from({ length: N }, () => new Particle());
    cancelAnimationFrame(raf);
    loop();
  }

  /* mouse / touch */
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r  = canvas.getBoundingClientRect();
      mouse.x  = e.clientX - r.left;
      mouse.y  = e.clientY - r.top;
      mouse.active = true;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => { mouse.active = false; });
  }

  canvas.addEventListener('touchmove', e => {
    const r  = canvas.getBoundingClientRect();
    mouse.x  = e.touches[0].clientX - r.left;
    mouse.y  = e.touches[0].clientY - r.top;
    mouse.active = true;
  }, { passive: true });

  canvas.addEventListener('touchend', () => { mouse.active = false; });

  window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); }, { passive: true });

  /* start after fonts/layout settle */
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init, { once: true });
})();


/* ---- Hero mouse parallax ---- */
(function heroParallax() {
  const visual = document.getElementById('heroVisual');
  const hero   = document.querySelector('.hero');
  if (!visual || !hero) return;
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;
  let animating = false;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left)  / r.width  - 0.5) * 18;
    ty = ((e.clientY - r.top)   / r.height - 0.5) * 12;
    if (!animating) { animating = true; requestAnimationFrame(tick); }
  }, { passive: true });

  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

  function tick() {
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;
    visual.style.transform = `translate(${cx * 0.38}px, ${cy * 0.38}px)`;
    if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
      requestAnimationFrame(tick);
    } else {
      animating = false;
    }
  }
})();


/* ---- Stat bar animation ---- */
(function statBars() {
  const bars = document.querySelectorAll('.stat-fill');
  if (!bars.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.style.width = '0';
      requestAnimationFrame(() => {
        el.style.transition = 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s';
        el.style.width = el.style.getPropertyValue('--w') || '70%';
      });
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  bars.forEach(b => {
    const target = getComputedStyle(b).getPropertyValue('--w').trim() || '70%';
    b.style.setProperty('--w', target);
    b.style.width = '0';
    io.observe(b);
  });
})();
