// Mobile nav toggle
function toggleNav() {
  const nav = document.querySelector('.main-nav');
  nav.classList.toggle('open');
}

// Close mobile nav on click outside
document.addEventListener('click', function(e) {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.mobile-nav-toggle');
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
