import { useMemo } from 'react';

export default function ParticlesOverlay() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
      drift: (Math.random() - 0.5) * 100,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div className="particles-overlay">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
