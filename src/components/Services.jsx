import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
    key: 'seaweed',
    title: 'Seaweed Cultivation',
    desc: 'Floating bamboo raft and longline rope seaweed cultivation schedules tailored for Kappaphycus coastal farmers.',
    tag: 'Sustainable',
  },
];

const offlineTimelineTranslations = {
  en: {
    'Fish Farming': [
      { phase: 'Pond De-silting & Liming (Days -15 to -5)', desc: 'Remove bottom black organic mud. Apply agricultural lime (CaO) at 250 kg/acre to raise soil pH to 7.0 and eradicate pathogens.' },
      { phase: 'Manuring & Water Fill (Days -4 to 0)', desc: 'Fill freshwater cage or pond to 5 feet. Apply fermented cow manure or organic fertilizer to generate zooplankton feed.' },
      { phase: 'Fingerling Stocking (Day 0)', desc: 'Stock disease-free Catla/Rohu fingerlings. Acclimatise the bags to pond temperature to prevent stress and mortality.' },
      { phase: 'Regular Feeding & Aeration (Days 1 to 90)', desc: 'Feed floating pellet feeds (28-32% protein) at 3-5% of body weight. Turn on paddlewheels for 3 hours before sunrise.' },
      { phase: 'Pond Water Liming & Growth checks (Days 91 to 180)', desc: 'Perform monthly water checks. Apply agricultural gypsum or lime (20 kg/acre) if water becomes turbid. Net pond to monitor average fish weight.' },
      { phase: 'Final Harvesting (Days 180+)', desc: 'Stop feeding 24 hours prior to harvest. Drag net early morning to catch fish and transfer them immediately to aeration tanks for sale.' }
    ],
    'Shrimp Culture': [
      { phase: 'Pond Prep & Liming (Days -15 to -7)', desc: 'Sun-dry the pond bottom until soil cracks. Apply Quicklime (200 kg/acre) to sanitize and balance pH. Fit bird fencing and crab barriers.' },
      { phase: 'Water Intake & Fertilisation (Days -6 to 0)', desc: 'Fill pond to 4 feet through filter bags. Apply Dolomite (40 kg/acre) and premium probiotics to bloom rich green phytoplankton water.' },
      { phase: 'Acclimatisation & Stocking (Day 0)', desc: 'Stock SPF post-larvae (PL-15) early morning. Float bags for 30 minutes, slowly mixing pond water to match salinity and temperature.' },
      { phase: 'Blind Feeding & Night Aeration (Days 1 to 30)', desc: 'Feed crumble starter feed 3 times daily. Run paddlewheel aerators 4 hours daily between 1:00 AM and 5:00 AM when oxygen drops.' },
      { phase: 'Probiotic Dosing & Feed Adjusting (Days 31 to 90)', desc: 'Transition to grower pellets. Check feed trays after 2 hours. Dose soil/water probiotics weekly to decompose organic sludge and prevent EMS.' },
      { phase: 'Harvest Prep (Days 90+)', desc: 'Check shrimp count and weight. Harvest early morning using cast/drag nets. Place harvested shrimp immediately in ice slurry to preserve quality.' }
    ],
    'Mud Crab Farming': [
      { phase: 'Bund Fencing & Pond prep (Days -10 to -2)', desc: 'Install 1-meter high plastic net barriers along the bunds to prevent mud crabs from escaping. Add PVC hollow pipes (4-inch) at pond bottoms as shelter points.' },
      { phase: 'Stocking mud crabs (Day 0)', desc: 'Stock healthy juvenile crabs (50g to 100g size) at a low density (1 crab per sq meter) to prevent territorial fights and cannibalism.' },
      { phase: 'Feeding Trash Fish & Clams (Days 1 to 45)', desc: 'Feed minced trash fish, clam meat, or shrimp waste daily at 5% of total body weight. Split feed into morning and evening cycles.' },
      { phase: 'Water Quality & Moulting Check (Days 46 to 120)', desc: 'Perform regular water exchange (20% weekly) to clear excess organic matter. Ensure adequate calcium levels to aid shell hardening after moult cycles.' },
      { phase: 'Harvesting (Days 120+)', desc: 'Harvest crabs individually using scoop nets or bamboo traps. Tie crab claws with jute rope immediately to prevent injury and fight losses.' }
    ],
    'Seaweed Cultivation': [
      { phase: 'Drafting Rafts & Lines (Days -5 to -1)', desc: 'Prepare floating bamboo rafts (3m x 3m) or longline ropes. Tie anchor stones and floating plastic drums to maintain stability in shallow coastal tides.' },
      { phase: 'Tying Seedlings (Day 0)', desc: 'Tie fresh Kappaphycus seaweed cuttings (80-100g thallus chunks) to the raft lines using soft plastic tie-tie threads at 15cm intervals.' },
      { phase: 'Coastal Raft Launch (Day 1)', desc: 'Float and anchor the lines in shallow marine waters (1.5m to 2.5m deep) with steady tidal currents. Ensure seaweed sits 30cm below the water surface.' },
      { phase: 'Cleaning Epiphytes & Debris (Days 2 to 40)', desc: 'Clean lines weekly by shaking off silt, debris, and epiphytic hairy weeds. Replace any washed-out thallus seedlings.' },
      { phase: 'Harvesting & Sun-Drying (Days 45+)', desc: 'Harvest rafts before summer heat causes bleaching (Ice-Ice disease). Sun-dry the seaweed on clean canvas mats for 3 days until moisture drops to 35%.' }
    ]
  },
  hi: {
    'Fish Farming': [
      { phase: 'तालाब से गाद निकालना और चूना डालना (दिन -15 से -5)', desc: 'तालाब के तल की काली जैविक मिट्टी को हटा दें। मिट्टी के पीएच को 7.0 तक बढ़ाने और रोगजनकों को खत्म करने के लिए कृषि चूना (CaO) 250 किलोग्राम/एकड़ की दर से डालें।' },
      { phase: 'खाद और पानी भरना (दिन -4 से 0)', desc: 'मीठे पानी के पिंजरे या तालाब को 5 फीट तक भरें। ज़ोप्लांकटन फ़ीड उत्पन्न करने के लिए किण्वित गाय का गोबर या जैविक उर्वरक डालें।' },
      { phase: 'उंगली मछली संचयन (दिन 0)', desc: 'रोग मुक्त कतला/रोहू की उंगलियों का संचयन करें। तनाव और मृत्यु दर को रोकने के लिए बैग को तालाब के तापमान के अनुसार ढालें।' },
      { phase: 'नियमित रूप से खिलाना और वातन (दिन 1 से 90)', desc: 'शारीरिक वजन के 3-5% पर तैरने वाले पेलेट फ़ीड (28-32% प्रोटीन) खिलाएं। सूर्योदय से 3 घंटे पहले पैडलव्हील चालू करें।' },
      { phase: 'पानी में चूना डालना और विकास जांच (दिन 91 से 180)', desc: 'मासिक पानी की जाँच करें। पानी मटमैला होने पर कृषि जिप्सम या चूना (20 किग्रा/एकड़) डालें। औसत मछली के वजन की निगरानी के लिए तालाब में जाल डालें।' },
      { phase: 'अंतिम फसल (दिन 180+)', desc: 'कटाई से 24 घंटे पहले खिलाना बंद कर दें। सुबह जल्दी जाल खींचकर मछलियां पकड़ें और उन्हें तुरंत बिक्री के लिए वातन टैंकों में स्थानांतरित करें।' }
    ],
    'Shrimp Culture': [
      { phase: 'तालाब की तैयारी और चूना डालना (दिन -15 से -7)', desc: 'तालाब के तल को धूप में सुखाएं जब तक कि मिट्टी में दरारें न आ जाएं। कीटाणुरहित करने और पीएच को संतुलित करने के लिए कृषि चूना (200 किलोग्राम/एकड़) डालें। पक्षी बाड़ और केकड़े की बाधाएं लगाएं।' },
      { phase: 'पानी भरना और पानी तैयार करना (दिन -6 से 0)', desc: 'तालाब को फ़िल्टर बैग के माध्यम से 4 फीट तक भरें। समृद्ध हरे फाइटोप्लांकटन पानी को विकसित करने के लिए डोलोमाइट (40 किग्रा/एकड़) और प्रीमियम प्रोबायोटिक्स डालें।' },
      { phase: 'अनुकूलन और संचयन (दिन 0)', desc: 'सुबह जल्दी एसपीएफ पोस्ट-लार्वा (PL-15) का संचयन करें। लवणता और तापमान का मिलान करने के लिए तालाब के पानी को धीरे-धीरे मिलाते हुए बैग को 30 मिनट तक तैरने दें।' },
      { phase: 'अंधा खिलाना और रात्रि वातन (दिन 1 से 30)', desc: 'क्रम्बल स्टार्टर फ़ीड दिन में 3 बार खिलाएं। ऑक्सीजन कम होने पर रात 1:00 बजे से सुबह 5:00 बजे के बीच पैडलव्हील एरेटर 4 घंटे चलाएं।' },
      { phase: 'प्रोबायोटिक डोज़िंग और फ़ीड एडजस्टिंग (दिन 31 से 90)', desc: 'ग्रोअर पेलेट्स में बदलाव करें। 2 घंटे के बाद फ़ीड ट्रे की जाँच करें। जैविक कीचड़ को विघटित करने और ईएमएस को रोकने के लिए साप्ताहिक रूप से मिट्टी/पानी के प्रोबायोटिक्स डालें।' },
      { phase: 'फसल की तैयारी (दिन 90+)', desc: 'झींगा की संख्या और वजन की जाँच करें। कास्ट/ड्रैग नेट का उपयोग करके सुबह जल्दी कटाई करें। गुणवत्ता बनाए रखने के लिए कटे हुए झींगे को तुरंत बर्फ के घोल में रखें।' }
    ],
    'Mud Crab Farming': [
      { phase: 'तटबंध बाड़ लगाना और तालाब की तैयारी (दिन -10 से -2)', desc: 'कीचड़ केकड़ों को भागने से रोकने के लिए तटबंधों के साथ 1 मीटर ऊंची प्लास्टिक नेट बाधाएं स्थापित करें। छिपने के स्थानों के रूप में तालाब के तल पर पीवीसी खोखले पाइप (4 इंच) डालें।' },
      { phase: 'केकड़ों का संचयन (दिन 0)', desc: 'क्षेत्रीय लड़ाई और नरभक्षण को रोकने के लिए कम घनत्व (1 केकड़ा प्रति वर्ग मीटर) पर स्वस्थ युवा केकड़ों (50 ग्राम से 100 ग्राम आकार) का संचयन करें।' },
      { phase: 'कचरा मछली और क्लैम खिलाना (दिन 1 से 45)', desc: 'कुल शारीरिक वजन के 5% पर रोजाना कीमा बनाया हुआ कचरा मछली, क्लैम मीट, या झींगा कचरा खिलाएं। फ़ीड को सुबह और शाम के चक्रों में विभाजित करें।' },
      { phase: 'पानी की गुणवत्ता और खोल उतारने की जांच (दिन 46 से 120)', desc: 'अंतिम जैव अपशिष्ट को साफ करने के लिए नियमित रूप से पानी का आदान-प्रदान (साप्ताहिक 20%) करें। खोल उतारने के चक्र के बाद खोल के सख्त होने में सहायता के लिए पर्याप्त कैल्शियम स्तर सुनिश्चित करें।' },
      { phase: 'कटाई (दिन 120+)', desc: 'स्कूप नेट या बांस के जाल का उपयोग करके केकड़ों की व्यक्तिगत रूप से कटाई करें। चोट और लड़ाई के नुकसान को रोकने के लिए केकड़े के पंजों को तुरंत जूट की रस्सी से बांधें।' }
    ],
    'Seaweed Cultivation': [
      { phase: 'राफ्ट और लाइनों का प्रारूप तैयार करना (दिन -5 से -1)', desc: 'तैरते हुए बांस के राफ्ट (3m x 3m) या लॉन्गलाइन रस्सियाँ तैयार करें। उथले तटीय ज्वार में स्थिरता बनाए रखने के लिए लंगर के पत्थर और तैरते हुए प्लास्टिक के ड्रम बांधें।' },
      { phase: 'पौधों को बांधना (दिन 0)', desc: 'नरम प्लास्टिक के धागों का उपयोग करके 15 सेमी के अंतराल पर राफ्ट लाइनों में समुद्री शैवाल के ताजे टुकड़े (80-100 ग्राम थैलस ब्लॉक) बांधें।' },
      { phase: 'तटीय राफ्ट लॉन्च (दिन 1)', desc: 'स्थिर ज्वारीय धाराओं के साथ उथले समुद्री पानी (1.5 मीटर से 2.5 मीटर गहरे) में लाइनों को तैरें और लंगर डालें। सुनिश्चित करें कि समुद्री शैवाल पानी की सतह से 30 सेमी नीचे बैठे।' },
      { phase: 'एपीफाइट्स और मलबे की सफाई (दिन 2 से 40)', desc: 'गाद, मलबे और बालों वाले खरपतवारों को हिलाकर साप्ताहिक रूप से लाइनों को साफ करें। पानी में बहे हुए किसी भी पौधे को बदलें।' },
      { phase: 'कटाई और धूप में सुखाना (दिन 45+)', desc: 'गर्मियों की गर्मी से होने वाले नुकसान (आइस-आइस रोग) से पहले राफ्ट की कटाई करें। नमी 35% तक गिरने तक साफ कैनवास मैट पर समुद्री शैवाल को 3 दिनों तक धूप में सुखाएं।' }
    ]
  },
  te: {
    'Fish Farming': [
      { phase: 'చెరువు పూడికతీత & సున్నం వేయడం (రోజులు -15 నుండి -5)', desc: 'అడుగున ఉన్న నల్లటి సేంద్రీయ బురదను తొలగించండి. మట్టి pHని 7.0కి పెంచడానికి మరియు వ్యాధికారకాలను నిర్మూలించడానికి ఎకరానికి 250 కిలోల చొప్పున వ్యవసాయ సున్నం (CaO) వేయండి.' },
      { phase: 'ఎరువులు వేయడం & నీటి నింపడం (రోజులు -4 నుండి 0)', desc: 'మంచినీటి బోను లేదా చెరువును 5 అడుగుల వరకు నింపండి. జూప్లాంక్టన్ ఫీడ్‌ను ఉత్పత్తి చేయడానికి పులియబెట్టిన ఆవు పేడ లేదా సేంద్రీయ ఎరువును వేయండి.' },
      { phase: 'చేప పిల్లల సాగు (రోజు 0)', desc: 'వ్యాధి లేని కట్ల/రోహు చేప పిల్లలను చెరువులో వేయండి. ఒత్తిడి మరియు మరణాలను నివారించడానికి బ్యాగ్‌లను చెరువు ఉష్ణోగ్రతకు అలవాటు చేయండి.' },
      { phase: 'క్రమం తప్పకుండా ఆహారం ఇవ్వడం & ఏరేషన్ (రోజులు 1 నుండి 90)', desc: 'శరీర బరువులో 3-5% వద్ద తేలియాడే పెల్లెట్ ఫీడ్స్ (28-32% ప్రోటీన్) ఇవ్వండి. సూర్యోదయానికి 3 గంటల ముందు పెడల్‌వీల్స్ ఆన్ చేయండి.' },
      { phase: 'నీటి సున్నం & ఎదుగుదల తనిఖీలు (రోజులు 91 నుండి 180)', desc: 'నెలవారీ నీటి తనిఖీలను నిర్వహించండి. నీరు मసకబారినట్లయితే వ్యవసాయ జిప్సం లేదా సున్నం (ఎకరానికి 20 కేజీలు) వేయండి. సగటు చేప బరువును పర్యవేక్షించడానికి చెరువులో నెట్ వేయండి.' },
      { phase: 'అంతిమ కోత (రోజులు 180+)', desc: 'కోతకు 24 గంటల ముందు ఆహారం ఇవ్వడం ఆపివేయండి. ఉదయాన్నే నెట్ లాగి చేపలను పట్టుకోండి మరియు అమ్మకం కోసం వాటిని వెంటనే ఏరేషన్ ట్యాంకులకు తరలించండి.' }
    ],
    'Shrimp Culture': [
      { phase: 'చెరువు తయారీ & సున్నం వేయడం (రోజులు -15 నుండి -7)', desc: 'మట్టిలో పగుళ్లు వచ్చే వరకు చెరువు అడుగు భాగాన్ని ఎండబెట్టండి. శుభ్రపరచడానికి మరియు pH సమతుల్యం చేయడానికి వ్యవసాయ సున్నం (ఎకరానికి 200 కేజీలు) వేయండి. పక్షుల వలలు మరియు పీతల అడ్డంకులను అమర్చండి.' },
      { phase: 'నీరు నింపడం & నీటి సంరక్షణ (రోజులు -6 నుండి 0)', desc: 'ఫిల్టర్ బ్యాగుల ద్వారా చెరువును 4 అడుగుల వరకు నింపండి. ఆకుపచ్చని ఫైటోప్లాంక్టన్ నీటిని అభివృద్ధి చేయడానికి డోలమైట్ (ఎకరానికి 40 కేజీలు) మరియు ప్రీమియం ప్రోబయోటిక్స్ వేయండి.' },
      { phase: 'అలవాటు పడటం & సాగు (రోజు 0)', desc: 'ఉదయాన్నే ఎస్పీఎఫ్ రొయ్యల పిల్లలను (PL-15) వేయండి. ఉప్పు శాతం మరియు ఉష్ణోగ్రత సరిపోల్చడానికి చెరువు నీటిని నెమ్మదిగా కలుపుతూ బ్యాగులను 30 నిమిషాల పాటు తేలనివ్వండి.' },
      { phase: 'బ్లైండ్ ఫీడింగ్ & రాత్రి ఏరేషన్ (రోజులు 1 నుండి 30)', desc: 'రోజుకు 3 సార్లు క్రంబుల్ స్టార్టర్ ఫీడ్ ఇవ్వండి. ఆక్సిజన్ తగ్గినప్పుడు అర్ధరాత్రి 1:00 నుండి ఉదయం 5:00 గంటల మధ్య రోజుకు 4 గంటల పాటు పెడల్‌వీల్ ఏరేటర్లను నడపండి.' },
      { phase: 'ప్రోబయోటిక్ డోసింగ్ & ఫీడ్ సర్దుబాటు (రోజులు 31 నుండి 90)', desc: 'గ్రోయర్ పెల్లెట్‌లకు మారండి. 2 గంటల తర్వాత ఫీడ్ ట్రేలను తనిఖీ చేయండి. బురదను విచ్ఛిన్నం చేయడానికి మరియు EMS ని నిరోధించడానికి వారానికోసారి నేల/నీటి ప్రోబయోటిక్స్ వేయండి.' },
      { phase: 'కోత తయారీ (రోజులు 90+)', desc: 'రొయ్యల సంఖ్య మరియు బరువును తనిఖీ చేయండి. కాస్ట్/డ్రాగ్ నెట్ ఉపయోగించి ఉదయాన్నే కోత కోయండి. నాణ్యతను కాపాడటానికి కోసిన రొయ్యలను వెంటనే ఐస్ బురదలో ఉంచండి.' }
    ],
    'Mud Crab Farming': [
      { phase: 'గట్టు కంచె & చెరువు తయారీ (రోజులు -10 నుండి -2)', desc: 'మడ్ క్రాబ్స్ తప్పించుకోకుండా ఉండటానికి గట్ల పొడవునా 1 మీటర్ ఎత్తు గల ప్లాస్టిక్ నెట్ అడ్డంకులను ఏర్పాటు చేయండి. ఆశ్రయ పాయింట్లుగా చెరువు అడుగున పివిసి పైపులను (4 అంగుళాలు) వేయండి.' },
      { phase: 'మడ్ క్రాబ్స్ సాగు (రోజు 0)', desc: 'ప్రాంతీయ పోరాటాలు మరియు నరమాంస భక్షణను నిరోధించడానికి తక్కువ సాంద్రతలో (చదరపు మీటరుకు 1 పీత) ఆరోగ్యకరమైన పీతలను (50గ్రా నుండి 100గ్రా సైజు) వేయండి.' },
      { phase: 'చేపల ముక్కలు & క్లామ్స్ ఆహారం (రోజులు 1 నుండి 45)', desc: 'మొత్తం శరీర బరువులో 5% వద్ద రోజువారీ చేపల ముక్కలు, క్లామ్ మాంసం లేదా రొయ్యల వ్యర్థాలను తినిపించండి. ఆహారాన్ని ఉదయం మరియు సాయంత్రం చక్రాలుగా విభజించండి.' },
      { phase: 'నీటి నాణ్యత & పొర విసర్జన తనిఖీ (రోజులు 46 నుండి 120)', desc: 'చెత్తను శుభ్రం చేయడానికి క్రమం తప్పకుండా నీటి మార్పిడి (వారానికి 20%) చేయండి. పొర విసర్జన తర్వాత పెంకు గట్టిపడటానికి తగినంత కాల్షియం స్థాయిలను నిర్ధారించండి.' },
      { phase: 'కోత కోయడం (రోజులు 120+)', desc: 'స్కూప్ నెట్స్ లేదా వెదురు బోనులను ఉపయోగించి పీతలను విడివిడిగా పట్టుకోండి. గాయాలు మరియు పోరాట నష్టాలను నివారించడానికి పీతల పంజాలను వెంటనే జూట్ తాడుతో కట్టండి.' }
    ],
    'Seaweed Cultivation': [
      { phase: 'వెదురు తెప్పలు & తాడుల తయారీ (రోజులు -5 నుండి -1)', desc: 'తేలియాడే వెదురు తెప్పలను (3m x 3m) లేదా పొడవైన తాడులను సిద్ధం చేయండి. అలల ఒడిదుడుకులలో స్థిరత్వాన్ని కాపాడుకోవడానికి లంగరు రాళ్ళు మరియు ప్లాస్టిక్ డ్రమ్ములను కట్టండి.' },
      { phase: 'మొక్కలను కట్టడం (రోజు 0)', desc: 'మెత్తటి ప్లాస్టిక్ దారాలను ఉపయోగించి 15 సెం.మీ వ్యవధిలో సముద్రపు నాచు ముక్కలను (80-100 గ్రాములు) తెప్పల తాడులకు కట్టండి.' },
      { phase: 'తీరప్రాంత తెప్పల ప్రారంభం (రోజు 1)', desc: 'స్థిరమైన అలల ప్రవాహాలు ఉన్న ఉతుకు సముద్ర నీటిలో (1.5 మీ నుండి 2.5 మీ లోతు) తాడులను తేలనివ్వండి మరియు లంగరు వేయండి. నాచు నీటి ఉపరితలం కంటే 30 సెం.మీ కింద ఉండేలా చూడండి.' },
      { phase: 'చెత్త మరియు నాచు శుభ్రపరచడం (రోజులు 2 నుండి 40)', desc: 'వారానికోసారి బురద, చెత్తను కదిలించి తాడులను శుభ్రం చేయండి. కొట్టుకుపోయిన ఏవైనా మొక్కలను భర్తీ చేయండి.' },
      { phase: 'కోత & ఎండబెట్టడం (రోజులు 45+)', desc: 'వేసవి వేడి వల్ల తెల్లబడకుండా ఉండేందుకు ముందే తెప్పలను కోయండి. తేమ 35% కి తగ్గే వరకు శుభ్రమైన కాన్వాస్ మ్యాట్లపై నాచును 3 రోజుల పాటు ఎండబెట్టండి.' }
    ]
  },
  ta: {
    'Fish Farming': [
      { phase: 'குளத்து வண்டல் அகற்றுதல் & சுண்ணாம்பு இடுதல் (நாட்கள் -15 முதல் -5)', desc: 'அடியில் உள்ள கருப்பு சேற்று மண்ணை அகற்றவும். மண்ணின் pH அளவை 7.0 ஆக உயர்த்தவும் கிருமிகளை அழிக்கவும் ஏக்கருக்கு 250 கிலோ வீதம் விவசாய சுண்ணாம்பு (CaO) பயன்படுத்தவும்.' },
      { phase: 'உரமிடுதல் & நீர் நிரப்புதல் (நாட்கள் -4 முதல் 0)', desc: 'குளத்தை 5 அடி ஆழத்திற்கு நிரப்பவும். இயற்கை நுண்ணுயிரிகளை உருவாக்க மக்கிய மாட்டு சாணம் அல்லது இயற்கை உரத்தைப் பயன்படுத்தவும்.' },
      { phase: 'மீன் குஞ்சு இருப்பு வைத்தல் (நாள் 0)', desc: 'நோயற்ற கெண்டை மீன் குஞ்சுகளை குளத்தில் விடவும். அழுத்தத்தைத் தவிர்க்க குஞ்சுகள் உள்ள பைகளை குளத்து வெப்பநிலைக்கு ஏற்றவாறு மாற்றவும்.' },
      { phase: 'முறையான தீவனம் & காற்றோட்டம் (நாட்கள் 1 முதல் 90)', desc: 'உடல் எடையில் 3-5% அளவில் மிதக்கும் தீவனங்களை வழங்கவும். சூரிய உதயத்திற்கு 3 மணி நேரத்திற்கு முன்பு காற்றோட்ட சக்கரங்களை இயக்கவும்.' },
      { phase: 'நீர் சுண்ணாம்பு இடுதல் & வளர்ச்சி சரிபார்ப்பு (நாட்கள் 91 முதல் 180)', desc: 'மாதாந்திர நீர் சோதனைகளைச் செய்யவும். நீர் கலங்கலாக இருந்தால் ஜிப்சம் அல்லது சுண்ணாம்பு (ஏக்கருக்கு 20 கிலோ) பயன்படுத்தவும். மீன்களின் சராசரி எடையைக் கண்காணிக்க குளத்தில் வலை வீசவும்.' },
      { phase: 'இறுதி அறுவடை (நாட்கள் 180+)', desc: 'அறுவடைக்கு 24 மணி நேரத்திற்கு முன்பு தீவனம் வழங்குவதை நிறுத்தவும். அதிகாலையில் வலை வீசி மீன்களைப் பிடித்து உடனடியாக விற்பனைக்கு அனுப்பவும்.' }
    ],
    'Shrimp Culture': [
      { phase: 'குளத்து தயாரிப்பு & சுண்ணாம்பு இடுதல் (நாட்கள் -15 முதல் -7)', desc: 'மண் வெடிக்கும் வரை குளத்தின் அடியை உலர வைக்கவும். கிருமி நீக்கம் செய்ய சுண்ணாம்பு (ஏக்கருக்கு 200 கிலோ) பயன்படுத்தவும். பறவை வலைகள் மற்றும் நண்டு தடுப்புகளை அமைக்கவும்.' },
      { phase: 'நீர் நிரப்புதல் & தயாரிப்பு (நாட்கள் -6 முதல் 0)', desc: 'வடிகட்டி பைகள் மூலம் குளத்தை 4 அடி ஆழத்திற்கு நிரப்பவும். பச்சை பாசிகளை வளர்க்க டோலமைट (ஏக்கருக்கு 40 கிலோ) மற்றும் புரோபயாடிக்குகளைப் பயன்படுத்தவும்.' },
      { phase: 'பழக்கப்படுத்துதல் & இருப்பு வைத்தல் (நாள் 0)', desc: 'அதிகாலையில் இறால் குஞ்சுகளை (PL-15) விடவும். உவர்ப்புத்தன்மை மற்றும் வெப்பநிலையை சீராக்க குளத்து நீரை மெதுவாக கலந்து பைகளை 30 நிமிடங்கள் மிதக்க விடவும்.' },
      { phase: 'குருட்டு தீவனம் & இரவு காற்றோட்டம் (நாட்கள் 1 முதல் 30)', desc: 'தினமும் 3 முறை தீவனம் வழங்கவும். ஆக்ஸிஜன் குறையும் போது நள்ளிரவு 1:00 முதல் அதிகாலை 5:00 மணி வரை காற்றோட்ட சக்கரங்களை 4 மணி நேரம் இயக்கவும்.' },
      { phase: 'புரோபயாடிக் பயன்பாடு & தீவன சீரமைப்பு (நாட்கள் 31 to 90)', desc: 'வளரும் இறால்களுக்கான தீவனத்திற்கு மாறவும். 2 மணி நேரத்திற்குப் பிறகு தீவன தட்டுகளைச் சோதிக்கவும். கழிவுகளை மக்கச் செய்யவும் நோய்களைத் தடுக்கவும் வாரந்தோறும் புரோபயாடிக்குகளைப் பயன்படுத்தவும்.' },
      { phase: 'அறுவடை தயாரிப்பு (நாட்கள் 90+)', desc: 'இறால்களின் எண்ணிக்கை மற்றும் எடையை சரிபார்க்கவும். அதிகாலையில் வலைகளைப் பயன்படுத்தி அறுவடை செய்யவும். தரத்தைப் பாதுகாக்க அறுவடை செய்த இறால்களை உடனடியாக பனிக்கூழில் வைக்கவும்.' }
    ],
    'Mud Crab Farming': [
      { phase: 'வரப்பு வேலி & குளத்து தயாரிப்பு (நாட்கள் -10 முதல் -2)', desc: 'நண்டுகள் தப்பிப்பதைத் தடுக்க வரப்புகளில் 1 மீட்டர் உயரமுள்ள பிளாஸ்டிக் வலை வேலியை அமைக்கவும். நண்டுகள் தங்குவதற்கு குளத்தின் அடியில் பிவிசி குழாய்களை வைக்கவும்.' },
      { phase: 'நண்டு இருப்பு வைத்தல் (நாள் 0)', desc: 'சண்டைகள் மற்றும் ஒன்றை ஒன்று உண்பதைத் தவிர்க்க குறைந்த அடர்த்தியில் ஆரோக்கியமான நண்டுகளை (50 கிராம் முதல் 100 கிராம் அளவு) விடவும்.' },
      { phase: 'மீன் கழிவுகள் & கிளிஞ்சல் தீவனம் (நாட்கள் 1 முதல் 45)', desc: 'உடல் எடையில் 5% அளவில் நறுக்கிய மீன் கழிவுகள் அல்லது கிளிஞ்சல் இறைச்சியை வழங்கவும். தீவனத்தை காலை மற்றும் மாலை என பிரித்து வழங்கவும்.' },
      { phase: 'நீரின் தரம் & தோல் உரித்தல் சரிபார்ப்பு (நாட்கள் 46 முதல் 120)', desc: 'கழிவுகளை அகற்ற வாரந்தோறும் 20% நீர் பரிமாற்றம் செய்யவும். தோல் உரித்தலுக்குப் பிறகு ஓடு கெட்டியாக போதுமான கால்சியம் அளவை உறுதி செய்யவும்.' },
      { phase: 'அறுவடை (நாட்கள் 120+)', desc: 'வலைகள் அல்லது மூங்கில் கூண்டுகளைப் பயன்படுத்தி நண்டுகளைப் பிடிக்கவும். காயங்களைத் தவிர்க்க நண்டுகளின் கொடுக்கை உடனடியாக சணல் கயிற்றால் கட்டவும்.' }
    ],
    'Seaweed Cultivation': [
      { phase: 'மூங்கில் மிதவைகள் & கயிறுகள் தயாரிப்பு (நாட்கள் -5 முதல் -1)', desc: 'மிதக்கும் மூங்கில் மிதவைகள் (3மீ x 3மீ) அல்லது நீண்ட கயிறுகளைத் தயாரிக்கவும். அலைகளில் நிலைத்திருக்க நங்கூரக் கற்கள் மற்றும் பிளாஸ்டிக் டிரம்ஸைக் கட்டவும்.' },
      { phase: 'நாற்றுகளைக் கட்டுதல் (நாள் 0)', desc: 'மென்மையான பிளாஸ்டிக் நூல்களைப் பயன்படுத்தி 15 செ.மீ இடைவெளியில் புதிய பாசித் துண்டுகளை (80-100 கிராம்) மிதவைக் கயிறுகளில் கட்டவும்.' },
      { phase: 'கடலில் மிதவைகளை விடுதல் (நாள் 1)', desc: 'நிலையான அலை ஓட்டம் உள்ள ஆழமற்ற கடல் நீரில் (1.5 மீ முதல் 2.5 மீ ஆழம்) மிதவைகளை விட்டு நங்கூரமிடவும். பாசி நீர் மட்டத்திற்கு 30 செ.மீ கீழே இருப்பதை உறுதி செய்யவும்.' },
      { phase: 'பாசி மற்றும் கழிவுகளைச் சுத்தம் செய்தல் (நாட்கள் 2 முதல் 40)', desc: 'வண்டல் மற்றும் கழிவுகளை அகற்ற வாரந்தோறும் கயிறுகளைச் சுத்தம் செய்யவும். சேதமடைந்த நாற்றுகளை மாற்றவும்.' },
      { phase: 'அறுவடை & உலர்த்துதல் (நாட்கள் 45+)', desc: 'வெயிலின் தாக்கத்தால் பாசி வெளுத்துப் போவதற்கு முன் அறுவடை செய்யவும். ஈரப்பதம் 35% ஆக குறையும் வரை சுத்தமான துணியில் 3 நாட்கள் உலர வைக்கவும்.' }
    ]
  }
};

