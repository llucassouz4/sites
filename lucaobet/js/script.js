/* ================================================================
   LucãoBet — Premium Global Casino
   js/script.js
   Version: 1.0.0 | 2026
   Vanilla JS pesado — sem dependências externas
================================================================ */

/* ================================================================
   1. CUSTOM CURSOR
================================================================ */
(function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  if (!cursor || !cursorTrail) return;

  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    // Main cursor — instant
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';

    // Trail — smooth lerp via RAF
    trailX += (e.clientX - trailX) * 0.15;
    trailY += (e.clientY - trailY) * 0.15;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
  });

  // Enlarge cursor on interactive elements
  document.querySelectorAll('a, button, [data-tilt], .game-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '36px';
      cursor.style.height = '36px';
      cursor.style.background = 'radial-gradient(circle, #f5d76e, #ff00aa)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'radial-gradient(circle, #d4af37, #00f5ff)';
    });
  });

  // Trail animation loop
  function animateTrail() {
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();


/* ================================================================
   2. PARTICLE SYSTEM — Gold + Diamond Canvas
================================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  /* Particle types */
  const TYPES = ['gold', 'diamond', 'star', 'spark'];

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x     = Math.random() * W;
      this.y     = -20;
      this.size  = Math.random() * 5 + 2;
      this.speedY = Math.random() * 1.2 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.rotate = Math.random() * 360;
      this.rotateSpeed = (Math.random() - 0.5) * 2;
      this.type  = TYPES[Math.floor(Math.random() * TYPES.length)];
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.y       += this.speedY;
      this.x       += this.speedX + Math.sin(this.y / 80) * 0.3;
      this.rotate  += this.rotateSpeed;
      this.pulse   += 0.04;
      this.opacity = 0.15 + Math.abs(Math.sin(this.pulse)) * 0.5;
      if (this.y > H + 20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotate * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'gold') {
        // Gold coin
        ctx.fillStyle = '#d4af37';
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur  = 12;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Inner highlight
        ctx.fillStyle = 'rgba(255,240,150,0.6)';
        ctx.beginPath();
        ctx.arc(-this.size * 0.2, -this.size * 0.2, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

      } else if (this.type === 'diamond') {
        // Diamond shape
        ctx.fillStyle = '#00f5ff';
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur  = 16;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.2);
        ctx.lineTo(this.size * 0.8, 0);
        ctx.lineTo(0, this.size * 1.2);
        ctx.lineTo(-this.size * 0.8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.lineTo(this.size * 0.3, 0);
        ctx.lineTo(0, -this.size * 0.2);
        ctx.closePath();
        ctx.fill();

      } else if (this.type === 'star') {
        // 4-point star
        ctx.fillStyle = '#f5d76e';
        ctx.shadowColor = '#f5d76e';
        ctx.shadowBlur  = 10;
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 2);
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 1.5);
          ctx.lineTo(this.size * 0.3, -this.size * 0.3);
          ctx.lineTo(0, 0);
          ctx.lineTo(-this.size * 0.3, -this.size * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

      } else {
        // Spark
        ctx.fillStyle = '#ff00aa';
        ctx.shadowColor = '#ff00aa';
        ctx.shadowBlur  = 8;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      }

      ctx.restore();
    }
  }

  // Create particles
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 100;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * H; // spread initial Y
    particles.push(p);
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ================================================================
   3. TYPING EFFECT — Hero Slogan
================================================================ */
(function initTyping() {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  const phrases = [
    'LucãoBet — Onde os Milionários Jogam e Ganham.',
    'Gates of Olympus. Aviator. Lightning Roulette.',
    'Bônus 300% + 500 Free Spins. Jogue Agora.',
    'Dubai • Las Vegas • Crypto Elite. Seu Nível.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pause     = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { deleting = true; pause = false; }, 2800);
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    if (!pause) {
      const speed = deleting ? 35 : 65;
      setTimeout(type, speed);
    }
  }

  setTimeout(type, 600);
})();


