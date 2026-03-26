/* ══════════════════════════════════════════════════════════════════
   LZ4 DIGITAL — Interactive Experience v3
   Premium performance digital agency
══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── UTILITIES ───────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
const noMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════════════════════════ */
function initLoader(onComplete) {
    const loader = $('#loader');
    const bar = $('#loaderBar');
    if (!loader || !bar) { onComplete(); return; }

    let progress = 0;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const raw = elapsed / duration;
        progress = Math.min(1, 1 - Math.pow(1 - raw, 3)); // ease-out-cubic
        bar.style.width = (progress * 100) + '%';

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            bar.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('is-done');
                document.body.classList.remove('is-loading');
                onComplete();
            }, 220);
        }
    }

    requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════════════════════════ */
function initCursor() {
    if (isMobile() || noMotion()) return;

    const cursor = $('#cursor');
    const dot = cursor ? $('.cursor__dot', cursor) : null;
    const ring = cursor ? $('.cursor__ring', cursor) : null;
    if (!cursor || !dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    }, { passive: true });

    // Instant dot, lerped ring
    function animate() {
        dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
        rx = lerp(rx, mx, 0.12);
        ry = lerp(ry, my, 0.12);
        ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
        raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    // Hover state
    const hoverEls = 'a, button, [role="tab"], .pj-card, .bento__card, .svc-item';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverEls)) cursor.classList.add('is-hover');
    }, { passive: true });

    document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverEls)) cursor.classList.remove('is-hover');
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(animate);
    });
}

/* ══════════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════════ */
function initNav() {
    const nav = $('#nav');
    const burger = $('#navBurger');
    const drawer = $('#navDrawer');
    if (!nav) return;

    let lastScroll = 0;
    let menuOpen = false;

    // Scroll: solid + hide/show
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('is-solid', y > 20);

        if (!menuOpen) {
            if (y > lastScroll && y > 120) nav.classList.add('is-hidden');
            else nav.classList.remove('is-hidden');
        }
        lastScroll = y;
    }, { passive: true });

    // Mobile menu toggle
    if (burger && drawer) {
        burger.addEventListener('click', () => {
            menuOpen = !menuOpen;
            burger.classList.toggle('is-open', menuOpen);
            burger.setAttribute('aria-expanded', menuOpen);
            drawer.classList.toggle('is-open', menuOpen);
            drawer.setAttribute('aria-hidden', !menuOpen);
            nav.classList.remove('is-hidden');
        });

        // Close on link click
        $$('.nav__drawer-link', drawer).forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', false);
                drawer.classList.remove('is-open');
                drawer.setAttribute('aria-hidden', true);
            });
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (menuOpen && !nav.contains(e.target)) {
                menuOpen = false;
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', false);
                drawer.classList.remove('is-open');
                drawer.setAttribute('aria-hidden', true);
            }
        });
    }

    // Active nav link via IntersectionObserver
    const sections = $$('section[id], div[id]');
    const links = $$('.nav__link');

    if (sections.length && links.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(l => {
                        l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        sections.forEach(s => io.observe(s));
    }
}

/* ══════════════════════════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — Particle mesh
══════════════════════════════════════════════════════════════════ */
function initHeroCanvas() {
    const canvas = $('#heroCanvas');
    if (!canvas || noMotion()) return;

    const ctx = canvas.getContext('2d');
    const COUNT = isMobile() ? 32 : 72;
    const MAX_DIST = isMobile() ? 100 : 160;
    const SPEED = 0.3;
    let W, H, particles, raf;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = Array.from({ length: COUNT }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r: Math.random() * 1.5 + 0.5,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Move
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        }

        // Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.18;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(79,139,255,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Dots
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(79,139,255,0.55)';
            ctx.fill();
        }

        raf = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    const ro = new ResizeObserver(() => {
        resize();
        createParticles();
    });
    ro.observe(canvas);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(draw);
    });
}

/* ══════════════════════════════════════════════════════════════════
   HERO REVEAL — GSAP
══════════════════════════════════════════════════════════════════ */
function startHero() {
    if (noMotion()) {
        // Just show everything
        $$('[data-hero]').forEach(el => { el.style.opacity = 1; });
        $$('.hero__line-inner').forEach(el => { el.style.transform = 'translateY(0)'; });
        return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Eyebrow badge
    const eyebrow = $('[data-hero="0"]');
    if (eyebrow) {
        tl.fromTo(eyebrow,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 },
            0
        );
    }

    // Headline lines — staggered clip reveal
    const lines = $$('.hero__line-inner');
    lines.forEach((line, i) => {
        tl.to(line,
            { y: '0%', duration: 1.0, ease: 'power4.out' },
            0.15 + i * 0.12
        );
    });

    // Sub
    const sub = $('[data-hero="5"]');
    if (sub) {
        tl.fromTo(sub,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.75 },
            0.62
        );
    }

    // CTAs
    const ctas = $('[data-hero="6"]');
    if (ctas) {
        tl.fromTo(ctas,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.65 },
            0.78
        );
    }

    // Metrics strip
    const strip = $('[data-hero="7"]');
    if (strip) {
        tl.fromTo(strip,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6 },
            1.0
        );
    }
}

