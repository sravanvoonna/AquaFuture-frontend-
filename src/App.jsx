import { useState, useEffect, useRef, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import SpeciesGallery from './components/SpeciesGallery';
import Technology from './components/Technology';
import Stats from './components/Stats';
import AquaTools from './components/AquaTools';
import PricePlanner from './components/PricePlanner';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticlesOverlay from './components/ParticlesOverlay';
import UnderwaterCanvas from './components/UnderwaterCanvas';
import DepthScale from './components/DepthScale';
import BackToTop from './components/BackToTop';
import {
  getCurrentUser,
  clearToken,
  refreshToken,
  secondsRemaining,
  loadToken,
  parseToken,
} from './utils/auth';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARN_AT_SECS = 60;                 // show warning toast at 60 s remaining

function App() {
  const [user, setUser] = useState(null);          // { name, email } or null
  const [showToast, setShowToast] = useState(false); // inactivity warning toast
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef(null);
  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState(0);

  // ── On mount: restore session from stored JWT ────────────────────────────
  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) setUser({ name: stored.name, email: stored.email });
  }, []);

  // ── Activity tracking + idle timer ──────────────────────────────────────
  const resetIdle = useCallback(() => {
    lastActivity.current = Date.now();
    refreshToken();
    setShowToast(false);
    clearInterval(countdownRef.current);
  }, []);

  const logout = useCallback((reason = 'manual') => {
    clearToken();
    setUser(null);
    setShowToast(false);
    clearInterval(countdownRef.current);
    clearInterval(idleTimer.current);
    if (reason === 'timeout') {
      // brief flash message handled by toast system
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Register activity listeners
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(ev => window.addEventListener(ev, resetIdle, { passive: true }));

    // Poll every 10 s to check session health
    idleTimer.current = setInterval(() => {
      const secs = secondsRemaining();
      if (secs <= 0) {
        logout('timeout');
        return;
      }
      if (secs <= WARN_AT_SECS) {
        setShowToast(true);
        setCountdown(secs);
        // tick-down every second
        clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              logout('timeout');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 10_000);

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetIdle));
      clearInterval(idleTimer.current);
      clearInterval(countdownRef.current);
    };
  }, [user, resetIdle, logout]);

  const handleLogin = (u) => setUser(u);

  const authenticated = !!user;

  return (
    <>
      {/* Login overlay */}
      {!authenticated && (
        <LoginPage onEnterSite={handleLogin} />
      )}

      {/* Main site — always mounted, hidden until auth */}
      <div style={{ display: authenticated ? 'block' : 'none' }}>
        <div className="global-bg-gradient" />
        <UnderwaterCanvas />
        <ParticlesOverlay />
        <DepthScale />
        <Navbar user={user} onLogout={() => logout('manual')} />
        <main>
          <Hero />
          <About />
          <Services />
          <SpeciesGallery />
          <Technology />
          <Stats />
          <AquaTools />
          <PricePlanner />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>

      {/* ── Inactivity warning toast ── */}
      {showToast && authenticated && (
        <div style={toastStyle}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <div>
            <strong style={{ color: '#ffd700', fontSize: '0.85rem' }}>Session expiring</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
              Auto-logout in <strong style={{ color: '#ff8a65' }}>{countdown}s</strong>
            </p>
          </div>
          <button onClick={resetIdle} style={stayBtnStyle}>Stay logged in</button>
        </div>
      )}
    </>
  );
}

export default App;

const toastStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(10, 20, 35, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 165, 0, 0.35)',
  borderRadius: '14px',
  padding: '14px 18px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,165,0,0.1)',
  animation: 'slideInToast 0.3s cubic-bezier(0.4,0,0.2,1)',
  minWidth: '280px',
};

const stayBtnStyle = {
  marginLeft: 'auto',
  padding: '7px 14px',
  background: 'linear-gradient(135deg, #00d4aa, #0b5394)',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.78rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: 'Inter, sans-serif',
};
