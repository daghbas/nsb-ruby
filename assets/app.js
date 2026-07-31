(() => {
  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];
  const B = 'https://nsb-ruby.vercel.app';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = qs('[data-header]');
  const menuToggle = qs('[data-menu-toggle]');
  const mobileMenu = qs('[data-mobile-menu]');
  const progress = qs('[data-progress]');
  const floorLabel = qs('[data-floor-label]');
  const processProgress = qs('[data-process-progress]');

  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  qsa('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const sections = qsa('.floor-section');
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 70);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.height = `${max ? (y / max) * 100 : 0}%`;
    let active = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top < innerHeight * .52) active = section; });
    if (floorLabel && active) floorLabel.textContent = active.dataset.floor || '00';

    if (!reduceMotion) {
      qsa('[data-parallax]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          const speed = Number(el.dataset.parallax || .08);
          const offset = (r.top - innerHeight / 2) * speed;
          const img = qs('img', el);
          if (img) img.style.transform = `scale(1.08) translate3d(0,${offset}px,0)`;
        }
      });
    }

    const process = qs('#process');
    if (process && processProgress) {
      const r = process.getBoundingClientRect();
      const total = process.offsetHeight - innerHeight;
      const passed = Math.min(Math.max(-r.top, 0), Math.max(total, 1));
      processProgress.style.width = `${(passed / Math.max(total, 1)) * 100}%`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const counter = (el) => {
    const target = Number(el.dataset.counter || 0);
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now();
    const duration = 1300;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.matches('[data-counter]')) counter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  qsa('.reveal,.image-reveal,.title-reveal,[data-counter]').forEach(el => observer.observe(el));

  const partnerSizes = [128,256,256,256,128,256,256,256,256,256,256,128,256,384,384];
  const partners = Array.from({ length: 15 }, (_, i) => `${B}/images/partners/nextImageExportOptimizer/${i + 1}-opt-${partnerSizes[i]}.WEBP`);
  const partnerTrack = qs('[data-partners]');
  if (partnerTrack) {
    const list = [...partners, ...partners];
    partnerTrack.innerHTML = list.map((src, i) => `<span class="partner-logo"><img loading="lazy" src="${src}" alt="شريك نجاح ${i % 15 + 1}"></span>`).join('');
  }

  const companySizes = [256,256,256,256,128,256];
  const companies = Array.from({ length: 6 }, (_, i) => `${B}/images/companies/nextImageExportOptimizer/${i + 1}-opt-${companySizes[i]}.WEBP`);
  const companyWall = qs('[data-companies]');
  if (companyWall) companyWall.innerHTML = companies.map((src, i) => `<span class="company-logo reveal"><img loading="lazy" src="${src}" alt="شركة تابعة ${i + 1}"></span>`).join('');
  qsa('.company-logo.reveal').forEach(el => observer.observe(el));

  const portfolio = [
    ['فندق العزيزية','ضيافة',`${B}/images/portfolio/nextImageExportOptimizer/1-opt-1200.WEBP`],
    ['فندق شموخ المدينة','ضيافة',`${B}/images/portfolio/nextImageExportOptimizer/2-opt-1200.WEBP`],
    ['فندق تيماندرا','ضيافة',`${B}/images/portfolio/nextImageExportOptimizer/3-opt-1200.WEBP`],
    ['مجمع تترا','تجاري',`${B}/images/portfolio/nextImageExportOptimizer/4-opt-1200.WEBP`],
    ['شقق العوالي','سكني',`${B}/images/portfolio/nextImageExportOptimizer/5-opt-1200.WEBP`],
    ['فلل نمار','سكني',`${B}/images/portfolio/nextImageExportOptimizer/6-opt-1200.WEBP`],
    ['فلل المهدية','سكني',`${B}/images/portfolio/nextImageExportOptimizer/7-opt-1200.WEBP`],
    ['أدوار البديعة','سكني',`${B}/images/portfolio/nextImageExportOptimizer/8-opt-1200.WEBP`],
    ['شقق الفيحاء','سكني',`${B}/images/portfolio/nextImageExportOptimizer/9-opt-1200.WEBP`],
    ['عماير الشوقية','سكني',`${B}/images/portfolio/nextImageExportOptimizer/10-opt-1200.WEBP`],
    ['صندوق القناديل','استثماري',`${B}/images/portfolio/nextImageExportOptimizer/11-opt-1200.WEBP`]
  ];
  const gallery = qs('[data-gallery]');
  const galleryGrid = qs('[data-gallery-grid]');
  const openGallery = qs('[data-open-gallery]');
  const closeGallery = qs('[data-close-gallery]');
  if (galleryGrid) galleryGrid.innerHTML = portfolio.map((p, i) => `<article class="gallery-item"><img loading="lazy" src="${p[2]}" alt="${p[0]}"><div><small>${String(i + 1).padStart(2,'0')} / ${p[1]}</small><h3>${p[0]}</h3></div></article>`).join('');
  const toggleGallery = open => {
    if (!gallery) return;
    if (open) { gallery.showModal(); document.body.classList.add('gallery-open'); }
    else { gallery.close(); document.body.classList.remove('gallery-open'); }
  };
  openGallery?.addEventListener('click', () => toggleGallery(true));
  closeGallery?.addEventListener('click', () => toggleGallery(false));
  gallery?.addEventListener('click', e => { if (e.target === gallery) toggleGallery(false); });

  qsa('.project-card').forEach(card => card.addEventListener('click', () => toggleGallery(true)));
})();
