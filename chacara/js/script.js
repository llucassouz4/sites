/* ============================================================
   CHÁCARA VÓ MOZART — script.js
   Módulos:
   00. Utilitários
   01. Header scroll behavior
   02. Menu mobile
   03. Scroll suave
   04. Active link on scroll
   05. Reveal on scroll (IntersectionObserver)
   06. Galeria — Lightbox
   07. Vídeos — modal
   08. Formulário — envio via WhatsApp
   09. Hero BG — transição no carregamento
   10. Footer — ano dinâmico
============================================================ */

'use strict';

/* ============================================================
   00. UTILITÁRIOS
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

console.log('🌿 Chácara Vô Mozart — v1.0');


/* ============================================================
   01. HEADER — scroll behavior
   Transparente sobre o hero → sólido ao rolar
============================================================ */
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  const THRESHOLD = 80;

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
})();


/* ============================================================
   02. MENU MOBILE
   - Toggle abre/fecha drawer
   - Overlay fecha ao clicar
   - Links fecham o menu
   - Escape fecha
   - Body overflow oculto quando aberto
============================================================ */
(function initMobileMenu() {
  const toggle  = $('#nav-toggle');
  const menu    = $('#nav-menu');
  const close   = $('#nav-close');
  const overlay = $('#nav-overlay');
  const links   = $$('.nav-link');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (overlay) {
      overlay.classList.add('active');
      overlay.removeAttribute('aria-hidden');
    }
    if (window.innerWidth <= 768 && close) {
      close.focus();
    }
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  if (close) {
    close.addEventListener('click', () => {
      closeMenu();
      toggle.focus();
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      // Fecha apenas se estiver aberto (drawer mobile)
      if (menu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Fecha ao redimensionar para desktop (evita menu "preso")
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu.classList.contains('open')) {
      closeMenu();
    }
  });
})();


/* ============================================================
   03. SCROLL SUAVE
   Ancora todos os links internos com offset do header
============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = $('#header')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   04. ACTIVE LINK ON SCROLL
   Atualiza o link ativo conforme a seção visível
============================================================ */
(function initActiveLinks() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const OFFSET = 130; // px do topo para considerar seção ativa

  function updateActive() {
    const scrollY = window.scrollY;
    let current = '';

    sections.forEach(section => {
      const top    = section.offsetTop - OFFSET;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ============================================================
   05. REVEAL ON SCROLL
   IntersectionObserver — adiciona classe 'visible' nos elementos
   Não afeta elementos dentro do hero (têm animação CSS própria)
============================================================ */
(function initReveal() {
  // Seleciona apenas os elementos fora do hero
  const heroSection = $('#inicio');
  const allReveal = $$('.reveal-up, .reveal-left, .reveal-right');

  const elements = allReveal.filter(el => {
    return !heroSection || !heroSection.contains(el);
  });

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   06. GALERIA — LIGHTBOX
   Clique em qualquer galeria-item abre o lightbox
   Prev / Next / Escape / Clique fora fecham
============================================================ */
(function initLightbox() {
  const items    = $$('.galeria-item');
  const lightbox = $('#lightbox');
  const img      = $('#lightbox-img');
  const closeBtn = $('#lightbox-close');
  const prevBtn  = $('#lightbox-prev');
  const nextBtn  = $('#lightbox-next');
  const counter  = $('#lightbox-counter');

  if (!lightbox || !items.length) return;

  let currentIndex = 0;
  const sources = items.map(item => item.dataset.src || '');
  const alts    = items.map(item => {
    return item.querySelector('img')?.alt || `Foto ${items.indexOf(item) + 1} da Chácara Vó Mozart`;
  });

  function openLightbox(index) {
    currentIndex = index;
    updateImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Limpa src depois da transição para evitar flash
    setTimeout(() => {
      if (!lightbox.classList.contains('active') && img) {
        img.src = '';
      }
    }, 300);
  }

  function updateImage() {
    if (!img) return;
    img.src = sources[currentIndex] || '';
    img.alt = alts[currentIndex] || '';
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${sources.length}`;
    }
  }

  function prev() {
    currentIndex = (currentIndex - 1 + sources.length) % sources.length;
    updateImage();
  }

  function next() {
    currentIndex = (currentIndex + 1) % sources.length;
    updateImage();
  }

  // Setup em cada item
  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', prev);
  if (nextBtn)  nextBtn.addEventListener('click', next);

  // Clique no fundo fecha
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado global
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Swipe touch para mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else         prev();
    }
  }, { passive: true });
})();


/* ============================================================
   07. VÍDEOS — MODAL
   Abre modal com iframe do YouTube
   Se data-video-id for placeholder, mostra mensagem elegante
============================================================ */
(function initVideos() {
  const thumbs   = $$('.video-thumb');
  const modal    = $('#video-modal');
  const frame    = $('#video-modal-frame');
  const closeBtn = $('#video-modal-close');

  if (!modal || !thumbs.length) return;

  // Número do WhatsApp — substitua pelo número real
  const WHATSAPP = '5547999999999';

  function isPlaceholderVideoId(id) {
    return !id || id.startsWith('SEU_VIDEO') || id.trim() === '';
  }

  function openModal(videoId) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (frame) {
      if (!isPlaceholderVideoId(videoId)) {
        // ID real do YouTube — incorpora o player
        frame.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
            title="Vídeo da Chácara Vó Mozart"
            style="width:100%;height:100%;border:none;border-radius:12px;">
          </iframe>`;
      } else {
        // Placeholder elegante
        frame.innerHTML = `
          <div class="video-coming-soon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#c8901e" stroke-width="1.4" style="opacity:0.8">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <h3>Vídeos em breve</h3>
            <p>Estamos preparando nossos vídeos.<br>
               Enquanto isso, entre em contato para conhecer o espaço pessoalmente.</p>
            <a href="https://wa.me/${WHATSAPP}?text=Olá! Gostaria de agendar uma visita à Chácara Vó Mozart."
               target="_blank"
               rel="noopener noreferrer"
               style="display:inline-flex;align-items:center;gap:0.5rem;margin-top:0.75rem;
                      padding:0.7rem 1.5rem;background:#c8901e;color:#1c0f05;
                      border-radius:9999px;font-weight:700;font-size:0.9rem;
                      text-decoration:none;transition:background 200ms ease;">
              Agendar uma Visita
            </a>
          </div>`;
      }
    }

    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Limpa conteúdo depois da transição (para o autoplay do YouTube)
    setTimeout(() => {
      if (!modal.classList.contains('active') && frame) {
        frame.innerHTML = '';
      }
    }, 300);
  }

  // Cada thumb e seu botão de play
  thumbs.forEach(thumb => {
    const playBtn = thumb.querySelector('.video-play-btn');
    const videoId = thumb.dataset.videoId || '';

    const handler = () => openModal(videoId);

    thumb.addEventListener('click', handler);

    if (playBtn) {
      playBtn.addEventListener('click', e => {
        e.stopPropagation();
        handler();
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
})();


/* ============================================================
   08. FORMULÁRIO — ENVIO VIA WHATSAPP
   Valida nome, telefone e interesse (obrigatórios)
   Monta mensagem e abre no WhatsApp
============================================================ */
(function initForm() {
  const form = $('#contato-form');
  if (!form) return;

  // Substitua pelo número real do WhatsApp (com código do país, sem +)
  const WHATSAPP_NUMBER = '5547999999999';

  // Campos obrigatórios
  const requiredFields = ['nome', 'telefone', 'interesse'];

  function formatarData(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function mapaInteresse(val) {
    const mapa = {
      'evento':            'Locação para Evento',
      'hospedagem':        'Hospedagem (casinhas)',
      'evento-hospedagem': 'Evento + Hospedagem',
      'visita':            'Agendar uma Visita',
      'orcamento':         'Orçamento Geral',
      'outro':             'Outro assunto',
    };
    return mapa[val] || val;
  }

  function clearErrors() {
    requiredFields.forEach(id => {
      const el = $(`#${id}`, form);
      if (el) el.classList.remove('error');
    });
  }

  function validar() {
    let isValid = true;
    clearErrors();

    requiredFields.forEach(id => {
      const el = $(`#${id}`, form);
      if (!el) return;
      const val = el.value.trim();
      if (!val) {
        el.classList.add('error');
        isValid = false;
      }
    });

    return isValid;
  }

  // Remove erro ao digitar
  requiredFields.forEach(id => {
    const el = $(`#${id}`, form);
    if (!el) return;
    el.addEventListener('input', () => el.classList.remove('error'));
    el.addEventListener('change', () => el.classList.remove('error'));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validar()) {
      // Foca no primeiro campo com erro
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Coleta os dados
    const nome      = ($('#nome', form)?.value ?? '').trim();
    const telefone  = ($('#telefone', form)?.value ?? '').trim();
    const interesse = ($('#interesse', form)?.value ?? '');
    const data      = ($('#data', form)?.value ?? '');
    const pessoas   = ($('#pessoas', form)?.value ?? '');
    const mensagem  = ($('#mensagem', form)?.value ?? '').trim();

    // Monta as linhas da mensagem
    const linhas = [
      `Olá! Entro em contato através do site da Chácara Vó Mozart.`,
      ``,
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      `*Interesse:* ${mapaInteresse(interesse)}`,
      data      ? `*Data desejada:* ${formatarData(data)}`  : null,
      pessoas   ? `*Número de pessoas:* ${pessoas}`          : null,
      mensagem  ? `*Mensagem:* ${mensagem}`                  : null,
    ].filter(line => line !== null).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(linhas)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();


/* ============================================================
   09. HERO BG — transição suave no carregamento
   Adiciona classe 'loaded' quando a imagem de fundo termina de carregar
============================================================ */
(function initHeroBg() {
  const heroBg = $('.hero-bg');
  if (!heroBg) return;

  // Extrai a URL da imagem de fundo via computedStyle
  const bgStyle = window.getComputedStyle(heroBg).backgroundImage;
  const match   = bgStyle.match(/url\(["']?(.+?)["']?\)/);

  if (match && match[1]) {
    const img = new Image();
    img.onload  = () => heroBg.classList.add('loaded');
    img.onerror = () => heroBg.classList.add('loaded'); // mostra mesmo sem imagem
    img.src = match[1];
  } else {
    // Sem imagem configurada — mostra o fundo imediatamente
    heroBg.classList.add('loaded');
  }
})();


/* ============================================================
   10. FOOTER — ano dinâmico
============================================================ */
(function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();
