/* ============================================================
   Belle & Chic – script.js  |  Premium Fashion Brand
   ============================================================ */

/* ── 1. ANNOUNCE BAR HEIGHT ── */
function setAnnounceOffset() {
  const bar = document.querySelector('.announce-bar');
  const navbar = document.getElementById('navbar');
  if (bar && navbar) {
    const h = bar.offsetHeight;
    navbar.style.top = h + 'px';
    // Update CSS var for page offset
    document.documentElement.style.setProperty('--announce-h', h + 'px');
  }
}
setAnnounceOffset();
window.addEventListener('resize', setAnnounceOffset);

/* ── 2. NAVBAR: scroll effect ── */
const navbar = document.getElementById('navbar');
const announceBar = document.querySelector('.announce-bar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);

  // Hide announce bar on scroll down
  if (announceBar) {
    if (scrollY > 80) {
      announceBar.style.transform = 'translateY(-100%)';
      announceBar.style.opacity = '0';
      navbar.style.top = '0';
    } else {
      announceBar.style.transform = 'translateY(0)';
      announceBar.style.opacity = '1';
      setAnnounceOffset();
    }
  }
  lastScroll = scrollY;
});

/* ── 3. HAMBURGER / MOBILE DRAWER ── */
const hamburger   = document.getElementById('hamburger');
const mobDrawer   = document.getElementById('mobDrawer');
const mobOverlay  = document.getElementById('mobOverlay');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  hamburger.classList.add('open');
  mobDrawer.classList.add('show');
  mobOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  hamburger.classList.remove('open');
  mobDrawer.classList.remove('show');
  mobOverlay.classList.remove('show');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => mobDrawer.classList.contains('show') ? closeDrawer() : openDrawer());
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (mobOverlay) mobOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-nav a').forEach(a => a.addEventListener('click', closeDrawer));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* ── 4. SCROLL REVEAL (Intersection Observer) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 5. CATEGORY CARDS → scroll to filtered products ── */
document.querySelectorAll('.cat-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const target = card.dataset.filterTarget;
    if (target) {
      // Activate the right filter
      const btn = document.querySelector(`.filter-btn[data-filter="${target}"]`);
      if (btn) btn.click();
      // Scroll to products section
      const prodSection = document.getElementById('produits');
      if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 6. PRODUCT FILTERS ── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let delay = 0;

    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animationDelay = delay + 'ms';
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'cardAppear .4s ease both';
        });
        delay += 60;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── 7. CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showFormError('Veuillez remplir tous les champs.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormError('Veuillez entrer un email valide.');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      formSuccess.style.display = 'block';
      btn.innerHTML = 'Envoyer <i class="fa-solid fa-paper-plane"></i>';
      btn.disabled = false;
      setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
    }, 1200);
  });
}

function showFormError(msg) {
  alert(msg);
}

/* ── 8. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 20 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 9. FLOATING WA: hide on contact section ── */
const floatWa = document.getElementById('floatWa');
if (floatWa) {
  const contactSection = document.getElementById('contact');
  const waObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      floatWa.style.transform = e.isIntersecting ? 'scale(0)' : 'scale(1)';
      floatWa.style.opacity   = e.isIntersecting ? '0' : '1';
    });
  }, { threshold: 0.3 });
  if (contactSection) waObserver.observe(contactSection);
}

/* ── 10. PRODUCT CARD TILT (subtle) ── */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 11. INJECT KEYFRAMES ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(style);
