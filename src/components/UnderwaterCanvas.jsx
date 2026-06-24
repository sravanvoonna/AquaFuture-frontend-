import { useEffect, useRef } from 'react';

export default function UnderwaterCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse and touch tracking variables
    let mouseX = -1000;
    let mouseY = -1000;
    const ripples = [];

    // Ripple effect class (snappy expanding physical shockwave)
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 280;
        this.speed = 9.0; // Increased speed from 4.5 to 9.0 for responsive snap
        this.opacity = 1;
        this.force = 18; // Push strength
      }
      update() {
        this.radius += this.speed;
        this.opacity = 1 - (this.radius / this.maxRadius);
      }
      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, Math.max(0, this.radius - 6),
          this.x, this.y, this.radius + 6
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `rgba(0, 245, 200, ${this.opacity * 0.4})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Bubble particles
    class Bubble {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.radius = Math.random() * 5 + 1.5;
        this.speed = Math.random() * 1.2 + 0.4;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.wobbleAmp = Math.random() * 30 + 10;
        this.opacity = Math.random() * 0.18 + 0.05;
        this.phase = Math.random() * Math.PI * 2;
      }
      update(time) {
        this.y -= this.speed;
        this.x += Math.sin(time * this.wobbleSpeed + this.phase) * 0.4;
        
        // Subtle interaction: bubbles push away very subtly from mouse
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const force = (80 - dist) * 0.04;
            this.x += (dx / dist) * force;
          }
        }
        
        if (this.y < -20) this.reset();
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
        ctx.fill();
        // Highlight
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    // Floating plankton / bioluminescent specks (attracted to light)
    class Speck {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.3 + 0.08;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        const colors = [
          [0, 229, 255],
          [0, 212, 170],
          [123, 104, 238],
          [0, 245, 200],
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;

        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            this.x += (dx / dist) * 0.3;
            this.y += (dy / dist) * 0.3;
          }
        }

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }
      draw(ctx) {
        const glowOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${glowOpacity})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${glowOpacity * 0.12})`;
        ctx.fill();
      }
    }

    // Boids Schooling / Flocking Creature class with dynamic separation & opacity adjustments
    class Boid {
      constructor(x, y, emoji, size, speed, type) {
        this.x = x;
        this.y = y;
        const dir = type === 'fish' || type === 'whale' ? 1 : -1;
        this.vx = dir * (Math.random() * 0.7 + 0.3) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.emoji = emoji;
        this.size = size;
        this.maxSpeed = speed;
        this.minSpeed = speed * 0.4;
        this.type = type;
        this.panicked = false;
      }

      update(boids) {
        let alignmentX = 0, alignmentY = 0;
        let cohesionX = 0, cohesionY = 0;
        let separationX = 0, separationY = 0;
        let neighborCount = 0;

        const visualRange = 140;
        const minDistance = 55; // Separation distance threshold

        for (let other of boids) {
          if (other !== this && other.type === this.type) {
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < visualRange) {
              cohesionX += other.x;
              cohesionY += other.y;

              alignmentX += other.vx;
              alignmentY += other.vy;

              // --- PREMIUM SEPARATION REPAIR ---
              // Force is inversely proportional to distance, stopping overlaps
              if (dist < minDistance && dist > 0) {
                const force = (minDistance - dist) * 0.5;
                separationX += (this.x - other.x) * force;
                separationY += (this.y - other.y) * force;
              }

              neighborCount++;
            }
          }
        }

        if (neighborCount > 0) {
          cohesionX /= neighborCount;
          cohesionY /= neighborCount;
          this.vx += (cohesionX - this.x) * 0.002;
          this.vy += (cohesionY - this.y) * 0.002;

          alignmentX /= neighborCount;
          alignmentY /= neighborCount;
          this.vx += (alignmentX - this.vx) * 0.012;
          this.vy += (alignmentY - this.vy) * 0.012;
        }

        // Apply separation steering forces
        this.vx += separationX * 0.12;
        this.vy += separationY * 0.12;

        // --- INTERACTIVE FEATURE 1: Cursor Scattering (Mouse Repel) ---
        this.panicked = false;
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            this.panicked = true;
            const forceStrength = (150 - dist) * 0.18;
            this.vx += (dx / dist) * forceStrength;
            this.vy += (dy / dist) * forceStrength;
            
            this.vx += (Math.random() - 0.5) * 0.5;
            this.vy += (Math.random() - 0.5) * 0.5;
          }
        }

        // --- INTERACTIVE FEATURE 1.5: Ripple Physical Pushing ---
        ripples.forEach(ripple => {
          const rDx = this.x - ripple.x;
          const rDy = this.y - ripple.y;
          const rDist = Math.sqrt(rDx * rDx + rDy * rDy);
          const rippleThickness = 45;

          if (Math.abs(rDist - ripple.radius) < rippleThickness) {
            const pushStrength = (1 - (ripple.radius / ripple.maxRadius)) * ripple.force;
            if (rDist > 0) {
              this.vx += (rDx / rDist) * pushStrength;
              this.vy += (rDy / rDist) * pushStrength;
              this.panicked = true;
            }
          }
        });

        // Species behaviors
        if (this.type === 'aibot') {
          // AI bot floats around gently in the middle depth
          this.vx += (Math.random() - 0.5) * 0.05;
          this.vy += (Math.random() - 0.5) * 0.05;
          
          // Keep it near the middle-ish depth (e.g. 30% to 70% screen depth)
          if (this.y < height * 0.3) this.vy += 0.03;
          if (this.y > height * 0.7) this.vy -= 0.03;
          
          // Gently guide horizontal speed
          if (Math.abs(this.vx) < 0.2) this.vx += (this.vx > 0 ? 0.05 : -0.05);
        } else if (this.type === 'fish') {
          this.vx += 0.035;
          this.vy += Math.sin(this.x * 0.004) * 0.015;
        } else if (this.type === 'shrimp') {
          this.vx -= 0.025;
          this.vy += (Math.random() - 0.5) * 0.06;
          if (Math.random() < 0.01) {
            this.vy -= (Math.random() * 1.2 + 0.3);
          }
        } else if (this.type === 'squid') {
          this.vy -= 0.015;
          this.vx += Math.sin(this.y * 0.008) * 0.025;
          if (this.vy > 0.15) this.vy -= 0.015;
        } else if (this.type === 'whale') {
          this.vx += 0.006;
          this.vy += Math.sin(this.x * 0.002) * 0.003;
        }

        this.vx += (Math.random() - 0.5) * 0.06;
        this.vy += (Math.random() - 0.5) * 0.06;

        // Apply speed limits (higher speed if panicked/scattering)
        const currentMaxSpeed = this.panicked ? this.maxSpeed * 2.0 : this.maxSpeed;
        const currentMinSpeed = this.minSpeed;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (speed > currentMaxSpeed) {
          this.vx = (this.vx / speed) * currentMaxSpeed;
          this.vy = (this.vy / speed) * currentMaxSpeed;
        } else if (speed < currentMinSpeed && speed > 0) {
          this.vx = (this.vx / speed) * currentMinSpeed;
          this.vy = (this.vy / speed) * currentMinSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        const margin = 100;
        if (this.x < -margin) {
          this.x = width + margin;
          this.y = Math.random() * height;
        }
        if (this.x > width + margin) {
          this.x = -margin;
          this.y = Math.random() * height;
        }
        if (this.y < -margin) {
          this.y = height + margin;
          this.x = Math.random() * width;
        }
        if (this.y > height + margin) {
          this.y = -margin;
          this.x = Math.random() * width;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const angle = Math.atan2(this.vy, this.vx);

        if (this.type === 'aibot') {
          // Aibot stays upright and floats with a gentle wobbly rotate
          const wobble = Math.sin(time * 0.05) * 0.12;
          ctx.rotate(wobble);
        } else if (this.vx >= 0) {
          ctx.scale(-1, 1);
          let tilt = -angle;
          tilt = Math.max(-0.4, Math.min(0.4, tilt));
          ctx.rotate(tilt);
        } else {
          let tilt = angle - Math.PI;
          if (tilt < -Math.PI) tilt += 2 * Math.PI;
          if (tilt > Math.PI) tilt -= 2 * Math.PI;
          tilt = Math.max(-0.4, Math.min(0.4, tilt));
          ctx.rotate(tilt);
        }

        ctx.font = `${this.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // --- PREMIUM TRANSPARENCY AND SPOTLIGHT INTEGRATION ---
        let targetAlpha = this.type === 'aibot' ? 0.90 : 0.22;
        
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 160) {
            ctx.shadowColor = this.type === 'aibot' ? 'rgba(0, 255, 230, 1.0)' : 'rgba(0, 255, 230, 0.9)';
            ctx.shadowBlur = this.type === 'aibot' ? 25 : 15;
            targetAlpha = this.type === 'aibot' ? 1.0 : 0.70;
          } else {
            ctx.shadowColor = this.type === 'aibot' ? 'rgba(0, 245, 200, 0.5)' : 'rgba(0, 229, 255, 0.15)';
            ctx.shadowBlur = this.type === 'aibot' ? 15 : 4;
          }
        } else {
          ctx.shadowColor = this.type === 'aibot' ? 'rgba(0, 245, 200, 0.5)' : 'rgba(0, 229, 255, 0.15)';
          ctx.shadowBlur = this.type === 'aibot' ? 15 : 4;
        }
        
        if (this.panicked) {
          targetAlpha = Math.max(targetAlpha, 0.55);
        }
        
        ctx.globalAlpha = targetAlpha;
        ctx.fillText(this.emoji, 0, 0);

        // Draw helper label above the AI bot
        if (this.type === 'aibot') {
          ctx.save();
          // Undo the parent wobble rotation for text label so it remains flat/readable
          const wobble = Math.sin(time * 0.05) * 0.12;
          ctx.rotate(-wobble);
          
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#00f5c8';
          ctx.shadowColor = 'rgba(0, 245, 200, 0.8)';
          ctx.shadowBlur = 8;
          ctx.fillText('AI Advisor 💬', 0, -this.size * 0.75);
          ctx.restore();
        }

        ctx.restore();
      }
    }

    // Initialize systems - OPTIMIZED COUNTS for premium visual spacing
    const bubbles = Array.from({ length: 28 }, () => new Bubble()); // Reduced from 45
    const specks = Array.from({ length: 55 }, () => new Speck()); // Reduced from 90
    const boids = [];

    const randRange = (min, max) => Math.random() * (max - min) + min;

    // School 0: AI Bot Boid (Single custom animated creature)
    boids.push(new Boid(
      width / 2,
      height / 2,
      '🤖',
      32, // larger size
      1.5, // gentle speed
      'aibot'
    ));

    // School 1: Fish (Vibrant/normal speed/schooling in groups) - Reduced to 8
    const fishEmojis = ['🐟', '🐠', '🐡'];
    for (let i = 0; i < 8; i++) {
      boids.push(new Boid(
        Math.random() * width,
        Math.random() * height,
        fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
        randRange(18, 26), // Shrunk slightly for visual style
        randRange(1.8, 3.2),
        'fish'
      ));
    }

    // School 2: Shrimp (Small, quick darting, swarm at bottom/mid levels) - Reduced to 5
    for (let i = 0; i < 5; i++) {
      boids.push(new Boid(
        Math.random() * width,
        randRange(height * 0.4, height * 0.95),
        '🦐',
        randRange(13, 19), // Shrunk
        randRange(1.5, 2.8),
        'shrimp'
      ));
    }

    // School 3: Squid & Octopuses & Lobsters (Mid/deep water, slow rising) - Reduced to 4
    const deepEmojis = ['🦑', '🐙', '🦞'];
    for (let i = 0; i < 4; i++) {
      boids.push(new Boid(
        Math.random() * width,
        randRange(height * 0.2, height * 0.9),
        deepEmojis[Math.floor(Math.random() * deepEmojis.length)],
        randRange(22, 28), // Shrunk
        randRange(0.8, 1.6),
        'squid'
      ));
    }

    // School 4: Dolphins & Whales (Big, majestic, deep water, very slow) - Reduced to 2
    const bigEmojis = ['🐋', '🐬'];
    for (let i = 0; i < 2; i++) {
      boids.push(new Boid(
        Math.random() * width,
        randRange(height * 0.15, height * 0.7),
        bigEmojis[Math.floor(Math.random() * bigEmojis.length)],
        randRange(42, 54), // Shrunk for premium balance
        randRange(0.5, 1.2),
        'whale'
      ));
    }

    // Listeners for mouse and touch interactions (bound globally to capture click ripples/scatters anywhere)
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const aibot = boids.find(b => b.type === 'aibot');
      if (aibot) {
        const dx = mouseX - aibot.x;
        const dy = mouseY - aibot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < aibot.size * 1.5) {
          canvas.style.cursor = 'pointer';
          return;
        }
      }
      canvas.style.cursor = 'default';
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      canvas.style.cursor = 'default';
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleMouseDown = (e) => {
      ripples.push(new Ripple(e.clientX, e.clientY));
      
      const aibot = boids.find(b => b.type === 'aibot');
      if (aibot) {
        const dx = e.clientX - aibot.x;
        const dy = e.clientY - aibot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < aibot.size * 2.0) {
          const chatSection = document.getElementById('contact');
          if (chatSection) {
            chatSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        ripples.push(new Ripple(e.touches[0].clientX, e.touches[0].clientY));
        
        const aibot = boids.find(b => b.type === 'aibot');
        if (aibot) {
          const dx = e.touches[0].clientX - aibot.x;
          const dy = e.touches[0].clientY - aibot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < aibot.size * 2.5) {
            const chatSection = document.getElementById('contact');
            if (chatSection) {
              chatSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart);

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Swaying light rays (slightly reduced opacity for visual cleanliness)
      for (let i = 0; i < 5; i++) {
        const x = (width / 6) * (i + 1);
        const sway = Math.sin(time * 0.007 + i * 1.2) * 45;
        const gradient = ctx.createLinearGradient(x + sway, 0, x + sway, height * 0.85);
        gradient.addColorStop(0, `rgba(0, 229, 255, ${0.02 + Math.sin(time * 0.008 + i) * 0.015})`);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(x + sway - 60, 0);
        ctx.lineTo(x + sway + 60, 0);
        ctx.lineTo(x + sway + 120, height * 0.85);
        ctx.lineTo(x + sway - 120, height * 0.85);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Drawing Spotlight Light Cone
      if (mouseX !== -1000 && mouseY !== -1000) {
        ctx.save();
        const spotlight = ctx.createRadialGradient(mouseX, mouseY, 40, mouseX, mouseY, 160);
        spotlight.addColorStop(0, 'rgba(0, 245, 200, 0.07)');
        spotlight.addColorStop(0.5, 'rgba(0, 229, 255, 0.03)');
        spotlight.addColorStop(1, 'transparent');
        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 160, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update & Draw Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw(ctx);
        if (r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Draw Specks & Bubbles
      specks.forEach(s => { s.update(time); s.draw(ctx); });
      bubbles.forEach(b => { b.update(time); b.draw(ctx); });

      // Update & Draw Schooling Creatures
      boids.forEach(b => {
        b.update(boids);
        b.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return <canvas ref={canvasRef} className="global-underwater-canvas" />;
}
