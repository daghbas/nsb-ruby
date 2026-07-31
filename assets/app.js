(() => {
  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = qs('[data-header]');
  const progress = qs('[data-page-progress]');
  const menuButton = qs('[data-menu-button]');
  const mobileMenu = qs('[data-mobile-menu]');
  const journey = qs('#journey');
  const journeyProgress = qs('[data-journey-progress]');

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  qsa('a', mobileMenu || document).forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateScroll = () => {
    const scrollTop = window.scrollY;
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle('is-scrolled', scrollTop > 60);
    if (progress) progress.style.width = `${scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0}%`;

    if (journey && journeyProgress) {
      const rect = journey.getBoundingClientRect();
      const total = Math.max(journey.offsetHeight - window.innerHeight, 1);
      const passed = Math.min(Math.max(-rect.top, 0), total);
      journeyProgress.style.width = `${(passed / total) * 100}%`;
    }
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  try {
    if (!reducedMotion && 'IntersectionObserver' in window) {
      document.body.classList.add('motion-ready');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      qsa('.reveal,.media-reveal').forEach(element => revealObserver.observe(element));

      const serviceObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('is-active', entry.isIntersecting));
      }, { threshold: 0.42 });
      qsa('[data-service]').forEach(service => serviceObserver.observe(service));
    } else {
      qsa('.reveal,.media-reveal').forEach(element => element.classList.add('is-visible'));
    }
  } catch (error) {
    document.body.classList.remove('motion-ready');
    console.error('Motion initialization failed:', error);
  }

  const partnerSizes = [128,256,256,256,128,256,256,256,256,256,256,128,256,384,384];
  const partners = Array.from({ length: 15 }, (_, index) =>
    `/images/partners/nextImageExportOptimizer/${index + 1}-opt-${partnerSizes[index]}.WEBP`
  );
  const partnerRail = qs('[data-partners]');
  if (partnerRail) {
    partnerRail.innerHTML = [...partners, ...partners]
      .map((src, index) => `<span class="logo-item"><img loading="lazy" src="${src}" alt="شريك نجاح ${(index % 15) + 1}"></span>`)
      .join('');
  }

  const companySizes = [256,256,256,256,128,256];
  const companyWall = qs('[data-companies]');
  if (companyWall) {
    companyWall.innerHTML = companySizes
      .map((size, index) => `<span class="company-logo"><img loading="lazy" src="/images/companies/nextImageExportOptimizer/${index + 1}-opt-${size}.WEBP" alt="شركة تابعة ${index + 1}"></span>`)
      .join('');
  }

  const portfolio = [
    ['فندق العزيزية', 'ضيافة', '/images/portfolio/nextImageExportOptimizer/1-opt-1200.WEBP'],
    ['فندق شموخ المدينة', 'ضيافة', '/images/portfolio/nextImageExportOptimizer/2-opt-1200.WEBP'],
    ['فندق تيماندرا', 'ضيافة', '/images/portfolio/nextImageExportOptimizer/3-opt-1200.WEBP'],
    ['مجمع تترا', 'تجاري', '/images/portfolio/nextImageExportOptimizer/4-opt-1200.WEBP'],
    ['شقق العوالي', 'سكني', '/images/portfolio/nextImageExportOptimizer/5-opt-1200.WEBP'],
    ['فلل نمار', 'سكني', '/images/portfolio/nextImageExportOptimizer/6-opt-1200.WEBP'],
    ['فلل المهدية', 'سكني', '/images/portfolio/nextImageExportOptimizer/7-opt-1200.WEBP'],
    ['أدوار البديعة', 'سكني', '/images/portfolio/nextImageExportOptimizer/8-opt-1200.WEBP'],
    ['شقق الفيحاء', 'سكني', '/images/portfolio/nextImageExportOptimizer/9-opt-1200.WEBP'],
    ['عماير الشوقية', 'سكني', '/images/portfolio/nextImageExportOptimizer/10-opt-1200.WEBP'],
    ['صندوق القناديل', 'استثماري', '/images/portfolio/nextImageExportOptimizer/11-opt-1200.WEBP']
  ];

  const gallery = qs('[data-gallery]');
  const galleryGrid = qs('[data-gallery-grid]');
  const galleryClose = qs('[data-gallery-close]');
  if (galleryGrid) {
    galleryGrid.innerHTML = portfolio.map((item, index) => `
      <article class="gallery-item">
        <img loading="lazy" src="${item[2]}" alt="${item[0]}">
        <div><small>${String(index + 1).padStart(2, '0')} / ${item[1]}</small><h3>${item[0]}</h3></div>
      </article>
    `).join('');
  }

  const setGallery = open => {
    if (!gallery) return;
    if (open) {
      gallery.showModal();
      document.body.classList.add('gallery-open');
    } else {
      gallery.close();
      document.body.classList.remove('gallery-open');
    }
  };
  qsa('[data-gallery-open]').forEach(button => button.addEventListener('click', () => setGallery(true)));
  galleryClose?.addEventListener('click', () => setGallery(false));
  gallery?.addEventListener('click', event => {
    if (event.target === gallery) setGallery(false);
  });
  gallery?.addEventListener('close', () => document.body.classList.remove('gallery-open'));
})();
