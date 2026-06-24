import { useState, useEffect, useRef } from 'react';

export default function SpeciesGallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [activeTab, setActiveTab] = useState('parameters');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const species = [
    {
      name: 'Rohu',
      scientific: 'Labeo rohita',
      category: 'Fish',
      emoji: '🐟',
      desc: 'The most popular Indian Major Carp. A column feeder highly valued across Indian freshwater markets.',
      tag: 'Indian Major Carp',
      params: { temp: '24°C - 32°C', ph: '6.5 - 8.2', salinity: '0 - 5 ppt', oxygen: '> 3.5 mg/L' },
      diseases: [
        {
          name: 'Epizootic Ulcerative Syndrome (EUS)',
          symptoms: 'Red spots on scales, bleeding patches, eroding skin leading to deep necrotizing ulcers.',
          causes: 'Fungal spores of Aphanomyces invadans invading skin lesions during low water temperature seasons.',
          treatment: 'Apply CIFAX at 1 liter/hectare-meter. Alternatively, treat pond water with potassium permanganate (KMnO4) at 2-3 ppm.'
        },
        {
          name: 'Fin Rot & Tail Rot',
          symptoms: 'Fraying and disintegration of tail or pectoral fins, white margins, bleeding at fin stumps.',
          causes: 'Flexibacter columnaris or Aeromonas hydrophila bacteria, exacerbated by high sludge accumulation.',
          treatment: 'Flush pond water; treat with Copper Sulfate (0.5 ppm) and mix Oxytetracycline antibiotic in feed (50mg/kg fish).'
        }
      ]
    },
    {
      name: 'Catla',
      scientific: 'Catla catla',
      category: 'Fish',
      emoji: '🐠',
      desc: 'Fastest-growing Indian Major Carp. A surface feeder that feeds on zooplankton.',
      tag: 'Surface Carp',
      params: { temp: '25°C - 32°C', ph: '6.8 - 8.5', salinity: '0 - 3 ppt', oxygen: '> 4.0 mg/L' },
      diseases: [
        {
          name: 'Argulosis (Fish Lice)',
          symptoms: 'Visible disk-shaped crawling parasites on skin/gills, flashing/rubbing against pond walls, skin bleeding.',
          causes: 'Argulus crustacean parasite. Thrives in highly stocked organic ponds.',
          treatment: 'Apply Deltamethrin (e.g. Butox) at 15 ml per acre-meter of water. Repeat after 2 weeks to kill hatched eggs.'
        },
        {
          name: 'Dropsy (Infectious Dropsy of Carps)',
          symptoms: 'Swollen abdomen filled with yellow fluid, scales standing erect (pinecone appearance), bulging eyes.',
          causes: 'Internal systemic infection by Aeromonas or Pseudomonas bacteria, leading to organ failure.',
          treatment: 'Disinfect pond with Calcium Oxide (Quicklime) at 100 kg/acre. Feed medicated feed containing oxytetracycline.'
        }
      ]
    },
    {
      name: 'Mrigal',
      scientific: 'Cirrhinus mrigala',
      category: 'Fish',
      emoji: '🐟',
      desc: 'An essential bottom-feeding carp in Indian polyculture. Utilizes detritus and decaying organic matters.',
      tag: 'Bottom Carp',
      params: { temp: '22°C - 32°C', ph: '6.5 - 8.0', salinity: '0 - 6 ppt', oxygen: '> 3.0 mg/L' },
      diseases: [
        {
          name: 'Black Spot Disease (Diplostomiasis)',
          symptoms: 'Small, raised, circular black spots (1-3mm) scattered on scales, skin, and fins.',
          causes: 'Metacercariae larvae of digenetic trematodes, carried into ponds by water snails and aquatic birds.',
          treatment: 'Control pond snails by clearing floating aquatic weeds. Apply copper sulfate (2 ppm) to eradicate snail hosts.'
        },
        {
          name: 'Gill Rot (Branchiomycosis)',
          symptoms: 'Gills showing greyish-white marbled patches, decaying gill tissue, fish gasping for air near surface.',
          causes: 'Branchiomyces demigrans (fungus) germinating in high organic/warm ponds.',
          treatment: 'Immediately pump in fresh water to dilute pond. Apply quicklime at 150 kg/hectare to sanitize the water.'
        }
      ]
    },
    {
      name: 'Pacific White Shrimp',
      scientific: 'Litopenaeus vannamei',
      category: 'Shrimp & Prawn',
      emoji: '🦐',
      desc: 'The dominant shrimp farmed in India. Highly productive in intensive and semi-intensive biofloc ponds.',
      tag: 'Major Export Shrimp',
      params: { temp: '26°C - 32°C', ph: '7.5 - 8.3', salinity: '10 - 30 ppt', oxygen: '> 4.5 mg/L' },
      diseases: [
        {
          name: 'White Spot Syndrome (WSSV)',
          symptoms: 'Circular chalky white patches on the inside of shell/carapace, pink-to-red discoloration, 100% mortality in 3 days.',
          causes: 'White Spot Syndrome Virus (WSSV), spread by wild crabs, birds, or infected seed stocks.',
          treatment: 'Strict biosecurity using bird fencing and crab barriers. Disinfect water with Chlorine (30 ppm) before stocking.'
        },
        {
          name: 'Early Mortality Syndrome (AHPND / EMS)',
          symptoms: 'Pale and shrunken hepatopancreas, empty gut, swimming near bottom, mass mortality within 35 days of stocking.',
          causes: 'Vibrio parahaemolyticus bacteria carrying PirA/PirB toxin genes.',
          treatment: 'Apply regular high-grade Bacillus probiotics to outcompete Vibrio. Maintain low organic bottom sludge.'
        },
        {
          name: 'Running Mortality Syndrome (RMS)',
          symptoms: 'Slow, steady death of shrimp starting 40-50 days after stocking, shrunken gut, lethargy.',
          causes: 'Combined bacterial/parasitic stress aggravated by crowded pond conditions.',
          treatment: 'Decrease feeding rates; flush out bottom waste; apply mineral supplements to aid moulting.'
        }
      ]
    },
    {
      name: 'Giant Tiger Prawn',
      scientific: 'Penaeus monodon',
      category: 'Shrimp & Prawn',
      emoji: '🦐',
      desc: 'Traditional high-value tiger shrimp. Famous for its large size, color, and premium export value.',
      tag: 'Tiger Shrimp',
      params: { temp: '26°C - 31°C', ph: '7.6 - 8.4', salinity: '15 - 28 ppt', oxygen: '> 4.0 mg/L' },
      diseases: [
        {
          name: 'Black Gill Disease',
          symptoms: 'Brownish-black discoloration of gills, gill filament rot, prawns gasping for oxygen at surface.',
          causes: 'Fusarium fungal infection or heavy accumulation of organic sludge blocking the gill chambers.',
          treatment: 'Apply Zeolite to bind organic gasses. Perform water exchanges to reduce organic load, and use probiotics.'
        },
        {
          name: 'Monodon Baculovirus (MBV)',
          symptoms: 'Stunted growth, shell fouling with heavy algal growth, shrunken pale digestive gland, sluggishness.',
          causes: 'MBV occluded virus, transmitted through infected hatcheries.',
          treatment: 'Purchase SPF (Specific Pathogen Free) post-larvae. Treat hatcheries with clean filtered water.'
        }
      ]
    },
    {
      name: 'Giant Freshwater Prawn',
      scientific: 'Macrobrachium rosenbergii',
      category: 'Shrimp & Prawn',
      emoji: '🦐',
      desc: 'Locally known as Scampi in India. Farmed extensively in freshwater ponds, often alongside carps.',
      tag: 'Freshwater Scampi',
      params: { temp: '25°C - 31°C', ph: '7.0 - 8.2', salinity: '0 - 5 ppt', oxygen: '> 4.0 mg/L' },
      diseases: [
        {
          name: 'White Tail Disease (WTD)',
          symptoms: 'Abdominal/tail muscles turn milky white, loss of swimming ability, mass death in larval/post-larval stages.',
          causes: 'Macrobrachium rosenbergii nodavirus (MrNV), highly contagious.',
          treatment: 'Sanitize hatchery tanks with chlorine. Disinfect eggs with formalin or iodophores. Use certified clean stock.'
        },
        {
          name: 'Black Spot / Shell Disease',
          symptoms: 'Melanised brown/black spots on shell, claw, and body, shell erosion, bacterial entry points.',
          causes: 'Opportunistic chitinolytic bacteria growing in poorly managed pond bottoms.',
          treatment: 'Conduct water exchanges; apply sanitizers like BKC (Benzalkonium Chloride) at 0.5-1 ppm; add mineral mix.'
        }
      ]
    },
    {
      name: 'Asian Sea Bass (Barramundi)',
      scientific: 'Lates calcarifer',
      category: 'Fish',
      emoji: '🐟',
      desc: 'Locally called Bhetki in India. A high-value marine and brackishwater carnivore fish farmed in cages and ponds.',
      tag: 'Premium Coastal Bhetki',
      params: { temp: '26°C - 32°C', ph: '7.5 - 8.5', salinity: '5 - 35 ppt', oxygen: '> 4.5 mg/L' },
      diseases: [
        {
          name: 'Vibriosis (Bacterial Septicemia)',
          symptoms: 'Hemorrhagic sores on belly/gills, tail rot, cloudy eyes, sluggish loop-swimming.',
          causes: 'Vibrio harveyi or Vibrio alginolyticus bacteria multiplying under poor water conditions.',
          treatment: 'Dip cage-farmed fish in fresh water for 5 minutes. Feed oxytetracycline (75mg/kg fish weight) in feed.'
        },
        {
          name: 'Viral Nervous Necrosis (VNN)',
          symptoms: 'Loop-swimming, resting upside down, dark body, vacuolation in brain and retina. High fry mortality.',
          causes: 'Nodavirus infection. Highly contagious.',
          treatment: 'Use SPF certified fingerlings. Maintain high biosecurity. Isolate and quarantine infected stocks immediately.'
        }
      ]
    },
    {
      name: 'Pangasius Catfish',
      scientific: 'Pangasianodon hypophthalmus',
      category: 'Fish',
      emoji: '🐟',
      desc: 'High-density freshwater catfish farmed extensively in Andhra Pradesh. Highly resistant and profitable.',
      tag: 'High Yield Catfish',
      params: { temp: '25°C - 32°C', ph: '6.5 - 8.0', salinity: '0 - 2 ppt', oxygen: '> 2.5 mg/L' },
      diseases: [
        {
          name: 'Bacillary Necrosis of Pangasius (BNP)',
          symptoms: 'Internal white necrosis spots on kidney, spleen, and liver. Swollen stomach and red anus.',
          causes: 'Edwardsiella ictaluri bacteria. Spreads rapidly in crowded catfish ponds.',
          treatment: 'Apply Florfenicol or Oxytetracycline antibiotics in feed (7-10 days). Disinfect with potassium permanganate.'
        },
        {
          name: 'Trichodinosis (Mucus Disease)',
          symptoms: 'Excessive mucus body sheen, skin scratching, ragged fins, gills congestion.',
          causes: 'Ciliated protozoan parasite Trichodina.',
          treatment: 'Treat the pond with Formalin at 15-20 ppm. Alternatively, apply salt baths (2-3%) for fingerlings.'
        }
      ]
    },
    {
      name: 'Nile Tilapia',
      scientific: 'Oreochromis niloticus',
      category: 'Fish',
      emoji: '🐠',
      desc: 'Highly tolerant monosex Tilapia grown across Indian freshwater resources. High growth rate and yield.',
      tag: 'Farmed Tilapia',
      params: { temp: '24°C - 31°C', ph: '6.5 - 8.2', salinity: '0 - 8 ppt', oxygen: '> 3.0 mg/L' },
      diseases: [
        {
          name: 'Streptococcosis',
          symptoms: 'Exophthalmia (bulging eye), spinning swimming, hemorrhages on fin bases, dark skin color.',
          causes: 'Streptococcus agalactiae bacterial infection triggered by high temp and feed stress.',
          treatment: 'Reduce stocking density; apply water sanitizers. Feed antibiotic Florfenicol in feed for 7 days.'
        },
        {
          name: 'Tilapia Lake Virus (TiLV)',
          symptoms: 'Skin scaling, open bleeding lesions, cataracts in eyes, abdominal swelling, sudden 90%+ deaths.',
          causes: 'Tilapia Lake Virus (TiLV) infection. Highly contagious.',
          treatment: 'Eradicate infected cages. Apply strict biosecurity. No vaccine or chemical cure exists.'
        }
      ]
    },
    {
      name: 'Mud Crab',
      scientific: 'Scylla serrata',
      category: 'Crab',
      emoji: '🦀',
      desc: 'Cultured in mangrove estuaries of West Bengal, Andhra, and Kerala. Highly prized for meat.',
      tag: 'Estuary Mud Crab',
      params: { temp: '25°C - 32°C', ph: '7.5 - 8.5', salinity: '15 - 30 ppt', oxygen: '> 4.0 mg/L' },
      diseases: [
        {
          name: 'Rust Shell Disease',
          symptoms: 'Pitted brownish-black rust spots on shell and appendages, shell rot, crab dies while moulting.',
          causes: 'Chitin-dissolving bacteria invading claw wounds from territorial fighting.',
          treatment: 'Lower crab stocking densities. Place PVC shelter pipes in ponds. Disinfect pond bottom with lime.'
        },
        {
          name: 'White Spot Infection (Crab WSSV)',
          symptoms: 'White chalky spots inside carapace, lethargy, leg paralysis.',
          causes: 'Wild mud crabs acting as hosts for White Spot Syndrome Virus.',
          treatment: 'Screen mud crab seed using PCR. Prevent wild crabs from entering commercial shrimp/fish ponds.'
        }
      ]
    },
    {
      name: 'Kappaphycus Seaweed',
      scientific: 'Kappaphycus alvarezii',
      category: 'Seaweed',
      emoji: '🌿',
      desc: 'Cultured extensively along the Tamil Nadu coast for industrial carrageenan extraction.',
      tag: 'Carrageenan Seaweed',
      params: { temp: '25°C - 30°C', ph: '7.8 - 8.4', salinity: '28 - 34 ppt', oxygen: '> 5.0 mg/L' },
      diseases: [
        {
          name: 'Ice-Ice Disease',
          symptoms: 'Bleaching of seaweed branches into stark white, look like ice chunks, branches become brittle and snap.',
          causes: 'High water temperatures, low salinity, or light stress causing secondary bacterial attacks.',
          treatment: 'Sink seaweed culture rafts to deeper, cooler water. Avoid growing seaweed during peak summer months.'
        },
        {
          name: 'Epiphytic Algal Infection',
          symptoms: 'Hairy black filaments (Polysiphonia) covering seaweed branch surfaces, choking out sunlight, branch decay.',
          causes: 'Epiphytic red algae invading seaweed tissues in slow-moving water.',
          treatment: 'Select only clean, healthy branches for seedlings. Increase water flow by thinning raft distributions.'
        }
      ]
    }
  ];

  const categories = ['All', 'Fish', 'Shrimp & Prawn', 'Crab', 'Seaweed'];
  const filtered = activeFilter === 'All' ? species : species.filter(s => s.category === activeFilter);

  return (
    <section className="species" id="species" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Diagnostic Species Library
          </div>
          <h2 className="section-title">Aquacultural Species & Diagnostics</h2>
          <p className="section-subtitle">
            Hover over or click on any species to launch the interactive AI Diagnostic Panel, 
            detailing water parameters, diseases, symptoms, and prevention remedies.
          </p>
        </div>

        <div className="species-filters reveal">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="species-grid">
          {filtered.map((sp, i) => (
            <div
              key={sp.name}
              className="species-card"
              style={{ transitionDelay: `${i * 0.05}s` }}
              onClick={() => {
                setSelectedSpecies(sp);
                setActiveTab('parameters');
              }}
            >
              <span className="species-tag">{sp.tag}</span>
              <div className="species-image">
                <span style={{ position: 'relative', zIndex: 2 }}>{sp.emoji}</span>
              </div>
              <div className="species-info">
                <h3>{sp.name}</h3>
                <div className="scientific-name">{sp.scientific}</div>
                <p>{sp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Diagnostic Modal Drawer */}
      {selectedSpecies && (
        <div className="species-modal-backdrop" onClick={() => setSelectedSpecies(null)}>
          <div className="species-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedSpecies(null)}>×</button>
            
            <div className="modal-header">
              <span className="modal-emoji">{selectedSpecies.emoji}</span>
              <div>
                <h2>{selectedSpecies.name}</h2>
                <div className="scientific-name">{selectedSpecies.scientific}</div>
              </div>
              <span className="modal-tag">{selectedSpecies.tag}</span>
            </div>

            <p className="modal-desc">{selectedSpecies.desc}</p>

            <div className="modal-tabs">
              <button 
                className={`modal-tab-btn ${activeTab === 'parameters' ? 'active' : ''}`}
                onClick={() => setActiveTab('parameters')}
              >
                📊 Optimal Parameters
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'diseases' ? 'active' : ''}`}
                onClick={() => setActiveTab('diseases')}
              >
                🔬 Disease & Remedies
              </button>
            </div>

            <div className="modal-body">
              {activeTab === 'parameters' ? (
                <div className="modal-parameters-grid">
                  <div className="parameter-item">
                    <span className="param-icon">🌡️</span>
                    <div className="param-info">
                      <label>Water Temperature</label>
                      <div className="param-val">{selectedSpecies.params.temp}</div>
                    </div>
                  </div>
                  <div className="parameter-item">
                    <span className="param-icon">🧪</span>
                    <div className="param-info">
                      <label>pH Level</label>
                      <div className="param-val">{selectedSpecies.params.ph}</div>
                    </div>
                  </div>
                  <div className="parameter-item">
                    <span className="param-icon">🧂</span>
                    <div className="param-info">
                      <label>Salinity Range</label>
                      <div className="param-val">{selectedSpecies.params.salinity}</div>
                    </div>
                  </div>
                  <div className="parameter-item">
                    <span className="param-icon">🫧</span>
                    <div className="param-info">
                      <label>Dissolved Oxygen</label>
                      <div className="param-val">{selectedSpecies.params.oxygen}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="modal-diseases-list">
                  {selectedSpecies.diseases.map((dis, idx) => (
                    <div key={idx} className="modal-disease-item">
                      <h4>👾 {dis.name}</h4>
                      <div className="disease-details-grid">
                        <div className="detail-row">
                          <strong>⚠️ Symptoms:</strong>
                          <p>{dis.symptoms}</p>
                        </div>
                        <div className="detail-row">
                          <strong>🔬 Cause:</strong>
                          <p>{dis.causes}</p>
                        </div>
                        <div className="treatment-box">
                          <strong>🛡️ Prevention & Treatment:</strong>
                          <p>{dis.treatment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
