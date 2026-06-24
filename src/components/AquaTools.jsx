import { useState, useEffect, useRef } from 'react';

export default function AquaTools() {
  const [activeTab, setActiveTab] = useState('calculators'); // 'calculators' | 'diagnostics' | 'predictor'
  const [calcSubTab, setCalcSubTab] = useState('fcr'); // 'fcr' | 'density' | 'feed'
  const sectionRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Species mapping for defaults
  const SPECIES_PRESETS = {
    tilapia: { name: 'Nile Tilapia', targetFCR: 1.3, targetWeight: 600, feedFactor: 2.2, color: '#00d4aa' },
    salmon: { name: 'Atlantic Salmon', targetFCR: 1.15, targetWeight: 4000, feedFactor: 1.5, color: '#ff6b6b' },
    shrimp: { name: 'Pacific White Shrimp', targetFCR: 1.5, targetWeight: 25, feedFactor: 3.2, color: '#00e5ff' },
    catfish: { name: 'African Catfish', targetFCR: 1.45, targetWeight: 900, feedFactor: 2.6, color: '#7b68ee' },
  };

  // --- Calculator State Variables (Option 1) ---
  // FCR Calculator
  const [fcrSpecies, setFcrSpecies] = useState('tilapia');
  const [fcrStockCount, setFcrStockCount] = useState(10000);
  const [fcrInitWeight, setFcrInitWeight] = useState(25); // g
  const [fcrFinalWeight, setFcrFinalWeight] = useState(550); // g
  const [fcrTotalFeed, setFcrTotalFeed] = useState(70); // quintals

  // Density Estimator
  const [densSpecies, setDensSpecies] = useState('tilapia');
  const [densGeometry, setDensGeometry] = useState('rectangular');
  const [densLength, setDensLength] = useState(20); // m
  const [densWidth, setDensWidth] = useState(10); // m
  const [densDepth, setDensDepth] = useState(1.5); // m
  const [densDiameter, setDensDiameter] = useState(12); // m
  const [densAeration, setDensAeration] = useState('moderate'); // 'none' | 'moderate' | 'high'

  // Daily Feed Predictor
  const [feedSpecies, setFeedSpecies] = useState('tilapia');
  const [feedStockCount, setFeedStockCount] = useState(12000);
  const [feedAvgWeight, setFeedAvgWeight] = useState(180); // g
  const [feedTemp, setFeedTemp] = useState(27); // °C

  // --- Water Diagnostics State Variables (Option 2) ---
  const [diagTemp, setDiagTemp] = useState(26); // °C
  const [diagPH, setDiagPH] = useState(7.3);
  const [diagDO, setDiagDO] = useState(6.2); // mg/L
  const [diagAmmonia, setDiagAmmonia] = useState(0.08); // mg/L
  const [diagSalinity, setDiagSalinity] = useState(15); // ppt

  // --- Predictor State Variables (Option 3) ---
  const [predSpecies, setPredSpecies] = useState('tilapia');
  const [predStockCount, setPredStockCount] = useState(15000);
  const [predSurvivalRate, setPredSurvivalRate] = useState(88); // %
  const [predInitWeight, setPredInitWeight] = useState(15); // g
  const [predWeeks, setPredWeeks] = useState(24); // weeks
  const [predPrice, setPredPrice] = useState(15000); // ₹/quintal
  const [predFeedCost, setPredFeedCost] = useState(8000); // ₹/quintal


  // ==========================================
  // CALCULATIONS
  // ==========================================

  // 1. FCR Calculation
  const totalBiomassGain = (fcrStockCount * (fcrFinalWeight - fcrInitWeight)) / 100000; // quintals
  const calculatedFCR = totalBiomassGain > 0 ? (fcrTotalFeed / totalBiomassGain).toFixed(2) : 0;
  const targetFCR = SPECIES_PRESETS[fcrSpecies].targetFCR;
  const fcrRatio = parseFloat(calculatedFCR) / targetFCR;

  let fcrRating = 'Excellent';
  let fcrRatingColor = 'var(--aqua-primary)';
  let fcrAdvice = 'Superb feed conversion! Your stock is absorbing nutrients with minimal waste.';
  if (fcrRatio > 1.4) {
    fcrRating = 'Critical (High Waste)';
    fcrRatingColor = 'var(--coral)';
    fcrAdvice = 'High feeding inefficiency. Inspect feeders for physical leakage, adjust feeding rate based on water temperature, or check for health stressors.';
  } else if (fcrRatio > 1.15) {
    fcrRating = 'Sub-optimal';
    fcrRatingColor = 'var(--sunset-orange)';
    fcrAdvice = 'Slightly higher feed usage than baseline. Calibrate feeding timings and track daily water parameters to optimize metabolism.';
  } else if (fcrRatio > 0.85) {
    fcrRating = 'Good (Standard)';
    fcrRatingColor = 'var(--aqua-bright)';
    fcrAdvice = 'Healthy feed conversion aligning well with target profiles. Standard operations are performing correctly.';
  }

  // 2. Stocking Density Calculation
  const waterVolumeM3 =
    densGeometry === 'rectangular'
      ? densLength * densWidth * densDepth
      : Math.PI * Math.pow(densDiameter / 2, 2) * densDepth;
  const waterVolumeLiters = waterVolumeM3 * 1000;

  // Safe stocking biomass threshold (kg/m3) based on species & aeration
  const getSafeBiomassLimit = (species, aeration) => {
    const baselines = {
      tilapia: { none: 6, moderate: 18, high: 35 },
      salmon: { none: 10, moderate: 28, high: 55 },
      shrimp: { none: 2.2, moderate: 7, high: 18 },
      catfish: { none: 12, moderate: 30, high: 65 },
    };
    return baselines[species][aeration] || 15;
  };
  const safeBiomassLimit = getSafeBiomassLimit(densSpecies, densAeration);
  const totalSafeBiomass = waterVolumeM3 * safeBiomassLimit; // kg
  
  // Safe count based on target harvest size
  const targetHarvestWeight = SPECIES_PRESETS[densSpecies].targetWeight; // g
  const recommendedStockCount = Math.floor((totalSafeBiomass * 1000) / targetHarvestWeight);
  const stockDensityRatio = recommendedStockCount > 0 ? (recommendedStockCount / waterVolumeM3).toFixed(1) : 0;

  // 3. Daily Feed Predictor Calculation
  const getFeedingRatePercent = (species, weight, temp) => {
    // Smaller fish eat higher % of weight. Optimum temp drives optimal feeding rates.
    let baseRate = 3.0;
    if (weight < 20) baseRate = 6.0;
    else if (weight < 100) baseRate = 4.0;
    else if (weight < 300) baseRate = 2.5;
    else baseRate = 1.8;

    // Temperature multiplier
    let tempMultiplier = 1.0;
    if (species === 'salmon') {
      // Cold water species
      if (temp < 6) tempMultiplier = 0.3;
      else if (temp < 10) tempMultiplier = 0.7;
      else if (temp <= 16) tempMultiplier = 1.0;
      else if (temp <= 20) tempMultiplier = 0.6;
      else tempMultiplier = 0.1; // extreme heat stress
    } else {
      // Warm water species (tilapia, shrimp, catfish)
      if (temp < 18) tempMultiplier = 0.2;
      else if (temp < 22) tempMultiplier = 0.6;
      else if (temp <= 29) tempMultiplier = 1.0;
      else if (temp <= 33) tempMultiplier = 0.8;
      else tempMultiplier = 0.35; // extreme heat stress
    }
    return baseRate * tempMultiplier;
  };

  const calculatedFeedRatePercent = getFeedingRatePercent(feedSpecies, feedAvgWeight, feedTemp);
  const dailyFeedNeededKg = ((feedStockCount * (feedAvgWeight / 1000) * calculatedFeedRatePercent) / 100).toFixed(1);

  // 4. Water Quality Diagnostics (Option 2)
  const computeWaterDiagnostics = () => {
    let penalties = 0;
    const activeWarnings = [];
    const correctiveRemedies = [];

    // pH diagnostics
    if (diagPH < 6.5) {
      const p = (6.5 - diagPH) * 20;
      penalties += Math.min(45, p);
      activeWarnings.push('Acidic Water Stress (pH < 6.5)');
      correctiveRemedies.push('Gradually buffer the water by dosing Agricultural Lime (calcium carbonate, CaCO3) or Sodium Bicarbonate (baking soda) at 10-20g per m³.');
    } else if (diagPH > 8.5) {
      const p = (diagPH - 8.5) * 20;
      penalties += Math.min(45, p);
      activeWarnings.push('Alkaline Water Stress (pH > 8.5)');
      correctiveRemedies.push('Reduce pH safely by increasing aeration to dissolve biological carbon dioxide, or dose organic acids such as humic acids.');
    }

    // Dissolved Oxygen (DO) diagnostics
    if (diagDO < 3.0) {
      penalties += 75;
      activeWarnings.push('CRITICAL HYPOXIA DANGER (DO < 3.0 mg/L)');
      correctiveRemedies.push('EMERGENCY: Initiate all mechanical aerators (paddlewheels, diffusers) immediately. Stop all feed dispersion and inject pure liquid oxygen if available.');
    } else if (diagDO < 5.0) {
      penalties += 25;
      activeWarnings.push('Sub-optimal Dissolved Oxygen (DO < 5.0 mg/L)');
      correctiveRemedies.push('Increase splash rate or mechanical aeration during night hours when aquatic respiration peaks.');
    }

    // Ammonia Nitrogen (TAN) diagnostics
    if (diagAmmonia > 1.0) {
      penalties += 70;
      activeWarnings.push('TOXIC AMMONIA SPIKE (TAN > 1.0 mg/L)');
      correctiveRemedies.push('Perform an emergency 25-40% water exchange. Reduce feeding immediately. Dose ammonia binder chemicals (zeolite or active carbon) and lower pH slightly to shift ammonia to non-toxic ammonium (NH4+).');
    } else if (diagAmmonia > 0.2) {
      penalties += 20;
      activeWarnings.push('Elevated Ammonia Level (TAN > 0.2 mg/L)');
      correctiveRemedies.push('Boost mechanical bio-filtration, seed nitrifying bacteria cultures, and reduce feed rations by 30%.');
    }

    // Temperature diagnostics
    if (diagTemp < 20) {
      penalties += 20;
      activeWarnings.push('Low Temperature Metabolic Chill (Temp < 20°C)');
      correctiveRemedies.push('Fishes may stop eating. Reduce feeding amounts to avoid feed rotting on pond floors. If RAS, check thermal pump operation.');
    } else if (diagTemp > 32) {
      penalties += 25;
      activeWarnings.push('Critical Thermal Heat Stress (Temp > 32°C)');
      correctiveRemedies.push('High temperature reduces oxygen solubility. Maximize aeration, add fresh colder water, and consider installing floating surface shade nets.');
    }

    // Salinity diagnostics (Standard generalized threshold)
    if (diagSalinity < 2) {
      if (diagTemp > 24) {
        // low salinity is fine for tilapia, bad for shrimp/marine
        activeWarnings.push('Low Salinity (Freshwater/Low Salinity environment)');
      }
    } else if (diagSalinity > 35) {
      penalties += 10;
      activeWarnings.push('Hypersalinity Stress (Salinity > 35 ppt)');
      correctiveRemedies.push('Add freshwater to dilute salinity levels. High salinity increases osmotic stress on standard brackish/freshwater stocks.');
    }

    const finalScore = Math.max(0, Math.round(100 - penalties));
    let color = 'var(--aqua-primary)';
    let status = 'Excellent Water Quality';

    if (finalScore < 50) {
      color = 'var(--coral)';
      status = 'Hazardous Water Parameters';
    } else if (finalScore < 80) {
      color = 'var(--sunset-orange)';
      status = 'Marginal Water Stress';
    } else if (finalScore < 95) {
      color = 'var(--aqua-bright)';
      status = 'Good Water Quality';
    }

    return { score: finalScore, color, status, warnings: activeWarnings, remedies: correctiveRemedies };
  };

  const diagResult = computeWaterDiagnostics();

  // 5. Biomass Growth & Revenue Predictor (Option 3)
  const computePredictorProjections = () => {
    const survivalCount = Math.round(predStockCount * (predSurvivalRate / 100));
    
    // Simulate growth week by week using sigmoid model
    const getWeightAtWeek = (species, initW, targetW, w) => {
      // growth parameters
      const growthSpeeds = { tilapia: 0.22, salmon: 0.12, shrimp: 0.28, catfish: 0.18 };
      const inflectionWeeks = { tilapia: 12, salmon: 18, shrimp: 8, catfish: 13 };
      
      const speed = growthSpeeds[species] || 0.2;
      const tInfl = inflectionWeeks[species] || 12;
      
      return initW + (targetW - initW) / (1 + Math.exp(-speed * (w - tInfl)));
    };

    const targetW = SPECIES_PRESETS[predSpecies].targetWeight;
    const finalAvgWeight = getWeightAtWeek(predSpecies, predInitWeight, targetW, predWeeks);
    const finalBiomassQtl = (survivalCount * finalAvgWeight) / 100000; // quintals
    
    const grossRevenue = finalBiomassQtl * predPrice;
    
    // Feed logic: Total feed = FCR * Total biomass gain
    const presetFCR = SPECIES_PRESETS[predSpecies].targetFCR;
    const biomassGainedQtl = finalBiomassQtl - (predStockCount * predInitWeight) / 100000;
    const totalFeedNeededQtl = Math.max(0, biomassGainedQtl * presetFCR);
    const feedCost = totalFeedNeededQtl * predFeedCost;
    
    const netProfit = grossRevenue - feedCost;
    
    // Generate data points for SVG line chart (8 points along the duration)
    const chartData = [];
    const step = Math.max(1, Math.floor(predWeeks / 8));
    for (let w = 0; w <= predWeeks; w += step) {
      const weight = getWeightAtWeek(predSpecies, predInitWeight, targetW, w);
      chartData.push({
        week: w,
        weight: Math.round(weight),
        biomass: Math.round((survivalCount * weight) / 100000), // quintals
      });
    }
    // Ensure final week is included if step missed it
    if (chartData[chartData.length - 1].week !== predWeeks) {
      chartData.push({
        week: predWeeks,
        weight: Math.round(finalAvgWeight),
        biomass: Math.round(finalBiomassQtl),
      });
    }

    return {
      survivalCount,
      finalAvgWeight: finalAvgWeight.toFixed(0),
      finalBiomassQtl: finalBiomassQtl.toFixed(1),
      grossRevenue: grossRevenue.toFixed(0),
      totalFeedNeededQtl: totalFeedNeededQtl.toFixed(1),
      feedCost: feedCost.toFixed(0),
      netProfit: netProfit.toFixed(0),
      chartData,
    };
  };

  const predResult = computePredictorProjections();


  return (
    <section className="tools-section" id="tools" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Operational Dashboard
          </div>
          <h2 className="section-title">Farm Assistant Tools</h2>
          <p className="section-subtitle">
            Maximize feed performance, estimate stocking capacities, and diagnose pond biometrics 
            in real time with custom calculators designed for precision aquaculture.
          </p>
        </div>

        {/* Primary Tab Switcher */}
        <div className="tools-tabs-nav reveal">
          <button
            className={`tools-tab-btn ${activeTab === 'calculators' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculators')}
          >
            📊 Smart Calculators
          </button>
          <button
            className={`tools-tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnostics')}
          >
            🧪 Water Quality Diagnostics
          </button>
          <button
            className={`tools-tab-btn ${activeTab === 'predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictor')}
          >
            📈 Growth & Revenue Predictor
          </button>
        </div>

        {/* TAB 1: SMART CALCULATORS (Option 1) */}
        {activeTab === 'calculators' && (
          <div className="tools-content-wrapper">
            {/* Sub-tabs Navigation */}
            <div className="tools-subtabs">
              <button
                className={`tools-subtab-btn ${calcSubTab === 'fcr' ? 'active' : ''}`}
                onClick={() => setCalcSubTab('fcr')}
              >
                ⚖️ FCR Calculator
              </button>
              <button
                className={`tools-subtab-btn ${calcSubTab === 'density' ? 'active' : ''}`}
                onClick={() => setCalcSubTab('density')}
              >
                📦 Stocking Density
              </button>
              <button
                className={`tools-subtab-btn ${calcSubTab === 'feed' ? 'active' : ''}`}
                onClick={() => setCalcSubTab('feed')}
              >
                🌾 Feed Predictor
              </button>
            </div>

            {/* FCR Calculator Layout */}
            {calcSubTab === 'fcr' && (
              <div className="tool-grid">
                <div className="tool-panel glass-card">
                  <h3>Feed Conversion Parameters</h3>
                  <div className="form-group">
                    <label>Target Species</label>
                    <select value={fcrSpecies} onChange={(e) => setFcrSpecies(e.target.value)}>
                      <option value="tilapia">Nile Tilapia (Target FCR: 1.3)</option>
                      <option value="salmon">Atlantic Salmon (Target FCR: 1.15)</option>
                      <option value="shrimp">White Shrimp (Target FCR: 1.5)</option>
                      <option value="catfish">African Catfish (Target FCR: 1.45)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stock Count (Count): {fcrStockCount.toLocaleString()}</label>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={fcrStockCount}
                      onChange={(e) => setFcrStockCount(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group-split">
                    <div className="form-group">
                      <label>Initial Weight (g)</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={fcrInitWeight}
                        onChange={(e) => setFcrInitWeight(Math.max(1, parseInt(e.target.value) || 0))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Final Weight (g)</label>
                      <input
                        type="number"
                        min="10"
                        max="8000"
                        value={fcrFinalWeight}
                        onChange={(e) => setFcrFinalWeight(Math.max(10, parseInt(e.target.value) || 0))}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Total Feed Distributed (Quintals): {fcrTotalFeed.toLocaleString('en-IN')}</label>
                    <input
                      type="range"
                      min="1"
                      max="1500"
                      step="1"
                      value={fcrTotalFeed}
                      onChange={(e) => setFcrTotalFeed(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="tool-panel glass-card output-panel">
                  <h3>FCR Analysis Report</h3>
                  <div className="telemetry-box">
                    <div className="metric-circle-wrapper">
                      <div className="metric-circle" style={{ borderColor: fcrRatingColor }}>
                        <span className="metric-val">{calculatedFCR}</span>
                        <span className="metric-unit">FCR Value</span>
                      </div>
                    </div>
                    <div className="metric-details">
                      <div className="detail-row">
                        <span>Biomass Gained:</span>
                        <strong>{parseFloat(totalBiomassGain).toFixed(2).toLocaleString('en-IN')} qtl</strong>
                      </div>
                      <div className="detail-row">
                        <span>Target FCR:</span>
                        <strong style={{ color: 'var(--aqua-bright)' }}>{targetFCR}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Efficiency Status:</span>
                        <strong style={{ color: fcrRatingColor }}>{fcrRating}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="report-alert" style={{ borderLeftColor: fcrRatingColor }}>
                    <p className="report-alert-text">{fcrAdvice}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stocking Density Layout */}
            {calcSubTab === 'density' && (
              <div className="tool-grid">
                <div className="tool-panel glass-card">
                  <h3>Pond & Stock Setup</h3>
                  <div className="form-group">
                    <label>Target Species</label>
                    <select value={densSpecies} onChange={(e) => setDensSpecies(e.target.value)}>
                      <option value="tilapia">Nile Tilapia (Max Stocking Weight: 500g)</option>
                      <option value="salmon">Atlantic Salmon (Max Stocking Weight: 4000g)</option>
                      <option value="shrimp">White Shrimp (Max Stocking Weight: 25g)</option>
                      <option value="catfish">African Catfish (Max Stocking Weight: 900g)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pond Geometry</label>
                    <div className="toggle-group">
                      <button
                        className={`toggle-btn ${densGeometry === 'rectangular' ? 'active' : ''}`}
                        onClick={() => setDensGeometry('rectangular')}
                      >
                        Rectangular Pond
                      </button>
                      <button
                        className={`toggle-btn ${densGeometry === 'circular' ? 'active' : ''}`}
                        onClick={() => setDensGeometry('circular')}
                      >
                        Circular Tank
                      </button>
                    </div>
                  </div>

                  {densGeometry === 'rectangular' ? (
                    <div className="form-group-split">
                      <div className="form-group">
                        <label>Length (m)</label>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={densLength}
                          onChange={(e) => setDensLength(Math.max(1, parseFloat(e.target.value) || 0))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Width (m)</label>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={densWidth}
                          onChange={(e) => setDensWidth(Math.max(1, parseFloat(e.target.value) || 0))}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Diameter (m)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={densDiameter}
                        onChange={(e) => setDensDiameter(Math.max(1, parseFloat(e.target.value) || 0))}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Water Depth (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="10"
                      value={densDepth}
                      onChange={(e) => setDensDepth(Math.max(0.2, parseFloat(e.target.value) || 0))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Aeration Infrastructure</label>
                    <select value={densAeration} onChange={(e) => setDensAeration(e.target.value)}>
                      <option value="none">None (Static Pond / Low Biomass)</option>
                      <option value="moderate">Moderate (Mechanical Paddlewheels)</option>
                      <option value="high">High Aeration / RAS (Recirculating System)</option>
                    </select>
                  </div>
                </div>

                <div className="tool-panel glass-card output-panel">
                  <h3>Biomass Capacity Report</h3>
                  <div className="telemetry-box">
                    <div className="metric-box">
                      <span className="metric-label">Calculated Volume</span>
                      <span className="metric-value-huge">
                        {Math.round(waterVolumeM3).toLocaleString()} <span className="value-unit">m³</span>
                      </span>
                      <span className="metric-subtitle">({Math.round(waterVolumeLiters).toLocaleString()} Liters)</span>
                    </div>

                    <div className="metric-divider"></div>

                    <div className="metric-box">
                      <span className="metric-label">Recommended Stock</span>
                      <span className="metric-value-huge text-aqua">
                        {recommendedStockCount.toLocaleString()} <span className="value-unit">pcs</span>
                      </span>
                      <span className="metric-subtitle">fingerlings stock limit</span>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-col">
                      <span>Max Safe Biomass:</span>
                      <strong>{Math.round(totalSafeBiomass / 100).toLocaleString('en-IN')} qtl</strong>
                    </div>
                    <div className="detail-col">
                      <span>Suggested Density:</span>
                      <strong>
                        {stockDensityRatio} kg/m³ ({densAeration} aeration)
                      </strong>
                    </div>
                  </div>

                  {/* Stocking Density visual simulation box */}
                  <div className="density-sim-container">
                    <span className="sim-title">Visual Biomass Density Simulator</span>
                    <div className="density-sim-box">
                      {Array.from({ length: Math.min(60, Math.max(5, Math.ceil(stockDensityRatio * 1.5))) }).map((_, i) => (
                        <div
                          className="sim-fish-dot"
                          key={i}
                          style={{
                            backgroundColor: SPECIES_PRESETS[densSpecies].color,
                            left: `${Math.random() * 90 + 5}%`,
                            top: `${Math.random() * 80 + 10}%`,
                            animationDelay: `${Math.random() * 2}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="sim-caption">
                      Simulated packing density for {SPECIES_PRESETS[densSpecies].name} at {stockDensityRatio} kg/m³
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Feed Predictor Layout */}
            {calcSubTab === 'feed' && (
              <div className="tool-grid">
                <div className="tool-panel glass-card">
                  <h3>Pond Conditions</h3>
                  <div className="form-group">
                    <label>Target Species</label>
                    <select value={feedSpecies} onChange={(e) => setFeedSpecies(e.target.value)}>
                      <option value="tilapia">Nile Tilapia (Warmwater)</option>
                      <option value="salmon">Atlantic Salmon (Coldwater)</option>
                      <option value="shrimp">White Shrimp (Warmwater)</option>
                      <option value="catfish">African Catfish (Warmwater)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Total Fish Population: {feedStockCount.toLocaleString()} pcs</label>
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={feedStockCount}
                      onChange={(e) => setFeedStockCount(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Average Body Weight: {feedAvgWeight} g</label>
                    <input
                      type="range"
                      min="2"
                      max="3000"
                      step="2"
                      value={feedAvgWeight}
                      onChange={(e) => setFeedAvgWeight(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Water Temperature: {feedTemp} °C</label>
                    <input
                      type="range"
                      min="4"
                      max="36"
                      step="1"
                      value={feedTemp}
                      onChange={(e) => setFeedTemp(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="tool-panel glass-card output-panel">
                  <h3>Daily Feed Projections</h3>
                  <div className="telemetry-box">
                    <div className="metric-box">
                      <span className="metric-label">Suggested Daily Feed</span>
                      <span className="metric-value-huge text-bright">
                        {dailyFeedNeededKg} <span className="value-unit">kg/day</span>
                      </span>
                      <span className="metric-subtitle">({(dailyFeedNeededKg/100).toFixed(2)} qtl/day)</span>
                    </div>

                    <div className="metric-divider"></div>

                    <div className="metric-box">
                      <span className="metric-label">Feeding Rate</span>
                      <span className="metric-value-huge">
                        {calculatedFeedRatePercent.toFixed(2)} <span className="value-unit">%</span>
                      </span>
                      <span className="metric-subtitle">of total body weight</span>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-col">
                      <span>Weekly Feed Forecast:</span>
                      <strong>{((dailyFeedNeededKg * 7)/100).toFixed(2)} qtl</strong>
                    </div>
                    <div className="detail-col">
                      <span>Total Stock Biomass:</span>
                      <strong>{Math.round((feedStockCount * feedAvgWeight) / 100000).toLocaleString('en-IN')} qtl</strong>
                    </div>
                  </div>

                  <div className="report-alert" style={{ borderLeftColor: 'var(--aqua-bright)' }}>
                    <p className="report-alert-text">
                      <strong>Operational Tip:</strong> At {feedTemp}°C, the metabolic rate is {' '}
                      {calculatedFeedRatePercent > 1.5 ? 'highly active' : 'reduced'}. 
                      Distribute this daily allocation across {feedSpecies === 'shrimp' ? '4-5' : '2-3'} feeding sessions 
                      to maximize absorption and reduce floor organic pileup.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WATER QUALITY DIAGNOSTICS (Option 2) */}
        {activeTab === 'diagnostics' && (
          <div className="tools-content-wrapper">
            <div className="tool-grid">
              <div className="tool-panel glass-card">
                <h3>Live Sensor Sliders</h3>
                
                <div className="form-group slider-group">
                  <div className="slider-label-row">
                    <label>Dissolved Oxygen (DO)</label>
                    <span className="slider-value" style={{ color: diagDO < 4.0 ? 'var(--coral)' : 'var(--aqua-primary)' }}>
                      {diagDO.toFixed(1)} mg/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.1"
                    value={diagDO}
                    onChange={(e) => setDiagDO(parseFloat(e.target.value))}
                  />
                  <div className="slider-limits">
                    <span>Critical (&lt;3.0)</span>
                    <span>Ideal (5.0+)</span>
                  </div>
                </div>

                <div className="form-group slider-group">
                  <div className="slider-label-row">
                    <label>Ammonia Nitrogen (TAN)</label>
                    <span className="slider-value" style={{ color: diagAmmonia > 0.2 ? 'var(--coral)' : 'var(--aqua-primary)' }}>
                      {diagAmmonia.toFixed(2)} mg/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3.0"
                    step="0.01"
                    value={diagAmmonia}
                    onChange={(e) => setDiagAmmonia(parseFloat(e.target.value))}
                  />
                  <div className="slider-limits">
                    <span>Ideal (&lt;0.05)</span>
                    <span>Toxic (&gt;0.5)</span>
                  </div>
                </div>

                <div className="form-group slider-group">
                  <div className="slider-label-row">
                    <label>pH Level</label>
                    <span className="slider-value" style={{ color: (diagPH < 6.5 || diagPH > 8.5) ? 'var(--coral)' : 'var(--aqua-primary)' }}>
                      {diagPH.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="10.0"
                    step="0.1"
                    value={diagPH}
                    onChange={(e) => setDiagPH(parseFloat(e.target.value))}
                  />
                  <div className="slider-limits">
                    <span>Acidic (&lt;6.5)</span>
                    <span>Neutral (7.0)</span>
                    <span>Alkaline (&gt;8.5)</span>
                  </div>
                </div>

                <div className="form-group slider-group">
                  <div className="slider-label-row">
                    <label>Water Temperature</label>
                    <span className="slider-value">{diagTemp} °C</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    step="1"
                    value={diagTemp}
                    onChange={(e) => setDiagTemp(parseInt(e.target.value))}
                  />
                  <div className="slider-limits">
                    <span>Cold (10)</span>
                    <span>Warm (28)</span>
                    <span>Hot (34)</span>
                  </div>
                </div>

                <div className="form-group slider-group">
                  <div className="slider-label-row">
                    <label>Salinity</label>
                    <span className="slider-value">{diagSalinity} ppt</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={diagSalinity}
                    onChange={(e) => setDiagSalinity(parseInt(e.target.value))}
                  />
                  <div className="slider-limits">
                    <span>Freshwater (0)</span>
                    <span>Brackish (15)</span>
                    <span>Marine (35)</span>
                  </div>
                </div>
              </div>

              <div className="tool-panel glass-card output-panel">
                <h3>Diagnostics Summary</h3>
                <div className="telemetry-box">
                  <div className="metric-circle-wrapper">
                    <div className="metric-circle health-circle" style={{ borderColor: diagResult.color }}>
                      <span className="metric-val" style={{ color: diagResult.color }}>{diagResult.score}</span>
                      <span className="metric-unit">Health Index</span>
                    </div>
                  </div>
                  <div className="metric-details">
                    <div className="detail-row">
                      <span>Water Status:</span>
                      <strong style={{ color: diagResult.color }}>{diagResult.status}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Active Alarms:</span>
                      <strong style={{ color: diagResult.warnings.length > 0 ? 'var(--coral)' : 'var(--aqua-primary)' }}>
                        {diagResult.warnings.length} Active
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Alarm warnings list */}
                {diagResult.warnings.length > 0 ? (
                  <div className="alarm-box">
                    <h4 className="alarm-title">⚠️ ACTIVE WATER ALARMS</h4>
                    <ul className="alarm-list">
                      {diagResult.warnings.map((warn, i) => (
                        <li key={i} className="alarm-item">{warn}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="alarm-box success-box">
                    <p className="alarm-item-success">✔️ All water parameters are currently in optimal healthy zones.</p>
                  </div>
                )}

                {/* Actionable Remedies */}
                <div className="remediation-container">
                  <h4>💡 Required Corrective Actions</h4>
                  {diagResult.remedies.length > 0 ? (
                    <ul className="remedies-list">
                      {diagResult.remedies.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="remedy-placeholder">Water biometrics are stable. Continue regular biological filtering and feed dosing cycles.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BIOMASS & REVENUE PREDICTOR (Option 3) */}
        {activeTab === 'predictor' && (
          <div className="tools-content-wrapper">
            <div className="tool-grid">
              <div className="tool-panel glass-card">
                <h3>Projection Parameters</h3>
                
                <div className="form-group">
                  <label>Species Preset</label>
                  <select value={predSpecies} onChange={(e) => setPredSpecies(e.target.value)}>
                    <option value="tilapia">Nile Tilapia (Sigmoid Growth to 600g)</option>
                    <option value="salmon">Atlantic Salmon (Sigmoid Growth to 4000g)</option>
                    <option value="shrimp">White Shrimp (Sigmoid Growth to 25g)</option>
                    <option value="catfish">African Catfish (Sigmoid Growth to 900g)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stocking Quantity (Count): {predStockCount.toLocaleString()} fingerlings</label>
                  <input
                    type="range"
                    min="1000"
                    max="150000"
                    step="1000"
                    value={predStockCount}
                    onChange={(e) => setPredStockCount(parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group-split">
                  <div className="form-group">
                    <label>Survival Rate (%)</label>
                    <input
                      type="number"
                      min="40"
                      max="100"
                      value={predSurvivalRate}
                      onChange={(e) => setPredSurvivalRate(Math.min(100, Math.max(40, parseInt(e.target.value) || 0)))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (Weeks)</label>
                    <input
                      type="number"
                      min="4"
                      max="52"
                      value={predWeeks}
                      onChange={(e) => setPredWeeks(Math.min(52, Math.max(4, parseInt(e.target.value) || 0)))}
                    />
                  </div>
                </div>

                <div className="form-group-split">
                  <div className="form-group">
                    <label>Target Price (₹/Quintal)</label>
                    <input
                      type="number"
                      step="100"
                      min="1000"
                      max="100000"
                      value={predPrice}
                      onChange={(e) => setPredPrice(Math.max(1000, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Feed Cost (₹/Quintal)</label>
                    <input
                      type="number"
                      step="100"
                      min="500"
                      max="50000"
                      value={predFeedCost}
                      onChange={(e) => setPredFeedCost(Math.max(500, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>
              </div>

              <div className="tool-panel glass-card output-panel">
                <h3>Financial & Growth Report</h3>
                
                <div className="telemetry-box predictor-telemetry">
                  <div className="metric-box small-box">
                    <span className="metric-label">Harvest Yield</span>
                    <span className="metric-value-medium text-bright">
                      {parseFloat(predResult.finalBiomassQtl).toLocaleString('en-IN')} <span className="value-unit">qtl</span>
                    </span>
                    <span className="metric-subtitle">@{predResult.finalAvgWeight}g average size</span>
                  </div>

                  <div className="metric-divider"></div>

                  <div className="metric-box small-box">
                    <span className="metric-label">Net Profit</span>
                    <span className="metric-value-medium" style={{ color: parseFloat(predResult.netProfit) >= 0 ? 'var(--aqua-primary)' : 'var(--coral)' }}>
                      ₹{parseInt(predResult.netProfit).toLocaleString('en-IN')}
                    </span>
                    <span className="metric-subtitle">Margin: {((parseFloat(predResult.netProfit) / Math.max(1, parseFloat(predResult.grossRevenue))) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-col">
                    <span>Gross Revenue:</span>
                    <strong>₹{parseInt(predResult.grossRevenue).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="detail-col">
                    <span>Estimated Feed Cost:</span>
                    <strong>₹{parseInt(predResult.feedCost).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="detail-col">
                    <span>Total Feed Required:</span>
                    <strong>{parseFloat(predResult.totalFeedNeededQtl).toLocaleString('en-IN')} qtl</strong>
                  </div>
                  <div className="detail-col">
                    <span>Harvest Stock Count:</span>
                    <strong>{predResult.survivalCount.toLocaleString('en-IN')} pcs</strong>
                  </div>
                </div>

                {/* SVG Graph for Growth Curve */}
                <div className="growth-graph-container">
                  <span className="graph-title">Harvest Growth Curve (Average weight in grams)</span>
                  <div className="svg-wrapper">
                    <svg viewBox="0 0 320 120" width="100%" height="100%">
                      <defs>
                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--aqua-primary)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--aqua-primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      <line x1="20" y1="10" x2="300" y2="10" stroke="rgba(255,255,255,0.05)" />
                      <line x1="20" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" />
                      <line x1="20" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.05)" />

                      {/* Area and Line */}
                      {(() => {
                        const points = predResult.chartData.map((d, index) => {
                          const x = 20 + (index / (predResult.chartData.length - 1)) * 280;
                          // Scale weight relative to max preset weight
                          const maxPresetWeight = SPECIES_PRESETS[predSpecies].targetWeight;
                          const y = 90 - (d.weight / maxPresetWeight) * 75;
                          return { x, y, week: d.week, weight: d.weight };
                        });

                        const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                        const areaD = `${pathD} L ${points[points.length - 1].x} 90 L ${points[0].x} 90 Z`;

                        return (
                          <>
                            <path d={areaD} fill="url(#growthGrad)" />
                            <path d={pathD} fill="none" stroke="var(--aqua-primary)" strokeWidth="2" />
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle cx={p.x} cy={p.y} r="2.5" fill="var(--aqua-glow)" />
                                <text x={p.x} y={p.y - 6} fontSize="5.5" fill="#fff" textAnchor="middle">
                                  {p.weight}g
                                </text>
                                <text x={p.x} y="102" fontSize="5.5" fill="rgba(255,255,255,0.4)" textAnchor="middle">
                                  W{p.week}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}

                      {/* Axis Line */}
                      <line x1="20" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