/* ================================================================
   4. LIVE COUNTERS — Animated fake-live numbers
================================================================ */
(function initCounters() {
  const counters = {
    cntPlayers: { base: 78942,  min: 500,   max: 2000,  fmt: v => v.toLocaleString() },
    cntPaid:    { base: 52.4,   min: 0.05,  max: 0.5,   fmt: v => 'US$ ' + v.toFixed(1) + 'M' },
    cntSpins:   { base: 312000, min: 100,   max: 800,   fmt: v => '+' + v.toLocaleString() },
  };

  // Animate number on first load
  Object.entries(counters).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = cfg.base * 0.85;
    const duration = 2000;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = start + (cfg.base - start) * eased;
      el.textContent = cfg.fmt(value);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });

  // Live update every 4-6 seconds
  setInterval(() => {
    Object.entries(counters).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const delta = (Math.random() > 0.5 ? 1 : -1)
                  * (cfg.min + Math.random() * (cfg.max - cfg.min));
      cfg.base = Math.max(cfg.base * 0.9, cfg.base + delta);
      el.textContent = cfg.fmt(cfg.base);
      el.style.transform = 'scale(1.1)';
      setTimeout(() => { el.style.transform = 'scale(1)'; el.style.transition = 'transform 0.3s'; }, 300);
    });
  }, 5000);
})();


/* ================================================================
   5. CONFETTI EXPLOSION
================================================================ */
window.fireConfetti = function() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  const colors = ['#d4af37','#f5d76e','#00f5ff','#ff00aa','#ffffff','#4b0082','#ff4444','#00ff88'];
  const pieces = 140;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    const startY = window.innerHeight / 2;

    piece.style.left     = startX + 'px';
    piece.style.top      = startY + 'px';
    piece.style.background  = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width    = (Math.random() * 10 + 5) + 'px';
    piece.style.height   = (Math.random() * 10 + 5) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

    const angle    = (Math.random() * 360) * (Math.PI / 180);
    const speed    = Math.random() * 400 + 150;
    const tx       = Math.cos(angle) * speed;
    const ty       = Math.sin(angle) * speed - 300;
    const duration = Math.random() * 1.5 + 1;

    piece.style.animation = `confettiFall ${duration}s ease-out forwards`;
    piece.style.setProperty('--tx', tx + 'px');
    piece.style.setProperty('--ty', ty + 'px');
    piece.style.transform  = `translate(${tx * 0.1}px, ${ty * 0.1}px)`;

    container.appendChild(piece);
    setTimeout(() => piece.remove(), duration * 1000 + 100);
  }

  // Second burst
  setTimeout(() => {
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left       = (20 + Math.random() * 60) + '%';
      piece.style.top        = '-10px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width      = (Math.random() * 8 + 4) + 'px';
      piece.style.height     = (Math.random() * 8 + 4) + 'px';
      piece.style.animation  = `confettiFall ${Math.random() * 2 + 1.5}s linear forwards`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }, 300);
};

// Main CTA confetti
const mainCta = document.getElementById('mainCta');
if (mainCta) mainCta.addEventListener('click', window.fireConfetti);


/* ================================================================
   6. 3D TILT EFFECT — Cards
================================================================ */
(function initTilt() {
  function applyTilt(el) {
    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 12;
      const rotY   =  dx * 12;
      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      el.style.transition = 'transform 0.1s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.transition = 'transform 0.5s ease';
    });
  }

  // Apply after DOM settles (Alpine renders async)
  setTimeout(() => {
    document.querySelectorAll('[data-tilt], .game-card, .bonus-card').forEach(applyTilt);

    // MutationObserver for Alpine-rendered cards
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.game-card:not([data-tilt-init])').forEach(el => {
        el.setAttribute('data-tilt-init', '1');
        applyTilt(el);
      });
    });
    const gameGrid = document.querySelector('.games-grid');
    if (gameGrid) observer.observe(gameGrid, { childList: true, subtree: true });
  }, 800);
})();


