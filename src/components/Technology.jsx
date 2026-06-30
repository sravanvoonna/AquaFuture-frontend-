import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const schemeLocalizations = {
  hi: {
    'PMMSY Subsidy for Shrimp Ponds': {
      title: 'झींगा तालाबों के लिए पीएमएमएसवाई सब्सिडी',
      desc: 'नए झींगा तालाबों के निर्माण, एरेटर की खरीद और बायोफ्लोक इनपुट लागत के लिए 40% से 60% सब्सिडी प्राप्त करें।',
      eligibility: 'इसके लिए पंजीकृत सीएए लाइसेंस, भूमि स्वामित्व प्रमाण पत्र या 7 साल का लीज डीड आवश्यक है।'
    },
    'Subsidized Electricity for Aquaculture Ponds': {
      title: 'एक्वाकल्चर तालाबों के लिए रियायती बिजली',
      desc: 'आंध्र प्रदेश सरकार पंजीकृत एक्वा तालाबों के लिए ₹1.50 प्रति यूनिट की अत्यधिक रियायती दर पर बिजली प्रदान करती है।',
      eligibility: '10 एकड़ तक के तालाबों के लिए उपलब्ध। सक्रिय सीएए प्रमाण पत्र आवश्यक है।'
    },
    'West Bengal Crab Fattening Scheme': {
      title: 'पश्चिम बंगाल केकड़ा पालन योजना',
      desc: 'तटीय सुंदरवन के ज्वारीय मिट्टी के फ्लैटों में मिट्टी के केकड़ों के पालन के लिए वित्तीय सहायता और इनपुट (बांस के पिंजरे, चारा) वितरण।',
      eligibility: 'सुंदरवन क्षेत्र के स्वयं सहायता समूहों (SHGs) और सीमांत मछुआरों के लिए खुला है।'
    },
    'Jal Dharo Jal Bharo Carp Subsidy': {
      title: 'जल धरो जल भरो कार्प सब्सिडी',
      desc: 'मीठे पानी के कार्प बीज संचयन को एकीकृत करने के लिए 50% राज्य सब्सिडी के साथ सामुदायिक तालाबों की पुनः खुदाई।',
      eligibility: 'पंचायत-अनुमोदित सामुदायिक तालाबों के लिए उपलब्ध है।'
    },
    'TN Seaweed Cultivation Rafts Scheme': {
      title: 'तमिलनाडु समुद्री शैवाल खेती राफ्ट योजना',
      desc: 'बांस के राफ्ट, रस्सियों और समुद्री शैवाल के पौधे खरीदने के लिए तटीय स्वयं सहायता समूहों (SHG) को 60% तक सब्सिडी।',
      eligibility: 'तटीय गांवों के निवासियों तक सीमित। महिला सहकारी समितियों को प्राथमिकता दी जाती है।'
    },
    'PMMSY Cage Culture in Marine Waters': {
      title: 'समुद्री पानी में पीएमएमएसवाई केज कल्चर',
      desc: 'एशियाई सी बास (भेटकी) और पोम्पानो मछलियों के प्रजनन के लिए फ्लोटिंग मेटल पिंजरे स्थापित करने के लिए वित्तीय सहायता।',
      eligibility: 'तमिलनाडु मैरीटाइम बोर्ड से पट्टा अनुमति और CMFRI से प्रशिक्षण प्रमाण पत्र की आवश्यकता है।'
    },
    'Subsidized Pokkali paddy-shrimp Cultivation': {
      title: 'रियायती पोक्काली धान-झींगा खेती',
      desc: 'एरनाकुलम और अलाप्पुझा में पारंपरिक पोक्काली जैविक धान-झींगा चक्र खेती का अभ्यास करने वाले किसानों के लिए ₹25,000 प्रति हेक्टेयर की वित्तीय सहायता।',
      eligibility: 'प्रमाणित पोक्काली भूमि पार्सल तक सीमित। धान चक्र के दौरान शून्य कीटनाशक आवश्यक।'
    },
    'Kerala Fish Biofloc Subsidy': {
      title: 'केरल मत्स्य बायोफ्लोकल सब्सिडी',
      desc: 'तिलापिया और पंगासियस पालन के लिए 4-टैंक इनडोर बायोफ्लोक सेटअप के निर्माण के लिए 40% पूंजी सब्सिडी।',
      eligibility: 'ADAK से 3 दिवसीय बायोफ्लोक प्रशिक्षण प्रमाण पत्र और बिजली विभाग की मंजूरी आवश्यक है।'
    }
  },
  te: {
    'PMMSY Subsidy for Shrimp Ponds': {
      title: 'రొయ్యల చెరువులకు PMMSY సబ్సిడీ',
      desc: 'కొత్త రొయ్యల చెరువుల నిర్మాణం, ఏరేటర్ల కొనుగోలు మరియు బయోఫ్లాక్ ఖర్చుల కోసం 40% నుండి 60% సబ్సిడీ పొందండి.',
      eligibility: 'రిజిస్టర్డ్ CAA లైసెన్స్, భూమి యాజమాన్య పత్రం లేదా 7 సంవత్సరాల లీజు పత్రం అవసరం.'
    },
    'Subsidized Electricity for Aquaculture Ponds': {
      title: 'ఆక్వా చెరువులకు రాయితీ విద్యుత్',
      desc: 'ఆంధ్రప్రదేశ్ ప్రభుత్వం నమోదిత ఆక్వా చెరువులకు యూనిట్‌కు ₹1.50 విద్యుత్ రాయితీని అందిస్తుంది.',
      eligibility: '10 ఎకరాల వరకు ఉన్న ఫారమ్‌లకు వర్తిస్తుంది. యాక్టివ్ CAA సర్టిఫికేట్ అవసరం.'
    },
    'West Bengal Crab Fattening Scheme': {
      title: 'పశ్చిమ బెంగాల్ పీతల పెంపకం పథకం',
      desc: 'సుందర్బన్స్ తీరప్రాంత మడ అడవులలో పీతల పెంపకం కోసం ఆర్థిక సహాయం మరియు పరికరాల పంపిణీ.',
      eligibility: 'సుందర్బన్ ప్రాంతంలోని స్వయం సహాయక సంఘాలు (SHGలు) మరియు చిన్న మత్స్యకారులకు వర్తిస్తుంది.'
    },
    'Jal Dharo Jal Bharo Carp Subsidy': {
      title: 'జల్ ధరో జల్ భరో కార్ప్ సబ్సిడీ',
      desc: 'మంచినీటి చేప పిల్లల పెంపకాన్ని ప్రోత్సహించడానికి 50% ప్రభుత్వ సబ్సిడీతో చెరువుల పునరుద్ధరణ.',
      eligibility: 'పంచాయతీ ఆమోదించిన కమ్యూనిటీ చెరువులకు వర్తిస్తుంది.'
    },
    'TN Seaweed Cultivation Rafts Scheme': {
      title: 'సముద్రపు నాచు సాగు తెప్పల పథకం',
      desc: 'వెదురు తెప్పలు, తాడులు మరియు నాచు ముక్కల కొనుగోలు కోసం తీరప్రాంత మహిళా సంఘాలకు 60% సబ్సిడీ.',
      eligibility: 'తీరప్రాంత గ్రామాల నివాసితులకు మాత్రమే. మహిళా సహకార సంఘాలకు ప్రాధాన్యత.'
    },
    'PMMSY Cage Culture in Marine Waters': {
      title: 'సముద్ర నీటిలో PMMSY కేజ్ కల్చర్',
      desc: 'ఆసియా సీ బాస్ (భేట్కి) చేపల పెంపకం కోసం తేలియాడే ఇనుప బోనుల ఏర్పాటుకు ఆర్థిక సహాయం.',
      eligibility: 'తమిళనాడు మారిటైమ్ బోర్డ్ నుండి లీజు అనుమతి మరియు CMFRI శిక్షణ పత్రం అవసరం.'
    },
    'Subsidized Pokkali paddy-shrimp Cultivation': {
      title: 'రాయితీ పోక్కాలి వరి-రొయ్యల సాగు',
      desc: 'సాంప్రదాయ పోక్కాలి సేంద్రీయ వరి-రొయ్యల మార్పిడి సాగు చేసే రైతుల కోసం హెక్టారుకు ₹25,000 ఆర్థిక సహాయం.',
      eligibility: 'సర్టిఫైడ్ పోక్కాలి భూమి ఉన్నవారికి వర్తిస్తుంది. రసాయన మందులు వాడకూడదు.'
    },
    'Kerala Fish Biofloc Subsidy': {
      title: 'కేరళ ఫిష్ బయోఫ్లాక్ సబ్సిడీ',
      desc: 'తిలాపియా మరియు పంగేసియస్ సాగు కోసం 4-ట్యాంక్ బయోఫ్లాక్ యూనిట్ నిర్మాణానికి 40% సబ్సిడీ.',
      eligibility: 'ADAK నుండి 3 రోజుల బయోఫ్లాక్ శిక్షణ పత్రం మరియు విద్యుత్ శాఖ అనుమతి అవసరం.'
    }
  },
  ta: {
    'PMMSY Subsidy for Shrimp Ponds': {
      title: 'இறால் குளங்களுக்கான PMMSY மானியம்',
      desc: 'புதிய இறால் குளங்கள் அமைக்க, காற்றோட்ட சாதனங்கள் வாங்க மற்றும் பயோஃப்ளாக் செலவுகளுக்கு 40% முதல் 60% மானியம் பெறலாம்.',
      eligibility: 'பதிவு செய்யப்பட்ட CAA உரிமம், நில உரிமைப் பத்திரம் அல்லது 7 ஆண்டு குத்தகை பத்திரம் தேவை.'
    },
    'Subsidized Electricity for Aquaculture Ponds': {
      title: 'மீன்வளர்ப்பு குளங்களுக்கான மானிய மின்சாரம்',
      desc: 'ஆந்திர அரசு பதிவு செய்யப்பட்ட குளங்களுக்கு ஒரு யூனிட் ₹1.50 என்ற மானிய விலையில் மின்சாரம் வழங்குகிறது.',
      eligibility: '10 ஏக்கர் வரையிலான குளங்களுக்குக் கிடைக்கும். செயலில் உள்ள CAA சான்றிதழ் தேவை.'
    },
    'West Bengal Crab Fattening Scheme': {
      title: 'மேற்கு வங்க நண்டு வளர்ப்பு திட்டம்',
      desc: 'சுந்தரவன கடலோரப் பகுதிகளில் நண்டு வளர்ப்பிற்கான நிதியுதவி மற்றும் உபகரணங்கள் (மூங்கில் கூண்டுகள், தீவனம்) வழங்குதல்.',
      eligibility: 'சுந்தரவனப் பகுதி மகளிர் குழுக்கள் (SHG) மற்றும் சிறு மீனவர்களுக்கு மட்டுமே.'
    },
    'Jal Dharo Jal Bharo Carp Subsidy': {
      title: 'ஜல் தாரோ ஜல் பாரோ கெண்டை மானியம்',
      desc: 'நன்னீர் மீன் வளர்ப்பை ஒருங்கிணைக்க 50% அரசு மானியத்துடன் சமூகக் குளங்களை மீண்டும் தோண்டுதல்.',
      eligibility: 'பஞ்சாயத்து அங்கீகரித்த சமூகக் குளங்களுக்குப் பொருந்தும்.'
    },
    'TN Seaweed Cultivation Rafts Scheme': {
      title: 'கடல் பாசி வளர்ப்பு மிதவை திட்டம்',
      desc: 'கடலோர மகளிர் குழுக்கள் மூங்கில் மிதவைகள், கயிறுகள் மற்றும் பாசி நாற்றுகள் வாங்க 60% வரை மானியம்.',
      eligibility: 'கடலோர கிராம மக்களுக்கு மட்டுமே. இராமநாதபுரம் மாவட்ட கடல் பாசி திட்டத்தில் மகளிர் குழுக்களுக்கு முன்னுரிமை.',
    },
    'PMMSY Cage Culture in Marine Waters': {
      title: 'கடல் நீரில் PMMSY கூண்டு மீன் வளர்ப்பு',
      desc: 'கொடுவா மீன் வளர்ப்பிற்கான மிதக்கும் இரும்பு கூண்டுகளை அமைக்க நிதியுதவி வழங்குதல்.',
      eligibility: 'தமிழ்நாடு கடல்சார் வாரியத்தின் குத்தகை அனுமதி மற்றும் CMFRI பயிற்சி சான்றிதழ் தேவை.'
    },
    'Subsidized Pokkali paddy-shrimp Cultivation': {
      title: 'மானிய விலையில் பொக்காலி நெல்-இறால் வளர்ப்பு',
      desc: 'பாரம்பரிய பொக்காலி நெல்-இறால் சுழற்சி முறையில் வளர்க்கும் விவசாயிகளுக்கு ஹெக்டேருக்கு ₹25,000 நிதியுதவி.',
      eligibility: 'சான்றளிக்கப்பட்ட பொக்காலி நிலங்களுக்கு மட்டுமே. நெல் சுழற்சியின் போது பூச்சிக்கொல்லி பயன்படுத்தக் கூடாது.'
    },
    'Kerala Fish Biofloc Subsidy': {
      title: 'கேரளா மீன் பயோஃப்ளாக் மானியம்',
      desc: 'திலாப்பியா மற்றும் கெளுத்தி வளர்ப்பிற்கான 4-தொட்டி பயோஃப்ளாக் அலகு அமைக்க 40% மூலதன மானியம்.',
      eligibility: 'ADAK அமைப்பின் 3 நாள் பயோஃப்ளாக் பயிற்சி சான்றிதழ் மற்றும் மின்சாரத் துறை அனுமதி தேவை.'
    }
  }
};

