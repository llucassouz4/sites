/* ============================================================
   INOVACRIA — script.js
   Clean, intentional interactions.
   ============================================================ */

'use strict';


/* ===== NAVBAR: stuck state ===== */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('stuck', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ===== MOBILE MENU ===== */
(function () {
  const burger     = document.getElementById('burger');
  const menu       = document.getElementById('mobileMenu');
  const mobileLinks = menu ? menu.querySelectorAll('a') : [];

  if (!burger || !menu) return;

  function open() {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.style.display = 'flex';
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Wait for transition before hiding
    menu.addEventListener('transitionend', () => {
      if (!menu.classList.contains('open')) menu.style.display = '';
    }, { once: true });
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? close() : open();
  });

  mobileLinks.forEach(link => link.addEventListener('click', close));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
      close();
    }
  });
})();


/* ===== SMOOTH ANCHOR SCROLL ===== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 68; // nav height
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();


/* ===== SCROLL REVEAL ===== */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('in-view'), delay);
      observer.unobserve(el);
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -32px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ===== HERO: reveal on load ===== */
(function () {
  // Stagger hero elements that already have .reveal class
  window.addEventListener('load', () => {
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), 80 + i * 100);
    });
  });
})();


/* ===== ACTIVE NAV LINK ===== */
(function () {
  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navAnchors.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navAnchors.forEach(a => {
        const match = a.getAttribute('href') === `#${id}`;
        a.style.color = match ? 'var(--ink)' : '';
        a.style.fontWeight = match ? '600' : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();


/* ===== PROJECT CARD: image lazy load fallback ===== */
(function () {
  // If image fails to load, gracefully keep the CSS fallback color
  document.querySelectorAll('.project-img').forEach(el => {
    const bgUrl = el.style.backgroundImage;
    if (!bgUrl || bgUrl === 'none') return;

    const urlMatch = bgUrl.match(/url\(["']?([^"')]+)["']?\)/);
    if (!urlMatch) return;

    const img = new Image();
    img.onerror = () => {
      el.style.backgroundImage = 'none';
    };
    img.src = urlMatch[1];
  });
})();


/* ===== PREVENT LAYOUT SHIFT ON FONT LOAD ===== */
document.documentElement.classList.add('fonts-loading');
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-loaded');
  });
}
