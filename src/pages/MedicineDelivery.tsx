import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Mic, MapPin, Store, Building, ChevronRight, Phone, User, Dog, Loader2, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/hooks/useLocation';
import MapComponent from '@/components/MapComponent';

const pickupPoints = [
  { name: 'Molo Village Center', distance: '2.5 km', status: 'Open now', icon: Store },
  { name: 'Riverside Health Post', distance: '4.1 km', status: 'Closes 6 PM', icon: Building },
  { name: 'Salgaa Community Hub', distance: '6.8 km', status: 'Open 24/7', icon: Building },
];

const MedicineDelivery = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'human' | 'livestock'>('human');
  const { location, getLocation, isLoading } = useLocation();

  const handleMapClick = () => {
    getLocation();
  };

  // Removed the useEffect that opened Google Maps, as MapComponent will handle display

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 big-button bg-secondary"
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </motion.button>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('medicine.title')}</h1>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          className="flex bg-secondary p-1.5 rounded-full mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setMode('human')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${mode === 'human' ? 'bg-card shadow-md text-primary' : 'text-muted-foreground'
              }`}
          >
            <User className="w-5 h-5" />
            For Humans
          </button>
          <button
            onClick={() => setMode('livestock')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${mode === 'livestock' ? 'bg-card shadow-md text-primary' : 'text-muted-foreground'
              }`}
          >
            <Dog className="w-5 h-5" />
            For Livestock
          </button>
        </motion.div>

        {/* Upload Prescription */}
        <motion.button
          className="w-full flex flex-col items-center gap-4 p-8 bg-primary text-primary-foreground rounded-2xl shadow-xl mb-6 max-w-md mx-auto"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{t('medicine.upload')}</h3>
            <p className="text-sm opacity-80 uppercase tracking-wider mt-1">Take a picture of your paper</p>
          </div>
        </motion.button>

        {/* Voice Message */}
        <motion.button
          className="w-full flex items-center justify-center gap-4 h-20 bg-card border-2 border-primary rounded-full mb-2 max-w-md mx-auto"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Mic className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">{t('medicine.voice')}</span>
        </motion.button>
        <p className="text-center text-muted-foreground text-sm mb-8 max-w-md mx-auto">
          Use this if you cannot type or have no paper prescription
        </p>

        {/* Nearby Pickup Points */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t('medicine.pickup')}
            </h2>
            {!location && (
              <button
                onClick={handleMapClick}
                disabled={isLoading}
                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'MAP VIEW'}
              </button>
            )}
          </div>

          {!location ? (
            <div className="space-y-3 opacity-70">
              <p className="text-center text-sm text-muted-foreground mb-4">Example Pharmacies (Click MAP VIEW for real ones)</p>
              {pickupPoints.map((point, index) => (
                <motion.button
                  key={point.name}
                  className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMapClick}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <point.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold">{point.name}</h4>
                      <p className="text-sm text-muted-foreground">{point.distance} • {point.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapComponent userLocation={location} type={mode === 'human' ? 'pharmacy' : 'veterinary_care'} />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={getLocation}
                  className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary"
                >
                  <MapPin className="w-4 h-4" /> Update Location
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Help Hotline */}
        <motion.div
          className="mt-8 p-6 bg-health-green-light rounded-2xl border border-primary/20 text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Need help? Call for free at</p>
          <p className="text-2xl font-bold text-primary">0800 123 456</p>
        </motion.div>
      </div>
    </Layout>
  );
};


export default MedicineDelivery;