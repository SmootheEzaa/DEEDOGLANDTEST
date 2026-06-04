/* ============================================
   DEEDOGLAND — Main JavaScript
   Animations, Interactions & Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Loading Screen ──
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1600);
  });
  // Fallback: hide after 3s max
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ── Navbar Scroll Effect ──
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // Navbar background
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (currentScroll > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScroll = currentScroll;
  });

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Mobile Menu Toggle ──
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── Active Navigation Link ──
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a');
  
  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(section => observerNav.observe(section));

  // ── Scroll Reveal Animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Don't unobserve — keeps re-entrancy
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Count-Up Animation for Hero Stats ──
  const statNumbers = document.querySelectorAll('.hero-stat .number');
  let statsCounted = false;

  function animateCountUp(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1);
        } else {
          el.textContent = target.toLocaleString() + '+';
        }
      }
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach((el, i) => {
          setTimeout(() => animateCountUp(el), i * 200);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ── Testimonials Carousel ──
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoPlayInterval;

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.getAttribute('data-index')));
      resetAutoPlay();
    });
  });

  function autoPlay() {
    autoPlayInterval = setInterval(() => {
      const next = (currentSlide + 1) % dots.length;
      goToSlide(next);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlay();
  }

  autoPlay();

  // Touch support for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  const carousel = document.getElementById('testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSlide < dots.length - 1) {
          goToSlide(currentSlide + 1);
        } else if (diff < 0 && currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
        resetAutoPlay();
      }
    }, { passive: true });
  }

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Parallax Effect on Hero ──
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  // ── Mouse Parallax on Floating Elements ──
  const floats = document.querySelectorAll('.hero-float');
  if (floats.length > 0) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      floats.forEach((el, i) => {
        const speed = (i + 1) * 8;
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // ── Magnetic Button Effect ──
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-3px) translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── Tilt Effect on Service Cards ──
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const tiltX = (y - 0.5) * 6;
      const tiltY = (x - 0.5) * -6;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-12px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });

  // ── Why Card Glow Follow ──
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,165,116,0.12), rgba(255,255,255,0.05) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ── Gallery Hover Ripple ──
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.zIndex = '2';
    });
    item.addEventListener('mouseleave', function() {
      this.style.zIndex = '';
    });
  });

  // ── Cursor Trail Effect (subtle) ──
  const cursorTrail = document.createElement('div');
  cursorTrail.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,165,116,0.3), transparent);
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.1s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursorTrail);

  document.addEventListener('mousemove', (e) => {
    cursorTrail.style.left = e.clientX - 10 + 'px';
    cursorTrail.style.top = e.clientY - 10 + 'px';
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursorTrail.style.display = 'none';
  }

  // ── Typing Effect for Badge ──
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    const text = heroBadge.textContent;
    heroBadge.textContent = '';
    heroBadge.style.opacity = '1';
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        heroBadge.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
    setTimeout(typeWriter, 1800);
  }

  console.log('🐾 Deedogland loaded successfully!');
});
