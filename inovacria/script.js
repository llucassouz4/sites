/* =====================================================
   INOVACRIA — script.js
   Premium interactions & animations
   ===================================================== */

'use strict';

/* ===== NAVBAR SCROLL BEHAVIOR ===== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');

  // Mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav-menu-mobile';
  mobileMenu.innerHTML = `
    <a href="#services" >Serviços</a>
    <a href="#portfolio">Portfólio</a>
    <a href="#process">Processo</a>
    <a href="#contact">Começar projeto</a>
  `;
  navbar.after(mobileMenu);

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Scrolled state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 20);
    lastScroll = scrollY;
  }, { passive: true });
})();


/* ===== FADE-IN ON SCROLL ===== */
(function initIntersectionObserver() {
  const elements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ===== SMOOTH ANCHOR SCROLL ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ===== HERO PARALLAX ===== */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 8;
      const x = dx * depth;
      const y = dy * depth;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, { passive: true });
})();


/* ===== MOCKUP BAR ANIMATION ===== */
(function initBarAnimation() {
  const bars = document.querySelectorAll('.chart-bars .bar');
  if (!bars.length) return;

  function animateBars() {
    bars.forEach((bar, i) => {
      const originalH = bar.style.getPropertyValue('--h');
      const base = parseInt(originalH, 10);
      const variance = Math.floor(Math.random() * 20) - 10;
      const newH = Math.max(15, Math.min(98, base + variance));
      bar.style.setProperty('--h', newH + '%');
    });
  }

  setInterval(animateBars, 2800);
})();


/* ===== NUMBER COUNTER ANIMATION ===== */
(function initCounters() {
  const metricValues = document.querySelectorAll('.metric-value');

  function animateCounter(el) {
    const text = el.textContent.trim();
    const numMatch = text.match(/[\d.]+/);
    if (!numMatch) return;

    const target = parseFloat(numMatch[0]);
    const suffix = text.replace(numMatch[0], '');
    const isDecimal = numMatch[0].includes('.');
    const duration = 1400;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;
      const display = isDecimal ? current.toFixed(1) : Math.floor(current);
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricValues.forEach(el => observer.observe(el));
})();


/* ===== CARD TILT EFFECT ===== */
(function initTilt() {
  const cards = document.querySelectorAll('.service-card, .portfolio-card');
  const MAX_TILT = 4;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * MAX_TILT;
      const rotY = dx * MAX_TILT;
      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ===== CURSOR GLOW ===== */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(40,199,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();


/* ===== BUTTON RIPPLE ===== */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        transform: scale(0);
        animation: rippleAnim 0.5s ease-out forwards;
        pointer-events: none;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ===== PROCESS STEPS HIGHLIGHT ===== */
(function initProcessHighlight() {
  const steps = document.querySelectorAll('.process-step');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.step-number').style.background = 'var(--gradient)';
        entry.target.querySelector('.step-number').style.color = 'white';
        entry.target.querySelector('.step-number').style.borderColor = 'transparent';
      }
    });
  }, { threshold: 0.6 });

  steps.forEach(step => observer.observe(step));
})();


/* ===== TRUST LOGO MARQUEE (on mobile) ===== */
(function initLogoMarquee() {
  if (window.innerWidth > 600) return;
  const logos = document.querySelector('.trust-logos');
  if (!logos) return;
  logos.style.flexWrap = 'nowrap';
  logos.style.overflowX = 'auto';
  logos.style.scrollbarWidth = 'none';
  logos.style.WebkitOverflowScrolling = 'touch';
  logos.style.paddingBottom = '4px';
  logos.style.msOverflowStyle = 'none';
})();


/* ===== PAGE LOAD REVEAL ===== */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';

      // Trigger hero fade-ups with stagger
      const heroFades = document.querySelectorAll('.hero .fade-up');
      heroFades.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, 200 + i * 130);
      });
    });
  });
})();


/* ===== ACTIVE NAV LINK ON SCROLL ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (!link) return;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.style.color = '');
        link.style.color = '#F1F5F9';
      }
    });
  }, { passive: true });
})();
