/* ============================================================
   SADAT'S PORTFOLIO — MINECRAFT EDITION
   Full pixel-art JS interactions & atmosphere
   ============================================================ */

/* ---------- PARTICLE SYSTEM (falling blocks + sparkles) ---------- */
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

  // Block shapes: 0 = square pixel, 1 = small diamond chunk, 2 = tiny spark
  const BLOCK_COLORS = [
    '#4fc3f7', // diamond
    '#ffd54f', // gold
    '#5d9c40', // grass
    '#adadad', // stone
    '#43a047', // emerald
    '#e53935', // redstone
    '#a0722a', // wood plank
    '#c7f9ff', // ice
    '#f0f6fc', // quartz
  ];

  function Particle() {
    this.reset = function () {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H + H;
      this.size = Math.floor(Math.random() * 4 + 2); // pixel-sized squares
      this.vx   = (Math.random() - .5) * .6;
      this.vy   = -(Math.random() * 1.2 + .4);
      this.color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
      this.alpha = Math.random() * .5 + .2;
      this.life  = 0;
      this.maxLife = 180 + Math.random() * 280;
      this.spin  = Math.random() > .7; // some particles spin
      this.angle = 0;
      this.angleDelta = (Math.random() - .5) * .08;
    };
    this.reset();
    this.y = Math.random() * H; // initial spread
  }

  for (let i = 0; i < 70; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.life++;
      if (p.spin) p.angle += p.angleDelta;
      if (p.life > p.maxLife || p.y < -20) p.reset();

      const fade = 1 - p.life / p.maxLife;
      ctx.globalAlpha = p.alpha * fade;
      ctx.fillStyle   = p.color;

      // Render as crisp pixel squares (Minecraft-style)
      const s = p.size;
      if (p.spin) {
        ctx.save();
        ctx.translate(Math.floor(p.x) + s / 2, Math.floor(p.y) + s / 2);
        ctx.rotate(p.angle);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      } else {
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), s, s);
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();

  // Click burst — dig effect: spawn 8 mini block particles at click
  document.addEventListener('click', (e) => {
    const burstColors = ['#4fc3f7', '#ffd54f', '#5d9c40', '#e53935'];
    for (let i = 0; i < 8; i++) {
      const p = new Particle();
      p.x    = e.clientX;
      p.y    = e.clientY;
      p.vx   = (Math.random() - .5) * 4;
      p.vy   = Math.random() * -3 - 1;
      p.size = Math.floor(Math.random() * 5 + 3);
      p.color = burstColors[Math.floor(Math.random() * burstColors.length)];
      p.alpha = .9;
      p.maxLife = 60 + Math.random() * 40;
      particles.push(p);
    }
    // Keep particle count reasonable
    if (particles.length > 140) particles.splice(0, 8);
  });
})();

/* ---------- SKY CYCLE (day/night with smooth transitions) ---------- */
(function () {
  const sky = document.getElementById('sky-cycle');
  const skies = [
    // Night
    'linear-gradient(180deg,#06101e 0%,#0f172a 60%,#111827 100%)',
    // Dawn
    'linear-gradient(180deg,#1a0533 0%,#f97316 40%,#fbbf24 70%,#c7f9ff 100%)',
    // Day
    'linear-gradient(180deg,#1a5276 0%,#2e86c1 40%,#87ceeb 100%)',
    // Dusk
    'linear-gradient(180deg,#111827 0%,#7c3aed 20%,#f97316 50%,#06101e 100%)',
  ];
  const TIME_LABELS = ['🌙 Night', '🌅 Dawn', '☀️ Day', '🌇 Dusk'];
  let idx = 0;

  function cycle() {
    idx = (idx + 1) % skies.length;
    sky.style.background = skies[idx];
    console.log('[MC Portfolio] Sky: ' + TIME_LABELS[idx]);
    setTimeout(cycle, 30000);
  }
  setTimeout(cycle, 30000);
})();

/* ---------- NAV ---------- */
(function () {
  const burger = document.getElementById('hamburger');
  const links  = document.getElementById('navLinks');
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navAs.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }, { passive: true });
})();