const rateNameLocalizations = {
  hi: {
    'Vannamei Shrimp (100 Count)': 'वन्नामेई झींगा (100 काउंट)',
    'Vannamei Shrimp (60 Count)': 'वन्नामेई झींगा (60 काउंट)',
    'Rohu Fish (1-2 kg size)': 'रोहू मछली (1-2 किलोग्राम आकार)',
    'Catla Fish (Large 2kg+)': 'कतला मछली (बड़ी 2kg+)',
    'Freshwater Scampi (50g)': 'मीठे पानी का स्कैम्पी (50 ग्राम)',
    'Mud Crab (XXL 500g+)': 'मड केकड़ा (XXL 500g+)',
    'Rohu Fish (Bazar Size)': 'रोहू मछली (बाजार आकार)',
    'Hilsa Fish (500g)': 'हिलसा मछली (500 ग्राम)',
    'Pangasius Catfish': 'पंगासियस कैटफ़िश',
    'Kappaphycus Seaweed (Dry)': 'कप्पाफाइकस समुद्री शैवाल (सूखा)',
    'Asian Seabass / Bhetki': 'एशियाई सी बास / भेटकी',
    'Tiger Prawn (30 Count)': 'टाइगर झींगा (30 काउंट)',
    'Tilapia Fish': 'तिलापिया मछली',
    'Pearl Spot / Karimeen': 'पर्ल स्पॉट / करीमीन',
    'Tilapia Fish (Biofloc)': 'तिलापिया मछली (बायोफ्लोक)',
    'Mrigal Bazar Carp': 'मृगल बाजार कार्प',
    'Bhetki / Seabass': 'भेटकी / सी बास',
    'Rohu Fish (Medium)': 'रोहू मछली (मध्यम)',
    'Catla Fish (Medium)': 'कतला मछली (मध्यम)'
  },
  te: {
    'Vannamei Shrimp (100 Count)': 'పసిఫిక్ వైట్ రొయ్య (100 కౌంట్)',
    'Vannamei Shrimp (60 Count)': 'పసిఫిక్ వైట్ రొయ్య (60 కౌంట్)',
    'Rohu Fish (1-2 kg size)': 'రోహు చేప (1-2 కేజీలు)',
    'Catla Fish (Large 2kg+)': 'కట్ల చేప (పెద్దది 2kg+)',
    'Freshwater Scampi (50g)': 'మంచినీటి రొయ్య (50 గ్రా)',
    'Mud Crab (XXL 500g+)': 'మడ్ పీత (XXL 500g+)',
    'Rohu Fish (Bazar Size)': 'రోహు చేప (బజార్ సైజ్)',
    'Hilsa Fish (500g)': 'పులస / హిల్సా చేప (500 గ్రా)',
    'Pangasius Catfish': 'పంగేసియస్ చేప',
    'Kappaphycus Seaweed (Dry)': 'సముద్రపు నాచు (ఎండినది)',
    'Asian Seabass / Bhetki': 'ఆసియా సీ బాస్ / భేట్కి',
    'Tiger Prawn (30 Count)': 'టైగర్ రొయ్య (30 కౌంట్)',
    'Tilapia Fish': 'తిలాపియా చేప',
    'Pearl Spot / Karimeen': 'కరిమీన్ చేప',
    'Tilapia Fish (Biofloc)': 'తిలాపియా చేప (బయోఫ్లాక్)',
    'Mrigal Bazar Carp': 'మృగాల్ చేప',
    'Bhetki / Seabass': 'భేట్కి / సీ బాస్',
    'Rohu Fish (Medium)': 'రోహు చేప (మధ్యమం)',
    'Catla Fish (Medium)': 'కట్ల చేప (మధ్యమం)'
  },
  ta: {
    'Vannamei Shrimp (100 Count)': 'வெள்ளை இறால் (100 எண்ணிக்கை)',
    'Vannamei Shrimp (60 Count)': 'வெள்ளை இறால் (60 எண்ணிக்கை)',
    'Rohu Fish (1-2 kg size)': 'ரோகு மீன் (1-2 கிலோ அளவு)',
    'Catla Fish (Large 2kg+)': 'கட்லா மீன் (பெரியது 2kg+)',
    'Freshwater Scampi (50g)': 'நன்னீர் இறால் (50 கிராம்)',
    'Mud Crab (XXL 500g+)': 'சேற்று நண்டு (XXL 500g+)',
    'Rohu Fish (Bazar Size)': 'ரோகு மீன் (சந்தை அளவு)',
    'Hilsa Fish (500g)': 'ஹில்சா மீன் (500 கிராம்)',
    'Pangasius Catfish': 'கெளுத்தி மீன்',
    'Kappaphycus Seaweed (Dry)': 'கடல் பாசி (உலர்ந்தது)',
    'Asian Seabass / Bhetki': 'கொடுவா மீன் / பெட்கி',
    'Tiger Prawn (30 Count)': 'டைகர் இறால் (30 எண்ணிக்கை)',
    'Tilapia Fish': 'திலாப்பியா மீன்',
    'Pearl Spot / Karimeen': 'கரிமீன் மீன்',
    'Tilapia Fish (Biofloc)': 'திலாப்பியா மீன் (பயோஃப்ளாக்)',
    'Mrigal Bazar Carp': 'மிர்கால் மீன்',
    'Bhetki / Seabass': 'கொடுவா / பெட்கி மீன்',
    'Rohu Fish (Medium)': 'ரோகு மீன் (நடுத்தரம்)',
    'Catla Fish (Medium)': 'கட்லா மீன் (நடுத்தரம்)'
  }
};

