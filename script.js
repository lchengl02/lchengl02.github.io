// Set current year
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadTab('about');
});

// Tab switching
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }
  loadTab(tabName);
}

// Load tab content from a separate HTML file
function loadTab(tabName) {
  const contentArea = document.getElementById('content-area');

  contentArea.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--text-muted, #888);">Loading...</div>';

  fetch(`pages/${tabName}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Page not found');
      }
      return response.text();
    })
    .then(html => {
      contentArea.innerHTML = html;
      contentArea.classList.add('active');
      requestAnimationFrame(() => {
        applyRevealAnimations(contentArea);
        if (tabName === 'about' && window.location.hash === '#publications') {
          const pub = document.getElementById('publications');
          if (pub) {
            setTimeout(() => pub.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
          }
        }
      });
    })
    .catch(error => {
      console.error('Error loading page:', error);
      contentArea.innerHTML = `<div style="text-align: center; padding: 50px; color: #999;">Content coming soon...</div>`;
    });
}

// Tag eligible elements with .reveal then observe them so they fade in
// once they enter the viewport. This keeps the page feeling alive while
// remaining quiet enough for an academic homepage.
function applyRevealAnimations(root) {
  const selectors = [
    '.publication-item',
    '.project-card',
    '.cv-content h2',
    '.cv-content h3',
    '.cv-content p',
    '.cv-content ul'
  ];

  const targets = root.querySelectorAll(selectors.join(','));
  if (targets.length === 0) return;

  targets.forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(idx * 70, 420)}ms`;
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}
