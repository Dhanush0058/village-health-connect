import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'sw' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.name': 'Rural Health',
    'emergency': 'Emergency',
    
    // Home
    'home.title': 'Tap for help',
    'home.subtitle': 'Select a service below',
    
    // Services
    'service.doctor': 'Talk to Doctor',
    'service.doctor.desc': 'Human Health',
    'service.animal': 'Animal Health',
    'service.animal.desc': 'Cow, Sheep, Goat',
    'service.medicine': 'Order Medicine',
    'service.medicine.desc': 'Pharmacy',
    'service.photo': 'Photo Help',
    'service.photo.desc': 'Send Picture',
    'service.hospital': 'Find Hospital',
    'service.hospital.desc': 'Nearby Clinics',
    
    // Doctor Consultation
    'doctor.title': 'Talk to a Doctor',
    'doctor.chat': 'Chat',
    'doctor.audio': 'Audio Call',
    'doctor.video': 'Video Call',
    'doctor.wait': 'Average wait: 5 min',
    
    // Photo Help
    'photo.title': 'Photo Symptom Help',
    'photo.take': 'Take or Upload Photo',
    'photo.human': 'Human',
    'photo.livestock': 'Livestock',
    'photo.guide.light': 'Bright Light',
    'photo.guide.focus': 'Clear Focus',
    'photo.guide.close': 'Close Up',
    
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
    
    // Animal Health
    'animal.title': 'Livestock Health',
    'animal.select': 'Select Your Animal',
    'animal.cow': 'Cow',
    'animal.goat': 'Goat',
    'animal.chicken': 'Chicken',
    'animal.sheep': 'Sheep',
    'animal.vet': 'Talk to Vet',
    'animal.vaccine': 'Medicine & Shots',
    'animal.urgent': 'Urgent Help',
    
    // Footer
    'disclaimer': 'Not a replacement for professional doctors. In case of emergency, go to the nearest hospital.',
    'nav.home': 'Home',
    'nav.me': 'Me',
    'nav.alerts': 'Alerts',
  },
  hi: {
    'app.name': 'ग्रामीण स्वास्थ्य',
    'emergency': 'आपातकाल',
    'home.title': 'मदद के लिए टैप करें',
    'home.subtitle': 'नीचे सेवा चुनें',
    'service.doctor': 'डॉक्टर से बात करें',
    'service.doctor.desc': 'मानव स्वास्थ्य',
    'service.animal': 'पशु स्वास्थ्य',
    'service.animal.desc': 'गाय, भेड़, बकरी',
    'service.medicine': 'दवाई मंगवाएं',
    'service.medicine.desc': 'फार्मेसी',
    'service.photo': 'फोटो मदद',
    'service.photo.desc': 'तस्वीर भेजें',
    'service.hospital': 'अस्पताल खोजें',
    'service.hospital.desc': 'नजदीकी क्लीनिक',
    'doctor.title': 'डॉक्टर से बात करें',
    'doctor.chat': 'चैट',
    'doctor.audio': 'ऑडियो कॉल',
    'doctor.video': 'वीडियो कॉल',
    'doctor.wait': 'औसत प्रतीक्षा: 5 मिनट',
    'photo.title': 'फोटो लक्षण मदद',
    'photo.take': 'फोटो लें या अपलोड करें',
    'photo.human': 'मानव',
    'photo.livestock': 'पशुधन',
    'photo.guide.light': 'तेज रोशनी',
    'photo.guide.focus': 'स्पष्ट फोकस',
    'photo.guide.close': 'करीब से',
    'medicine.title': 'दवाई पहुंच',
    'medicine.upload': 'पर्चा अपलोड करें',
    'medicine.voice': 'आवाज संदेश रिकॉर्ड करें',
    'medicine.pickup': 'नजदीकी पिकअप पॉइंट',
    'hospital.title': 'नजदीकी अस्पताल',
    'hospital.phc': 'प्राथमिक स्वास्थ्य केंद्र',
    'hospital.govt': 'सरकारी अस्पताल',
    'hospital.private': 'प्राइवेट क्लीनिक',
    'hospital.directions': 'रास्ता देखें',
    'animal.title': 'पशु स्वास्थ्य',
    'animal.select': 'अपना पशु चुनें',
    'animal.cow': 'गाय',
    'animal.goat': 'बकरी',
    'animal.chicken': 'मुर्गी',
    'animal.sheep': 'भेड़',
    'animal.vet': 'पशु चिकित्सक से बात करें',
    'animal.vaccine': 'दवाई और टीके',
    'animal.urgent': 'तुरंत मदद',
    'disclaimer': 'यह पेशेवर डॉक्टरों का विकल्प नहीं है। आपातकाल में निकटतम अस्पताल जाएं।',
    'nav.home': 'होम',
    'nav.me': 'मैं',
    'nav.alerts': 'अलर्ट',
  },
  sw: {
    'app.name': 'Afya Vijijini',
    'emergency': 'Dharura',
    'home.title': 'Gusa kwa msaada',
    'home.subtitle': 'Chagua huduma hapa chini',
    'service.doctor': 'Ongea na Daktari',
    'service.doctor.desc': 'Afya ya Binadamu',
    'service.animal': 'Afya ya Mifugo',
    'service.animal.desc': 'Ng\'ombe, Kondoo, Mbuzi',
    'service.medicine': 'Agiza Dawa',
    'service.medicine.desc': 'Duka la Dawa',
    'service.photo': 'Msaada wa Picha',
    'service.photo.desc': 'Tuma Picha',
    'service.hospital': 'Tafuta Hospitali',
    'service.hospital.desc': 'Kliniki za Karibu',
    'doctor.title': 'Ongea na Daktari',
    'doctor.chat': 'Mazungumzo',
    'doctor.audio': 'Simu ya Sauti',
    'doctor.video': 'Simu ya Video',
    'doctor.wait': 'Muda wa kusubiri: Dakika 5',
    'photo.title': 'Msaada wa Dalili za Picha',
    'photo.take': 'Piga au Pakia Picha',
    'photo.human': 'Binadamu',
    'photo.livestock': 'Mifugo',
    'photo.guide.light': 'Mwanga Mkali',
    'photo.guide.focus': 'Zingatia Vizuri',
    'photo.guide.close': 'Karibu',
    'medicine.title': 'Upatikanaji wa Dawa',
    'medicine.upload': 'Pakia Dawa',
    'medicine.voice': 'Rekodi Ujumbe wa Sauti',
    'medicine.pickup': 'Sehemu za Kuchukua Karibu',
    'hospital.title': 'Hospitali za Karibu',
    'hospital.phc': 'Kituo cha Afya',
    'hospital.govt': 'Hospitali ya Serikali',
    'hospital.private': 'Kliniki Binafsi',
    'hospital.directions': 'Pata Maelekezo',
    'animal.title': 'Afya ya Mifugo',
    'animal.select': 'Chagua Mnyama Wako',
    'animal.cow': 'Ng\'ombe',
    'animal.goat': 'Mbuzi',
    'animal.chicken': 'Kuku',
    'animal.sheep': 'Kondoo',
    'animal.vet': 'Ongea na Daktari wa Mifugo',
    'animal.vaccine': 'Dawa na Chanjo',
    'animal.urgent': 'Msaada wa Haraka',
    'disclaimer': 'Hii si mbadala wa madaktari. Kwa dharura, nenda hospitali ya karibu.',
    'nav.home': 'Nyumbani',
    'nav.me': 'Mimi',
    'nav.alerts': 'Arifa',
  },
  fr: {
    'app.name': 'Santé Rurale',
    'emergency': 'Urgence',
    'home.title': 'Appuyez pour de l\'aide',
    'home.subtitle': 'Sélectionnez un service ci-dessous',
    'service.doctor': 'Parler au Médecin',
    'service.doctor.desc': 'Santé Humaine',
    'service.animal': 'Santé Animale',
    'service.animal.desc': 'Vache, Mouton, Chèvre',
    'service.medicine': 'Commander Médicaments',
    'service.medicine.desc': 'Pharmacie',
    'service.photo': 'Aide Photo',
    'service.photo.desc': 'Envoyer Photo',
    'service.hospital': 'Trouver Hôpital',
    'service.hospital.desc': 'Cliniques Proches',
    'doctor.title': 'Parler à un Médecin',
    'doctor.chat': 'Chat',
    'doctor.audio': 'Appel Audio',
    'doctor.video': 'Appel Vidéo',
    'doctor.wait': 'Attente moyenne: 5 min',
    'photo.title': 'Aide Symptômes Photo',
    'photo.take': 'Prendre ou Télécharger Photo',
    'photo.human': 'Humain',
    'photo.livestock': 'Bétail',
    'photo.guide.light': 'Lumière Vive',
    'photo.guide.focus': 'Mise au Point',
    'photo.guide.close': 'Gros Plan',
    'medicine.title': 'Accès Médicaments',
    'medicine.upload': 'Télécharger Ordonnance',
    'medicine.voice': 'Enregistrer Message Vocal',
    'medicine.pickup': 'Points de Retrait Proches',
    'hospital.title': 'Hôpitaux Proches',
    'hospital.phc': 'Centre de Santé',
    'hospital.govt': 'Hôpital Public',
    'hospital.private': 'Clinique Privée',
    'hospital.directions': 'Obtenir Itinéraire',
    'animal.title': 'Santé du Bétail',
    'animal.select': 'Sélectionnez Votre Animal',
    'animal.cow': 'Vache',
    'animal.goat': 'Chèvre',
    'animal.chicken': 'Poulet',
    'animal.sheep': 'Mouton',
    'animal.vet': 'Parler au Vétérinaire',
    'animal.vaccine': 'Médicaments & Vaccins',
    'animal.urgent': 'Aide Urgente',
    'disclaimer': 'Ne remplace pas les médecins. En cas d\'urgence, allez à l\'hôpital le plus proche.',
    'nav.home': 'Accueil',
    'nav.me': 'Moi',
    'nav.alerts': 'Alertes',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
  { code: 'sw' as Language, label: 'Kiswahili', short: 'SW' },
  { code: 'fr' as Language, label: 'Français', short: 'FR' },
];