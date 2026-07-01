import { useState, useEffect, useRef, useCallback } from 'react';

/* ══════════════════════════════════════════════════════════════════════════════
   AquaFuture Login Page
   - Realistic fish school with boid physics
   - Matches main site ocean theme (--ocean-deepest, --aqua-primary, etc.)
   - Premium glassmorphism form panel
   ══════════════════════════════════════════════════════════════════════════════ */

// ─── Species palette (natural aquaculture tones) ─────────────────────────────
const SPECIES = [
  { body: [244,166,35], belly: [255,228,160], fin: [232,118,26], name: 'Clownfish' },
  { body: [58,143,212], belly: [142,200,240], fin: [26,95,168], name: 'Blue Tang' },
  { body: [192,192,192], belly: [240,240,240], fin: [138,138,138], name: 'Silver Barb' },
  { body: [240,120,48], belly: [248,192,128], fin: [192,72,32], name: 'Koi' },
  { body: [74,144,217], belly: [168,216,248], fin: [40,96,168], name: 'Royal Blue' },
  { body: [232,200,72], belly: [248,232,152], fin: [200,152,32], name: 'Golden' },
  { body: [112,200,168], belly: [184,232,208], fin: [48,152,112], name: 'Teal Wrasse' },
  { body: [216,120,64], belly: [240,184,128], fin: [168,80,32], name: 'Copper' },
  { body: [160,80,200], belly: [200,160,240], fin: [120,40,160], name: 'Purple Tang' },
  { body: [80,200,120], belly: [160,240,180], fin: [40,152,80], name: 'Green Chromis' },
];

const rgb = (arr, a = 1) => `rgba(${arr[0]},${arr[1]},${arr[2]},${a})`;

// ─── Fish with boid-like behavior ────────────────────────────────────────────
class Fish {
  constructor(w, h, i) {
    const sp = SPECIES[i % SPECIES.length];
    this.bodyC = sp.body;
    this.bellyC = sp.belly;
    this.finC = sp.fin;
    this.id = i;
    this.w = w; this.h = h;
    this.size = 20 + Math.random() * 16;
    this.x = 100 + Math.random() * (w - 200);
    this.y = 100 + Math.random() * (h - 200);
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 2;
    this.maxSpeed = 2.2 + Math.random() * 1.5;
    this.tailPhase = Math.random() * Math.PI * 2;
    this.tailFreq = 0.12 + Math.random() * 0.06;
    this.shimmer = Math.random() * Math.PI * 2;
    this.depth = 0.6 + Math.random() * 0.4;
    this.angle = 0;
    this.targetAngle = 0;
    this.scatterTimer = 0;
    this.celebTimer = 0;
    this.celebAngle = (i / 10) * Math.PI * 2;
  }

  update(cursor, mode, allFish) {
    this.tailPhase += this.tailFreq;
    this.shimmer += 0.025;

    // ── Scatter from password ──
    if (mode === 'scatter') {
      if (this.scatterTimer <= 0) {
        const a = Math.random() * Math.PI * 2;
        const spd = 8 + Math.random() * 6;
        this.vx = Math.cos(a) * spd;
        this.vy = Math.sin(a) * spd;
        this.scatterTimer = 60 + Math.random() * 40;
      }
      this.scatterTimer--;
      this.vx *= 0.97;
      this.vy *= 0.97;
    }
    // ── Celebrate circle ──
    else if (mode === 'celebrate') {
      this.celebAngle += 0.04;
      const r = 60 + (this.id % 4) * 35;
      const cx = this.w / 2, cy = this.h / 2;
      const tx = cx + Math.cos(this.celebAngle) * r;
      const ty = cy + Math.sin(this.celebAngle) * r;
      this.vx += (tx - this.x) * 0.06;
      this.vy += (ty - this.y) * 0.06;
      this.vx *= 0.92;
      this.vy *= 0.92;
    }
    // ── Follow cursor ──
    else if (cursor) {
      const dx = cursor.x - this.x;
      const dy = cursor.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 50) {
        const strength = Math.min(0.04, 1.5 / dist);
        this.vx += dx * strength;
        this.vy += dy * strength;
      } else if (dist < 30) {
        // too close — gently disperse
        this.vx -= dx * 0.01;
        this.vy -= dy * 0.01;
      }
      // Simple boid: avoid crowding other fish
      for (const f of allFish) {
        if (f === this) continue;
        const fdx = this.x - f.x;
        const fdy = this.y - f.y;
        const fd = Math.hypot(fdx, fdy);
        if (fd < 35 && fd > 0) {
          this.vx += (fdx / fd) * 0.3;
          this.vy += (fdy / fd) * 0.3;
        }
      }
    }
    // ── Idle schooling ──
    else {
      // Gentle wander + schooling
      this.vx += (Math.random() - 0.5) * 0.15;
      this.vy += (Math.random() - 0.5) * 0.1;
      // Slight schooling toward center
      this.vx += (this.w / 2 - this.x) * 0.0002;
      this.vy += (this.h / 2 - this.y) * 0.0002;
      // Avoid crowding
      for (const f of allFish) {
        if (f === this) continue;
        const fdx = this.x - f.x;
        const fdy = this.y - f.y;
        const fd = Math.hypot(fdx, fdy);
        if (fd < 40 && fd > 0) {
          this.vx += (fdx / fd) * 0.15;
          this.vy += (fdy / fd) * 0.15;
        }
      }
    }

