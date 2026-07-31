(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const services = [...document.querySelectorAll('.service-floor')];
  const projects = [...document.querySelectorAll('.project-card')];

  document.body.classList.add('premium-ready');

  const setViewport = () => root.style.setProperty('--real-vh', `${window.innerHeight * 0.01}px`);
  setViewport();
  window.addEventListener('resize', setViewport, { passive: true });

  // Give the marketing service its own visual rather than reusing another service image.
  const marketingImage = document.querySelector('.service-floor:nth-child(4) img');
  if (marketingImage) {
    marketingImage.src = '/images/portfolio/nextImageExportOptimizer/4-opt-1200.WEBP';
    marketingImage.alt = 'مشروع تجاري يمثل خدمات التسويق العقاري';
  }

  services.forEach((service, index) => {
    service.style.setProperty('--service-index', index + 1);
  });

  if ('IntersectionObserver' in window) {
    const serviceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          services.forEach((item) => item.classList.toggle('is-current', item === entry.target));
        }
      });
    }, { threshold: 0.42 });
    services.forEach((service) => serviceObserver.observe(service));
  }

  projects.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `عرض تفاصيل ${card.querySelector('h3')?.textContent || 'المشروع'}`);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });

  if (!reduceMotion) {
    let ticking = false;
    const updateScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty('--page-progress', String(window.scrollY / max));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }, { passive: true });
    updateScroll();

    document.querySelectorAll('.button,.nav-contact,.contact-circle').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        if (window.innerWidth < 900) return;
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
        element.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });
  }
})();
