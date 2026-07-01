import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { secondsRemaining } from '../utils/auth';

// Format seconds as MM:SS
const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// Get initials from name
const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export default function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sessionSecs, setSessionSecs] = useState(secondsRemaining());
  const profileRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update session timer every second while dropdown is open (or always tick)
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => setSessionSecs(secondsRemaining()), 1000);
    return () => clearInterval(id);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const links = [
    { key: 'home', href: '#hero' },
    { key: 'about', href: '#about' },
    { key: 'services', href: '#services' },
    { key: 'species', href: '#species' },
    { key: 'technology', href: '#technology' },
    { key: 'tools', href: '#tools' },
    { key: 'savings', href: '#pricing' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    if (onLogout) onLogout();
  };

  // Color the timer red when under 2 min
  const timerColor = sessionSecs <= 120 ? '#ff8a65' : 'var(--aqua-primary)';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="navbar-inner">
        <a href="#hero" className="navbar-brand" onClick={(e) => handleLinkClick(e, '#hero')}>
          <div className="brand-icon">🐟</div>
          <span className="brand-text-aqua">Aqua</span>
          <span className="brand-text-future">Future</span>
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="nav-link"
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {t(`navbar.${link.key}`)}
            </a>
          ))}

          <div className="lang-selector-container">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="lang-selector-select"
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* ── User profile pill ── */}
          {user ? (
            <div className="user-menu-wrap" ref={profileRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-label="User menu"
              >
                <div className="user-initials">{initials(user.name)}</div>
                <span className="user-name-short">{user.name.split(' ')[0]}</span>
                <span className="user-chevron">▼</span>
              </button>

              {profileOpen && (
                <div className="user-dropdown">
                  {/* Header */}
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-avatar">{initials(user.name)}</div>
                    <div className="user-dropdown-name">{user.name}</div>
                    <div className="user-dropdown-email">{user.email}</div>
                  </div>

                  {/* Session timer */}
                  <div className="user-dropdown-session">
                    <div className="session-dot" />
                    <span className="session-label">Session active</span>
                    <span className="session-timer" style={{ color: timerColor }}>
                      {fmtTime(sessionSecs)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="user-dropdown-actions">
                    <button className="user-dropdown-btn" onClick={handleLogout}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-cta" onClick={(e) => handleLinkClick(e, '#contact')}>
              {t('navbar.aiAdvisor')}
            </button>
          )}
        </div>

        <button
          className={`nav-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
