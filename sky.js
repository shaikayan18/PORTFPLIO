(function () {
  'use strict';

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('Three.js not found, falling back to CSS background');
    document.body.classList.add('no-webgl');
    return;
  }

  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    document.body.classList.add('no-webgl');
    console.warn('WebGL initialization failed, using CSS fallback', err);
    return;
  }

  const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  /* ---------------------------------------------------------
     1. Background Scene (Sky Gradient + Horizon Contour)
     --------------------------------------------------------- */
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const skyUniforms = {
    uTop: { value: new THREE.Color('#000000') },
    uBot: { value: new THREE.Color('#000000') },
    uGround: { value: 0.0 }
  };

  bgScene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        depthTest: false,
        depthWrite: false,
        vertexShader: `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
        `,
        fragmentShader: `
          uniform vec3 uTop; uniform vec3 uBot; uniform float uGround;
          varying vec2 vUv;
          float ridge(float x) {
            return 0.045 + 0.024 * sin(x * 6.0 + 0.5)
                 + 0.015 * sin(x * 13.0 + 2.0) + 0.008 * sin(x * 27.0 + 4.0);
          }
          void main() {
            vec3 col = mix(uBot, uTop, pow(vUv.y, 0.85));
            float d = distance(vUv, vec2(0.5, -0.02));
            col += uGround * vec3(0.28, 0.42, 0.82) * smoothstep(0.7, 0.0, d) * 0.28;
            float h = ridge(vUv.x) * uGround;
            float g = smoothstep(h, h - 0.004, vUv.y);
            col = mix(col, vec3(0.006, 0.010, 0.022), g * uGround);
            float n = fract(sin(dot(vUv * 900.0, vec2(12.9898, 78.233))) * 43758.5453);
            gl_FragColor = vec4(col + (n - 0.5) * 0.002, 1.0);
          }
        `
      })
    )
  );

  /* ---------------------------------------------------------
     2. Main Deep Space Scene
     --------------------------------------------------------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 12000);

  scene.add(new THREE.AmbientLight(0x8fb4ff, 0.85));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(-1, 0.9, 0.8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x8fcaff, 1.2);
  rimLight.position.set(1, -0.3, -0.6);
  scene.add(rimLight);

  function discTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0.0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const disc = discTexture();

  /* --- Multi-Layer Cinematic Starfield (9,200+ Stars Across Depth Planes) --- */
  const FIELD_DEPTH = 4200;

  // Star palettes: crisp white, ice cyan, deep sapphire, warm solar gold, lilac
  const starPalettes = [
    [1.00, 1.00, 1.00],  // Brilliant White
    [0.72, 0.88, 1.00],  // Ice Blue
    [0.45, 0.78, 1.00],  // Electric Cyan
    [1.00, 0.92, 0.75],  // Warm Solar Gold
    [0.86, 0.75, 1.00],  // Lilac Violet
    [0.35, 0.58, 0.98]   // Deep Azure
  ];

  // Layer 1: Distant Deep Galaxy Starfield (scaled for mobile performance)
  const DEEP_COUNT = isMobile ? 8500 : 22000;
  const deepGeo = new THREE.BufferGeometry();
  const deepPos = new Float32Array(DEEP_COUNT * 3);
  const deepColors = new Float32Array(DEEP_COUNT * 3);
  const deepSizes = new Float32Array(DEEP_COUNT);

  for (let i = 0; i < DEEP_COUNT; i++) {
    deepPos[i * 3 + 0] = (Math.random() - 0.5) * 9000;
    deepPos[i * 3 + 1] = (Math.random() - 0.5) * 7000;
    deepPos[i * 3 + 2] = -400 - Math.random() * (FIELD_DEPTH * 2.0);
    deepSizes[i] = 1.2 + Math.random() * 2.2;

    const col = starPalettes[(Math.random() * starPalettes.length) | 0];
    const b = 0.65 + Math.random() * 0.45;
    deepColors[i * 3 + 0] = col[0] * b;
    deepColors[i * 3 + 1] = col[1] * b;
    deepColors[i * 3 + 2] = col[2] * b;
  }
  deepGeo.setAttribute('position', new THREE.BufferAttribute(deepPos, 3));
  deepGeo.setAttribute('color', new THREE.BufferAttribute(deepColors, 3));
  deepGeo.setAttribute('size', new THREE.BufferAttribute(deepSizes, 1));

  const deepMat = new THREE.PointsMaterial({
    size: 2.6,
    map: disc,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const deepStars = new THREE.Points(deepGeo, deepMat);
  scene.add(deepStars);

  // Layer 2: Mid-Range Stellar Cluster (scaled for mobile performance)
  const MID_COUNT = isMobile ? 5500 : 14000;
  const midGeo = new THREE.BufferGeometry();
  const midPos = new Float32Array(MID_COUNT * 3);
  const midColors = new Float32Array(MID_COUNT * 3);
  const midSizes = new Float32Array(MID_COUNT);

  for (let i = 0; i < MID_COUNT; i++) {
    midPos[i * 3 + 0] = (Math.random() - 0.5) * 7500;
    midPos[i * 3 + 1] = (Math.random() - 0.5) * 5800;
    midPos[i * 3 + 2] = -150 - Math.random() * FIELD_DEPTH;
    midSizes[i] = 3.0 + Math.random() * 4.6;

    const col = starPalettes[(Math.random() * starPalettes.length) | 0];
    const b = 0.85 + Math.random() * 0.55;
    midColors[i * 3 + 0] = col[0] * b;
    midColors[i * 3 + 1] = col[1] * b;
    midColors[i * 3 + 2] = col[2] * b;
  }
  midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
  midGeo.setAttribute('color', new THREE.BufferAttribute(midColors, 3));
  midGeo.setAttribute('size', new THREE.BufferAttribute(midSizes, 1));

  const midMat = new THREE.PointsMaterial({
    size: 4.8,
    map: disc,
    vertexColors: true,
    transparent: true,
    opacity: 0.96,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const midStars = new THREE.Points(midGeo, midMat);
  scene.add(midStars);

  // Layer 3: Foreground Radiant Stars (scaled for mobile performance)
  const NEAR_COUNT = isMobile ? 1800 : 4000;
  const nearGeo = new THREE.BufferGeometry();
  const nearPos = new Float32Array(NEAR_COUNT * 3);
  const nearColors = new Float32Array(NEAR_COUNT * 3);
  const nearSizes = new Float32Array(NEAR_COUNT);

  for (let i = 0; i < NEAR_COUNT; i++) {
    nearPos[i * 3 + 0] = (Math.random() - 0.5) * 5500;
    nearPos[i * 3 + 1] = (Math.random() - 0.5) * 4200;
    nearPos[i * 3 + 2] = 300 - Math.random() * (FIELD_DEPTH * 0.85);
    nearSizes[i] = 5.0 + Math.random() * 8.0;

    const col = starPalettes[(Math.random() * starPalettes.length) | 0];
    const b = 1.15 + Math.random() * 0.65;
    nearColors[i * 3 + 0] = Math.min(1, col[0] * b);
    nearColors[i * 3 + 1] = Math.min(1, col[1] * b);
    nearColors[i * 3 + 2] = Math.min(1, col[2] * b);
  }
  nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3));
  nearGeo.setAttribute('color', new THREE.BufferAttribute(nearColors, 3));
  nearGeo.setAttribute('size', new THREE.BufferAttribute(nearSizes, 1));

  const nearMat = new THREE.PointsMaterial({
    size: 8.0,
    map: disc,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const nearStars = new THREE.Points(nearGeo, nearMat);
  scene.add(nearStars);

  /* --- Floating Cosmic Stardust Particles --- */
  const DUST_COUNT = isMobile ? 1500 : 4000;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i * 3 + 0] = (Math.random() - 0.5) * 5000;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 4000;
    dustPos[i * 3 + 2] = 200 - Math.random() * 3500;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 2.4,
    color: 0x8fcaff,
    transparent: true,
    opacity: 0.60,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* --- Glowing Deep Space Nebulae --- */
  const nebulaGroup = new THREE.Group();
  const nebulaMats = [];
  ['#3b86ff', '#7c5cff', '#2f6fe0', '#ff9ec7', '#5aa6ff'].forEach((hex, i) => {
    const mat = new THREE.SpriteMaterial({
      map: disc,
      color: new THREE.Color(hex),
      transparent: true,
      opacity: 0.07 + i * 0.012,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(mat);
    const s = 800 + Math.random() * 1100;
    sprite.scale.set(s, s, 1);
    sprite.position.set((Math.random() - 0.5) * 1600, (Math.random() - 0.5) * 1000, -700 - i * 400);
    sprite.userData.drift = 0.15 + Math.random() * 0.35;
    nebulaMats.push(mat);
    nebulaGroup.add(sprite);
  });
  scene.add(nebulaGroup);

  /* ---------------------------------------------------------
     3. Procedural Earth with Continents, Oceans & Clouds
     --------------------------------------------------------- */
  function makeNoise(seed) {
    const perm = new Uint8Array(512);
    let s = seed;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = (rnd() * (i + 1)) | 0;
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    const fade = t => t * t * (3 - 2 * t);
    return function noise(x, y, wrap) {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const u = fade(xf), v = fade(yf);
      const at = (a, b) => {
        const ax = ((a % wrap) + wrap) % wrap;
        return perm[(perm[(ax + perm[b & 255]) & 255] + b) & 255] / 255;
      };
      const n00 = at(xi, yi), n10 = at(xi + 1, yi);
      const n01 = at(xi, yi + 1), n11 = at(xi + 1, yi + 1);
      return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v;
    };
  }

  function earthTextures() {
    const W = 1024, H = 512;
    const land = document.createElement('canvas'); land.width = W; land.height = H;
    const cloud = document.createElement('canvas'); cloud.width = W; cloud.height = H;
    const lctx = land.getContext('2d'), cctx = cloud.getContext('2d');
    const limg = lctx.createImageData(W, H), cimg = cctx.createImageData(W, H);

    const nA = makeNoise(1337), nB = makeNoise(9021), nC = makeNoise(4477);
    const fbm = (fn, x, y, wrap, oct) => {
      let v = 0, amp = 0.5, f = 1;
      for (let i = 0; i < oct; i++) {
        v += fn(x * f, y * f, wrap * f) * amp;
        amp *= 0.5; f *= 2;
      }
      return v;
    };

    const BASE = 8;
    for (let y = 0; y < H; y++) {
      const lat = y / H;
      const yy = (lat - 0.5) * 2;
      for (let x = 0; x < W; x++) {
        const u = x / W;
        const gx = u * BASE, gy = lat * BASE * 0.5;
        let h = fbm(nA, gx, gy, BASE, 5);
        h = h * 1.30 - 0.28 - Math.abs(yy) * 0.12;

        const i = (y * W + x) * 4;
        let r, g, b;

        // Vivid Blue Ocean with Coastal Continental Shelf
        const deep = Math.min(1, Math.max(0, (0.28 - h) * 4.0));
        const or_ = Math.floor(6 + (1 - deep) * 22);
        const og  = Math.floor(36 + (1 - deep) * 88);
        const ob  = Math.floor(96 + (1 - deep) * 84);

        if (h > 0.28) {
          // Continents: Lush Greens, Forest, Savanna, & Mountain Terrain
          const dry = fbm(nB, gx * 2.4, gy * 2.4, BASE * 2, 3);
          const alt = (h - 0.28) / 0.55;
          if (alt > 0.65) {
            // Mountain peak
            r = 135; g = 120; b = 105;
          } else if (alt > 0.40 || dry > 0.60) {
            // Arid savanna / plateau
            r = 172; g = 142; b = 92;
          } else if (dry < 0.35) {
            // Dense rainforest
            r = 24; g = 98; b = 44;
          } else {
            // Rich green plains
            r = 38; g = 138; b = 64;
          }

          // Shading variation
          const shade = 0.85 + fbm(nC, gx * 5, gy * 5, BASE * 5, 2) * 0.30;
          r = Math.floor(r * shade);
          g = Math.floor(g * shade);
          b = Math.floor(b * shade);

          // Smooth shallow coastal blend
          const coast = Math.min(1, (h - 0.28) / 0.04);
          const e = coast * coast * (3 - 2 * coast);
          r = Math.floor(or_ * (1 - e) + r * e);
          g = Math.floor(og  * (1 - e) + g * e);
          b = Math.floor(ob  * (1 - e) + b * e);
        } else {
          r = or_; g = og; b = ob;
        }

        // Brilliant Polar Ice Caps
        const ice = Math.max(0, (Math.abs(yy) - 0.78) / 0.22);
        if (ice > 0) {
          const t = Math.min(1, ice * 1.5);
          r = Math.floor(r * (1 - t) + 245 * t);
          g = Math.floor(g * (1 - t) + 250 * t);
          b = Math.floor(b * (1 - t) + 255 * t);
        }

        limg.data[i] = r; limg.data[i + 1] = g; limg.data[i + 2] = b; limg.data[i + 3] = 255;

        // Dynamic Swirling Atmospheric Clouds
        let c = fbm(nB, gx * 1.8 + 40, gy * 1.8, BASE * 1.8, 4);
        c = Math.max(0, c * 1.8 - 0.58) * (1 - Math.abs(yy) * 0.40);
        cimg.data[i] = 255; cimg.data[i + 1] = 255; cimg.data[i + 2] = 255;
        cimg.data[i + 3] = Math.min(255, Math.floor(c * 460));
      }
    }

    lctx.putImageData(limg, 0, 0);
    cctx.putImageData(cimg, 0, 0);

    const lt = new THREE.CanvasTexture(land);
    const ct = new THREE.CanvasTexture(cloud);
    if ('colorSpace' in lt && THREE.SRGBColorSpace) {
      lt.colorSpace = THREE.SRGBColorSpace;
      ct.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      lt.encoding = THREE.sRGBEncoding;
      ct.encoding = THREE.sRGBEncoding;
    }
    lt.wrapS = ct.wrapS = THREE.RepeatWrapping;
    return { land: lt, cloud: ct };
  }

  const { land: landTex, cloud: cloudTex } = earthTextures();

  const home = new THREE.Group();
  const homeSurface = new THREE.Mesh(
    new THREE.SphereGeometry(900, 192, 128),
    new THREE.MeshStandardMaterial({
      map: landTex,
      roughness: 0.78,
      metalness: 0.08,
      transparent: true,
      opacity: 0.98
    })
  );
  home.add(homeSurface);

  const homeClouds = new THREE.Mesh(
    new THREE.SphereGeometry(914, 128, 96),
    new THREE.MeshStandardMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.92,
      roughness: 0.95,
      metalness: 0,
      depthWrite: false
    })
  );
  home.add(homeClouds);

  // Atmospheric Blue Halo
  const atmoMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.28, 0.68, 1.0, 1.0) * intensity * 0.35;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  const homeAtmo = new THREE.Mesh(new THREE.SphereGeometry(930, 64, 48), atmoMat);
  home.add(homeAtmo);

  home.position.set(0, -1340, -720);
  home.rotation.z = 0.41;
  scene.add(home);

  // High-Definition Procedural Moon with Maria & Craters
  function moonTexture() {
    const W = 512, H = 256;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(W, H);
    const n = makeNoise(8821);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = n(x * 0.04, y * 0.04, 8) * 0.65 + n(x * 0.14, y * 0.14, 16) * 0.35;
        const tone = Math.floor(125 + v * 95);
        const i = (y * W + x) * 4;
        img.data[i] = tone;
        img.data[i + 1] = Math.floor(tone * 0.98);
        img.data[i + 2] = Math.floor(tone * 0.95);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(62, 48, 36),
    new THREE.MeshStandardMaterial({
      map: moonTexture(),
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.95
    })
  );
  scene.add(moon);

  /* --- Orbiting Communication Satellites with Photovoltaic Solar Arrays --- */
  const satellites = [];
  function makeSatellite(scale) {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xecf0f8, roughness: 0.25, metalness: 0.85 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.9 });

    // Chassis core
    g.add(new THREE.Mesh(new THREE.BoxGeometry(16, 16, 22), bodyMat));
    g.add(new THREE.Mesh(new THREE.BoxGeometry(8, 8, 4), goldMat));

    // Solar Wings
    [-1, 1].forEach(s => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(36, 1.2, 16), panelMat);
      panel.position.x = s * 27;
      g.add(panel);
    });

    // Parabolic High-Gain Antenna Dish
    const dish = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), goldMat);
    dish.position.y = 11;
    dish.rotation.x = -0.55;
    g.add(dish);

    g.scale.setScalar(scale);
    scene.add(g);
    satellites.push(g);
  }
  makeSatellite(0.5);
  makeSatellite(0.35);
  makeSatellite(0.65);

  /* --- Meteors / Shooting Stars / Cosmic Comets --- */
  const cometColors = [0xffffff, 0x8fcaff, 0xa3e5ff, 0xffe4a0, 0xb8b5ff, 0x5eead4, 0xffffff, 0x93c5fd];
  const meteors = [];
  for (let i = 0; i < 8; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]);
    const mat = new THREE.LineBasicMaterial({
      color: cometColors[i % cometColors.length],
      transparent: true,
      opacity: 0,
      linewidth: 2
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    // Stagger wait times so at least two launch within the first 1-2 seconds
    const initialWait = [15, 45, 90, 140, 200, 270, 340, 420][i];
    meteors.push({ line, mat, life: 0, wait: initialWait, vx: 0, vy: 0 });
  }

  function launchMeteor(m) {
    const len = 120 + Math.random() * 180;
    const angle = 0.45 + (Math.random() - 0.5) * 0.25;
    m.line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-len, -len * angle, 0)]);
    m.line.position.set(
      (Math.random() - 0.3) * 1200,
      200 + Math.random() * 450,
      -250 - Math.random() * 650
    );
    m.vx = -7 - Math.random() * 6;
    m.vy = m.vx * angle;
    m.life = 1;
  }

  /* ---------------------------------------------------------
     4. Project Worlds (3D Canvas Spheres in HTML Grid)
     --------------------------------------------------------- */
  const projScene = new THREE.Scene();
  const projCamera = new THREE.OrthographicCamera(
    -window.innerWidth / 2, window.innerWidth / 2,
    window.innerHeight / 2, -window.innerHeight / 2,
    -1000, 1000
  );
  projScene.add(new THREE.AmbientLight(0xffffff, 1.4));
  const projSun = new THREE.DirectionalLight(0xffffff, 2.5);
  projSun.position.set(-1, 0.8, 1);
  projScene.add(projSun);

  function worldTexture(spec) {
    const W = 512, H = 256;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');

    const g = x.createLinearGradient(0, 0, 0, H);
    spec.base.forEach((col, i) => g.addColorStop(i / (spec.base.length - 1), col));
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);

    const wrapped = fn => { fn(0); fn(-W); fn(W); };

    // Mottling
    for (let i = 0; i < spec.mottle; i++) {
      const mx = Math.random() * W, my = Math.random() * H;
      const rx = 35 + Math.random() * 160, ry = 14 + Math.random() * 60;
      const tint = spec.mottleColors[(Math.random() * spec.mottleColors.length) | 0];
      wrapped(off => {
        const rg = x.createRadialGradient(mx + off, my, 0, mx + off, my, rx);
        rg.addColorStop(0, tint);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        x.save();
        x.globalAlpha = 0.12 + Math.random() * 0.22;
        x.translate(mx + off, my);
        x.scale(1, ry / rx);
        x.translate(-(mx + off), -my);
        x.fillStyle = rg;
        x.fillRect(mx + off - rx, my - rx, rx * 2, rx * 2);
        x.restore();
      });
    }

    // Latitude belts
    if (spec.bands) {
      for (let i = 0; i < spec.bands.count; i++) {
        const y = Math.random() * H;
        const th = 6 + Math.random() * 24;
        x.globalAlpha = 0.08 + Math.random() * 0.18;
        x.fillStyle = spec.bands.colors[(Math.random() * spec.bands.colors.length) | 0];
        x.beginPath();
        x.ellipse(W / 2, y, W, th, 0, 0, Math.PI * 2);
        x.fill();
      }
      x.globalAlpha = 1;
    }

    // Impact craters
    for (let i = 0; i < spec.craters; i++) {
      const cx = Math.random() * W;
      const cy = H * (0.18 + Math.random() * 0.64);
      const r = 5 + Math.random() * 24;
      wrapped(off => {
        x.save();
        x.globalAlpha = 0.55;
        x.fillStyle = 'rgba(0,0,0,0.85)';
        x.beginPath(); x.ellipse(cx + off, cy, r, r * 0.72, 0, 0, Math.PI * 2); x.fill();
        x.globalAlpha = 0.5;
        x.strokeStyle = spec.rim;
        x.lineWidth = Math.max(1, r * 0.16);
        x.beginPath(); x.ellipse(cx + off, cy - r * 0.08, r, r * 0.72, 0, Math.PI * 1.05, Math.PI * 2.0); x.stroke();
        x.restore();
      });
    }

    // Storm system
    if (spec.storm) {
      const sx = W * spec.storm.x, sy = H * spec.storm.y;
      wrapped(off => {
        const rg = x.createRadialGradient(sx + off, sy, 0, sx + off, sy, spec.storm.r);
        rg.addColorStop(0, spec.storm.hot);
        rg.addColorStop(0.55, spec.storm.cool);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        x.save();
        x.translate(sx + off, sy); x.scale(1, 0.45); x.translate(-(sx + off), -sy);
        x.fillStyle = rg;
        x.fillRect(sx + off - spec.storm.r, sy - spec.storm.r, spec.storm.r * 2, spec.storm.r * 2);
        x.restore();
      });
    }

    // Polar caps
    if (spec.caps) {
      [[0, 1], [H, -1]].forEach(([edge, dir]) => {
        const cg = x.createLinearGradient(0, edge, 0, edge + dir * H * 0.16);
        cg.addColorStop(0, spec.caps);
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = cg;
        x.fillRect(0, Math.min(edge, edge + dir * H * 0.16), W, H * 0.16);
      });
    }

    const t = new THREE.CanvasTexture(c);
    if ('colorSpace' in t && THREE.SRGBColorSpace) {
      t.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      t.encoding = THREE.sRGBEncoding;
    }
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  function ringTexture(color) {
    const W = 512, c = document.createElement('canvas');
    c.width = W; c.height = 8;
    const x = c.getContext('2d');
    for (let i = 0; i < W; i++) {
      const t = i / W;
      const gap = Math.abs(Math.sin(t * 9.1)) < 0.16 || Math.abs(t - 0.63) < 0.02;
      x.globalAlpha = gap ? 0.05 : 0.30 + 0.45 * Math.abs(Math.sin(t * 23.0));
      x.fillStyle = color;
      x.fillRect(i, 0, 1, 8);
    }
    const t = new THREE.CanvasTexture(c);
    if ('colorSpace' in t && THREE.SRGBColorSpace) {
      t.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      t.encoding = THREE.sRGBEncoding;
    }
    return t;
  }

  const WORLD_SPECS = {
    rag: {
      base: ['#e0f2fe', '#bae6fd', '#38bdf8', '#0284c7', '#0c4a6e'],
      mottleColors: ['rgba(56,189,248,0.5)', 'rgba(14,165,233,0.45)', 'rgba(255,255,255,0.6)'],
      mottle: 26, craters: 8, rim: 'rgba(224,242,254,0.85)',
      bands: { count: 18, colors: ['rgba(186,230,253,0.4)', 'rgba(2,132,199,0.45)'] },
      storm: { x: 0.38, y: 0.44, r: 110, hot: 'rgba(240,249,255,0.95)', cool: 'rgba(56,189,248,0.65)' },
      caps: 'rgba(255,255,255,0.92)', tilt: -0.2
    },
    tagify: {
      base: ['#f3e8ff', '#d8b4fe', '#a855f7', '#7e22ce', '#3b0764'],
      mottleColors: ['rgba(192,132,252,0.5)', 'rgba(250,204,21,0.4)', 'rgba(24,14,48,0.6)'],
      mottle: 24, craters: 10, rim: 'rgba(233,213,255,0.7)',
      bands: { count: 22, colors: ['rgba(216,180,254,0.45)', 'rgba(126,34,206,0.5)'] },
      storm: { x: 0.32, y: 0.48, r: 100, hot: 'rgba(254,240,138,0.9)', cool: 'rgba(168,85,247,0.7)' },
      tilt: 0.35
    },
    face: {
      base: ['#bfdbfe', '#60a5fa', '#2563eb', '#1d4ed8', '#172554'],
      mottleColors: ['rgba(96,165,250,0.55)', 'rgba(30,58,138,0.6)', 'rgba(219,234,254,0.5)'],
      mottle: 28, craters: 35, rim: 'rgba(191,219,254,0.85)',
      caps: 'rgba(255,255,255,0.9)', tilt: 0.18
    },
    mobifixx: {
      base: ['#d1fae5', '#6ee7b7', '#10b981', '#047857', '#022c22'],
      mottleColors: ['rgba(52,211,153,0.5)', 'rgba(16,185,129,0.4)', 'rgba(6,78,59,0.6)'],
      mottle: 25, craters: 18, rim: 'rgba(209,250,229,0.75)',
      caps: 'rgba(240,253,244,0.85)', tilt: -0.22
    },
    funfusion: {
      base: ['#ffedd5', '#fdba74', '#f97316', '#c2410c', '#431407'],
      mottleColors: ['rgba(249,115,22,0.6)', 'rgba(234,88,12,0.5)', 'rgba(254,215,170,0.5)'],
      mottle: 26, craters: 28, rim: 'rgba(254,215,170,0.85)',
      storm: { x: 0.36, y: 0.42, r: 115, hot: 'rgba(255,237,213,0.95)', cool: 'rgba(194,65,12,0.75)' },
      tilt: 0.28
    },
    arcface: {
      base: ['#fce7f3', '#f472b6', '#db2777', '#9d174d', '#500724'],
      mottleColors: ['rgba(244,114,182,0.55)', 'rgba(157,23,77,0.5)', 'rgba(255,255,255,0.6)'],
      mottle: 22, craters: 15, rim: 'rgba(252,231,243,0.8)',
      bands: { count: 16, colors: ['rgba(244,114,182,0.4)', 'rgba(131,24,67,0.45)'] },
      storm: { x: 0.40, y: 0.46, r: 95, hot: 'rgba(253,242,248,0.95)', cool: 'rgba(219,39,119,0.7)' },
      tilt: -0.32
    }
  };

  const worlds = [];
  function buildWorlds() {
    document.querySelectorAll('.planet-slot').forEach(slot => {
      const key = (slot.dataset.world || '').replace('p-', '');
      const spec = WORLD_SPECS[key];
      if (!spec) return;

      const group = new THREE.Group();
      group.rotation.z = spec.tilt || 0;

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 72, 48),
        new THREE.MeshStandardMaterial({
          map: worldTexture(spec),
          roughness: 0.88,
          metalness: 0.04
        })
      );
      group.add(sphere);

      const card = slot.closest('.planet-card');
      const ringColor = card && getComputedStyle(card).getPropertyValue('--ring').trim();
      if (ringColor) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.42, 2.15, 128, 1),
          new THREE.MeshBasicMaterial({
            map: ringTexture(ringColor),
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
            depthWrite: false
          })
        );
        const uv = ring.geometry.attributes.uv, pos = ring.geometry.attributes.position;
        for (let i = 0; i < uv.count; i++) {
          const r = Math.hypot(pos.getX(i), pos.getY(i));
          uv.setXY(i, (r - 1.42) / 0.73, 0.5);
        }
        uv.needsUpdate = true;
        ring.rotation.x = Math.PI / 2 - 0.34;
        group.add(ring);
      }

      projScene.add(group);

      const w = {
        slot,
        group,
        sphere,
        spin: 0.0016 + Math.random() * 0.0014,
        hover: 0,
        hoverT: 0
      };

      if (card) {
        card.addEventListener('pointerenter', () => { w.hoverT = 1; });
        card.addEventListener('pointerleave', () => { w.hoverT = 0; });
        card.addEventListener('focusin', () => { w.hoverT = 1; });
        card.addEventListener('focusout', () => { w.hoverT = 0; });
      }

      worlds.push(w);
    });
  }

  let worldsVisible = false;
  function syncWorlds() {
    const vw = window.innerWidth, vh = window.innerHeight;
    worldsVisible = false;
    for (const w of worlds) {
      const r = w.slot.getBoundingClientRect();
      if (r.width === 0 || r.bottom < -240 || r.top > vh + 240) {
        w.group.visible = false;
        continue;
      }
      w.group.visible = true;
      worldsVisible = true;

      w.hover += (w.hoverT - w.hover) * 0.12;
      const rad = (r.width / 2) * (1 + w.hover * 0.09);
      w.group.position.set(r.left + r.width / 2 - vw / 2, vh / 2 - (r.top + r.height / 2), 0);
      w.group.scale.setScalar(rad);
      w.sphere.rotation.y += w.spin * (1 + w.hover * 1.5);
    }
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    projCamera.left = -window.innerWidth / 2;
    projCamera.right = window.innerWidth / 2;
    projCamera.top = window.innerHeight / 2;
    projCamera.bottom = -window.innerHeight / 2;
    projCamera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(resize, 150), { passive: true });

  /* ---------------------------------------------------------
     6. Cinematic Frame Update Dispatcher & Camera Flight
     --------------------------------------------------------- */
  const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const NEAR_TOP = new THREE.Color('#000000'), NEAR_BOT = new THREE.Color('#000000');
  const FAR_TOP  = new THREE.Color('#000000'), FAR_BOT  = new THREE.Color('#000000');

  let camX = 0, camY = 0, time = 0;
  let smoothProgress = 0;

  window.__skyUpdate = function (state) {
    const p = state.progress || 0;
    const clutter = state.clutter === undefined ? 1 : state.clutter;
    time += 0.016;

    // Smooth floating scroll interpolation for cinematic ease
    smoothProgress += (p - smoothProgress) * 0.075;
    const sp = smoothProgress;

    const far = sat(sp, 0.05, 0.45);
    skyUniforms.uTop.value.copy(NEAR_TOP).lerp(FAR_TOP, far);
    skyUniforms.uBot.value.copy(NEAR_BOT).lerp(FAR_BOT, far);

    // Deep space WARP travel: stars rush past on scroll
    const flyZ = reduce ? 0 : -sp * (FIELD_DEPTH * 2.0);

    // Warp FOV expansion — lightspeed feel as you scroll
    const warpFOV = 65 + sp * 30 + Math.sin(time * 0.4) * 2.0;
    if (Math.abs(camera.fov - warpFOV) > 0.5) { camera.fov = warpFOV; camera.updateProjectionMatrix(); }

    // Strong cosmic breathing zoom
    const breathZoom = Math.sin(time * 0.35) * 80 + Math.cos(time * 0.18) * 45;

    // Slow organic camera drift (weightless floating in deep space)
    const driftX = Math.sin(time * 0.22) * 20 + Math.cos(time * 0.11) * 10;
    const driftY = Math.cos(time * 0.18) * 15 + Math.sin(time * 0.08) * 8;

    // Layered Depth Parallax: distant stars stay, near stars RUSH past — warp!
    deepStars.position.z = flyZ * 0.06;
    midStars.position.z  = flyZ * 0.55;
    nearStars.position.z = flyZ * 2.40;
    dust.position.z      = flyZ * 1.20;

    // Independent multi-layer star twinkling
    deepMat.opacity = 0.85 + 0.10 * Math.sin(time * 2.2);
    midMat.opacity  = 0.90 + 0.10 * Math.sin(time * 3.4 + 1.2);
    nearMat.opacity = 0.95 + 0.05 * Math.sin(time * 4.8 + 2.4);
    dustMat.opacity = 0.60 * sat(sp, 0.03, 0.35);

    // Nebulae drift with subtle depth parallax
    const neb = sat(sp, 0.10, 0.65);
    nebulaMats.forEach((m, i) => {
      m.opacity = neb * (0.05 + i * 0.015) * clutter;
    });
    nebulaGroup.position.z = flyZ * 0.30;
    nebulaGroup.children.forEach((s, i) => {
      s.position.x += Math.sin(time * 0.12 + i) * s.userData.drift * 0.4;
      s.position.y += Math.cos(time * 0.09 + i) * s.userData.drift * 0.25;
    });

    // Earth: curved majestic horizon in lower Hero, perfectly framing the text without obstruction
    home.rotation.y += 0.0014;
    homeClouds.rotation.y += 0.0008;
    const earthBaseY = window.innerWidth <= 768 ? -1380 : -1240;
    home.position.set(0, earthBaseY - sp * 1100, -720 + flyZ * 0.10);

    // Moon orbit
    const ma = time * 0.05;
    moon.position.set(
      home.position.x + Math.cos(ma) * 1400,
      home.position.y + 650 + Math.sin(ma) * 200,
      home.position.z + Math.sin(ma) * 800
    );
    moon.rotation.y += 0.002;

    // Satellites orbiting in space
    satellites.forEach((s, i) => {
      const t = time * (0.07 + i * 0.03) + i * 2.1;
      s.position.set(
        Math.sin(t) * (360 + i * 150),
        Math.cos(t * 0.75) * (180 + i * 75) - 30,
        -520 - i * 180 + flyZ * 0.35
      );
      s.rotation.y = t * 0.7;
      s.rotation.x = Math.sin(t * 0.5) * 0.35;
    });

    // Camera inertia with slow float drift
    const targetCamX = (state.mouseX || 0) * 38 + driftX;
    const targetCamY = -(state.mouseY || 0) * 26 + driftY;
    camX += (targetCamX - camX) * 0.05;
    camY += (targetCamY - camY) * 0.05;

    // Scroll warp thrust: camera accelerates deep into the star field
    const sectionZoom = Math.sin(sp * Math.PI * 1.5) * 90 + sp * 160;
    camera.position.set(camX, camY, flyZ + 40 + sectionZoom + breathZoom);
    camera.lookAt(camX * 0.18, camY * 0.18, flyZ - 800);

    // Shooting stars / Meteors / Cosmic Comets
    for (const m of meteors) {
      if (m.life > 0) {
        m.line.position.x += m.vx;
        m.line.position.y += m.vy;
        m.life -= 0.018;
        m.mat.opacity = Math.max(0, Math.sin(m.life * Math.PI)) * 0.98;
      } else if (--m.wait <= 0) {
        m.wait = 70 + Math.random() * 280; // High frequency comets
        launchMeteor(m);
      }
    }

    // Synchronize 3D Project Worlds with DOM slots
    syncWorlds();

    // Multi-pass Direct WebGL Rendering: rock-solid, ultra-smooth 60fps
    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
    if (worldsVisible) {
      renderer.clearDepth();
      renderer.render(projScene, projCamera);
    }
  };

  buildWorlds();
  window.dispatchEvent(new Event('sky-ready'));

  // Autonomous animation loop: guarantees stars, planets, and comets render immediately
  let frameCount = 0;
  let lastFrameRendered = -1;
  const originalUpdate = window.__skyUpdate;
  window.__skyUpdate = function (st) {
    lastFrameRendered = frameCount;
    originalUpdate(st);
  };

  function skyLoop() {
    requestAnimationFrame(skyLoop);
    frameCount++;
    if (lastFrameRendered !== frameCount) {
      const st = window.state || {
        scrollY: window.scrollY || window.pageYOffset || 0,
        progress: (window.scrollY || 0) / Math.max(1, (document.documentElement.scrollHeight - window.innerHeight) || 1),
        clutter: 1,
        mouseX: 0,
        mouseY: 0
      };
      originalUpdate(st);
    }
  }
  requestAnimationFrame(skyLoop);

})();
