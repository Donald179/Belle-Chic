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

/* ── 7. PRODUCT PREVIEW MODAL ── */
const productModal = document.getElementById('productModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductCategory = document.getElementById('modalProductCategory');
const modalProductTitle = document.getElementById('modalProductTitle');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalProductDesc = document.getElementById('modalProductDesc');
const sizeOptions = document.getElementById('sizeOptions');
const colorOptions = document.getElementById('colorOptions');
const modalOrderBtn = document.getElementById('modalOrderBtn');
const productOptions = document.querySelector('.product-options');

const productOptionPresets = {
  sac: { sizes: ['Petit', 'Moyen', 'Grand'], colors: ['Caramel', 'Noir', 'Blanc', 'Rose'] },
  vetement: { sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Beige', 'Rose', 'Noir', 'Blanc'] },
  lingerie: { sizes: ['S', 'M', 'L'], colors: ['Noir', 'Rouge', 'Beige'] },
  chaussures: { sizes: ['36', '37', '38', '39', '40', '41'], colors: ['Noir', 'Blanc', 'Rouge'] },
  parfun: { sizes: [], colors: [] },
  parfum: { sizes: [], colors: [] },
  default: { sizes: ['S', 'M', 'L'], colors: ['Noir', 'Beige', 'Rose'] },
};

let currentProductName = '';
let selectedSize = '';
let selectedColor = '';

function getProductPreset(card) {
  const categoryKey = card.dataset.category?.toLowerCase() || 'default';
  return productOptionPresets[categoryKey] || productOptionPresets.default;
}

function setModalOrderLink() {
  let message = `Bonjour Belle & Chic, je souhaite commander ${currentProductName}.`;
  if (selectedSize) message = `Bonjour Belle & Chic, je souhaite commander ${currentProductName} en taille ${selectedSize}.`;
  if (selectedColor && !selectedSize) message = `Bonjour Belle & Chic, je souhaite commander ${currentProductName} en couleur ${selectedColor}.`;
  if (selectedSize && selectedColor) message = `Bonjour Belle & Chic, je souhaite commander ${currentProductName} en taille ${selectedSize} et couleur ${selectedColor}.`;
  modalOrderBtn.href = `https://wa.me/22655757299?text=${encodeURIComponent(message)}`;
}

function createOptionButtons(container, options, activeValue, onSelect) {
  container.innerHTML = '';
  options.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `option-btn${option === activeValue ? ' active' : ''}`;
    button.textContent = option;
    button.addEventListener('click', () => {
      container.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      onSelect(option);
      setModalOrderLink();
    });
    container.appendChild(button);
  });
}

function openProductModal(card) {
  const img = card.querySelector('.pc-img img');
  const title = card.querySelector('h3')?.textContent.trim() || 'Produit';
  const category = card.querySelector('.pc-cat')?.textContent.trim() || '';
  const price = card.querySelector('.pc-price')?.textContent.trim() || '';
  let description = `Sélectionnez la taille et la couleur souhaitées avant de commander votre ${title}.`;

  currentProductName = title;
  modalProductImage.src = img?.src || '';
  modalProductImage.alt = img?.alt || title;
  modalProductCategory.textContent = category;
  modalProductTitle.textContent = title;
  modalProductPrice.textContent = price;
  modalProductDesc.textContent = description;

  const preset = getProductPreset(card);
  selectedSize = preset.sizes[0];
  selectedColor = preset.colors[0];

  // If product has no size/color options (e.g. parfums), hide options and simplify description
  if ((preset.sizes.length === 0) && (preset.colors.length === 0)) {
    description = `Produit prêt à commander — cliquez sur Commander.`;
    if (productOptions) productOptions.style.display = 'none';
    // clear any leftover option buttons
    if (sizeOptions) sizeOptions.innerHTML = '';
    if (colorOptions) colorOptions.innerHTML = '';
    selectedSize = '';
    selectedColor = '';
  } else {
    if (productOptions) productOptions.style.display = '';
    createOptionButtons(sizeOptions, preset.sizes, selectedSize, (value) => selectedSize = value);
    createOptionButtons(colorOptions, preset.colors, selectedColor, (value) => selectedColor = value);
  }
  setModalOrderLink();

  if (productModal) {
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeProductModal() {
  if (productModal) {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function replacePreviewLinks() {
  document.querySelectorAll('.pc-overlay .pc-wa-btn').forEach(anchor => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pc-preview-btn';
    button.innerHTML = anchor.innerHTML;
    anchor.replaceWith(button);
  });
}

function initProductPreview() {
  replacePreviewLinks();

  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      openProductModal(card);
    });
  });

  document.querySelectorAll('.pc-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      if (card) openProductModal(card);
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);
  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal?.classList.contains('active')) {
      closeProductModal();
    }
  });
}

initProductPreview();

/* ── 8. CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const reviewForm = document.getElementById('reviewForm');
const reviewSuccess = document.getElementById('reviewSuccess');

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('reviewFirstName').value.trim();
    const lastName = document.getElementById('reviewLastName').value.trim();
    const content = document.getElementById('reviewMessage').value.trim();
    if (!firstName || !lastName || !content) {
      alert('Veuillez compléter tous les champs pour envoyer votre avis.');
      return;
    }
    const reviews = JSON.parse(localStorage.getItem('bc_reviews') || '[]');
    reviews.push({ firstName, lastName, content, date: new Date().toLocaleString() });
    localStorage.setItem('bc_reviews', JSON.stringify(reviews));
    reviewForm.reset();
    if (reviewSuccess) {
      reviewSuccess.style.display = 'block';
      setTimeout(() => { reviewSuccess.style.display = 'none'; }, 5000);
    }
  });
}

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
