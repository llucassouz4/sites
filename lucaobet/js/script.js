/* ================================================================
   LucãoBet — World's Largest Casino Level + Brazilian Market
   js/script.js  |  Versão 2.0.0  |  2026
   100% Vanilla JS — sem dependências externas
================================================================ */

/* ================================================================
   1. CURSOR PERSONALIZADO — Ouro + Carmesim
================================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    tx += (e.clientX - tx) * 0.14;
    ty += (e.clientY - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
  });

  /* Alarga o cursor ao passar sobre elementos interativos */
  document.querySelectorAll('a, button, [data-tilt], .game-card, .bonus-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '32px';
      cursor.style.height = '32px';
      cursor.style.background = 'radial-gradient(circle, #f5d76e, #c8102e)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      cursor.style.background = 'radial-gradient(circle, #d4af37, #c8102e)';
    });
  });

  /* Loop suave para o trail */
  function loopTrail() {
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(loopTrail);
  }
  loopTrail();
})();


/* ================================================================
   2. SISTEMA DE PARTÍCULAS — Ouro 24k + Diamante + Carmesim
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

  /* Tipos de partículas — nova paleta com carmesim */
  const TYPES = ['gold', 'diamond', 'star', 'crimson', 'gold'];

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x          = Math.random() * W;
      this.y          = -30;
      this.size       = Math.random() * 5 + 2;
      this.speedY     = Math.random() * 1.1 + 0.25;
      this.speedX     = (Math.random() - 0.5) * 0.7;
      this.opacity    = Math.random() * 0.55 + 0.15;
      this.rotate     = Math.random() * 360;
      this.rotateSpd  = (Math.random() - 0.5) * 2;
      this.type       = TYPES[Math.floor(Math.random() * TYPES.length)];
      this.pulse      = Math.random() * Math.PI * 2;
    }

    update() {
      this.y        += this.speedY;
      this.x        += this.speedX + Math.sin(this.y / 90) * 0.3;
      this.rotate   += this.rotateSpd;
      this.pulse    += 0.035;
      this.opacity   = 0.12 + Math.abs(Math.sin(this.pulse)) * 0.48;
      if (this.y > H + 25) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotate * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      switch (this.type) {

        case 'gold': {
          /* Moeda de ouro 24k */
          ctx.fillStyle   = '#d4af37';
          ctx.shadowColor = '#d4af37';
          ctx.shadowBlur  = 14;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
          /* Reflexo interno */
          ctx.fillStyle = 'rgba(255,240,140,.6)';
          ctx.beginPath();
          ctx.arc(-this.size * .22, -this.size * .22, this.size * .38, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'diamond': {
          /* Diamante ciano */
          ctx.fillStyle   = '#00d4ff';
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur  = 18;
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 1.3);
          ctx.lineTo(this.size * .85, 0);
          ctx.lineTo(0, this.size * 1.3);
          ctx.lineTo(-this.size * .85, 0);
          ctx.closePath();
          ctx.fill();
          /* Reflexo interno */
          ctx.fillStyle = 'rgba(255,255,255,.45)';
          ctx.beginPath();
          ctx.moveTo(0, -this.size * .85);
          ctx.lineTo(this.size * .3, 0);
          ctx.lineTo(0, -this.size * .2);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'star': {
          /* Estrela dourada */
          ctx.fillStyle   = '#f5d76e';
          ctx.shadowColor = '#f5d76e';
          ctx.shadowBlur  = 12;
          for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI) / 2);
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 1.6);
            ctx.lineTo(this.size * .32, -this.size * .32);
            ctx.lineTo(0, 0);
            ctx.lineTo(-this.size * .32, -this.size * .32);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          break;
        }

        case 'crimson': {
          /* Partícula carmesim — acento brasileiro */
          ctx.fillStyle   = '#c8102e';
          ctx.shadowColor = '#c8102e';
          ctx.shadowBlur  = 10;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * .85, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }
      ctx.restore();
    }
  }

  /* Quantidade de partículas — adapta para mobile */
  const COUNT = window.innerWidth < 768 ? 35 : 90;
  const particles = [];
  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * H; /* Distribui verticalmente no início */
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ================================================================
   3. TYPING EFFECT — Frases em Português Brasileiro