    // Speed limit
    const speed = Math.hypot(this.vx, this.vy);
    const limit = mode === 'scatter' ? 10 : this.maxSpeed;
    if (speed > limit) {
      this.vx = (this.vx / speed) * limit;
      this.vy = (this.vy / speed) * limit;
    }

    // Friction
    if (mode !== 'scatter') {
      this.vx *= 0.985;
      this.vy *= 0.985;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Bounce with padding
    const pad = this.size * 1.5;
    if (this.x < pad) { this.x = pad; this.vx = Math.abs(this.vx) * 0.8; }
    if (this.x > this.w - pad) { this.x = this.w - pad; this.vx = -Math.abs(this.vx) * 0.8; }
    if (this.y < pad) { this.y = pad; this.vy = Math.abs(this.vy) * 0.8; }
    if (this.y > this.h - pad) { this.y = this.h - pad; this.vy = -Math.abs(this.vy) * 0.8; }

    // Smooth angle
    if (speed > 0.3) {
      this.targetAngle = Math.atan2(this.vy, this.vx);
    }
    let da = this.targetAngle - this.angle;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    this.angle += da * 0.12;
  }

  draw(ctx) {
    const s = this.size;
    const tailWave = Math.sin(this.tailPhase) * s * 0.35;
    const shimVal = (Math.sin(this.shimmer) + 1) * 0.5;

    ctx.save();
    ctx.globalAlpha = 0.5 + this.depth * 0.5;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // ── Tail (caudal fin) ──
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, 0);
    ctx.bezierCurveTo(-s * 0.8, -s * 0.1, -s * 1.0, -s * 0.35 + tailWave, -s * 1.1, -s * 0.4 + tailWave);
    ctx.bezierCurveTo(-s * 0.9, -s * 0.05, -s * 0.9, s * 0.05, -s * 0.5, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, 0);
    ctx.bezierCurveTo(-s * 0.8, s * 0.1, -s * 1.0, s * 0.35 + tailWave, -s * 1.1, s * 0.4 + tailWave);
    ctx.bezierCurveTo(-s * 0.9, s * 0.05, -s * 0.9, -s * 0.05, -s * 0.5, 0);
    const tg = ctx.createLinearGradient(-s * 1.1, 0, -s * 0.5, 0);
    tg.addColorStop(0, rgb(this.finC, 0.3));
    tg.addColorStop(1, rgb(this.finC, 0.7));
    ctx.fillStyle = tg;
    ctx.fill();

    // ── Main body ──
    const bg = ctx.createRadialGradient(s * 0.1, -s * 0.1, 0, 0, 0, s * 0.7);
    bg.addColorStop(0, rgb(this.bellyC, 0.95));
    bg.addColorStop(0.4, rgb(this.bodyC, 0.95));
    bg.addColorStop(0.85, rgb(this.finC, 0.8));
    bg.addColorStop(1, rgb(this.finC, 0.5));
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.6, s * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();

    // ── Belly sheen ──
    ctx.beginPath();
    ctx.ellipse(0, s * 0.12, s * 0.4, s * 0.14, 0, 0, Math.PI * 2);
    const blg = ctx.createLinearGradient(0, 0, 0, s * 0.28);
    blg.addColorStop(0, rgb(this.bellyC, 0.5));
    blg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = blg;
    ctx.fill();

