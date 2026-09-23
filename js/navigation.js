/* ============================================================
       NAVIGATION & MOBILE MENU
       ============================================================ */
    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuBtn');

    if (menuBtn && header) {
      menuBtn.addEventListener('click', () => {
        const isOpen = header.classList.toggle('mobile-open');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    document.querySelectorAll('nav a').forEach((link) => {
      link.addEventListener('click', () => {
        if (header) header.classList.remove('mobile-open');
      });
    });

    /* Close on click outside header */
    document.addEventListener('click', (e) => {
      if (!header || !header.classList.contains('mobile-open')) return;
      if (!header.contains(e.target)) {
        header.classList.remove('mobile-open');
      }
    });

    /* Active Nav Highlighter */
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('nav a')];

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    sections.forEach((sec) => navObserver.observe(sec));

    /* Reveal on Scroll */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