================================================================ */
(function initTyping() {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  /* Frases em português — foco Brasil */
  const phrases = [
    'LucãoBet — Onde Milionários Nascem.',
    'Bônus 300% até R$ 25.000 + 500 Giros.',
    'PIX em 5 Minutos. Saque Real. Garantido.',
    '🇧🇷 O Cassino que o Brasil Merecia.',
    'Gates of Olympus. Aviator. Crazy Time.',
  ];

  let pi = 0, ci = 0, deleting = false, paused = false;

  function type() {
    const cur = phrases[pi];
    if (!deleting) {
      el.textContent = cur.substring(0, ci + 1);
      ci++;
      if (ci === cur.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 3000);
      }
    } else {
      el.textContent = cur.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    if (!paused) setTimeout(type, deleting ? 30 : 58);
  }
  setTimeout(type, 800);
})();


/* ================================================================
   4. CONTADORES AO VIVO — Formato Brasileiro (R$)
================================================================ */
(function initCounters() {
  /* Formato brasileiro: 78.942 jogadores, R$ 264 M, +312.000 giros */
  const counters = {
    cntPlayers: {
      base: 78942,
      min: 400, max: 1800,
      fmt: v => Math.round(v).toLocaleString('pt-BR'),
    },
    cntPaid: {
      base: 264.2,
      min: 0.1, max: 0.8,
      fmt: v => 'R$ ' + v.toFixed(1) + ' M',
    },
    cntSpins: {
      base: 312000,
      min: 80, max: 700,
      fmt: v => '+' + Math.round(v).toLocaleString('pt-BR'),
    },
  };

  /* Animação de entrada */
  Object.entries(counters).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const from  = cfg.base * 0.84;
    const start = performance.now();
    const dur   = 2200;

    function animate(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      el.textContent = cfg.fmt(from + (cfg.base - from) * e);
      if (p < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });

  /* Atualização a cada 5s — "ao vivo" */
  setInterval(() => {
    Object.entries(counters).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const d = (Math.random() > .5 ? 1 : -1) * (cfg.min + Math.random() * (cfg.max - cfg.min));
      cfg.base = Math.max(cfg.base * .88, cfg.base + d);
      el.textContent = cfg.fmt(cfg.base);
      /* Micro animação */
      el.style.transition = 'transform .3s';
      el.style.transform  = 'scale(1.12)';
      setTimeout(() => { el.style.transform = 'scale(1)'; }, 300);
    });
  }, 5000);
})();


/* ================================================================
   5. CONFETTI — Explosão em 2 ondas (cores Brasil + cassino)
================================================================ */
window.fireConfetti = function() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  /* Paleta: ouro, carmesim, ciano, branco, verde Brasil */
  const colors = ['#d4af37','#f5d76e','#c8102e','#00d4ff','#ffffff','#009c3b','#ffdf00','#a88820'];

  /* Onda 1 — explosão radial do centro */
  for (let i = 0; i < 160; i++) {
    const p  = document.createElement('div');
    p.className = 'confetti-piece';

    const sx = window.innerWidth / 2 + (Math.random() - .5) * 220;
    const sy = window.innerHeight / 2;
    p.style.left       = sx + 'px';
    p.style.top        = sy + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width      = (Math.random() * 11 + 4) + 'px';
    p.style.height     = (Math.random() * 11 + 4) + 'px';
    p.style.borderRadius = Math.random() > .45 ? '50%' : '2px';

    const angle = Math.random() * Math.PI * 2;
    const speed = 150 + Math.random() * 420;
    const dur   = 1 + Math.random() * 1.6;
    p.style.animation = `confettiDrop ${dur}s ease-out forwards`;
    p.style.transform = `translate(${Math.cos(angle)*speed*0.08}px,${Math.sin(angle)*speed*0.08}px)`;

    container.appendChild(p);
    setTimeout(() => p.remove(), dur * 1000 + 120);
  }

  /* Onda 2 — chuva do topo (cores Brasil) */
  setTimeout(() => {
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left       = (10 + Math.random() * 80) + '%';
      p.style.top        = '-12px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width      = (Math.random() * 9 + 4) + 'px';
      p.style.height     = (Math.random() * 9 + 4) + 'px';
      const dur          = 1.5 + Math.random() * 2.5;
      p.style.animation  = `confettiDrop ${dur}s linear forwards`;
      container.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 100);
    }
  }, 250);
};