/* ---------- SCROLL TO TOP ---------- */
(function () {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- SCROLL REVEAL ---------- */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll('.timeline-entry, .ach-card').forEach(el => obs.observe(el));

  // Skill bar fill on reveal
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
  const rail  = document.getElementById('experience');
  if (!cart || !rail) return;

  window.addEventListener('scroll', () => {
    const rect = rail.getBoundingClientRect();
    const h    = rail.offsetHeight;
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = Math.min(1, Math.max(0, (-rect.top + 100) / (h - 200)));
      cart.style.top = (progress * (h - 80)) + 'px';
    }
  }, { passive: true });
})();

/* ---------- ACHIEVEMENT POPUP ---------- */
(function () {
  const popup = document.getElementById('achievementPopup');
  const icon  = document.getElementById('achIcon');
  const title = document.getElementById('achTitle');
  let queue = [], showing = false;

  const achieves = [
    { icon: '🌐', title: 'Portfolio Discovered!' },
    { icon: '⛏', title: 'Diamond Mined!' },
    { icon: '📚', title: 'Knowledge Collected!' },
    { icon: '🎮', title: 'Player Joined!' },
  ];

  function showNext() {
    if (showing || queue.length === 0) return;
    showing = true;
    const a = queue.shift();
    icon.textContent  = a.icon;
    title.textContent = a.title;
    popup.classList.add('show');

    // Play a subtle ding using Web Audio API
    playAchSound();

    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => {
        showing = false;
        showNext();
      }, 500);
    }, 4000);
  }

  function queueAch(a) {
    queue.push(a);
    showNext();
  }

  // Welcome achievement
  setTimeout(() => queueAch(achieves[0]), 1500);

  // Section-based achievements
  const achMap = {
    skills:       { icon: '💎', title: 'Inventory Opened!' },
    projects:     { icon: '🏗',  title: 'Structures Discovered!' },
    achievements: { icon: '🏆', title: 'Hall of Fame Entered!' },
    contact:      { icon: '✉️',  title: 'Ready to Connect!' },
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && achMap[e.target.id]) {
        queueAch(achMap[e.target.id]);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });

  ['skills', 'projects', 'achievements', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ---------- WEB AUDIO — subtle block/achievement sounds ---------- */
function playAchSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Two-note chime (Minecraft achievement-style)
    [523.25, 659.25].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.12 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch (e) {
    // Audio not supported — fail silently
  }
}

function playClickSound() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

/* ---------- CONTACT FORM ---------- */
(function () {
  const form = document.getElementById('contactForm');
  const msg  = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    if (!name || !email || !message) {
      msg.textContent  = '⚠ Please fill all required fields.';
      msg.className    = 'form-msg error';
      msg.style.display = 'block';
      playClickSound();
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.textContent = '⛏ Mining…';
    btn.disabled    = true;

    setTimeout(() => {
      msg.textContent  = '✅ Message sent! I\'ll get back to you soon.';
      msg.className    = 'form-msg success';
      msg.style.display = 'block';
      form.reset();
      btn.textContent = '⛏ Send It';
      btn.disabled    = false;
      playAchSound();
      setTimeout(() => msg.style.display = 'none', 5000);
    }, 1200);
  });
})();

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      t.scrollIntoView({ behavior: 'smooth' });
      playClickSound();
    }
  });
});

/* ---------- INVENTORY TOOLTIP MOBILE FIX ---------- */
document.querySelectorAll('.inv-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    const tip = slot.querySelector('.inv-tooltip');
    if (!tip) return;
    const wasVisible = tip.style.opacity === '1';
    document.querySelectorAll('.inv-tooltip').forEach(t => t.style.opacity = '0');
    if (!wasVisible) {
      tip.style.opacity = '1';
      playClickSound();
    }
  });
});

/* ---------- STAGGER ANIMATIONS ---------- */
document.querySelectorAll('.ach-card').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.07) + 's';
});
document.querySelectorAll('.timeline-entry').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.12) + 's';
});

/* ---------- CRAFTING TABLE INTERACTION ---------- */
(function () {
  const slots = document.querySelectorAll('.craft-slot');
  const result = document.querySelector('.craft-result');
  if (!slots.length || !result) return;

  // Items that can be placed
  const craftItems = ['🪵', '🪨', '⚒️', '🌿', '💎', '🔥', '❄️', '⚙️', '📜'];
  let filledCount = 0;

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('filled')) {
        slot.textContent = '';
        slot.classList.remove('filled');
        filledCount = Math.max(0, filledCount - 1);
      } else {
        const item = craftItems[Math.floor(Math.random() * craftItems.length)];
        slot.textContent = item;
        slot.classList.add('filled', 'block-place');
        slot.addEventListener('animationend', () => slot.classList.remove('block-place'), { once: true });
        filledCount++;
        playClickSound();
      }

      // Update result slot
      if (filledCount >= 3) {
        result.textContent = '✨';
        result.style.animation = 'none';
        void result.offsetWidth;
        result.style.animation = 'enchantShimmer 2s ease-in-out infinite';
      } else if (filledCount > 0) {
        result.textContent = '🔨';
        result.style.animation = 'none';
      } else {
        result.textContent = '';
        result.style.animation = 'none';
      }
    });
  });
})();