const newsLocalizations = {
  hi: {
    'Salinity Alert in Krishna Delta Ponds': {
      title: 'कृष्णा डेल्टा तालाबों में लवणता की चेतावनी',
      desc: 'कृष्णा जिले में भारी मानसूनी जलभराव के कारण तालाब की लवणता [6-11] पीपीटी से नीचे गिर गई है। किसानों को सलाह दी जाती है कि वे पानी के आदान-प्रदान को सीमित करें और कृषि नमक ([100-150] किलोग्राम/एकड़) डालें।'
    },
    'Bhimavaram Seafood Export Hub Expansion': {
      title: 'भीमावरम सीफूड निर्यात हब का विस्तार',
      desc: 'राज्य मत्स्य विभाग ने भीमावरम में [2-4] नए कोल्ड स्टोरेज परिसरों को मंजूरी दी है। इससे स्थानीय किसानों के लिए परिवहन समय [15-30]% कम हो जाएगा।'
    },
    'Nellore White Spot Disease Advisory': {
      title: 'नेल्लोर व्हाइट स्पॉट रोग सलाहकार',
      desc: 'नेल्लोर जिले में बढ़ती आर्द्रता से डब्ल्यूएसएसवी प्रकोप का खतरा [20-40]% बढ़ जाता है। किसानों को सख्त जैव सुरक्षा अपनानी चाहिए।'
    },
    'Nellore Feed Prices Subsidized': {
      title: 'नेल्लोर फ़ीड कीमतों में सब्सिडी',
      desc: 'एपी सरकार ने जिले के पंजीकृत छोटे किसानों के लिए पेलेट फीड पर ₹[2-4]/किग्रा सब्सिडी की घोषणा की।'
    },
    'Kakdwip Mud Crab Hatchery Seed Distribution': {
      title: 'काकद्वीप मड केकड़ा हैचरी बीज वितरण',
      desc: 'काकद्वीप में वाणिज्यिक मड केकड़ा हैचरी ने केकड़े का वितरण शुरू कर दिया है। किसान [30-50]% कम कीमत पर हैचरी-उठाए केकड़े खरीद सकते हैं।'
    },
    'Carp Diseases Alert in East Kolkata Wetlands': {
      title: 'पूर्वी कोलकाता वेटलैंड्स में कार्प रोगों की चेतावनी',
      desc: 'उच्च अपशिष्ट जल के कारण अर्गुलोसिस (मछली जूँ) और पंख सड़ने की शिकायतें। किसानों को चूना ([100-150] किग्रा/एकड़) डालने की सलाह दी जाती है।'
    },
    'Ramanathapuram Seaweed Park Approved': {
      title: 'रामनाथपुरम समुद्री शैवाल पार्क स्वीकृत',
      desc: 'केंद्रीय मंत्रिमंडल ने रामनाथपुरम में ₹127 करोड़ के समुद्री शैवाल पार्क को मंजूरी दी। पार्क में ऊतक संवर्धन प्रयोगशालाएं और [3-5] प्रसंस्करण सुविधाएं होंगी।'
    },
    'Coastal Regulation Zone Advisory for Shrimps': {
      title: 'झींगा पालन के लिए तटीय विनियमन क्षेत्र सलाहकार',
      desc: 'किसानों को अपने तटीय झींगा फार्म के निर्देशांकों को तटीय एक्वाकल्चर प्राधिकरण (CAA) के साथ [10-20] दिनों के भीतर पंजीकृत करना होगा।'
    },
    'Cuddalore Oxygen Depletion Risk': {
      title: 'कुड्डालोर ऑक्सीजन की कमी का खतरा',
      desc: 'कुड्डालोर तालाबों में उच्च सतह के तापमान के कारण सुबह-सुबह घुलित ऑक्सीजन का स्तर [2-4] मिलीग्राम/लीटर से नीचे गिर रहा है। वातन बढ़ाएँ।'
    },
    'Monsoon Backwater Floods Alert': {
      title: 'मानसून बैकवाटर बाढ़ चेतावनी',
      desc: 'भारी बारिश के कारण बैकवाटर की लवणता तेजी से गिर रही है। पोक्काली झींगा किसानों को सलाह दी जाती है कि वे फसल की कटाई [5-10] दिन पहले करें।'
    }
  },
  te: {
    'Salinity Alert in Krishna Delta Ponds': {
      title: 'కృష్ణా డెల్టా చెరువులలో లవణీయత హెచ్చరిక',
      desc: 'కృష్ణా జిల్లాలో భారీ వర్షాల కారణంగా లవణీయత [6-11] ppt కంటే తగ్గింది. రైతులు నీటి మార్పిడిని తగ్గించి, ఎకరానికి [100-150] కిలోల ఉప్పు చల్లాలి.'
    },
    'Bhimavaram Seafood Export Hub Expansion': {
      title: 'భీమవరం సీఫుడ్ ఎగుమతి హబ్ విస్తరణ',
      desc: 'భీమవరంలో [2-4] కొత్త కోల్డ్ స్టోరేజ్ కాంప్లెక్స్‌లకు ఆమోదం. ఇది రవాణా సమయాన్ని [15-30]% తగ్గిస్తుంది.'
    },
    'Nellore White Spot Disease Advisory': {
      title: 'నెల్లూరు వైట్ స్పాట్ వ్యాధి హెచ్చరిక',
      desc: 'నెల్లూరు జిల్లాలో తేమ పెరగడం వల్ల WSSV వ్యాప్తి ముప్పు [20-40]% పెరుగుతుంది. రైతులు కఠినమైన బయోసెక్యూరిటీని పాటించాలి.'
    },
    'Nellore Feed Prices Subsidized': {
      title: 'నెల్లూరు మేత ధరలపై సబ్సిడీ',
      desc: 'నమోదిత ఆక్వా రైతులకు మేతపై కిలోకు ₹[2-4] సబ్సిడీని ప్రభుత్వం ప్రకటించింది.'
    },
    'Kakdwip Mud Crab Hatchery Seed Distribution': {
      title: 'కక్‌ద్వీప్ మడ్ పీతల హేచరీ పంపిణీ',
      desc: 'కక్‌ద్వీప్‌లోని హేచరీ నుండి పీత పిల్లల పంపిణీ ప్రారంభమైంది. రైతులు [30-50]% తక్కువ ధరకే వీటిని పొందవచ్చు.'
    },
    'Carp Diseases Alert in East Kolkata Wetlands': {
      title: 'చేపల వ్యాధుల హెచ్చరిక',
      desc: 'మురుగునీటి భారాల వల్ల చేపలకు పేను వ్యాధి మరియు తోక కుళ్లుడు సంభవించాయి. ఎకరానికి [100-150] కిలోల సున్నం చల్లాలి.'
    },
    'Ramanathapuram Seaweed Park Approved': {
      title: 'రామనాథపురం సముద్రపు నాచు పార్క్ ఆమోదం',
      desc: 'రామనాథపురంలో ₹127 కోట్ల సముద్రపు నాచు పార్కును కేంద్ర కేబినెట్ ఆమోదించింది. ఇక్కడ టిష్యూ కల్చర్ ల్యాబ్‌లు ఉంటాయి.'
    },
    'Coastal Regulation Zone Advisory for Shrimps': {
      title: 'రొయ్యల సాగుదారులకు తీర ప్రాంత నియంత్రణ సలహా',
      desc: 'రైతులు తమ రొయ్యల చెరువు వివరాలను [10-20] రోజుల్లోగా CAA వద్ద నమోదు చేసుకోవాలి.'
    },
    'Cuddalore Oxygen Depletion Risk': {
      title: 'కడలూరు ఆక్సిజన్ క్షీణత ముప్పు',
      desc: 'అధిక ఉష్ణోగ్రతల వల్ల తెల్లవారుజామున ఆక్సిజన్ స్థాయి [2-4] mg/L కంటే పడిపోతోంది. ఏరేటర్ల సమయాన్ని [2-4] గంటలు పెంచండి.'
    },
    'Monsoon Backwater Floods Alert': {
      title: 'రుతుపవనాల బ్యాక్ వాటర్ వరదల హెచ్చరిక',
      desc: 'భారీ వర్షాల వల్ల లవణీయత పడిపోతోంది. పొక్కాలి రొయ్యల రైతులు పంటను [5-10] రోజులు ముందుగానే హార్వెస్ట్ చేసుకోవాలి.'
    }
  },
  ta: {
    'Salinity Alert in Krishna Delta Ponds': {
      title: 'கிருஷ்ணா டெல்டா குளங்களில் உவர்ப்புத்தன்மை எச்சரிக்கை',
      desc: 'கனமழை காரணமாக கிருஷ்ணா மாவட்டத்தில் உவர்ப்புத்தன்மை [6-11] ppt ஆக குறைந்துள்ளது. விவசாயிகள் எக்டேருக்கு [100-150] கிலோ உப்பு பயன்படுத்தவும்.'
    },
    'Bhimavaram Seafood Export Hub Expansion': {
      title: 'பீமாவரம் கடல் உணவு ஏற்றுமதி மையம் விரிவாக்கம்',
      desc: 'பீமாவரத்தில் [2-4] புதிய குளிர்பதன கிடங்குகளுக்கு ஒப்புதல். இது போக்குவரத்து நேரத்தை [15-30]% குறைக்கும்.'
    },
    'Nellore White Spot Disease Advisory': {
      title: 'நெல்லூர் வெள்ளைப்புள்ளி நோய் எச்சரிக்கை',
      desc: 'நெல்லூர் மாவட்டத்தில் உவர்ப்புத்தன்மை மற்றும் ஈரப்பதம் அதிகரிப்பு காரணமாக WSSV பாதிப்பு [20-40]% அதிகரிக்கலாம். கடுமையான உயிர் பாதுகாப்பு தேவை.'
    },
    'Nellore Feed Prices Subsidized': {
      title: 'நெல்லூர் தீவன விலையில் மானியம்',
      desc: 'பதிவு செய்யப்பட்ட சிறு விவசாயிகளுக்கு தீவன விலையில் கிலோவுக்கு ₹[2-4] மானியம் வழங்க அரசு முடிவு செய்துள்ளது.'
    },
    'Kakdwip Mud Crab Hatchery Seed Distribution': {
      title: 'காக்ட்வீப் நண்டு குஞ்சுகள் விநியோகம்',
      desc: 'காக்ட்வீப்பில் வணிக ரீதியான நண்டு குஞ்சு விநியோகம் தொடங்கியுள்ளது. விவசாயிகள் [30-50]% குறைந்த விலையில் பெறலாம்.'
    },
    'Carp Diseases Alert in East Kolkata Wetlands': {
      title: 'கெண்டை மீன் நோய் எச்சரிக்கை',
      desc: 'அழுக்கு நீர் காரணமாக மீன்களுக்கு பேன் மற்றும் வால் அழுகல் பாதிப்பு. எக்டேருக்கு [100-150] கிலோ சுண்ணாம்பு பயன்படுத்தவும்.'
    },
    'Ramanathapuram Seaweed Park Approved': {
      title: 'இராமநாதபுரம் கடல் பாசி பூங்கா ஒப்புதல்',
      desc: 'இராமநாதபுரத்தில் ₹127 கோடியில் கடல் பாசி பூங்காவிற்கு மத்திய அமைச்சரவை ஒப்புதல் அளித்துள்ளது.'
    },
    'Coastal Regulation Zone Advisory for Shrimps': {
      title: 'கடலோர ஒழுங்குமுறை எச்சரிக்கை',
      desc: 'விவசாயிகள் தங்கள் குளங்களை [10-20] நாட்களுக்குள் CAA-வில் பதிவு செய்து சான்றிதழ் பெற வேண்டும்.'
    },
    'Cuddalore Oxygen Depletion Risk': {
      title: 'கடலூர் ஆக்ஸிஜன் குறைவு அபாயம்',
      desc: 'அதிக வெப்பநிலையால் அதிகாலையில் ஆக்ஸிஜன் அளவு [2-4] mg/L ஆக குறைகிறது. காற்றோட்ட நேரத்தை [2-4] மணி நேரம் அதிகரிக்கவும்.'
    },
    'Monsoon Backwater Floods Alert': {
      title: 'மழைக்கால வெள்ள எச்சரிக்கை',
      desc: 'கனமழையால் உவர்ப்புத்தன்மை குறைகிறது. பொக்காலி விவசாயிகள் அறுவடையை [5-10] நாட்கள் முன்னதாகவே செய்யவும்.'
    }
  }
};

