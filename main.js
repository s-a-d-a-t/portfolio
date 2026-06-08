/* ---------- PARTICLE SYSTEM ---------- */
(function () {
  const canvas = document.getElementById('mc-particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H + H;
      this.size = Math.random() * 4 + 2;
      this.vx = (Math.random() - .5) * .5;
      this.vy = -(Math.random() * 1 + .3);
      const colors = ['#5de6d8', '#5d9e3f', '#f5c518', '#ffffff', '#7bc050'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * .6 + .2;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    };
    this.reset();
    this.y = Math.random() * H; // start spread
  }
  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life > p.maxLife || p.y < -20) p.reset();
      ctx.globalAlpha = p.alpha * (1 - p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---------- SKY CYCLE ---------- */
(function () {
  const sky = document.getElementById('sky-cycle');
  const skies = [
    'linear-gradient(180deg,#0a0e2e 0%,#0d1a3d 60%,#1a1a2e 100%)',
    'linear-gradient(180deg,#ff7043 0%,#f5c518 30%,#87ceeb 100%)',
    'linear-gradient(180deg,#87ceeb 0%,#b0d8f0 60%,#e0f0ff 100%)',
    'linear-gradient(180deg,#1a1a3e 0%,#ff7043 40%,#0a0e2e 100%)',
  ];
  let idx = 0;
  function cycle() {
    idx = (idx + 1) % skies.length;
    sky.style.background = skies[idx];
    setTimeout(cycle, 30000);
  }
  setTimeout(cycle, 30000);
})();

/* ---------- NAV ---------- */
(function () {
  const burger = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navAs.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });
})();

/* ---------- SCROLL TO TOP ---------- */
(function () {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- SCROLL REVEAL ---------- */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-bar-mini-fill').forEach(b => {
          b.style.width = b.dataset.w + '%';
        });
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll('.timeline-entry,.ach-card').forEach(el => obs.observe(el));

  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-mini-fill').forEach(b => {
          b.style.width = b.dataset.w + '%';
        });
      }
    });
  }, { threshold: .1 });
  document.querySelectorAll('.inv-slot').forEach(el => skillObs.observe(el));
})();

/* ---------- MINECART SCROLL ---------- */
(function () {
  const cart = document.getElementById('minecart');
  if (!cart) return;
  const rail = document.getElementById('experience');
  if (!rail) return;
  window.addEventListener('scroll', () => {
    const rect = rail.getBoundingClientRect();
    const h = rail.offsetHeight;
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = Math.min(1, Math.max(0, (-rect.top + 100) / (h - 200)));
      cart.style.top = (progress * (h - 80)) + 'px';
    }
  });
})();

/* ---------- ACHIEVEMENT POPUP ---------- */
(function () {
  const popup = document.getElementById('achievementPopup');
  const icon = document.getElementById('achIcon');
  const title = document.getElementById('achTitle');

  const achieves = [
    { icon: '🌐', title: 'Portfolio Discovered!' },
    { icon: '⛏', title: 'Diamond Mined!' },
    { icon: '📚', title: 'Knowledge Collected!' },
    { icon: '🎮', title: 'Player Joined!' },
  ];

  function showAch(a) {
    icon.textContent = a.icon;
    title.textContent = a.title;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 4000);
  }

  setTimeout(() => showAch(achieves[0]), 1500);

  const achMap = {
    skills: { icon: '💎', title: 'Skills Inventory Opened!' },
    projects: { icon: '🏗', title: 'Structures Discovered!' },
    achievements: { icon: '🏆', title: 'Hall of Fame Entered!' },
    contact: { icon: '✉', title: 'Ready to Connect!' },
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && achMap[e.target.id]) {
        showAch(achMap[e.target.id]);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  ['skills', 'projects', 'achievements', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ---------- CONTACT FORM ---------- */
(function () {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();
    if (!name || !email || !message) {
      msg.textContent = '⚠ Please fill all required fields.';
      msg.className = 'form-msg error';
      msg.style.display = 'block';
      return;
    }
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      msg.textContent = "✅ Message sent! I'll get back to you soon.";
      msg.className = 'form-msg success';
      msg.style.display = 'block';
      form.reset();
      btn.textContent = '⛏ Send It';
      btn.disabled = false;
      setTimeout(() => msg.style.display = 'none', 5000);
    }, 1200);
  });
})();

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- INVENTORY TOOLTIP MOBILE FIX ---------- */
document.querySelectorAll('.inv-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    const tip = slot.querySelector('.inv-tooltip');
    if (tip) {
      const wasVisible = tip.style.opacity === '1';
      document.querySelectorAll('.inv-tooltip').forEach(t => t.style.opacity = '0');
      if (!wasVisible) tip.style.opacity = '1';
    }
  });
});

/* ---------- STAGGER ACH CARDS ---------- */
document.querySelectorAll('.ach-card').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.07) + 's';
});
document.querySelectorAll('.timeline-entry').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.12) + 's';
});

/* ---------- 3D STEVE VIEWER ---------- */
(function () {
  const canvas = document.getElementById('steve-viewer');
  if (!canvas) return;

  try {
    const viewer = new skinview3d.SkinViewer({
      canvas: canvas,
      width: 300,
      height: 400,
      skin: "https://minotar.net/skin/Steve"
    });

    // Add idle animation for gentle swaying
    viewer.animations.add(skinview3d.IdleAnimation);

    // Set camera angle for better viewing
    viewer.camera.position.set(20, 15, 40);
    viewer.camera.lookAt(0, 0, 0);

    // Debug: log available objects
    setTimeout(() => {
      console.log('Viewer object:', viewer);
      console.log('Player object:', viewer.playerObject);
      console.log('Scene:', viewer.scene);
    }, 1000);

    // Track mouse position to make Steve rotate and face the cursor direction
    document.addEventListener('mousemove', (e) => {
      // Get window dimensions
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate angle based on mouse position relative to center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Calculate rotation angles
      const yaw = Math.atan2(deltaX, 300) * 0.8; // Horizontal rotation
      const pitch = Math.atan2(-deltaY, 300) * 0.3; // Vertical rotation

      // Apply rotation to player object
      if (viewer.playerObject) {
        viewer.playerObject.rotation.y = yaw;
        viewer.playerObject.rotation.x = pitch;
      }
    });

    // Reset rotation when mouse leaves
    document.addEventListener('mouseleave', () => {
      if (viewer.playerObject) {
        viewer.playerObject.rotation.x = 0;
        viewer.playerObject.rotation.y = 0;
      }
    });
  } catch (err) {
    console.log('Steve viewer failed to load:', err);
  }
})();