    // ── Dorsal fin ──
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.3);
    ctx.bezierCurveTo(-s * 0.05, -s * 0.6, s * 0.2, -s * 0.55, s * 0.3, -s * 0.3);
    ctx.bezierCurveTo(s * 0.1, -s * 0.28, -s * 0.05, -s * 0.28, -s * 0.15, -s * 0.3);
    ctx.fillStyle = rgb(this.finC, 0.5);
    ctx.fill();

    // ── Pectoral fin ──
    const pfWave = Math.sin(this.tailPhase * 1.5) * s * 0.08;
    ctx.beginPath();
    ctx.moveTo(s * 0.05, s * 0.1);
    ctx.bezierCurveTo(s * 0.15, s * 0.35 + pfWave, s * 0.35, s * 0.3 + pfWave, s * 0.25, s * 0.08);
    ctx.fillStyle = rgb(this.finC, 0.4);
    ctx.fill();

    // ── Scale pattern (subtle) ──
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        const sx = -s * 0.35 + c * s * 0.22 + (r % 2) * s * 0.11;
        const sy = -s * 0.12 + r * s * 0.14;
        ctx.beginPath();
        ctx.arc(sx, sy, s * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.03 + shimVal * 0.06})`;
        ctx.fill();
      }
    }

    // ── Lateral line ──
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, 0);
    ctx.quadraticCurveTo(0, s * 0.04, s * 0.48, -s * 0.02);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // ── Eye ──
    ctx.beginPath();
    ctx.arc(s * 0.38, -s * 0.08, s * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();
    // iris
    const ig = ctx.createRadialGradient(s * 0.39, -s * 0.085, 0, s * 0.38, -s * 0.08, s * 0.07);
    ig.addColorStop(0, '#0a0a18');
    ig.addColorStop(0.6, '#1a2240');
    ig.addColorStop(1, '#000');
    ctx.beginPath();
    ctx.arc(s * 0.39, -s * 0.08, s * 0.065, 0, Math.PI * 2);
    ctx.fillStyle = ig;
    ctx.fill();
    // pupil
    ctx.beginPath();
    ctx.arc(s * 0.395, -s * 0.08, s * 0.035, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.95)';
    ctx.fill();
    // catchlight
    ctx.beginPath();
    ctx.arc(s * 0.42, -s * 0.1, s * 0.018, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();

    // ── Body highlight (specular) ──
    const hlg = ctx.createLinearGradient(-s * 0.2, -s * 0.35, s * 0.3, s * 0.1);
    hlg.addColorStop(0, `rgba(255,255,255,${0.04 + shimVal * 0.08})`);
    hlg.addColorStop(0.5, 'rgba(255,255,255,0)');
    hlg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.6, s * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = hlg;
    ctx.fill();

    ctx.restore();
  }
}

// ─── Particle (plankton) ─────────────────────────────────────────────────────
class Plankton {
  constructor(w, h) { this.w = w; this.h = h; this.reset(); }
  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.r = 0.5 + Math.random() * 1.8;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = -0.03 - Math.random() * 0.15;
    this.alpha = 0.04 + Math.random() * 0.18;
    this.life = 1;
    this.decay = 0.001 + Math.random() * 0.002;
  }
  update() {
    this.x += this.vx + Math.sin(this.y * 0.01) * 0.1;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -5) this.reset();
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160, 220, 255, ${this.alpha * this.life})`;
    ctx.fill();
  }
}