export default function Technology() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [selectedScheme, setSelectedScheme] = useState(null);
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

  // Localized helpers
  const getLocalizedRateName = (name) => {
    const lang = i18n.language;
    return (rateNameLocalizations[lang] && rateNameLocalizations[lang][name]) || name;
  };

  const getLocalizedNews = (item) => {
    const lang = i18n.language;
    if (newsLocalizations[lang] && newsLocalizations[lang][item.title]) {
      return {
        ...item,
        title: newsLocalizations[lang][item.title].title,
        desc: newsLocalizations[lang][item.title].desc
      };
    }
    return item;
  };

  const getLocalizedScheme = (scheme) => {
    const lang = i18n.language;
    if (schemeLocalizations[lang] && schemeLocalizations[lang][scheme.title]) {
      return {
        ...scheme,
        title: schemeLocalizations[lang][scheme.title].title,
        desc: schemeLocalizations[lang][scheme.title].desc,
        eligibility: schemeLocalizations[lang][scheme.title].eligibility
      };
    }
    return scheme;
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
          updatedNews = selectedNews.map(newsItem => {
            const locItem = getLocalizedNews(newsItem);
            return {
              ...locItem,
              desc: randomizeText(locItem.desc),
              date: todayDate
            };
          });
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
            name: getLocalizedRateName(rate.name),
            price: `₹${finalPrice} / kg`,
            trend,
            change
          };
        });

        // Randomly select 2 news articles from the pool
        const shuffledNews = [...base.newsPool].sort(() => 0.5 - Math.random());
        const selectedNews = shuffledNews.slice(0, 2);

        const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const updatedNews = selectedNews.map(newsItem => {
          const locItem = getLocalizedNews(newsItem);
          return {
            ...locItem,
            desc: randomizeText(locItem.desc),
            date: todayDate
          };
        });

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
          body: JSON.stringify({ stateName, language: i18n.language })
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
        
        const languageNames = {
          en: 'English',
          hi: 'Hindi (written in Devanagari script)',
          te: 'Telugu (written in Telugu script)',
          ta: 'Tamil (written in Tamil script)'
        };
        const currentLanguage = languageNames[i18n.language] || 'English';

        const promptText = `Generate live wholesale aquaculture market rates and regional pond warning alerts for the state of: ${stateName}, India.
Current Date: ${new Date().toLocaleDateString('en-IN')}

IMPORTANT: The values of the keys "name" (inside rates), "title" (inside news), and "desc" (inside news) MUST be fully translated and written in the ${currentLanguage} language. Keep the JSON keys exactly in English (e.g. "rates", "name", "price", "trend", "change", "news", "title", "date", "desc", "alertLevel").

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
            name: getLocalizedRateName(rate.name),
            price: `₹${finalPrice} / kg`,
            trend: fluctuation > 0 ? 'up' : (fluctuation < 0 ? 'down' : 'stable'),
            change: fluctuation !== 0 ? `${fluctuation > 0 ? '+' : ''}₹${Math.abs(fluctuation)}` : '0'
          };
        });
        
        const shuffledNews = [...base.newsPool].sort(() => 0.5 - Math.random());
        const selectedNews = shuffledNews.slice(0, 2);
        const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const updatedNews = selectedNews.map(newsItem => {
          const locItem = getLocalizedNews(newsItem);
          return {
            ...locItem,
            desc: randomizeText(locItem.desc),
            date: todayDate
          };
        });

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

  const stateLabelMap = {
    'Andhra Pradesh': t('regions.ap') || 'Andhra Pradesh',
    'West Bengal': t('regions.wb') || 'West Bengal',
    'Tamil Nadu': t('regions.tn') || 'Tamil Nadu',
    'Kerala': t('regions.kl') || 'Kerala',
    'Odisha': t('regions.od') || 'Odisha'
  };

  return (
    <section className="technology" id="technology" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            {t('technology.badge') || 'Fisheries Support'}
          </div>
          <h2 className="section-title">{t('technology.title') || 'State-Wise Farmer Support Hub'}</h2>
          <p className="section-subtitle">
            {t('technology.subtitle') || 'Toggle state locations to view current market rates, government subsidy schemes, and local fisheries warnings.'}
          </p>

          {/* Premium Dropdown Selector & Refresh Trigger */}
          <div className="state-select-container">
            <label>📍 {t('technology.selectRegion') || 'Select Farming Region:'}</label>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)} 
              className="state-dropdown"
              disabled={loadingFeed || isRefreshingSilent}
            >
              {Object.keys(staticSchemes).map(state => (
                <option key={state} value={state}>{stateLabelMap[state] || state}</option>
              ))}
            </select>

            <button 
              className="eligibility-btn refresh-feed-btn"
              onClick={() => updateFeedData(selectedState)}
              disabled={loadingFeed || isRefreshingSilent}
              style={{ width: 'auto', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              🔄 {loadingFeed || isRefreshingSilent ? (t('technology.updatingBtn') || 'Updating Feed...') : (t('technology.refreshBtn') || 'Refresh Live Data')}
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
                  {isRefreshingSilent || loadingFeed ? (t('technology.fetchingUpdates') || 'Fetching latest updates...') : `${t('technology.liveFeedTicker') || 'Live Feed Ticker'} • ${t('technology.lastUpdated') || 'Last Updated'}: ${activeData.lastUpdated}`}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* 3-Column Hub Grid */}
        <div className="support-hub-grid">
          {/* Column 1: Government Subsidies */}
          <div className="support-col schemes-column reveal">
            <h3>🏛️ {t('technology.subsidiesTitle') || 'Subsidies & Schemes'}</h3>
            <div className="col-content">
              {activeSchemes.map((rawScheme, i) => {
                const scheme = getLocalizedScheme(rawScheme);
                return (
                  <div key={i} className="scheme-card glass-card">
                    <h4>{scheme.title}</h4>
                    <p>{scheme.desc}</p>
                    <button 
                      className="eligibility-btn"
                      onClick={() => setSelectedScheme(rawScheme)}
                    >
                      📄 {t('technology.checkEligibility') || 'Check Eligibility'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Seafood Wholesale Market Rates */}
          <div className="support-col rates-column reveal" style={{ transitionDelay: '0.1s' }}>
            <h3>📈 {t('technology.marketRatesTitle') || 'Wholesale Market Rates'}</h3>
            <div className="col-content">
              {loadingFeed ? (
                <div className="rates-table glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '300px' }}>
                  <div className="loading-spinner" style={{ width: '36px', height: '36px' }}></div>
                </div>
              ) : (
                <div className="rates-table glass-card">
                  <div className="rates-header-row">
                    <span>{t('technology.speciesCount') || 'Species / Count'}</span>
                    <span>{t('technology.priceEst') || 'Price (Est.)'}</span>
                    <span>{t('technology.trend') || 'Trend'}</span>
                  </div>
                  {activeData.rates.map((rate, i) => (
                    <div key={i} className="rate-row">
                      <span className="rate-name">{rate.name}</span>
                      <span className="rate-price">{rate.price}</span>
                      <span className={`trend-badge trend-${rate.trend}`}>
                        {rate.trend === 'up' && `▲ ${rate.change}`}
                        {rate.trend === 'down' && `▼ ${rate.change}`}
                        {rate.trend === 'stable' && `● ${t('technology.stable') || 'Stable'}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="rates-disclaimer">⚠️ {t('technology.ratesDisclaimer') || 'Market rates fluctuate daily based on landings and cold chain availability. Consult local brokers for final trade agreements.'}</p>
            </div>
          </div>

          {/* Column 3: Pond Alerts & Regional News */}
          <div className="support-col news-column reveal" style={{ transitionDelay: '0.2s' }}>
            <h3>📰 {t('technology.newsAlertsTitle') || 'Pond Alerts & News'}</h3>
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
                        {item.alertLevel === 'danger' && `🔴 ${t('about.waterMeter.critical') || 'Critical'}`}
                        {item.alertLevel === 'warning' && `🟡 ${t('about.waterMeter.warning') || 'Warning'}`}
                        {item.alertLevel === 'info' && `🔵 ${t('technology.newsUpdate') || 'Update'}`}
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
      {selectedScheme && (() => {
        const scheme = getLocalizedScheme(selectedScheme);
        return (
          <div className="services-modal-backdrop" onClick={() => setSelectedScheme(null)}>
            <div className="services-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedScheme(null)}>×</button>

              <div className="modal-header">
                <span className="modal-emoji">📋</span>
                <div>
                  <h2>{t('technology.eligibilityPopup.title') || 'Eligibility Guidelines'}</h2>
                  <div className="scientific-name">{t('technology.eligibilityPopup.description') || 'Subsidies & Direct Benefit Transfer'}</div>
                </div>
              </div>

              <div className="modal-body" style={{ overflowY: 'visible' }}>
                <div className="eligibility-box" style={{ background: 'rgba(0, 212, 170, 0.05)', border: '1px solid rgba(0, 212, 170, 0.15)', padding: '20px', borderRadius: '8px' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '10px' }}>{scheme.title}</h4>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(224, 232, 240, 0.75)', lineHeight: '1.6', marginBottom: '20px' }}>{scheme.desc}</p>
                  
                  <h5 style={{ color: 'var(--aqua-primary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>📄 {t('technology.eligibilityPopup.criteria') || 'Required Documents & Rules:'}:</h5>
                  <p style={{ fontSize: '0.88rem', color: '#e0fcf5', lineHeight: '1.6' }}>{scheme.eligibility}</p>
                </div>
              </div>

              <div className="modal-actions-footer" style={{ borderTop: 'none', paddingTop: '20px', gap: '16px' }}>
                <button 
                  onClick={() => setSelectedScheme(null)} 
                  className="recalculate-btn"
                  style={{ flex: 1, margin: 0 }}
                >
                  {t('technology.eligibilityPopup.close') || 'Close'}
                </button>
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="form-submit-btn"
                  style={{ flex: 1, margin: 0, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '45px', padding: 0 }}
                >
                  {t('technology.eligibilityPopup.applyBtn') || 'Apply on Portal ↗'}
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
