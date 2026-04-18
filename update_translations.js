const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: {
    App: {
      readyToScan: "Ready to Scan",
      scanningWater: "Scanning Water...",
      aiAnalysis: "AI Analysis...",
      placePod: "Place Pod in water sample",
      keepSubmerged: "Keep device submerged",
      hardwareDisconnected: "Hardware Disconnected",
      connectDevice: "Connect Device",
      startScan: "Start Scan",
      tryAgain: "Try Again",
      connectingPod: "Connecting to spectral pod...",
      aiComputing: "AI computing adulterants...",
      fssaiCompliant: "FSSAI Compliant",
      cloudVerified: "Cloud Verified",
      waterMap: "Water Contamination Map",
      area: "Area",
      sources: "Sources",
      safe: "% Safe",
      hazard: "% Hazard",
      searchArea: "Search {city} area or vendor...",
      scanHistory: "Scan History",
      yourScans: "Your Scans"
    }
  },
  hi: {
    App: {
      readyToScan: "स्कैन के लिए तैयार",
      scanningWater: "पानी की स्कैनिंग...",
      aiAnalysis: "AI विश्लेषण...",
      placePod: "पॉड को पानी में रखें",
      keepSubmerged: "डिवाइस को डूबा हुआ रखें",
      hardwareDisconnected: "हार्डवेयर डिस्कनेक्टेड",
      connectDevice: "डिवाइस कनेक्ट करें",
      startScan: "स्कैन शुरू करें",
      tryAgain: "फिर से प्रयास करें",
      connectingPod: "स्पेक्ट्रल पॉड से जुड़ रहा है...",
      aiComputing: "AI मिलावट की गणना कर रहा है...",
      fssaiCompliant: "FSSAI अनुरूप",
      cloudVerified: "क्लाउड सत्यापित",
      waterMap: "जल प्रदूषण मानचित्र",
      area: "क्षेत्र",
      sources: "स्रोत",
      safe: "% सुरक्षित",
      hazard: "% खतरा",
      searchArea: "{city} क्षेत्र या विक्रेता खोजें...",
      scanHistory: "स्कैन इतिहास",
      yourScans: "तपके स्कैन"
    }
  },
  mr: {
    App: {
      readyToScan: "स्कॅनसाठी तयार",
      scanningWater: "पाण्याचे स्कॅनिंग...",
      aiAnalysis: "AI विश्लेषण...",
      placePod: "पॉड पाण्यात ठेवा",
      keepSubmerged: "डिव्हाइस आणि उपकरणाचे बुडलेले ठेवा",
      hardwareDisconnected: "हार्डवेअर डिस्कनेक्टेड",
      connectDevice: "डिव्हाइस कनेक्ट करा",
      startScan: "स्कॅन सुरू करा",
      tryAgain: "पुन्हा प्रयत्न करा",
      connectingPod: "स्पेक्ट्रल पॉडशी कनेक्ट होत आहे...",
      aiComputing: "AI भेसळीची गणना करत आहे...",
      fssaiCompliant: "FSSAI सुसंगत",
      cloudVerified: "क्लाउड सत्यापित",
      waterMap: "पाणी प्रदूषण नकाशा",
      area: "परिसर",
      sources: "स्रोत",
      safe: "% सुरक्षित",
      hazard: "% धोका",
      searchArea: "{city} परिसर किंवा विक्रेता शोधा...",
      scanHistory: "स्कॅन इतिहास",
      yourScans: "तुमचे स्कॅन"
    }
  },
  gu: {
    App: {
      readyToScan: "સ્કેન માટે તૈયાર",
      scanningWater: "પાણીનું સ્કેનિંગ...",
      aiAnalysis: "AI વિશ્લેષણ...",
      placePod: "પોડને પાણીમાં મૂકો",
      keepSubmerged: "ઉપકરણને ડૂબાડેલું રાખો",
      hardwareDisconnected: "હાર્ડવેર ડિસ્કનેક્ટ થયું",
      connectDevice: "ઉપકરણ કનેક્ટ કરો",
      startScan: "સ્કેન શરૂ કરો",
      tryAgain: "ફરી પ્રયાસ કરો",
      connectingPod: "સ્પેક્ટ્રલ પોડ સાથે કનેક્ટ થઈ રહ્યું છે...",
      aiComputing: "AI ભેળસેળની ગણતરી કરી રહ્યું છે...",
      fssaiCompliant: "FSSAI સુસંગત",
      cloudVerified: "ક્લાઉડ ચકાસાયેલ",
      waterMap: "જળ પ્રદૂષણ નકશો",
      area: "વિસ્તાર",
      sources: "સ્ત્રોતો",
      safe: "% સલામત",
      hazard: "% જોખમ",
      searchArea: "{city} વિસ્તાર અથવા વિક્રેતા શોધો...",
      scanHistory: "સ્કેન ઇતિહાસ",
      yourScans: "તમારા સ્કેન"
    }
  },
  ta: {
    App: {
      readyToScan: "ஸ்கேன் செய்ய தயார்",
      scanningWater: "நீர் ஸ்கேனிங்...",
      aiAnalysis: "AI பகுப்பாய்வு...",
      placePod: "பாட் தண்ணீரில் வைக்கவும்",
      keepSubmerged: "சாதனத்தை மூழ்கிய நிலையில் வைக்கவும்",
      hardwareDisconnected: "வன்பொருள் துண்டிக்கப்பட்டது",
      connectDevice: "சாதனத்தை இணைக்கவும்",
      startScan: "ஸ்கேன் தொடங்கவும்",
      tryAgain: "மீண்டும் முயற்சிக்கவும்",
      connectingPod: "ஸ்பெக்ட்ரல் பாடுடன் இணைகிறது...",
      aiComputing: "AI கலப்படத்தை கணக்கிடுகிறது...",
      fssaiCompliant: "FSSAI இணக்கமானது",
      cloudVerified: "கிளவுட் சரிபார்க்கப்பட்டது",
      waterMap: "நீர் மாசுக் வரைபடம்",
      area: "பகுதி",
      sources: "ஆதாரங்கள்",
      safe: "% பாதுகாப்பானது",
      hazard: "% ஆபத்து",
      searchArea: "{city} பகுதி அல்லது வியாபாரியை தேடுங்கள்...",
      scanHistory: "ஸ்கேன் வரலாறு",
      yourScans: "உங்கள் ஸ்கேன்கள்"
    }
  }
};

const locales = ['en', 'hi', 'mr', 'gu', 'ta'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  data.App = newTranslations[locale].App;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
});
console.log('Translations updated successfully.');
