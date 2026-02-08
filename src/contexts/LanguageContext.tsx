import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'gu' | 'bn' | 'pa' | 'sw' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { t, i18n } = useTranslation();
  // We need local state to trigger re-renders when language changes, 
  // although useTranslation usually handles this. 
  // Accessing i18n.language directly might not trigger updates in some cases if not using the hook properly.
  // actually useTranslation hook will trigger re-render when language changes.

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  useEffect(() => {
    const hasSelected = localStorage.getItem('user_language_selected');
    if (!hasSelected) {
      setIsLanguageModalOpen(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('user_language_selected', 'true');
  };

  const currentLanguage = (i18n.language || 'en') as Language;

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, t, isLanguageModalOpen, setIsLanguageModalOpen }}>
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
  { code: 'en' as Language, label: 'English', short: 'EN' },
  { code: 'hi' as Language, label: 'हिन्दी', short: 'हिं' },
  { code: 'te' as Language, label: 'తెలుగు', short: 'తె' },
  { code: 'ta' as Language, label: 'தமிழ்', short: 'த' },
  { code: 'kn' as Language, label: 'ಕನ್ನಡ', short: 'ಕ' },
  { code: 'ml' as Language, label: 'മലയാളം', short: 'മ' },
  { code: 'mr' as Language, label: 'मराठी', short: 'म' },
  { code: 'gu' as Language, label: 'ગુજરાતી', short: 'ગુ' },
  { code: 'bn' as Language, label: 'বাংলা', short: 'বা' },
  { code: 'pa' as Language, label: 'ਪੰਜਾਬੀ', short: 'ਪੰ' },
  { code: 'sw' as Language, label: 'Kiswahili', short: 'SW' },
  { code: 'fr' as Language, label: 'Français', short: 'FR' },
];
