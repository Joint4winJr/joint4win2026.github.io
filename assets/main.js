(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('#site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach(function (item) {
      observer.observe(item);
    });
  }

  document.querySelectorAll('.faq-item .faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');
      const group = item.parentElement;
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          openItem.classList.remove('open');
          const openButton = openItem.querySelector('.faq-question');
          if (openButton) openButton.setAttribute('aria-expanded', 'false');
        });
      }
      item.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  const countdownEl = document.querySelector('#promo-countdown');
  if (countdownEl) {
    const key = 'j4w_promo_end';
    const now = Date.now();
    const fromStorage = localStorage.getItem(key);
    let target = fromStorage ? Number(fromStorage) : now + 7 * 24 * 60 * 60 * 1000;

    if (!fromStorage || Number.isNaN(target) || target < now) {
      target = now + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(key, String(target));
    }

    const pad = function (num) {
      return String(num).padStart(2, '0');
    };

    const render = function () {
      const diff = target - Date.now();
      if (diff <= 0) {
        countdownEl.textContent = '00d 00:00:00';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      countdownEl.textContent = d + 'd ' + pad(h) + ':' + pad(m) + ':' + pad(s);
    };

    render();
    setInterval(render, 1000);
  }

  const canvas = document.querySelector('#stars-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const stars = [];
    const STAR_COUNT = 85;

    const resize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const randomColor = function () {
      const palette = ['#ffd63e', '#f5a800', '#00c8ff', '#a855f7', '#f0f4ff'];
      return palette[Math.floor(Math.random() * palette.length)];
    };

    const createStar = function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        c: randomColor(),
        a: Math.random() * 0.8 + 0.2
      };
    };

    const initStars = function () {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push(createStar());
      }
    };

    const draw = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(function (star) {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = star.c;
        ctx.globalAlpha = star.a;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw();
    window.addEventListener('resize', function () {
      resize();
      initStars();
    });
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  const faqPanels = document.querySelectorAll('.faq-panel');

  if (tabButtons.length && faqPanels.length) {
    tabButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const target = button.getAttribute('data-tab');
        tabButtons.forEach(function (btn) {
          btn.classList.toggle('active', btn === button);
        });
        faqPanels.forEach(function (panel) {
          panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
        });
      });
    });
  }

  const supportSearch = document.querySelector('#support-search');
  if (supportSearch && faqPanels.length) {
    supportSearch.addEventListener('input', function () {
      const query = supportSearch.value.trim().toLowerCase();
      faqPanels.forEach(function (panel) {
        panel.querySelectorAll('.faq-item').forEach(function (item) {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? '' : 'none';
        });
      });
    });
  }

  const form = document.querySelector('#support-form');
  const success = document.querySelector('#form-success');
  if (form && success) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.reset();
      success.style.display = 'block';
      setTimeout(function () {
        success.style.display = 'none';
      }, 5000);
    });
  }
})();