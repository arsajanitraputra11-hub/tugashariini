/**
 * SMK Nusantara 1 — Main JavaScript
 * Handles: Navbar scroll, mobile menu, tabs, gallery filter,
 *          form validation, back-to-top, smooth scroll, animations
 */

(function () {
  'use strict';

  /* ============================================================
     NAVBAR — scroll effect + mobile toggle
     ============================================================ */
  const navbar      = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = document.querySelectorAll('.navbar__link');

  // Scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
    toggleBackToTop();
  }, { passive: true });

  // Mobile hamburger
  hamburgerBtn.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navMenu.addEventListener('click', function (e) {
    if (e.target.matches('.navbar__link') || e.target.matches('.dropdown__item')) {
      closeMenu();
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.navbar__dropdown').forEach(function (item) {
    const link = item.querySelector('.navbar__link--dropdown');
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ============================================================
     ACTIVE NAV LINK — based on scroll position
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');
      const link = navMenu.querySelector(`a[href="#${sectionId}"]`);

      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL — with navbar offset
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarH   = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarH - 8;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  /* ============================================================
     PROFILE TABS
     ============================================================ */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('aria-controls');

      // Update buttons
      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ============================================================
     GALLERY FILTER
     ============================================================ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galeriItems = document.querySelectorAll('.galeri__item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Show/hide items
      galeriItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ============================================================
     CONTACT FORM VALIDATION
     ============================================================ */
  const kontakForm  = document.getElementById('kontakForm');
  const formSuccess = document.getElementById('formSuccess');

  if (kontakForm) {
    kontakForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        simulateSubmit();
      }
    });

    // Live validation
    ['nama', 'email', 'keperluan', 'pesan'].forEach(function (fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('blur', function () { validateField(this); });
        field.addEventListener('input', function () {
          if (this.classList.contains('error')) { validateField(this); }
        });
      }
    });
  }

  function validateField(field) {
    const errorEl = document.getElementById(field.id + 'Error');
    let message = '';

    if (field.required && !field.value.trim()) {
      message = 'Kolom ini wajib diisi.';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        message = 'Format email tidak valid.';
      }
    }

    if (message) {
      field.classList.add('error');
      if (errorEl) { errorEl.textContent = message; }
      return false;
    } else {
      field.classList.remove('error');
      if (errorEl) { errorEl.textContent = ''; }
      return true;
    }
  }

  function validateForm() {
    let isValid = true;
    ['nama', 'email', 'keperluan', 'pesan'].forEach(function (fieldId) {
      const field = document.getElementById(fieldId);
      if (field && !validateField(field)) { isValid = false; }
    });
    return isValid;
  }

  function simulateSubmit() {
    const submitBtn = kontakForm.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnIcon   = submitBtn.querySelector('.btn-icon');

    // Loading state
    submitBtn.disabled = true;
    if (btnText) { btnText.textContent = 'Mengirim...'; }
    if (btnIcon) { btnIcon.textContent = '⏳'; }

    setTimeout(function () {
      submitBtn.disabled = false;
      if (btnText) { btnText.textContent = 'Kirim Pesan'; }
      if (btnIcon) { btnIcon.textContent = '→'; }

      kontakForm.reset();
      kontakForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      formSuccess.textContent = '✅ Pesan Anda berhasil dikirim! Kami akan menghubungi Anda dalam 1×24 jam kerja.';
      formSuccess.classList.add('visible');

      setTimeout(function () {
        formSuccess.classList.remove('visible');
        formSuccess.textContent = '';
      }, 6000);
    }, 1500);
  }

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     INTERSECTION OBSERVER — fade-in animations
     ============================================================ */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe animatable elements
  const animatables = document.querySelectorAll(
    '.fasilitas__card, .program__card, .berita__card, .galeri__item, .testimoni__card, .info-card, .kontak__info, .kontak__form-container'
  );

  animatables.forEach(function (el, index) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s`;
    observer.observe(el);
  });

  /* ============================================================
     COUNTER ANIMATION — hero stats
     ============================================================ */
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(start).toLocaleString('id-ID') + suffix;
    }, 16);
  }

  const heroStatsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.hero__stat strong').forEach(function (el) {
          const text   = el.textContent.trim();
          const match  = text.match(/^([\d,\.]+)(\+?%?)(.*)$/);
          if (match) {
            const num    = parseFloat(match[1].replace(/[,\.]/g, '').replace('.', ''));
            const suffix = text.replace(/[\d]/g, '').replace(',', '').replace('.', '');
            animateCounter(el, num, suffix, 1500);
          }
        });
        heroStatsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) { heroStatsObserver.observe(heroStats); }

  /* ============================================================
     KEYBOARD ACCESSIBILITY — close menu on Escape
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  /* ============================================================
     INIT
     ============================================================ */
  updateActiveNavLink();
  toggleBackToTop();

  console.log('SMK Muhammadiyah Pakem — Website loaded successfully ✅');

})();
