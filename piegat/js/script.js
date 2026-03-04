/* =============================================
   PIEGAT FILMS — Main Script
   Vanilla JS, sem frameworks
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ===================== NAVBAR SCROLL ===================== */
  var navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // initial check

  /* ===================== MOBILE MENU ===================== */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  menuToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('mobile-menu--open');
    menuToggle.classList.toggle('navbar__toggle--open', isOpen);
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('mobile-menu--open');
      menuToggle.classList.remove('navbar__toggle--open');
    });
  });

  /* ===================== SCROLL REVEAL ===================== */
  var reveals = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-60px 0px'
  });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ===================== SECTION VISIBILITY (for special sections) ===================== */
  var specialSections = document.querySelectorAll('.manifesto, .transicao');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-80px 0px'
  });

  specialSections.forEach(function (el) {
    sectionObserver.observe(el);
  });

  /* ===================== PORTFOLIO FILTER ===================== */
  var filterButtons = document.querySelectorAll('.portfolio__filter');
  var portfolioItems = document.querySelectorAll('.portfolio__item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Filter items with animation
      portfolioItems.forEach(function (item) {
        var category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('portfolio__item--hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(function () {
            item.style.transition = 'opacity 0.4s, transform 0.4s';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-20px)';
          setTimeout(function () {
            item.classList.add('portfolio__item--hidden');
          }, 400);
        }
      });
    });
  });

  /* ===================== SMOOTH SCROLL for anchor links ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar.offsetHeight;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===================== PARALLAX HERO BACKGROUND ===================== */
  var heroBg = document.querySelector('.hero__bg');

  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrolled < heroHeight) {
        var translateY = scrolled * 0.3;
        var scale = 1 + (scrolled / heroHeight) * 0.15;
        heroBg.style.transform = 'translateY(' + translateY + 'px) scale(' + scale + ')';
      }
    }, { passive: true });
  }

});