// ─── Bubble ──────────────────────────────────────────────────────────────────
class Bubble {
  constructor(w, h) { this.w = w; this.h = h; this.reset(); }
  reset() {
    this.x = Math.random() * this.w;
    this.y = this.h + 10 + Math.random() * 50;
    this.r = 1.5 + Math.random() * 4;
    this.speed = 0.3 + Math.random() * 0.6;
    this.wobblePhase = Math.random() * Math.PI * 2;
  }
  update() {
    this.y -= this.speed;
    this.wobblePhase += 0.04;
    this.x += Math.sin(this.wobblePhase) * 0.3;
    if (this.y < -10) this.reset();
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(120, 200, 255, 0.25)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    // highlight
    ctx.beginPath();
    ctx.arc(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 240, 255, 0.2)';
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function LoginPage({ onEnterSite }) {
  const canvasRef = useRef(null);
  const fishRef = useRef([]);
  const planktonRef = useRef([]);
  const bubblesRef = useRef([]);
  const cursorRef = useRef(null);
  const modeRef = useRef('idle');
  const animRef = useRef(null);
  const timeRef = useRef(0);

  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // ── Canvas init ──
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const container = cvs.parentElement;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cvs.width = rect.width;
      cvs.height = rect.height;
      const w = cvs.width, h = cvs.height;
      fishRef.current = Array.from({ length: 12 }, (_, i) => new Fish(w, h, i));
      planktonRef.current = Array.from({ length: 60 }, () => new Plankton(w, h));
      bubblesRef.current = Array.from({ length: 14 }, () => new Bubble(w, h));
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const onMouseMove = useCallback((e) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const r = cvs.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (modeRef.current !== 'scatter' && modeRef.current !== 'celebrate') {
      modeRef.current = 'follow';
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    cursorRef.current = null;
    if (modeRef.current === 'follow') modeRef.current = 'idle';
  }, []);

  // ── Render loop ──
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');

    const loop = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = cvs.width, h = cvs.height;
      if (w === 0 || h === 0) { animRef.current = requestAnimationFrame(loop); return; }

      ctx.clearRect(0, 0, w, h);

      // ── Deep ocean background ──
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#011124');
      bg.addColorStop(0.3, '#03254c');
      bg.addColorStop(0.6, '#083e75');
      bg.addColorStop(0.85, '#03254c');
      bg.addColorStop(1, '#011124');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── God rays ──
      ctx.save();
      for (let i = 0; i < 7; i++) {
        const cx = (w / 7) * i + w / 14;
        const sway = Math.sin(t * 0.25 + i * 1.1) * 20;
        const baseW = 10 + Math.sin(t * 0.15 + i) * 5;
        const grad = ctx.createLinearGradient(cx + sway, 0, cx + sway + 40, h * 0.9);
        grad.addColorStop(0, 'rgba(0, 140, 220, 0.06)');
        grad.addColorStop(0.4, 'rgba(0, 100, 180, 0.025)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.moveTo(cx + sway - baseW, 0);
        ctx.lineTo(cx + sway + 50 + baseW, h * 0.9);
        ctx.lineTo(cx + sway + 50 - baseW, h * 0.9);
        ctx.lineTo(cx + sway - baseW * 2, 0);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // ── Caustic patterns ──
      ctx.save();
      ctx.globalAlpha = 0.025;
      for (let i = 0; i < 15; i++) {
        const cx = (Math.sin(t * 0.3 + i * 0.7) * 0.5 + 0.5) * w;
        const cy = (Math.sin(t * 0.2 + i * 1.1) * 0.5 + 0.5) * h * 0.65;
        const r = 25 + Math.sin(t * 0.4 + i) * 15;
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        cg.addColorStop(0, 'rgba(0, 212, 170, 0.6)');
        cg.addColorStop(0.5, 'rgba(0, 180, 255, 0.2)');
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }
      ctx.restore();

      // ── Vignette ──
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.9);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      // ── Plankton ──
      planktonRef.current.forEach(p => { p.update(); p.draw(ctx); });

      // ── Bubbles ──
      bubblesRef.current.forEach(b => { b.update(); b.draw(ctx); });

      // ── Fish (sorted by depth) ──
      const sorted = [...fishRef.current].sort((a, b) => a.depth - b.depth);
      sorted.forEach(f => {
        f.update(cursorRef.current, modeRef.current, fishRef.current);
        f.draw(ctx);
      });

      // ── Cursor glow ──
      if (cursorRef.current) {
        const { x, y } = cursorRef.current;
        for (let ring = 0; ring < 3; ring++) {
          const r = 12 + ring * 14 + Math.sin(t * 2.5 + ring) * 3;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 212, 170, ${0.2 - ring * 0.06})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        const cGlow = ctx.createRadialGradient(x, y, 0, x, y, 35);
        cGlow.addColorStop(0, 'rgba(0, 212, 170, 0.12)');
        cGlow.addColorStop(1, 'rgba(0, 212, 170, 0)');
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.fillStyle = cGlow;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ── Mode handlers ──
  const onPasswordFocus = () => { modeRef.current = 'scatter'; };
  const onPasswordBlur = () => { modeRef.current = cursorRef.current ? 'follow' : 'idle'; };
  const onFieldFocus = () => { if (modeRef.current !== 'scatter') modeRef.current = cursorRef.current ? 'follow' : 'idle'; };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) { setError('All fields are required'); return; }
    setSubmitting(true);
    modeRef.current = 'celebrate';
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => { modeRef.current = 'idle'; if (onEnterSite) onEnterSite(); }, 1800);
    }, 1500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirm) {
      setError('All fields are required'); return;
    }
    if (signupData.password !== signupData.confirm) { setError('Passwords do not match'); return; }
    setSubmitting(true);
    modeRef.current = 'celebrate';
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => { modeRef.current = 'idle'; setTab('login'); setDone(false); }, 2000);
    }, 1500);
  };

  return (
    <>
      <style>{loginCSS}</style>
      <div className="login-root">
        {/* ── Aquarium Panel ── */}
        <div className="login-aquarium">
          <canvas
            ref={canvasRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="login-canvas"
          />
          <div className="aqua-overlay-top">
            <div className="aqua-badge">
              <span className="aqua-badge-dot" />
              <span>LIVE AQUARIUM</span>
            </div>
            <div className="aqua-badge aqua-badge-info">12 species · depth 24m</div>
          </div>
          <div className="aqua-overlay-bottom">
            <div className="aqua-hint">
              Move cursor to attract fish · Type password to scatter them
            </div>
          </div>
          <div className="aqua-brand-watermark">AquaFuture</div>
        </div>

        {/* ── Auth Panel ── */}
        <div className="login-panel">
          <div className="login-panel-glow login-panel-glow-1" />
          <div className="login-panel-glow login-panel-glow-2" />

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">🌊</div>
            <h1 className="login-brand-name">
              <span className="login-brand-aqua">Aqua</span>
              <span className="login-brand-future">Future</span>
            </h1>
            <p className="login-brand-sub">Smart Aquaculture Platform</p>
          </div>

          {/* Tab Switcher */}
          <div className="login-tabs">
            {['login', 'signup'].map(t => (
              <button key={t}
                className={`login-tab ${tab === t ? 'active' : ''}`}
                onClick={() => { setTab(t); setError(''); setDone(false); }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="login-card">
            <div className="login-card-glow" />

            {done ? (
              <div className="login-success">
                <div className="login-success-icon">✓</div>
                <h3>{tab === 'login' ? 'Welcome back!' : 'Account created!'}</h3>
                <p>{tab === 'login' ? 'Entering AquaFuture...' : 'Switching to sign in...'}</p>
                <div className="login-progress-track">
                  <div className="login-progress-bar" />
                </div>
              </div>
            ) : tab === 'login' ? (
              <form onSubmit={handleLogin} autoComplete="off">
                <div className="login-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="you@company.com"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    onFocus={onFieldFocus} />
                </div>
                <div className="login-field">
                  <label>Password</label>
                  <div className="login-pass-wrap">
                    <input type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                      value={loginData.password}
                      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                      onFocus={onPasswordFocus}
                      onBlur={onPasswordBlur} />
                    <button type="button" className="login-eye" onClick={() => setShowPass(!showPass)}>
                      {showPass ? '◡' : '◉'}
                    </button>
                  </div>
                </div>
                <div className="login-forgot">
                  <a href="#">Forgot password?</a>
                </div>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="login-submit" disabled={submitting}>
                  {submitting ? <><span className="login-spinner" /> Verifying...</> : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} autoComplete="off">
                <div className="login-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe"
                    value={signupData.name}
                    onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                    onFocus={onFieldFocus} />
                </div>
                <div className="login-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="you@company.com"
                    value={signupData.email}
                    onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                    onFocus={onFieldFocus} />
                </div>
                <div className="login-field">
                  <label>Password</label>
                  <div className="login-pass-wrap">
                    <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                      value={signupData.password}
                      onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                      onFocus={onPasswordFocus}
                      onBlur={onPasswordBlur} />
                    <button type="button" className="login-eye" onClick={() => setShowPass(!showPass)}>
                      {showPass ? '◡' : '◉'}
                    </button>
                  </div>
                </div>
                <div className="login-field">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Re-enter password"
                    value={signupData.confirm}
                    onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                    onFocus={onPasswordFocus}
                    onBlur={onPasswordBlur} />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="login-submit" disabled={submitting}>
                  {submitting ? <><span className="login-spinner" /> Creating...</> : 'Create Account'}
                </button>
              </form>
            )}
          </div>

          <p className="login-legal">By continuing, you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Scoped CSS — uses the same design tokens as the main AquaFuture site
// ═══════════════════════════════════════════════════════════════════════════════
const loginCSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.login-root {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #011124;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ── Aquarium ── */
.login-aquarium {
  flex: 0 0 52%;
  position: relative;
  overflow: hidden;
}
.login-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: none;
}

/* overlays */
.aqua-overlay-top {
  position: absolute; top: 20px; left: 20px; right: 20px;
  display: flex; gap: 10px; align-items: center;
  pointer-events: none;
}
.aqua-badge {
  display: flex; align-items: center; gap: 8px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px; padding: 7px 16px;
  border: 1px solid rgba(0, 212, 170, 0.15);
  color: rgba(180,230,255,0.8);
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 1.2px;
}
.aqua-badge-info {
  margin-left: auto;
  border-color: rgba(255,255,255,0.06);
  color: rgba(160,200,240,0.4);
  letter-spacing: 0.5px;
}
.aqua-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #00d4aa;
  box-shadow: 0 0 6px #00d4aa;
  animation: pulseDot 2s ease infinite;
}

.aqua-overlay-bottom {
  position: absolute; bottom: 24px; left: 0; right: 0;
  display: flex; justify-content: center;
  pointer-events: none;
}
.aqua-hint {
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px; padding: 6px 18px;
  color: rgba(160,210,240,0.4);
  font-size: 0.7rem; letter-spacing: 0.3px;
}
.aqua-brand-watermark {
  position: absolute; bottom: 56px; left: 0; right: 0;
  text-align: center; pointer-events: none;
  font-family: 'Outfit', sans-serif;
  font-size: 1.8rem; font-weight: 800;
  letter-spacing: 4px; text-transform: uppercase;
  color: rgba(0, 212, 170, 0.08);
}

/* ── Auth panel ── */
.login-panel {
  flex: 0 0 48%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 48px;
  background: linear-gradient(160deg, #011124 0%, #03254c 50%, #011124 100%);
  position: relative; overflow: hidden;
  border-left: 1px solid rgba(0, 212, 170, 0.08);
}
.login-panel-glow {
  position: absolute; border-radius: 50%; pointer-events: none;
}
.login-panel-glow-1 {
  top: -8%; right: -5%;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(0, 212, 170, 0.06) 0%, transparent 70%);
}
.login-panel-glow-2 {
  bottom: -5%; left: -8%;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(0, 140, 255, 0.05) 0%, transparent 70%);
}

/* Brand */
.login-brand {
  text-align: center; margin-bottom: 32px;
}
.login-brand-icon {
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 50px; height: 50px; border-radius: 16px;
  background: rgba(0, 212, 170, 0.08);
  border: 1px solid rgba(0, 212, 170, 0.15);
  font-size: 1.5rem; margin-bottom: 14px;
  box-shadow: 0 0 30px rgba(0, 212, 170, 0.1);
}
.login-brand-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.7rem; font-weight: 800;
  margin: 0 0 4px; letter-spacing: 0.5px;
}
.login-brand-aqua {
  color: #00d4aa;
}
.login-brand-future {
  color: #e0e8f0;
}
.login-brand-sub {
  margin: 0; font-size: 0.72rem;
  color: rgba(160,200,240,0.35);
  letter-spacing: 2.5px; text-transform: uppercase;
}

/* Tabs */
.login-tabs {
  display: flex; width: 100%; max-width: 400px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px; padding: 3px;
  margin-bottom: 22px;
  border: 1px solid rgba(255,255,255,0.06);
}
.login-tab {
  flex: 1; padding: 9px; border: none;
  border-radius: 9px; cursor: pointer;
  font-weight: 600; font-size: 0.83rem;
  letter-spacing: 0.3px;
  font-family: 'Inter', sans-serif;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  color: rgba(160,200,240,0.35);
}
.login-tab.active {
  background: rgba(0, 212, 170, 0.1);
  color: #00d4aa;
  box-shadow: inset 0 0 0 1px rgba(0, 212, 170, 0.2);
}
.login-tab:hover:not(.active) {
  color: rgba(160,200,240,0.55);
  background: rgba(255,255,255,0.03);
}

/* Card */
.login-card {
  width: 100%; max-width: 400px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 28px 26px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5),
              0 0 0 1px rgba(0, 212, 170, 0.04),
              0 0 40px rgba(0, 212, 170, 0.03);
  position: relative;
}
.login-card-glow {
  position: absolute; top: 0; left: 18%; right: 18%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 170, 0.4), transparent);
}

