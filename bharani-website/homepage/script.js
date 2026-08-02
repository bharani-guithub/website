// ============================================
// script.js — Bharani Kumar Velakaturi
// ============================================

// ----- CLOCK -----
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  hours   = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);

// ----- DARK / LIGHT TOGGLE -----
const toggleButton = document.getElementById('theme-toggle');

function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  toggleButton.textContent = dark ? '☀️ Light' : '🌙 Dark';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Apply saved preference on load
applyTheme(localStorage.getItem('theme') === 'dark');

toggleButton.addEventListener('click', function () {
  applyTheme(!document.body.classList.contains('dark-mode'));
});

// ----- CONTACT FORM -----
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  msg.textContent = '✅ Thanks! Message received. I\'ll get back to you soon.';
  e.target.reset();
}

// ----- SMOOTH ACTIVE NAV HIGHLIGHT -----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#0f172a' : '';
  });
});