/* ══════════════════════════════════════════════════════════════════
   MOUSE PARALLAX — Hero visual
══════════════════════════════════════════════════════════════════ */
function initParallax() {
    if (isMobile() || noMotion()) return;

    const els = $$('[data-parallax]');
    if (!els.length) return;

    let mx = 0, my = 0;
    let tx = [], ty = [];
    els.forEach(() => { tx.push(0); ty.push(0); });

    window.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function tick() {
        els.forEach((el, i) => {
            const strength = parseFloat(el.dataset.parallax || 0.03);
            const targetX = mx * strength * 80;
            const targetY = my * strength * 80;
            tx[i] = lerp(tx[i], targetX, 0.06);
            ty[i] = lerp(ty[i], targetY, 0.06);
            el.style.transform = `translate(${tx[i]}px, ${ty[i]}px)`;
        });
        requestAnimationFrame(tick);
    }
    tick();
}

/* ══════════════════════════════════════════════════════════════════
   SCROLL REVEALS — IntersectionObserver
══════════════════════════════════════════════════════════════════ */
function initScrollReveals() {
    const els = $$('[data-reveal]');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger within same parent
                const siblings = $$('[data-reveal]', entry.target.parentElement || document);
                const idx = siblings.indexOf(entry.target);
                const delay = Math.min(idx * 60, 300);
                setTimeout(() => entry.target.classList.add('is-visible'), delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
══════════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger || noMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    // Section titles stagger
    $$('.sec-title').forEach(title => {
        gsap.fromTo(title,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    once: true,
                }
            }
        );
    });

    // Portfolio cards stagger
    const pjCards = $$('.pj-card');
    if (pjCards.length) {
        gsap.fromTo(pjCards,
            { opacity: 0, y: 32 },
            {
                opacity: 1, y: 0,
                duration: 0.75, ease: 'power3.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '#portfolioGrid',
                    start: 'top 80%',
                    once: true,
                }
            }
        );
    }

    // Bento cards stagger
    const bentoCards = $$('.bento__card');
    if (bentoCards.length) {
        gsap.fromTo(bentoCards,
            { opacity: 0, y: 28, scale: 0.98 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.7, ease: 'power3.out',
                stagger: 0.07,
                scrollTrigger: {
                    trigger: '.bento',
                    start: 'top 80%',
                    once: true,
                }
            }
        );
    }

    // Manifesto quote
    const quote = $('.manifesto__text');
    if (quote) {
        gsap.fromTo(quote,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.manifesto',
                    start: 'top 70%',
                    once: true,
                }
            }
        );
    }

    // CTA headline
    const ctaH = $('.cta-section__headline');
    if (ctaH) {
        gsap.fromTo(ctaH,
            { opacity: 0, y: 36 },
            {
                opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.cta-section',
                    start: 'top 75%',
                    once: true,
                }
            }
        );
    }

    // Hero content fade on scroll
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        onUpdate: self => {
            const content = $('.hero__content');
            if (content) content.style.opacity = 1 - self.progress * 0.6;
        }
    });

    // Services list items
    const svcItems = $$('.svc-item');
    if (svcItems.length) {
        gsap.fromTo(svcItems,
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0,
                duration: 0.6, ease: 'power3.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: '.svc-system',
                    start: 'top 80%',
                    once: true,
                }
            }
        );
    }
}

