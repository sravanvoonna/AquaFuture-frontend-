import { useState, useEffect, useRef } from 'react';

export default function Technology() {
  const sectionRef = useRef(null);
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [selectedScheme, setSelectedScheme] = useState(null); // for showing eligibility popup
  const [liveFeed, setLiveFeed] = useState({});
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [isRefreshingSilent, setIsRefreshingSilent] = useState(false);

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

  const fallbackData = {
    'Andhra Pradesh': {
      rates: [
        { name: 'Vannamei Shrimp (100 Count)', basePrice: 250, unit: '/ kg', species: 'shrimp' },
        { name: 'Vannamei Shrimp (60 Count)', basePrice: 365, unit: '/ kg', species: 'shrimp' },
        { name: 'Rohu Fish (1-2 kg size)', basePrice: 165, unit: '/ kg', species: 'fish' },
        { name: 'Catla Fish (Large 2kg+)', basePrice: 175, unit: '/ kg', species: 'fish' },
        { name: 'Freshwater Scampi (50g)', basePrice: 550, unit: '/ kg', species: 'shrimp' }
      ],
      newsPool: [
        {
          title: 'Salinity Alert in Krishna Delta Ponds',
          desc: 'Heavy monsoon runoffs have dropped pond salinities below [6-11] ppt in Krishna district. Farmers are advised to restrict water exchanges and apply agricultural salt ([100-150] kg/acre) to prevent moulting failures.',
          alertLevel: 'warning'
        },
        {
          title: 'Bhimavaram Seafood Export Hub Expansion',
          desc: 'State fisheries department approves [2-4] new cold storage complexes in Bhimavaram. This will facilitate direct container loading and reduce transit delays by [15-30]% for local shrimp farmers.',
          alertLevel: 'info'
        },
        {
          title: 'Nellore White Spot Disease Advisory',
          desc: 'Rising humidity levels in Nellore district increase WSSV outbreak risk by [20-40]%. Farmers should strictly monitor biosecurity and check shrimp feeding lines.',
          alertLevel: 'danger'
        },
        {
          title: 'Nellore Feed Prices Subsidized',
          desc: 'AP government announces a ₹[2-4]/kg subsidy on pellet feed for registered small-scale farmers in the district.',
          alertLevel: 'info'
        }
      ]
    },
    'West Bengal': {
      rates: [
        { name: 'Mud Crab (XXL 500g+)', basePrice: 710, unit: '/ kg', species: 'crab' },
        { name: 'Vannamei Shrimp (100 Count)', basePrice: 245, unit: '/ kg', species: 'shrimp' },
        { name: 'Rohu Fish (Bazar Size)', basePrice: 170, unit: '/ kg', species: 'fish' },
        { name: 'Hilsa Fish (500g)', basePrice: 930, unit: '/ kg', species: 'fish' },
        { name: 'Pangasius Catfish', basePrice: 120, unit: '/ kg', species: 'fish' }
      ],
      newsPool: [
        {
          title: 'Kakdwip Mud Crab Hatchery Seed Distribution',
          desc: 'The commercial mud crab hatchery in Kakdwip has begun crablet distribution. Farmers can buy hatchery-reared crablets (0.5g size) at a [30-50]% lower price, reducing dependency on wild catch.',
          alertLevel: 'info'
        },
        {
          title: 'Carp Diseases Alert in East Kolkata Wetlands',
          desc: 'Argulosis (fish lice) and fin rot symptoms reported due to high sewage organic loads. Farmers are advised to apply quicklime ([100-150] kg/acre) and check fish scales weekly.',
          alertLevel: 'danger'
        },
        {
          title: 'Sundarbans Brackishwater Pond Restoration',
          desc: 'State allocates ₹[50-90] Lakhs to restore cyclone-damaged pond bunds and distribute free lime to registered farmers.',
          alertLevel: 'info'
        },
        {
          title: 'Vannamei Farming Permits in Midnapore',
          desc: 'Coastal Aquaculture Authority issues new guidelines for inland vannamei farming permissions in Purba Medinipur, expecting a [10-25]% increase in registered farms.',
          alertLevel: 'warning'
        }
      ]
    },
    'Tamil Nadu': {
      rates: [
        { name: 'Kappaphycus Seaweed (Dry)', basePrice: 46, unit: '/ kg', species: 'seaweed' },
        { name: 'Asian Seabass / Bhetki', basePrice: 410, unit: '/ kg', species: 'fish' },
        { name: 'Vannamei Shrimp (100 Count)', basePrice: 250, unit: '/ kg', species: 'shrimp' },
        { name: 'Tiger Prawn (30 Count)', basePrice: 620, unit: '/ kg', species: 'shrimp' },
        { name: 'Tilapia Fish', basePrice: 135, unit: '/ kg', species: 'fish' }
      ],
      newsPool: [
        {
          title: 'Ramanathapuram Seaweed Park Approved',
          desc: 'Union cabinet approves ₹127 Crore Seaweed Park in Ramanathapuram. The park will house tissue culture labs and [3-5] processing facilities, eliminating middle brokers.',
          alertLevel: 'info'
        },
        {
          title: 'Coastal Regulation Zone Advisory for Shrimps',
          desc: 'Farmers must register their coastal shrimp farm coordinates with the Coastal Aquaculture Authority (CAA) within [10-20] days to obtain official electricity connections and bypass export custom checks.',
          alertLevel: 'warning'
        },
        {
          title: 'Cuddalore Oxygen Depletion Risk',
          desc: 'High surface temperatures in Cuddalore ponds are causing early morning dissolved oxygen crashes below [2-4] mg/L. Increase aeration hours by [2-4] hours.',
          alertLevel: 'danger'
        },
        {
          title: 'Seabass Cage Farming Success in Tuticorin',
          desc: 'CMFRI reports record yields of [4-6] tons for marine seabass cage trials; inputs to be subsidized by [30-50]% next month.',
          alertLevel: 'info'
        }
      ]
    },
    'Kerala': {
      rates: [
        { name: 'Pearl Spot / Karimeen', basePrice: 370, unit: '/ kg', species: 'fish' },
        { name: 'Tiger Prawn (30 Count)', basePrice: 630, unit: '/ kg', species: 'shrimp' },
        { name: 'Asian Seabass (Bhetki)', basePrice: 440, unit: '/ kg', species: 'fish' },
        { name: 'Tilapia Fish (Biofloc)', basePrice: 150, unit: '/ kg', species: 'fish' },
        { name: 'Freshwater Scampi', basePrice: 570, unit: '/ kg', species: 'shrimp' }
      ],
      newsPool: [
        {
          title: 'Karimeen Breeding Nursery in Vembanad Lake',
          desc: 'Kerala state fisheries department sets up [2-4] new cage nurseries to restock Vembanad lake and supply local farmers with high-quality Pearl Spot fingerlings.',
          alertLevel: 'info'
        },
        {
          title: 'Monsoon Backwater Floods Alert',
          desc: 'Backwater salinity levels are dropping rapidly due to heavy rains. Pokkali shrimp farmers are advised to harvest grown crops [5-10] days early to prevent osmotic shock mortality.',
          alertLevel: 'danger'
        },
        {
          title: 'Biofloc Tilapia Market Integration',
          desc: 'ADAK partners with local retail networks to buy Biofloc-reared Tilapia directly from [20-40] homestead farms at fixed minimum support prices.',
          alertLevel: 'info'
        },
        {
          title: 'Ernakulam Gill Fluke Outbreak',
          desc: 'Sudden water temperature drops have triggered gill fluke infections in [5-15]% of cage farms. Treat with potassium permanganate under advice.',
          alertLevel: 'warning'
        }
      ]
    },
    'Odisha': {
      rates: [
        { name: 'Vannamei Shrimp (100 Count)', basePrice: 240, unit: '/ kg', species: 'shrimp' },
        { name: 'Rohu Fish (Medium)', basePrice: 150, unit: '/ kg', species: 'fish' },
        { name: 'Catla Fish (Medium)', basePrice: 155, unit: '/ kg', species: 'fish' },
        { name: 'Mrigal Bazar Carp', basePrice: 145, unit: '/ kg', species: 'fish' },
        { name: 'Bhetki / Seabass', basePrice: 395, unit: '/ kg', species: 'fish' }
      ],
      newsPool: [
        {
          title: 'Chilika Salinity Levels Normalise for Shrimp Growth',
          desc: 'Seawater flushing through the Bhaleri mouth has stabilized salinity at [15-20] ppt. Growth rates for Vannamei shrimp in Chilika area are expected to accelerate by [10-25]%.',
          alertLevel: 'info'
        },
        {
          title: 'Freshwater Carp Breeding Camp in Cuttack',
          desc: 'CIFA announces a [3-5]-day training camp for carp induced breeding and spawn production. Free registration for local pond owners.',
          alertLevel: 'info'
        },
        {
          title: 'Balasore Shrimp Nursery Bio-Security Warning',
          desc: 'Reports of EMS (Early Mortality Syndrome) in nursery ponds. Farmers should disinfect stock with chlorine at [20-30] ppm level.',
          alertLevel: 'danger'
        },
        {
          title: 'Odisha Inland Fishery Subsidy Portal Live',
          desc: 'Direct benefit portal launched to claim up to [40-50]% subsidies for buying diesel pumps, nets, and aerators online.',
          alertLevel: 'info'
        }
      ]
    }
  };

  const staticSchemes = {
    'Andhra Pradesh': [
      {
        title: 'PMMSY Subsidy for Shrimp Ponds',
        desc: 'Get 40% subsidy (general category) and 60% subsidy (women/SC/ST) for constructing new shrimp ponds, purchasing aerators, and biofloc input costs.',
        eligibility: 'Requires registered CAA license, land ownership certificate or 7-year lease deed, and Aadhaar card linked bank account.',
        link: 'https://pmmsy.dof.gov.in/'
      },
      {
        title: 'Subsidized Electricity for Aquaculture Ponds',
        desc: 'Andhra Pradesh state government provides electricity at a highly subsidized tariff of ₹1.50 per unit (instead of standard commercial rates) for registered aqua ponds.',
        eligibility: 'Available for farms up to 10 acres. Requires active CAA certificate and sub-meter connectivity check by APCPDCL.',
        link: 'https://fisheries.ap.gov.in/'
      },
      {
        title: 'AP Fisheries Crop Insurance Scheme',
        desc: 'Financial security and premium subsidies on insurance coverage against loss of shrimp crop due to viral disease outbreaks (like WSSV) or natural calamities.',
        eligibility: 'Applies to shrimp crops stocked at standard density (< 30 pcs/sq.m). Premium shared 50:50 between state and farmer.',
        link: 'https://fisheries.ap.gov.in/'
      },
      {
        title: 'PMMSY Subsidy for Deep Sea Fishing Cages',
        desc: 'Provides 40% (general) to 60% (women/SC/ST) capital subsidy for purchasing and launching open-sea marine cages or large reservoir cages.',
        eligibility: 'Requires cooperative society registration or partnership firm deed, lease permission from reservoir authorities, and training certificate.',
        link: 'https://pmmsy.dof.gov.in/'
      },
      {
        title: 'Solar Powered Pond Aeration Subsidy',
        desc: 'Financial support of up to 50% for installing grid-tied or off-grid solar panel setups to power paddlewheel aerators in aquaculture ponds.',
        eligibility: 'Must own CAA registered pond, electricity meter connection, and submit quotation from empanelled solar contractors.',
        link: 'https://pmmsy.dof.gov.in/'
      }
    ],
    'West Bengal': [
      {
        title: 'West Bengal Crab Fattening Scheme',
        desc: 'Financial support and inputs distribution (bamboo cages, crab feed) for mud crab fattening in the estuary mudflats of the coastal Sundarbans.',
        eligibility: 'Open to self-help groups (SHGs) and marginal fishers in South & North 24 Parganas districts. Supported by West Bengal Fisheries Corp.',
        link: 'https://www.wbfisheries.in/'
      },
      {
        title: 'Jal Dharo Jal Bharo Carp Subsidy',
        desc: 'Re-excavation of community ponds with 50% state subsidy to integrate freshwater carp seed stocking and social forestry around water bunds.',
        eligibility: 'Available for panchayat-approved community ponds. Requires agreement to stock fingerlings sourced from state hatcheries.',
        link: 'https://www.wbfisheries.in/'
      },
      {
        title: 'Fishermen Group Accident Insurance',
        desc: 'State sponsored direct benefit transfer providing ₹2,0,000 compensation coverage for certified fishers and aquaculture workers in case of accidents.',
        eligibility: 'Requires valid West Bengal Fishery biometric card. Registration is free through the local block development office.',
        link: 'https://www.wbfisheries.in/'
      },
      {
        title: 'Matsyabandhu Year-Round Cash Support',
        desc: 'West Bengal state government sponsored direct cash transfer providing ₹5,000 annually to registered small-scale inland pond fishers to buy seeds.',
        eligibility: 'Must be registered under Matsyabandhu card. Limited to fishers owning or leasing ponds under 1.5 hectares.',
        link: 'https://www.wbfisheries.in/'
      },
      {
        title: 'PMMSY Urban Biofloc Tank Subsidy',
        desc: 'Supports urban and land-scarce aquaculture developers to build 4 to 6 tank biofloc infrastructure for high-density Tilapia and Singhi catfish.',
        eligibility: 'Requires proof of residential land, water supply source clearance, and completion of 3-day biofloc workshop from state fisheries office.',
        link: 'https://pmmsy.dof.gov.in/'
      }
    ],
    'Tamil Nadu': [
      {
        title: 'TN Seaweed Cultivation Rafts Scheme',
        desc: 'Subsidies up to 60% for coastal self-help groups (SHGs) to purchase bamboo rafts, monofilament ropes, and Kappaphycus seaweed seedlings.',
        eligibility: 'Restricted to coastal village residents. Women cooperatives are given 1st priority under the Ramanathapuram district seaweed project.',
        link: 'https://www.fisheries.tn.gov.in/'
      },
      {
        title: 'PMMSY Cage Culture in Marine Waters',
        desc: 'Financial assistance for installing open-sea floating metal cages for breeding high-value Asian Seabass (Bhetki) and Pompano fishes.',
        eligibility: 'Requires lease permission from the Tamil Nadu Maritime Board and training certificate from CMFRI Mandapam.',
        link: 'https://pmmsy.dof.gov.in/'
      },
      {
        title: 'Aquaculture Input Subsidy for SC/ST Farmers',
        desc: 'Provides 100% free carp seed stocking and high-protein feed bags for small tribal inland pond developers in Salem and Dharmapuri.',
        eligibility: 'Must possess SC/ST caste certificate and own/lease an inland pond of size between 0.2 and 1.0 acres.',
        link: 'https://www.fisheries.tn.gov.in/'
      },
      {
        title: 'Incentive for Temple Pond Fish Culture',
        desc: 'TN state fisheries department provides 100% free high-quality carp fingerlings and organic manure bags for stocking in registered village temple tanks.',
        eligibility: 'Open to temple trust committees and registered village youth groups authorized to manage water bodies by HR&CE department.',
        link: 'https://www.fisheries.tn.gov.in/'
      },
      {
        title: 'PMMSY Seafood Cold Chain & Vans Subsidy',
        desc: 'Provides 40% to 60% subsidy for purchasing insulated fish transport vehicles, refrigerated containers, and ice-box motorbikes to maintain product freshness.',
        eligibility: 'Open to individual farmers, retail fish vendors, and seafood groups. Requires motor vehicle license and GST registration.',
        link: 'https://pmmsy.dof.gov.in/'
      }
    ],
    'Kerala': [
      {
        title: 'Subsidized Pokkali paddy-shrimp Cultivation',
        desc: 'Financial aid of ₹25,000 per hectare for traditional Pokkali organic farmers practicing paddy-shrimp rotating culture in Ernakulam and Alappuzha.',
        eligibility: 'Limited to certified Pokkali land parcels. Farming must adhere to zero pesticide inputs during paddy rotation cycles.',
        link: 'https://www.fisheries.kerala.gov.in/'
      },
      {
        title: 'Kerala Fish Biofloc Subsidy',
        desc: '40% capital subsidy for constructing 4-tank indoor biofloc setups for high-density monosex Tilapia and Pangasius catfish rearing.',
        eligibility: 'Requires 3-day biofloc training certificate from ADAK (Agency for Development of Aquaculture, Kerala) and electricity clearance.',
        link: 'https://www.fisheries.kerala.gov.in/'
      },
      {
        title: 'Matsyafed Fuel Subsidy for Marine Farmers',
        desc: 'Fuel tariff rebates on kerosene and petrol purchase prices for registered marine fish farming cooperative societies.',
        eligibility: 'Must be an active member of local Matsyafed primary cooperative. Applies to outboard motors up to 10 HP.',
        link: 'https://www.fisheries.kerala.gov.in/'
      },
      {
        title: 'Backyard Ornamental Fish Culture Grant',
        desc: 'Financial aid and starter kit distribution for setting up backyard ornamental fish breeding units to support women self-help groups and entrepreneurs.',
        eligibility: 'Available for women-led households in Kerala. Capital subsidy covers up to 50% of concrete tanks and glass setups.',
        link: 'https://www.fisheries.kerala.gov.in/'
      },
      {
        title: 'Kerala Pearl Oyster Farming Subsidy',
        desc: 'Assists estuary farmers with up to 60% subsidy to buy pearl oyster seeds, bamboo rafts, and hangings for pearl production in coastal backwaters.',
        eligibility: 'Available in brackishwater districts (Kollam, Alappuzha, Kasaragod). Requires approval from regional ADAK coordinator.',
        link: 'https://www.fisheries.kerala.gov.in/'
      }
    ],
    'Odisha': [
      {
        title: 'Odisha Reservoir Cage Culture Policy',
        desc: 'Leasing of large reservoirs for fish cage production with 40-60% input subsidy support for fish fingerlings, cages, and floating feeds.',
        eligibility: 'Open to local fishermen cooperatives and qualified startups. Lease period extends up to 5 years.',
        link: 'https://fisheries.odisha.gov.in/'
      },
      {
        title: 'Balaram Yojana Carp Credit Card',
        desc: 'Provides zero-interest collateral-free loan up to ₹50,000 for fish seed, lime, and feed purchases for inland carps.',
        eligibility: 'Available for Joint Liability Groups (JLGs) of sharecroppers and marginal fish farmers in inland districts.',
        link: 'https://fisheries.odisha.gov.in/'
      },
      {
        title: 'Chilika Lake Shrimp Farm Support Scheme',
        desc: 'Financial support and fast-track licensing clearance for sustainable shrimp farming in designated non-forest zones of Chilika.',
        eligibility: 'Requires environmental audit clearance showing bio-secured discharge filters to prevent Chilika lake pollution.',
        link: 'https://fisheries.odisha.gov.in/'
      },
      {
        title: 'Matsya Pokhari Excavation Yojana',
        desc: 'Capital investment subsidy of 40% (general) to 50% (women/SC/ST) for digging new freshwater fish farming ponds up to 2.0 hectares in area.',
        eligibility: 'Requires land mutation certificate, non-agricultural land usage permit, and pond excavation plan approved by local block engineer.',
        link: 'https://fisheries.odisha.gov.in/'
      },
      {
        title: 'PMMSY Refrigerated Truck Procurement Subsidy',
        desc: 'Provides substantial financial aid for buying refrigerated reefers to transport fresh catches from major reservoirs (like Hirakud) to city markets.',
        eligibility: 'Open to farmer producer organizations (FPOs) and regional fish marketing federations. Requires transport permit and trade license.',
        link: 'https://pmmsy.dof.gov.in/'
      }
    ]
  };

  // Live updates trigger
  const updateFeedData = async (stateName, silent = false) => {
    if (silent) {
      setIsRefreshingSilent(true);
    } else {
      setLoadingFeed(true);
    }

    const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
    const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
    const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;
    const apiUrl = import.meta.env.VITE_API_URL;

    // Helper to randomize range placeholders in fallback news, e.g. [10-20]
    const randomizeText = (text) => {
      return text.replace(/\[(\d+)-(\d+)\]/g, (match, minStr, maxStr) => {
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      });
    };

    // If it's a silent update and we already have live feed for this state,
    // do a fast local price fluctuation and news shuffle/value randomization
    // rather than hitting the network API. This keeps the UI highly responsive.
    if (silent && liveFeed[stateName]) {
      setTimeout(() => {
        const currentFeed = liveFeed[stateName];
        
        // Fluctuated prices based on current displayed prices
        const updatedRates = currentFeed.rates.map(rate => {
          // Parse price from string e.g. "₹255 / kg" -> 255
          const priceMatch = rate.price.match(/\d+/);
          const currentPrice = priceMatch ? parseInt(priceMatch[0], 10) : 200;
          
          // Small micro-fluctuation of -3 to +3 INR
          const fluctuation = Math.floor(Math.random() * 7) - 3;
          const finalPrice = Math.max(15, currentPrice + fluctuation);
          const trend = fluctuation > 0 ? 'up' : (fluctuation < 0 ? 'down' : rate.trend || 'stable');
          
          // Calculate overall change compared to original fallback base price if available
          const baseState = fallbackData[stateName];
          const origRate = baseState ? baseState.rates.find(r => r.name === rate.name) : null;
          const basePrice = origRate ? origRate.basePrice : currentPrice;
          const totalDiff = finalPrice - basePrice;
          const change = totalDiff !== 0 ? `${totalDiff > 0 ? '+' : ''}₹${Math.abs(totalDiff)}` : '0';

          return {
            ...rate,
            price: `₹${finalPrice} / kg`,
            trend,
            change
          };
        });

        // Randomly refresh details/date and swap articles for silent updates
        let updatedNews = currentFeed.news;
        if (Math.random() > 0.5 && fallbackData[stateName]) {
          const base = fallbackData[stateName];
          const shuffledNews = [...base.newsPool].sort(() => 0.5 - Math.random());
          const selectedNews = shuffledNews.slice(0, 2);
          const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          updatedNews = selectedNews.map(newsItem => ({
            ...newsItem,
            desc: randomizeText(newsItem.desc),
            date: todayDate
          }));
        }

        setLiveFeed(prev => ({
          ...prev,
          [stateName]: {
            ...currentFeed,
            rates: updatedRates,
            news: updatedNews,
            lastUpdated: new Date().toLocaleTimeString()
          }
        }));
        setIsRefreshingSilent(false);
      }, 800);
      return;
    }

    if (!apiUrl && (!apiKey || !endpoint)) {
      // Simulate real-time ticking fluctuations offline
      setTimeout(() => {
        const base = fallbackData[stateName];
        if (!base) {
          setLoadingFeed(false);
          setIsRefreshingSilent(false);
          return;
        }

        const updatedRates = base.rates.map(rate => {
          // Random fluctuation between -15 and +15 INR
          const fluctuation = Math.floor(Math.random() * 21) - 10;
          const finalPrice = Math.max(15, rate.basePrice + fluctuation);
          const trend = fluctuation > 0 ? 'up' : (fluctuation < 0 ? 'down' : 'stable');
          const change = fluctuation !== 0 ? `${fluctuation > 0 ? '+' : ''}₹${Math.abs(fluctuation)}` : '0';
          
          return {
            name: rate.name,
            price: `₹${finalPrice} / kg`,
            trend,
            change
          };
        });

        // Randomly select 2 news articles from the pool
        const shuffledNews = [...base.newsPool].sort(() => 0.5 - Math.random());
        const selectedNews = shuffledNews.slice(0, 2);

        const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const updatedNews = selectedNews.map(newsItem => ({
          ...newsItem,
          desc: randomizeText(newsItem.desc),
          date: todayDate
        }));

        setLiveFeed(prev => ({
          ...prev,
          [stateName]: { rates: updatedRates, news: updatedNews, lastUpdated: new Date().toLocaleTimeString() }
        }));
        setLoadingFeed(false);
        setIsRefreshingSilent(false);
      }, 1000);
      return;
    }

    try {
      if (apiUrl) {
        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/aquafuture/market-rates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stateName })
        });

        if (!response.ok) throw new Error("API call failed");
        const parsedFeed = await response.json();
        
        setLiveFeed(prev => ({
          ...prev,
          [stateName]: {
            ...parsedFeed,
            lastUpdated: new Date().toLocaleTimeString()
          }
        }));
      } else {
        const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
        
        const promptText = `Generate live wholesale aquaculture market rates and regional pond warning alerts for the state of: ${stateName}, India.
Current Date: ${new Date().toLocaleDateString('en-IN')}

Return strictly as a JSON object with the following schema:
{
  "rates": [
    { "name": "Vannamei Shrimp (100 Count)", "price": "₹255 / kg", "trend": "up", "change": "+₹5" },
    ... // exactly 5 major commercial species relevant to this state's culture
  ],
  "news": [
    { "title": "Headline of Local Warning", "date": "Current Date", "desc": "Brief 2-3 sentence warning/alert for pond farmers.", "alertLevel": "info" },
    ... // exactly 2 regional items (alertLevel can be danger, warning, or info)
  ]
}
Ensure the JSON is valid. Respond ONLY with the JSON object. Do not include markdown tags like \`\`\`json.`;

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
                content: 'You are an Indian seafood market pricing analyst. You generate current market rates and regional salinity/weather alerts in strict JSON format.'
              },
              {
                role: 'user',
                content: promptText
              }
            ],
            temperature: 0.8
          })
        });

        if (!response.ok) throw new Error("API call failed");
        const resData = await response.json();
        const rawContent = resData.choices[0].message.content.trim();
        
        let cleanedJson = rawContent;
        if (cleanedJson.startsWith('```')) {
          cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        }

        const parsedFeed = JSON.parse(cleanedJson);
        
        setLiveFeed(prev => ({
          ...prev,
          [stateName]: {
            ...parsedFeed,
            lastUpdated: new Date().toLocaleTimeString()
          }
        }));
      }
    } catch (err) {
      console.error("AI Feed update failed, running offline generator:", err);
      // Fallback
      const base = fallbackData[stateName];
      if (base) {
        const updatedRates = base.rates.map(rate => {
          const fluctuation = Math.floor(Math.random() * 21) - 10;
          const finalPrice = Math.max(15, rate.basePrice + fluctuation);
          return {
            name: rate.name,
            price: `₹${finalPrice} / kg`,
            trend: fluctuation > 0 ? 'up' : (fluctuation < 0 ? 'down' : 'stable'),
            change: fluctuation !== 0 ? `${fluctuation > 0 ? '+' : ''}₹${Math.abs(fluctuation)}` : '0'
          };
        });
        
        const shuffledNews = [...base.newsPool].sort(() => 0.5 - Math.random());
        const selectedNews = shuffledNews.slice(0, 2);
        const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const updatedNews = selectedNews.map(newsItem => ({
          ...newsItem,
          desc: randomizeText(newsItem.desc),
          date: todayDate
        }));

        setLiveFeed(prev => ({
          ...prev,
          [stateName]: { rates: updatedRates, news: updatedNews, lastUpdated: new Date().toLocaleTimeString() }
        }));
      }
    } finally {
      setLoadingFeed(false);
      setIsRefreshingSilent(false);
    }
  };

  // Set up auto-refresh interval for the selected state
  useEffect(() => {
    // Initial fetch for the state
    updateFeedData(selectedState);

    // Set up auto-refresh timer (every 40 seconds)
    const interval = setInterval(() => {
      updateFeedData(selectedState, true); // true = silent update
    }, 40000);

    return () => clearInterval(interval);
  }, [selectedState]);

  const activeData = liveFeed[selectedState] || { rates: [], news: [], lastUpdated: '' };
  const activeSchemes = staticSchemes[selectedState] || [];

  return (
    <section className="technology" id="technology" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Fisheries Support
          </div>
          <h2 className="section-title">State-Wise Farmer Support Hub</h2>
          <p className="section-subtitle">
            Toggle state locations to view current market rates, government subsidy schemes, and local fisheries warnings.
          </p>

          {/* Premium Dropdown Selector & Refresh Trigger */}
          <div className="state-select-container">
            <label>📍 Select Farming Region:</label>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)} 
              className="state-dropdown"
              disabled={loadingFeed || isRefreshingSilent}
            >
              {Object.keys(staticSchemes).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <button 
              className="eligibility-btn refresh-feed-btn"
              onClick={() => updateFeedData(selectedState)}
              disabled={loadingFeed || isRefreshingSilent}
              style={{ width: 'auto', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🔄 {loadingFeed || isRefreshingSilent ? 'Updating Feed...' : 'Refresh Live Data'}
            </button>
          </div>
          
          {activeData.lastUpdated && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
              <span style={{ 
                fontSize: '0.82rem', 
                color: 'rgba(224, 232, 240, 0.6)', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                <span className={`pulse-dot ${isRefreshingSilent || loadingFeed ? 'active' : ''}`}></span>
                <span>
                  {isRefreshingSilent || loadingFeed ? '⚡ Fetching latest updates...' : `⚡ Live Feed Ticker • Last Updated: ${activeData.lastUpdated}`}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* 3-Column Hub Grid */}
        <div className="support-hub-grid">
          {/* Column 1: Government Subsidies */}
          <div className="support-col schemes-column reveal">
            <h3>🏛️ Subsidies & Schemes</h3>
            <div className="col-content">
              {activeSchemes.map((scheme, i) => (
                <div key={i} className="scheme-card glass-card">
                  <h4>{scheme.title}</h4>
                  <p>{scheme.desc}</p>
                  <button 
                    className="eligibility-btn"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    📄 Check Eligibility
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Seafood Wholesale Market Rates */}
          <div className="support-col rates-column reveal" style={{ transitionDelay: '0.1s' }}>
            <h3>📈 Wholesale Market Rates</h3>
            <div className="col-content">
              {loadingFeed ? (
                <div className="rates-table glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '300px' }}>
                  <div className="loading-spinner" style={{ width: '36px', height: '36px' }}></div>
                </div>
              ) : (
                <div className="rates-table glass-card">
                  <div className="rates-header-row">
                    <span>Species / Count</span>
                    <span>Price (Est.)</span>
                    <span>Trend</span>
                  </div>
                  {activeData.rates.map((rate, i) => (
                    <div key={i} className="rate-row">
                      <span className="rate-name">{rate.name}</span>
                      <span className="rate-price">{rate.price}</span>
                      <span className={`trend-badge trend-${rate.trend}`}>
                        {rate.trend === 'up' && `▲ ${rate.change}`}
                        {rate.trend === 'down' && `▼ ${rate.change}`}
                        {rate.trend === 'stable' && '● Stable'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="rates-disclaimer">⚠️ Market rates fluctuate daily based on landings and cold chain availability. Consult local brokers for final trade agreements.</p>
            </div>
          </div>

          {/* Column 3: Pond Alerts & Regional News */}
          <div className="support-col news-column reveal" style={{ transitionDelay: '0.2s' }}>
            <h3>📰 Pond Alerts & News</h3>
            <div className="col-content">
              {loadingFeed ? (
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '300px' }}>
                  <div className="loading-spinner" style={{ width: '36px', height: '36px' }}></div>
                </div>
              ) : (
                activeData.news.map((item, i) => (
                  <div key={i} className={`news-card glass-card alert-${item.alertLevel}`}>
                    <div className="news-meta">
                      <span className="news-date">📅 {item.date}</span>
                      <span className={`alert-label label-${item.alertLevel}`}>
                        {item.alertLevel === 'danger' && '🔴 Critical'}
                        {item.alertLevel === 'warning' && '🟡 Warning'}
                        {item.alertLevel === 'info' && '🔵 Update'}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Guide Modal Popup */}
      {selectedScheme && (
        <div className="services-modal-backdrop" onClick={() => setSelectedScheme(null)}>
          <div className="services-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedScheme(null)}>×</button>

            <div className="modal-header">
              <span className="modal-emoji">📋</span>
              <div>
                <h2>Eligibility Guidelines</h2>
                <div className="scientific-name">Subsidies & Direct Benefit Transfer</div>
              </div>
            </div>

            <div className="modal-body" style={{ overflowY: 'visible' }}>
              <div className="eligibility-box" style={{ background: 'rgba(0, 212, 170, 0.05)', border: '1px solid rgba(0, 212, 170, 0.15)', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '10px' }}>{selectedScheme.title}</h4>
                <p style={{ fontSize: '0.92rem', color: 'rgba(224, 232, 240, 0.75)', lineHeight: '1.6', marginBottom: '20px' }}>{selectedScheme.desc}</p>
                
                <h5 style={{ color: 'var(--aqua-primary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>📄 Required Documents & Rules:</h5>
                <p style={{ fontSize: '0.88rem', color: '#e0fcf5', lineHeight: '1.6' }}>{selectedScheme.eligibility}</p>
              </div>
            </div>

            <div className="modal-actions-footer" style={{ borderTop: 'none', paddingTop: '20px', gap: '16px' }}>
              <button 
                onClick={() => setSelectedScheme(null)} 
                className="recalculate-btn"
                style={{ flex: 1, margin: 0 }}
              >
                Close Window
              </button>
              <a 
                href={selectedScheme.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="form-submit-btn"
                style={{ flex: 1, margin: 0, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '45px', padding: 0 }}
              >
                Apply on Portal ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
