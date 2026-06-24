import { useState, useEffect, useRef } from 'react';

export default function Services() {
  const sectionRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [planError, setPlanError] = useState('');

  // Form Inputs
  const [pondSize, setPondSize] = useState(1); // in acres
  const [pondDepth, setPondDepth] = useState(5); // in feet
  const [waterSource, setWaterSource] = useState('Borewell');
  const [stockingDensity, setStockingDensity] = useState(5000); // seeds count
  const [targetWeight, setTargetWeight] = useState(500); // in grams
  const [aerationPower, setAerationPower] = useState('2 HP Paddlewheel');

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
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Update default inputs when service changes to make it user-friendly
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setGeneratedPlan(null);
    setLoadingPlan(false);
    setPlanError('');
    setActiveTab('summary');
    
    // Set realistic pre-fills based on selected aquaculture type
    if (service.title === 'Shrimp Culture') {
      setStockingDensity(60000);
      setTargetWeight(30); // 30g whiteleg shrimp
      setWaterSource('Estuary / Brackish');
      setAerationPower('4 HP Paddlewheel');
    } else if (service.title === 'Mud Crab Farming') {
      setStockingDensity(4000);
      setTargetWeight(400); // 400g mud crabs
      setWaterSource('Estuary / Brackish');
      setAerationPower('None');
    } else if (service.title === 'Seaweed Cultivation') {
      setStockingDensity(1200); // number of thallus seedlings
      setTargetWeight(150); // 150g harvest weight
      setWaterSource('Sea Water');
      setAerationPower('None');
    } else {
      // Fish Farming defaults
      setStockingDensity(6000); // 6000 fingerlings
      setTargetWeight(600); // 600g fish
      setWaterSource('Borewell');
      setAerationPower('2 HP Paddlewheel');
    }
  };

  // Generate Cultivation Advisory Schedule via Azure OpenAI (Gemini/GPT)
  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoadingPlan(true);
    setGeneratedPlan(null);
    setPlanError('');
    setActiveTab('summary');

    const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
    const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
    const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

    if (!apiKey || !endpoint) {
      console.warn("Azure OpenAI API credentials missing, running local fallback calculator.");
      // Small simulated delay for realistic feel
      setTimeout(() => {
        runOfflineGenerator();
        setLoadingPlan(false);
      }, 1200);
      return;
    }

    try {
      const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
      
      const promptText = `Generate a customized aquaculture cultivation schedule and planning recommendations for:
Service Type: ${selectedService.title}
Pond/Farm Parameters:
- Farm Area: ${pondSize} Acres
- Average Water Depth: ${pondDepth} Feet
- Water Source: ${waterSource}
- Aeration Equipment: ${aerationPower}
- Stocking Seed Count: ${stockingDensity} seeds
- Target Harvest Weight: ${targetWeight} grams/piece

Based on these parameters, perform realistic calculations and generate a detailed advisory plan. Return the response strictly as a JSON object with the following fields:
{
  "survivalRate": <number representing estimated survival rate percentage, e.g. 85>,
  "biomass": <number representing expected harvest biomass in kg, calculated as stockingDensity * (survivalRate/100) * (targetWeight/1000) * pondSize>,
  "totalFeed": <number representing total feed requirement in kg, calculated as biomass * FCR. Average FCRs: Fish=1.5, Shrimp=1.25, Crab=1.8, Seaweed=0 (no feed)>,
  "timeline": [
    {
      "phase": "Phase title with days, e.g., Pond Preparation (Days -15 to -1)",
      "desc": "Detailed instructions on liming, drying, biosecurity setup, and pond preparations."
    },
    ... // exactly 5 or 6 detailed phases
  ],
  "waterManagementTips": [
    "Tip 1 tailored to water source and depth",
    "Tip 2 tailored to water source and depth"
  ],
  "feedTips": [
    "Feeding guidelines tailored to stocking density",
    "Feeding frequency and feed size guidance"
  ],
  "warnings": [
    "Critical risk alert 1 (e.g. oxygen depletion, disease warning, salinity changes)",
    "Critical risk alert 2"
  ]
}
Ensure the JSON is perfectly valid. Do not include any other text, markdown blocks, or explanation.`;

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
              content: 'You are an elite Indian Aquaculture Specialist with expertise in freshwater fish, vannamei shrimp, mud crabs, and marine seaweed farming. You generate custom cultivation timetables and feed recommendations in strict JSON format.'
            },
            {
              role: 'user',
              content: promptText
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resData = await response.json();
      const rawContent = resData.choices[0].message.content.trim();
      
      // Clean up markdown block formatting if returned by AI
      let cleanedJson = rawContent;
      if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      }

      const parsedPlan = JSON.parse(cleanedJson);

      setGeneratedPlan({
        ...parsedPlan,
        pondSize,
        pondDepth,
        waterSource,
        aerationPower,
        stockingDensity,
        targetWeight,
        serviceTitle: selectedService.title,
        isAiGenerated: true
      });
    } catch (err) {
      console.error("AI Plan Generation failed, falling back to local formulas:", err);
      setPlanError("AI generation encountered an issue. Loaded regional offline planner instead.");
      runOfflineGenerator();
    } finally {
      setLoadingPlan(false);
    }
  };

  const runOfflineGenerator = () => {
    // Custom calculations
    let survivalRate = 82; // average %
    let fcr = 1.4; // feed conversion ratio
    let biomass = 0;
    let totalFeed = 0;

    if (selectedService.title === 'Shrimp Culture') {
      survivalRate = 80;
      fcr = 1.25;
      biomass = Math.round(stockingDensity * (survivalRate / 100) * (targetWeight / 1000) * pondSize);
      totalFeed = Math.round(biomass * fcr);
    } else if (selectedService.title === 'Mud Crab Farming') {
      survivalRate = 70; // crabs fight, lower survival
      fcr = 1.8;
      biomass = Math.round(stockingDensity * (survivalRate / 100) * (targetWeight / 1000) * pondSize);
      totalFeed = Math.round(biomass * fcr);
    } else if (selectedService.title === 'Seaweed Cultivation') {
      survivalRate = 90;
      fcr = 0;
      biomass = Math.round(stockingDensity * (survivalRate / 100) * (targetWeight / 1000) * pondSize * 5);
      totalFeed = 0;
    } else {
      // Fish Farming
      survivalRate = 85;
      fcr = 1.5;
      biomass = Math.round(stockingDensity * (survivalRate / 100) * (targetWeight / 1000) * pondSize);
      totalFeed = Math.round(biomass * fcr);
    }

    setGeneratedPlan({
      survivalRate,
      biomass,
      totalFeed,
      pondSize,
      pondDepth,
      waterSource,
      aerationPower,
      stockingDensity,
      targetWeight,
      serviceTitle: selectedService.title,
      isAiGenerated: false,
      timeline: getTimelineData(selectedService.title),
      waterManagementTips: [
        `Monitor water transparency daily using a Secchi disc (optimal range: 30-40 cm).`,
        `Maintain water pH between 7.5 and 8.5, and check dissolved oxygen levels twice daily.`
      ],
      feedTips: [
        `Broadcast feed evenly across the pond surface or use feeding trays to monitor feed intake.`,
        `Adjust feeding rates based on water temperature and weekly growth sampling.`
      ],
      warnings: [
        `Sudden heavy rains can cause rapid salinity and temperature drops. Increase aeration immediately.`,
        `Decomposing bottom sludge can lead to toxic ammonia and hydrogen sulfide build-ups.`
      ]
    });
  };

  // Timeline template database based on aquaculture categories
  const getTimelineData = (title) => {
    if (title === 'Shrimp Culture') {
      return [
        { phase: 'Pond Prep & Liming (Days -15 to -7)', desc: 'Sun-dry the pond bottom until soil cracks. Apply Quicklime (200 kg/acre) to sanitize and balance pH. Fit bird fencing and crab barriers.' },
        { phase: 'Water Intake & Fertilisation (Days -6 to 0)', desc: 'Fill pond to 4 feet through filter bags. Apply Dolomite (40 kg/acre) and premium probiotics to bloom rich green phytoplankton water.' },
        { phase: 'Acclimatisation & Stocking (Day 0)', desc: 'Stock SPF post-larvae (PL-15) early morning. Float bags for 30 minutes, slowly mixing pond water to match salinity and temperature.' },
        { phase: 'Blind Feeding & Night Aeration (Days 1 to 30)', desc: 'Feed crumble starter feed 3 times daily. Run paddlewheel aerators 4 hours daily between 1:00 AM and 5:00 AM when oxygen drops.' },
        { phase: 'Probiotic Dosing & Feed Adjusting (Days 31 to 90)', desc: 'Transition to grower pellets. Check feed trays after 2 hours. Dose soil/water probiotics weekly to decompose organic sludge and prevent EMS.' },
        { phase: 'Harvest Prep (Days 90+)', desc: 'Check shrimp count and weight. Harvest early morning using cast/drag nets. Place harvested shrimp immediately in ice slurry to preserve quality.' }
      ];
    } else if (title === 'Mud Crab Farming') {
      return [
        { phase: 'Bund Fencing & Pond prep (Days -10 to -2)', desc: 'Install 1-meter high plastic net barriers along the bunds to prevent mud crabs from escaping. Add PVC hollow pipes (4-inch) at pond bottoms as shelter points.' },
        { phase: 'Stocking mud crabs (Day 0)', desc: 'Stock healthy juvenile crabs (50g to 100g size) at a low density (1 crab per sq meter) to prevent territorial fights and cannibalism.' },
        { phase: 'Feeding Trash Fish & Clams (Days 1 to 45)', desc: 'Feed minced trash fish, clam meat, or shrimp waste daily at 5% of total body weight. Split feed into morning and evening cycles.' },
        { phase: 'Water Quality & Moulting Check (Days 46 to 120)', desc: 'Perform regular water exchange (20% weekly) to clear excess organic matter. Ensure adequate calcium levels to aid shell hardening after moult cycles.' },
        { phase: 'Harvesting (Days 120+)', desc: 'Harvest crabs individually using scoop nets or bamboo traps. Tie crab claws with jute rope immediately to prevent injury and fight losses.' }
      ];
    } else if (title === 'Seaweed Cultivation') {
      return [
        { phase: 'Drafting Rafts & Lines (Days -5 to -1)', desc: 'Prepare floating bamboo rafts (3m x 3m) or longline ropes. Tie anchor stones and floating plastic drums to maintain stability in shallow coastal tides.' },
        { phase: 'Tying Seedlings (Day 0)', desc: 'Tie fresh Kappaphycus seaweed cuttings (80-100g thallus chunks) to the raft lines using soft plastic tie-tie threads at 15cm intervals.' },
        { phase: 'Coastal Raft Launch (Day 1)', desc: 'Float and anchor the lines in shallow marine waters (1.5m to 2.5m deep) with steady tidal currents. Ensure seaweed sits 30cm below the water surface.' },
        { phase: 'Cleaning Epiphytes & Debris (Days 2 to 40)', desc: 'Clean lines weekly by shaking off silt, debris, and epiphytic hairy weeds. Replace any washed-out thallus seedlings.' },
        { phase: 'Harvesting & Sun-Drying (Days 45+)', desc: 'Harvest rafts before summer heat causes bleaching (Ice-Ice disease). Sun-dry the seaweed on clean canvas mats for 3 days until moisture drops to 35%.' }
      ];
    } else {
      // Fish Farming
      return [
        { phase: 'Pond De-silting & Liming (Days -15 to -5)', desc: 'Remove bottom black organic mud. Apply agricultural lime (CaO) at 250 kg/acre to raise soil pH to 7.0 and eradicate pathogens.' },
        { phase: 'Manuring & Water Fill (Days -4 to 0)', desc: 'Fill freshwater cage or pond to 5 feet. Apply fermented cow manure or organic fertilizer to generate zooplankton feed.' },
        { phase: 'Fingerling Stocking (Day 0)', desc: 'Stock disease-free Catla/Rohu fingerlings. Acclimatise the bags to pond temperature to prevent stress and mortality.' },
        { phase: 'Regular Feeding & Aeration (Days 1 to 90)', desc: 'Feed floating pellet feeds (28-32% protein) at 3-5% of body weight. Turn on paddlewheels for 3 hours before sunrise.' },
        { phase: 'Pond Water Liming & Growth checks (Days 91 to 180)', desc: 'Perform monthly water checks. Apply agricultural gypsum or lime (20 kg/acre) if water becomes turbid. Net pond to monitor average fish weight.' },
        { phase: 'Final Harvesting (Days 180+)', desc: 'Stop feeding 24 hours prior to harvest. Drag net early morning to catch fish and transfer them immediately to aeration tanks for sale.' }
      ];
    }
  };

  // Generate Styled print PDF advisory report
  const downloadSchedulerPdf = () => {
    if (!generatedPlan) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert("Please allow popups to download the PDF report.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AquaFuture Cultivation Advisory Report</title>
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #0f172a;
            line-height: 1.6;
            padding: 40px;
            background-color: #ffffff;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #00d4aa;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title-area h1 {
            color: #03254c;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .title-area p {
            color: #00d4aa;
            margin: 4px 0 0 0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .meta-info {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          .summary-grid {
            display: grid;
            grid-template-cols: repeat(2, 1fr);
            gap: 15px;
            background: #e6fcf7;
            border: 1px solid #b3f5e7;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          .summary-item {
            font-size: 13px;
          }
          .summary-item strong {
            color: #03254c;
          }
          .metrics-grid {
            display: grid;
            grid-template-cols: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .metric-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .metric-lbl {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .metric-val {
            font-size: 18px;
            font-weight: 800;
            color: #03254c;
          }
          .section-title {
            color: #0f172a;
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 35px;
            margin-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
          }
          .timeline-stage {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .timeline-phase {
            font-size: 14px;
            font-weight: 800;
            color: #03254c;
          }
          .timeline-desc {
            font-size: 13px;
            color: #334155;
          }
          .tips-list {
            padding-left: 20px;
            font-size: 13px;
            color: #334155;
          }
          .tips-list li {
            margin-bottom: 8px;
          }
          .warning-box {
            background: #fffbeb;
            border: 1px solid #fef3c7;
            border-left: 4px solid #d97706;
            padding: 15px 20px;
            border-radius: 8px;
            margin-top: 25px;
            page-break-inside: avoid;
          }
          .warning-box h4 {
            margin: 0 0 6px 0;
            color: #92400e;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <h1>AquaFuture Cultivation Plan</h1>
            <p>Smart Advisory Report</p>
          </div>
          <div class="meta-info">
            Generated: ${new Date().toLocaleDateString('en-IN')}<br>
            Source: ${generatedPlan.isAiGenerated ? 'AquaFuture AI Engine' : 'AquaFuture Offline Planner'}
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-item"><strong>Farming Type:</strong> ${generatedPlan.serviceTitle}</div>
          <div class="summary-item"><strong>Water Source:</strong> ${generatedPlan.waterSource}</div>
          <div class="summary-item"><strong>Farm Size:</strong> ${generatedPlan.pondSize} Acres</div>
          <div class="summary-item"><strong>Water Depth:</strong> ${generatedPlan.pondDepth} Feet</div>
          <div class="summary-item"><strong>Stocking Density:</strong> ${generatedPlan.stockingDensity.toLocaleString()} pcs</div>
          <div class="summary-item"><strong>Target Weight:</strong> ${generatedPlan.targetWeight} g</div>
          <div class="summary-item"><strong>Aeration:</strong> ${generatedPlan.aerationPower}</div>
        </div>

        <div class="section-title">Expected Yield & Estimation</div>
        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-lbl">Estimated Survival</div>
            <div class="metric-val" style="color: #0ea5e9;">${generatedPlan.survivalRate}%</div>
          </div>
          <div class="metric-box">
            <div class="metric-lbl">Expected Biomass</div>
            <div class="metric-val" style="color: #10b981;">${generatedPlan.biomass.toLocaleString()} kg</div>
          </div>
          <div class="metric-box">
            <div class="metric-lbl">Total Feed Required</div>
            <div class="metric-val" style="color: #f59e0b;">${generatedPlan.totalFeed > 0 ? `${generatedPlan.totalFeed.toLocaleString()} kg` : 'N/A'}</div>
          </div>
        </div>

        <div class="section-title">Cultivation Timeline & Phases</div>
        ${generatedPlan.timeline.map((item, idx) => `
          <div class="timeline-stage">
            <div class="timeline-header">
              <span class="timeline-phase">Phase ${idx + 1}: ${item.phase}</span>
            </div>
            <div class="timeline-desc">${item.desc}</div>
          </div>
        `).join('')}

        ${generatedPlan.waterManagementTips && generatedPlan.waterManagementTips.length > 0 ? `
          <div class="section-title">Water Quality Management Tips</div>
          <ul class="tips-list">
            ${generatedPlan.waterManagementTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        ` : ''}

        ${generatedPlan.feedTips && generatedPlan.feedTips.length > 0 ? `
          <div class="section-title">Feeding & Nutrition Tips</div>
          <ul class="tips-list">
            ${generatedPlan.feedTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        ` : ''}

        ${generatedPlan.warnings && generatedPlan.warnings.length > 0 ? `
          <div class="warning-box">
            <h4>Potential Risks & Warnings</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #92400e;">
              ${generatedPlan.warnings.map(warn => `<li>${warn}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="footer">
          This cultivation advisory report is AI-generated for general guidance. Consult regional fisheries departments for local adjustments.<br>
          © ${new Date().getFullYear()} AquaFuture. All rights reserved.
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const services = [
    {
      icon: '🐟',
      title: 'Fish Farming',
      desc: 'Smart planning tools for freshwater carps (Rohu, Catla, Mrigal), Tilapia, and Pangasius catfish with automated feed tables.',
      tag: 'Most Popular',
    },
    {
      icon: '🦐',
      title: 'Shrimp Culture',
      desc: 'Precision shrimp and prawn farming models for Whiteleg (Vannamei) and Tiger shrimp with water salinity calculators.',
      tag: 'High Export Value',
    },
    {
      icon: '🦀',
      title: 'Mud Crab Farming',
      desc: 'Coastal mangrove mud crab farming schedules with customized stocking density and claw protection guides.',
      tag: 'Premium Demand',
    },
    {
      icon: '🌿',
      title: 'Seaweed Cultivation',
      desc: 'Floating bamboo raft and longline rope seaweed cultivation schedules tailored for Kappaphycus coastal farmers.',
      tag: 'Sustainable',
    },
  ];

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Farmer Utilities
          </div>
          <h2 className="section-title">AI Cultivation Planners</h2>
          <p className="section-subtitle">
            Click on any farming service below to launch the **AI Smart Scheduler**. 
            Enter your pond parameters to receive a customized water and feed advisory cycle.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <div
              key={i}
              className="service-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <span className="service-tag">{service.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Smart Scheduler Modal Dialog — Mirroring the Species Modal exactly */}
      {selectedService && (
        <div className="services-modal-backdrop" onClick={() => setSelectedService(null)}>
          <div className="services-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedService(null)}>×</button>

            <div className="modal-header">
              <span className="modal-emoji">{selectedService.icon}</span>
              <div>
                <h2>{selectedService.title} Planner</h2>
                <div className="scientific-name">AI Cultivation & Feed Advisory</div>
              </div>
              <span className="modal-tag">AI Planner</span>
            </div>

            {!generatedPlan && !loadingPlan && (
              <>
                <p className="modal-desc">{selectedService.desc}</p>
                <div className="modal-body">
                  <form onSubmit={handleGeneratePlan} className="scheduler-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Pond / Farm Area (Acres)</label>
                        <input 
                          type="number" 
                          min="0.1" 
                          max="10" 
                          step="0.1"
                          value={pondSize} 
                          onChange={(e) => setPondSize(parseFloat(e.target.value))} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Average Water Depth (Feet)</label>
                        <select value={pondDepth} onChange={(e) => setPondDepth(parseInt(e.target.value))}>
                          <option value={3}>3 Feet</option>
                          <option value={4}>4 Feet</option>
                          <option value={5}>5 Feet (Optimal)</option>
                          <option value={6}>6 Feet</option>
                          <option value={7}>7 Feet</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Water Source</label>
                        <select value={waterSource} onChange={(e) => setWaterSource(e.target.value)}>
                          <option value="Borewell">Borewell (Fresh Water)</option>
                          <option value="Estuary / Brackish">Estuary / Creek (Brackish)</option>
                          <option value="Sea Water">Sea Water (High Salinity)</option>
                          <option value="Freshwater Canal">Freshwater Canal / River</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Aeration Equipment</label>
                        <select value={aerationPower} onChange={(e) => setAerationPower(e.target.value)}>
                          <option value="None">None (Organic/Low Density)</option>
                          <option value="2 HP Paddlewheel">2 HP Paddlewheel Aerator</option>
                          <option value="4 HP Paddlewheel">4 HP Paddlewheel Aerator</option>
                          <option value="Venturi Air Injector">Venturi Air Injector</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Stocking Seed Quantity (Count)</label>
                        <input 
                          type="number" 
                          min="100" 
                          max="100000" 
                          value={stockingDensity} 
                          onChange={(e) => setStockingDensity(parseInt(e.target.value))} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Target Harvest Weight (Grams / piece)</label>
                        <input 
                          type="number" 
                          min="10" 
                          max="2000" 
                          value={targetWeight} 
                          onChange={(e) => setTargetWeight(parseInt(e.target.value))} 
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="form-submit-btn">
                      Generate AI Aquaculture Plan
                      <span>→</span>
                    </button>
                  </form>
                </div>
              </>
            )}

            {loadingPlan && (
              <div className="scheduler-loading-box">
                <div className="loading-spinner"></div>
                <h4>Analyzing Pond Parameters...</h4>
                <p>Cerevyn AI is calculating expected survival ratios, biomass yield targets, FCR ratios, and aeration timelines.</p>
              </div>
            )}

            {generatedPlan && !loadingPlan && (
              <>
                <p className="modal-desc">
                  Advisory report for {generatedPlan.pondSize} Acres of {generatedPlan.serviceTitle} with {generatedPlan.waterSource} source.
                </p>

                <div className="modal-tabs">
                  <button 
                    className={`modal-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    📊 Performance Targets
                  </button>
                  <button 
                    className={`modal-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                  >
                    📋 Phase Advisory
                  </button>
                  <button 
                    className={`modal-tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guidelines')}
                  >
                    🛡️ AI Guidelines & Risks
                  </button>
                </div>

                <div className="modal-body">
                  {activeTab === 'summary' && (
                    <div className="scheduler-output-box">
                      {planError && <div className="plan-warning-banner">⚠️ {planError}</div>}
                      
                      <div className="plan-summary-grid">
                        <div className="summary-item">
                          <span className="summary-lbl">Estimated Survival</span>
                          <span className="summary-val text-cyan">{generatedPlan.survivalRate}%</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-lbl">Expected Biomass Yield</span>
                          <span className="summary-val text-green">{generatedPlan.biomass.toLocaleString()} kg</span>
                        </div>
                        {generatedPlan.totalFeed > 0 && (
                          <div className="summary-item">
                            <span className="summary-lbl">Est. Feed Required</span>
                            <span className="summary-val text-yellow">{generatedPlan.totalFeed.toLocaleString()} kg</span>
                          </div>
                        )}
                      </div>

                      <div className="inputs-summary-box">
                        <h3>Configuration Parameters</h3>
                        <div className="parameters-summary-grid">
                          <div className="summary-param-item">
                            <span className="param-lbl">Pond Size:</span>
                            <span className="param-val">{generatedPlan.pondSize} Acres</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">Water Depth:</span>
                            <span className="param-val">{generatedPlan.pondDepth} Feet</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">Water Source:</span>
                            <span className="param-val">{generatedPlan.waterSource}</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">Aeration Power:</span>
                            <span className="param-val">{generatedPlan.aerationPower}</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">Stocking Quantity:</span>
                            <span className="param-val">{generatedPlan.stockingDensity.toLocaleString()} pcs</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">Target Weight:</span>
                            <span className="param-val">{generatedPlan.targetWeight} g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'schedule' && (
                    <div className="scheduler-output-box">
                      <div className="timeline-steps">
                        {generatedPlan.timeline.map((step, idx) => (
                          <div key={idx} className="timeline-step-item">
                            <div className="step-badge">Phase {idx + 1}</div>
                            <div className="step-content">
                              <h5>{step.phase}</h5>
                              <p>{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'guidelines' && (
                    <div className="scheduler-output-box">
                      <div className="guidelines-section">
                        <h3>🧪 Water Quality Management</h3>
                        <ul className="guidelines-list">
                          {generatedPlan.waterManagementTips.map((tip, idx) => (
                            <li key={idx}>🔹 {tip}</li>
                          ))}
                        </ul>

                        <h3 style={{ marginTop: '24px' }}>🌾 Feeding Guidelines</h3>
                        <ul className="guidelines-list">
                          {generatedPlan.feedTips.map((tip, idx) => (
                            <li key={idx}>🔹 {tip}</li>
                          ))}
                        </ul>

                        {generatedPlan.warnings && generatedPlan.warnings.length > 0 && (
                          <div className="warnings-alert-box">
                            <h4>⚠️ Potential Risks & Warnings</h4>
                            <ul>
                              {generatedPlan.warnings.map((warn, idx) => (
                                <li key={idx}>{warn}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-actions-footer">
                  <button 
                    onClick={() => setGeneratedPlan(null)} 
                    className="recalculate-btn"
                  >
                    ← Reset Parameters
                  </button>
                  <button 
                    onClick={downloadSchedulerPdf} 
                    className="pdf-download-btn form-submit-btn"
                    style={{ margin: 0, padding: '12px 24px' }}
                  >
                    📥 Download Advisory PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
