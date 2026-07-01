import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Fish class for canvas simulation ─────────────────────────────────────────
class Fish {
  constructor(canvasW, canvasH, index) {
    this.id = index;
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = 18 + Math.random() * 22;
    this.color = this.randomColor();
    this.tailAngle = 0;
    this.tailSpeed = 0.12 + Math.random() * 0.1;
    this.targetX = canvasW / 2;
    this.targetY = canvasH / 2;
    this.state = 'idle'; // idle | follow | scatter | celebrate
    this.scatterVx = 0;
    this.scatterVy = 0;
    this.angle = 0;
    this.opacity = 0.85 + Math.random() * 0.15;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.celebrateAngle = (index / 8) * Math.PI * 2;
    this.stripeColor = this.lighten(this.color);
    this.eyeColor = '#fff';
    this.lag = 0.02 + Math.random() * 0.04;
    this.lastDirX = 1;
  }

  randomColor() {
    const colors = [
      '#FF6B35', '#FFB347', '#FF4081', '#E040FB',
      '#40C4FF', '#69F0AE', '#FFEB3B', '#F06292',
      '#4FC3F7', '#AED581', '#FF8A65', '#CE93D8'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  lighten(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, 0.5)`;
  }

  update(cursor, mode) {
    this.tailAngle += this.tailSpeed;

    if (mode === 'scatter') {
      this.state = 'scatter';
    } else if (mode === 'celebrate') {
      this.state = 'celebrate';
    } else if (cursor) {
      this.state = 'follow';
      this.targetX = cursor.x;
      this.targetY = cursor.y;
    } else {
      this.state = 'idle';
    }

    if (this.state === 'follow') {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 30) {
        this.vx += dx * this.lag;
        this.vy += dy * this.lag;
      }
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const maxSpeed = 4;
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
    } else if (this.state === 'scatter') {
      if (this.scatterVx === 0 && this.scatterVy === 0) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 6;
        this.scatterVx = Math.cos(angle) * speed;
        this.scatterVy = Math.sin(angle) * speed;
      }
      this.vx = this.vx * 0.85 + this.scatterVx * 0.15;
      this.vy = this.vy * 0.85 + this.scatterVy * 0.15;
      this.scatterVx *= 0.95;
      this.scatterVy *= 0.95;
    } else if (this.state === 'celebrate') {
      this.celebrateAngle += 0.04;
      const radius = 80 + (this.id % 3) * 40;
      const cx = this.canvasW / 2;
      const cy = this.canvasH / 2;
      const tx = cx + Math.cos(this.celebrateAngle) * radius;
      const ty = cy + Math.sin(this.celebrateAngle) * radius;
      this.vx += (tx - this.x) * 0.08;
      this.vy += (ty - this.y) * 0.08;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 5) { this.vx = this.vx / speed * 5; this.vy = this.vy / speed * 5; }
    } else {
      // idle: gentle wandering
      this.vx += (Math.random() - 0.5) * 0.15;
      this.vy += (Math.random() - 0.5) * 0.15;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const maxIdle = 1.8;
      if (speed > maxIdle) { this.vx = this.vx / speed * maxIdle; this.vy = this.vy / speed * maxIdle; }
    }

    // dampen scatter state
    if (this.state !== 'scatter') {
      this.scatterVx = 0;
      this.scatterVy = 0;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    const margin = this.size;
    if (this.x < margin) { this.x = margin; this.vx = Math.abs(this.vx); }
    if (this.x > this.canvasW - margin) { this.x = this.canvasW - margin; this.vx = -Math.abs(this.vx); }
    if (this.y < margin) { this.y = margin; this.vy = Math.abs(this.vy); }
    if (this.y > this.canvasH - margin) { this.y = this.canvasH - margin; this.vy = -Math.abs(this.vy); }

    if (Math.abs(this.vx) > 0.1) this.lastDirX = this.vx > 0 ? 1 : -1;
    this.angle = Math.atan2(this.vy, this.vx);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const s = this.size;
    const tail = Math.sin(this.tailAngle) * s * 0.4;

    // Tail
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, 0);
    ctx.lineTo(-s * 0.9, -s * 0.35 + tail);
    ctx.lineTo(-s * 0.9, s * 0.35 + tail);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.6, s * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Stripe
    ctx.beginPath();
    ctx.ellipse(s * 0.05, 0, s * 0.22, s * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.stripeColor;
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(s * 0.38, -s * 0.1, s * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.4, -s * 0.1, s * 0.055, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();

    // Fin
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.3);
    ctx.lineTo(s * 0.2, -s * 0.55);
    ctx.lineTo(s * 0.4, -s * 0.3);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity * 0.6;
    ctx.fill();

    ctx.restore();
  }
}

// ─── Bubble class ─────────────────────────────────────────────────────────────
class Bubble {
  constructor(canvasW, canvasH) {
    this.reset(canvasW, canvasH);
  }
  reset(canvasW, canvasH) {
    this.x = Math.random() * canvasW;
    this.y = canvasH + 10;
    this.r = 2 + Math.random() * 6;
    this.speed = 0.4 + Math.random() * 0.8;
    this.wobble = Math.random() * Math.PI * 2;
    this.canvasH = canvasH;
    this.canvasW = canvasW;
  }
  update() {
    this.y -= this.speed;
    this.wobble += 0.05;
    this.x += Math.sin(this.wobble) * 0.4;
    if (this.y < -this.r * 2) this.reset(this.canvasW, this.canvasH);
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(180, 240, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(180, 240, 255, 0.1)';
    ctx.fill();
    ctx.restore();
  }
}

// ─── LoginPage component ───────────────────────────────────────────────────────
export default function LoginPage({ onEnterSite }) {
  const canvasRef = useRef(null);
  const fishRef = useRef([]);
  const bubblesRef = useRef([]);
  const cursorRef = useRef(null);
  const modeRef = useRef('idle');
  const animRef = useRef(null);

  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      fishRef.current = Array.from({ length: 10 }, (_, i) =>
        new Fish(canvas.width, canvas.height, i)
      );
      bubblesRef.current = Array.from({ length: 18 }, () =>
        new Bubble(canvas.width, canvas.height)
      );
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Track cursor inside aquarium
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    cursorRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    cursorRef.current = null;
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawBackground = () => {
      // Deep ocean gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#021729');
      grad.addColorStop(0.4, '#032947');
      grad.addColorStop(0.8, '#031f36');
      grad.addColorStop(1, '#020d18');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light rays from top
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + canvas.width / 10;
        const rayGrad = ctx.createLinearGradient(x, 0, x + 30, canvas.height * 0.7);
        rayGrad.addColorStop(0, 'rgba(0, 180, 255, 0.06)');
        rayGrad.addColorStop(1, 'rgba(0, 180, 255, 0)');
        ctx.beginPath();
        ctx.moveTo(x - 8, 0);
        ctx.lineTo(x + 45, canvas.height * 0.7);
        ctx.lineTo(x + 30, canvas.height * 0.7);
        ctx.lineTo(x - 20, 0);
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }

      // Sandy bottom
      const sandGrad = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
      sandGrad.addColorStop(0, 'rgba(180, 140, 80, 0)');
      sandGrad.addColorStop(0.5, 'rgba(180, 140, 80, 0.3)');
      sandGrad.addColorStop(1, 'rgba(160, 120, 60, 0.6)');
      ctx.fillStyle = sandGrad;
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

      // Seaweed
      drawSeaweed(ctx, canvas.width * 0.1, canvas.height);
      drawSeaweed(ctx, canvas.width * 0.3, canvas.height);
      drawSeaweed(ctx, canvas.width * 0.6, canvas.height);
      drawSeaweed(ctx, canvas.width * 0.85, canvas.height);

      // Corals
      drawCoral(ctx, canvas.width * 0.05, canvas.height - 55, '#FF4081');
      drawCoral(ctx, canvas.width * 0.45, canvas.height - 55, '#FF8C00');
      drawCoral(ctx, canvas.width * 0.75, canvas.height - 55, '#9C27B0');

      // Water surface shimmer
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(
          (canvas.width / 6) * i + canvas.width / 12,
          4,
          canvas.width / 18,
          3,
          0, 0, Math.PI * 2
        );
        ctx.fillStyle = 'rgba(100, 210, 255, 0.12)';
        ctx.fill();
      }
    };

    const drawSeaweed = (ctx, x, baseY) => {
      const now = Date.now() / 1000;
      const h = 60 + Math.random() * 20;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        const sway = Math.sin(now * 1.5 + x * 0.05 + i * 0.5) * 8;
        ctx.quadraticCurveTo(x + sway + 5, baseY - h * t - 4, x + sway, baseY - h * t);
      }
      ctx.strokeStyle = `rgba(0, 180, 100, 0.7)`;
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    const drawCoral = (ctx, x, y, color) => {
      const branches = 5;
      for (let i = 0; i < branches; i++) {
        const angle = ((i / branches) * Math.PI) - Math.PI / 2;
        const len = 20 + Math.random() * 15;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * len, y + Math.sin(angle) * len, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();

      bubblesRef.current.forEach(b => { b.update(); b.draw(ctx); });
      fishRef.current.forEach(f => {
        f.update(cursorRef.current, modeRef.current);
        f.draw(ctx);
      });

      // Cursor glow
      if (cursorRef.current) {
        const grd = ctx.createRadialGradient(
          cursorRef.current.x, cursorRef.current.y, 0,
          cursorRef.current.x, cursorRef.current.y, 40
        );
        grd.addColorStop(0, 'rgba(0, 212, 170, 0.25)');
        grd.addColorStop(1, 'rgba(0, 212, 170, 0)');
        ctx.beginPath();
        ctx.arc(cursorRef.current.x, cursorRef.current.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handlePasswordFocus = () => { modeRef.current = 'scatter'; };
  const handlePasswordBlur = () => { modeRef.current = cursorRef.current ? 'follow' : 'idle'; };
  const handleInputFocus = () => { modeRef.current = cursorRef.current ? 'follow' : 'idle'; };

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
    if (signupData.password !== signupData.confirm) {
      setError('Passwords do not match.'); return;
    }
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

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#010d1a',
    }}>
      {/* LEFT — Aquarium */}
      <div style={{
        flex: '0 0 50%',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(0, 212, 170, 0.15)',
      }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />

        {/* Aquarium title overlay */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '12px 18px',
            border: '1px solid rgba(0, 212, 170, 0.2)',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#00d4aa', boxShadow: '0 0 8px #00d4aa',
              animation: 'aquaPulse 2s ease infinite',
            }} />
            <span style={{ color: '#00d4aa', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              AquaFuture Live
            </span>
            <span style={{ color: 'rgba(180,220,255,0.5)', fontSize: '0.78rem', marginLeft: 'auto' }}>
              🐠 10 species active
            </span>
          </div>
        </div>

        {/* Hint label */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 212, 170, 0.2)',
            borderRadius: '30px',
            padding: '8px 20px',
            color: 'rgba(180, 240, 255, 0.75)',
            fontSize: '0.78rem',
            letterSpacing: '0.5px',
          }}>
            🖱️ Move cursor to guide fish · 🔑 Type password to scatter them
          </div>
        </div>

        {/* Brand watermark */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '3px',
            color: 'rgba(0, 212, 170, 0.35)',
            textTransform: 'uppercase',
          }}>AquaFuture</span>
        </div>
      </div>

      {/* RIGHT — Auth Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #010d1a 0%, #021729 60%, #010f20 100%)',
        padding: '40px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorative bubbles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${20 + i * 12}px`,
            height: `${20 + i * 12}px`,
            borderRadius: '50%',
            border: '1px solid rgba(0, 212, 170, 0.08)',
            top: `${10 + i * 11}%`,
            left: `${5 + i * 10}%`,
            animation: `floatBubble ${5 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '2.4rem',
            marginBottom: '6px',
          }}>🐟</div>
          <h1 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 800,
            letterSpacing: '2px',
            background: 'linear-gradient(90deg, #00d4aa, #4fc3f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>AquaFuture</h1>
          <p style={{
            margin: '4px 0 0',
            color: 'rgba(180,220,255,0.5)',
            fontSize: '0.82rem',
            letterSpacing: '1.5px',
          }}>SMART AQUACULTURE PLATFORM</p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '28px',
          border: '1px solid rgba(0,212,170,0.12)',
        }}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSubmitted(false); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '9px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
                letterSpacing: '0.5px',
                transition: 'all 0.25s',
                background: tab === t
                  ? 'linear-gradient(90deg, #00d4aa, #4fc3f7)'
                  : 'transparent',
                color: tab === t ? '#011124' : 'rgba(180,220,255,0.5)',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 212, 170, 0.15)',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Card top glow */}
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)',
            borderRadius: '2px',
          }} />

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ color: '#00d4aa', margin: '0 0 8px', fontSize: '1.3rem' }}>
                {tab === 'login' ? 'Welcome back!' : 'Account Created!'}
              </h3>
              <p style={{ color: 'rgba(180,220,255,0.6)', margin: 0, fontSize: '0.9rem' }}>
                {tab === 'login' ? 'Entering the platform...' : 'Switching to sign in...'}
              </p>
              <div style={{
                marginTop: '20px',
                height: '3px',
                background: 'rgba(0,212,170,0.15)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #00d4aa, #4fc3f7)',
                  borderRadius: '4px',
                  animation: 'progressBar 1.5s linear forwards',
                }} />
              </div>
            </div>
          ) : tab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  onFocus={handleInputFocus}
                  required
                  style={inputStyle}
                  onMouseOver={e => e.target.style.borderColor = 'rgba(0,212,170,0.5)'}
                  onMouseOut={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(180,220,255,0.5)', fontSize: '1rem',
                    }}
                  >{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: '22px' }}>
                <a href="#" style={{ color: '#00d4aa', fontSize: '0.8rem', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>

              {error && <p style={{ color: '#ff4081', fontSize: '0.83rem', margin: '-10px 0 16px', textAlign: 'center' }}>{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                style={submitBtnStyle(isSubmitting)}
              >
                {isSubmitting ? '🐠 Verifying...' : 'Sign In →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                  onFocus={handleInputFocus}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                  onFocus={handleInputFocus}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={signupData.password}
                    onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(180,220,255,0.5)', fontSize: '1rem',
                    }}
                  >{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div style={{ marginBottom: '22px' }}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={signupData.confirm}
                  onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  required
                  style={inputStyle}
                />
              </div>

              {error && <p style={{ color: '#ff4081', fontSize: '0.83rem', margin: '-10px 0 16px', textAlign: 'center' }}>{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                style={submitBtnStyle(isSubmitting)}
              >
                {isSubmitting ? '🐠 Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p style={{
          marginTop: '24px',
          color: 'rgba(180,220,255,0.3)',
          fontSize: '0.76rem',
          textAlign: 'center',
        }}>
          By signing in, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>

      {/* Global keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @keyframes aquaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes floatBubble {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        input:focus {
          outline: none !important;
          border-color: rgba(0, 212, 170, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: 'rgba(180,220,255,0.7)',
  fontSize: '0.82rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#e0f8ff',
  fontSize: '0.93rem',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const submitBtnStyle = (disabled) => ({
  width: '100%',
  padding: '14px',
  background: disabled
    ? 'rgba(0,212,170,0.4)'
    : 'linear-gradient(90deg, #00d4aa, #4fc3f7)',
  border: 'none',
  borderRadius: '12px',
  color: '#011124',
  fontWeight: 800,
  fontSize: '0.95rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.25s',
  letterSpacing: '0.5px',
  boxShadow: disabled ? 'none' : '0 4px 20px rgba(0, 212, 170, 0.35)',
});
