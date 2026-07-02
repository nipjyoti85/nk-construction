// ============================================================
// admin.js — NK Construction Admin Dashboard
// ============================================================

'use strict';

/* ── Constants ──────────────────────────────────────────────── */
const ADMIN_PASSWORD = 'nk@admin2024'; // Change this!
const ITEMS_PER_PAGE = 10;

/* ── State ───────────────────────────────────────────────────── */
let allEnquiries   = [];   // Full list from Firestore (or demo)
let filteredList   = [];   // After search
let currentPage    = 1;
let galleryCount   = 0;
let unsubscribe    = null; // Firestore listener

/* ── Demo Data (used when Firebase is not configured) ────────── */
const DEMO_DATA = [
  { id:'d1', name:'Rajesh Kumar',   phone:'9876543210', email:'rajesh@email.com',   city:'Mumbai',    projectType:'Residential Home',  budget:'₹25 – ₹50 Lakhs',     message:'Need a 3BHK villa with modern interior design and swimming pool.',       createdAt:'2024-12-01T09:30:00Z' },
  { id:'d2', name:'Priya Sharma',   phone:'9123456780', email:'priya@email.com',    city:'Pune',      projectType:'Interior Design',   budget:'Below ₹25 Lakhs',      message:'Looking for complete interior design of my 2BHK flat in Pune.',          createdAt:'2024-12-03T11:15:00Z' },
  { id:'d3', name:'Amit Patel',     phone:'9988776655', email:'amit@business.com',  city:'Surat',     projectType:'Commercial Office', budget:'₹1 – ₹5 Crore',        message:'Want to construct a 5-floor commercial office complex near highway.',    createdAt:'2024-12-05T14:00:00Z' },
  { id:'d4', name:'Sunita Verma',   phone:'9870001234', email:'sunita@email.com',   city:'Nagpur',    projectType:'Renovation',        budget:'₹25 – ₹50 Lakhs',     message:'Old house renovation required, including structural repairs and painting.', createdAt:'2024-12-07T10:45:00Z' },
  { id:'d5', name:'Deepak Joshi',   phone:'9654321098', email:'deepak@corp.com',    city:'Nashik',    projectType:'Industrial / Warehouse', budget:'₹5 Crore+',       message:'Planning a 2-acre warehouse facility near MIDC area in Nashik.',        createdAt:'2024-12-10T08:20:00Z' },
  { id:'d6', name:'Kavita Singh',   phone:'9712345678', email:'kavita@email.com',   city:'Thane',     projectType:'Apartment / Society', budget:'₹50 Lakhs – ₹1 Crore', message:'Need to construct a small housing society of 12 flats on our plot.',   createdAt:'2024-12-12T16:30:00Z' },
  { id:'d7', name:'Rohit Mehta',    phone:'9800012345', email:'rohit@startup.com',  city:'Aurangabad',projectType:'Retail / Mall',     budget:'₹1 – ₹5 Crore',        message:'Interested in building a small retail complex with shops and food court.', createdAt:'2024-12-15T13:00:00Z' },
  { id:'d8', name:'Sneha Kulkarni', phone:'9765432100', email:'sneha@email.com',    city:'Kolhapur',  projectType:'Residential Home',  budget:'Below ₹25 Lakhs',      message:'Looking to build a simple 2BHK home on my ancestral plot.',             createdAt:'2024-12-17T09:10:00Z' },
  { id:'d9', name:'Manoj Gupta',    phone:'9543219876', email:'manoj@company.com',  city:'Mumbai',    projectType:'Architecture',      budget:'₹50 Lakhs – ₹1 Crore', message:'Need complete architectural planning for a multi-purpose building.',   createdAt:'2024-12-18T15:45:00Z' },
  { id:'d10',name:'Anita Desai',    phone:'9811223344', email:'anita@email.com',    city:'Navi Mumbai',projectType:'Interior Design',  budget:'₹25 – ₹50 Lakhs',     message:'Full interior work for newly purchased 3BHK apartment in Kharghar.',    createdAt:'2024-12-20T11:30:00Z' },
  { id:'d11',name:'Vikas Nair',     phone:'9900112233', email:'vikas@tech.com',     city:'Pune',      projectType:'Commercial Office', budget:'₹1 – ₹5 Crore',        message:'Tech office campus for 200 employees, need modern glass facade design.', createdAt:'2024-12-21T10:00:00Z' },
  { id:'d12',name:'Pooja Reddy',    phone:'9822334455', email:'pooja@email.com',    city:'Hyderabad', projectType:'Residential Home',  budget:'₹50 Lakhs – ₹1 Crore', message:'Luxury villa with smart home automation and landscape garden.',         createdAt:'2024-12-22T14:20:00Z' },
];

