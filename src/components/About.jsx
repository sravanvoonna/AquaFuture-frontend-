import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const offlineAdvisoryTranslations = {
  en: {
    title: "Water Analysis Status",
    currentPosition: "Current Position",
    noIssues: "no major chemical stress parameters",
    howToImprove: "How to Improve Quality",
    increaseDo: "Increase DO: Turn on your paddlewheel aerators immediately. Turn off feed cycles temporarily to prevent oxygen absorption by bottom waste. Apply oxygen tablets if DO < 3.0.",
    bufferAcid: "Buffer Acidic pH: Apply Agricultural Lime (Calcium Carbonate, CaCO3) at 50 kg/acre to buffer the water acidity. Monitor salinity.",
    reduceAlkaline: "Reduce Alkaline pH: Apply gypsum (100 kg/acre) or fermented rice bran with yeast to generate organic acids and naturally drop high pH.",
    thermal: "Thermal Management: Increase water depth to at least 5-6 feet to allow a cooler bottom refuge. Run surface aerators during hot afternoons.",
    maintenance: "Maintenance: Maintain current organic probiotic dosing. Perform 10% water exchange weekly to prevent nutrient build-up."
  },
  hi: {
    title: "पानी विश्लेषण स्थिति",
    currentPosition: "वर्तमान स्थिति",
    noIssues: "कोई प्रमुख रासायनिक तनाव पैरामीटर नहीं",
    howToImprove: "गुणवत्ता में सुधार कैसे करें",
    increaseDo: "ऑक्सीजन बढ़ाएं: अपने पैडलव्हील एरेटर को तुरंत चालू करें। नीचे के कचरे द्वारा ऑक्सीजन अवशोषण को रोकने के लिए अस्थायी रूप से फ़ीड चक्रों को बंद करें। यदि DO < 3.0 है तो ऑक्सीजन टैबलेट डालें।",
    bufferAcid: "अम्लीय पीएच को संतुलित करें: पानी की अम्लता को संतुलित करने के लिए 50 किलोग्राम/एकड़ की दर से कृषि चूना (कैल्शियम कार्बोनेट, CaCO3) डालें। लवणता की निगरानी करें।",
    reduceAlkaline: "क्षारीय पीएच कम करें: कार्बनिक अम्ल उत्पन्न करने और स्वाभाविक रूप से उच्च पीएच को कम करने के लिए जिप्सम (100 किलोग्राम/एकड़) या खमीर के साथ किण्वित चावल की भूसी डालें।",
    thermal: "थर्मल प्रबंधन: ठंडे तल का आश्रय देने के लिए पानी की गहराई कम से कम 5-6 फीट तक बढ़ाएं। गर्म दोपहर के दौरान सतह एरेटर चलाएं।",
    maintenance: "रखरखाव: वर्तमान जैविक प्रोबायोटिक खुराक बनाए रखें। पोषक तत्वों के निर्माण को रोकने के लिए साप्ताहिक रूप से 10% पानी का आदान-प्रदान करें।"
  },
  te: {
    title: "నీటి విశ్లేషణ స్థితి",
    currentPosition: "ప్రస్తుత పరిస్థితి",
    noIssues: "ఎలాంటి రసాయన ఒత్తిడి పారామితులు లేవు",
    howToImprove: "నాణ్యతను మెరుగుపరచడం ఎలా",
    increaseDo: "ఆక్సిజన్ పెంచండి: మీ పెడల్‌వీల్ ఏరేటర్లను వెంటనే ఆన్ చేయండి. అడుగున ఉన్న వ్యర్థాల ద్వారా ఆక్సిజన్ గ్రహించకుండా ఉండటానికి తాత్కాలికంగా ఫీడింగ్ ఆపివేయండి. DO < 3.0 ఉంటే ఆక్సిజన్ మాత్రలు వేయండి.",
    bufferAcid: "ఆమ్ల pH ని నియంత్రించండి: నీటి ఆమ్లత్వాన్ని తగ్గించడానికి ఎకరానికి 50 కేజీల వ్యవసాయ సున్నం (కాల్షియం కార్బోనేట్, CaCO3) వేయండి. ఉప్పు శాతాన్ని గమనించండి.",
    reduceAlkaline: "క్షార pH ని తగ్గించండి: సహజంగా ఎక్కువ pH ని తగ్గించడానికి జిప్సం (ఎకరానికి 100 కేజీలు) లేదా ఈస్ట్‌తో పులియబెట్టిన వరి పొట్టును వాడండి.",
    thermal: "ఉష్ణోగ్రత నియంత్రణ: చల్లటి నీరు లభించడానికి నీటి లోతును కనీసం 5-6 అడుగులకు పెంచండి. ఎండ మధ్యాహ్నం వేళల్లో ఉపరితల ఏరేటర్లను నడపండి.",
    maintenance: "నిర్వహణ: ప్రస్తుత సేంద్రీయ ప్రోబయోటిక్ డోసింగ్‌ను కొనసాగించండి. పోషకాలు చేరకుండా ఉండటానికి వారానికి 10% నీటి మార్పిడి చేయండి."
  },
  ta: {
    title: "நீர் பகுப்பாய்வு நிலை",
    currentPosition: "தற்போதைய நிலை",
    noIssues: "பெரிய இரசாயன அழுத்த அளவுருக்கள் இல்லை",
    howToImprove: "நீரின் தரத்தை எவ்வாறு மேம்படுத்துவது",
    increaseDo: "ஆக்ஸிஜனை அதிகரிக்கவும்: உங்கள் காற்றோட்ட சக்கரங்களை உடனடியாக இயக்கவும். அடியில் உள்ள கழிவுகள் ஆக்ஸிஜனை உறிஞ்சுவதைத் தடுக்க தற்காலிகமாக தீவனம் வழங்குவதை நிறுத்தவும். DO < 3.0 ஆக இருந்தால் ஆக்ஸிஜன் மாத்திரைகளைப் பயன்படுத்தவும்.",
    bufferAcid: "அமில pH-ஐ கட்டுப்படுத்தவும்: நீரின் அமிலத்தன்மையைக் குறைக்க ஏக்கருக்கு 50 கிலோ வீதம் விவசாய சுண்ணாம்பு (கால்சியம் கார்பனேட், CaCO3) பயன்படுத்தவும். உவர்ப்புத்தன்மையைக் கண்காணிக்கவும்.",
    reduceAlkaline: "கார pH-ஐக் குறைக்கவும்: இயற்கை முறையில் அதிக pH-ஐக் குறைக்க ஜிப்சம் (ஏக்கருக்கு 100 கிலோ) அல்லது ஈஸ்ட் கலந்த தவிட்டினைப் பயன்படுத்தவும்.",
    thermal: "வெப்ப மேலாண்மை: அடியில் குளிர்ந்த புகலிடம் கிடைக்க நீரின் ஆழத்தை குறைந்தபட்சம் 5-6 அடியாக உயர்த்தவும். வெப்பமான பிற்பகலில் காற்றோட்ட சாதனங்களை இயக்கவும்.",
    maintenance: "பராமரிப்பு: தற்போதைய புரோபயாடிக் பயன்பாட்டைத் தொடரவும். சத்துக்கள் குவிவதைத் தடுக்க வாரந்தோறும் 10% நீர் பரிமாற்றம் செய்யவும்."
  }
};

