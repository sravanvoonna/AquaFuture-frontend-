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

  // --- Premium IoT Live Simulation States ---
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [aerator1, setAerator1] = useState(false);
  const [aerator2, setAerator2] = useState(false);
  const [waterExchange, setWaterExchange] = useState(false);
  const [bioFilter, setBioFilter] = useState(false);
  const [bufferPump, setBufferPump] = useState(false);

  // --- Premium Disease Diagnostician States ---
  const [wizardStep, setWizardStep] = useState(1); // 1, 2, 3
  const [diagSpecies, setDiagSpecies] = useState('tilapia');
  const [symptomChecklist, setSymptomChecklist] = useState({
    lethargy: false,
    surface_gasping: false,
    flashing: false,
    anorexia: false,
    white_spots: false,
    frayed_fins: false,
    cloudy_eyes: false,
    gills_rot: false,
    cotton_growths: false,
    black_shell: false
  });

  // --- Premium Feed ROI States ---
  const [roiSpecies, setRoiSpecies] = useState('tilapia');
  const [roiStockCount, setRoiStockCount] = useState(10000);
  const [roiHarvestPrice, setRoiHarvestPrice] = useState(15000);
  const [roiBaseFeedCost, setRoiBaseFeedCost] = useState(8000);

  // IoT Live Simulation loop hook
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // 1. Natural Drift: Random walk parameters
      let newDO = diagDO + (Math.random() - 0.53) * 0.22; 
      let newTAN = diagAmmonia + (Math.random() - 0.47) * 0.04;
      let newPH = diagPH + (Math.random() - 0.5) * 0.08;
      let newTemp = diagTemp + (Math.random() - 0.5) * 0.25;
      let newSalinity = diagSalinity + (Math.random() - 0.5) * 0.35;

      // 2. Adjustments based on active overrides
      if (aerator1) {
        newDO += 0.35;
        newTAN -= 0.005;
      }
      if (aerator2) {
        newDO += 0.35;
        newTAN -= 0.005;
      }
      if (waterExchange) {
        newTAN -= 0.07;
        newTemp += (26 - newTemp) * 0.15;
        newSalinity += (15 - newSalinity) * 0.15;
        newDO += (6.5 - newDO) * 0.15;
      }
      if (bioFilter) {
        newTAN -= 0.08;
      }
      if (bufferPump) {
        newPH += (7.2 - newPH) * 0.18;
      }

      // Constrain ranges
      newDO = Math.max(0, Math.min(15, newDO));
      newTAN = Math.max(0, Math.min(3.0, newTAN));
      newPH = Math.max(4.0, Math.min(10.0, newPH));
      newTemp = Math.max(8, Math.min(36, newTemp));
      newSalinity = Math.max(0, Math.min(40, newSalinity));

      setDiagDO(parseFloat(newDO.toFixed(2)));
      setDiagAmmonia(parseFloat(newTAN.toFixed(3)));
      setDiagPH(parseFloat(newPH.toFixed(2)));
      setDiagTemp(Math.round(newTemp));
      setDiagSalinity(Math.round(newSalinity));
    }, 1500);

    return () => clearInterval(interval);
  }, [isLiveMode, aerator1, aerator2, waterExchange, bioFilter, bufferPump, diagDO, diagAmmonia, diagPH, diagTemp, diagSalinity]);

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

  // --- Core Logic for Disease Diagnosis ---
  const computeProb = (diseaseSymptoms, checkedSymptoms) => {
    if (checkedSymptoms.length === 0) return 0;
    let matches = 0;
    diseaseSymptoms.forEach(s => {
      if (checkedSymptoms.includes(s)) matches++;
    });
    const matchRatio = matches / diseaseSymptoms.length;
    const specificity = matches / checkedSymptoms.length;
    return Math.round((matchRatio * 0.7 + specificity * 0.3) * 100);
  };

  const performDiseaseDiagnosis = () => {
    const checked = Object.keys(symptomChecklist).filter(k => symptomChecklist[k]);
    let diseases = [];
    if (diagSpecies === 'tilapia') {
      diseases = [
        {
          name: 'Ichthyophthiriasis (Ich / White Spot)',
          probability: computeProb(['white_spots', 'flashing', 'surface_gasping'], checked),
          desc: 'A widespread parasitic skin disease caused by Ichthyophthirius multifiliis. It causes rapid gill damage and skin irritation.',
          presTitle: 'Salt Bath & Thermal Regulation',
          presDose: '3.0 - 5.0 kg of NaCl per m³',
          presInst: 'Maintain standard stocking limits. Slowly dose non-iodized pond salt. For RAS systems, raise temperature gradually to 28-30°C to speed up parasite lifecycle and flush water filter.',
          dosePerM3: 4.0,
          doseUnit: 'kg'
        },
        {
          name: 'Columnaris (Saddleback / Gill Rot)',
          probability: computeProb(['gills_rot', 'cotton_growths', 'anorexia'], checked),
          desc: 'A common bacterial infection caused by Flavobacterium columnare. Highly contagious under high stocking density and high temperatures.',
          presTitle: 'Antibacterial Treatment & Volume Buffer',
          presDose: '2.5g copper sulfate (CuSO4) per m³',
          presInst: 'Stop feeding for 48 hours. Maximize aeration as gill tissues are damaged. Buffer pH to 7.2 using lime before treatment. Perform a 30% water exchange after 4 days.',
          dosePerM3: 0.0025,
          doseUnit: 'kg'
        },
        {
          name: 'Streptococcal Infection',
          probability: computeProb(['lethargy', 'anorexia', 'cloudy_eyes'], checked),
          desc: 'A severe warmwater bacterial disease causing systemic septicemia, bulging eyes, and spiral swimming behavior.',
          presTitle: 'Probiotic Supplement & Bio-security',
          presDose: '5.0g active Bacillus probiotics per m³',
          presInst: 'Reduce water temperature if possible. Incorporate feed-grade erythromycin (or veterinary approved antibiotic) into feed. Stop organic waste piling on pond floor.',
          dosePerM3: 0.005,
          doseUnit: 'kg'
        }
      ];
    } else if (diagSpecies === 'salmon') {
      diseases = [
        {
          name: 'Salmon Rickettsial Syndrome (SRS)',
          probability: computeProb(['lethargy', 'anorexia', 'cloudy_eyes', 'frayed_fins'], checked),
          desc: 'An intracellular bacterial disease causing severe hemorrhages, lethargy, and anemia in coldwater salmonids.',
          presTitle: 'Medicated Feed Therapy',
          presDose: '75mg antibiotic per kg of biomass daily',
          presInst: 'Quarantine infected net pens immediately. Treat feed under strict guidance. Optimize dissolved oxygen above 7.0 mg/L to support fish immune metabolism.',
          dosePerM3: 0,
          doseUnit: 'N/A'
        },
        {
          name: 'Sea Lice Infestation',
          probability: computeProb(['flashing', 'frayed_fins', 'lethargy'], checked),
          desc: 'Marine ectoparasitic copepods that attach to the skin and mucus of salmon, causing lesions, secondary infections, and severe osmotic imbalance.',
          presTitle: 'Hydrogen Peroxide (H2O2) Bath',
          presDose: '1.5 - 2.0g hydrogen peroxide (35%) per Liter',
          presInst: 'Administer short-term bath treatment (20 minutes) under high aeration control. Monitor water temperature closely (avoid treatment above 14°C).',
          dosePerM3: 1.75,
          doseUnit: 'g'
        },
        {
          name: 'Furunculosis',
          probability: computeProb(['frayed_fins', 'lethargy', 'anorexia', 'gills_rot'], checked),
          desc: 'A destructive bacterial disease causing boil-like lesions (furuncles) on muscles, bloody fin bases, and sudden mortality.',
          presTitle: 'Water Disinfectant Therapy',
          presDose: '12g treatment powder per m³ of water',
          presInst: 'Vaccinate upcoming cohorts. Clean nets to maximize water circulation. Disinfect tools with organic iodine solution.',
          dosePerM3: 0.012,
          doseUnit: 'kg'
        }
      ];
    } else if (diagSpecies === 'shrimp') {
      diseases = [
        {
          name: 'White Spot Syndrome Virus (WSSV)',
          probability: computeProb(['white_spots', 'lethargy', 'anorexia'], checked),
          desc: 'A highly lethal viral pathogen of shrimp. Causes distinct circular white calcium deposits under the carapace and rapid crop die-off within 3 to 10 days.',
          presTitle: 'Biosecurity & High-Aerate Quarantine',
          presDose: 'Halt discharge & dose 5.0g active iodine sanitizer per m³',
          presInst: 'EMERGENCY: Halt all water discharge to avoid spreading. Increase aeration to max capacity. Dose organic vitamin C at 5g/kg feed to boost surviving stock immunity.',
          dosePerM3: 0.005,
          doseUnit: 'kg'
        },
        {
          name: 'Early Mortality Syndrome (EMS / AHPND)',
          probability: computeProb(['lethargy', 'anorexia', 'black_shell'], checked),
          desc: 'Acute Hepatopancreatic Necrosis Disease, caused by toxin-producing strains of Vibrio parahaemolyticus. Shrimp die off in the first 30 days of stocking.',
          presTitle: 'Carbon-Nitrogen Balancing & Probiotic Dosing',
          presDose: '15g Molasses + 6g Bacillus probiotic cultures per m³',
          presInst: 'Boost C:N ratio by dosing carbon sources (molasses). Seed beneficial bacteria to outcompete Vibrio strains. Clean pond bottoms daily (sludge siphoning).',
          dosePerM3: 0.021,
          doseUnit: 'kg'
        },
        {
          name: 'Black Gill Disease',
          probability: computeProb(['black_shell', 'surface_gasping'], checked),
          desc: 'Melanization of shrimp gills caused by fungal spore attachment or severe accumulation of organic sludge on pond floors.',
          presTitle: 'Sludge Flushing & Copper Chelate Dosing',
          presDose: '0.5g chelated copper per m³',
          presInst: 'Perform urgent water exchange (20-30%). Use siphon tools to remove accumulated feces and uneaten feed from the tank bottom. Increase aeration.',
          dosePerM3: 0.0005,
          doseUnit: 'kg'
        }
      ];
    } else if (diagSpecies === 'catfish') {
      diseases = [
        {
          name: 'Enteric Septicemia of Catfish (ESC)',
          probability: computeProb(['lethargy', 'anorexia', 'cloudy_eyes'], checked),
          desc: 'A major bacterial disease of catfish, often called "Hole-in-the-Head" due to characteristic ulcerations on the skull. Catfish hang vertically at the surface.',
          presTitle: 'Medicated Feed & Feed Limitation',
          presDose: '50mg Terramycin per kg of fish biomass daily',
          presInst: 'Reduce feeding rate by 80% during active mortality. Clean water filters. Do not attempt treatment when water temperatures are between 22-28°C (ESC growth window).',
          dosePerM3: 0,
          doseUnit: 'N/A'
        },
        {
          name: 'Catfish Ich',
          probability: computeProb(['white_spots', 'flashing', 'surface_gasping'], checked),
          desc: 'Protozoan parasite causing heavy white spots. Catfish exhibit extreme irritation, flashing against gravel, and gill congestion.',
          presTitle: 'Formalin & Malachite Green Therapy',
          presDose: '20 mL formalin per m³ of water volume',
          presInst: 'Apply treatment on alternate days for a total of 3 treatments. Ensure maximum aeration as formalin binds dissolved oxygen.',
          dosePerM3: 0.02,
          doseUnit: 'L'
        },
        {
          name: 'Columnaris (Mouth Rot)',
          probability: computeProb(['cotton_growths', 'gills_rot', 'anorexia'], checked),
          desc: 'Bacterial infection resulting in yellowish cotton-like lesions around the mouth, skin margins, and gills.',
          presTitle: 'Potassium Permanganate (KMnO4) Dosing',
          presDose: '2.0g Potassium Permanganate per m³ of water',
          presInst: 'Apply KMnO4 bath treatment in early morning when dissolved oxygen is high. Discontinue feeding until mortality ceases. Clean bottom debris.',
          dosePerM3: 0.002,
          doseUnit: 'kg'
        }
      ];
    }

    diseases.sort((a, b) => b.probability - a.probability);
    if (checked.length === 0) {
      diseases.forEach(d => { d.probability = 0; });
    }
    return diseases;
  };

  const diseaseDiagnosisResult = performDiseaseDiagnosis();

  // --- Core Logic for Feed ROI Analyzer ---
  const computeFeedROICalculations = () => {
    const targetW = SPECIES_PRESETS[roiSpecies].targetWeight;
    const finalBiomassQtl = (roiStockCount * targetW) / 100000;
    const grossRevenue = finalBiomassQtl * roiHarvestPrice;
    const targetFCR = SPECIES_PRESETS[roiSpecies].targetFCR;
    
    const econFCR = targetFCR + 0.35;
    const stdFCR = targetFCR;
    const premFCR = Math.max(0.95, targetFCR - 0.15);
    
    const econCostPerQtl = roiBaseFeedCost * 0.65;
    const stdCostPerQtl = roiBaseFeedCost;
    const premCostPerQtl = roiBaseFeedCost * 1.35;
    
    const econFeedNeeded = finalBiomassQtl * econFCR;
    const stdFeedNeeded = finalBiomassQtl * stdFCR;
    const premFeedNeeded = finalBiomassQtl * premFCR;
    
    const econTotalFeedCost = econFeedNeeded * econCostPerQtl;
    const stdTotalFeedCost = stdFeedNeeded * stdCostPerQtl;
    const premTotalFeedCost = premFeedNeeded * premCostPerQtl;
    
    const baseWeeks = { tilapia: 24, salmon: 32, shrimp: 16, catfish: 28 };
    const stdWeeks = baseWeeks[roiSpecies] || 24;
    const econWeeks = Math.round(stdWeeks * 1.15);
    const premWeeks = Math.round(stdWeeks * 0.82);
    
    const econProfit = grossRevenue - econTotalFeedCost;
    const stdProfit = grossRevenue - stdTotalFeedCost;
    const premProfit = grossRevenue - premTotalFeedCost;
    
    const econROI = econTotalFeedCost > 0 ? (econProfit / econTotalFeedCost) * 100 : 0;
    const stdROI = stdTotalFeedCost > 0 ? (stdProfit / stdTotalFeedCost) * 100 : 0;
    const premROI = premTotalFeedCost > 0 ? (premProfit / premTotalFeedCost) * 100 : 0;
    
    let recommended = 'standard';
    if (premProfit > stdProfit && premProfit > econProfit) {
      recommended = 'premium';
    } else if (econProfit > stdProfit && econProfit > premProfit) {
      recommended = 'economy';
    }
    
    return {
      finalBiomassQtl: finalBiomassQtl.toFixed(1),
      grossRevenue: grossRevenue.toFixed(0),
      tiers: {
        economy: {
          fcr: econFCR.toFixed(2),
          totalFeed: econFeedNeeded.toFixed(1),
          feedCost: econTotalFeedCost.toFixed(0),
          weeks: econWeeks,
          profit: econProfit.toFixed(0),
          roi: econROI.toFixed(0)
        },
        standard: {
          fcr: stdFCR.toFixed(2),
          totalFeed: stdFeedNeeded.toFixed(1),
          feedCost: stdTotalFeedCost.toFixed(0),
          weeks: stdWeeks,
          profit: stdProfit.toFixed(0),
          roi: stdROI.toFixed(0)
        },
        premium: {
          fcr: premFCR.toFixed(2),
          totalFeed: premFeedNeeded.toFixed(1),
          feedCost: premTotalFeedCost.toFixed(0),
          weeks: premWeeks,
          profit: premProfit.toFixed(0),
          roi: premROI.toFixed(0)
        }
      },
      recommended
    };
  };

  const roiResult = computeFeedROICalculations();


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
          <button
            className={`tools-tab-btn ${activeTab === 'disease' ? 'active' : ''}`}
            onClick={() => setActiveTab('disease')}
          >
            🩺 Disease Diagnostician
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
              <button
                className={`tools-subtab-btn ${calcSubTab === 'roi' ? 'active' : ''}`}
                onClick={() => setCalcSubTab('roi')}
              >
                📊 Feed ROI Analyzer
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

            {/* Feed ROI Calculator Layout */}
            {calcSubTab === 'roi' && (
              <div className="roi-deck-container">
                <div className="roi-inputs-bar">
                  <div className="form-group">
                    <label>Target Species</label>
                    <select value={roiSpecies} onChange={(e) => setRoiSpecies(e.target.value)}>
                      <option value="tilapia">Nile Tilapia (Standard FCR: 1.3)</option>
                      <option value="salmon">Atlantic Salmon (Standard FCR: 1.15)</option>
                      <option value="shrimp">White Shrimp (Standard FCR: 1.5)</option>
                      <option value="catfish">African Catfish (Standard FCR: 1.45)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stocking Quantity (Count): {roiStockCount.toLocaleString()} fingerlings</label>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={roiStockCount}
                      onChange={(e) => setRoiStockCount(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group-split">
                    <div className="form-group">
                      <label>Harvest selling price (₹/Qtl)</label>
                      <input
                        type="number"
                        min="1000"
                        max="100000"
                        step="100"
                        value={roiHarvestPrice}
                        onChange={(e) => setRoiHarvestPrice(Math.max(1000, parseInt(e.target.value) || 0))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Base Feed Cost (₹/Qtl)</label>
                      <input
                        type="number"
                        min="1000"
                        max="50000"
                        step="100"
                        value={roiBaseFeedCost}
                        onChange={(e) => setRoiBaseFeedCost(Math.max(1000, parseInt(e.target.value) || 0))}
                      />
                    </div>
                  </div>
                </div>

                <div className="roi-cards-row">
                  {/* Economy Card */}
                  <div className={`roi-feed-card ${roiResult.recommended === 'economy' ? 'recommended' : ''}`}>
                    <div className="roi-card-header">
                      <span className="roi-tier-name">Economy Grade Feed</span>
                      <p className="roi-tier-desc">Standard low-protein formulation</p>
                    </div>
                    <div className="roi-primary-metric">
                      {roiResult.tiers.economy.roi}%
                    </div>
                    <span className="roi-primary-label">Estimated Feed ROI</span>
                    <div className="roi-card-divider"></div>
                    <div className="roi-card-details">
                      <div className="roi-detail-item">
                        <span>FCR Baseline:</span>
                        <strong>{roiResult.tiers.economy.fcr}</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Total Feed Needed:</span>
                        <strong>{roiResult.tiers.economy.totalFeed} qtl</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Total Feed Expense:</span>
                        <strong>₹{parseInt(roiResult.tiers.economy.feedCost).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Grow-out Duration:</span>
                        <strong style={{ color: 'var(--coral)' }}>{roiResult.tiers.economy.weeks} Weeks (+15%)</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Net Profit:</span>
                        <strong>₹{parseInt(roiResult.tiers.economy.profit).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Standard Card */}
                  <div className={`roi-feed-card ${roiResult.recommended === 'standard' ? 'recommended' : ''}`}>
                    <div className="roi-card-header">
                      <span className="roi-tier-name">Standard Grade Feed</span>
                      <p className="roi-tier-desc">Balanced nutrition profile</p>
                    </div>
                    <div className="roi-primary-metric">
                      {roiResult.tiers.standard.roi}%
                    </div>
                    <span className="roi-primary-label">Estimated Feed ROI</span>
                    <div className="roi-card-divider"></div>
                    <div className="roi-card-details">
                      <div className="roi-detail-item">
                        <span>FCR Baseline:</span>
                        <strong>{roiResult.tiers.standard.fcr}</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Total Feed Needed:</span>
                        <strong>{roiResult.tiers.standard.totalFeed} qtl</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Total Feed Expense:</span>
                        <strong>₹{parseInt(roiResult.tiers.standard.feedCost).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Grow-out Duration:</span>
                        <strong>{roiResult.tiers.standard.weeks} Weeks (Std)</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Net Profit:</span>
                        <strong>₹{parseInt(roiResult.tiers.standard.profit).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Premium Card */}
                  <div className={`roi-feed-card ${roiResult.recommended === 'premium' ? 'recommended' : ''}`}>
                    <div className="roi-card-header">
                      <span className="roi-tier-name">Premium Growth Feed</span>
                      <p className="roi-tier-desc">High-protein growth stimulants</p>
                    </div>
                    <div className="roi-primary-metric">
                      {roiResult.tiers.premium.roi}%
                    </div>
                    <span className="roi-primary-label">Estimated Feed ROI</span>
                    <div className="roi-card-divider"></div>
                    <div className="roi-card-details">
                      <div className="roi-detail-item">
                        <span>FCR Baseline:</span>
                        <strong>{roiResult.tiers.premium.fcr}</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Total Feed Needed:</span>
                        <strong>{roiResult.tiers.premium.totalFeed} qtl</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Total Feed Expense:</span>
                        <strong>₹{parseInt(roiResult.tiers.premium.feedCost).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Grow-out Duration:</span>
                        <strong style={{ color: 'var(--aqua-primary)' }}>{roiResult.tiers.premium.weeks} Weeks (-18%)</strong>
                      </div>
                      <div className="roi-detail-item">
                        <span>Net Profit:</span>
                        <strong>₹{parseInt(roiResult.tiers.premium.profit).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="roi-charts-panel glass-card">
                  <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--aqua-bright)' }}>📈 Brand ROI Profitability Comparison</h3>
                  <div className="roi-comparison-chart-wrapper">
                    {/* Economy row */}
                    <div className="roi-bar-row">
                      <div className="roi-bar-labels">
                        <span className="roi-bar-name">Economy Feed Profit</span>
                        <span className="roi-bar-val">₹{parseInt(roiResult.tiers.economy.profit).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="roi-bar-track">
                        <div 
                          className="roi-bar-fill economy" 
                          style={{ 
                            width: `${Math.max(10, Math.min(100, (parseFloat(roiResult.tiers.economy.profit) / Math.max(1, parseFloat(roiResult.tiers.premium.profit), parseFloat(roiResult.tiers.standard.profit))) * 100))}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Standard row */}
                    <div className="roi-bar-row">
                      <div className="roi-bar-labels">
                        <span className="roi-bar-name">Standard Feed Profit</span>
                        <span className="roi-bar-val">₹{parseInt(roiResult.tiers.standard.profit).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="roi-bar-track">
                        <div 
                          className="roi-bar-fill standard" 
                          style={{ 
                            width: `${Math.max(10, Math.min(100, (parseFloat(roiResult.tiers.standard.profit) / Math.max(1, parseFloat(roiResult.tiers.premium.profit), parseFloat(roiResult.tiers.standard.profit))) * 100))}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Premium row */}
                    <div className="roi-bar-row">
                      <div className="roi-bar-labels">
                        <span className="roi-bar-name">Premium Feed Profit</span>
                        <span className="roi-bar-val">₹{parseInt(roiResult.tiers.premium.profit).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="roi-bar-track">
                        <div 
                          className="roi-bar-fill premium" 
                          style={{ 
                            width: `${Math.max(10, Math.min(100, (parseFloat(roiResult.tiers.premium.profit) / Math.max(1, parseFloat(roiResult.tiers.premium.profit), parseFloat(roiResult.tiers.standard.profit))) * 100))}%` 
                          }}
                        />
                      </div>
                    </div>
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
                <h3>Live Sensor Telemetry</h3>

                {/* IoT Simulator Switch */}
                <div className="live-mode-toggle-container">
                  <div className="live-mode-title-area">
                    <div className={isLiveMode ? "live-indicator-pulsing" : ""} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: isLiveMode ? 'var(--aqua-glow)' : 'rgba(255,255,255,0.2)', transition: 'background-color 0.3s' }} />
                    <div className="live-mode-text-details" style={{ textAlign: 'left' }}>
                      <span className="live-mode-status-text">
                        {isLiveMode ? "🔌 Live IoT Telemetry Mode" : "⚙️ Manual Calibration Mode"}
                      </span>
                      <p className="live-mode-status-sub">
                        {isLiveMode ? "Active real-time pond sensors feed" : "Adjust inputs manually to evaluate thresholds"}
                      </p>
                    </div>
                  </div>
                  <button 
                    className={`iot-switch-btn ${isLiveMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsLiveMode(!isLiveMode);
                      // Reset overrides when toggling
                      setAerator1(false);
                      setAerator2(false);
                      setWaterExchange(false);
                      setBioFilter(false);
                      setBufferPump(false);
                    }}
                  >
                    <div className="iot-switch-dot" />
                  </button>
                </div>

                <div className={`scanline-overlay-container ${isLiveMode ? 'scanline-active' : ''}`} style={{ opacity: isLiveMode ? 0.85 : 1, pointerEvents: isLiveMode ? 'none' : 'auto', transition: 'all 0.3s' }}>
                  <div className="form-group slider-group">
                    <div className="slider-label-row">
                      <label>Dissolved Oxygen (DO)</label>
                      <span className="slider-value" style={{ color: diagDO < 4.0 ? 'var(--coral)' : 'var(--aqua-primary)' }}>
                        {diagDO.toFixed(2)} mg/L
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.1"
                      value={diagDO}
                      onChange={(e) => setDiagDO(parseFloat(e.target.value))}
                      disabled={isLiveMode}
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
                        {diagAmmonia.toFixed(3)} mg/L
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3.0"
                      step="0.01"
                      value={diagAmmonia}
                      onChange={(e) => setDiagAmmonia(parseFloat(e.target.value))}
                      disabled={isLiveMode}
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
                        {diagPH.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4.0"
                      max="10.0"
                      step="0.1"
                      value={diagPH}
                      onChange={(e) => setDiagPH(parseFloat(e.target.value))}
                      disabled={isLiveMode}
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
                      disabled={isLiveMode}
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
                      disabled={isLiveMode}
                    />
                    <div className="slider-limits">
                      <span>Freshwater (0)</span>
                      <span>Brackish (15)</span>
                      <span>Marine (35)</span>
                    </div>
                  </div>
                </div>

                {/* IoT Overrides Panel */}
                {isLiveMode && (
                  <div className="iot-overrides-section" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '10px' }}>
                    <h4 className="iot-panel-title">⚡ IoT Machinery Overrides</h4>
                    <div className="iot-grid">
                      <div className={`iot-card ${aerator1 ? 'active' : ''}`}>
                        <div className="iot-info">
                          <span className="iot-name">Aerator #1 🌀</span>
                          <span className="iot-desc">DO boost (+0.35/s)</span>
                        </div>
                        <button className={`iot-switch-btn ${aerator1 ? 'active' : ''}`} onClick={() => setAerator1(!aerator1)}>
                          <div className="iot-switch-dot" />
                        </button>
                      </div>
                      <div className={`iot-card ${aerator2 ? 'active' : ''}`}>
                        <div className="iot-info">
                          <span className="iot-name">Aerator #2 🌀</span>
                          <span className="iot-desc">DO boost (+0.35/s)</span>
                        </div>
                        <button className={`iot-switch-btn ${aerator2 ? 'active' : ''}`} onClick={() => setAerator2(!aerator2)}>
                          <div className="iot-switch-dot" />
                        </button>
                      </div>
                      <div className={`iot-card ${waterExchange ? 'active' : ''}`}>
                        <div className="iot-info">
                          <span className="iot-name">Water Flow Pump 🚰</span>
                          <span className="iot-desc">TAN dilution / stabilizes</span>
                        </div>
                        <button className={`iot-switch-btn ${waterExchange ? 'active' : ''}`} onClick={() => setWaterExchange(!waterExchange)}>
                          <div className="iot-switch-dot" />
                        </button>
                      </div>
                      <div className={`iot-card ${bioFilter ? 'active' : ''}`}>
                        <div className="iot-info">
                          <span className="iot-name">Bio-Filter 🦠</span>
                          <span className="iot-desc">TAN absorption (-0.08/s)</span>
                        </div>
                        <button className={`iot-switch-btn ${bioFilter ? 'active' : ''}`} onClick={() => setBioFilter(!bioFilter)}>
                          <div className="iot-switch-dot" />
                        </button>
                      </div>
                      <div className={`iot-card ${bufferPump ? 'active' : ''}`}>
                        <div className="iot-info">
                          <span className="iot-name">pH Dosing Pump 🧪</span>
                          <span className="iot-desc">Stabilize pH (neutral 7.2)</span>
                        </div>
                        <button className={`iot-switch-btn ${bufferPump ? 'active' : ''}`} onClick={() => setBufferPump(!bufferPump)}>
                          <div className="iot-switch-dot" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="tool-panel glass-card output-panel">
                <h3>Diagnostics Summary</h3>
                <div className="telemetry-box">
                  <div className="metric-circle-wrapper">
                    <div 
                      className={`metric-circle health-circle ${isLiveMode && diagResult.score < 80 ? 'live-indicator-pulsing' : ''}`} 
                      style={{ 
                        borderColor: diagResult.color, 
                        boxShadow: isLiveMode && diagResult.score < 80 ? `0 0 30px ${diagResult.color}` : 'none' 
                      }}
                    >
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

        {/* TAB 4: DISEASE DIAGNOSTICIAN (Option 2) */}
        {activeTab === 'disease' && (
          <div className="tools-content-wrapper">
            <div className="disease-wizard-card glass-card">
              {/* Wizard Steps Progress Indicator */}
              <div className="wizard-steps-header">
                <div 
                  className="wizard-step-progress-bar" 
                  style={{ width: `${(wizardStep - 1) * 50}%` }}
                />
                <div className={`wizard-step-node ${wizardStep >= 1 ? 'active' : ''} ${wizardStep > 1 ? 'completed' : ''}`}>
                  1
                  <span className="wizard-step-label">1. Bio-profile</span>
                </div>
                <div className={`wizard-step-node ${wizardStep >= 2 ? 'active' : ''} ${wizardStep > 2 ? 'completed' : ''}`}>
                  2
                  <span className="wizard-step-label">2. Symptoms</span>
                </div>
                <div className={`wizard-step-node ${wizardStep >= 3 ? 'active' : ''} ${wizardStep > 3 ? 'completed' : ''}`}>
                  3
                  <span className="wizard-step-label">3. Diagnosis</span>
                </div>
              </div>

              {/* Step 1: Bio-Profile Setup */}
              {wizardStep === 1 && (
                <div className="wizard-step-panel">
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--aqua-bright)', marginBottom: '10px' }}>Setup Bio-Profile</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(224, 232, 240, 0.7)', lineHeight: '1.6' }}>
                      Configure the target species and water volume parameters. This clinical wizard cross-references 
                      pathological databases to suggest medical dosages calibrated specifically for your farm's volume.
                    </p>
                  </div>

                  <div className="form-group" style={{ textAlign: 'left' }}>
                    <label>Target Species under Assessment</label>
                    <select value={diagSpecies} onChange={(e) => setDiagSpecies(e.target.value)}>
                      <option value="tilapia">Nile Tilapia (Warmwater Finfish)</option>
                      <option value="salmon">Atlantic Salmon (Coldwater Salmonids)</option>
                      <option value="shrimp">White Shrimp (Penaeid Crustaceans)</option>
                      <option value="catfish">African Catfish (Siluriformes Species)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ textAlign: 'left' }}>
                    <label>Pond Water Volume (Imported from Stocking Density settings)</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={`${Math.round(waterVolumeM3).toLocaleString()} m³`}
                        readOnly 
                        style={{ 
                          background: 'rgba(0, 0, 0, 0.25)', 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          cursor: 'not-allowed', 
                          border: '1px solid var(--glass-border)',
                          padding: '12px 16px',
                          borderRadius: 'var(--border-radius-sm)',
                          fontSize: '0.92rem',
                          width: '180px'
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                        ({Math.round(waterVolumeLiters).toLocaleString()} Liters capacity)
                      </span>
                    </div>
                    {waterVolumeM3 <= 1 && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--sunset-orange)', marginTop: '6px' }}>
                        ⚠️ Notice: Pond volume is set to minimum. Setup custom lengths and depths under the **Smart Calculators &gt; Stocking Density** tab to enable auto-scaled dosage calculations.
                      </p>
                    )}
                  </div>

                  <div className="wizard-footer-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="wizard-btn-next" onClick={() => setWizardStep(2)}>
                      Proceed to Symptoms Survey &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Symptom Survey */}
              {wizardStep === 2 && (
                <div className="wizard-step-panel">
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--aqua-bright)', marginBottom: '6px' }}>Symptom Checklist Survey</h3>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(224, 232, 240, 0.65)' }}>
                      Observe your aquatic stocks carefully and check all active behavioral or physical markers.
                    </p>
                  </div>

                  <div className="symptom-groups-grid">
                    {/* Behavioral symptoms */}
                    <div className="symptom-column">
                      <h4>Behavioral Anomalies</h4>
                      <div className="symptoms-list-flex">
                        {[
                          { id: 'lethargy', label: 'Lethargic swimming / resting on floor', icon: '💤' },
                          { id: 'surface_gasping', label: 'Gasping at water surface (Hypoxia signs)', icon: '👄' },
                          { id: 'flashing', label: 'Flashing / scratching bodies on pond sides', icon: '💥' },
                          { id: 'anorexia', label: 'Severe loss of appetite / feed refusal', icon: '🍽️' },
                        ].map((item) => (
                          <div 
                            key={item.id}
                            className={`symptom-check-card ${symptomChecklist[item.id] ? 'checked' : ''}`}
                            onClick={() => setSymptomChecklist({ ...symptomChecklist, [item.id]: !symptomChecklist[item.id] })}
                          >
                            <div className="symptom-checkbox-custom">
                              ✓
                            </div>
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            <span className="symptom-label">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Physical symptoms */}
                    <div className="symptom-column">
                      <h4>Physical & Carapace Symptoms</h4>
                      <div className="symptoms-list-flex">
                        {[
                          { id: 'white_spots', label: 'White spots on skin, scales, or shell', icon: '⚪' },
                          { id: 'frayed_fins', label: 'Frayed, bleeding, or eroded fins / tail', icon: '🩹' },
                          { id: 'cloudy_eyes', label: 'Cloudy, bulging, or swollen eyes', icon: '👁️' },
                          { id: 'gills_rot', label: 'Swollen, pale, or brown necrotic gills', icon: '🐟' },
                          { id: 'cotton_growths', label: 'Fuzzy cotton-like patches on body', icon: '☁️' },
                          { id: 'black_shell', label: 'Black spots / gills (shrimp shell rot)', icon: '🌑' },
                        ].map((item) => (
                          <div 
                            key={item.id}
                            className={`symptom-check-card ${symptomChecklist[item.id] ? 'checked' : ''}`}
                            onClick={() => setSymptomChecklist({ ...symptomChecklist, [item.id]: !symptomChecklist[item.id] })}
                          >
                            <div className="symptom-checkbox-custom">
                              ✓
                            </div>
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            <span className="symptom-label">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="wizard-footer-actions">
                    <button className="wizard-btn-back" onClick={() => setWizardStep(1)}>
                      &larr; Back
                    </button>
                    <button className="wizard-btn-next" onClick={() => setWizardStep(3)}>
                      Diagnose Aquatic Stock &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Diagnostic Report */}
              {wizardStep === 3 && (
                <div className="wizard-step-panel">
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--aqua-bright)', marginBottom: '6px' }}>Aquaculture Diagnostic Report</h3>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(224, 232, 240, 0.65)' }}>
                      Below are the computed probability matches and veterinary-recommended treatments based on stock pathology.
                    </p>
                  </div>

                  {Object.values(symptomChecklist).some(val => val) ? (
                    <div className="tool-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
                      {/* Primary diagnosis */}
                      <div className="diagnosis-report-card">
                        <div className="report-header-row">
                          <div className="report-title-meta">
                            <h4>{diseaseDiagnosisResult[0].name}</h4>
                            <p>Primary Pathogen Suspect</p>
                          </div>
                          <span className="report-confidence-badge" style={{ 
                            background: diseaseDiagnosisResult[0].probability > 60 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 159, 67, 0.15)',
                            borderColor: diseaseDiagnosisResult[0].probability > 60 ? 'var(--coral)' : 'var(--sunset-orange)',
                            color: diseaseDiagnosisResult[0].probability > 60 ? 'var(--coral-soft)' : 'var(--sunset-orange)'
                          }}>
                            {diseaseDiagnosisResult[0].probability}% Match
                          </span>
                        </div>

                        <div className="report-body-section">
                          <span className="report-section-title">Description</span>
                          <p className="report-body-text">{diseaseDiagnosisResult[0].desc}</p>
                        </div>

                        <div className="prescription-box">
                          <span className="prescription-title">💊 Veterinary Treatment Recipe</span>
                          <span className="prescription-dose">{diseaseDiagnosisResult[0].presDose}</span>
                          
                          {waterVolumeM3 > 1 && diseaseDiagnosisResult[0].dosePerM3 > 0 ? (
                            <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', margin: '4px 0' }}>
                              <strong style={{ color: 'var(--aqua-glow)', fontSize: '0.85rem' }}>
                                Calibrated Volume Dose Recommendation:
                              </strong>
                              <p style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 'bold', margin: '4px 0' }}>
                                Total Dosage: {(diseaseDiagnosisResult[0].dosePerM3 * waterVolumeM3).toFixed(2)} {diseaseDiagnosisResult[0].doseUnit}
                              </p>
                              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                                Calibrated for your {Math.round(waterVolumeM3)} m³ pond setup (dose rate of {diseaseDiagnosisResult[0].dosePerM3} {diseaseDiagnosisResult[0].doseUnit}/m³).
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', margin: '4px 0' }}>
                              Setup custom dimensions in the Stocking Density tab to get automatically scaled bulk quantity dosage.
                            </span>
                          )}

                          <p className="prescription-instructions">
                            <strong>Administration Instructions:</strong> {diseaseDiagnosisResult[0].presInst}
                          </p>
                        </div>
                      </div>

                      {/* Secondary matches */}
                      <div className="tool-panel glass-card" style={{ padding: '24px', gap: '16px' }}>
                        <h4 style={{ fontSize: '1rem', color: '#fff', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                          Differential Diagnoses
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', textAlign: 'left', marginTop: '-8px' }}>
                          Other matching pathogens to consider:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {diseaseDiagnosisResult.slice(1).map((dis, idx) => (
                            <div key={idx} style={{ textAlign: 'left' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{dis.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: dis.probability > 30 ? 'var(--sunset-orange)' : 'rgba(255,255,255,0.4)' }}>
                                  {dis.probability}% Match
                                </span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
                                {dis.desc.slice(0, 85)}...
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="alarm-box" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderColor: 'var(--glass-border)' }}>
                      <span style={{ fontSize: '2.5rem' }}>🩺</span>
                      <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '12px 0 6px' }}>No Symptoms Checked</h4>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', maxWidth: '400px', margin: '0 auto' }}>
                        You did not check any symptom markers. Please return to the checklist step and specify active behaviors or visual markings on your stock.
                      </p>
                    </div>
                  )}

                  <div className="wizard-footer-actions">
                    <button className="wizard-btn-back" onClick={() => setWizardStep(2)}>
                      &larr; Return to Symptoms
                    </button>
                    <button 
                      className="wizard-btn-back" 
                      onClick={() => {
                        // Reset symptom Checklist
                        setSymptomChecklist({
                          lethargy: false,
                          surface_gasping: false,
                          flashing: false,
                          anorexia: false,
                          white_spots: false,
                          frayed_fins: false,
                          cloudy_eyes: false,
                          gills_rot: false,
                          cotton_growths: false,
                          black_shell: false
                        });
                        setWizardStep(1);
                      }}
                      style={{ border: '1px solid rgba(0, 212, 170, 0.3)', color: 'var(--aqua-primary)' }}
                    >
                      🔄 Reset & Diagnose Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