/* Liga confetti ao CTA principal */
const mainCta = document.getElementById('mainCta');
if (mainCta) mainCta.addEventListener('click', window.fireConfetti);


/* ================================================================
   6. EFEITO TILT 3D — Cards com perspectiva
================================================================ */
(function initTilt() {
  function applyTilt(el) {
    el.addEventListener('mousemove', (e) => {
      const r   = el.getBoundingClientRect();
      const dx  = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      const dy  = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      el.style.transform  = `perspective(900px) rotateX(${-dy*10}deg) rotateY(${dx*10}deg) scale(1.03)`;
      el.style.transition = 'transform .08s ease';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.transition = 'transform .5s ease';
    });
  }

  setTimeout(() => {
    document.querySelectorAll('[data-tilt], .bonus-card').forEach(applyTilt);

    /* Observer para cards de jogos renderizados pelo Alpine */
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.game-card:not([data-tilt-init])').forEach(el => {
        el.setAttribute('data-tilt-init', '1');
        applyTilt(el);
      });
    });
    const grid = document.querySelector('.games-grid');
    if (grid) observer.observe(grid, { childList: true, subtree: true });
  }, 900);
})();


/* ================================================================
   7. HALL OF FAME — Vencedores com foco no Brasil
================================================================ */
(function initWinners() {
  const grid = document.getElementById('winnersGrid');
  if (!grid) return;

  /* Vencedores reais com nomes e cidades brasileiras em destaque */
  const winners = [
    { flag:'🇧🇷', name:'João S.',     city:'São Paulo, SP',   game:'Gates of Olympus 1000', amount:'R$ 9.420.000', mult:'x15.200', time:'2h atrás',    color:'gold' },
    { flag:'🇧🇷', name:'Maria F.',    city:'Rio de Janeiro',  game:'Fortune Tiger',         amount:'R$ 4.750.000', mult:'x8.400',  time:'5h atrás',    color:'crimson' },
    { flag:'🇧🇷', name:'Lucas M.',    city:'Belo Horizonte',  game:'Aviator',               amount:'R$ 4.620.000', mult:'x488.0',  time:'8h atrás',    color:'gold' },
    { flag:'🇦🇪', name:'K***d A.',    city:'Dubai, UAE',      game:'Lightning Roulette',    amount:'R$ 4.470.000', mult:'x500',    time:'12h atrás',   color:'cyan' },
    { flag:'🇧🇷', name:'Gabriel O.',  city:'Curitiba, PR',    game:'Sweet Bonanza 1000',    amount:'R$ 2.440.000', mult:'x21.780', time:'1 dia',       color:'gold' },
    { flag:'🇺🇸', name:'J***n M.',    city:'Las Vegas, USA',  game:'Crazy Time 2',          amount:'R$ 3.190.000', mult:'x2.500',  time:'1 dia',       color:'crimson' },
    { flag:'🇧🇷', name:'Ana Carolina',city:'Salvador, BA',    game:'Mines',                 amount:'R$ 780.000',   mult:'x52.00',  time:'2 dias',      color:'cyan' },
    { flag:'🇧🇷', name:'Pedro H.',    city:'Fortaleza, CE',   game:'Plinko X',              amount:'R$ 560.000',   mult:'x99.0',   time:'2 dias',      color:'gold' },
    { flag:'🇷🇺', name:'A***i K.',    city:'Moscou, RU',      game:'Reactoonz 2',           amount:'R$ 990.000',   mult:'x8.270',  time:'3 dias',      color:'cyan' },
    { flag:'🇧🇷', name:'Fernanda L.', city:'Porto Alegre, RS',game:'Big Bass Bonanza',      amount:'R$ 490.000',   mult:'x5.000',  time:'3 dias',      color:'gold' },
    { flag:'🇬🇧', name:'O***r T.',    city:'Londres, UK',     game:'Book of Dead',          amount:'R$ 490.000',   mult:'x5.000',  time:'4 dias',      color:'crimson' },
    { flag:'🇧🇷', name:'Carlos E.',   city:'Recife, PE',      game:'Bac Bo',                amount:'R$ 380.000',   mult:'x30.0',   time:'5 dias',      color:'gold' },
  ];

  const bgMap = {
    gold:    'linear-gradient(145deg, rgba(212,175,55,.07), rgba(26,18,11,.7))',
    crimson: 'linear-gradient(145deg, rgba(200,16,46,.07),  rgba(10,8,8,.7))',
    cyan:    'linear-gradient(145deg, rgba(0,212,255,.05),  rgba(10,8,8,.7))',
  };
  const colorMap = { gold:'#d4af37', crimson:'#ff7a8a', cyan:'#00d4ff' };

  winners.forEach(w => {
    const card = document.createElement('div');
    card.className = 'winner-card';
    card.style.background = bgMap[w.color];
    card.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <span class="winner-flag">${w.flag}</span>
        <div>
          <div class="winner-name">${w.name}</div>
          <div class="winner-city">${w.city}</div>
          <div class="winner-game">${w.game}</div>
        </div>
      </div>
      <div class="winner-amount" style="color:${colorMap[w.color]}">${w.amount}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <div class="winner-mult" style="color:${colorMap[w.color]}">${w.mult}</div>
        <div class="winner-time">${w.time}</div>
      </div>
    `;
    grid.appendChild(card);
  });
})();


/* ================================================================
   8. FEED AO VIVO — Stream de vencedores com nomes brasileiros
================================================================ */
(function initLiveFeed() {
  const feed = document.getElementById('liveFeed');
  if (!feed) return;

  /* Peso maior para Brasil: 8/12 flags são 🇧🇷 */
  const flags   = ['🇧🇷','🇧🇷','🇧🇷','🇧🇷','🇧🇷','🇧🇷','🇧🇷','🇧🇷','🇦🇪','🇺🇸','🇷🇺','🇩🇪','🇬🇧','🇵🇹','🇦🇷','🇲🇽'];
  /* Nomes brasileiros predominantes */
  const players = ['João S.','Maria F.','Lucas M.','Ana C.','Pedro H.','Gab***l','Ca***na','Fe***do','Ra***el','Pa***la','Thi***o','La***sa','M***cos','B***una','K***d A.','J***n M.'];
  /* Cidades brasileiras */
  const cities  = ['São Paulo','Rio','BH','Curitiba','Fortaleza','Salvador','Recife','Manaus','Brasília','Porto Alegre'];
  const games   = ['Gates of Olympus','Aviator','Crazy Time','Fortune Tiger','Sweet Bonanza','Lightning Roulette','Mines','Plinko X','Book of Dead','Monopoly Big Baller','Bac Bo','Reactoonz'];

  function rndAmount() {
    const r = Math.random();
    if (r > .91) return { v: 'R$ ' + (Math.random() * 450 + 50).toFixed(0) + 'K',  cls: 'big'    };
    if (r > .74) return { v: 'R$ ' + (Math.random() * 45000 + 5000).toFixed(0),      cls: 'medium' };
    return             { v: 'R$ ' + (Math.random() * 4500 + 200).toFixed(0),          cls: 'small'  };
  }
  function rndMult() { return 'x' + (Math.random() * 1200 + 1.5).toFixed(1); }

  function addEntry() {
    const flag   = flags[Math.floor(Math.random() * flags.length)];
    const player = players[Math.floor(Math.random() * players.length)];
    const city   = flag === '🇧🇷' ? cities[Math.floor(Math.random() * cities.length)] : '';
    const game   = games[Math.floor(Math.random() * games.length)];
    const amt    = rndAmount();
    const mult   = rndMult();

    const item = document.createElement('div');
    item.className = 'live-feed-item';
    item.innerHTML = `
      <span class="feed-flag">${flag}</span>
      <div style="flex:1;min-width:0;">
        <div class="feed-player">${player}${city ? ' — ' + city : ''}</div>
        <div class="feed-game">${game}</div>
      </div>
      <div style="text-align:right;">
        <div class="feed-amount ${amt.cls}">${amt.v}</div>
        <div class="feed-mult">${mult}</div>
      </div>
    `;

    feed.insertBefore(item, feed.firstChild);
    const items = feed.querySelectorAll('.live-feed-item');
    if (items.length > 22) items[items.length - 1].remove();
  }

  /* Seed inicial */
  for (let i = 0; i < 12; i++) addEntry();

  /* Stream contínuo */
  (function schedule() {
    const d = 700 + Math.random() * 2000;
    setTimeout(() => { addEntry(); schedule(); }, d);
  })();

  /* Indicador de velocidade */
  const liveCount = document.getElementById('liveCount');
  if (liveCount) {
    setInterval(() => {
      liveCount.textContent = '↑ ' + (1 + Math.floor(Math.random() * 6)) + ' vitória(s)/seg';
    }, 1400);
  }
})();


/* ================================================================
   9. BIG WIN DO DIA — Rotação com valores em R$
================================================================ */
(function initBigWin() {
  const bigWins = [
    { game:'Gates of Olympus 1000', amount:'R$9,42M',  player:'🇧🇷 João S. — São Paulo • há 2h',   mult:'x15.200' },
    { game:'Aviator',               amount:'R$4,62M',  player:'🇧🇷 Lucas M. — BH • há 5h',         mult:'x488.0'  },
    { game:'Crazy Time 2',          amount:'R$3,19M',  player:'🇺🇸 J***n M. — Las Vegas • há 8h',  mult:'x2.500'  },
    { game:'Fortune Tiger',         amount:'R$4,75M',  player:'🇧🇷 Maria F. — Rio • há 12h',       mult:'x8.400'  },
  ];
  let idx = 0;

  function rotate() {
    const w = bigWins[idx % bigWins.length];
    ['bigWinGame','bigWinAmt','bigWinPlayer','bigWinMult'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = 'opacity .3s, transform .3s';
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(8px)';
    });
    setTimeout(() => {
      const gEl = document.getElementById('bigWinGame');
      const aEl = document.getElementById('bigWinAmt');
      const pEl = document.getElementById('bigWinPlayer');
      const mEl = document.getElementById('bigWinMult');
      if (!gEl) return;
      gEl.textContent = w.game;
      aEl.textContent = w.amount;
      pEl.textContent = w.player;
      mEl.textContent = w.mult;
      [gEl,aEl,pEl,mEl].forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    }, 320);
    idx++;
  }

  setInterval(rotate, 7000);
})();


/* ================================================================
   10. TICKER BAR — Vencedores com nomes e valores brasileiros
================================================================ */
(function initTicker() {
  const inner = document.getElementById('tickerInner');
  if (!inner) return;

  const items = [
    { flag:'🇧🇷', name:'João S.',      game:'Gates of Olympus', amount:'R$9,4M',  mult:'x15.200' },
    { flag:'🇧🇷', name:'Maria F.',     game:'Fortune Tiger',    amount:'R$4,7M',  mult:'x8.400'  },
    { flag:'🇧🇷', name:'Lucas M.',     game:'Aviator',          amount:'R$4,6M',  mult:'x488'    },
    { flag:'🇦🇪', name:'K***d A.',     game:'Lightning Roulette',amount:'R$4,4M', mult:'x500'    },
    { flag:'🇧🇷', name:'Gabriel O.',   game:'Sweet Bonanza',    amount:'R$2,4M',  mult:'x21.780' },
    { flag:'🇧🇷', name:'Ana Carolina', game:'Mines',            amount:'R$780K',  mult:'x52'     },
    { flag:'🇧🇷', name:'Pedro H.',     game:'Plinko X',         amount:'R$560K',  mult:'x99.0'   },
    { flag:'🇧🇷', name:'Fernanda L.',  game:'Big Bass Bonanza', amount:'R$490K',  mult:'x5.000'  },
    { flag:'🇺🇸', name:'J***n M.',     game:'Crazy Time',       amount:'R$3,1M',  mult:'x2.500'  },
    { flag:'🇧🇷', name:'Carlos E.',    game:'Bac Bo',           amount:'R$380K',  mult:'x30.0'   },
  ];

  /* Duplica para loop sem costura */
  [...items, ...items].forEach(item => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.innerHTML = `
      <span class="t-flag">${item.flag}</span>
      <strong style="color:#f5f5f5">${item.name}</strong>
      ganhou <span class="t-amount">${item.amount}</span>
      em ${item.game} (${item.mult})
      &nbsp;&nbsp;·&nbsp;&nbsp;
    `;
    inner.appendChild(span);
  });
})();


/* ================================================================
   11. TIMER DO TORNEIO — Regressiva em tempo real
================================================================ */
(function initTimer() {
  const target = new Date(Date.now() + (4 * 86400 + 17 * 3600 + 33 * 60 + 59) * 1000);
  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    const dEl = document.getElementById('tDays');
    const hEl = document.getElementById('tHours');
    const mEl = document.getElementById('tMins');
    const sEl = document.getElementById('tSecs');

    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) { const prev = sEl.textContent; sEl.textContent = pad(s); if (prev !== pad(s)) { sEl.style.transform='scale(1.18)'; setTimeout(()=>sEl.style.transform='scale(1)',200); } }
  }
  tick();
  setInterval(tick, 1000);
})();


/* ================================================================
   12. LEADERBOARD DO TORNEIO — Nomes brasileiros no topo
================================================================ */
(function initLeaderboard() {
  const lb = document.getElementById('leaderboard');
  if (!lb) return;

  const leaders = [
    { rank:1, flag:'🇧🇷', name:'João S. — São Paulo',    score:'284.920 pts', prize:'R$ 500.000' },
    { rank:2, flag:'🇧🇷', name:'Lucas M. — Belo Horizonte',score:'218.440 pts',prize:'R$ 300.000' },
    { rank:3, flag:'🇦🇪', name:'K***d A. — Dubai',        score:'194.230 pts', prize:'R$ 200.000' },
    { rank:4, flag:'🇧🇷', name:'Maria F. — Rio de Janeiro',score:'176.800 pts',prize:'R$ 100.000' },
    { rank:5, flag:'🇺🇸', name:'J***n M. — Las Vegas',    score:'154.100 pts', prize:'R$ 50.000'  },
  ];

  const rankCls = { 1:'top1', 2:'top2', 3:'top3' };

  leaders.forEach(l => {
    const row = document.createElement('div');
    row.className = 'lb-row';
    row.innerHTML = `
      <div class="lb-rank ${rankCls[l.rank]||''}">#${l.rank}</div>
      <div class="lb-player">${l.flag} ${l.name}</div>
      <div style="font-size:11px;color:rgba(245,245,245,.4);margin-right:8px;">${l.score}</div>
      <div class="lb-prize">${l.prize}</div>
    `;
    lb.appendChild(row);
  });

  /* Pontuações sobem ao vivo */
  setInterval(() => {
    lb.querySelectorAll('.lb-row').forEach((row, i) => {
      const scoreEl = row.querySelectorAll('div')[2];
      if (!scoreEl) return;
      const cur = parseInt(leaders[i].score.replace(/\D/g,'')) + Math.floor(Math.random()*900+100);
      leaders[i].score = cur.toLocaleString('pt-BR') + ' pts';
      scoreEl.textContent = leaders[i].score;
    });
  }, 2800);
})();


/* ================================================================
   13. SCROLL HEADER — Efeito ao rolar
================================================================ */
(function initScrollHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 90) header.classList.add('scrolled');
    else        header.classList.remove('scrolled');
    last = y;
  }, { passive: true });
})();


/* ================================================================
   14. SCROLL REVEAL — Animação de entrada suave
================================================================ */
(function initScrollReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity .75s cubic-bezier(.25,.46,.45,.94), transform .75s cubic-bezier(.25,.46,.45,.94);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.bonus-card, .winner-card, .live-card, .vip-tier-card, .section-header, .timer-block, .pix-banner'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 75);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -35px 0px' });

  targets.forEach(el => io.observe(el));
})();


/* ================================================================
   15. SMOOTH SCROLL — Âncoras com navegação suave
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ================================================================
   16. LUCIDE ICONS — Inicializa após DOM pronto
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});


/* ================================================================
   17. SHIMMER DINÂMICO — Reflexo ouro ao mover o mouse nos cards
================================================================ */
(function initShimmer() {
  setTimeout(() => {
    document.querySelectorAll('.bonus-card, .winner-card, .vip-tier-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left)  / r.width)  * 100;
        const y = ((e.clientY - r.top)   / r.height) * 100;
        card.style.setProperty('--shine-x', x + '%');
        card.style.setProperty('--shine-y', y + '%');
        card.style.backgroundImage = `
          radial-gradient(circle at ${x}% ${y}%, rgba(212,175,55,.1) 0%, rgba(212,175,55,.03) 40%, transparent 70%)
        `;
      });
      card.addEventListener('mouseleave', () => {
        card.style.backgroundImage = '';
      });
    });
  }, 1000);
})();


/* ================================================================
   18. BURST DE PARTÍCULAS — Clique em card de jogo
================================================================ */
(function initGameBurst() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (!card) return;
    const r   = card.getBoundingClientRect();
    const cx  = r.left + r.width  / 2;
    const cy  = r.top  + r.height / 2;
    const cls = ['#d4af37','#00d4ff','#c8102e','#ffffff','#f5d76e'];

    for (let i = 0; i < 18; i++) {
      const sp = document.createElement('div');
      sp.style.cssText = `
        position:fixed; width:7px; height:7px; border-radius:50%; z-index:9999;
        background:${cls[Math.floor(Math.random()*cls.length)]};
        left:${cx}px; top:${cy}px; pointer-events:none;
        transition: transform ${.35+Math.random()*.45}s ease-out, opacity .65s ease;
      `;
      document.body.appendChild(sp);
      const angle = Math.random() * Math.PI * 2;
      const dist  = 35 + Math.random() * 90;
      requestAnimationFrame(() => {
        sp.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`;
        sp.style.opacity   = '0';
      });
      setTimeout(() => sp.remove(), 900);
    }
  });
})();


/* ================================================================
   19. LAZY LOAD — Polyfill para navegadores sem suporte nativo
================================================================ */
(function initLazy() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach(img => io.observe(img));
})();


/* ================================================================
   Console signature
================================================================ */
console.log('%c💎 LucãoBet — World\'s Largest Casino Level', 'color:#d4af37;font-size:20px;font-weight:900;font-family:"Playfair Display",serif;');
console.log('%c🇧🇷 Versão 2.0.0 | 2026 | O Cassino que o Brasil Merecia', 'color:#00d4ff;font-size:12px;font-family:sans-serif;');
console.log('%c⚡ PIX em 5 minutos • Bônus 300% • R$ 25.000', 'color:#c8102e;font-size:11px;');
