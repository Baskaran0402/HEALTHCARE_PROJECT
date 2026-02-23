
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "clinical_indicator_assessment": "Clinical Indicator Assessment",
      "patient_dashboard": "Patient Health Dashboard"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido",
      "clinical_indicator_assessment": "Evaluación de Indicadores Clínicos",
      "patient_dashboard": "Panel de Salud del Paciente"
    }
  },
  zh: {
    translation: {
      "welcome": "欢迎",
      "clinical_indicator_assessment": "临床指标评估",
      "patient_dashboard": "患者健康仪表板"
    }
  },
  hi: {
    translation: {
      "welcome": "स्वागत हे",
      "clinical_indicator_assessment": "नैदानिक संकेतक मूल्यांकन",
      "patient_dashboard": "रोगी स्वास्थ्य डैशबोर्ड"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
