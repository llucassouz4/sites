/* ============================================================
   GOMES Incorporadora e Construtora — script.js
   Animações, interações e comportamentos da landing page
   ============================================================ */

'use strict';

/* ── 1. HEADER: scroll behavior ──────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // inicializa no carregamento
})();


/* ── 2. MENU MOBILE ───────────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    // Impede scroll quando menu aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar ao clicar em um link
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── 3. PARALLAX HERO ─────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  // Desativa em dispositivos com preferência de movimento reduzido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function onScroll() {
    const scrollY = window.scrollY;
    // Move o fundo a 40% da velocidade de rolagem (parallax suave)
    heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 4. REVEAL ON SCROLL ─────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // anima apenas uma vez
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── 5. CONTADOR ANIMADO (seção números) ──────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.numbers__value[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = +el.dataset.target;
        const duration = 1600; // ms
        const step   = target / (duration / 16); // ~60fps
        let current  = 0;

        function tick() {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString('pt-BR');
          } else {
            el.textContent = Math.floor(current).toLocaleString('pt-BR');
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ── 6. CARROSSEL DE AVALIAÇÕES ───────────────────────────── */
(function initCarousel() {
  const track   = document.getElementById('avalTrack');
  const prevBtn = document.getElementById('avalPrev');
  const nextBtn = document.getElementById('avalNext');
  const dotsWrap = document.getElementById('avalDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards  = track.querySelectorAll('.aval__card');
  const total  = cards.length;
  let current  = 0;
  let autoTimer;

  // Criar dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'aval__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.aval__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
  });

  // Auto-avanço a cada 6 segundos
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Suporte a swipe (touch)
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  }, { passive: true });
})();


/* ── 7. SMOOTH SCROLL para âncoras ───────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 8. ANO ATUAL no rodapé ───────────────────────────────── */
(function setYear() {
  const el = document.getElementById('anoAtual');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── 9. GALERIA: lightbox simples ─────────────────────────── */
(function initLightbox() {
  const items = document.querySelectorAll('.galeria__item');
  if (!items.length) return;

  // Cria overlay do lightbox
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(10,3,6,.96); align-items:center; justify-content:center;
    cursor:zoom-out;
  `;
  const img = document.createElement('img');
  img.style.cssText = `
    max-width:90vw; max-height:90vh; object-fit:contain;
    box-shadow: 0 0 80px rgba(0,0,0,.5);
    animation: fadeUp .35s ease forwards;
  `;
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position:absolute; top:1.5rem; right:2rem;
    background:none; border:none; color:rgba(255,255,255,.7);
    font-size:2.5rem; cursor:pointer; line-height:1;
    transition: color .2s;
  `;
  closeBtn.addEventListener('mouseover', () => closeBtn.style.color = '#fff');
  closeBtn.addEventListener('mouseout',  () => closeBtn.style.color = 'rgba(255,255,255,.7)');

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const itemImg = item.querySelector('img');
      if (itemImg) open(itemImg.src, itemImg.alt);
    });
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === closeBtn) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ── 10. ACTIVE NAV LINK ao scrollar ─────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.header__nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            const active = link.getAttribute('href') === `#${id}`;
            link.style.color = active ? 'var(--white)' : '';
            // underline ativo
            if (active) {
              link.style.setProperty('--active', '1');
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => observer.observe(sec));
})();
