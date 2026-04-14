let count = 0;
const MAX = 3;
const btn    = document.getElementById('actionBtn');
const status = document.getElementById('status');
const bar    = document.getElementById('progressBar');
const label  = document.getElementById('countLabel');

function pulse(id, delay = 0) {
  setTimeout(() => {
    const el = document.getElementById('tag-' + id);
    el.classList.add('active', 'glow');
    setTimeout(() => el.classList.remove('glow'), 700);
  }, delay);
}

function performAction(e) {
  count++;

  // Ripple
  const rect = btn.getBoundingClientRect();
  const rip  = document.createElement('div');
  rip.className = 'ripple';
  rip.style.left = (e.clientX - rect.left - 30) + 'px';
  rip.style.top  = (e.clientY - rect.top  - 30) + 'px';
  btn.appendChild(rip);
  setTimeout(() => rip.remove(), 700);

  // Float
  const fl = document.createElement('div');
  fl.className   = 'click-float';
  fl.textContent = '+1 click';
  fl.style.left  = e.clientX + 'px';
  fl.style.top   = (e.clientY - 10) + 'px';
  document.body.appendChild(fl);
  setTimeout(() => fl.remove(), 900);

  // Progress
  bar.style.width = (count / MAX * 100) + '%';
  label.textContent = `${count} / ${MAX}`;
  if (count === 2) bar.style.background = 'var(--yellow)';
  if (count >= MAX) bar.style.background = 'var(--red)';

  // Status
  status.style.background  = count < MAX ? 'rgba(0,200,83,0.08)'  : 'rgba(255,23,68,0.08)';
  status.style.borderColor = count < MAX ? '#00c853' : '#ff1744';
  status.textContent = count < MAX
    ? ` Processed ${count} time${count !== 1 ? 's' : ''}  ${MAX - count} remaining`
    : ' Limit reached (3 / 3)';

  pulse('feedback', 0);
  pulse('mapping',  200);

  if (count >= MAX) {
    btn.disabled = true;
    pulse('constraint', 400);
    pulse('signifier',  650);
  }
}

btn.addEventListener('click', performAction);
btn.addEventListener('mouseenter', () => pulse('affordance'));
