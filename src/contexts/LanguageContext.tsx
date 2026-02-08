import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Language = 'en' | 'hi' | 'sw' | 'fr' | 'es' | 'ar' | 'bn' | 'ta' | 'te';

interface TranslationCache {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

// Base English translations
const baseTranslations: Record<string, string> = {
  // Header
  'app.name': 'RuralCare Connect',
  'emergency': 'Emergency',
  
  // Home
  'home.title': 'How can we help you today?',
  'home.subtitle': 'Tap a service to get started',
  
  // Services
  'service.doctor': 'Talk to Doctor',
  'service.doctor.desc': 'Chat or Video Call',
  'service.animal': 'Animal Health',
  'service.animal.desc': 'Livestock Care',
  'service.medicine': 'Medicine Access',
  'service.medicine.desc': 'Order & Pickup',
  'service.photo': 'Photo Scan',
  'service.photo.desc': 'AI Health Check',
  'service.hospital': 'Find Hospital',
  'service.hospital.desc': 'Nearby Clinics',
  
  // Doctor Consultation
  'doctor.title': 'Health Assistant',
  'doctor.chat': 'Chat',
  'doctor.audio': 'Voice Call',
  'doctor.video': 'Video Call',
  'doctor.wait': 'Typically replies in seconds',
  'doctor.placeholder': 'Type your health question...',
  'doctor.send': 'Send',
  'doctor.listening': 'Listening...',
  'doctor.speaking': 'Speaking...',
  
  // Photo Help
  'photo.title': 'Photo Health Scan',
  'photo.take': 'Take or Upload Photo',
  'photo.human': 'Human',
  'photo.livestock': 'Livestock',
  'photo.guide.light': 'Good Lighting',
  'photo.guide.focus': 'Clear Focus',
  'photo.guide.close': 'Close Up',
  'photo.analyzing': 'Analyzing your photo...',
  'photo.result': 'Analysis Result',
  
  // Medicine
  'medicine.title': 'Medicine Access',
  'medicine.upload': 'Upload Prescription',
  'medicine.voice': 'Record Voice Message',
  'medicine.pickup': 'Nearby Pickup Points',
  
  // Hospital
  'hospital.title': 'Nearby Hospitals',
  'hospital.phc': 'Primary Health Center',
  'hospital.govt': 'Government Hospital',
  'hospital.private': 'Private Clinic',
  'hospital.directions': 'Get Directions',
  'hospital.call': 'Call Now',
  'hospital.open24': 'Open 24/7',
  'hospital.searching': 'Finding hospitals near you...',
  
  // Animal Health
  'animal.title': 'Livestock Health',
  'animal.select': 'Select Your Animal',
  'animal.cow': 'Cow',
  'animal.goat': 'Goat',
  'animal.chicken': 'Chicken',
  'animal.sheep': 'Sheep',
  'animal.vet': 'Talk to Vet',
  'animal.vaccine': 'Vaccines & Medicine',
  'animal.urgent': 'Urgent Help',
  
  // Emergency
  'emergency.title': 'Emergency Help',
  'emergency.call': 'Call Emergency',
  'emergency.finding': 'Finding nearest hospital...',
  'emergency.symptoms': 'Emergency Symptoms',
  
  // Common
  'loading': 'Loading...',
  'error': 'Something went wrong',
  'retry': 'Try Again',
  'back': 'Back',
  'close': 'Close',
  'speak': 'Listen',
  
  // Footer
  'disclaimer': 'This app provides health guidance only. It does not replace professional medical care. In emergencies, go to the nearest hospital immediately.',
  'nav.home': 'Home',
  'nav.me': 'Profile',
  'nav.alerts': 'Alerts',
};

// Fallback translations for when API is unavailable
const fallbackTranslations: Record<Language, Record<string, string>> = {
  en: baseTranslations,
  hi: {
    'app.name': 'रूरलकेयर कनेक्ट',
    'emergency': 'आपातकाल',
    'home.title': 'आज हम आपकी कैसे मदद कर सकते हैं?',
    'home.subtitle': 'शुरू करने के लिए सेवा पर टैप करें',
    'service.doctor': 'डॉक्टर से बात करें',
    'service.doctor.desc': 'चैट या वीडियो कॉल',
    'service.animal': 'पशु स्वास्थ्य',
    'service.animal.desc': 'पशुपालन देखभाल',
    'nav.home': 'होम',
    'disclaimer': 'यह ऐप केवल स्वास्थ्य मार्गदर्शन प्रदान करता है। यह पेशेवर चिकित्सा देखभाल की जगह नहीं लेता।',
  },
  sw: {
    'app.name': 'RuralCare Connect',
    'emergency': 'Dharura',
    'home.title': 'Tunawezaje kukusaidia leo?',
    'home.subtitle': 'Gusa huduma kuanza',
    'service.doctor': 'Ongea na Daktari',
    'nav.home': 'Nyumbani',
  },
  fr: {
    'app.name': 'RuralCare Connect',
    'emergency': 'Urgence',
    'home.title': 'Comment pouvons-nous vous aider?',
    'home.subtitle': 'Appuyez sur un service pour commencer',
    'service.doctor': 'Parler au Médecin',
    'nav.home': 'Accueil',
  },
  es: {},
  ar: {},
  bn: {},
  ta: {},
  te: {},
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<TranslationCache>(baseTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const translateBatch = useCallback(async (targetLang: Language) => {
    if (targetLang === 'en') {
      setTranslations(baseTranslations);
      return;
    }

    setIsLoading(true);
    
    try {
      const keys = Object.keys(baseTranslations);
      const texts = Object.values(baseTranslations);

      const { data, error } = await supabase.functions.invoke('translate', {
        body: { texts, targetLanguage: targetLang }
      });

      if (error) throw error;

      const newTranslations: TranslationCache = {};
      keys.forEach((key, index) => {
        newTranslations[key] = data.translations?.[index] || baseTranslations[key];
      });

      setTranslations(newTranslations);
    } catch (error) {
      console.error('Translation error:', error);
      // Use fallback translations
      const fallback = fallbackTranslations[targetLang] || {};
      setTranslations({ ...baseTranslations, ...fallback });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    translateBatch(lang);
  }, [translateBatch]);

  useEffect(() => {
    // Check for saved language preference
    const saved = localStorage.getItem('ruralcare-language') as Language;
    if (saved && saved !== 'en') {
      setLanguage(saved);
    }
  }, [setLanguage]);

  useEffect(() => {
    localStorage.setItem('ruralcare-language', language);
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[key] || baseTranslations[key] || key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languages = [
  { code: 'en' as Language, label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'hi' as Language, label: 'हिन्दी', short: 'हिं', flag: '🇮🇳' },
  { code: 'sw' as Language, label: 'Kiswahili', short: 'SW', flag: '🇰🇪' },
  { code: 'fr' as Language, label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'es' as Language, label: 'Español', short: 'ES', flag: '🇪🇸' },
  { code: 'ar' as Language, label: 'العربية', short: 'AR', flag: '🇸🇦' },
  { code: 'bn' as Language, label: 'বাংলা', short: 'BN', flag: '🇧🇩' },
  { code: 'ta' as Language, label: 'தமிழ்', short: 'TA', flag: '🇮🇳' },
  { code: 'te' as Language, label: 'తెలుగు', short: 'TE', flag: '🇮🇳' },
];
