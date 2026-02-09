/**
 * Portfolio - Mariam Ramy Elshazly
 * Vanilla JS: smooth scroll, scroll reveal, parallax, navbar, testimonials slider
 */

(function () {
  'use strict';

  // ========== DOM ELEMENTS ==========
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroParallaxBg = document.querySelector('.hero-parallax-bg');
  const revealOnLoad = document.querySelectorAll('.reveal-on-load');
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  const testimonialsTrack = document.querySelector('.testimonials-track');
  const sliderPrev = document.querySelector('.slider-btn.prev');
  const sliderNext = document.querySelector('.slider-btn.next');

  // ========== SMOOTH SCROLL ==========
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          navMenu.classList.remove('open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Smooth scroll for hero "Download CV" / "View LinkedIn" – no override (let default behavior work)
  // Only prevent default for in-page # links above

  // ========== MOBILE MENU TOGGLE ==========
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      const expanded = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
  }

  // ========== NAVBAR BACKGROUND ON SCROLL + ACTIVE LINK ==========
  const scrollThreshold = 80;
  const sectionIds = ['home', 'about', 'education', 'skills', 'projects', 'testimonials', 'certificates', 'contact'];

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = 'home';
    const viewportMiddle = window.scrollY + window.innerHeight / 2;

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionIds[i]);
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (viewportMiddle >= top && viewportMiddle < top + height) {
          current = sectionIds[i];
          break;
        }
      }
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ========== PARALLAX HERO BACKGROUND ==========
  function parallax() {
    if (!heroParallaxBg) return;
    const scrolled = window.scrollY;
    const rate = scrolled * 0.35;
    heroParallaxBg.style.transform = 'translate3d(0, ' + rate + 'px, 0)';
  }

  window.addEventListener('scroll', parallax, { passive: true });

  // ========== REVEAL ON LOAD (Hero) ==========
  function revealOnLoadHandler() {
    revealOnLoad.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(revealOnLoadHandler);
    });
  } else {
    requestAnimationFrame(revealOnLoadHandler);
  }

  // ========== HERO SCROLL-BACK REVEAL ==========
  // When user scrolls back to hero, re-trigger reveal animation
  const heroSection = document.getElementById('home');
  const heroRevealElements = heroSection ? heroSection.querySelectorAll('.reveal-on-load') : [];

  if (heroSection && heroRevealElements.length) {
    const heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            heroRevealElements.forEach(function (el) {
              el.classList.add('revealed');
            });
          } else {
            heroRevealElements.forEach(function (el) {
              el.classList.remove('revealed');
            });
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.25 }
    );
    heroObserver.observe(heroSection);
  }

  // ========== SCROLL REVEAL (Intersection Observer) ==========
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, revealOptions);

  scrollRevealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ========== TESTIMONIAL STAR RATINGS ==========
  document.querySelectorAll('.testimonial-stars[data-rating]').forEach(function (starsEl) {
    const rating = parseInt(starsEl.getAttribute('data-rating') || 5, 10);
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += '<span class="star' + (i < rating ? '' : ' empty') + '" aria-hidden="true">★</span>';
    }
    starsEl.innerHTML = html;
  });

  // ========== TESTIMONIALS SLIDER ==========
  let testimonialIndex = 0;
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const totalTestimonials = testimonialCards.length;

  function goToTestimonial(index) {
    if (totalTestimonials === 0) return;
    testimonialIndex = (index + totalTestimonials) % totalTestimonials;
    const offset = -testimonialIndex * 100;
    if (testimonialsTrack) {
      testimonialsTrack.style.transform = 'translateX(' + offset + '%)';
    }
  }

  if (sliderPrev) {
    sliderPrev.addEventListener('click', function () {
      goToTestimonial(testimonialIndex - 1);
    });
  }
  if (sliderNext) {
    sliderNext.addEventListener('click', function () {
      goToTestimonial(testimonialIndex + 1);
    });
  }

  // Optional: auto-advance testimonials every 5s
  setInterval(function () {
    goToTestimonial(testimonialIndex + 1);
  }, 5000);

  // ========== FOOTER YEAR ==========
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
