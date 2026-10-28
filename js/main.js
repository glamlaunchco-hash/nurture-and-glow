/* ============================================
   NURTURE & GLOW — Main JavaScript
   ============================================ */

// ---- Sticky Nav ----
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ---- Mobile Menu ----
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
}
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- Scroll Animations ----
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
  observer.observe(el);
});

// ---- Active Nav Link ----
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- Testimonial Carousel ----
const carousel = document.querySelector('.testimonial-carousel');
if (carousel) {
  const track    = carousel.querySelector('.carousel-track');
  const cards    = carousel.querySelectorAll('.testimonial-card');
  const prevBtn  = carousel.querySelector('.carousel-prev');
  const nextBtn  = carousel.querySelector('.carousel-next');
  const dotsWrap = carousel.querySelector('.carousel-dots');

  if (!track || cards.length === 0) return;

  let current = 0;
  const total = cards.length;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    if (dotsWrap) dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoplay = setInterval(() => goTo(current + 1), 5500);
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5500);
  });

  // Touch support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });
}

// ---- Counter Animation ----
function animateCounter(el) {
  const target  = parseInt(el.dataset.count, 10);
  const suffix  = el.dataset.suffix || '';
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  let count      = 0;
  const increment = target / steps;
  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(count) + suffix;
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ---- Services Accordion (mobile) ----
document.querySelectorAll('.service-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.service-item');
    const body   = item.querySelector('.service-body');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.service-item').forEach(s => {
      s.classList.remove('open');
      const b = s.querySelector('.service-body');
      if (b) b.style.maxHeight = '0';
    });
    // Open clicked
    if (!isOpen && body) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ---- Grain overlay ----
(function addGrain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;opacity:0.022;mix-blend-mode:overlay;';
  canvas.width  = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(256, 256);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = Math.random() * 255;
    imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = v;
    imgData.data[i+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  document.body.appendChild(canvas);
})();
