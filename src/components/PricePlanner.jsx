import { useState, useEffect, useRef } from 'react';

export default function PricePlanner() {
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

  // --- Guided Step 1: Scale Audit ---
  const [species, setSpecies] = useState('shrimp'); // 'shrimp' | 'finfish' | 'seaweed'
  const [facility, setFacility] = useState('pond'); // 'pond' | 'ras' | 'cage'
  const [annualYield, setAnnualYield] = useState(350); // quintals
  const [pondCount, setPondCount] = useState(8);

  // --- Step 2: Cost Inputs ---
  const [weeklyFeed, setWeeklyFeed] = useState(15); // quintals
  const [feedCostPerKg, setFeedCostPerKg] = useState(12000); // ₹/quintal
  const [annualCropValue, setAnnualCropValue] = useState(1500000); // ₹

  // ==========================================
  // CALCULATIONS & LOGIC
  // ==========================================

  // 1. Savings Calculator (Option A)
  const annualFeedCost = weeklyFeed * 52 * feedCostPerKg;
  // Feed savings: AquaFuture's AI feeding optimizer reduces feed waste by 20% on average
  const feedSavingsAnnual = annualFeedCost * 0.20;

  // Disease mortality reduction savings: reduces standard 15% crop loss down to 4% (retaining 11% value)
  const cropRetentionSavingsAnnual = annualCropValue * 0.11;

  const grossSavingsAnnual = feedSavingsAnnual + cropRetentionSavingsAnnual;
  // Because the platform is free, the net savings are exactly equal to the gross savings!
  const netSavingsAnnual = grossSavingsAnnual;

  // Sync states on guided inputs changes
  const handleScalePresetSelection = (speciesVal) => {
    setSpecies(speciesVal);
    if (speciesVal === 'shrimp') {
      setWeeklyFeed(12);
      setFeedCostPerKg(13500);
      setAnnualCropValue(1200000);
    } else if (speciesVal === 'finfish') {
      setWeeklyFeed(30);
      setFeedCostPerKg(11000);
      setAnnualCropValue(2500000);
    } else {
      // Seaweed
      setWeeklyFeed(1);
      setFeedCostPerKg(8500);
      setAnnualCropValue(400000);
    }
  };

  return (
    <section className="price-planner-section" id="pricing" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Savings Estimator
          </div>
          <h2 className="section-title">Free Savings & ROI Planner</h2>
          <p className="section-subtitle">
            AquaFuture is 100% free. Calculate your projected feed savings and crop retention gains to see how much profit goes directly back to your farm.
          </p>
        </div>

        <div className="planner-grid reveal">
          {/* LEFT SIDE: CONFIGURATORS */}
          <div className="planner-inputs-container">
            {/* Step 1: Scale Audit */}
            <div className="planner-panel glass-card">
              <div className="panel-step-badge">Step 1</div>
              <h3>Production Scale Audit</h3>
              <p className="panel-intro-text">
                Select your farm configurations to estimate your scale.
              </p>

              <div className="form-group-split">
                <div className="form-group">
                  <label>Species Cultured</label>
                  <select value={species} onChange={(e) => handleScalePresetSelection(e.target.value)}>
                    <option value="shrimp">White Shrimp (Penaeus vannamei)</option>
                    <option value="finfish">Finfish (Tilapia, Salmon, Catfish)</option>
                    <option value="seaweed">Seaweed (Kappaphycus, Kelp)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Facility Infrastructure</label>
                  <select value={facility} onChange={(e) => setFacility(e.target.value)}>
                    <option value="pond">Semi-Intensive Ponds</option>
                    <option value="ras">Recirculating Aquaculture (RAS)</option>
                    <option value="cage">Open Coastal Sea Cages</option>
                    <option value="hatchery">Hatchery / Breeding Tanks</option>
                  </select>
                </div>
              </div>

              <div className="form-group-split">
                <div className="form-group">
                  <label>Active Ponds/Tanks: {pondCount}</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={pondCount}
                    onChange={(e) => setPondCount(parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Target Yield: {annualYield} Quintals/yr</label>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={annualYield}
                    onChange={(e) => setAnnualYield(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Cost Inputs */}
            <div className="planner-panel glass-card">
              <div className="panel-step-badge">Step 2</div>
              <h3>Crop Expense Audits</h3>
              <p className="panel-intro-text">
                Input your current operating feed and crop values to calculate savings.
              </p>

              <div className="form-group-split">
                <div className="form-group">
                  <div className="slider-label-row">
                    <label>Weekly Feed Dispersed</label>
                    <span className="slider-value">{weeklyFeed.toLocaleString('en-IN')} Quintals/wk</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    step="1"
                    value={weeklyFeed}
                    onChange={(e) => setWeeklyFeed(parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <div className="slider-label-row">
                    <label>Feed Price per Quintal</label>
                    <span className="slider-value">₹{feedCostPerKg.toLocaleString('en-IN')} /qtl</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="30000"
                    step="500"
                    value={feedCostPerKg}
                    onChange={(e) => setFeedCostPerKg(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="slider-label-row">
                  <label>Estimated Annual Crop Valuation</label>
                  <span className="slider-value text-bright">₹{annualCropValue.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="15000000"
                  step="50000"
                  value={annualCropValue}
                  onChange={(e) => setAnnualCropValue(parseInt(e.target.value))}
                />
                <div className="slider-limits">
                  <span>₹50,000</span>
                  <span>₹1.5 Crores</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: ROI REPORT & PLAN SUMMARY */}
          <div className="planner-report-container">
            {/* Financial Savings Diagnostics */}
            <div className="planner-panel glass-card output-panel roi-dashboard-card">
              <h3>Annual Profit Retained Dashboard</h3>
              
              <div className="roi-metrics-grid">
                <div className="roi-metric-box">
                  <span className="roi-metric-label">Feed Savings (Annual)</span>
                  <span className="roi-metric-value text-bright">₹{Math.round(feedSavingsAnnual).toLocaleString('en-IN')}</span>
                  <span className="roi-metric-desc">FCR waste lowered by 20%</span>
                </div>

                <div className="roi-metric-box">
                  <span className="roi-metric-label">Crop Retention (Annual)</span>
                  <span className="roi-metric-value text-bright">₹{Math.round(cropRetentionSavingsAnnual).toLocaleString('en-IN')}</span>
                  <span className="roi-metric-desc">Pathogen mortality cut by 11%</span>
                </div>
              </div>

              <div className="roi-net-summary">
                <div className="net-savings-row">
                  <span>Net Annual Profit Retained:</span>
                  <span className="net-savings-value text-aqua">₹{Math.round(netSavingsAnnual).toLocaleString('en-IN')}</span>
                </div>
                <p className="roi-comparison-text">
                  (Software cost is ₹0.00, meaning 100% of savings are direct farm profits)
                </p>
                
                <div className="roi-progress-container">
                  <div className="roi-progress-label-row">
                    <span>Net Profit Retention Rate</span>
                    <strong>100% Return</strong>
                  </div>
                  <div className="roi-progress-track">
                    <div
                      className="roi-progress-fill"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className="roi-verdict">
                    🚀 <strong>100% Free Platform Benefit:</strong> By utilizing AquaFuture at no charge, your farm retains every single rupee of optimized feed and biological crop savings.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
