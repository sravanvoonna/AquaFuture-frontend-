import { useState, useEffect, useRef } from 'react';

const initialMessages = {
  'en-IN': 'Hello! I am your **AquaFuture AI Advisor**, your expert marine biology and aquaculture consultant. Ask me about optimizing FCR, water chemistry metrics, disease diagnostics, or stocking density limits. How can I help you today?',
  'hi-IN': 'नमस्ते! मैं आपका **AquaFuture AI सलाहकार** हूँ, आपका विशेषज्ञ समुद्री जीव विज्ञान और जलीय कृषि सलाहकार। मुझसे FCR अनुकूलन, पानी के रसायन विज्ञान मेट्रिक्स, रोग निदान, या स्टॉकिंग घनत्व सीमाओं के बारे में पूछें। मैं आज आपकी क्या सहायता कर सकता हूँ?',
  'te-IN': 'నమస్తే! నేను మీ **AquaFuture AI సలహాదారుడిని**, మీ నిపుణులైన మెరైన్ బయాలజీ మరియు ఆక్వాకల్చర్ కన్సల్టెంట్. FCRని ఆప్టిమైజ్ చేయడం, నీటి కెమిస్ట్రీ కొలతలు, వ్యాధి నిర్ధారణలు లేదా స్టాకింగ్ సాంద్రత పరిమితుల గురించి నన్ను అడగండి. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?',
  'ta-IN': 'வணக்கம்! நான் உங்கள் **AquaFuture AI ஆலோசகர்**, உங்கள் நிபுணத்துவ கடல் உயிரியல் மற்றும் மீன்வளர்ப்பு ஆலோசகர். FCR-ஐ மேம்படுத்துதல், நீர் வேதியியல் அளவீடுகள், நோய் கண்டறிதல் அல்லது இருப்பு அடர்த்தி வரம்புகள் பற்றி என்னிடம் கேளுங்கள். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?'
};