/* ══════════════════════════════════════════════════════════════════
   COUNTERS — Animated number count
══════════════════════════════════════════════════════════════════ */
function initCounters() {
    const integers = $$('.js-counter');
    const decimals = $$('.js-counter-dec');
    const all = [...integers, ...decimals];
    if (!all.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const isDecimal = el.classList.contains('js-counter-dec');
            const target = parseFloat(el.dataset.target || 0);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const duration = 1800;
            const start = performance.now();

            function animate(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

                if (progress < 1) requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    all.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════════════
   BENTO BAR ANIMATIONS
══════════════════════════════════════════════════════════════════ */
function initBentoBars() {
    const bars = $$('.bento__bar-fill');
    if (!bars.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const w = el.dataset.w || 80;
            el.style.setProperty('--w', w + '%');
            el.style.width = w + '%';
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    bars.forEach(b => io.observe(b));
}

/* ══════════════════════════════════════════════════════════════════
   SERVICES — Split panel system
══════════════════════════════════════════════════════════════════ */
function initServices() {
    const items = $$('.svc-item');
    const panels = $$('.svc-panel');
    if (!items.length || !panels.length) return;

    function activate(idx) {
        items.forEach((item, i) => {
            const active = i === idx;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', active);
            item.setAttribute('tabindex', active ? '0' : '-1');
        });

        panels.forEach((panel, i) => {
            const active = i === idx;
            panel.classList.toggle('is-active', active);
            // On mobile, use hidden attr; on desktop, use CSS
            if (isMobile()) {
                panel.hidden = !active;
            } else {
                panel.hidden = false;
            }
        });
    }

    items.forEach((item, i) => {
        item.addEventListener('click', () => activate(i));

        // Keyboard navigation
        item.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                activate(Math.min(i + 1, items.length - 1));
                items[Math.min(i + 1, items.length - 1)].focus();
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                activate(Math.max(i - 1, 0));
                items[Math.max(i - 1, 0)].focus();
            }
        });
    });

    // Ensure correct initial state for mobile
    if (isMobile()) {
        panels.forEach((panel, i) => { panel.hidden = i !== 0; });
    }
}

/* ══════════════════════════════════════════════════════════════════
   PORTFOLIO FILTER
══════════════════════════════════════════════════════════════════ */
function initPortfolioFilter() {
    const btns = $$('.pf-btn');
    const cards = $$('.pj-card');
    if (!btns.length || !cards.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            btns.forEach(b => {
                b.classList.toggle('is-active', b === btn);
                b.setAttribute('aria-selected', b === btn);
            });

            cards.forEach(card => {
                const cat = card.dataset.cat;
                const show = filter === 'all' || cat === filter;
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
}

/* ══════════════════════════════════════════════════════════════════
   CARD TILT — 3D perspective effect
══════════════════════════════════════════════════════════════════ */
function initCardTilt() {
    if (isMobile() || noMotion()) return;

    const cards = $$('.pj-card, .bento__card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ══════════════════════════════════════════════════════════════════
   CTA CANVAS — Blob animation
══════════════════════════════════════════════════════════════════ */
function initCtaCanvas() {
    const canvas = $('#ctaCanvas');
    if (!canvas || noMotion()) return;

    const ctx = canvas.getContext('2d');
    let W, H, raf;
    let t = 0;

    const blobs = [
        { x: 0.5, y: 0.5, r: 0.35, vx: 0.0003, vy: 0.0002, color: [43, 92, 245] },
        { x: 0.3, y: 0.6, r: 0.25, vx: -0.0002, vy: 0.0004, color: [79, 139, 255] },
        { x: 0.7, y: 0.4, r: 0.28, vx: 0.0004, vy: -0.0003, color: [16, 24, 120] },
    ];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        t += 0.01;

        blobs.forEach(b => {
            const x = (Math.sin(t * (b.vx * 3000) + b.x * 10) * 0.15 + 0.5 + b.x * 0.1) * W;
            const y = (Math.cos(t * (b.vy * 3000) + b.y * 10) * 0.15 + 0.5 + b.y * 0.1) * H;
            const r = b.r * Math.min(W, H);

            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            const [R, G, B] = b.color;
            grad.addColorStop(0, `rgba(${R},${G},${B},0.20)`);
            grad.addColorStop(1, `rgba(${R},${G},${B},0)`);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(draw);
    });
}

/* ══════════════════════════════════════════════════════════════════
   SLOTS COUNTER — CTA urgency
══════════════════════════════════════════════════════════════════ */
function initSlots() {
    const el = $('#slotsLeft');
    if (!el) return;
    // Could be dynamic in a real implementation
    el.textContent = '3';
}

/* ══════════════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // Cursor (early — non-blocking)
    initCursor();

    // Loader → then start everything else
    initLoader(() => {
        // Hero animations
        startHero();

        // Parallax
        initParallax();

        // GSAP scroll animations
        initScrollAnimations();
    });

    // Nav (can init early)
    initNav();
    initSmoothScroll();

    // Canvas elements
    initHeroCanvas();
    initCtaCanvas();

    // Interactive components
    initServices();
    initPortfolioFilter();

    // Scroll-triggered behaviors
    initScrollReveals();
    initCounters();
    initBentoBars();

    // Desktop tilt
    initCardTilt();

    // CTA slots
    initSlots();
});
