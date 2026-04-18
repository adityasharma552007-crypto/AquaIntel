const fs = require('fs');
const path = require('path');

const newTranslations = {
  en: {
    App: {
      myProfile: "My Profile",
      totalScansL: "TOTAL SCANS",
      safeL: "SAFE",
      unsafeL: "UNSAFE",
      myAuthorityReports: "My Authority Reports 📋",
      accountSettings: "Account Settings ⚙️"
    }
  },
  hi: {
    App: {
      myProfile: "मेरी प्रोफ़ाइल",
      totalScansL: "कुल स्कैन",
      safeL: "सुरक्षित",
      unsafeL: "असुरक्षित",
      myAuthorityReports: "मेरी प्राधिकरण रिपोर्ट 📋",
      accountSettings: "खाता सेटिंग्स ⚙️"
    }
  },
  mr: {
    App: {
      myProfile: "माझी प्रोफाइल",
      totalScansL: "एकूण स्कॅन",
      safeL: "सुरक्षित",
      unsafeL: "असुरक्षित",
      myAuthorityReports: "माझे प्राधिकरण अहवाल 📋",
      accountSettings: "खाते सेटिंग्ज ⚙️"
    }
  },
  gu: {
    App: {
      myProfile: "મારી પ્રોફાઇલ",
      totalScansL: "કુલ સ્કેન",
      safeL: "સલામત",
      unsafeL: "અસુરક્ષિત",
      myAuthorityReports: "મારા સત્તાવાર અહેવાલો 📋",
      accountSettings: "એકાઉન્ટ સેટિંગ્સ ⚙️"
    }
  },
  ta: {
    App: {
      myProfile: "என் சுயவிவரம்",
      totalScansL: "மொத்த ஸ்கேன்கள்",
      safeL: "பாதுகாப்பானது",
      unsafeL: "பாதுகாப்பற்றது",
      myAuthorityReports: "எனது அதிகார அறிக்கைகள் 📋",
      accountSettings: "கணக்கு அமைப்புகள் ⚙️"
    }
  }
};

const locales = ['en', 'hi', 'mr', 'gu', 'ta'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  Object.assign(data.App, newTranslations[locale].App);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
});
console.log('Profile translations updated successfully.');
