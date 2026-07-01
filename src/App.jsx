import { useState } from 'react';
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

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
      {/* Login overlay — removed once authenticated */}
      {!authenticated && (
        <LoginPage onEnterSite={() => setAuthenticated(true)} />
      )}

      {/* Main site always mounts — hidden behind login, preloads while user is on auth page */}
      <div style={{ display: authenticated ? 'block' : 'none' }}>
        <div className="global-bg-gradient" />
        <UnderwaterCanvas />
        <ParticlesOverlay />
        <DepthScale />
        <Navbar />
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
    </>
  );
}

export default App;


