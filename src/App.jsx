import { useState, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import SpeciesGallery from './components/SpeciesGallery';
import Technology from './components/Technology';
import Stats from './components/Stats';
import AquaTools from './components/AquaTools'; // re-trigger HMR
import PricePlanner from './components/PricePlanner';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticlesOverlay from './components/ParticlesOverlay';
import UnderwaterCanvas from './components/UnderwaterCanvas';
import DepthScale from './components/DepthScale';
import BackToTop from './components/BackToTop';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {!loading && (
        <>
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
        </>
      )}
    </>
  );
}

export default App;

