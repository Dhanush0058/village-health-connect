import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone, MapPin, AlertTriangle, ArrowLeft, Ambulance, Heart, Brain, Loader2, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const emergencyNumbers = [
  { name: 'Ambulance', number: '999', icon: Ambulance, color: 'bg-destructive' },
  { name: 'Nearest Hospital', number: '+254 700 123 456', icon: MapPin, color: 'bg-secondary' },
  { name: 'Poison Control', number: '0800 723 253', icon: AlertTriangle, color: 'bg-warning' },
];

const warningSymptoms = [
  { icon: Heart, text: 'Chest pain or pressure' },
  { icon: Brain, text: 'Sudden confusion or weakness' },
  { icon: AlertTriangle, text: 'Severe bleeding' },
  { icon: AlertTriangle, text: 'Difficulty breathing' },
  { icon: AlertTriangle, text: 'High fever with rash' },
];

const Emergency = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const findNearestHospital = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
          // Open Google Maps with hospital search
          window.open(
            `https://www.google.com/maps/search/hospital+emergency/@${position.coords.latitude},${position.coords.longitude},14z`,
            '_blank'
          );
        },
        () => {
          setIsLocating(false);
          // Fallback: open generic hospital search
          window.open('https://www.google.com/maps/search/hospital+emergency+near+me', '_blank');
        }
      );
    } else {
      setIsLocating(false);
      window.open('https://www.google.com/maps/search/hospital+emergency+near+me', '_blank');
    }
  };

  return (
    <Layout showDisclaimer={false}>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </Button>

        {/* Emergency Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="w-28 h-28 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-destructive/40"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 25px 50px -12px rgba(239, 68, 68, 0.4)',
                '0 25px 50px -12px rgba(239, 68, 68, 0.6)',
                '0 25px 50px -12px rgba(239, 68, 68, 0.4)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-destructive mb-2">{t('emergency.title')}</h1>
          <p className="text-muted-foreground">Call immediately if life is in danger</p>
        </motion.div>

        {/* Main Emergency Button */}
        <motion.a
          href="tel:999"
          className="block w-full max-w-md mx-auto mb-6"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-destructive text-white p-8 rounded-3xl shadow-2xl shadow-destructive/30 text-center">
            <Phone className="w-16 h-16 mx-auto mb-4" />
            <p className="text-5xl font-black mb-2">{t('emergency.call')}</p>
            <p className="text-lg opacity-90">Free Emergency Line</p>
          </div>
        </motion.a>

        {/* Find Nearest Hospital */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <Button
            onClick={findNearestHospital}
            disabled={isLocating}
            className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-lg font-bold"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                {t('emergency.finding')}
              </>
            ) : (
              <>
                <Navigation className="w-6 h-6 mr-2" />
                Find Nearest Hospital
              </>
            )}
          </Button>
        </motion.div>

        {/* Other Emergency Numbers */}
        <div className="space-y-3 max-w-md mx-auto mb-8">
          {emergencyNumbers.slice(1).map((item, index) => (
            <motion.a
              key={item.name}
              href={`tel:${item.number.replace(/\s/g, '')}`}
              className="flex items-center gap-4 p-4 glass-card rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-secondary font-mono text-lg">{item.number}</p>
              </div>
              <Phone className="w-6 h-6 text-secondary" />
            </motion.a>
          ))}
        </div>

        {/* Warning Symptoms */}
        <motion.div 
          className="glass-card p-6 rounded-3xl max-w-md mx-auto border-2 border-destructive/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-bold text-lg text-destructive mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {t('emergency.symptoms')}
          </h2>
          <ul className="space-y-3">
            {warningSymptoms.map((symptom, index) => (
              <li key={index} className="flex items-center gap-3">
                <symptom.icon className="w-5 h-5 text-destructive flex-shrink-0" />
                <span className="font-medium">{symptom.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Emergency;