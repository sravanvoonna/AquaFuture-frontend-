import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleMouse = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const lightRays = Array.from({ length: 8 }, (_, i) => ({
    left: `${10 + i * 12}%`,
    width: `${Math.random() * 4 + 2}px`,
    animationDelay: `${i * 0.8}s`,
    animationDuration: `${6 + Math.random() * 4}s`,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  const handleCreatureClick = (type) => {
    const event = new CustomEvent('open-cultivation-planner', { detail: type });
    window.dispatchEvent(event);
  };

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Ambient Light Rays Overlay */}
      <div className="hero-light-rays">
        {lightRays.map((ray, i) => (
          <div
            key={i}
            className="light-ray"
            style={{
              left: ray.left,
              width: ray.width,
              animationDelay: ray.animationDelay,
              animationDuration: ray.animationDuration,
              opacity: ray.opacity,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-grid">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="line1">{t('hero.title1')}</span>
              <br />
              <span className="highlight">{t('hero.highlight')}</span>
            </h1>

            <p className="hero-description">
              {t('hero.description')}
            </p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
                {t('hero.explore')}
                <span>→</span>
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
                <span>▶</span>
                {t('hero.watchDemo')}
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">{t('hero.farms')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">98.5%</div>
                <div className="hero-stat-label">{t('hero.survivalRate')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">40%</div>
                <div className="hero-stat-label">{t('hero.yieldIncrease')}</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-aquarium">
              {/* Premium ambient decorative elements in hero visual box */}
              <div
                className="hero-creature-btn"
                title="Launch Fish Cultivation Planner"
                onClick={() => handleCreatureClick('fish')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '6rem',
                  animation: 'float-gentle 4s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.4))',
                  zIndex: 5,
                }}
              >
                🐟
              </div>
              <div
                className="hero-creature-btn"
                title="Launch Shrimp Cultivation Planner"
                onClick={() => handleCreatureClick('shrimp')}
                style={{
                  position: 'absolute',
                  top: '30%',
                  left: '25%',
                  fontSize: '3rem',
                  animation: 'float-gentle 3s ease-in-out infinite 0.5s',
                  filter: 'drop-shadow(0 0 20px rgba(0, 212, 170, 0.3))',
                }}
              >
                🦐
              </div>
              <div
                className="hero-creature-btn"
                title="Launch Mud Crab Cultivation Planner"
                onClick={() => handleCreatureClick('crab')}
                style={{
                  position: 'absolute',
                  top: '65%',
                  left: '70%',
                  fontSize: '3.5rem',
                  animation: 'float-gentle 3.5s ease-in-out infinite 1s',
                  filter: 'drop-shadow(0 0 20px rgba(123, 104, 238, 0.3))',
                }}
              >
                🦞
              </div>
              <div
                className="hero-creature-btn"
                title="Launch Fish Cultivation Planner"
                onClick={() => handleCreatureClick('fish')}
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '65%',
                  fontSize: '2.5rem',
                  animation: 'float-gentle 4.5s ease-in-out infinite 0.8s',
                  filter: 'drop-shadow(0 0 15px rgba(0, 245, 200, 0.3))',
                }}
              >
                🐠
              </div>
              <div
                className="hero-creature-btn"
                title="Launch Mud Crab Cultivation Planner"
                onClick={() => handleCreatureClick('crab')}
                style={{
                  position: 'absolute',
                  top: '75%',
                  left: '30%',
                  fontSize: '2rem',
                  animation: 'float-gentle 3.8s ease-in-out infinite 1.5s',
                  filter: 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.3))',
                }}
              >
                🦀
              </div>
              <div
                className="hero-creature-btn"
                title="Launch Seaweed Cultivation Planner"
                onClick={() => handleCreatureClick('seaweed')}
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  fontSize: '2.5rem',
                  animation: 'float-gentle 5s ease-in-out infinite 2s',
                }}
              >
                🪸
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
