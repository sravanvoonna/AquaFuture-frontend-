import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Realistic Fish Species definitions ────────────────────────────────────────
const FISH_SPECIES = [
  { primary: '#f4a623', secondary: '#e8761a', belly: '#ffe4a0', accent: '#1a1a1a', type: 'clownfish' },
  { primary: '#3a8fd4', secondary: '#1a5fa8', belly: '#8ec8f0', accent: '#0d3a6e', type: 'blue_tang' },
  { primary: '#c0c0c0', secondary: '#8a8a8a', belly: '#f0f0f0', accent: '#444', type: 'silver' },
  { primary: '#f07830', secondary: '#c04820', belly: '#f8c080', accent: '#6a2010', type: 'orange' },
  { primary: '#4a90d9', secondary: '#2860a8', belly: '#a8d8f8', accent: '#184080', type: 'royal_blue' },
  { primary: '#e8c848', secondary: '#c89820', belly: '#f8e898', accent: '#806000', type: 'yellow' },
  { primary: '#70c8a8', secondary: '#309870', belly: '#b8e8d0', accent: '#105840', type: 'teal' },
  { primary: '#d87840', secondary: '#a85020', belly: '#f0b880', accent: '#603010', type: 'copper' },
];

// ─── Realistic Fish ────────────────────────────────────────────────────────────
class RealisticFish {
  constructor(canvasW, canvasH, index) {
    this.id = index;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.species = FISH_SPECIES[index % FISH_SPECIES.length];
    this.reset(canvasW, canvasH);
    this.x = Math.random() * canvasW;
    this.y = 80 + Math.random() * (canvasH - 160);
    this.celebrateAngle = (index / FISH_SPECIES.length) * Math.PI * 2;
    this.scatterVx = 0;
    this.scatterVy = 0;
    this.lag = 0.018 + Math.random() * 0.025;
    this.glowPhase = Math.random() * Math.PI * 2;
    this.shimmerPhase = Math.random() * Math.PI * 2;
  }

  reset(w, h) {
    this.size = 22 + Math.random() * 20;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.tailAngle = 0;
    this.tailSpeed = 0.1 + Math.random() * 0.08;
    this.angle = 0;
    this.targetX = w / 2;
    this.targetY = h / 2;
    this.mode = 'idle';
    this.depth = 0.5 + Math.random() * 0.5; // depth for transparency/size
  }

