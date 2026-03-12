/* ============================================
   Aquamentor â Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Animated counters ----
  const counters = document.querySelectorAll('.stat__num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ---- Scroll-triggered fade-in ----
  const fadeTargets = document.querySelectorAll(
    '.split-card, .featured__item, .spec-card, .port-card, .process__step, .sidebar-card, .service-detail__photo, .equip-card'
  );
  fadeTargets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // ---- Portfolio filtering ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.port-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- File upload ----
  const fileInput = document.getElementById('files');
  const fileContent = document.getElementById('fileContent');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const count = fileInput.files.length;
      if (count > 0) {
        const names = Array.from(fileInput.files).map(f => f.name).join(', ');
        fileContent.innerHTML = `<p style="font-weight:600">${count} file${count > 1 ? 's' : ''} selected</p><span style="font-size:0.82rem;color:#5a5a5a">${names}</span>`;
      }
    });
  }

  // ---- Nav scroll effect ----
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100 && window.scrollY > lastScroll) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    nav.style.transition = 'transform 0.3s ease';
    lastScroll = window.scrollY;
  });

  // ---- Mobile menu close on click ----
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav__links').classList.remove('open');
    });
  });
});

// ---- Form submit ----
function handleSubmit(e) {
  e.preventDefault();
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('show');
    e.target.reset();
    const fc = document.getElementById('fileContent');
    if (fc) {
      fc.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p>Click to upload or drag files here</p><span>STEP, IGES, DXF, PDF, AI, STL â 25 MB max</span>`;
    }
  }
}
