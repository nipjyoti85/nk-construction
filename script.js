// ============================================================
// script.js — NK Construction & Infrastructure
// ============================================================

'use strict';

/* ── Loader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 2000);
});

/* ── Dark Mode ──────────────────────────────────────────────── */
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('nk-theme', theme);
  if (darkToggle) {
    darkToggle.innerHTML = theme === 'dark'
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
  }
}

// Init theme
const savedTheme = localStorage.getItem('nk-theme') || 'light';
applyTheme(savedTheme);

darkToggle?.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ── Sticky Navbar ───────────────────────────────────────────── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ── Active Nav Link ─────────────────────────────────────────── */
function setActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    const link = document.querySelector(`a.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

/* ── Scroll To Top ───────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTopBtn');
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Reveal on Scroll ────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Counter Animation ───────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ── Gallery ─────────────────────────────────────────────────── */
const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', cat: 'commercial', label: 'Commercial Tower' },
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80', cat: 'residential', label: 'Luxury Villa' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', cat: 'interior', label: 'Interior Design' },
  { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', cat: 'infrastructure', label: 'Bridge Project' },
  { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&q=80', cat: 'commercial', label: 'Office Complex' },
  { src: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&q=80', cat: 'residential', label: 'Apartment Tower' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', cat: 'exterior', label: 'Modern Exterior' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', cat: 'interior', label: 'Living Space' },
  { src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&q=80', cat: 'residential', label: 'Contemporary Home' },
  { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', cat: 'commercial', label: 'Corporate Office' },
  { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80', cat: 'infrastructure', label: 'Road Construction' },
  { src: 'https://images.unsplash.com/photo-1590872559310-3e7e5b3dfb81?w=400&q=80', cat: 'exterior', label: 'Building Facade' },
  { src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', cat: 'residential', label: 'Family Home' },
  { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80', cat: 'interior', label: 'Modern Interior' },
  { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', cat: 'commercial', label: 'High-Rise' },
  { src: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80', cat: 'infrastructure', label: 'Flyover Project' },
  { src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80', cat: 'residential', label: 'Premium Society' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', cat: 'interior', label: 'Kitchen Design' },
  { src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', cat: 'exterior', label: 'Exterior Finishing' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', cat: 'residential', label: 'Smart Villa' },
  { src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=500&q=80', cat: 'interior', label: 'Bedroom Suite' },
  { src: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=80', cat: 'commercial', label: 'Retail Mall' },
  { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80', cat: 'infrastructure', label: 'Urban Road' },
  { src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80', cat: 'exterior', label: 'Garden Design' },
  { src: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80', cat: 'residential', label: 'Penthouse' },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', cat: 'interior', label: 'Living Room' },
  { src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80', cat: 'commercial', label: 'Tech Campus' },
  { src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80', cat: 'infrastructure', label: 'Highway' },
  { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', cat: 'exterior', label: 'Pool Deck' },
  { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', cat: 'residential', label: 'Townhouse' },
  { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', cat: 'interior', label: 'Open Kitchen' },
  { src: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&q=80', cat: 'commercial', label: 'Hotel Lobby' },
  { src: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80', cat: 'residential', label: 'Bungalow' },
  { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80', cat: 'exterior', label: 'Landscape' },
  { src: 'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=600&q=80', cat: 'infrastructure', label: 'Dam Works' },
  { src: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80', cat: 'commercial', label: 'Warehouse' },
  { src: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&q=80', cat: 'interior', label: 'Office Interior' },
  { src: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=600&q=80', cat: 'exterior', label: 'Glass Facade' },
  { src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80', cat: 'residential', label: 'Hill House' },
  { src: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=600&q=80', cat: 'exterior', label: 'Terrace Design' },
];

let galleryFilter = 'all';
let gallerySearch = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 16;
let lbIndex = 0;
let filteredImages = [];

function getFiltered() {
  return GALLERY_IMAGES.filter(img => {
    const matchCat = galleryFilter === 'all' || img.cat === galleryFilter;
    const matchSearch = img.label.toLowerCase().includes(gallerySearch.toLowerCase());
    return matchCat && matchSearch;
  });
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  filteredImages = getFiltered();
  const total = filteredImages.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredImages.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = pageItems.map((img, i) => `
    <div class="gallery-item" data-index="${start + i}" onclick="openLightbox(${start + i})">
      <img loading="lazy" src="${img.src}" alt="${img.label}">
      <div class="gallery-overlay"><span>${img.label}</span></div>
    </div>
  `).join('');

  // Pagination
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pg = document.getElementById('galleryPagination');
  if (!pg) return;
  if (totalPages <= 1) { pg.innerHTML = ''; return; }

  let html = '<ul class="pagination gallery-pagination justify-content-center flex-wrap">';
  html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
    <a class="page-link" href="#" onclick="gotoPage(${currentPage - 1}); return false;">‹</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
      <a class="page-link" href="#" onclick="gotoPage(${i}); return false;">${i}</a></li>`;
  }
  html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
    <a class="page-link" href="#" onclick="gotoPage(${currentPage + 1}); return false;">›</a></li>`;
  html += '</ul>';
  pg.innerHTML = html;
}

function gotoPage(p) {
  const total = Math.ceil(getFiltered().length / ITEMS_PER_PAGE);
  if (p < 1 || p > total) return;
  currentPage = p;
  renderGallery();
  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    galleryFilter = btn.getAttribute('data-filter');
    currentPage = 1;
    renderGallery();
  });
});

// Search
document.getElementById('gallerySearch')?.addEventListener('input', e => {
  gallerySearch = e.target.value;
  currentPage = 1;
  renderGallery();
});

// Lightbox
function openLightbox(index) {
  lbIndex = index;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImage');
  const lbCap = document.getElementById('lbCaption');
  if (!lb || !lbImg) return;
  lbImg.src = filteredImages[index].src;
  if (lbCap) lbCap.textContent = filteredImages[index].label;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function lbNavigate(dir) {
  lbIndex = (lbIndex + dir + filteredImages.length) % filteredImages.length;
  document.getElementById('lbImage').src = filteredImages[lbIndex].src;
  document.getElementById('lbCaption').textContent = filteredImages[lbIndex].label;
}

document.getElementById('lightbox')?.addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox')?.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lbNavigate(-1);
    if (e.key === 'ArrowRight') lbNavigate(1);
  }
});

// Upload
const uploadInput = document.getElementById('galleryUpload');
const uploadArea  = document.getElementById('uploadArea');

uploadArea?.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea?.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea?.addEventListener('drop', e => {
  e.preventDefault(); uploadArea.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});
uploadArea?.addEventListener('click', () => uploadInput?.click());
uploadInput?.addEventListener('change', e => handleFiles(e.target.files));

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'j9joit6n');

    fetch('https://api.cloudinary.com/v1_1/ewh54at0/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.secure_url) {
        if (typeof db !== 'undefined') {
          db.collection('gallery_images').add({
            src: data.secure_url,
            label: file.name.replace(/\.[^.]+$/, ''),
            cat: 'exterior',
            uploadedAt: new Date().toISOString()
          });
        }
        GALLERY_IMAGES.unshift({ src: data.secure_url, cat: 'exterior', label: file.name.replace(/\.[^.]+$/, '') });
        galleryFilter = 'all';
        gallerySearch = '';
        currentPage = 1;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
        const searchInput = document.getElementById('gallerySearch');
        if (searchInput) searchInput.value = '';
        renderGallery();
        showToast('Image uploaded successfully!', 'success');
      } else {
        console.error('Cloudinary error:', data);
        showToast('Upload failed: ' + (data.error?.message || 'Unknown error'), 'error');
      }
    })
    .catch(err => { console.error('Upload error:', err); showToast('Upload failed. Check your connection.', 'error'); });
  });
}

/* ── Enquiry Form ─────────────────────────────────────────────── */
const enquiryForm = document.getElementById('enquiryForm');

enquiryForm?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    name:        document.getElementById('fName').value.trim(),
    phone:       document.getElementById('fPhone').value.trim(),
    email:       document.getElementById('fEmail').value.trim(),
    city:        document.getElementById('fCity').value.trim(),
    projectType: document.getElementById('fProject').value,
    budget:      document.getElementById('fBudget').value,
    message:     document.getElementById('fMessage').value.trim(),
    createdAt:   new Date().toISOString(),
  };

  const btn = enquiryForm.querySelector('.btn-submit');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting…';

  try {
    if (typeof db !== 'undefined') {
      await db.collection('customers').add(data);
      showToast('Enquiry submitted! We\'ll contact you soon. ✓', 'success');
    } else {
      // Demo mode without Firebase
      await new Promise(r => setTimeout(r, 1000));
      showToast('Enquiry received! (Demo mode — add Firebase to save data)', 'success');
    }
    enquiryForm.reset();
    enquiryForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-send me-2"></i>Submit Enquiry';
  }
});

function validateForm() {
  let valid = true;
  const fields = [
    { id: 'fName',    test: v => v.trim().length >= 3,                  msg: 'Minimum 3 characters required.' },
    { id: 'fPhone',   test: v => /^\d{10}$/.test(v.trim()),             msg: 'Enter a valid 10-digit phone number.' },
    { id: 'fEmail',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address.' },
    { id: 'fMessage', test: v => v.trim().length >= 20,                 msg: 'Minimum 20 characters required.' },
  ];
  fields.forEach(({ id, test, msg }) => {
    const el = document.getElementById(id);
    const fb = el?.nextElementSibling;
    const ok = test(el?.value || '');
    el?.classList.toggle('is-valid',   ok);
    el?.classList.toggle('is-invalid', !ok);
    if (fb && fb.classList.contains('invalid-feedback')) fb.textContent = msg;
    if (!ok) valid = false;
  });

  const agree = document.getElementById('fAgree');
  if (agree && !agree.checked) {
    agree.classList.add('is-invalid');
    valid = false;
  } else {
    agree?.classList.remove('is-invalid');
  }
  return valid;
}

// Live validation
['fName','fPhone','fEmail','fMessage'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    const fields = {
      fName:    v => v.trim().length >= 3,
      fPhone:   v => /^\d{10}$/.test(v.trim()),
      fEmail:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      fMessage: v => v.trim().length >= 20,
    };
    const el = document.getElementById(id);
    const ok = fields[id](el.value);
    el.classList.toggle('is-valid', ok);
    el.classList.toggle('is-invalid', !ok && el.value.length > 0);
  });
});

/* ── Toast ────────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill' };
  const toast = document.createElement('div');
  toast.className = `toast-custom ${type}`;
  toast.innerHTML = `<i class="bi ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof db !== 'undefined') {
    db.collection('gallery_images').orderBy('uploadedAt', 'desc').get()
      .then(snap => {
        snap.docs.forEach(d => {
          const img = d.data();
          GALLERY_IMAGES.unshift({ src: img.src, cat: img.cat || 'exterior', label: img.label || 'Project' });
        });
        renderGallery();
      })
      .catch(() => renderGallery());
  } else {
    renderGallery();
  }
});
