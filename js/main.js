document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const scrollTop = document.getElementById('scrollTop');

  // ── Header scroll behavior ──
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    scrollTop.classList.toggle('visible', window.scrollY > 500);
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Mobile nav ──
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  const dropdown = document.querySelector('.nav__dropdown');
  if (dropdown) {
    dropdown.querySelector('.nav__link').addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }

  // ── Active nav on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));

  // ── Hero Slider ──
  const heroSlides = document.querySelectorAll('.hero__slide');
  const heroDots = document.querySelectorAll('.hero__dot');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  let heroIndex = 0;
  let heroTimer;

  function showHeroSlide(index) {
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((s, i) => s.classList.toggle('active', i === heroIndex));
    heroDots.forEach((d, i) => d.classList.toggle('active', i === heroIndex));
  }

  function startHeroAuto() {
    heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 6000);
  }

  function resetHeroAuto() {
    clearInterval(heroTimer);
    startHeroAuto();
  }

  heroPrev.addEventListener('click', () => { showHeroSlide(heroIndex - 1); resetHeroAuto(); });
  heroNext.addEventListener('click', () => { showHeroSlide(heroIndex + 1); resetHeroAuto(); });
  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      showHeroSlide(parseInt(dot.dataset.slide, 10));
      resetHeroAuto();
    });
  });
  startHeroAuto();

  // ── Gallery Slider ──
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  let galleryPos = 0;

  function getGalleryShift() {
    const item = galleryTrack.querySelector('.gallery__item');
    if (!item) return 0;
    const gap = 16;
    return item.offsetWidth + gap;
  }

  function slideGallery(dir) {
    const items = galleryTrack.children.length;
    const visible = window.innerWidth <= 500 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    const maxPos = Math.max(0, items - visible);
    galleryPos = Math.max(0, Math.min(maxPos, galleryPos + dir));
    galleryTrack.style.transform = `translateX(-${galleryPos * getGalleryShift()}px)`;
  }

  galleryPrev.addEventListener('click', () => slideGallery(-1));
  galleryNext.addEventListener('click', () => slideGallery(1));

  // ── Testimonial Slider ──
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonials-dot');
  let testimonialIndex = 0;

  function showTestimonial(index) {
    testimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides.forEach((s, i) => s.classList.toggle('active', i === testimonialIndex));
    testimonialDots.forEach((d, i) => d.classList.toggle('active', i === testimonialIndex));
  }

  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => showTestimonial(parseInt(dot.dataset.slide, 10)));
  });
  setInterval(() => showTestimonial(testimonialIndex + 1), 8000);

  // ── Fade-up animations ──
  const fadeElements = document.querySelectorAll(
    '.service-card, .value-card, .why-card, .stat-item, .process-item, .detail-card, .contact__card'
  );
  fadeElements.forEach(el => el.classList.add('fade-up'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ── Counter animation ──
  const counters = document.querySelectorAll('.stat-item__num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target;
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ── Contact form ──
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thank you! Your message has been received. We will contact you shortly.';
    formNote.style.color = '#1a7f37';
    contactForm.reset();
    setTimeout(() => { formNote.textContent = ''; }, 5000);
  });
});