/* Fields */
.login-field {
  margin-bottom: 16px;
}
.login-field label {
  display: block; margin-bottom: 6px;
  color: rgba(160,210,240,0.55);
  font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.3px;
}
.login-field input {
  width: 100%; padding: 11px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #c8e8f8;
  font-size: 0.88rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}
.login-field input:focus {
  outline: none;
  border-color: rgba(0, 212, 170, 0.5);
  box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.08),
              inset 0 1px 2px rgba(0,0,0,0.2);
  background: rgba(0, 212, 170, 0.04);
}
.login-field input::placeholder {
  color: rgba(140,190,220,0.22);
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 30px #021a32 inset !important;
  -webkit-text-fill-color: #c8e8f8 !important;
  caret-color: #c8e8f8;
}

.login-pass-wrap {
  position: relative;
}
.login-pass-wrap input {
  padding-right: 42px;
}
.login-eye {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: rgba(160,210,240,0.3); font-size: 0.85rem;
  padding: 4px; line-height: 1;
  transition: color 0.2s;
}
.login-eye:hover {
  color: rgba(160,210,240,0.6);
}

.login-forgot {
  text-align: right; margin-bottom: 20px; margin-top: -6px;
}
.login-forgot a {
  color: rgba(0, 212, 170, 0.55);
  font-size: 0.76rem; text-decoration: none;
  transition: color 0.2s;
}
.login-forgot a:hover {
  color: #00d4aa;
}

