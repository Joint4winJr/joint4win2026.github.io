(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('#nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealItems.forEach(function (item) {
      io.observe(item);
    });
  }

  const countdownTarget = document.querySelector('#promo-countdown');
  if (countdownTarget) {
    const key = 'j4w_deadline';
    const now = Date.now();
    let deadline = Number(localStorage.getItem(key));

    if (!deadline || Number.isNaN(deadline) || deadline <= now) {
      deadline = now + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(key, String(deadline));
    }

    const pad = function (n) {
      return String(n).padStart(2, '0');
    };

    const renderCountdown = function () {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        countdownTarget.textContent = '00d 00:00:00';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      countdownTarget.textContent = days + 'd ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    };

    renderCountdown();
    setInterval(renderCountdown, 1000);
  }

  const starsCanvas = document.querySelector('#stars-canvas');
  if (starsCanvas && starsCanvas.getContext) {
    const ctx = starsCanvas.getContext('2d');
    const particles = [];
    const count = 90;

    const resize = function () {
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
    };

    const makeParticle = function () {
      return {
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        c: Math.random() > 0.5 ? '#f5a800' : '#00c8ff',
        a: Math.random() * 0.7 + 0.3
      };
    };

    const seed = function () {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push(makeParticle());
      }
    };

    const draw = function () {
      ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > starsCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > starsCanvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();

    window.addEventListener('resize', function () {
      resize();
      seed();
    });
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.faq-panel');

  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const target = button.getAttribute('data-tab');
        tabButtons.forEach(function (btn) {
          btn.classList.toggle('active', btn === button);
        });
        tabPanels.forEach(function (panel) {
          panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
        });
      });
    });
  }

  const supportForm = document.querySelector('#support-form');
  const supportFormWrap = document.querySelector('#support-form-wrap');
  const supportSuccess = document.querySelector('#support-success');

  if (supportForm && supportFormWrap && supportSuccess) {
    supportForm.addEventListener('submit', function (event) {
      event.preventDefault();
      supportFormWrap.style.display = 'none';
      supportSuccess.style.display = 'block';
    });
  }
})();