const offlineTipsTranslations = {
  en: {
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
  },
  hi: {
    waterManagementTips: [
      `सेची डिस्क का उपयोग करके रोजाना पानी की पारदर्शिता की निगरानी करें (इष्टतम सीमा: 30-40 सेमी)।`,
      `पानी का पीएच 7.5 और 8.5 के बीच बनाए रखें, और दिन में दो बार घुलनशील ऑक्सीजन के स्तर की जांच करें।`
    ],
    feedTips: [
      `तालाब की सतह पर फ़ीड को समान रूप से बिखेरें या फ़ीड सेवन की निगरानी के लिए फीडिंग ट्रे का उपयोग करें।`,
      `पानी के तापमान और साप्ताहिक विकास नमूने के आधार पर खिलाने की दरों को समायोजित करें।`
    ],
    warnings: [
      `अचानक भारी बारिश से लवणता और तापमान में तेजी से गिरावट आ सकती है। तुरंत वातन बढ़ाएं।`,
      `सड़ने वाले तल के कीचड़ से जहरीली अमोनिया और हाइड्रोजन सल्फाइड का निर्माण हो सकता है।`
    ]
  },
  te: {
    waterManagementTips: [
      `సెక్కి డిస్క్ ఉపయోగించి రోజువారీ నీటి పారదర్శకతను పర్యవేక్షించండి (అనుకూల పరిధి: 30-40 సెం.మీ).`,
      `నీటి pH ని 7.5 మరియు 8.5 మధ్య ఉంచండి మరియు రోజుకు రెండుసార్లు కరిగిన ఆక్సిజన్ స్థాయిలను తనిఖీ చేయండి.`
    ],
    feedTips: [
      `ఫీడ్‌ను చెరువు ఉపరితలంపై సమానంగా చల్లండి లేదా ఫీడ్ వినియోగాన్ని పర్యవేక్షించడానికి ఫీడింగ్ ట్రేలను ఉపయోగించండి।`,
      `నీటి ఉష్ణోగ్రత మరియు వారపు ఎదుగుదల నమూనా ఆధారంగా ఫీడింగ్ రేట్లను సర్దుబాటు చేయండి.`
    ],
    warnings: [
      `అకస్మాత్తుగా కురిసే భారీ వర్షాల వల్ల ఉప్పు శాతం మరియు ఉష్ణోగ్రత వేగంగా పడిపోవచ్చు. వెంటనే ఏరేషన్ పెంచండి।`,
      `కుళ్ళిపోయే అడుగు బురద వల్ల విషపూరిత అమ్మోనియా మరియు హైడ్రోజన్ సల్ఫైడ్ చేరవచ్చు.`
    ]
  },
  ta: {
    waterManagementTips: [
      `செச்சி வட்டைப் பயன்படுத்தி தினமும் நீரின் தெளிவுத்தன்மையைக் கண்காணிக்கவும் (உகந்த அளவு: 30-40 செ.மீ).`,
      `நீரின் pH அளவை 7.5 முதல் 8.5 வரை பராமரிக்கவும், கரைந்த ஆக்ஸிஜன் அளவை தினமும் இருமுறை சரிபார்க்கவும்.`
    ],
    feedTips: [
      `குளத்தின் மேற்பரப்பில் தீவனத்தை சமமாக பரப்பவும் அல்லது தீவன பயன்பாட்டைக் கண்காணிக்க தீவன தட்டுகளைப் பயன்படுத்தவும்.`,
      `நீரின் வெப்பநிலை மற்றும் வாராந்திர வளர்ச்சி மாதிரியின் அடிப்படையில் தீவன அளவை சரிசெய்யவும்.`
    ],
    warnings: [
      `திடீர் கனமழை உவர்ப்பு மற்றும் வெப்பநிலையில் விரைவான வீழ்ச்சியை ஏற்படுத்தக்கூடும். உடனடியாக காற்றோட்டத்தை அதிகரிக்கவும்.`,
      `அடியில் அழுகும் வண்டல் கழிவுகள் நச்சு அமோனியா மற்றும் ஹைட்ரஜன் சல்பைட் உருவாக்கத்திற்கு வழிவகுக்கும்.`
    ]
  }
};

