/* ============================================================
   SCROLL REVEAL — Intersection Observer
============================================================ */
(function initReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings inside the same parent
                    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                    const idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 0.08}s`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ============================================================
   SMOOTH SCROLL for anchor links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});


/* ============================================================
   CTA BUTTON — checkout redirect
   Substitua o "#" nos links href pelo seu link de checkout
============================================================ */
document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Se ainda é placeholder, não redirecionar
        if (!href || href === '#' || href.startsWith('#')) return;
        window.location.href = href;
    });
});


/* ============================================================
   TOP BAR — ocultar após scroll
============================================================ */
(function topBarBehavior() {
    const bar = document.querySelector('.top-bar');
    if (!bar) return;
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 200 && y > lastY) {
            bar.style.transform = 'translateY(-100%)';
            bar.style.transition = 'transform 0.3s ease';
        } else if (y < lastY) {
            bar.style.transform = 'translateY(0)';
        }
        lastY = y;
    }, { passive: true });
})();


/* ============================================================
   AWARENESS CARDS — stagger on load
============================================================ */
(function awarenessStagger() {
    const cards = document.querySelectorAll('.awareness-card');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.awareness-card');
                    cards.forEach((card, i) => {
                        card.style.transitionDelay = `${i * 0.07}s`;
                        card.classList.add('visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    const grid = document.querySelector('.awareness__grid');
    if (grid) observer.observe(grid);
})();


/* ============================================================
   OFFER CARDS — stagger on load
============================================================ */
(function offerStagger() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.offer-card');
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    const grid = document.querySelector('.offer__cards');
    if (grid) {
        grid.querySelectorAll('.offer-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        observer.observe(grid);
    }
})();
