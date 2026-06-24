import { useState, useEffect } from 'react';

export default function DepthScale() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollPercent(window.scrollY / docHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial call
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const depth = Math.round(scrollPercent * 2000);
  
  // Calculate Ocean Zone details based on current depth
  let zoneName = 'Sunlight Zone';
  let zoneSub = 'Photic Zone';
  if (depth > 1800) {
    zoneName = 'Hadal Trench';
    zoneSub = 'The Trenches';
  } else if (depth > 1200) {
    zoneName = 'Abyssal Zone';
    zoneSub = 'The Abyss';
  } else if (depth > 600) {
    zoneName = 'Midnight Zone';
    zoneSub = 'Bathypelagic';
  } else if (depth > 150) {
    zoneName = 'Twilight Zone';
    zoneSub = 'Mesopelagic';
  }

  return (
    <>
      {/* Desktop Vertical Depth Ruler (left side) */}
      <div className="depth-scale-desktop">
        <div className="depth-ruler-track">
          <div 
            className="depth-ruler-fill" 
            style={{ height: `${scrollPercent * 100}%` }}
          />
          <div 
            className="depth-ruler-bubble"
            style={{ top: `${scrollPercent * 100}%` }}
          >
            <span className="bubble-glow" />
            🫧
            
            <div className="depth-info-box">
              <div className="depth-digital-meter">
                {depth}
                <span className="depth-unit">m</span>
              </div>
              <div className="depth-zone-tag">{zoneName}</div>
              <div className="depth-zone-sub">{zoneSub}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Glass Badge (fixed top-left under navbar) */}
      <div className="depth-scale-mobile">
        <span className="mobile-bubble-icon">🫧</span>
        <span className="mobile-depth-meter">{depth}m</span>
        <span className="mobile-zone-tag">{zoneName}</span>
      </div>
    </>
  );
}