.login-error {
  color: rgba(255, 100, 120, 0.85);
  font-size: 0.8rem; margin: -6px 0 14px;
  text-align: center; font-weight: 500;
}

/* Submit */
.login-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #00d4aa, #0b5394);
  border: 1px solid rgba(0, 212, 170, 0.3);
  border-radius: 12px;
  color: #fff; font-weight: 700;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
  box-shadow: 0 4px 24px rgba(0, 212, 170, 0.25),
              0 0 60px rgba(0, 212, 170, 0.08);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.login-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(0, 212, 170, 0.35),
              0 0 80px rgba(0, 212, 170, 0.12);
}
.login-submit:active:not(:disabled) {
  transform: translateY(0);
}
.login-submit:disabled {
  opacity: 0.6; cursor: not-allowed;
}

.login-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* Success */
.login-success {
  text-align: center; padding: 20px 0;
}
.login-success-icon {
  width: 52px; height: 52px; border-radius: 50%;
  margin: 0 auto 16px;
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid rgba(0, 212, 170, 0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 800; color: #00d4aa;
  box-shadow: 0 0 30px rgba(0, 212, 170, 0.15);
}
.login-success h3 {
  font-family: 'Outfit', sans-serif;
  color: #e0f0ff; font-size: 1.15rem;
  margin: 0 0 6px;
}
.login-success p {
  color: rgba(160,200,240,0.45); font-size: 0.85rem;
  margin: 0;
}
.login-progress-track {
  margin-top: 20px; height: 2px;
  background: rgba(255,255,255,0.05);
  border-radius: 2px; overflow: hidden;
}
.login-progress-bar {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, #00d4aa, #0b5394);
  animation: progressGrow 1.5s ease-out forwards;
}

.login-legal {
  margin-top: 22px;
  color: rgba(140,180,210,0.2);
  font-size: 0.7rem; text-align: center;
}

/* Animations */
@keyframes pulseDot {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px #00d4aa; }
  50% { opacity: 0.3; box-shadow: 0 0 2px #00d4aa; }
}
@keyframes progressGrow {
  from { width: 0; } to { width: 100%; }
}
@keyframes spin {
  from { transform: rotate(0deg); } to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .login-root { flex-direction: column; }
  .login-aquarium { flex: 0 0 40%; }
  .login-panel { flex: 0 0 60%; padding: 24px; }
  .login-brand { margin-bottom: 20px; }
  .login-brand-name { font-size: 1.3rem; }
  .login-card { padding: 22px 20px; }
}
`;
