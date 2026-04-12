import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "History": "History",
      "Encyclopedia": "Encyclopedia",
      "UploadImages": "Upload Cattle Images",
      "Identify": "Identify Breed",
      "TotalScans": "Total Scans",
      "Match": "Match",
      "UseCamera": "Take Photo",
      "MilkCalculator": "Milk Calculator",
      "NearbyVet": "Nearby Vet",
      "HealthReport": "Health Report",
      "IDCard": "ID Card"
    }
  },
  hi: {
    translation: {
      "Dashboard": "डैशबोर्ड",
      "History": "इतिहास",
      "Encyclopedia": "ज्ञानकोश",
      "UploadImages": "मवेशी की तस्वीरें अपलोड करें",
      "Identify": "नस्ल पहचानें",
      "TotalScans": "कुल स्कैन",
      "Match": "मैच",
      "UseCamera": "फोटो खींचें",
      "MilkCalculator": "दूध कैलकुलेटर",
      "NearbyVet": "नजदीकी पशु चिकित्सक",
      "HealthReport": "स्वास्थ्य रिपोर्ट",
      "IDCard": "पहचान पत्र"
    }
  },
  gu: {
    translation: {
      "Dashboard": "ડેશબોર્ડ",
      "History": "ઇતિહાસ",
      "Encyclopedia": "જ્ઞાનકોશ",
      "UploadImages": "પશુઓના ચિત્રો અપલોડ કરો",
      "Identify": "નસ્લ ઓળખો",
      "TotalScans": "કુલ સ્કેન",
      "Match": "મેળ",
      "UseCamera": "ફોટો પાડો",
      "MilkCalculator": "દૂધ કેલ્ક્યુલેટર",
      "NearbyVet": "નજીકના પશુ ચિકિત્સક",
      "HealthReport": "આરોગ્ય અહેવાલ",
      "IDCard": "ઓળખ કાર્ડ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