/* ================================================================
   7. HALL OF FAME — Winners Grid
================================================================ */
(function initWinners() {
  const grid = document.getElementById('winnersGrid');
  if (!grid) return;

  const winners = [
    { flag:'🇧🇷', name:'L***o S.',   game:'Gates of Olympus 1000', amount:'$1,842,000', mult:'x15.200', time:'2h atrás',    color:'gold' },
    { flag:'🇦🇪', name:'K***d A.',   game:'Aviator',               amount:'$924,500',   mult:'x488.0',  time:'5h atrás',    color:'neon' },
    { flag:'🇺🇸', name:'J***n M.',   game:'Crazy Time 2',          amount:'$638,200',   mult:'x2.500',  time:'8h atrás',    color:'magenta' },
    { flag:'🇷🇺', name:'A***i K.',   game:'Sweet Bonanza 1000',    amount:'$487,900',   mult:'x21.780', time:'12h atrás',   color:'gold' },
    { flag:'🇩🇪', name:'H***s B.',   game:'Wanted Dead or a Wild', amount:'$312,400',   mult:'x10.410', time:'1 dia atrás', color:'neon' },
    { flag:'🇬🇧', name:'O***r T.',   game:'Lightning Roulette',    amount:'$284,920',   mult:'x500x',   time:'1 dia atrás', color:'gold' },
    { flag:'🇫🇷', name:'É***e D.',   game:'Reactoonz 2',           amount:'$198,600',   mult:'x8.270',  time:'2 dias',      color:'magenta' },
    { flag:'🇯🇵', name:'Y***o M.',   game:'Mines',                 amount:'$156,300',   mult:'x52.00',  time:'2 dias',      color:'neon' },
    { flag:'🇲🇽', name:'C***s G.',   game:'Fortune Tiger',         amount:'$134,800',   mult:'x4.000',  time:'3 dias',      color:'gold' },
    { flag:'🇮🇳', name:'R***h P.',   game:'Plinko X',              amount:'$112,400',   mult:'x99.0',   time:'3 dias',      color:'magenta' },
    { flag:'🇿🇦', name:'T***o N.',   game:'Book of Dead',          amount:'$98,700',    mult:'x5.000',  time:'4 dias',      color:'gold' },
    { flag:'🇸🇦', name:'F***d A.',   game:'Bac Bo',                amount:'$76,200',    mult:'x30.0',   time:'5 dias',      color:'neon' },
  ];

  const colorMap = {
    gold:    'rgba(212,175,55,0.15)',
    neon:    'rgba(0,245,255,0.08)',
    magenta: 'rgba(255,0,170,0.08)',
  };
  const textMap = {
    gold: '#d4af37', neon: '#00f5ff', magenta: '#ff00aa',
  };

  winners.forEach(w => {
    const card = document.createElement('div');
    card.className = 'winner-card';
    card.style.background = `linear-gradient(145deg, ${colorMap[w.color]}, rgba(255,255,255,0.01))`;
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span class="winner-flag">${w.flag}</span>
        <div>
          <div class="winner-name">${w.name}</div>
          <div class="winner-game">${w.game}</div>
        </div>
      </div>
      <div class="winner-amount" style="color:${textMap[w.color]}">${w.amount}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <div class="winner-mult" style="color:${textMap[w.color]}">${w.mult}</div>
        <div class="winner-time">${w.time}</div>
      </div>
    `;
    grid.appendChild(card);
  });
})();


/* ================================================================
   8. LIVE FEED — Real-time fake winners stream
================================================================ */
(function initLiveFeed() {
  const feed = document.getElementById('liveFeed');
  if (!feed) return;

  const flags   = ['🇧🇷','🇺🇸','🇦🇪','🇷🇺','🇩🇪','🇬🇧','🇫🇷','🇯🇵','🇲🇽','🇮🇳','🇰🇷','🇨🇦','🇦🇺','🇵🇹','🇪🇸','🇦🇷'];
  const players = ['L***o','K***d','J***n','A***i','H***s','O***r','Y***o','C***s','R***h','T***o','M***a','N***k','P***l','V***r'];
  const games   = ['Gates of Olympus','Aviator','Crazy Time','Sweet Bonanza','Lightning Roulette','Mines','Plinko X','Fortune Tiger','Book of Dead','Monopoly Big Baller','Bac Bo','Reactoonz'];

  function randomAmount() {
    const r = Math.random();
    if (r > 0.92) return { v: (Math.random() * 100 + 50).toFixed(2) + 'K', cls: 'big' };
    if (r > 0.75) return { v: '$' + (Math.random() * 9000 + 1000).toFixed(0), cls: 'medium' };
    return         { v: '$' + (Math.random() * 900 + 50).toFixed(0), cls: 'small' };
  }

  function randomMult() {
    const m = (Math.random() * 1000 + 1.5).toFixed(1);
    return 'x' + m;
  }

  function addEntry() {
    const flag   = flags[Math.floor(Math.random() * flags.length)];
    const player = players[Math.floor(Math.random() * players.length)];
    const game   = games[Math.floor(Math.random() * games.length)];
    const amt    = randomAmount();
    const mult   = randomMult();

    const item = document.createElement('div');
    item.className = 'live-feed-item';
    item.innerHTML = `
      <span class="feed-flag">${flag}</span>
      <div style="flex:1;min-width:0;">
        <div class="feed-player">${player}</div>
        <div class="feed-game">${game}</div>
      </div>
      <div style="text-align:right;">
        <div class="feed-amount ${amt.cls}">${amt.v}</div>
        <div class="feed-mult">${mult}</div>
      </div>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Keep max 20 entries
    const items = feed.querySelectorAll('.live-feed-item');
    if (items.length > 20) items[items.length - 1].remove();
  }

  // Seed with initial entries
  for (let i = 0; i < 10; i++) addEntry();

  // Stream new entries
  function scheduleNext() {
    const delay = 800 + Math.random() * 2200;
    setTimeout(() => { addEntry(); scheduleNext(); }, delay);
  }
  scheduleNext();

  // Update "live count" indicator
  const liveCount = document.getElementById('liveCount');
  if (liveCount) {
    setInterval(() => {
      liveCount.textContent = '↑ ' + (1 + Math.floor(Math.random() * 5)) + ' novo(s)/seg';
    }, 1500);
  }
})();


/* ================================================================
   9. BIG WIN — Rotate showcase
================================================================ */
(function initBigWin() {
  const bigWins = [
    { game:'Gates of Olympus 1000', amount:'$1,842,000', player:'🇧🇷 L***o • há 2h',  mult:'x15.200' },
    { game:'Aviator',               amount:'$924,500',   player:'🇦🇪 K***d • há 5h',  mult:'x488.0' },
    { game:'Crazy Time 2',          amount:'$638,200',   player:'🇺🇸 J***n • há 8h',  mult:'x2.500' },
    { game:'Sweet Bonanza 1000',    amount:'$487,900',   player:'🇷🇺 A***i • há 12h', mult:'x21.780' },
  ];
  let idx = 0;

  function rotateBigWin() {
    const w = bigWins[idx % bigWins.length];
    const gEl = document.getElementById('bigWinGame');
    const aEl = document.getElementById('bigWinAmt');
    const pEl = document.getElementById('bigWinPlayer');
    const mEl = document.getElementById('bigWinMult');
    if (!gEl) return;

    [gEl, aEl, pEl, mEl].forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; });
    setTimeout(() => {
      gEl.textContent = w.game;
      aEl.textContent = w.amount;
      pEl.textContent = w.player;
      mEl.textContent = w.mult;
      [gEl, aEl, pEl, mEl].forEach(el => {
        el.style.transition = 'opacity 0.5s, transform 0.5s';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      });
    }, 300);
    idx++;
  }

  setInterval(rotateBigWin, 6000);
})();


