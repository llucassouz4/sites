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
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileNav');
  if (!burger || !menu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => isOpen ? close() : open());

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

  document.addEventListener('click', e => {
    if (isOpen && !menu.contains(e.target) && !burger.contains(e.target)) close();
  });
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