export default function Services() {
  const sectionRef = useRef(null);
  const { t, i18n } = useTranslation();
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
  const handleServiceSelect = useCallback((service) => {
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
  }, []);

  useEffect(() => {
    const handleOpenPlanner = (event) => {
      const type = event.detail;
      let matchedTitle = '';
      if (type === 'shrimp') matchedTitle = 'Shrimp Culture';
      else if (type === 'fish') matchedTitle = 'Fish Farming';
      else if (type === 'crab') matchedTitle = 'Mud Crab Farming';
      else if (type === 'seaweed') matchedTitle = 'Seaweed Cultivation';

      const found = services.find(s => s.title === matchedTitle);
      if (found) {
        handleServiceSelect(found);
        setTimeout(() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    window.addEventListener('open-cultivation-planner', handleOpenPlanner);
    return () => window.removeEventListener('open-cultivation-planner', handleOpenPlanner);
  }, [handleServiceSelect]);

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
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl && (!apiKey || !endpoint)) {
      console.warn("Azure OpenAI API credentials missing, running local fallback calculator.");
      // Small simulated delay for realistic feel
      setTimeout(() => {
        runOfflineGenerator();
        setLoadingPlan(false);
      }, 1200);
      return;
    }

    try {
      if (apiUrl) {
        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/aquafuture/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceTitle: selectedService.title,
            pondSize,
            pondDepth,
            waterSource,
            aerationPower,
            stockingDensity,
            targetWeight,
            language: i18n.language
          })
        });

        if (!response.ok) {
          throw new Error(`Backend schedule API error! status: ${response.status}`);
        }

        const parsedPlan = await response.json();

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
      } else {
        const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
        
        const languageNameMap = {
          en: 'English',
          hi: 'Hindi (in Devanagari script)',
          te: 'Telugu (in Telugu script)',
          ta: 'Tamil (in Tamil script)'
        };
        const currentLangName = languageNameMap[i18n.language] || 'English';

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
Ensure the JSON is perfectly valid. Do not include any other text, markdown blocks, or explanation.
IMPORTANT: The values for keys "phase", "desc" (inside timeline), "waterManagementTips", "feedTips", and "warnings" MUST be fully translated and written in the ${currentLangName} language (in its native script). Do NOT translate key names like "survivalRate", "biomass", "totalFeed", "timeline", "phase", "desc", "waterManagementTips", "feedTips", "warnings".`;

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
      }
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

    const currentLang = offlineTimelineTranslations[i18n.language] ? i18n.language : 'en';
    const localizedTimeline = offlineTimelineTranslations[currentLang][selectedService.title] || offlineTimelineTranslations['en'][selectedService.title];
    const localizedTips = offlineTipsTranslations[currentLang] || offlineTipsTranslations['en'];

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
      timeline: localizedTimeline,
      waterManagementTips: localizedTips.waterManagementTips,
      feedTips: localizedTips.feedTips,
      warnings: localizedTips.warnings
    });
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


  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            {t('services.badge')}
          </div>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-subtitle">
            {t('services.subtitle')}
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
              <h3>{t(`services.${service.key}Title`)}</h3>
              <p>{t(`services.${service.key}Desc`)}</p>
              <span className="service-tag">{t(`services.${service.key}Tag`)}</span>
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
                <h2>{t('services.modal.plannerTitle', { title: t(`services.${selectedService.key}Title`) })}</h2>
                <div className="scientific-name">{t('services.modal.scientificAdvisory')}</div>
              </div>
              <span className="modal-tag">{t('services.modal.tag')}</span>
            </div>

            {!generatedPlan && !loadingPlan && (
              <>
                <p className="modal-desc">{t(`services.${selectedService.key}Desc`)}</p>
                <div className="modal-body">
                  <form onSubmit={handleGeneratePlan} className="scheduler-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('services.modal.pondArea')}</label>
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
                        <label>{t('services.modal.depth')}</label>
                        <select value={pondDepth} onChange={(e) => setPondDepth(parseInt(e.target.value))}>
                          <option value={3}>{t('services.modal.depthFeet', { count: 3 })}</option>
                          <option value={4}>{t('services.modal.depthFeet', { count: 4 })}</option>
                          <option value={5}>{t('services.modal.depthOptimal', { count: 5 })}</option>
                          <option value={6}>{t('services.modal.depthFeet', { count: 6 })}</option>
                          <option value={7}>{t('services.modal.depthFeet', { count: 7 })}</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('services.modal.waterSource')}</label>
                        <select value={waterSource} onChange={(e) => setWaterSource(e.target.value)}>
                          <option value="Borewell">{t('services.modal.waterCanal')}</option>
                          <option value="Estuary / Brackish">{t('services.modal.waterEstuary')}</option>
                          <option value="Sea Water">{t('services.modal.waterSea')}</option>
                          <option value="Freshwater Canal">{t('services.modal.waterCanal')}</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>{t('services.modal.aeration')}</label>
                        <select value={aerationPower} onChange={(e) => setAerationPower(e.target.value)}>
                          <option value="None">{t('services.modal.aerationNone')}</option>
                          <option value="2 HP Paddlewheel">{t('services.modal.aeration2hp')}</option>
                          <option value="4 HP Paddlewheel">{t('services.modal.aeration4hp')}</option>
                          <option value="Venturi Air Injector">{t('services.modal.aerationVenturi')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('services.modal.stockingQty')}</label>
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
                        <label>{t('services.modal.targetWeight')}</label>
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
                      {t('services.modal.submit')}
                      <span>→</span>
                    </button>
                  </form>
                </div>
              </>
            )}

            {loadingPlan && (
              <div className="scheduler-loading-box">
                <div className="loading-spinner"></div>
                <h4>{t('services.modal.loadingTitle')}</h4>
                <p>{t('services.modal.loadingDesc')}</p>
              </div>
            )}

            {generatedPlan && !loadingPlan && (
              <>
                <p className="modal-desc">
                  {t('services.modal.advisoryReport', { size: generatedPlan.pondSize, title: t(`services.${selectedService.key}Title`), source: generatedPlan.waterSource })}
                </p>

                <div className="modal-tabs">
                  <button 
                    className={`modal-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    📊 {t('services.modal.tabSummary')}
                  </button>
                  <button 
                    className={`modal-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                  >
                    📋 {t('services.modal.tabTimeline')}
                  </button>
                  <button 
                    className={`modal-tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guidelines')}
                  >
                    🛡️ {t('services.modal.tabTips')}
                  </button>
                </div>

                <div className="modal-body">
                  {activeTab === 'summary' && (
                    <div className="scheduler-output-box">
                      {planError && <div className="plan-warning-banner">⚠️ {planError}</div>}
                      
                      <div className="plan-summary-grid">
                        <div className="summary-item">
                          <span className="summary-lbl">{t('services.modal.survivalRate')}</span>
                          <span className="summary-val text-cyan">{generatedPlan.survivalRate}%</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-lbl">{t('services.modal.biomass')}</span>
                          <span className="summary-val text-green">{generatedPlan.biomass.toLocaleString()} kg</span>
                        </div>
                        {generatedPlan.totalFeed > 0 && (
                          <div className="summary-item">
                            <span className="summary-lbl">{t('services.modal.totalFeed')}</span>
                            <span className="summary-val text-yellow">{generatedPlan.totalFeed.toLocaleString()} kg</span>
                          </div>
                        )}
                      </div>

                      <div className="inputs-summary-box">
                        <h3>{t('services.modal.configParams') || 'Configuration Parameters'}</h3>
                        <div className="parameters-summary-grid">
                          <div className="summary-param-item">
                            <span className="param-lbl">{t('services.modal.pondArea')}:</span>
                            <span className="param-val">{generatedPlan.pondSize} Acres</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">{t('services.modal.depth')}:</span>
                            <span className="param-val">{generatedPlan.pondDepth} Feet</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">{t('services.modal.waterSource')}:</span>
                            <span className="param-val">{generatedPlan.waterSource}</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">{t('services.modal.aeration')}:</span>
                            <span className="param-val">{generatedPlan.aerationPower}</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">{t('services.modal.stockingQty')}:</span>
                            <span className="param-val">{generatedPlan.stockingDensity.toLocaleString()} pcs</span>
                          </div>
                          <div className="summary-param-item">
                            <span className="param-lbl">{t('services.modal.targetWeight')}:</span>
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
                        <h3>🧪 {t('services.modal.waterTipsTitle')}</h3>
                        <ul className="guidelines-list">
                          {generatedPlan.waterManagementTips.map((tip, idx) => (
                            <li key={idx}>🔹 {tip}</li>
                          ))}
                        </ul>

                        <h3 style={{ marginTop: '24px' }}>🌾 {t('services.modal.feedTipsTitle')}</h3>
                        <ul className="guidelines-list">
                          {generatedPlan.feedTips.map((tip, idx) => (
                            <li key={idx}>🔹 {tip}</li>
                          ))}
                        </ul>

                        {generatedPlan.warnings && generatedPlan.warnings.length > 0 && (
                          <div className="warnings-alert-box">
                            <h4>⚠️ {t('services.modal.riskTitle')}</h4>
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
                    ← {t('services.modal.reset')}
                  </button>
                  <button 
                    onClick={downloadSchedulerPdf} 
                    className="pdf-download-btn form-submit-btn"
                    style={{ margin: 0, padding: '12px 24px' }}
                  >
                    📥 {t('services.modal.downloadPdf')}
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