/* ================================================================
   10. TICKER BAR — Live winners top strip
================================================================ */
(function initTicker() {
  const inner = document.getElementById('tickerInner');
  if (!inner) return;

  const items = [
    { flag:'🇧🇷', name:'L***o', game:'Gates of Olympus', amount:'$284K', mult:'x5.840' },
    { flag:'🇦🇪', name:'K***d', game:'Aviator',           amount:'$924K', mult:'x488' },
    { flag:'🇺🇸', name:'J***n', game:'Crazy Time',        amount:'$638K', mult:'x2.500' },
    { flag:'🇩🇪', name:'H***s', game:'Wanted Wild',       amount:'$312K', mult:'x10.410' },
    { flag:'🇷🇺', name:'A***i', game:'Sweet Bonanza',     amount:'$487K', mult:'x21.780' },
    { flag:'🇬🇧', name:'O***r', game:'Lightning Roulette',amount:'$198K', mult:'x500' },
    { flag:'🇯🇵', name:'Y***o', game:'Mines',             amount:'$156K', mult:'x52' },
    { flag:'🇫🇷', name:'É***e', game:'Reactoonz 2',       amount:'$112K', mult:'x8.270' },
    { flag:'🇲🇽', name:'C***s', game:'Fortune Tiger',     amount:'$98K',  mult:'x4.000' },
    { flag:'🇰🇷', name:'M***n', game:'Bac Bo',            amount:'$76K',  mult:'x30.0' },
  ];

  // Duplicate for seamless loop
  [...items, ...items].forEach(item => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.innerHTML = `
      ${item.flag} <strong style="color:#fff">${item.name}</strong>
      ganhou <span class="t-amount">${item.amount}</span>
      em ${item.game} (${item.mult})
      &nbsp;&nbsp;•&nbsp;&nbsp;
    `;
    inner.appendChild(span);
  });
})();


