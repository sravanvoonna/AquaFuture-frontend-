import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

          <button className="nav-cta" onClick={(e) => handleLinkClick(e, '#contact')}>
            {t('navbar.aiAdvisor')}
          </button>
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
