import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Diving into the depths...');

  useEffect(() => {
    const texts = [
      'Diving into the depths...',
      'Discovering marine life...',
      'Calibrating sensors...',
      'Initializing ecosystem...',
      'Welcome to AquaFuture'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 600);
          return 100;
        }
        const textIndex = Math.min(Math.floor(next / 25), texts.length - 1);
        setText(texts[textIndex]);
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 30 + 10,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
    drift: (Math.random() - 0.5) * 80,
  }));

  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="loading-bubbles">
        {bubbles.map(b => (
          <div
            key={b.id}
            className="loading-bubble"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--drift': `${b.drift}px`,
            }}
          />
        ))}
      </div>
      <div className="loading-logo">🌊 AquaFuture</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-text">{text}</div>
    </div>
  );
}
