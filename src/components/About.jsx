import { useState, useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  // 1. Water Quality States
  const [ph, setPh] = useState(7.8);
  const [doLevel, setDoLevel] = useState(5.5);
  const [temp, setTemp] = useState(28);
  const [salinity, setSalinity] = useState(15);
  const [aiAdvisory, setAiAdvisory] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // 2. Daily Feed Calculator States
  const [abw, setAbw] = useState(15); // Average Body Weight in grams
  const [survivalCount, setSurvivalCount] = useState(40000); // estimated count of pieces
  const [feedRate, setFeedRate] = useState(3.0); // feed rate in % of biomass

  // 3. Lime & Soil Doser States
  const [pondArea, setPondArea] = useState(1.0); // in acres
  const [currentPh, setCurrentPh] = useState(6.2);
  const [treatmentPhase, setTreatmentPhase] = useState('PondPrep'); // PondPrep or Active

  // 4. Genetic Breed State
  const [selectedBreed, setSelectedBreed] = useState('Shrimp');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Water Quality Status Calculations
  const calculateWaterStatus = (phVal, doVal, tempVal, salinityVal) => {
    let score = 100;
    let issues = [];

    if (phVal < 6.5 || phVal > 9.0) {
      score -= 25;
      issues.push(phVal < 6.5 ? 'Critical Acidic pH' : 'Critical Alkaline pH');
    } else if (phVal < 7.2 || phVal > 8.4) {
      score -= 10;
      issues.push(phVal < 7.2 ? 'Sub-optimal acidic pH' : 'Sub-optimal alkaline pH');
    }

    if (doVal < 3.0) {
      score -= 35;
      issues.push('Critical Low Oxygen (Anoxia)');
    } else if (doVal < 4.8) {
      score -= 15;
      issues.push('Mild Oxygen Stress');
    }

    if (tempVal < 20 || tempVal > 35) {
      score -= 20;
      issues.push(tempVal < 20 ? 'Critical Low Temperature' : 'Critical High Temperature');
    } else if (tempVal < 26 || tempVal > 32) {
      score -= 8;
      issues.push(tempVal < 26 ? 'Sub-optimal cooler water' : 'Elevated water temp');
    }

    if (salinityVal < 5 || salinityVal > 32) {
      score -= 10;
      issues.push(salinityVal < 5 ? 'Low Salinity salinity stress' : 'Elevated Salinity stress');
    }

    score = Math.max(10, score);
    
    let rating = 'Optimal';
    let statusClass = 'status-green';
    let advisory = 'All water parameters are currently in healthy, high-yield zones.';

    if (score < 55) {
      rating = 'Critical';
      statusClass = 'status-red';
      advisory = 'Immediate action required. Water parameters are in dangerous stress zones.';
    } else if (score < 80) {
      rating = 'Warning';
      statusClass = 'status-yellow';
      advisory = 'Minor adjustments needed to prevent species mortality or stress.';
    }

    return { score, rating, statusClass, issues, advisory };
  };

  const waterStatus = calculateWaterStatus(ph, doLevel, temp, salinity);

  // Generate Custom Live Water Quality Advisory via Azure OpenAI
  const handleGenerateAiAdvisory = async () => {
    setLoadingAi(true);
    setAiAdvisory('');

    const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
    const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
    const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl && (!apiKey || !endpoint)) {
      setTimeout(() => {
        let localAdvice = `### Water Analysis Status: ${waterStatus.rating} (${waterStatus.score}/100)\n\n`;
        localAdvice += `**Current Position**: Water has ${waterStatus.issues.length > 0 ? waterStatus.issues.join(', ') : 'no major chemical stress parameters'}.\n\n`;
        localAdvice += `**How to Improve Quality**:\n`;
        
        if (doLevel < 4.5) {
          localAdvice += `* 🔹 **Increase DO**: Turn on your paddlewheel aerators immediately. Turn off feed cycles temporarily to prevent oxygen absorption by bottom waste. Apply oxygen tablets if DO < 3.0.\n`;
        }
        if (ph < 7.0) {
          localAdvice += `* 🔹 **Buffer Acidic pH**: Apply Agricultural Lime (Calcium Carbonate, CaCO3) at 50 kg/acre to buffer the water acidity. Monitor salinity.\n`;
        } else if (ph > 8.5) {
          localAdvice += `* 🔹 **Reduce Alkaline pH**: Apply gypsum (100 kg/acre) or fermented rice bran with yeast to generate organic acids and naturally drop high pH.\n`;
        }
        if (temp > 32) {
          localAdvice += `* 🔹 **Thermal Management**: Increase water depth to at least 5-6 feet to allow a cooler bottom refuge. Run surface aerators during hot afternoons.\n`;
        }
        if (waterStatus.issues.length === 0) {
          localAdvice += `* 🔹 **Maintenance**: Maintain current organic probiotic dosing. Perform 10% water exchange weekly to prevent nutrient build-up.\n`;
        }

        setAiAdvisory(localAdvice);
        setLoadingAi(false);
      }, 1000);
      return;
    }

    try {
      if (apiUrl) {
        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/aquafuture/water-advisory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ph,
            doLevel,
            temp,
            salinity,
            score: waterStatus.score,
            rating: waterStatus.rating,
            issues: waterStatus.issues
          })
        });

        if (!response.ok) throw new Error("API call failed");
        const resData = await response.json();
        setAiAdvisory(resData.advice.trim());
      } else {
        const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
        const promptText = `Analyze this water quality status:
- pH Level: ${ph}
- Dissolved Oxygen (DO): ${doLevel} mg/L
- Temperature: ${temp}°C
- Salinity: ${salinity} ppt

Current score: ${waterStatus.score}/100 (Rating: ${waterStatus.rating})
Identified Issues: ${waterStatus.issues.join(', ') || 'None'}

Provide a brief, professional explanation of the water's present position and list 3-4 specific, actionable steps the aquaculture farmer must take to improve or maintain the water quality. Keep it concise, practical, and highly scientific.`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are a senior marine biologist and aquaculture water quality expert. You give concise chemical and biological pond remedies.'
              },
              {
                role: 'user',
                content: promptText
              }
            ],
            temperature: 0.3
          })
        });

        if (!response.ok) throw new Error("API call failed");
        const resData = await response.json();
        setAiAdvisory(resData.choices[0].message.content.trim());
      }
    } catch (err) {
      console.error(err);
      setAiAdvisory("⚠️ Live AI advisory unavailable. Please check your network. Using local parameters recommendations.");
    } finally {
      setLoadingAi(false);
    }
  };

  // 2. Feed Calculations
  const calculateFeed = () => {
    const biomass = Math.round((abw * survivalCount) / 1000); // total weight in kg
    const dailyFeed = Math.round((biomass * feedRate) / 100); // total feed in kg
    
    // Split schedule splits: Morning 35%, Afternoon 20%, Evening 45%
    const morning = Math.round(dailyFeed * 0.35 * 10) / 10;
    const afternoon = Math.round(dailyFeed * 0.20 * 10) / 10;
    const evening = Math.round(dailyFeed * 0.45 * 10) / 10;

    return { biomass, dailyFeed, morning, afternoon, evening };
  };
  const feedResult = calculateFeed();

  // 3. Lime & Dosing Calculations
  const calculateDosing = () => {
    let dosePerAc = 0;
    let chemical = 'Agricultural Limestone (CaCO3)';
    let instruction = '';
    let statusMsg = 'Optimal range. No soil treatment needed.';
    let isCorrection = false;

    if (currentPh < 7.0) {
      isCorrection = true;
      if (treatmentPhase === 'PondPrep') {
        chemical = 'Agricultural Limestone (CaCO3)';
        if (currentPh < 5.0) {
          dosePerAc = 800; // kg/acre
          statusMsg = 'Highly Acidic bottom soil. Heavy liming is mandatory before filling water.';
        } else if (currentPh < 6.0) {
          dosePerAc = 500;
          statusMsg = 'Acidic bottom soil. Liming is needed to raise buffering capacity.';
        } else {
          dosePerAc = 250;
          statusMsg = 'Mildly acidic bottom soil. Standard prep liming recommended.';
        }
        instruction = 'Spread agricultural limestone evenly over dry pond bottom soil. Allow bottom soil to sun-dry and crack for 5 days after spreading.';
      } else {
        // Active Correction in filled pond
        chemical = 'Hydrated Lime (Ca(OH)2)';
        if (currentPh < 6.0) {
          dosePerAc = 120;
          statusMsg = 'Dangerous acidic water! Immediate water correction needed to prevent gills corrosion.';
        } else {
          dosePerAc = 60;
          statusMsg = 'Mildly acidic water. Safe buffer dose to elevate alkalinity.';
        }
        instruction = 'Dissolve hydrated lime completely in buckets of water. Broadcast slurry evenly across the pond surface early morning when water temperature is cool.';
      }
    } else if (currentPh > 8.5) {
      isCorrection = true;
      chemical = 'Gypsum (Calcium Sulfate)';
      dosePerAc = 150;
      statusMsg = 'Highly alkaline water. High risk of heavy ammonia toxicity. Calcium buffer is required.';
      instruction = 'Broadcast gypsum powder evenly around pond edges. The calcium will displace carbonate ions, naturally buffering high pH levels.';
    }

    const totalDose = Math.round(dosePerAc * pondArea);
    return { chemical, totalDose, statusMsg, instruction, isCorrection };
  };
  const dosingResult = calculateDosing();

  const features = [
    { icon: '🌊', title: 'Water Analytics', desc: 'Real-time pH, oxygen & temperature monitoring' },
    { icon: '🧬', title: 'Genetic Selection', desc: 'AI-powered breeding optimization' },
    { icon: '🌾', title: 'Daily Feed Split', desc: 'Calculate daily feed quantity & splits' },
    { icon: '🧪', title: 'Lime & Soil Doser', desc: 'Soil correction & pH treatment guides' },
  ];

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left Panel: Dynamic Interactive Telemetry Console */}
          <div className="reveal-left">
            <div className="about-image-container glass-card telemetry-console">
              {/* Header */}
              <div className="console-header">
                <span className="console-title">🤖 AquaCare Analytics Console</span>
                <span className="node-status">
                  <span className="pulse-dot"></span> Interactive Mode
                </span>
              </div>

              {/* Console Body */}
              <div className="console-body">
                {activeTab === 0 && (
                  <div className="telemetry-panel water-analytics-panel">
                    <h3 className="panel-title">🧪 Water Analytics Simulator</h3>
                    <div className="sliders-grid">
                      <div className="slider-group">
                        <label>pH Level: <span>{ph.toFixed(1)}</span></label>
                        <input 
                          type="range" 
                          min="5.0" 
                          max="10.0" 
                          step="0.1" 
                          value={ph} 
                          onChange={(e) => { setPh(parseFloat(e.target.value)); setAiAdvisory(''); }} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>Oxygen (DO): <span>{doLevel.toFixed(1)} mg/L</span></label>
                        <input 
                          type="range" 
                          min="1.0" 
                          max="8.0" 
                          step="0.1" 
                          value={doLevel} 
                          onChange={(e) => { setDoLevel(parseFloat(e.target.value)); setAiAdvisory(''); }} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>Temperature: <span>{temp}°C</span></label>
                        <input 
                          type="range" 
                          min="15" 
                          max="40" 
                          value={temp} 
                          onChange={(e) => { setTemp(parseInt(e.target.value)); setAiAdvisory(''); }} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>Salinity: <span>{salinity} ppt</span></label>
                        <input 
                          type="range" 
                          min="0" 
                          max="40" 
                          value={salinity} 
                          onChange={(e) => { setSalinity(parseInt(e.target.value)); setAiAdvisory(''); }} 
                        />
                      </div>
                    </div>

                    {/* Quality Calculator Output */}
                    <div className={`quality-scorecard ${waterStatus.statusClass}`}>
                      <div className="score-row">
                        <span className="score-lbl">Water Position:</span>
                        <span className="score-val">{waterStatus.rating} ({waterStatus.score}/100)</span>
                      </div>
                      {waterStatus.issues.length > 0 && (
                        <div className="issues-list">
                          Alerts: {waterStatus.issues.join(', ')}
                        </div>
                      )}
                      <p className="score-advisory">{waterStatus.advisory}</p>
                    </div>

                    <button className="ai-advisory-btn" onClick={handleGenerateAiAdvisory} disabled={loadingAi}>
                      {loadingAi ? 'Analyzing Water Quality...' : '🔍 Generate AI Water Advisory'}
                    </button>

                    {aiAdvisory && (
                      <div className="advisory-result-box">
                        <h4 className="advisory-title">🧪 Action Plan & Advisory:</h4>
                        <div className="advisory-text">
                          {aiAdvisory.split('\n').map((line, idx) => (
                            <p key={idx} style={{ marginBottom: line.startsWith('*') ? '4px' : '8px', fontSize: '0.85rem' }}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="telemetry-panel genetic-panel">
                    <h3 className="panel-title">🧬 AI Breeding Forecaster</h3>
                    <p className="panel-desc">Select a target crop to forecast growth speed metrics and genetic viability.</p>
                    
                    <div className="breed-selectors">
                      {['Fish', 'Shrimp', 'Crab', 'Seaweed'].map((b) => (
                        <button 
                          key={b} 
                          className={`breed-btn ${selectedBreed === b ? 'active' : ''}`}
                          onClick={() => setSelectedBreed(b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    <div className="forecaster-card">
                      <div className="forecaster-row">
                        <span>Genetic Strain:</span>
                        <strong className="text-cyan">
                          {selectedBreed === 'Fish' && 'Rohu SPF Jayanti (IMC)'}
                          {selectedBreed === 'Shrimp' && 'Vannamei Gen-V Super SPF'}
                          {selectedBreed === 'Crab' && 'Scylla Serrata Wild-Cross'}
                          {selectedBreed === 'Seaweed' && 'Kappaphycus Fast-Growth Red'}
                        </strong>
                      </div>
                      <div className="forecaster-row">
                        <span>Growth Coefficient:</span>
                        <strong className="text-green">
                          {selectedBreed === 'Fish' && '+14% target cycle'}
                          {selectedBreed === 'Shrimp' && '+18% rapid moulting'}
                          {selectedBreed === 'Crab' && '+12% weight index'}
                          {selectedBreed === 'Seaweed' && '+22% thallus branching'}
                        </strong>
                      </div>
                      <div className="forecaster-row">
                        <span>Disease Survival Chance:</span>
                        <strong className="text-yellow">
                          {selectedBreed === 'Fish' && '92%'}
                          {selectedBreed === 'Shrimp' && '96.4%'}
                          {selectedBreed === 'Crab' && '88%'}
                          {selectedBreed === 'Seaweed' && '94%'}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="telemetry-panel feed-panel">
                    <h3 className="panel-title">🌾 Daily Feed Split Calculator</h3>
                    <p className="panel-desc">Optimize feed conversion ratios (FCR) and calculate daily biomass feed splits.</p>
                    
                    <div className="sliders-grid">
                      <div className="slider-group">
                        <label>Average Weight: <span>{abw} g</span></label>
                        <input 
                          type="range" 
                          min="2" 
                          max="150" 
                          value={abw} 
                          onChange={(e) => setAbw(parseInt(e.target.value))} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>Feeding Rate: <span>{feedRate.toFixed(1)}%</span></label>
                        <input 
                          type="range" 
                          min="1.0" 
                          max="8.0" 
                          step="0.1"
                          value={feedRate} 
                          onChange={(e) => setFeedRate(parseFloat(e.target.value))} 
                        />
                      </div>
                      <div className="slider-group" style={{ gridColumn: 'span 2' }}>
                        <label>Estimated Survival Count: <span>{survivalCount.toLocaleString()} pcs</span></label>
                        <input 
                          type="range" 
                          min="1000" 
                          max="100000" 
                          step="1000"
                          value={survivalCount} 
                          onChange={(e) => setSurvivalCount(parseInt(e.target.value))} 
                        />
                      </div>
                    </div>

                    <div className="quality-scorecard status-green">
                      <div className="score-row">
                        <span>Total Biomass:</span>
                        <strong>{feedResult.biomass.toLocaleString()} kg</strong>
                      </div>
                      <div className="score-row">
                        <span>Daily Feed Target:</span>
                        <strong style={{ color: 'var(--aqua-bright)' }}>{feedResult.dailyFeed} kg / day</strong>
                      </div>
                    </div>

                    <div className="feed-splits-box">
                      <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'rgba(224, 232, 240, 0.45)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        📋 Daily Split Schedule (FCR Friendly):
                      </h4>
                      <div className="splits-grid" style={{ display: 'flex', gap: '8px' }}>
                        <div className="split-card" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', display: 'block', color: 'rgba(224, 232, 240, 0.4)' }}>🌅 Morning (35%)</span>
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{feedResult.morning} kg</strong>
                        </div>
                        <div className="split-card" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', display: 'block', color: 'rgba(224, 232, 240, 0.4)' }}>☀️ Afternoon (20%)</span>
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{feedResult.afternoon} kg</strong>
                        </div>
                        <div className="split-card" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', display: 'block', color: 'rgba(224, 232, 240, 0.4)' }}>🌇 Evening (45%)</span>
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{feedResult.evening} kg</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="telemetry-panel dosing-panel">
                    <h3 className="panel-title">🧪 Lime & Gypsum Soil Doser</h3>
                    <p className="panel-desc">Calculate exact soil buffering applications for acidic or alkaline ponds.</p>

                    <div className="sliders-grid">
                      <div className="slider-group">
                        <label>Farm Size (Acres): <span>{pondArea.toFixed(1)} Ac</span></label>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="10.0" 
                          step="0.1"
                          value={pondArea} 
                          onChange={(e) => setPondArea(parseFloat(e.target.value))} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>Soil/Water pH: <span>{currentPh.toFixed(1)}</span></label>
                        <input 
                          type="range" 
                          min="4.0" 
                          max="10.0" 
                          step="0.1"
                          value={currentPh} 
                          onChange={(e) => setCurrentPh(parseFloat(e.target.value))} 
                        />
                      </div>
                      <div className="slider-group" style={{ gridColumn: 'span 2' }}>
                        <label>Treatment Phase</label>
                        <select 
                          value={treatmentPhase} 
                          onChange={(e) => setTreatmentPhase(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="PondPrep">Sun Drying / Soil Preparation Phase</option>
                          <option value="Active">Active Culture (Stocked Pond Correction)</option>
                        </select>
                      </div>
                    </div>

                    {dosingResult.isCorrection ? (
                      <div className={`quality-scorecard ${currentPh < 7.0 ? 'status-yellow' : 'status-red'}`}>
                        <div className="score-row">
                          <span>Treatment Required:</span>
                          <strong style={{ color: 'var(--aqua-primary)' }}>{dosingResult.chemical}</strong>
                        </div>
                        <div className="score-row">
                          <span>Total Amount Needed:</span>
                          <strong style={{ fontSize: '1.25rem', color: '#fff' }}>{dosingResult.totalDose} kg</strong>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '6px', color: 'rgba(224, 232, 240, 0.55)', fontStyle: 'italic' }}>
                          💡 {dosingResult.statusMsg}
                        </p>
                      </div>
                    ) : (
                      <div className="quality-scorecard status-green">
                        <div className="score-row">
                          <span>Treatment Required:</span>
                          <strong style={{ color: 'var(--aqua-primary)' }}>None</strong>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(224, 232, 240, 0.7)' }}>
                          Pond soil and water pH is optimal (7.0 - 8.5). Continue standard biosecurity protocols.
                        </p>
                      </div>
                    )}

                    {dosingResult.isCorrection && (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '4px' }}>
                        <h5 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'rgba(224, 232, 240, 0.45)', marginBottom: '4px' }}>
                          🛡️ Method of Application:
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(224, 232, 240, 0.65)', lineHeight: '1.5' }}>
                          {dosingResult.instruction}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Content Description & Interactive Feature Click Cards */}
          <div className="reveal-right">
            <div className="section-badge">
              <span className="badge-dot"></span>
              About Our Platform
            </div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              Revolutionizing Aquaculture with Smart Technology
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(224, 232, 240, 0.65)',
              lineHeight: '1.9',
              marginBottom: '20px',
            }}>
              AquaFuture is the next-generation platform designed for modern aqua farmers. 
              We combine cutting-edge artificial intelligence, IoT sensor networks, and 
              predictive analytics to help you maximize yields, reduce mortality rates, 
              and build sustainable aquaculture operations.
            </p>
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(224, 232, 240, 0.55)',
              lineHeight: '1.9',
              marginBottom: '32px',
            }}>
              Select any utility module below to interact with the **Advisory Calculator console** on the left and check parameters.
            </p>

            <div className="about-features">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className={`about-feature ${activeTab === i ? 'active' : ''}`}
                  onClick={() => { setActiveTab(i); setAiAdvisory(''); }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="about-feature-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
