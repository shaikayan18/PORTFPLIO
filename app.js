/* =========================================================
   Shaik Akhib K — Application Logic & Interactions
   iPhone-style Greeting Intro, Reticle Cursor, Constellations,
   3D Tag Cloud, and Smooth Physics
   ========================================================= */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Global shared state for rendering & scroll coordination
  window.state = {
    scrollY: 0,
    progress: 0,
    launchT: 0,    // 0 = intro active, 1 = in orbit
    clutter: 1,
    mouseX: 0,
    mouseY: 0
  };

  const root = document.documentElement;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const range = (v, from, to) => clamp01((v - from) / (to - from));

  /* ---------------------------------------------------------
     1. iPhone-Style Animated Greeting Intro
     --------------------------------------------------------- */
  const greetingIntro = document.getElementById('greeting-intro');
  const greetingText  = document.getElementById('greeting-text');
  const greetingSub   = document.getElementById('greeting-sub');
  const greetingProg  = document.getElementById('greeting-progress');
  const greetingStatus= document.getElementById('greeting-status');
  const greetingSkip  = document.getElementById('greeting-skip');
  const greetingDots  = document.querySelectorAll('.greeting-dot');

  const GREETINGS = [
    { text: "Hello", sub: "English · Initializing Orbital Systems", status: "SYSTEMS INITIALIZING" },
    { text: "Hi", sub: "Universal · Calibrating Sensors & Telemetry", status: "TELEMETRY SYNCHRONIZED" },
    { text: "Namaste", sub: "नमस्ते · Welcome to my space", status: "ATMOSPHERIC INGESTION" },
    { text: "Assalamualaikum", sub: "السلام عليكم · Peace Be Upon You", status: "TRAJECTORY LOCKED" },
    { text: "Welcome to my portfolio", sub: "Shaik Akhib K · Entering Orbit", status: "ORBITAL INSERTION COMPLETE" }
  ];

  let currentGreetingIndex = 0;
  let introCompleted = false;
  let introTimer = null;

  function setGreeting(idx) {
    if (idx >= GREETINGS.length) {
      completeIntro();
      return;
    }

    currentGreetingIndex = idx;
    const g = GREETINGS[idx];

    // Transition out
    greetingText.classList.remove('active');
    greetingText.classList.add('exit');
    greetingSub.classList.remove('active');
    greetingSub.classList.add('exit');

    setTimeout(() => {
      greetingText.textContent = g.text;
      greetingSub.textContent = g.sub;
      if (greetingStatus) greetingStatus.textContent = g.status;

      greetingText.classList.remove('exit');
      greetingSub.classList.remove('exit');
      greetingText.classList.add('active');
      greetingSub.classList.add('active');

      // Update dots
      greetingDots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === idx);
      });

      // Update progress bar
      const pct = Math.round(((idx + 1) / GREETINGS.length) * 100);
      if (greetingProg) greetingProg.style.width = pct + '%';

      // Schedule next greeting
      const holdTime = idx === GREETINGS.length - 1 ? 1100 : 850;
      introTimer = setTimeout(() => {
        setGreeting(idx + 1);
      }, holdTime);
    }, 280);
  }

  function completeIntro() {
    if (introCompleted) return;
    introCompleted = true;
    clearTimeout(introTimer);

    if (greetingProg) greetingProg.style.width = '100%';
    window.state.launchT = 1;

    greetingIntro.classList.add('done');
    document.body.classList.remove('loading');

    // Trigger hero name letter illumination
    const heroName = document.getElementById('hero-name');
    if (heroName) {
      setTimeout(() => {
        heroName.classList.add('lit');
      }, 350);
    }

    setTimeout(() => {
      greetingIntro.style.display = 'none';
    }, 1200);
  }

  if (greetingSkip) {
    greetingSkip.addEventListener('click', completeIntro);
  }

  // Start greeting sequence
  greetingText.classList.add('active');
  greetingSub.classList.add('active');
  greetingDots[0].classList.add('active');
  if (greetingProg) greetingProg.style.width = '20%';

  introTimer = setTimeout(() => {
    setGreeting(1);
  }, 900);

  // Safety fallback: never trap visitors if an error occurs
  setTimeout(() => {
    if (!introCompleted) completeIntro();
  }, 8000);

  /* ---------------------------------------------------------
     2. Inertia Scrolling & Navigation Links
     --------------------------------------------------------- */
  const smooth = {
    enabled: finePointer && !reduceMotion,
    target: 0,
    current: 0,
    ease: 0.09,
    lastSet: -1,
    running: false
  };

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function smoothTick() {
    const diff = smooth.target - smooth.current;
    if (Math.abs(diff) < 0.35) {
      smooth.current = smooth.target;
      smooth.running = false;
    } else {
      smooth.current += diff * smooth.ease;
    }
    smooth.lastSet = Math.round(smooth.current);
    window.scrollTo(0, smooth.current);
    if (smooth.running) requestAnimationFrame(smoothTick);
  }

  function startSmooth() {
    if (!smooth.running) {
      smooth.running = true;
      requestAnimationFrame(smoothTick);
    }
  }

  if (smooth.enabled) {
    smooth.target = smooth.current = window.scrollY;
    window.addEventListener(
      'wheel',
      e => {
        if (e.ctrlKey) return;
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? window.innerHeight : 1;
        smooth.target = Math.min(maxScroll(), Math.max(0, smooth.target + e.deltaY * unit));
        startSmooth();
      },
      { passive: false }
    );

    window.addEventListener(
      'scroll',
      () => {
        if (Math.abs(window.scrollY - smooth.lastSet) > 2) {
          smooth.target = smooth.current = window.scrollY;
        }
      },
      { passive: true }
    );
  }

  function scrollToY(y) {
    const dest = Math.min(maxScroll(), Math.max(0, y));
    if (smooth.enabled) {
      smooth.target = dest;
      startSmooth();
    } else {
      window.scrollTo({ top: dest, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      const el = document.querySelector(targetId);
      if (!el) return;
      e.preventDefault();
      scrollToY(el.getBoundingClientRect().top + window.scrollY - 10);
    });
  });

  /* ---------------------------------------------------------
     3. Custom Targeting Reticle Cursor
     --------------------------------------------------------- */
  if (finePointer) {
    const dot = document.getElementById('cursor-dot');
    const ret = document.getElementById('reticle');

    const R = { x: 0, y: 0, w: 26, h: 26 };
    const T = { x: 0, y: 0, w: 26, h: 26 };
    let locked = null;

    window.addEventListener('pointermove', e => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      document.body.classList.add('cursor-on');
      if (!locked) {
        T.x = e.clientX;
        T.y = e.clientY;
        T.w = 26;
        T.h = 26;
      }
    });

    document.addEventListener('pointerover', e => {
      const hit = e.target.closest('a, button, .planet-card, .dsn-row, .star-hit, .skills-filter');
      if (!hit) return;
      locked = hit;
      ret.classList.add('locked');
    });

    document.addEventListener('pointerout', e => {
      if (locked && !e.relatedTarget?.closest?.('a, button, .planet-card, .dsn-row, .star-hit, .skills-filter')) {
        locked = null;
        ret.classList.remove('locked');
      }
    });

    document.addEventListener('pointerleave', () => {
      document.body.classList.remove('cursor-on');
    });

    (function reticleTick() {
      if (locked) {
        const b = locked.getBoundingClientRect();
        T.x = b.left + b.width / 2;
        T.y = b.top + b.height / 2;
        T.w = b.width + 16;
        T.h = b.height + 16;
      }
      R.x = lerp(R.x, T.x, 0.34);
      R.y = lerp(R.y, T.y, 0.34);
      R.w = lerp(R.w, T.w, 0.28);
      R.h = lerp(R.h, T.h, 0.28);

      ret.style.width = R.w + 'px';
      ret.style.height = R.h + 'px';
      ret.style.transform = `translate(${R.x - R.w / 2}px, ${R.y - R.h / 2}px)`;
      requestAnimationFrame(reticleTick);
    })();
  }

  window.addEventListener(
    'pointermove',
    e => {
      window.state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      window.state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  /* ---------------------------------------------------------
     4. Hero Name Letter-by-Letter Assembly
     --------------------------------------------------------- */
  const heroName = document.getElementById('hero-name');
  if (heroName) {
    const text = heroName.dataset.text || 'Shaik Akhib K';
    text.split('').forEach((c, i) => {
      const span = document.createElement('span');
      span.className = c === ' ' ? 'sp' : 'ch';
      span.textContent = c === ' ' ? ' ' : c;
      span.style.transitionDelay = (i * 0.045).toFixed(3) + 's';
      heroName.appendChild(span);
    });
  }

  /* ---------------------------------------------------------
     5. Orbiting Satellite Around Hero Name
     --------------------------------------------------------- */
  const nameSat = document.getElementById('name-sat');
  const nameWrap = document.getElementById('hero-name-wrap');

  function renderNameSat(t) {
    if (!nameSat || !nameWrap) return;
    const rect = nameWrap.getBoundingClientRect();
    const rx = (rect.width / 2) + 40;
    const ry = (rect.height / 2) + 26;

    // Elliptical orbit with 12 degree axial tilt
    const angle = t * 0.85;
    const rawX = Math.cos(angle) * rx;
    const rawY = Math.sin(angle) * ry;

    const tilt = 0.22;
    const x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
    const y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

    // Front/behind z-layering
    const inFront = Math.sin(angle) > 0;
    const depthScale = inFront ? 1.05 : 0.85;

    nameSat.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) scale(${depthScale})`;
    nameSat.style.zIndex = inFront ? '10' : '0';
    nameSat.style.opacity = inFront ? '1' : '0.65';
  }

  /* ---------------------------------------------------------
     6. Section Reveals
     --------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  function sweepReveals() {
    const vh = window.innerHeight;
    reveals.forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.top < vh * 0.88 && b.bottom > 0) {
        el.classList.add('show');
      }
    });
  }

  /* ---------------------------------------------------------
     7. Experience: Five Real Star Constellations
     --------------------------------------------------------- */
  const JOBS = [
    { org: 'Think For Education',          role: 'SEO Intern',                               when: 'June 2026 – Present' },
    { org: 'Face Prep',                    role: 'Full Stack Developer Intern',              when: '2025' },
    { org: 'Mobifixx Digital Solutions',   role: 'Platform Developer & Web Engineer',          when: '2024 – 2025' },
    { org: 'NCEAMBT 2025 Conference',      role: 'Research Presenter (ArcFace Model)',       when: '2025' },
    { org: 'Tumkur University / Zerone',   role: 'Football Vice-Captain & Event Lead',       when: '2023 – 2024' }
  ];

  const FORMATIONS = [
    {
      name: 'Orion', art: 'assets/constellations/orion.png',
      stars: [
        [0.100, 0.100], [0.685, 0.149], [0.549, 0.461], [0.471, 0.503],
        [0.374, 0.538], [0.237, 0.900], [0.900, 0.831]
      ],
      lines: [[0,1],[0,4],[1,2],[2,3],[3,4],[4,5],[2,6]],
      jobs: [0, 1, 3, 5, 6]
    },
    {
      name: 'Cassiopeia', art: 'assets/constellations/cassiopeia.png',
      stars: [
        [0.100, 0.100], [0.314, 0.486], [0.534, 0.430], [0.664, 0.900], [0.900, 0.606]
      ],
      lines: [[0,1],[1,2],[2,3],[3,4]],
      jobs: [0, 1, 2, 3, 4]
    },
    {
      name: 'Ursa Major', art: 'assets/constellations/ursamajor.png',
      stars: [
        [0.889, 0.100], [0.899, 0.446], [0.647, 0.618], [0.545, 0.403],
        [0.356, 0.472], [0.210, 0.538], [0.100, 0.900]
      ],
      lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]],
      jobs: [0, 2, 3, 5, 6]
    },
    {
      name: 'Perseus', art: 'assets/constellations/perseus.png',
      stars: [
        [0.900, 0.100], [0.609, 0.315], [0.328, 0.439], [0.852, 0.844], [0.100, 0.900]
      ],
      lines: [[0,1],[1,2],[2,4],[1,3]],
      jobs: [0, 1, 2, 3, 4]
    },
    {
      name: 'Leo', art: 'assets/constellations/leo.png',
      stars: [
        [0.900, 0.100], [0.679, 0.367], [0.755, 0.900], [0.327, 0.320], [0.100, 0.724]
      ],
      lines: [[0,1],[1,2],[1,3],[3,4],[4,2]],
      jobs: [0, 1, 2, 3, 4]
    }
  ];

  const constStage  = document.getElementById('const-stage');
  const constLines  = document.getElementById('const-lines');
  const constTies   = document.getElementById('const-ties');
  const constMinor  = document.getElementById('const-minor');
  const constFig    = document.getElementById('const-fig');
  const constNameEl = document.getElementById('const-name');
  const constSubEl  = document.getElementById('const-sub');
  const constDots   = document.getElementById('const-dots');
  const SVGNS       = 'http://www.w3.org/2000/svg';

  let formIndex = 0;
  const stars = [];
  const pos = JOBS.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
  let minorPos = [];

  if (constStage) {
    // Build DOM stars for jobs
    JOBS.forEach((job, i) => {
      const star = document.createElement('div');
      star.className = 'star';
      star.innerHTML = `
        <button class="star-hit" aria-label="${job.org}"></button>
        <span class="star-dot"></span>
        <span class="star-label">
          <span class="star-org">${job.org}</span>
          <span class="star-role">${job.role}</span>
          <span class="star-when">${job.when}</span>
        </span>
      `;
      const hit = star.querySelector('.star-hit');
      const on = () => stars.forEach((s, n) => s.classList.toggle('on', n === i));
      hit.addEventListener('pointerenter', on);
      hit.addEventListener('focus', on);
      constStage.appendChild(star);
      stars.push(star);
    });

    // Formation navigation dots
    FORMATIONS.forEach((f, i) => {
      const d = document.createElement('button');
      d.setAttribute('aria-label', f.name);
      d.addEventListener('click', () => setFormation(i));
      constDots.appendChild(d);
    });

    document.getElementById('const-prev')?.addEventListener('click', () => {
      setFormation((formIndex - 1 + FORMATIONS.length) % FORMATIONS.length);
    });
    document.getElementById('const-next')?.addEventListener('click', () => {
      setFormation((formIndex + 1) % FORMATIONS.length);
    });

    // Touch swipe support
    let touchStartX = 0;
    constStage.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    constStage.addEventListener('touchend', e => {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) setFormation((formIndex - 1 + FORMATIONS.length) % FORMATIONS.length);
        else setFormation((formIndex + 1) % FORMATIONS.length);
      }
    }, { passive: true });
  }

  function constBox() {
    if (!constStage) return { x: 0, y: 0, w: 0, h: 0 };
    const w = constStage.clientWidth, h = constStage.clientHeight;
    const pad = 40;
    const availW = w - pad * 2, availH = h - pad * 2;
    const aspect = 4 / 3;
    let bw, bh;
    if (availW / availH > aspect) {
      bh = availH;
      bw = bh * aspect;
    } else {
      bw = availW;
      bh = bw / aspect;
    }
    return { x: (w - bw) / 2, y: (h - bh) / 2, w: bw, h: bh };
  }

  function setFormation(idx) {
    if (!constStage) return;
    formIndex = idx;
    const f = FORMATIONS[idx];
    const box = constBox();

    if (constNameEl) constNameEl.textContent = f.name;
    if (constSubEl)  constSubEl.textContent  = `${idx + 1} of ${FORMATIONS.length}`;

    // Update active dot
    constDots.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });

    // Fade and update figure artwork
    if (constFig) {
      constFig.style.opacity = '0';
      setTimeout(() => {
        constFig.style.backgroundImage = `url("${f.art}")`;
        constFig.style.opacity = '0.22';
      }, 250);
    }

    // Set job star targets
    f.jobs.forEach((starIndex, jobIdx) => {
      if (jobIdx < pos.length && starIndex < f.stars.length) {
        const s = f.stars[starIndex];
        pos[jobIdx].tx = box.x + s[0] * box.w;
        pos[jobIdx].ty = box.y + s[1] * box.h;
      }
    });

    // Companion stars
    minorPos = [];
    if (constMinor) constMinor.innerHTML = '';
    f.stars.forEach((s, sIdx) => {
      if (!f.jobs.includes(sIdx)) {
        const mx = box.x + s[0] * box.w;
        const my = box.y + s[1] * box.h;
        minorPos.push({ x: mx, y: my });

        const circle = document.createElementNS(SVGNS, 'circle');
        circle.setAttribute('cx', mx);
        circle.setAttribute('cy', my);
        circle.setAttribute('r', '2.5');
        circle.setAttribute('class', 'const-minor-star');
        constMinor.appendChild(circle);
      }
    });

    // Build lines
    if (constLines) constLines.innerHTML = '';
    f.lines.forEach(([a, b]) => {
      const line = document.createElementNS(SVGNS, 'line');
      line.dataset.a = a;
      line.dataset.b = b;
      constLines.appendChild(line);
    });
  }

  function starXY(f, sIdx, box) {
    const jobIdx = f.jobs.indexOf(sIdx);
    if (jobIdx !== -1) return { x: pos[jobIdx].x, y: pos[jobIdx].y };
    const s = f.stars[sIdx];
    return { x: box.x + s[0] * box.w, y: box.y + s[1] * box.h };
  }

  function renderConstellation() {
    if (!constStage) return;
    const f = FORMATIONS[formIndex];
    const box = constBox();

    // Lerp job star positions
    pos.forEach((p, i) => {
      p.x = lerp(p.x, p.tx, 0.12);
      p.y = lerp(p.y, p.ty, 0.12);
      if (stars[i]) {
        stars[i].style.left = p.x + 'px';
        stars[i].style.top  = p.y + 'px';
      }
    });

    // Update lines
    if (constLines) {
      constLines.querySelectorAll('line').forEach(line => {
        const a = parseInt(line.dataset.a, 10);
        const b = parseInt(line.dataset.b, 10);
        const pa = starXY(f, a, box);
        const pb = starXY(f, b, box);
        line.setAttribute('x1', pa.x);
        line.setAttribute('y1', pa.y);
        line.setAttribute('x2', pb.x);
        line.setAttribute('y2', pb.y);
      });
    }
  }

  /* ---------------------------------------------------------
     8. Skills: 3D Rotating Fibonacci Sphere Tag Cloud
     --------------------------------------------------------- */
  const cloudStage  = document.getElementById('cloud-stage');
  const cloudSphere = document.getElementById('cloud-sphere');
  const skillTags   = document.querySelectorAll('.cloud-tag');

  const cloud = {
    points: [],
    angleX: 0,
    angleY: 0,
    velX: 0.0016,
    velY: 0.0028,
    rx: 180,
    ry: 160,
    dragging: false,
    lastX: 0,
    lastY: 0
  };

  function buildCloud() {
    if (!cloudStage || skillTags.length === 0) return;
    const N = skillTags.length;
    cloud.points = [];

    // Golden ratio Fibonacci sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    skillTags.forEach((el, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      cloud.points.push({ el, x, y, z });
    });

    sizeCloud();
  }

  function sizeCloud() {
    if (!cloudStage) return;
    const w = cloudStage.clientWidth, h = cloudStage.clientHeight;
    const rad = Math.min(w * 0.38, h * 0.42, 220);
    cloud.rx = rad * 1.15;
    cloud.ry = rad;
  }

  let cloudOnScreen = false;
  if (cloudStage) {
    new IntersectionObserver(([e]) => {
      cloudOnScreen = e.isIntersecting;
    }, { rootMargin: '15% 0px' }).observe(cloudStage);

    // Pointer Drag
    cloudStage.addEventListener('pointerdown', e => {
      cloud.dragging = true;
      cloud.lastX = e.clientX;
      cloud.lastY = e.clientY;
      cloudStage.setPointerCapture(e.pointerId);
    });

    cloudStage.addEventListener('pointermove', e => {
      if (!cloud.dragging) return;
      const dx = e.clientX - cloud.lastX;
      const dy = e.clientY - cloud.lastY;
      cloud.lastX = e.clientX;
      cloud.lastY = e.clientY;

      cloud.angleY += dx * 0.005;
      cloud.angleX -= dy * 0.005;
      cloud.velY = dx * 0.0018;
      cloud.velX = -dy * 0.0018;
    });

    const stopDrag = () => { cloud.dragging = false; };
    cloudStage.addEventListener('pointerup', stopDrag);
    cloudStage.addEventListener('pointercancel', stopDrag);
    cloudStage.addEventListener('pointerleave', stopDrag);
  }

  function renderCloud() {
    if (!cloudOnScreen || !cloudStage) return;
    const w = cloudStage.clientWidth, h = cloudStage.clientHeight;
    const cx = w / 2, cy = h / 2;
    const fov = cloud.rx * 1.85;

    if (!cloud.dragging) {
      cloud.angleY += cloud.velY;
      cloud.angleX += cloud.velX;
      cloud.velY = lerp(cloud.velY, 0.0024, 0.02);
      cloud.velX = lerp(cloud.velX, 0.0010, 0.02);
    }

    const cosY = Math.cos(cloud.angleY), sinY = Math.sin(cloud.angleY);
    const cosX = Math.cos(cloud.angleX), sinX = Math.sin(cloud.angleX);

    for (const p of cloud.points) {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const X = x1 * cloud.rx, Y = y2 * cloud.ry, Z = z2 * cloud.rx;
      const scale = fov / (fov + Z);

      p.el.style.left = (cx + X * scale) + 'px';
      p.el.style.top  = (cy + Y * scale) + 'px';
      p.el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      p.el.style.zIndex = Math.round(scale * 200);

      if (!p.el.classList.contains('dim')) {
        const depth = clamp01((scale - 0.5) / 0.85);
        p.el.style.opacity = (0.15 + 0.85 * depth * depth).toFixed(3);
      }
    }
  }

  // Category filters
  document.querySelectorAll('.skills-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.skills-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      skillTags.forEach(tag => {
        const matches = cat === 'all' || tag.dataset.cat === cat;
        tag.classList.toggle('dim', !matches);
        tag.classList.toggle('match', matches && cat !== 'all');
      });
    });
  });

  /* ---------------------------------------------------------
     9. Main Scroll & Animation Loop
     --------------------------------------------------------- */
  const heroPin = document.getElementById('hero-pin');
  const skillsSection = document.getElementById('skills');

  function tick() {
    window.state.scrollY = window.scrollY;
    const max = maxScroll();
    window.state.progress = max > 0 ? clamp01(window.state.scrollY / max) : 0;
    root.style.setProperty('--p', window.state.progress.toFixed(4));

    if (heroPin) {
      const hp = heroPin.getBoundingClientRect();
      root.style.setProperty(
        '--hero-out',
        clamp01(-hp.top / (hp.height - window.innerHeight || 1)).toFixed(4)
      );
    }

    if (skillsSection) {
      const skillsTop = skillsSection.getBoundingClientRect().top + window.state.scrollY;
      window.state.clutter = 1 - range(
        window.state.scrollY,
        skillsTop - window.innerHeight * 1.4,
        skillsTop - window.innerHeight * 0.35
      );
    }

    renderNameSat(performance.now() * 0.00045);
    renderConstellation();
    sweepReveals();
    renderCloud();

    if (window.__skyUpdate) {
      window.__skyUpdate(window.state);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener(
    'resize',
    () => {
      sizeCloud();
      setFormation(formIndex);
    },
    { passive: true }
  );

  // Initialize components on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    buildCloud();
    setFormation(0);
    tick();
  });

  // Preload constellation artwork images
  FORMATIONS.forEach(f => {
    const img = new Image();
    img.src = f.art;
  });

})();

/* =========================================================
   Cosmic Timeline — Rail Fill & Planet Glow Animations
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Animates the timeline rail fill based on scroll position
   * within the given container.
   * @param {string} timelineId  – ID of .cosmic-timeline element
   * @param {string} railFillId  – ID of .ctl-rail-fill element
   */
  function initTimelineRail(timelineId, railFillId) {
    const timeline = document.getElementById(timelineId);
    const railFill = document.getElementById(railFillId);
    if (!timeline || !railFill) return;

    function updateRail() {
      const rect = timeline.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Scroll fraction: 0 when top of timeline enters viewport, 1 when bottom exits
      const start = rect.top - viewH * 0.88;
      const end   = rect.bottom - viewH * 0.12;
      const total = end - start;
      const progress = total > 0 ? Math.min(1, Math.max(0, -start / total)) : 0;
      railFill.style.height = (progress * 100).toFixed(2) + '%';
    }

    if (reduceMotion) {
      railFill.style.height = '100%';
    } else {
      window.addEventListener('scroll', updateRail, { passive: true });
      updateRail();
    }
  }

  /**
   * Uses IntersectionObserver to trigger planet glow when
   * a ctl-entry enters the viewport.
   */
  function initEntryObserver() {
    if (!window.IntersectionObserver) return;

    const entries = document.querySelectorAll('[data-ctlentry]');
    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((rec) => {
          if (rec.isIntersecting) {
            rec.target.classList.add('show');
            // Only fire once per entry
            observer.unobserve(rec.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    );

    entries.forEach((el) => observer.observe(el));
  }

  /**
   * Animates the spiral spline path and milestone cards
   * based on scroll position through the #spiral-timeline section.
   */
  function initSpiralTimeline() {
    const spiral = document.getElementById('spiral-timeline');
    const path = document.getElementById('spiral-active-path');
    const head = document.getElementById('spiral-head-group');
    const cards = [
      document.getElementById('spiral-mca'),
      document.getElementById('spiral-bca'),
      document.getElementById('spiral-pu')
    ].filter(Boolean);

    if (!spiral || !path) return;

    let totalLength = 0;
    try {
      totalLength = path.getTotalLength();
    } catch (e) {
      totalLength = 1600;
    }

    path.style.strokeDasharray = totalLength;
    path.style.strokeDashoffset = totalLength;

    function updateSpiral() {
      const rect = spiral.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Fraction of scroll through section: starts when top is at 75% of viewport
      const start = rect.top - viewH * 0.75;
      const end = rect.bottom - viewH * 0.25;
      const total = end - start;
      const progress = total > 0 ? Math.min(1, Math.max(0, -start / total)) : 0;

      if (reduceMotion || window.innerWidth <= 990) {
        if (path) path.style.strokeDashoffset = 0;
        cards.forEach(c => {
          c.classList.add('show');
          c.classList.remove('hide');
        });
        return;
      }

      // Update glowing path stroke
      const currentLength = totalLength * progress;
      path.style.strokeDashoffset = totalLength - currentLength;

      // Update traveling light beam head
      if (head && totalLength > 0) {
        try {
          const pt = path.getPointAtLength(Math.max(1, Math.min(totalLength - 1, currentLength)));
          head.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
          head.style.opacity = progress > 0.02 ? '1' : '0';
        } catch (e) {}
      }

      // Forward reveal: appear as line reaches each milestone
      // Reverse hide: disappear one-by-one when scrolling back up

      // MCA (cards[0])
      if (cards[0]) {
        if (progress >= 0.06) {
          cards[0].classList.add('show');
          cards[0].classList.remove('hide');
        } else {
          cards[0].classList.remove('show');
          cards[0].classList.add('hide');
        }
      }
      // BCA (cards[1])
      if (cards[1]) {
        if (progress >= 0.38) {
          cards[1].classList.add('show');
          cards[1].classList.remove('hide');
        } else {
          cards[1].classList.remove('show');
          cards[1].classList.add('hide');
        }
      }
      // PU (cards[2])
      if (cards[2]) {
        if (progress >= 0.72) {
          cards[2].classList.add('show');
          cards[2].classList.remove('hide');
        } else {
          cards[2].classList.remove('show');
          cards[2].classList.add('hide');
        }
      }
    }

    window.addEventListener('scroll', updateSpiral, { passive: true });
    window.addEventListener('resize', updateSpiral, { passive: true });
    updateSpiral();
  }

  function initMobileNav() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav-overlay');
    if (!hamburger || !mobileNav) return;

    const links = mobileNav.querySelectorAll('a');

    function setOpen(open) {
      hamburger.classList.toggle('open', open);
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => {
      setOpen(!mobileNav.classList.contains('open'));
    });

    links.forEach(a => {
      a.addEventListener('click', () => {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setOpen(false);
      }
    });
  }

  function handleResize() {
    if (typeof sizeCloud === 'function') sizeCloud();
    if (typeof setFormation === 'function') setFormation(formIndex);
  }

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(handleResize, 150), { passive: true });

  function init() {
    initTimelineRail('exp-timeline', 'exp-rail-fill');
    initSpiralTimeline();
    initEntryObserver();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