export default function Contact() {
  const sectionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  
  // Environment credentials
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
  const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;
  const apiUrl = import.meta.env.VITE_API_URL;

  // Connection state
  const isConfigured = !!apiUrl || !!(apiKey && endpoint && deployment && apiVersion);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialMessages['en-IN']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [chatError, setChatError] = useState('');

  // Reveal animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Cleanup speech synthesis and audio on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Speech Recognition (Voice Input)
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      stopSpeaking();
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      handleSend(speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Helper for local browser speech synthesis fallback
  const speakLocalText = (cleanText) => {
    if (!window.speechSynthesis) return;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLanguage;

    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(v =>
      v.lang.toLowerCase() === voiceLanguage.toLowerCase() ||
      v.lang.toLowerCase().startsWith(voiceLanguage.toLowerCase().split('-')[0])
    );

    const femaleKeywords = ['female', 'lady', 'zira', 'samantha', 'karen', 'veena', 'moira', 'tessa', 'hazel', 'priya', 'google', 'swara'];
    let matchedVoice = langVoices.find(v => {
      const nameLower = v.name.toLowerCase();
      return femaleKeywords.some(keyword => nameLower.includes(keyword));
    });

    if (!matchedVoice && langVoices.length > 0) {
      matchedVoice = langVoices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Text-To-Speech (Voice Output using Sarvam AI with local fallback)
  const speakText = async (text) => {
    stopSpeaking();
    setIsSpeaking(true);

    const cleanText = text
      .replace(/[*#`_\-]/g, '')
      .replace(/\n+/g, ' ');

    const sarvamApiKey = import.meta.env.VITE_SARVAM_API_KEY;
    console.log("[SpeakText] Triggered. API Key Present:", !!sarvamApiKey, "Language Selected:", voiceLanguage);

    if (sarvamApiKey) {
      try {
        console.log("[SpeakText] Sending request to Sarvam AI TTS API with speaker 'ishita'...");
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': sarvamApiKey
          },
          body: JSON.stringify({
            text: cleanText,
            speaker: 'ishita',
            target_language_code: voiceLanguage,
            pace: 1.0,
            model: 'bulbul:v3'
          })
        });

        if (!response.ok) {
          throw new Error(`Sarvam TTS API returned status: ${response.status}`);
        }

        const data = await response.json();
        const base64Audio = data.audios?.[0];
        if (!base64Audio) {
          throw new Error('No audio returned in Sarvam TTS response');
        }

        console.log("[SpeakText] Received voice audio payload from Sarvam AI. Initializing playback...");
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audioRef.current = audio;
        audio.onended = () => {
          console.log("[SpeakText] Playback ended.");
          setIsSpeaking(false);
          audioRef.current = null;
        };
        audio.onerror = (e) => {
          console.error("[SpeakText] Audio playback error, falling back to browser TTS:", e);
          setIsSpeaking(false);
          audioRef.current = null;
          speakLocalText(cleanText);
        };
        await audio.play();
      } catch (err) {
        console.warn("[SpeakText] Sarvam TTS request failed, falling back to Web Speech API:", err);
        speakLocalText(cleanText);
      }
    } else {
      console.log("[SpeakText] No Sarvam API key found. Falling back to local browser TTS.");
      speakLocalText(cleanText);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const getLanguageName = (code) => {
    switch (code) {
      case 'hi-IN': return 'Hindi';
      case 'te-IN': return 'Telugu';
      case 'ta-IN': return 'Tamil';
      case 'en-IN':
      default:
        return 'English';
    }
  };

  // Language Code Detector (Helper)
  const detectLanguage = (text) => {
    if (!text) return 'en-IN';
    const teluguRegex = /[\u0c00-\u0c7f]/;
    const hindiRegex = /[\u0900-\u097f]/;
    if (teluguRegex.test(text)) return 'te-IN';
    if (hindiRegex.test(text)) return 'hi-IN';
    return 'en-IN';
  };

  // Pattern Matching Fallback Responder
  const getMockResponse = (userText) => {
    const query = userText.toLowerCase();
    const lang = voiceLanguage;

    if (lang === 'hi-IN') {
      if (query.includes('fcr') || query.includes('feed') || query.includes('conversion') || query.includes('ration') || query.includes('tilapia')) {
        return `FCR को अनुकूलित करने के लिए:\n\n• **दैनिक भोजन का नियंत्रण**: भोजन को 3-4 छोटे भागों में विभाजित करें ताकि वह नीचे न सड़े।\n• **भोजन ट्रे**: भोजन देने के 1.5 से 2 घंटे बाद ट्रे की जांच करें।\n• **घुलनशील ऑक्सीजन (DO)**: DO को 4.5 mg/L से ऊपर रखें।\n• **तापमान**: यदि तापमान 24°C से कम या 32°C से अधिक हो, तो भोजन 20-30% कम करें।`;
      }
      if (query.includes('oxygen') || query.includes('do') || query.includes('hypoxia') || query.includes('aeration') || query.includes('suffocat')) {
        return `🚨 **आपातकालीन ऑक्सीजन प्रोटोकॉल (DO < 3.0 mg/L):**\n\n1. **अधिकतम वातन**: तुरंत सभी एरेटर चालू करें।\n2. **भोजन बंद करें**: DO 4.5 mg/L से ऊपर आने तक भोजन देना बंद रखें।\n3. **पानी का आदान-प्रदान**: ताज़ा पानी भरें।\n4. **रासायनिक ऑक्सीजन**: यदि DO 1.5 mg/L से कम हो, तो सोडियम परकार्बोनेट डालें।`;
      }
      if (query.includes('disease') || query.includes('white spot') || query.includes('wsv') || query.includes('mortality') || query.includes('sick') || query.includes('infection') || query.includes('die')) {
        return `**रोग नियंत्रण दिशानिर्देश:**\n\n• **सख्त जैव सुरक्षा**: हर तालाब के लिए अलग जाल और पैर कीटाणुनाशक का उपयोग करें।\n• **विब्रियो दमन**: विब्रियो बैक्टीरिया को दबाने के लिए साप्ताहिक प्रोबायोटिक्स डालें।\n• **पानी की गुणवत्ता**: pH उतार-चढ़ाव को 0.5 से कम और अमोनिया को 1.0 mg/L से नीचे रखें।\n• **प्रकोप की आशंका**: लक्षण दिखने पर प्रभावित तालाब को तुरंत अलग करें और भोजन 50% कम करें।`;
      }
      if (query.includes('free') || query.includes('pricing') || query.includes('cost') || query.includes('subscription') || query.includes('rupees') || query.includes('charge')) {
        return `हाँ! AquaFuture मंच **हमेशा के लिए 100% मुफ़्त** है:\n\n• **कोई सदस्यता शुल्क नहीं**: सभी प्रीमियम उपकरण और गणना मॉड्यूल मुफ़्त हैं।\n• **कोई छिपी हुई लागत नहीं**: एआई सलाहकार से परामर्श करने का कोई शुल्क नहीं है।`;
      }
      if (query.includes('shrimp') || query.includes('vannamei') || query.includes('prawn')) {
        return `**वन्नामेई झींगा पालन सुझाव:**\n\n• **pH प्रबंधन**: pH को 7.5 - 8.3 पर बनाए रखें। दिन में दो बार परीक्षण करें।\n• **क्षारीयता**: स्वस्थ खोल उतारने के लिए कुल क्षारीयता 120 - 150 mg/L रखें।\n• **खनिज**: कम लवणता में Mg, Ca, और K पर्याप्त रखें।\n• **बायोमास**: हमारे दैनिक फीड प्रिडिक्टर का उपयोग करके भोजन की गणना के लिए क्विंटल (qtl) में वजन का नमूना लें।`;
      }
      if (query.includes('tilapia') || query.includes('carp') || query.includes('fish')) {
        return `**मछली (तिलापिया/कार्प) संचालन:**\n\n• **अमोनिया सुरक्षा**: अमोनिया (NH3) को 0.05 mg/L से कम रखें।\n• **तापमान**: तिलापिया 27-32°C पर तेजी से बढ़ती हैं।\n• **स्टॉकिंग घनत्व**: वातित तालाबों के लिए 5-8 मछली/m² स्टॉक करें।`;
      }
      if (query.includes('biomass') || query.includes('weight') || query.includes('growth') || query.includes('yield') || query.includes('quintal') || query.includes('qtl')) {
        return `**बायोमास और विकास ट्रैकिंग:**\n\n• व्यावसायिक कटाई के लिए हमेशा **क्विंटल (qtl)** में वजन को ट्रैक करें।\n• औसत वजन की गणना के लिए साप्ताहिक नमूना लें।`;
      }
      if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings') || query.includes('who are you') || query.includes('advisor')) {
        return `नमस्ते! मैं आपका **AquaFuture AI सलाहकार** हूँ। मैं आज आपके तालाब को बेहतर बनाने में कैसे मदद कर सकता हूँ?\n\nआप मुझसे पूछ सकते हैं:\n• फीड और FCR गणना\n• ऑक्सीजन की कमी और वातन प्रोटोकॉल\n• झींगा और मछली स्वास्थ्य\n• स्टॉकिंग घनत्व और क्विंटल (qtl) में फसल का अनुमान`;
      }
      return `AquaFuture AI सलाहकार के रूप में, मैं ऊपर दिए गए इंटरैक्टिव टूल्स का उपयोग करने की सलाह देता हूँ। क्या आप मछली या झींगा का पालन कर रहे हैं, और अभी पानी की क्या स्थिति है?`;
    }

    if (lang === 'te-IN') {
      if (query.includes('fcr') || query.includes('feed') || query.includes('conversion') || query.includes('ration') || query.includes('tilapia')) {
        return `FCRని ఆప్టిమైజ్ చేయడానికి:\n\n• **ఫీడింగ్ నియంత్రణ**: ఆహారం కింద కుళ్ళిపోకుండా ఉండటానికి రోజుకు 3-4 సార్లు చిన్న పరిమాణంలో ఇవ్వండి.\n• **ఫీడ్ ట్రేలు**: ఆహారం ఇచ్చిన 1.5 నుండి 2 గంటల తర్వాత ట్రేలను తనిఖీ చేయండి.\n• **కరిగిన ఆక్సిజன் (DO)**: DO ని 4.5 mg/L కంటే ఎక్కువగా ఉంచండి.\n• **ఉష్ణోగ్రత**: ఉష్ణోగ్రత 24°C కంటే తగ్గితే లేదా 32°C కంటే పెరిగితే ఆహారాన్ని 20-30% తగ్గించండి.`;
      }
      if (query.includes('oxygen') || query.includes('do') || query.includes('hypoxia') || query.includes('aeration') || query.includes('suffocat')) {
        return `🚨 **అత్యవసర ఆక్సిజన్ ప్రోటోకాల్ (DO < 3.0 mg/L):**\n\n1. **గరిష్ట ఏరేషన్**: వెంటనే అన్ని ఏరేటర్లను ఆన్ చేయండి.\n2. **ఫీడింగ్ నిలిపివేయండి**: DO 4.5 mg/L కి చేరే వరకు ఆహారం ఇవ్వడం ఆపండి.\n3. **నీటి మార్పిడి**: వీలైతే మంచి ఆక్సిజన్ ఉన్న నీటిని నింపండి.\n4. **రసాయన ఆక్సిజన్**: DO 1.5 mg/L కంటే తగ్గితే సోడియం పెర్కార్బోనేట్ వాడండి.`;
      }
      if (query.includes('disease') || query.includes('white spot') || query.includes('wsv') || query.includes('mortality') || query.includes('sick') || query.includes('infection') || query.includes('die')) {
        return `**వ్యాధి నివారణ మార్గదర్శకాలు:**\n\n• **ఖచ్చితమైన బయోసెక్యూరిటీ**: ప్రతి చెరువుకు ప్రత్యేక నెట్లు మరియు షూ క్రిమిసంహారకాలను వాడండి.\n• **విబ్రియో అణచివేత**: విబ్రియో బ్యాక్టీరియాను అణచివేయడానికి వారానికోసారి ప్రోబయోటిక్స్ వాడండి.\n• **నీటి కెమిస్ట్రీ**: pH హెచ్చుతగ్గులు 0.5 లోపు మరియు అమ్మోనియాను 1.0 mg/L కంటే తక్కువగా ఉంచండి.\n• **వ్యాధి వ్యాప్తి**: లక్షణాలు కనిపిస్తే ప్రభావిత చెరువును వెంటనే వేరు చేసి, ఆహారాన్ని 50% తగ్గించండి.`;
      }
      if (query.includes('free') || query.includes('pricing') || query.includes('cost') || query.includes('subscription') || query.includes('rupees') || query.includes('charge')) {
        return `అవును! AquaFuture ప్లాట్‌ఫారమ్ **ఎప్పటికీ 100% ఉచితం**:\n\n• **సభ్యత్వ రుసుములు లేవు**: అన్ని ప్రీమియం టూల్స్ మరియు కాలిక్యులేషన్ మాడ్యూల్స్ ఉచితం.\n• **దాచిన ఖర్చులు లేవు**: ఈ AI సలహాదారుని సంప్రదించడానికి ఎటువంటి రుసుము లేదు.`;
      }
      if (query.includes('shrimp') || query.includes('vannamei') || query.includes('prawn')) {
        return `**వన్నామే రొయ్యల పెంపకం చిట్కాలు:**\n\n• **pH నిర్వహణ**: pHని 7.5 - 8.3 వద్ద ఉంచండి. రోజుకు రెండుసార్లు పరీక్షించండి.\n• **क्षారత**: ఆరోగ్యకరమైన పొర విసర్జన (molting) కోసం క్షారతను 120 - 150 mg/L మధ్య ఉంచండి.\n• **ఖనిజాలు**: తక్కువ ఉప్పునీటిలో Mg, Ca మరియు K తగినంతగా ఉండేలా చూసుకోండి.\n• **బయోమాస్**: వారానికోసారి బరువులను క్వింటాల్స్ (qtl) లో కొలిచి ఫీడ్ అంచనా వేయండి.`;
      }
      if (query.includes('tilapia') || query.includes('carp') || query.includes('fish')) {
        return `**చేపల (తిలాపియా/కార్ప్) పెంపకం:**\n\n• **అమ్మోనియా జాగ్రత్త**: అమ్మోనియా (NH3) ఖచ్చితంగా 0.05 mg/L కంటే తక్కువగా ఉండాలి.\n• **ఉష్ణోగ్రత**: తిలాపియా 27-32°C వద్ద బాగా పెరుగుతుంది.\n• **స్టాకింగ్ సాంద్రత**: ఏరేటెడ్ చెరువుల కోసం 5-8 చేపలు/m² వేయండి.`;
      }
      if (query.includes('biomass') || query.includes('weight') || query.includes('growth') || query.includes('yield') || query.includes('quintal') || query.includes('qtl')) {
        return `**బయోమాస్ మరియు ఎదుగుదల ట్రాకింగ్:**\n\n• వాణిజ్య కోతలకు బరువులను ఎల్లప్పుడూ **క్వింటాల్స్ (qtl)** లో కొలవండి.\n• సగటు బరువు అంచనా కోసం వారానికోసారి నమూనా తీసుకోండి.`;
      }
      if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings') || query.includes('who are you') || query.includes('advisor')) {
        return `నమస్తే! నేను మీ **AquaFuture AI సలహాదారుడిని**. ఈ రోజు మీ చెరువును ఎలా మెరుగుపరచాలో చెప్పండి?\n\nమీరు నన్ను వీటి గురించి అడగవచ్చు:\n• ఫీడ్ మరియు FCR లెక్కింపు\n• ఆక్సిజన్ క్షీణత మరియు ఏరేషన్ ప్రోటోకాల్స్\n• రొయ్యలు మరియు చేపల ఆరోగ్యం\n• క్వింటాల్స్ (qtl) లో పంట అంచనా మరియు స్టాకింగ్ సాంద్రత`;
      }
      return `AquaFuture AI సలహాదారుగా, పైన ఉన్న సాధనాలను ఉపయోగించమని నేను సిఫార్సు చేస్తున్నాను. మీరు చేపలు లేదా రొయ్యలను పెంచుతున్నారా, మరియు మీ నీటి పారామితులు ఎలా ఉన్నాయి?`;
    }

    if (lang === 'ta-IN') {
      if (query.includes('fcr') || query.includes('feed') || query.includes('conversion') || query.includes('ration') || query.includes('tilapia')) {
        return `FCR-ஐ மேம்படுத்த:\n\n• **தீவனக் கட்டுப்பாடு**: தீவனம் குளத்தின் அடியில் வீணாவதைத் தடுக்க தினமும் 3-4 முறை சிறிய அளவில் வழங்கவும்.\n• **தீவன தட்டுகள்**: உணவிட்ட 1.5 முதல் 2 மணி நேரத்திற்குப் பிறகு தட்டுகளைச் சோதிக்கவும்.\n• **கரைந்த ஆக்ஸிஜன் (DO)**: DO அளவை 4.5 mg/L க்கு மேல் பராமரிக்கவும்.\n• **வெப்பநிலை**: வெப்பநிலை 24°C க்குக் குறைந்தாலோ அல்லது 32°C க்கு மேல் அதிகரித்தாலோ தீவனத்தை 20-30% குறைக்கவும்.`;
      }
      if (query.includes('oxygen') || query.includes('do') || query.includes('hypoxia') || query.includes('aeration') || query.includes('suffocat')) {
        return `🚨 **அவசர ஆக்ஸிஜன் நெறிமுறை (DO < 3.0 mg/L):**\n\n1. **அதிகபட்ச காற்றோட்டம்**: உடனடியாக அனைத்து ஏரேட்டர்களையும் இயக்கவும்.\n2. **தீவனம் நெறிமுறை**: DO 4.5 mg/L ஐ எட்டும் வரை தீவனம் வழங்குவதை நிறுத்தவும்.\n3. **நீர் பரிமாற்றம்**: புதிய ஆக்ஸிஜன் நிறைந்த நீரை மாற்றவும்.\n4. **இரசாயன ஆக்ஸிஜன்**: DO 1.5 mg/L க்குக் குறைந்தால் சோடியம் பெர்கார்பனேட் பயன்படுத்தவும்.`;
      }
      if (query.includes('disease') || query.includes('white spot') || query.includes('wsv') || query.includes('mortality') || query.includes('sick') || query.includes('infection') || query.includes('die')) {
        return `**நோய் தடுப்பு வழிகாட்டுகல்கள்:**\n\n• **கடுமையான உயிரியல் பாதுகாப்பு**: ஒவ்வொரு குளத்திற்கும் தனித்தனி வலைகள் மற்றும் காலணி கிருமிநாசினிகளைப் பயன்படுத்தவும்.\n• **விப்ரியோ ஒடுக்கம்**: விப்ரியோ பாக்டீரியாவை ஒடுக்க வாரந்தோறும் புரோபயாடிக்குகளைப் பயன்படுத்தவும்.\n• **நீர் வேதியியல்**: pH மாறுபாட்டை 0.5 க்குள் மற்றும் அம்மோனியாவை 1.0 mg/L க்குள் வைக்கவும்.\n• **நோய் பாதிப்பு**: அறிகுறிகள் தெரிந்தால் குளத்தை தனிமைப்படுத்தி, தீவனத்தை 50% குறைக்கவும்.`;
      }
      if (query.includes('free') || query.includes('pricing') || query.includes('cost') || query.includes('subscription') || query.includes('rupees') || query.includes('charge')) {
        return `ஆம்! AquaFuture தளம் **எப்போது 100% இலவசம்**:\n\n• **சந்தா கட்டணம் இல்லை**: அனைத்து பிரீமியம் கருவிகளும் கணக்கீடுகளும் இலவசம்.\n• **மறைமுக கட்டணங்கள் இல்லை**: இந்த AI ஆலோசகரைக் கலந்தாலோசிக்க எந்தக் கட்டணமும் இல்லை.`;
      }
      if (query.includes('shrimp') || query.includes('vannamei') || query.includes('prawn')) {
        return `**வன்னமே இறால் வளர்ப்பு குறிப்புகள்:**\n\n• **pH மேலாண்மை**: pH அளவை 7.5 - 8.3 ஆக பராமரிக்கவும். தினமும் இருமுறை சோதிக்கவும்.\n• **காரத்தன்மை**: ஆரோக்கியமான தோல் உரிதலுக்கு காரத்தன்மையை 120 - 150 mg/L க்குள் வைக்கவும்.\n• **தாதுக்கள்**: குறைந்த உவர்ப்பு நீரில் Mg, Ca மற்றும் K போதுமானதாக இருப்பதை உறுதி செய்யவும்.\n• **உயிரி நிறை**: வாரந்தோறும் எடையைக் குண்டால் (qtl) அளவில் அளந்து தீவனத்தைக் கணக்கிடவும்.`;
      }
      if (query.includes('tilapia') || query.includes('carp') || query.includes('fish')) {
        return `**மீன் (திலாப்பியா/கெண்டை) வளர்ப்பு:**\n\n• **அம்மோனியா பாதுகாப்பு**: அம்மோனியா (NH3) 0.05 mg/L க்குக் குறைவாக இருக்க வேண்டும்.\n• **வெப்பநிலை**: திலாப்பியா 27-32°C இல் நன்றாக வளரும்.\n• **இருப்பு அடர்த்தி**: காற்றோட்ட குளங்களுக்கு 5-8 மீன்/m² இருப்பு வைக்கவும்.`;
      }
      if (query.includes('biomass') || query.includes('weight') || query.includes('growth') || query.includes('yield') || query.includes('quintal') || query.includes('qtl')) {
        return `**உயிரி நிறை மற்றும் வளர்ச்சி கண்காணிப்பு:**\n\n• வணிக அறுவடைகளுக்கு எப்போதும் **குவிண்டால் (qtl)** எடையைக் கண்காணிக்கவும்.\n• வாரந்தோறும் 100 மீன்/இறால் மாதிரி எடுத்து எடை போடவும்.`;
      }
      if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings') || query.includes('who are you') || query.includes('advisor')) {
        return `வணக்கம்! நான் உங்கள் **AquaFuture AI ஆலோசகர்**. இன்று உங்கள் குளத்தை மேம்படுத்த நான் எவ்வாறு உதவ வேண்டும்?\n\nநீங்கள் என்னிடம் கேட்கலாம்:\n• தீவனம் மற்றும் FCR கணக்கீடு\n• ஆக்ஸிஜன் பற்றாக்குறை மற்றும் காற்றோட்ட நெறிமுறைகள்\n• இறால் மற்றும் மீன் ஆரோக்கியம்\n• குவிண்டால் (qtl) அளவில் அறுவடை மதிப்பீடு மற்றும் இருப்பு அடர்த்தி`;
      }
      return `AquaFuture AI ஆலோசகராக, மேலே உள்ள கருவிகளைப் பயன்படுத்த பரிந்துரைக்கிறேன். நீங்கள் மீன் அல்லது இறால் வளர்க்கிறீர்களா, மற்றும் உங்கள் தற்போதைய நீர் அளவீடுகள் என்ன?`;
    }

    // Default English fallback
    if (query.includes('fcr') || query.includes('feed') || query.includes('conversion') || query.includes('ration') || query.includes('tilapia')) {
      return `To optimize your Feed Conversion Ratio (FCR):\n\n• **Control feeding frequency**: Feed 3-4 times daily in smaller portions to prevent feed decay at the pond bottom.\n• **Use feed trays**: Check trays 1.5 to 2 hours post-feed to adjust feeding quantities reactively.\n• **Dissolved Oxygen (DO)**: Ensure DO remains above 4.5 mg/L. Low oxygen decreases feed intake and increases FCR.\n• **Temperature monitoring**: Adjust feed downwards by 20-30% if temperatures drop below 24°C or rise above 32°C.\n\n*Try our interactive **FCR Calculator** in the Tools section above to track your rates!*`;
    }
    if (query.includes('oxygen') || query.includes('do') || query.includes('hypoxia') || query.includes('aeration') || query.includes('suffocat')) {
      return `🚨 **Hypoxia Emergency Protocol (Dissolved Oxygen < 3.0 mg/L):**\n\n1. **Maximize Aeration**: Activate all paddlewheel aerators, diffusers, and aspirators immediately.\n2. **Halt Feeding**: Stop feeding completely until DO climbs back above 4.5 mg/L. Feeding increases biological oxygen demand (BOD).\n3. **Water Exchange**: Flush the pond with fresh, oxygenated water if available.\n4. **Chemical Oxygen**: Apply sodium percarbonate (emergency oxygen release chemical) if DO drops below 1.5 mg/L to prevent mass mortality.`;
    }
    if (query.includes('disease') || query.includes('white spot') || query.includes('wsv') || query.includes('mortality') || query.includes('sick') || query.includes('infection') || query.includes('die')) {
      return `**Aquaculture Disease Prevention & Management Guidelines:**\n\n• **Strict Biosecurity**: Implement shoe disinfectants and separate nets for each pond to prevent pathogens.\n• **Vibrio Suppression**: Apply soil/water probiotics weekly to suppress pathogenic *Vibrio* bacteria.\n• **Water Chemistry**: Keep daily pH fluctuations under 0.5 and total ammonia nitrogen (TAN) under 1.0 mg/L to reduce stock stress.\n• **Suspected Outbreaks**: In case of symptoms like lethargy or white spots, quarantine the affected pond immediately and reduce feed by 50% to prevent disease escalation.`;
    }
    if (query.includes('free') || query.includes('pricing') || query.includes('cost') || query.includes('subscription') || query.includes('rupees') || query.includes('charge')) {
      return `Yes! The AquaFuture platform is **100% free forever**:\n\n• **Zero Subscription Fees**: All premium tools and calculation modules are open-access at no charge.\n• **No Hidden Costs**: There are no charges for saving pond parameters or consulting this AI advisor.\n• **Why it's Free**: AquaFuture is fully funded by global marine research grants and environmental sustainability projects.\n\n*Check the **Savings & ROI Planner** above to calculate your annual savings compared to typical premium software!*`;
    }
    if (query.includes('shrimp') || query.includes('vannamei') || query.includes('prawn')) {
      return `**Vannamei Shrimp Culturing Tips:**\n\n• **pH Management**: Maintain pH at 7.5 - 8.3. Test twice daily (sunrise and 2:00 PM).\n• **Alkalinity**: Keep total alkalinity between 120 - 150 mg/L to support healthy shell molting cycles.\n• **Minerals**: Ensure adequate Mg, Ca, and K in low salinity environments to prevent soft shell disease.\n• **Biomass Sampling**: Take weekly sample weights in quintals (qtl) to adjust feed projections using our Daily Feed Predictor.`;
    }
    if (query.includes('tilapia') || query.includes('carp') || query.includes('fish')) {
      return `**Freshwater Fish (Tilapia/Carp) Operations:**\n\n• **Ammonia Safety**: Ensure unionized ammonia (NH3) is strictly below 0.05 mg/L. High pH increases toxicity.\n• **Temperature Range**: Tilapia thrive at 27-32°C. Growth decreases below 22°C.\n• **Stocking Density**: For standard aerated ponds, stock 5-8 fish/m²; for recirculating aquaculture systems (RAS), higher densities can be sustained with strict filtration. Use our Stocking Density Simulator to verify safe levels!`;
    }
    if (query.includes('biomass') || query.includes('weight') || query.includes('growth') || query.includes('yield') || query.includes('quintal') || query.includes('qtl')) {
      return `**Biomass Tracking & Projections:**\n\n• Always track weights in **Quintals (qtl)** for commercial scale harvests.\n• Sample weight weekly (average of 100 fish/shrimp) to determine the Average Daily Gain (ADG).\n• Multiply the average weight by estimated survival rates and stocking counts to obtain current pond biomass in **qtl**.\n• Plot your harvest targets on our interactive SVG curve using the **Biomass Growth Predictor** in the Tools section!`;
    }
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings') || query.includes('who are you') || query.includes('advisor')) {
      return `Hello! I am your **AquaFuture AI Advisor**. How can I help you optimize your pond today?\n\nYou can ask me about:\n• Feed optimization and FCR calculation\n• Oxygen depletion and aeration protocols\n• Shrimp and fish health and disease diagnostics\n• Best stocking densities and crop estimations in quintals (qtl)`;
    }
    return `As your **AquaFuture AI Advisor**, I recommend reviewing our **Interactive Farm Tools Suite** above to run specific calculations for FCR, stocking limits, and growth projections.\n\nTo give you the best advice, could you clarify whether you are culturing fish or shrimp, and what current water quality readings (like pH or DO) you are observing?`;
  };

  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setChatError('');

    try {
      if (!isConfigured) {
        // Fallback simulation with latency
        await new Promise(resolve => setTimeout(resolve, 1000));
        const reply = getMockResponse(textToSend);
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        if (autoSpeak) {
          speakText(reply);
        }
      } else if (apiUrl) {
        const url = `${apiUrl.replace(/\/$/, "")}/api/aquafuture/chat`;
        const formattedHistory = messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }));

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: textToSend,
            history: formattedHistory,
            language: voiceLanguage
          })
        });

        if (!response.ok) {
          throw new Error(`Backend chat API returned status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.reply;
        if (!reply) throw new Error('Response reply content missing.');

        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        if (autoSpeak) {
          speakText(reply);
        }
      } else {
        const cleanEndpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';
        const url = `${cleanEndpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

        const formattedHistory = messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }));

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
                content: `You are the AquaFuture AI Advisor, a world-class expert marine biologist and smart aquaculture consultant. You help fish and shrimp farmers optimize their operations.
Guidelines:
- Communicate in a professional, scientific yet practical, and helpful tone.
- Provide advice on feed conversion ratio (FCR), stocking density, water quality diagnostics, disease management (like Hypoxia, White Spot Disease, etc.), biomass prediction, and aquaculture economics.
- Important: For metrics, always refer to yields or feed weights in Quintals (qtl) and monetary values in Indian Rupees (₹).
- If asked about AquaFuture pricing, explain that the platform is 100% free and open-source, with no subscription fees or premium modular costs.
- Keep responses relatively concise, formatted with clear bullet points and markdown if helpful. Avoid long paragraphs.
- IMPORTANT: You MUST write your entire response completely in the ${getLanguageName(voiceLanguage)} language. Even if the user writes in English, Hindi, Telugu, Tamil, or any other language, your response MUST be translated and written fully in ${getLanguageName(voiceLanguage)} (in its native script, e.g., Devanagari script for Hindi, Telugu script for Telugu, Tamil script for Tamil). Technical acronyms like FCR, pH, DO, mg/L, or brand names like AquaFuture and Cerevyn Solutions may remain in English.`
              },
              ...formattedHistory,
              { role: 'user', content: textToSend }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (!reply) throw new Error('Response choice content missing.');

        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        if (autoSpeak) {
          speakText(reply);
        }
      }
    } catch (err) {
      console.warn('Azure OpenAI API error, using local fallback model:', err);
      await new Promise(resolve => setTimeout(resolve, 800));
      const reply = getMockResponse(textToSend);
      const disclaimer = `${reply}\n\n*(Running in simulation fallback mode)*`;
      setMessages(prev => [...prev, { role: 'assistant', content: disclaimer }]);
      setChatError('Azure OpenAI API quota exceeded or connection timed out. Falling back to offline simulator.');
      if (autoSpeak) {
        speakText(reply);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            AI Chat Advisor
          </div>
          <h2 className="section-title">AquaAdvisor Companion AI</h2>
          <p className="section-subtitle">
            Get instant solutions to pond management, health emergencies, feeding optimization, and operational guidelines.
          </p>
        </div>

        <div className="contact-chat-container reveal">
          {/* Single Column Chat Layout (Sidebar removed, mascot & controls in header) */}
          <div className="chat-main">
            <div className="chat-main-header">
              <div className="chat-header-profile">
                <div className="avatar-wrapper-compact">
                  <div className={`advisor-avatar-container-compact ${isListening ? 'listening' : ''} ${isLoading ? 'thinking' : ''} ${isSpeaking ? 'speaking' : ''}`}>
                    <div className="aqua-ai-core-compact">
                      <div className="core-orbit-outer-compact"></div>
                      <div className="core-orbit-inner-compact"></div>
                      <div className="fluid-core-sphere-compact">
                        <div className="inner-glow-compact"></div>
                        <div className="core-pulse-circle-compact"></div>
                      </div>
                      <div className="core-ripples-compact">
                        <span className="ripple-compact"></span>
                        <span className="ripple-compact"></span>
                      </div>
                    </div>
                  </div>
                  <span className="status-dot-compact online"></span>
                </div>
                <div className="chat-header-info">
                  <h3 className="advisor-name-compact">AquaAdvisor AI</h3>
                  <div className="connection-status-pill-compact">
                    <span className={`status-indicator-dot ${isConfigured ? 'active' : 'fallback'}`}></span>
                    <span>{isConfigured ? 'Azure Live' : 'Simulated'}</span>
                  </div>
                </div>
              </div>

              <div className="chat-header-controls">
                <div className="control-group-compact">
                  <select
                    id="voice-language"
                    value={voiceLanguage}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setVoiceLanguage(newLang);
                      stopSpeaking();
                      setMessages([
                        {
                          role: 'assistant',
                          content: initialMessages[newLang] || initialMessages['en-IN']
                        }
                      ]);
                    }}
                    className="voice-language-select-compact"
                  >
                    <option value="en-IN">🇬🇧 English</option>
                    <option value="hi-IN">🇮🇳 Hindi</option>
                    <option value="te-IN">🇮🇳 Telugu</option>
                    <option value="ta-IN">🇮🇳 Tamil</option>
                  </select>
                </div>

                <label className="checkbox-label-compact" htmlFor="auto-speak-checkbox">
                  <input
                    type="checkbox"
                    id="auto-speak-checkbox"
                    checked={autoSpeak}
                    onChange={(e) => {
                      setAutoSpeak(e.target.checked);
                      if (!e.target.checked) stopSpeaking();
                    }}
                    className="auto-speak-checkbox-compact"
                  />
                  <span>Speak Answers</span>
                </label>

                {isSpeaking && (
                  <button className="stop-speech-btn-compact" onClick={stopSpeaking}>
                    Stop
                  </button>
                )}

                <button 
                  className="clear-chat-btn-compact" 
                  onClick={() => {
                    stopSpeaking();
                    setMessages([{
                      role: 'assistant',
                      content: initialMessages[voiceLanguage] || initialMessages['en-IN']
                    }]);
                    setChatError('');
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {chatError && (
              <div className="chat-error-banner">
                <span>⚠️ {chatError}</span>
                <button onClick={() => setChatError('')}>×</button>
              </div>
            )}

            <div className="chat-messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message-row ${msg.role === 'user' ? 'user-row' : 'assistant-row'}`}>
                  <div className="chat-message-avatar">
                    {msg.role === 'user' ? '👤' : '🐟'}
                  </div>
                  <div className="chat-message-bubble">
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                    </p>
                    {msg.role !== 'user' && (
                      <button
                        onClick={() => {
                          if (isSpeaking) {
                            stopSpeaking();
                          } else {
                            speakText(msg.content);
                          }
                        }}
                        className="msg-speaker-icon-btn"
                        title={isSpeaking ? "Stop Voice Playback" : "Speak Response"}
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="chat-message-row assistant-row">
                  <div className="chat-message-avatar">🐟</div>
                  <div className="chat-message-bubble typing-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleFormSubmit}>
              {/* Voice Dictation (Microphone) */}
              <button
                type="button"
                onClick={isListening ? () => {} : startSpeechRecognition}
                className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
                title="Speak question"
                disabled={isLoading}
              >
                🎙️
              </button>

              <input
                type="text"
                className="chat-text-input"
                placeholder={isListening ? "Listening..." : "Ask the advisor a question about your farm..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isListening}
                required
              />
              <button type="submit" className="chat-send-btn" disabled={isLoading || isListening || !input.trim()}>
                {isLoading ? '...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
