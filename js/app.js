/* ============================================================
   NURTURE & GLOW — App JS v2
   ============================================================ */

// ---- Page Loader ----
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const hide = () => loader.classList.add('loader-hidden');
  if (document.readyState === 'complete') {
    setTimeout(hide, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 400));
  }
})();

// ---- Sticky Nav ----
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Float Book: hide until past hero on mobile ----
const floatBook = document.querySelector('.float-book');
if (floatBook) {
  const hero = document.querySelector('.hero');
  const updateFloatBook = () => {
    if (window.innerWidth > 768) return;
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    floatBook.style.opacity = heroBottom < 0 ? '1' : '0';
    floatBook.style.pointerEvents = heroBottom < 0 ? 'auto' : 'none';
  };
  window.addEventListener('scroll', updateFloatBook, { passive: true });
  window.addEventListener('resize', updateFloatBook);
  updateFloatBook();
}

// ---- Mobile Menu ----
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (hamburger)  hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
if (mobileMenu)  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ---- Scroll Reveal (below-fold elements only) ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Only observe elements NOT in the hero section
document.querySelectorAll('.reveal').forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el);
});

// ---- Animated Counters ----
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      animateCount(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const fps      = 60;
  const steps    = duration / (1000 / fps);
  let   current  = 0;
  const inc      = target / steps;
  const timer = setInterval(() => {
    current += inc;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 1000 / fps);
}

// ---- Active Nav Link ----
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
});

// ---- Parallax Hero (subtle) ----
const heroBgImg = document.querySelector('.hero-bg-img img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBgImg.style.transform = `scale(1) translateY(${y * 0.22}px)`;
    }
  }, { passive: true });
}

// ---- FAQ Accordion ----
document.querySelectorAll('.faq-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const body   = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(s => {
      s.classList.remove('open');
      const b = s.querySelector('.faq-body');
      if (b) b.style.maxHeight = '0';
      s.querySelector('.faq-toggle')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen && body) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Smooth in-page anchor scrolling ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Subtle grain overlay ----
(function grain() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const d   = ctx.createImageData(256, 256);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255;
    d.data[i] = d.data[i+1] = d.data[i+2] = v;
    d.data[i+3] = 255;
  }
  ctx.putImageData(d, 0, 0);
  c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;opacity:0.018;mix-blend-mode:overlay;';
  document.body.appendChild(c);
})();

// ---- Before/After Carousel ----
(function () {
  const track = document.getElementById('baTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.ba-slide');
  const dots   = document.querySelectorAll('.ba-dot');
  let current  = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('baPrev')?.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); startAuto(); });
  document.getElementById('baNext')?.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { clearInterval(autoTimer); goTo(+d.dataset.slide); startAuto(); }));

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { clearInterval(autoTimer); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
  startAuto();
})();

// ---- Stay in the Glow Popup ----
(function () {
  const STORAGE_KEY = 'ng_glow_sub_v2';
  const SEEN_KEY    = 'ng_glow_seen_v2';
  const RESEEN_DAYS = 7;

  const overlay = document.getElementById('ngPopupOverlay');
  if (!overlay) return;

  // Don't show if already subscribed or recently seen
  const subscribed = localStorage.getItem(STORAGE_KEY);
  const lastSeen   = localStorage.getItem(SEEN_KEY);
  const tooSoon    = lastSeen && (Date.now() - parseInt(lastSeen)) < RESEEN_DAYS * 86400000;
  if (subscribed || tooSoon) return;

  let shown = false;

  const open  = () => {
    if (shown) return;
    shown = true;
    overlay.classList.add('ng-popup-open');
  };
  const close = () => {
    overlay.classList.remove('ng-popup-open');
    localStorage.setItem(SEEN_KEY, Date.now().toString());
  };

  // ── Trigger 0: Fallback timer (6 seconds) ──
  setTimeout(open, 6000);

  // ── Trigger 1: Exit intent (mouse leaves viewport from top) — Desktop ──
  document.addEventListener('mouseleave', e => {
    if (e.clientY <= 0) open();
  });

  // ── Trigger 2: Scroll past midpoint — Desktop & Mobile ──
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrolled > 0.5) open();
  }, { passive: true });

  // Close on overlay click, X button, skip, or Escape
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.getElementById('ngPopupClose')?.addEventListener('click', close);
  document.getElementById('ngSkip')?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('ng-popup-open')) close();
  });

  // Tab switcher
  const tabs   = overlay.querySelectorAll('.ng-tab');
  const fEmail = document.getElementById('fieldEmail');
  const fPhone = document.getElementById('fieldPhone');
  const iEmail = document.getElementById('ngEmail');
  const iPhone = document.getElementById('ngPhone');

  function setTab(tab) {
    tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
    const mode = tab.dataset.tab;
    if (fEmail) fEmail.style.display = (mode === 'sms')   ? 'none' : '';
    if (fPhone) fPhone.style.display = (mode === 'email') ? 'none' : '';
  }
  tabs.forEach(t => t.addEventListener('click', () => setTab(t)));

  // Form submission
  document.getElementById('ngGlowForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const consent = document.getElementById('ngConsent');
    if (!consent.checked) { consent.focus(); return; }

    const email = iEmail?.value.trim();
    const phone = iPhone?.value.trim();
    const activeTab = overlay.querySelector('.ng-tab.active')?.dataset.tab;

    if (activeTab !== 'sms'   && !email) { iEmail?.focus(); return; }
    if (activeTab !== 'email' && !phone) { iPhone?.focus(); return; }

    // ── INTEGRATION POINT ──────────────────────────────────────
    // Replace the console.log below with your actual form submission.
    // For Klaviyo: use their List Subscribe API or embed form action.
    // For Mailchimp: replace with fetch() to your Mailchimp endpoint.
    // ───────────────────────────────────────────────────────────
    console.log('Glow signup:', { email, phone, type: activeTab });

    // Show success
    this.style.display = 'none';
    document.getElementById('ngSuccess').style.display = 'block';
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(close, 3200);
  });
})();
