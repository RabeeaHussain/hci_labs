const username = document.getElementById('username');
const email    = document.getElementById('email');
const password = document.getElementById('password');
const status   = document.getElementById('status');
const undoBtn  = document.getElementById('undoBtn');
const submitBtn= document.getElementById('submitBtn');

let snapshot = { username: '', email: '', password: '' };

// Activate a tag
function activate(id) {
  document.getElementById('tag-' + id).classList.add('active');
}

// Set hint text
function hint(fieldId, msg, type) {
  const el = document.getElementById('hint-' + fieldId);
  el.textContent = msg;
  el.className = 'hint ' + (type || '');
}

// Set field style
function fieldStyle(input, type) {
  input.classList.remove('ok', 'err');
  if (type) input.classList.add(type);
}

// ── R3: Feedback — live hints as user types ──────────────────────────
username.addEventListener('input', () => {
  activate('r3');
  const v = username.value;
  if (v.length === 0) { hint('username', ''); fieldStyle(username, ''); return; }
  if (v.length < 3)   { hint('username', 'Too short — min 3 characters', 'err'); fieldStyle(username, 'err'); }
  else                { hint('username', 'Looks good!', 'ok'); fieldStyle(username, 'ok'); }
  saveSnapshot();
  activate('r7'); // user is in control — typing freely
});

email.addEventListener('input', () => {
  activate('r3');
  const v = email.value;
  if (v.length === 0) { hint('email', ''); fieldStyle(email, ''); return; }
  const valid = v.includes('@') && v.includes('.');
  if (!valid) { hint('email', 'Enter a valid email address', 'err'); fieldStyle(email, 'err'); }
  else        { hint('email', 'Valid email!', 'ok'); fieldStyle(email, 'ok'); }
  saveSnapshot();
  activate('r7');
});

password.addEventListener('input', () => {
  activate('r3');
  const v = password.value;
  if (v.length === 0) { hint('password', ''); fieldStyle(password, ''); return; }
  if (v.length < 6)   { hint('password', 'Too short — min 6 characters', 'err'); fieldStyle(password, 'err'); }
  else                { hint('password', 'Strong enough!', 'ok'); fieldStyle(password, 'ok'); }
  saveSnapshot();
  activate('r7');
});

// ── R1: Consistency — all fields follow same validation pattern ───────
// (demonstrated by uniform hint/color behavior across all 3 fields above)
username.addEventListener('focus', () => activate('r1'));
email.addEventListener('focus',    () => activate('r1'));
password.addEventListener('focus', () => activate('r1'));

// ── R8: Reduce memory load — hint shown on label click ───────────────
document.querySelectorAll('label').forEach(lbl => {
  lbl.style.cursor = 'help';
  lbl.title = 'Field hint shown automatically — no need to remember rules';
  lbl.addEventListener('click', () => activate('r8'));
});

// ── Save snapshot for undo ────────────────────────────────────────────
function saveSnapshot() {
  snapshot = {
    username: username.value,
    email:    email.value,
    password: password.value,
  };
  undoBtn.disabled = false;
  activate('r6'); // undo is now available
}

// ── R6: Undo ──────────────────────────────────────────────────────────
function onUndo() {
  username.value = '';
  email.value    = '';
  password.value = '';
  ['username','email','password'].forEach(id => {
    hint(id, '');
    fieldStyle(document.getElementById(id), '');
  });
  snapshot = { username: '', email: '', password: '' };
  undoBtn.disabled = true;
  status.textContent = '↺ Undo applied — all fields cleared';
  status.style.borderColor = '#457b9d';
  status.style.background  = 'rgba(69,123,157,0.06)';
}

// ── R5: Error prevention on submit ───────────────────────────────────
function onSubmit() {
  const u = username.value.trim();
  const e = email.value.trim();
  const p = password.value;

  activate('r5');

  // Catch errors before accepting
  if (u.length < 3) {
    status.textContent = '⚠️ Username must be at least 3 characters';
    status.style.borderColor = '#e63946';
    status.style.background  = 'rgba(230,57,70,0.05)';
    fieldStyle(username, 'err');
    return;
  }
  if (!e.includes('@') || !e.includes('.')) {
    status.textContent = '⚠️ Please enter a valid email address';
    status.style.borderColor = '#e63946';
    status.style.background  = 'rgba(230,57,70,0.05)';
    fieldStyle(email, 'err');
    return;
  }
  if (p.length < 6) {
    status.textContent = '⚠️ Password must be at least 6 characters';
    status.style.borderColor = '#e63946';
    status.style.background  = 'rgba(230,57,70,0.05)';
    fieldStyle(password, 'err');
    return;
  }

  // ── R4: Closure — clear end to the task ──────────────────────────
  activate('r4');
  status.textContent = '✅ Form submitted successfully — task complete!';
  status.style.borderColor = '#2a9d8f';
  status.style.background  = 'rgba(42,157,143,0.06)';
  submitBtn.disabled = true;
  undoBtn.disabled   = false;
}

// ── R2: Shortcuts — Ctrl+Enter to submit, Ctrl+Z to undo ─────────────
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    activate('r2');
    onSubmit();
  }
  if (e.ctrlKey && e.key === 'z') {
    activate('r2');
    onUndo();
  }
});