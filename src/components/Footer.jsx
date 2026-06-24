export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-brand">
              <div className="brand-icon">🐟</div>
              <span className="brand-text-aqua">Aqua</span>
              <span className="brand-text-future">Future</span>
            </div>
            <p>
              Next-generation smart aquaculture platform powered by AI, IoT, 
              and blockchain technology. Helping aqua farmers worldwide build 
              sustainable, profitable operations.
            </p>
            <div className="footer-social" style={{ marginTop: '16px' }}>
              <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-link" aria-label="LinkedIn">in</a>
              <a href="#" className="social-link" aria-label="Facebook">f</a>
              <a href="#" className="social-link" aria-label="YouTube">▶</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
            </div>
          </div>

          <div className="footer-column developer-profile-col">
            <h4>Developer Profile</h4>
            <p style={{ fontSize: '0.82rem', color: 'rgba(224, 232, 240, 0.65)', fontWeight: '600', lineHeight: '1.6', margin: '8px 0 0 0', textAlign: 'left' }}>
              Cerevyn Solutions Private Limited
            </p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(224, 232, 240, 0.5)', lineHeight: '1.5', margin: '6px 0 0 0', textAlign: 'left' }}>
              Cerevyn Solutions harnesses the power of artificial intelligence to transform industries, enrich lives, and create intelligent solutions for healthcare, education, and business operations worldwide.
            </p>
          </div>

          <div className="footer-column developer-location-col">
            <h4>Office Location</h4>
            <div style={{ fontSize: '0.78rem', color: 'rgba(224, 232, 240, 0.55)', lineHeight: '1.6', margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <p style={{ display: 'flex', gap: '8px', margin: 0 }}>
                <span>📍</span>
                <span>THub, Knowledge City, Serilingampalle (M), Hyderabad, Telangana 500085</span>
              </p>
              <p style={{ display: 'flex', gap: '8px', margin: 0 }}>
                <span>⏰</span>
                <span>Hours: 9:00 AM - 6:00 PM (Closed · Opens 9 am)</span>
              </p>
            </div>
          </div>

          <div className="footer-column developer-contact-col">
            <h4>Get in Touch</h4>
            <div style={{ fontSize: '0.78rem', color: 'rgba(224, 232, 240, 0.55)', lineHeight: '1.6', margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <p style={{ display: 'flex', gap: '8px', margin: 0 }}>
                <span>📞</span>
                <span>078935 25665</span>
              </p>
              <p style={{ display: 'flex', gap: '8px', margin: 0 }}>
                <span>⭐</span>
                <span>5.0 Google Reviews</span>
              </p>
              <p style={{ display: 'flex', gap: '8px', margin: 0 }}>
                <span>🌐</span>
                <a href="https://cerevyn.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--aqua-primary)', textDecoration: 'none' }}>Website & Services</a>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} AquaFuture. All rights reserved. Developed by Cerevyn Solutions Private Limited.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