  update(cursor, mode) {
    this.tailAngle += this.tailSpeed;
    this.glowPhase += 0.02;
    this.shimmerPhase += 0.015;

    if (mode === 'scatter') {
      if (this.scatterVx === 0 && this.scatterVy === 0) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 6 + Math.random() * 7;
        this.scatterVx = Math.cos(angle) * speed;
        this.scatterVy = Math.sin(angle) * speed;
      }
      this.vx = this.vx * 0.82 + this.scatterVx * 0.18;
      this.vy = this.vy * 0.82 + this.scatterVy * 0.18;
      this.scatterVx *= 0.93;
      this.scatterVy *= 0.93;
    } else {
      this.scatterVx = 0;
      this.scatterVy = 0;
      if (mode === 'celebrate') {
        this.celebrateAngle += 0.035;
        const radius = 70 + (this.id % 4) * 38;
        const cx = this.canvasW / 2;
        const cy = this.canvasH / 2;
        const tx = cx + Math.cos(this.celebrateAngle) * radius;
        const ty = cy + Math.sin(this.celebrateAngle) * radius;
        this.vx += (tx - this.x) * 0.07;
        this.vy += (ty - this.y) * 0.07;
        const sp = Math.hypot(this.vx, this.vy);
        if (sp > 5) { this.vx = (this.vx / sp) * 5; this.vy = (this.vy / sp) * 5; }
      } else if (cursor && mode === 'follow') {
        const dx = cursor.x - this.x;
        const dy = cursor.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 40) {
          this.vx += dx * this.lag;
          this.vy += dy * this.lag;
        }
        const sp = Math.hypot(this.vx, this.vy);
        const maxSp = 3.5;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
      } else {
        // Natural idle: gentle wandering with slight bobbing
        this.vx += (Math.random() - 0.5) * 0.12;
        this.vy += (Math.random() - 0.5) * 0.06;
        const sp = Math.hypot(this.vx, this.vy);
        const maxSp = 1.5;
        if (sp > maxSp) { this.vx = (this.vx / sp) * maxSp; this.vy = (this.vy / sp) * maxSp; }
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    const m = this.size * 1.2;
    if (this.x < m) { this.x = m; this.vx = Math.abs(this.vx) * 0.9; }
    if (this.x > this.canvasW - m) { this.x = this.canvasW - m; this.vx = -Math.abs(this.vx) * 0.9; }
    if (this.y < 60) { this.y = 60; this.vy = Math.abs(this.vy) * 0.9; }
    if (this.y > this.canvasH - 60) { this.y = this.canvasH - 60; this.vy = -Math.abs(this.vy) * 0.9; }

    if (Math.abs(this.vx) > 0.05) {
      this.angle = Math.atan2(this.vy, this.vx);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const s = this.size;
    const { primary, secondary, belly, accent } = this.species;
    const shimmer = (Math.sin(this.shimmerPhase) + 1) / 2;

    // ── Shadow beneath fish ──
    ctx.beginPath();
    ctx.ellipse(0, s * 0.55, s * 0.5, s * 0.08, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();

    // ── Caudal fin (tail) ──
    const tailWave = Math.sin(this.tailAngle) * s * 0.38;
    const tailWave2 = Math.sin(this.tailAngle + 0.5) * s * 0.2;
    const tailGrad = ctx.createLinearGradient(-s * 1.0, 0, -s * 0.45, 0);
    tailGrad.addColorStop(0, `${secondary}44`);
    tailGrad.addColorStop(0.5, `${secondary}99`);
    tailGrad.addColorStop(1, `${primary}cc`);
    ctx.beginPath();
    ctx.moveTo(-s * 0.48, 0);
    ctx.bezierCurveTo(
      -s * 0.7, -s * 0.05,
      -s * 0.95, -s * 0.28 + tailWave,
      -s * 1.05, -s * 0.38 + tailWave
    );
    ctx.bezierCurveTo(
      -s * 0.95, -s * 0.1 + tailWave2,
      -s * 0.8, s * 0.05,
      -s * 0.48, 0
    );
    ctx.moveTo(-s * 0.48, 0);
    ctx.bezierCurveTo(
      -s * 0.7, s * 0.05,
      -s * 0.95, s * 0.28 + tailWave,
      -s * 1.05, s * 0.38 + tailWave
    );
    ctx.bezierCurveTo(
      -s * 0.95, s * 0.1 + tailWave2,
      -s * 0.8, -s * 0.05,
      -s * 0.48, 0
    );
    ctx.fillStyle = tailGrad;
    ctx.fill();

    // ── Main body ──
    const bodyGrad = ctx.createRadialGradient(s * 0.1, -s * 0.15, 0, 0, 0, s * 0.75);
    bodyGrad.addColorStop(0, belly);
    bodyGrad.addColorStop(0.35, primary);
    bodyGrad.addColorStop(0.75, secondary);
    bodyGrad.addColorStop(1, `${accent}dd`);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.62, s * 0.34, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // ── Belly highlight ──
    const bellyGrad = ctx.createLinearGradient(0, s * 0.05, 0, s * 0.32);
    bellyGrad.addColorStop(0, `${belly}99`);
    bellyGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.ellipse(0, s * 0.15, s * 0.42, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = bellyGrad;
    ctx.fill();

    // ── Species-specific markings ──
    if (this.species.type === 'clownfish') {
      // White bars
      for (let i = 0; i < 3; i++) {
        const bx = -s * 0.25 + i * s * 0.28;
        ctx.beginPath();
        ctx.ellipse(bx, 0, s * 0.055, s * 0.32, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(bx, 0, s * 0.045, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();
      }
    } else if (this.species.type === 'blue_tang' || this.species.type === 'royal_blue') {
      // Lateral line
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, s * 0.05);
      ctx.quadraticCurveTo(0, s * 0.12, s * 0.4, s * 0.03);
      ctx.strokeStyle = `${accent}88`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (this.species.type === 'silver') {
      // Shimmer scales pattern
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const sx = -s * 0.42 + col * s * 0.27 + (row % 2) * s * 0.13;
          const sy = -s * 0.18 + row * s * 0.15;
          ctx.beginPath();
          ctx.ellipse(sx, sy, s * 0.09, s * 0.07, 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.1 + shimmer * 0.15})`;
          ctx.fill();
        }
      }
    }

    // ── Dorsal fin ──
    const dorsalGrad = ctx.createLinearGradient(0, -s * 0.35, 0, -s * 0.6);
    dorsalGrad.addColorStop(0, `${secondary}cc`);
    dorsalGrad.addColorStop(1, `${secondary}22`);
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.32);
    ctx.bezierCurveTo(-s * 0.1, -s * 0.62, s * 0.2, -s * 0.7, s * 0.35, -s * 0.35);
    ctx.bezierCurveTo(s * 0.15, -s * 0.3, -s * 0.05, -s * 0.3, -s * 0.2, -s * 0.32);
    ctx.fillStyle = dorsalGrad;
    ctx.fill();

    // ── Pectoral fin ──
    const pectGrad = ctx.createLinearGradient(s * 0.1, 0, s * 0.3, s * 0.28);
    pectGrad.addColorStop(0, `${primary}bb`);
    pectGrad.addColorStop(1, `${secondary}33`);
    ctx.beginPath();
    ctx.moveTo(s * 0.1, s * 0.05);
    ctx.bezierCurveTo(s * 0.2, s * 0.3, s * 0.38, s * 0.32, s * 0.32, s * 0.1);
    ctx.bezierCurveTo(s * 0.26, s * 0.04, s * 0.16, s * 0.03, s * 0.1, s * 0.05);
    ctx.fillStyle = pectGrad;
    ctx.fill();

    // ── Lateral line ──
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.04);
    ctx.quadraticCurveTo(0, s * 0.02, s * 0.45, -s * 0.05);
    ctx.strokeStyle = `rgba(0,0,0,0.18)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // ── Mouth ──
    ctx.beginPath();
    ctx.ellipse(s * 0.62, s * 0.04, s * 0.045, s * 0.025, 0, 0, Math.PI * 2);
    ctx.fillStyle = `${accent}cc`;
    ctx.fill();

    // ── Eye ──
    // Sclera
    ctx.beginPath();
    ctx.arc(s * 0.4, -s * 0.1, s * 0.115, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fill();
    // Iris gradient
    const irisGrad = ctx.createRadialGradient(s * 0.42, -s * 0.11, 0, s * 0.4, -s * 0.1, s * 0.085);
    irisGrad.addColorStop(0, '#1a1a2e');
    irisGrad.addColorStop(0.5, '#16213e');
    irisGrad.addColorStop(0.85, accent);
    irisGrad.addColorStop(1, '#000');
    ctx.beginPath();
    ctx.arc(s * 0.4, -s * 0.1, s * 0.085, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad;
    ctx.fill();
    // Pupil
    ctx.beginPath();
    ctx.arc(s * 0.41, -s * 0.105, s * 0.045, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.95)';
    ctx.fill();
    // Eye shine
    ctx.beginPath();
    ctx.arc(s * 0.44, -s * 0.125, s * 0.022, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.38, -s * 0.09, s * 0.01, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    // ── Body shimmer overlay ──
    const shineGrad = ctx.createLinearGradient(-s * 0.1, -s * 0.3, s * 0.2, s * 0.1);
    shineGrad.addColorStop(0, `rgba(255,255,255,${0.05 + shimmer * 0.12})`);
    shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.02)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.62, s * 0.34, 0, 0, Math.PI * 2);
    ctx.fillStyle = shineGrad;
    ctx.fill();

    ctx.restore();
  }
}

// ─── Particle (plankton/dust) ─────────────────────────────────────────────────
class Particle {
  constructor(canvasW, canvasH) {
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.reset();
  }
  reset() {
    this.x = Math.random() * this.canvasW;
    this.y = Math.random() * this.canvasH;
    this.r = 0.5 + Math.random() * 2;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = -0.05 - Math.random() * 0.2;
    this.alpha = 0.05 + Math.random() * 0.25;
    this.life = 1;
    this.decay = 0.002 + Math.random() * 0.003;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -5) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 220, 255, ${this.alpha * this.life})`;
    ctx.fill();
    ctx.restore();
  }
}

// ─── Caustic light pattern generator ─────────────────────────────────────────
function drawCaustics(ctx, w, h, time) {
  ctx.save();
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 12; i++) {
    const x = (Math.sin(time * 0.4 + i * 0.9) * 0.5 + 0.5) * w;
    const y = (Math.sin(time * 0.3 + i * 1.3) * 0.5 + 0.5) * h * 0.6;
    const r = 30 + Math.sin(time * 0.5 + i) * 20;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(120,220,255,0.8)');
    grd.addColorStop(0.4, 'rgba(80,180,255,0.2)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
  ctx.restore();
}

// ─── LoginPage component ───────────────────────────────────────────────────────
export default function LoginPage({ onEnterSite }) {
  const canvasRef = useRef(null);
  const fishRef = useRef([]);
  const particlesRef = useRef([]);
  const cursorRef = useRef(null);
  const modeRef = useRef('idle');
  const animRef = useRef(null);
  const timeRef = useRef(0);

  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      fishRef.current = Array.from({ length: 10 }, (_, i) =>
        new RealisticFish(canvas.width, canvas.height, i)
      );
      particlesRef.current = Array.from({ length: 80 }, () =>
        new Particle(canvas.width, canvas.height)
      );
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    cursorRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawBg = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Deep ocean gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#010f20');
      bg.addColorStop(0.25, '#021929');
      bg.addColorStop(0.6, '#011525');
      bg.addColorStop(0.85, '#010e1c');
      bg.addColorStop(1, '#000b14');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Volumetric god rays from top
      const t = timeRef.current;
      for (let i = 0; i < 6; i++) {
        const cx = (w / 6) * i + w / 12;
        const sway = Math.sin(t * 0.3 + i * 0.8) * 15;
        const rayGrad = ctx.createLinearGradient(cx + sway, 0, cx + sway + 60, h * 0.85);
        rayGrad.addColorStop(0, 'rgba(40, 160, 240, 0.09)');
        rayGrad.addColorStop(0.3, 'rgba(20, 120, 200, 0.05)');
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.save();
        ctx.beginPath();
        const width = 14 + Math.sin(t * 0.2 + i) * 4;
        ctx.moveTo(cx + sway - width, 0);
        ctx.lineTo(cx + sway + 70, h * 0.85);
        ctx.lineTo(cx + sway + 70 - width, h * 0.85);
        ctx.lineTo(cx + sway - width * 2, 0);
        ctx.fillStyle = rayGrad;
        ctx.fill();
        ctx.restore();
      }

      // Caustic light patterns
      drawCaustics(ctx, w, h, t);

      // Deep bottom fade
      const bottomGrad = ctx.createLinearGradient(0, h * 0.75, 0, h);
      bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bottomGrad.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, h * 0.75, w, h * 0.25);

      // Depth fog layer at top
      const topFog = ctx.createLinearGradient(0, 0, 0, 80);
      topFog.addColorStop(0, 'rgba(2, 25, 48, 0.8)');
      topFog.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topFog;
      ctx.fillRect(0, 0, w, 80);

      // Subtle vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = () => {
      timeRef.current += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      drawBg();

      // Particles first (background depth)
      particlesRef.current.forEach(p => { p.update(); p.draw(ctx); });

      // Sort fish by depth for natural overlap
      const sortedFish = [...fishRef.current].sort((a, b) => a.depth - b.depth);
      sortedFish.forEach(f => {
        f.update(cursorRef.current, modeRef.current);
        // Depth-based opacity
        ctx.save();
        ctx.globalAlpha = 0.55 + f.depth * 0.45;
        f.draw(ctx);
        ctx.restore();
      });

      // Cursor water ripple effect
      if (cursorRef.current) {
        const { x, y } = cursorRef.current;
        const t = timeRef.current;
        for (let ring = 0; ring < 3; ring++) {
          const r = 15 + ring * 18 + Math.sin(t * 3 + ring) * 4;
          const a = 0.15 - ring * 0.04;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 212, 170, ${a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handlePasswordFocus = () => {
    modeRef.current = 'scatter';
    setFocusedField('password');
  };
  const handlePasswordBlur = () => {
    modeRef.current = cursorRef.current ? 'follow' : 'idle';
    setFocusedField(null);
  };
  const handleInputFocus = (name) => {
    modeRef.current = cursorRef.current ? 'follow' : 'idle';
    setFocusedField(name);
  };
  const handleInputBlur = () => setFocusedField(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) { setError('Please fill in all fields.'); return; }
    setIsSubmitting(true);
    modeRef.current = 'celebrate';
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        modeRef.current = 'idle';
        if (onEnterSite) onEnterSite();
      }, 2000);
    }, 1500);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (signupData.password !== signupData.confirm) { setError('Passwords do not match.'); return; }
    setIsSubmitting(true);
    modeRef.current = 'celebrate';
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        modeRef.current = 'idle';
        setTab('login');
        setSubmitted(false);
      }, 2200);
    }, 1500);
  };

  const inputFocusStyle = (name) => ({
    ...inputBase,
    borderColor: focusedField === name ? 'rgba(0, 200, 160, 0.7)' : 'rgba(255,255,255,0.08)',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(0, 200, 160, 0.1), inset 0 1px 2px rgba(0,0,0,0.3)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
    background: focusedField === name ? 'rgba(0, 200, 160, 0.05)' : 'rgba(255,255,255,0.04)',
  });

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#000d18',
    }}>
      {/* LEFT — Photorealistic Aquarium */}
      <div style={{ flex: '0 0 52%', position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'none' }}
        />

        {/* Top status bar */}
        <div style={{
          position: 'absolute', top: '20px', left: '20px', right: '20px',
          display: 'flex', gap: '10px', alignItems: 'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(16px)',
            borderRadius: '30px', padding: '8px 16px',
            border: '1px solid rgba(0, 212, 170, 0.15)',
          }}>
            <span style={{ fontSize: '8px', color: '#00d4aa', animation: 'pulseGlow 2s ease infinite' }}>●</span>
            <span style={{ color: 'rgba(180,230,255,0.85)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>
              LIVE AQUARIUM
            </span>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)',
            borderRadius: '30px', padding: '7px 14px',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(180,210,255,0.5)', fontSize: '0.72rem',
          }}>
            10 species · depth 24m
          </div>
        </div>

        {/* Bottom hint */}
        <div style={{
          position: 'absolute', bottom: '28px', left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '24px', padding: '7px 18px',
            color: 'rgba(180,220,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.3px',
          }}>
            Move cursor to guide fish &nbsp;·&nbsp; Enter password to scatter them
          </div>
        </div>

        {/* Right edge separator */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(0,212,170,0.12) 30%, rgba(0,212,170,0.08) 70%, transparent)',
        }} />
      </div>

      {/* RIGHT — Auth Panel */}
      <div style={{
        flex: '0 0 48%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 52px',
        background: 'linear-gradient(160deg, #010f1e 0%, #020e1a 50%, #010b16 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle bg glow orbs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,100,180,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-8%',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,150,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '52px', height: '52px', borderRadius: '16px', marginBottom: '14px',
            background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,140,255,0.1))',
            border: '1px solid rgba(0,212,170,0.2)',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🌊</span>
          </div>
          <h1 style={{
            margin: '0 0 4px',
            fontSize: '1.65rem', fontWeight: 800,
            letterSpacing: '1px',
            background: 'linear-gradient(90deg, #e0f8ff, #a0d8f0)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>AquaFuture</h1>
          <p style={{
            margin: 0, color: 'rgba(140,190,220,0.45)',
            fontSize: '0.72rem', letterSpacing: '2.5px', textTransform: 'uppercase',
          }}>Smart Aquaculture Platform</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', width: '100%', maxWidth: '400px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '10px', padding: '3px', marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSubmitted(false); }}
              style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem',
                letterSpacing: '0.3px', transition: 'all 0.2s',
                fontFamily: 'inherit',
                background: tab === t
                  ? 'rgba(0, 212, 170, 0.12)'
                  : 'transparent',
                color: tab === t ? '#00d4aa' : 'rgba(140,190,220,0.4)',
                boxShadow: tab === t ? 'inset 0 0 0 1px rgba(0,212,170,0.2)' : 'none',
              }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          width: '100%', maxWidth: '400px',
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(24px)',
          borderRadius: '18px',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '30px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,170,0.04)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.35), transparent)',
          }} />

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 18px',
                background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>✓</div>
              <h3 style={{ color: '#e0f8ff', margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700 }}>
                {tab === 'login' ? 'Welcome back' : 'Account created'}
              </h3>
              <p style={{ color: 'rgba(140,190,220,0.5)', margin: 0, fontSize: '0.85rem' }}>
                {tab === 'login' ? 'Entering the platform...' : 'Switching to sign in...'}
              </p>
              <div style={{ marginTop: '22px', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #00d4aa, #4fc3f7)',
                  borderRadius: '2px',
                  animation: 'progressFill 1.5s linear forwards',
                }} />
              </div>
            </div>
          ) : tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} autoComplete="off">
              <div style={{ marginBottom: '14px' }}>
                <label style={labelSt}>Email</label>
                <input type="email" placeholder="name@company.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={handleInputBlur}
                  required style={inputFocusStyle('email')} />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label style={labelSt}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    required style={{ ...inputFocusStyle('password'), paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                    {showPass ? '○' : '●'}
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginBottom: '22px' }}>
                <a href="#" style={{ color: 'rgba(0,212,170,0.6)', fontSize: '0.77rem', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              {error && <p style={errorSt}>{error}</p>}
              <button type="submit" disabled={isSubmitting} style={btnStyle(isSubmitting)}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                    Authenticating...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} autoComplete="off">
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Full Name</label>
                <input type="text" placeholder="John Doe"
                  value={signupData.name}
                  onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                  onFocus={() => handleInputFocus('name')}
                  onBlur={handleInputBlur}
                  required style={inputFocusStyle('name')} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Email</label>
                <input type="email" placeholder="name@company.com"
                  value={signupData.email}
                  onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                  onFocus={() => handleInputFocus('semail')}
                  onBlur={handleInputBlur}
                  required style={inputFocusStyle('semail')} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelSt}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                    value={signupData.password}
                    onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    required style={{ ...inputFocusStyle('spassword'), paddingRight: '42px' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                    {showPass ? '○' : '●'}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '22px' }}>
                <label style={labelSt}>Confirm Password</label>
                <input type="password" placeholder="Repeat password"
                  value={signupData.confirm}
                  onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  required style={inputFocusStyle('confirm')} />
              </div>
              {error && <p style={errorSt}>{error}</p>}
              <button type="submit" disabled={isSubmitting} style={btnStyle(isSubmitting)}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p style={{
          marginTop: '22px', color: 'rgba(120,170,200,0.25)',
          fontSize: '0.72rem', textAlign: 'center', lineHeight: 1.5,
        }}>
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        @keyframes progressFill {
          from { width: 0; } to { width: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #020e1a inset !important;
          -webkit-text-fill-color: #c8e8f8 !important;
          caret-color: #c8e8f8;
        }
        input::placeholder { color: rgba(140,190,220,0.25) !important; }
        input:focus { outline: none; }
        button:hover:not(:disabled) { filter: brightness(1.08); }
      `}</style>
    </div>
  );
}

const labelSt = {
  display: 'block', marginBottom: '6px',
  color: 'rgba(160,210,240,0.6)',
  fontSize: '0.77rem', fontWeight: 600, letterSpacing: '0.3px',
};

const inputBase = {
  width: '100%', padding: '11px 14px',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#c8e8f8',
  fontSize: '0.88rem',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const eyeBtn = {
  position: 'absolute', right: '12px', top: '50%',
  transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(140,190,220,0.35)', fontSize: '0.65rem',
  padding: '4px', lineHeight: 1,
};

const errorSt = {
  color: 'rgba(255, 100, 120, 0.85)',
  fontSize: '0.8rem', margin: '-8px 0 14px',
  textAlign: 'center', fontWeight: 500,
};

const btnStyle = (disabled) => ({
  width: '100%', padding: '12px',
  background: disabled
    ? 'rgba(0,180,140,0.25)'
    : 'linear-gradient(135deg, #00c8a0, #0098d4)',
  border: '1px solid rgba(0,212,170,0.25)',
  borderRadius: '10px',
  color: disabled ? 'rgba(0,212,170,0.5)' : '#fff',
  fontWeight: 700, fontSize: '0.88rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s',
  letterSpacing: '0.3px',
  fontFamily: 'inherit',
  boxShadow: disabled ? 'none' : '0 4px 24px rgba(0, 180, 150, 0.3)',
});