/* ================================================================
   11. TOURNAMENT TIMER
================================================================ */
(function initTimer() {
  // Target: 4 days, 17h from now
  const target = new Date(Date.now() + (4 * 86400 + 17 * 3600 + 33 * 60 + 59) * 1000);

  function updateTimer() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    const dEl = document.getElementById('tDays');
    const hEl = document.getElementById('tHours');
    const mEl = document.getElementById('tMins');
    const sEl = document.getElementById('tSecs');

    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }
  updateTimer();
  setInterval(updateTimer, 1000);
})();


/* ================================================================
   12. TOURNAMENT LEADERBOARD
================================================================ */
(function initLeaderboard() {
  const lb = document.getElementById('leaderboard');
  if (!lb) return;

  const leaders = [
    { rank:1, flag:'🇧🇷', name:'L***o S.',   score:'284,920 pts', prize:'$100,000' },
    { rank:2, flag:'🇦🇪', name:'K***d A.',   score:'218,440 pts', prize:'$60,000'  },
    { rank:3, flag:'🇺🇸', name:'J***n M.',   score:'194,230 pts', prize:'$40,000'  },
    { rank:4, flag:'🇷🇺', name:'A***i K.',   score:'176,800 pts', prize:'$20,000'  },
    { rank:5, flag:'🇩🇪', name:'H***s B.',   score:'154,100 pts', prize:'$10,000'  },
  ];

  const rankClass = { 1:'top1', 2:'top2', 3:'top3' };

  leaders.forEach(l => {
    const row = document.createElement('div');
    row.className = 'lb-row';
    row.innerHTML = `
      <div class="lb-rank ${rankClass[l.rank] || ''}">#${l.rank}</div>
      <div class="lb-player">${l.flag} ${l.name}</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-right:8px;">${l.score}</div>
      <div class="lb-prize">${l.prize}</div>
    `;
    lb.appendChild(row);
  });

  // Animate scores live
  setInterval(() => {
    const rows = lb.querySelectorAll('.lb-row');
    rows.forEach((row, i) => {
      const scoreEl = row.querySelectorAll('div')[2];
      if (!scoreEl) return;
      const current = leaders[i];
      current.score = (parseInt(current.score) + Math.floor(Math.random() * 800 + 100)).toLocaleString() + ' pts';
      scoreEl.textContent = current.score;
    });
  }, 3000);
})();


/* ================================================================
   13. HEADER SCROLL EFFECT
================================================================ */
(function initScrollHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ================================================================
   14. LUCIDE ICONS — Initialize after DOM ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});


/* ================================================================
   15. SCROLL REVEAL — Fade-in on scroll
================================================================ */
(function initScrollReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.bonus-card, .winner-card, .live-card, .vip-tier-card, .section-header, .timer-block'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();


/* ================================================================
   16. SMOOTH SCROLL for anchor links
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      document.querySelector('[x-data]').__x && (document.querySelector('[x-data]').__x.$data.mobileMenu = false);
    }
  });
});


/* ================================================================
   17. PERFORMANCE — Lazy load images via IntersectionObserver
================================================================ */
(function initLazyImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) return; // Native lazy load supported

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
})();


/* ================================================================
   18. TOAST HELPER — Global JS toast (complements Alpine)
================================================================ */
window.showJsToast = function(msg, icon = '✅') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.style.display = 'flex';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 500);
  }, 4000);
};


/* ================================================================
   19. GOLD SHIMMER on hover — dynamic highlight effect
================================================================ */
(function initGoldShimmer() {
  const cards = document.querySelectorAll('.bonus-card, .winner-card, .vip-tier-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 50%, transparent 100%)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ================================================================
   20. GAME CARD — Particle burst on click
================================================================ */
(function initGameBurst() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;

    const colors = ['#d4af37','#00f5ff','#ff00aa','#ffffff'];
    for (let i = 0; i < 16; i++) {
      const spark = document.createElement('div');
      spark.style.cssText = `
        position:fixed; width:6px; height:6px; border-radius:50%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${cx}px; top:${cy}px; pointer-events:none; z-index:9999;
        transition: transform ${0.4 + Math.random() * 0.4}s ease-out, opacity 0.6s ease;
      `;
      document.body.appendChild(spark);
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist  = 40 + Math.random() * 80;
      requestAnimationFrame(() => {
        spark.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
        spark.style.opacity   = '0';
      });
      setTimeout(() => spark.remove(), 800);
    }
  });
})();


console.log('%c💎 LucãoBet — Casino Premium Global', 'color:#d4af37;font-size:18px;font-weight:900;font-family:serif;');
console.log('%cVersion 1.0.0 | 2026 | Made with ❤️ for the elite', 'color:#00f5ff;font-size:12px;');