export default function About() {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const { t, i18n } = useTranslation();

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
      issues.push(phVal < 6.5 ? t('about.waterMeter.acidicPh') : t('about.waterMeter.alkalinePh'));
    } else if (phVal < 7.2 || phVal > 8.4) {
      score -= 10;
      issues.push(phVal < 7.2 ? (t('about.waterMeter.mildAcidicPh') || 'Sub-optimal acidic pH') : (t('about.waterMeter.mildAlkalinePh') || 'Sub-optimal alkaline pH'));
    }

    if (doVal < 3.0) {
      score -= 35;
      issues.push(t('about.waterMeter.lowOxygen'));
    } else if (doVal < 4.8) {
      score -= 15;
      issues.push(t('about.waterMeter.oxygenStress'));
    }

    if (tempVal < 20 || tempVal > 35) {
      score -= 20;
      issues.push(tempVal < 20 ? t('about.waterMeter.lowTemp') : t('about.waterMeter.highTemp'));
    } else if (tempVal < 26 || tempVal > 32) {
      score -= 8;
      issues.push(tempVal < 26 ? (t('about.waterMeter.coolTemp') || 'Sub-optimal cooler water') : (t('about.waterMeter.warmTemp') || 'Elevated water temp'));
    }

    if (salinityVal < 5 || salinityVal > 32) {
      score -= 10;
      issues.push(t('about.waterMeter.salinityStress'));
    }

    score = Math.max(10, score);
    
    let rating = t('about.waterMeter.optimal');
    let statusClass = 'status-green';
    let advisory = t('about.waterMeter.advisoryOptimal') || 'All water parameters are currently in healthy, high-yield zones.';

    if (score < 55) {
      rating = t('about.waterMeter.critical');
      statusClass = 'status-red';
      advisory = t('about.waterMeter.advisoryCritical') || 'Immediate action required. Water parameters are in dangerous stress zones.';
    } else if (score < 80) {
      rating = t('about.waterMeter.warning');
      statusClass = 'status-yellow';
      advisory = t('about.waterMeter.advisoryWarning') || 'Minor adjustments needed to prevent species mortality or stress.';
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

    const currentLang = offlineAdvisoryTranslations[i18n.language] ? i18n.language : 'en';
    const activeText = offlineAdvisoryTranslations[currentLang];

    if (!apiUrl && (!apiKey || !endpoint)) {
      setTimeout(() => {
        let localAdvice = `### ${activeText.title}: ${waterStatus.rating} (${waterStatus.score}/100)\n\n`;
        localAdvice += `**${activeText.currentPosition}**: ${waterStatus.issues.length > 0 ? waterStatus.issues.join(', ') : activeText.noIssues}.\n\n`;
        localAdvice += `**${activeText.howToImprove}**:\n`;
        
        if (doLevel < 4.5) {
          localAdvice += `* 🔹 ${activeText.increaseDo}\n`;
        }
        if (ph < 7.0) {
          localAdvice += `* 🔹 ${activeText.bufferAcid}\n`;
        } else if (ph > 8.5) {
          localAdvice += `* 🔹 ${activeText.reduceAlkaline}\n`;
        }
        if (temp > 32) {
          localAdvice += `* 🔹 ${activeText.thermal}\n`;
        }
        if (waterStatus.issues.length === 0) {
          localAdvice += `* 🔹 ${activeText.maintenance}\n`;
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
            issues: waterStatus.issues,
            language: i18n.language
          })
        });

        if (!response.ok) throw new Error("API call failed");
        const resData = await response.json();
        setAiAdvisory(resData.advice.trim());
      } else {
        const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
        
        const languageNameMap = {
          en: 'English',
          hi: 'Hindi (in Devanagari script)',
          te: 'Telugu (in Telugu script)',
          ta: 'Tamil (in Tamil script)'
        };
        const currentLangName = languageNameMap[i18n.language] || 'English';

        const promptText = `Analyze this water quality status:
- pH Level: ${ph}
- Dissolved Oxygen (DO): ${doLevel} mg/L
- Temperature: ${temp}°C
- Salinity: ${salinity} ppt

Current score: ${waterStatus.score}/100 (Rating: ${waterStatus.rating})
Identified Issues: ${waterStatus.issues.join(', ') || 'None'}

Provide a brief, professional explanation of the water's present position and list 3-4 specific, actionable steps the aquaculture farmer must take to improve or maintain the water quality. Keep it concise, practical, and highly scientific.
IMPORTANT: The entire response MUST be fully translated and written in the ${currentLangName} language (in its native script).`;

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
    { icon: '🌊', title: t('about.tabWater'), desc: t('about.waterMeter.title') },
    { icon: '🧬', title: t('about.tabBreed'), desc: t('about.breedSelector.title') },
    { icon: '🌾', title: t('about.tabFeed'), desc: t('about.feedCalculator.title') },
    { icon: '🧪', title: t('about.tabDosing'), desc: t('about.limeDoser.title') },
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
                <span className="console-title">🤖 {t('about.consoleTitle') || 'AquaCare Analytics Console'}</span>
                <span className="node-status">
                  <span className="pulse-dot"></span> {t('about.interactiveMode') || 'Interactive Mode'}
                </span>
              </div>

              {/* Console Body */}
              <div className="console-body">
                {activeTab === 0 && (
                  <div className="telemetry-panel water-analytics-panel">
                    <h3 className="panel-title">🧪 {t('about.waterMeter.title')}</h3>
                    <div className="sliders-grid">
                      <div className="slider-group">
                        <label>{t('about.waterMeter.pH')}: <span>{ph.toFixed(1)}</span></label>
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
                        <label>{t('about.waterMeter.oxygen')}: <span>{doLevel.toFixed(1)} mg/L</span></label>
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
                        <label>{t('about.waterMeter.temp')}: <span>{temp}°C</span></label>
                        <input 
                          type="range" 
                          min="15" 
                          max="40" 
                          value={temp} 
                          onChange={(e) => { setTemp(parseInt(e.target.value)); setAiAdvisory(''); }} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>{t('about.waterMeter.salinity')}: <span>{salinity} ppt</span></label>
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
                        <span className="score-lbl">{t('about.waterMeter.status')}:</span>
                        <span className="score-val">{waterStatus.rating} ({waterStatus.score}/100)</span>
                      </div>
                      {waterStatus.issues.length > 0 && (
                        <div className="issues-list">
                          {t('about.waterMeter.alerts') || 'Alerts'}: {waterStatus.issues.join(', ')}
                        </div>
                      )}
                      <p className="score-advisory">{waterStatus.advisory}</p>
                    </div>

                    <button className="ai-advisory-btn" onClick={handleGenerateAiAdvisory} disabled={loadingAi}>
                      {loadingAi ? t('about.waterMeter.analyzing') || 'Analyzing Water Quality...' : `🔍 ${t('about.waterMeter.advisory') || 'Generate AI Water Advisory'}`}
                    </button>

                    {aiAdvisory && (
                      <div className="advisory-result-box">
                        <h4 className="advisory-title">🧪 {t('about.waterMeter.advisoryTitle') || 'Action Plan & Advisory:'}</h4>
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
                    <h3 className="panel-title">🧬 {t('about.breedSelector.title')}</h3>
                    <p className="panel-desc">{t('about.breedSelector.subtitle') || 'Select a target crop to forecast growth speed metrics and genetic viability.'}</p>
                    
                    <div className="breed-selectors">
                      {['Fish', 'Shrimp', 'Crab', 'Seaweed'].map((b) => (
                        <button 
                          key={b} 
                          className={`breed-btn ${selectedBreed === b ? 'active' : ''}`}
                          onClick={() => setSelectedBreed(b)}
                        >
                          {b === 'Fish' ? t('navbar.species') : (b === 'Shrimp' ? t('about.breedSelector.shrimp') || 'Shrimp' : (b === 'Crab' ? t('about.breedSelector.crab') || 'Crab' : t('about.breedSelector.seaweed') || 'Seaweed'))}
                        </button>
                      ))}
                    </div>

                    <div className="forecaster-card">
                      <div className="forecaster-row">
                        <span>{t('about.breedSelector.strain') || 'Genetic Strain'}:</span>
                        <strong className="text-cyan">
                          {selectedBreed === 'Fish' && 'Rohu SPF Jayanti (IMC)'}
                          {selectedBreed === 'Shrimp' && 'Vannamei Gen-V Super SPF'}
                          {selectedBreed === 'Crab' && 'Scylla Serrata Wild-Cross'}
                          {selectedBreed === 'Seaweed' && 'Kappaphycus Fast-Growth Red'}
                        </strong>
                      </div>
                      <div className="forecaster-row">
                        <span>{t('about.breedSelector.growth') || 'Growth Coefficient'}:</span>
                        <strong className="text-green">
                          {selectedBreed === 'Fish' && '+14% target cycle'}
                          {selectedBreed === 'Shrimp' && '+18% rapid moulting'}
                          {selectedBreed === 'Crab' && '+12% weight index'}
                          {selectedBreed === 'Seaweed' && '+22% thallus branching'}
                        </strong>
                      </div>
                      <div className="forecaster-row">
                        <span>{t('about.breedSelector.survival') || 'Disease Survival Chance'}:</span>
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
                    <h3 className="panel-title">🌾 {t('about.feedCalculator.title')}</h3>
                    <p className="panel-desc">{t('about.feedCalculator.subtitle') || 'Optimize feed conversion ratios (FCR) and calculate daily biomass feed splits.'}</p>
                    
                    <div className="sliders-grid">
                      <div className="slider-group">
                        <label>{t('about.feedCalculator.abw')}: <span>{abw} g</span></label>
                        <input 
                          type="range" 
                          min="2" 
                          max="150" 
                          value={abw} 
                          onChange={(e) => setAbw(parseInt(e.target.value))} 
                        />
                      </div>
                      <div className="slider-group">
                        <label>{t('about.feedCalculator.feedRate')}: <span>{feedRate.toFixed(1)}%</span></label>
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
                        <label>{t('about.feedCalculator.density')}: <span>{survivalCount.toLocaleString()} pcs</span></label>
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
                        <span>{t('about.feedCalculator.calculatedBiomass')}:</span>
                        <strong>{feedResult.biomass.toLocaleString()} kg</strong>
                      </div>
                      <div className="score-row">
                        <span>{t('about.feedCalculator.dailyFeed')}:</span>
                        <strong style={{ color: 'var(--aqua-bright)' }}>{feedResult.dailyFeed} kg / day</strong>
                      </div>
                    </div>

                    <div className="feed-splits-box">
                      <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'rgba(224, 232, 240, 0.45)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        📋 {t('about.feedCalculator.scheduleTitle') || 'Daily Split Schedule (FCR Friendly)'}:
                      </h4>
                      <div className="splits-grid" style={{ display: 'flex', gap: '8px' }}>
                        <div className="split-card" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', display: 'block', color: 'rgba(224, 232, 240, 0.4)' }}>🌅 {t('about.feedCalculator.morning') || 'Morning (35%)'}</span>
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{feedResult.morning} kg</strong>
                        </div>
                        <div className="split-card" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', display: 'block', color: 'rgba(224, 232, 240, 0.4)' }}>☀️ {t('about.feedCalculator.afternoon') || 'Afternoon (20%)'}</span>
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{feedResult.afternoon} kg</strong>
                        </div>
                        <div className="split-card" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', display: 'block', color: 'rgba(224, 232, 240, 0.4)' }}>🌇 {t('about.feedCalculator.evening') || 'Evening (45%)'}</span>
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{feedResult.evening} kg</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="telemetry-panel dosing-panel">
                    <h3 className="panel-title">🧪 {t('about.limeDoser.title')}</h3>
                    <p className="panel-desc">{t('about.limeDoser.subtitle') || 'Calculate exact soil buffering applications for acidic or alkaline ponds.'}</p>

                    <div className="sliders-grid">
                      <div className="slider-group">
                        <label>{t('about.limeDoser.area')}: <span>{pondArea.toFixed(1)} Ac</span></label>
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
                        <label>{t('about.limeDoser.targetPh')}: <span>{currentPh.toFixed(1)}</span></label>
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
                        <label>{t('about.limeDoser.phase')}</label>
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
                          <option value="PondPrep">{t('about.limeDoser.prep')}</option>
                          <option value="Active">{t('about.limeDoser.active')}</option>
                        </select>
                      </div>
                    </div>

                    {dosingResult.isCorrection ? (
                      <div className={`quality-scorecard ${currentPh < 7.0 ? 'status-yellow' : 'status-red'}`}>
                        <div className="score-row">
                          <span>{t('about.limeDoser.treatmentRequired') || 'Treatment Required'}:</span>
                          <strong style={{ color: 'var(--aqua-primary)' }}>{dosingResult.chemical}</strong>
                        </div>
                        <div className="score-row">
                          <span>{t('about.limeDoser.totalAmount') || 'Total Amount Needed'}:</span>
                          <strong style={{ fontSize: '1.25rem', color: '#fff' }}>{dosingResult.totalDose} kg</strong>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '6px', color: 'rgba(224, 232, 240, 0.55)', fontStyle: 'italic' }}>
                          💡 {dosingResult.statusMsg}
                        </p>
                      </div>
                    ) : (
                      <div className="quality-scorecard status-green">
                        <div className="score-row">
                          <span>{t('about.limeDoser.treatmentRequired') || 'Treatment Required'}:</span>
                          <strong style={{ color: 'var(--aqua-primary)' }}>{t('about.limeDoser.none') || 'None'}</strong>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(224, 232, 240, 0.7)' }}>
                          {t('about.limeDoser.optimalMsg') || 'Pond soil and water pH is optimal (7.0 - 8.5). Continue standard biosecurity protocols.'}
                        </p>
                      </div>
                    )}

                    {dosingResult.isCorrection && (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '4px' }}>
                        <h5 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'rgba(224, 232, 240, 0.45)', marginBottom: '4px' }}>
                          🛡️ {t('about.limeDoser.method') || 'Method of Application'}:
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
              {t('navbar.about') || 'About Our Platform'}
            </div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              {t('about.mainTitle') || 'Revolutionizing Aquaculture with Smart Technology'}
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(224, 232, 240, 0.65)',
              lineHeight: '1.9',
              marginBottom: '20px',
            }}>
              {t('about.mainDesc1') || 'AquaFuture is the next-generation platform designed for modern aqua farmers. We combine cutting-edge artificial intelligence, IoT sensor networks, and predictive analytics to help you maximize yields, reduce mortality rates, and build sustainable aquaculture operations.'}
            </p>
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(224, 232, 240, 0.55)',
              lineHeight: '1.9',
              marginBottom: '32px',
            }}>
              {t('about.mainDesc2') || 'Select any utility module below to interact with the Advisory Calculator console on the left and check parameters.'}
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