/* ── Auth ────────────────────────────────────────────────────── */
function checkLogin() {
  return sessionStorage.getItem('nk_admin_auth') === 'true';
}

function doLogin() {
  const pwd = document.getElementById('adminPassword')?.value;
  const err = document.getElementById('loginError');
  if (pwd === ADMIN_PASSWORD) {
    sessionStorage.setItem('nk_admin_auth', 'true');
    document.getElementById('adminLogin').style.display = 'none';
    initDashboard();
  } else {
    if (err) { err.textContent = 'Incorrect password. Please try again.'; err.style.display = 'block'; }
    document.getElementById('adminPassword').classList.add('is-invalid');
  }
}

function doLogout() {
  sessionStorage.removeItem('nk_admin_auth');
  location.reload();
}

/* ── Dark Mode ───────────────────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nk-theme', theme);
  const btn = document.getElementById('darkToggle');
  if (btn) btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
}

document.getElementById('darkToggle')?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('nk-theme') || 'light');

/* ── Init Dashboard ─────────────────────────────────────────── */
function initDashboard() {
  loadEnquiries();
  loadGalleryCount();
  renderRecentActivity();
  setInterval(updateClock, 1000);
  updateClock();
}

function updateClock() {
  const el = document.getElementById('adminClock');
  if (el) el.textContent = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

/* ── Load Enquiries ─────────────────────────────────────────── */
function loadEnquiries() {
  setLoading(true);

  // Use Firebase if available and configured
  if (typeof db !== 'undefined') {
    try {
      if (unsubscribe) unsubscribe();
      unsubscribe = db.collection('customers')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snap => {
          allEnquiries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          onDataLoaded();
        }, err => {
          console.warn('Firebase error, using demo data:', err.message);
          loadDemoData();
        });
    } catch {
      loadDemoData();
    }
  } else {
    loadDemoData();
  }
}

function loadDemoData() {
  setTimeout(() => {
    allEnquiries = [...DEMO_DATA];
    onDataLoaded();
    showBanner('Running in Demo Mode — Connect Firebase to see real data.', 'warning');
  }, 600);
}

function onDataLoaded() {
  filteredList = [...allEnquiries];
  currentPage = 1;
  updateStats();
  renderTable();
  renderRecentActivity();
  setLoading(false);
}

/* ── Stats Cards ─────────────────────────────────────────────── */
function updateStats() {
  animCount('statTotal',   allEnquiries.length);
  animCount('statToday',   todayCount());
  animCount('statGallery', galleryCount);
  animCount('statCities',  uniqueCities());
}

function todayCount() {
  const today = new Date().toDateString();
  return allEnquiries.filter(e => new Date(e.createdAt).toDateString() === today).length;
}

function uniqueCities() {
  return new Set(allEnquiries.map(e => (e.city || '').trim().toLowerCase()).filter(Boolean)).size;
}

function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let c = 0;
  const step = Math.ceil(target / 30);
  const t = setInterval(() => {
    c = Math.min(c + step, target);
    el.textContent = c;
    if (c >= target) clearInterval(t);
  }, 30);
}

/* ── Gallery Count ───────────────────────────────────────────── */
function loadGalleryCount() {
  galleryCount = parseInt(localStorage.getItem('nk_gallery_count') || '0');
  document.getElementById('statGallery').textContent = galleryCount;
}

