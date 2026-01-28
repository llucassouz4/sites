/**
 * Lucas Lima - Personal Trainer
 * Landing Page JavaScript
 * 
 * Features:
 * - Header scroll effect
 * - Mobile menu toggle
 * - Scroll animations
 * - Smooth scroll for anchor links
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // ========================================
    // Header Scroll Effect
    // ========================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('mobile-active');
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('mobile-active');
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function handleScrollAnimations() {
        const triggerBottom = window.innerHeight * 0.85;

        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    function handleSmoothScroll(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        }
    }

    // ========================================
    // Add Animation Delays
    // ========================================
    function setupAnimationDelays() {
        // Add staggered delays to grid items
        const gridSelectors = [
            '.pain-points-grid .pain-card',
            '.method-grid .method-card',
            '.benefits-grid .benefit-card',
            '.specializations-grid .spec-card',
            '.steps-grid .step-card',
            '.testimonials-grid .testimonial-card'
        ];

        gridSelectors.forEach(selector => {
            const items = document.querySelectorAll(selector);
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.1}s`;
            });
        });
    }

    // ========================================
    // Event Listeners
    // ========================================
    function setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', handleHeaderScroll);
        window.addEventListener('scroll', handleScrollAnimations);

        // Mobile menu
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Nav links smooth scroll
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // All anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        // Close mobile menu on click outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('mobile-active')) {
                if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Handle resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        });
    }

    // ========================================
    // Initialize
    // ========================================
    function init() {
        // Setup
        setupEventListeners();
        setupAnimationDelays();

        // Initial checks
        handleHeaderScroll();
        handleScrollAnimations();

        // Console message
        console.log('%c⚡ Lucas Lima Personal Trainer', 'color: #f97316; font-size: 20px; font-weight: bold;');
        console.log('%cLanding Page loaded successfully!', 'color: #a3a3a3;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
