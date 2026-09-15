(() => {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionPreference.matches;
  const activeAnimations = new Set();
  const motionToggle = document.querySelector('.motion-toggle');

  function updateMotionPreference(reduce) {
    reduceMotion = reduce || motionPreference.matches;
    document.documentElement.dataset.reducedMotion = String(reduceMotion);
    motionToggle?.setAttribute('aria-pressed', String(reduceMotion));
    if (motionToggle) motionToggle.disabled = motionPreference.matches;
    if (reduceMotion) {
      activeAnimations.forEach(animation => animation.cancel());
      activeAnimations.clear();
    }
  }

  updateMotionPreference(reduceMotion);
  motionPreference.addEventListener('change', event => updateMotionPreference(event.matches));
  if (motionToggle) {
    motionToggle.hidden = false;
    motionToggle.addEventListener('click', () => updateMotionPreference(!reduceMotion));
  }

  // Animate visible content without making rendering depend on JavaScript.
  function animateEntry(element, distance = 10) {
    if (reduceMotion || !element.animate) return;
    const animation = element.animate(
      [{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 400, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
    activeAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (entry.boundingClientRect.top > 0) animateEntry(entry.target);
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
  }

  document.querySelectorAll('details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        Array.from(details.children).filter(child => child.tagName !== 'SUMMARY').forEach(child => animateEntry(child, 6));
      }
      scheduleScrollUpdate();
    });
  });

  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  const sections = Array.from(document.querySelectorAll('[data-nav-section]'));
  const progress = document.querySelector('.reading-progress');
  let scrollFrame = 0;

  function updateScrollState() {
    scrollFrame = 0;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = scrollRange > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollRange)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    let current = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 115) current = section.id;
    }
    for (const link of navLinks) {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  }

  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleScrollUpdate);
  updateScrollState();

})();