/* ---------- HOUSE DOOR EASTER EGG ---------- */
(function () {
  const door = document.querySelector('.house-door');
  if (!door) return;
  let knockCount = 0;
  const msgs = [
    'Who\'s there? 🤔',
    'It\'s a Creeper! 💚',
    'SSSSSS... 😱',
    'Just kidding, no TNT here 😄',
  ];
  door.addEventListener('click', () => {
    playClickSound();
    knockCount++;
    door.querySelector('.door-label')?.remove();
    const label = document.createElement('span');
    label.className = 'door-label';
    label.style.cssText = `
      position:absolute; left:50%; transform:translateX(-50%);
      bottom:110%; white-space:nowrap;
      background:#0d1117; color:#4fc3f7;
      font-family:var(--font-mono); font-size:.75rem;
      padding:4px 10px; border:2px solid var(--diamond);
      pointer-events:none; z-index:20;
    `;
    label.textContent = msgs[(knockCount - 1) % msgs.length];
    door.style.position = 'relative';
    door.appendChild(label);
    setTimeout(() => label.remove(), 2500);
  });
})();

/* ---------- 3D STEVE VIEWER ---------- */
(function () {
  const canvas = document.getElementById('steve-viewer');
  if (!canvas) return;

  try {
    const viewer = new skinview3d.SkinViewer({
      canvas: canvas,
      width:  300,
      height: 400,
      skin: 'https://minotar.net/skin/Steve',
    });

    // Idle sway animation
    viewer.animations.add(skinview3d.IdleAnimation);

    // Camera positioning
    viewer.camera.position.set(20, 15, 40);
    viewer.camera.lookAt(0, 0, 0);

    // Mouse-tracking head rotation
    let targetYaw = 0, targetPitch = 0;
    let currentYaw = 0, currentPitch = 0;

    document.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth  / 2;
      const centerY = window.innerHeight / 2;
      targetYaw   = Math.atan2(e.clientX - centerX, 300) * 0.9;
      targetPitch = Math.atan2(-(e.clientY - centerY), 300) * 0.35;
    });

    document.addEventListener('mouseleave', () => {
      targetYaw   = 0;
      targetPitch = 0;
    });

    // Smooth lerp for natural head movement
    function lerpRotation() {
      currentYaw   += (targetYaw   - currentYaw)   * 0.08;
      currentPitch += (targetPitch - currentPitch) * 0.08;
      if (viewer.playerObject) {
        viewer.playerObject.rotation.y = currentYaw;
        viewer.playerObject.rotation.x = currentPitch;
      }
      requestAnimationFrame(lerpRotation);
    }
    lerpRotation();

  } catch (err) {
    console.warn('[MC Portfolio] Steve viewer failed:', err);
  }
})();

/* ---------- HOTBAR KEYBOARD SHORTCUT HINT ---------- */
(function () {
  const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact'];
  document.addEventListener('keydown', (e) => {
    const num = parseInt(e.key);
    if (num >= 1 && num <= SECTIONS.length) {
      const el = document.getElementById(SECTIONS[num - 1]);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        playClickSound();
      }
    }
  });

  // Show hint once on first scroll
  let hintShown = false;
  window.addEventListener('scroll', () => {
    if (!hintShown && window.scrollY > 200) {
      hintShown = true;
      const hint = document.createElement('div');
      hint.style.cssText = `
        position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
        background:#0d1117; color:#8b949e;
        font-family:'JetBrains Mono',monospace; font-size:.75rem;
        padding:6px 14px; border:2px solid #3f3f3f;
        z-index:500; white-space:nowrap;
        animation:fadeUp .4s both;
        pointer-events:none;
      `;
      hint.textContent = '💡 Press 1–7 to jump to any section';
      document.body.appendChild(hint);
      setTimeout(() => hint.remove(), 4000);
    }
  }, { passive: true });
})();