/* ── Table Render ────────────────────────────────────────────── */
function renderTable() {
  const tbody = document.getElementById('enquiryTbody');
  const pag   = document.getElementById('tablePagination');
  if (!tbody) return;

  const total = filteredList.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const page  = filteredList.slice(start, start + ITEMS_PER_PAGE);

  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5" style="color:var(--text-muted);">
      <i class="bi bi-inbox fs-2 d-block mb-2"></i>No enquiries found.</td></tr>`;
  } else {
    tbody.innerHTML = page.map((e, i) => `
      <tr>
        <td>${start + i + 1}</td>
        <td><strong>${esc(e.name)}</strong></td>
        <td>${esc(e.phone)}</td>
        <td><a href="mailto:${esc(e.email)}" style="color:var(--navy)">${esc(e.email)}</a></td>
        <td>${esc(e.city || '—')}</td>
        <td><span class="badge-type">${esc(e.projectType || '—')}</span></td>
        <td>${esc(e.budget || '—')}</td>
        <td style="font-size:.82rem; color:var(--text-muted)">${fmtDate(e.createdAt)}</td>
        <td>
          <button class="btn-action view"   onclick="viewEnquiry('${e.id}')" title="View"><i class="bi bi-eye-fill"></i></button>
          <button class="btn-action delete" onclick="deleteEnquiry('${e.id}', '${esc(e.name)}')" title="Delete"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`).join('');
  }

  // Pagination
  const info = document.getElementById('tableInfo');
  if (info) info.textContent = `Showing ${Math.min(start+1, total)}–${Math.min(start + ITEMS_PER_PAGE, total)} of ${total} enquiries`;

  if (!pag) return;
  if (totalPages <= 1) { pag.innerHTML = ''; return; }
  let pg = '<ul class="pagination pagination-sm mb-0 flex-wrap">';
  pg += `<li class="page-item ${currentPage===1?'disabled':''}"><a class="page-link" href="#" onclick="tablePage(${currentPage-1});return false;">‹</a></li>`;
  for (let p = 1; p <= totalPages; p++) {
    pg += `<li class="page-item ${p===currentPage?'active':''}"><a class="page-link" href="#" onclick="tablePage(${p});return false;">${p}</a></li>`;
  }
  pg += `<li class="page-item ${currentPage===totalPages?'disabled':''}"><a class="page-link" href="#" onclick="tablePage(${currentPage+1});return false;">›</a></li>`;
  pg += '</ul>';
  pag.innerHTML = pg;
}

function tablePage(p) {
  const total = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  if (p < 1 || p > total) return;
  currentPage = p;
  renderTable();
}

/* ── Search ──────────────────────────────────────────────────── */
function searchEnquiries(q) {
  const query = q.toLowerCase().trim();
  filteredList = query
    ? allEnquiries.filter(e =>
        [e.name, e.phone, e.email, e.city, e.projectType].some(v => (v||'').toLowerCase().includes(query)))
    : [...allEnquiries];
  currentPage = 1;
  renderTable();
}

/* ── View Enquiry Modal ──────────────────────────────────────── */
function viewEnquiry(id) {
  const e = allEnquiries.find(x => x.id === id);
  if (!e) return;
  const body = document.getElementById('viewModalBody');
  if (body) body.innerHTML = `
    <div class="view-grid">
      <div class="view-field"><span class="view-label">Full Name</span><span class="view-val">${esc(e.name)}</span></div>
      <div class="view-field"><span class="view-label">Phone</span><span class="view-val"><a href="tel:${esc(e.phone)}">${esc(e.phone)}</a></span></div>
      <div class="view-field"><span class="view-label">Email</span><span class="view-val"><a href="mailto:${esc(e.email)}">${esc(e.email)}</a></span></div>
      <div class="view-field"><span class="view-label">City</span><span class="view-val">${esc(e.city||'—')}</span></div>
      <div class="view-field"><span class="view-label">Project Type</span><span class="view-val">${esc(e.projectType||'—')}</span></div>
      <div class="view-field"><span class="view-label">Budget</span><span class="view-val">${esc(e.budget||'—')}</span></div>
      <div class="view-field" style="grid-column:1/-1"><span class="view-label">Message</span><span class="view-val">${esc(e.message||'—')}</span></div>
      <div class="view-field"><span class="view-label">Submitted</span><span class="view-val">${fmtDate(e.createdAt, true)}</span></div>
    </div>`;
  new bootstrap.Modal(document.getElementById('viewModal')).show();
}

/* ── Delete ──────────────────────────────────────────────────── */
function deleteEnquiry(id, name) {
  if (!confirm(`Delete enquiry from "${name}"? This cannot be undone.`)) return;
  if (typeof db !== 'undefined' && id.startsWith('d') === false) {
    db.collection('customers').doc(id).delete()
      .then(() => showToast(`Enquiry from ${name} deleted.`, 'success'))
      .catch(err => showToast('Delete failed: ' + err.message, 'error'));
  } else {
    // Demo delete
    allEnquiries = allEnquiries.filter(e => e.id !== id);
    onDataLoaded();
    showToast(`Enquiry from ${name} removed (demo mode).`, 'success');
  }
}

/* ── Export CSV ──────────────────────────────────────────────── */
function exportCSV() {
  if (allEnquiries.length === 0) { showToast('No data to export.', 'error'); return; }
  const headers = ['#','Name','Phone','Email','City','Project Type','Budget','Message','Date'];
  const rows = allEnquiries.map((e, i) => [
    i+1,
    csvCell(e.name), csvCell(e.phone), csvCell(e.email),
    csvCell(e.city), csvCell(e.projectType), csvCell(e.budget),
    csvCell(e.message), fmtDate(e.createdAt, true)
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `nk_enquiries_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully!', 'success');
}

function csvCell(v) { return `"${(v||'').replace(/"/g, '""')}"` }

/* ── Recent Activity ─────────────────────────────────────────── */
function renderRecentActivity() {
  const el = document.getElementById('recentActivity');
  if (!el) return;
  const recent = allEnquiries.slice(0, 6);
  if (recent.length === 0) { el.innerHTML = '<p style="color:var(--text-muted);font-size:.88rem;">No activity yet.</p>'; return; }
  el.innerHTML = recent.map(e => `
    <div class="activity-item">
      <div class="activity-avatar">${(e.name||'?').charAt(0).toUpperCase()}</div>
      <div class="activity-info">
        <div class="activity-name">${esc(e.name)}</div>
        <div class="activity-meta">${esc(e.projectType||'Enquiry')} · ${esc(e.city||'—')}</div>
      </div>
      <div class="activity-time">${timeAgo(e.createdAt)}</div>
    </div>`).join('');
}

/* ── Chart (simple bar chart with CSS) ──────────────────────── */
function renderProjectChart() {
  const el = document.getElementById('projectChart');
  if (!el) return;
  const types = {};
  allEnquiries.forEach(e => {
    const t = (e.projectType || 'Other').split(' ')[0];
    types[t] = (types[t] || 0) + 1;
  });
  const entries = Object.entries(types).sort((a,b) => b[1]-a[1]).slice(0,6);
  const max = entries[0]?.[1] || 1;
  el.innerHTML = entries.map(([label, count]) => `
    <div class="chart-row">
      <div class="chart-label">${label}</div>
      <div class="chart-bar-wrap">
        <div class="chart-bar" style="width:${(count/max*100).toFixed(1)}%"></div>
      </div>
      <div class="chart-count">${count}</div>
    </div>`).join('');
}

/* ── Utilities ───────────────────────────────────────────────── */
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(iso, long = false) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return long
      ? d.toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })
      : d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  } catch { return '—'; }
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff/60000);
  if (m < 1)   return 'Just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

function setLoading(on) {
  const el = document.getElementById('tableLoading');
  const tbl = document.getElementById('tableWrap');
  if (el)  el.style.display  = on ? 'flex' : 'none';
  if (tbl) tbl.style.display = on ? 'none' : 'block';
}

function showBanner(msg, type='info') {
  const el = document.getElementById('adminBanner');
  if (!el) return;
  const colors = { info:'#0B3D91', warning:'#b8941c', success:'#16a34a', error:'#dc2626' };
  el.style.cssText = `display:flex;align-items:center;gap:.75rem;padding:.8rem 1.4rem;border-radius:10px;
    background:${colors[type]}18;border:1px solid ${colors[type]}44;color:${colors[type]};
    font-size:.9rem;font-weight:500;margin-bottom:1.5rem;`;
  el.innerHTML = `<i class="bi bi-info-circle-fill"></i>${msg}`;
}

function showToast(msg, type='success') {
  const icons = { success:'bi-check-circle-fill', error:'bi-x-circle-fill', warning:'bi-exclamation-triangle-fill' };
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;top:1.5rem;right:1.5rem;z-index:9999;
    background:var(--card-bg);color:var(--text);border-radius:12px;
    box-shadow:var(--shadow-lg);padding:1rem 1.5rem;
    display:flex;align-items:center;gap:.75rem;min-width:280px;
    border-left:4px solid ${type==='success'?'#22c55e':type==='error'?'#ef4444':'#f59e0b'};
    transform:translateX(120%);transition:transform .4s cubic-bezier(.4,0,.2,1);`;
  toast.innerHTML = `<i class="bi ${icons[type]||icons.success}" style="font-size:1.3rem;color:${type==='success'?'#22c55e':type==='error'?'#ef4444':'#f59e0b'}"></i>
    <span style="font-weight:500">${msg}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  setTimeout(() => { toast.style.transform = 'translateX(120%)'; setTimeout(() => toast.remove(), 400); }, 4000);
}

/* ── Nav Section Switch ──────────────────────────────────────── */
function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
  const section = document.getElementById(id);
  if (section) section.style.display = 'block';
  document.querySelector(`[data-section="${id}"]`)?.classList.add('active');
  if (id === 'secEnquiries') renderTable();
  if (id === 'secAnalytics') { updateStats(); setTimeout(renderProjectChart, 100); }
}

/* ── Boot ────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  if (checkLogin()) {
    document.getElementById('adminLogin').style.display = 'none';
    initDashboard();
  }
  showSection('secDashboard');

  // Password input: enter key
  document.getElementById('adminPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
