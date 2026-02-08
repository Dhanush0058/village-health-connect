import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Navigation, Building2, Hospital, Stethoscope, Clock, Loader2, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/hooks/useLocation';
import MapComponent from '@/components/MapComponent';

const hospitals = [
  {
    name: 'Molo Primary Health Center',
    type: 'PHC',
    typeKey: 'hospital.phc',
    distance: '3.2 km',
    time: '15 min drive',
    phone: '+254 700 123 456',
    open: true,
    hours: 'Open 24/7',
    icon: Stethoscope,
    color: 'bg-health-blue',
  },
  {
    name: 'Nakuru County Hospital',
    type: 'Government',
    typeKey: 'hospital.govt',
    distance: '12.5 km',
    time: '35 min drive',
    phone: '+254 700 789 012',
    open: true,
    hours: 'Open 24/7',
    icon: Hospital,
    color: 'bg-primary',
  },
  {
    name: 'Mediheal Private Clinic',
    type: 'Private',
    typeKey: 'hospital.private',
    distance: '8.1 km',
    time: '25 min drive',
    phone: '+254 700 345 678',
    open: true,
    hours: 'Closes 9 PM',
    icon: Building2,
    color: 'bg-health-orange',
  },
];

const NearbyHospitals = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { location, getLocation, isLoading } = useLocation();

  const handleDirections = (hospitalName: string) => {
    if (location) {
      // Use real location for start point, and query for destination
      const url = `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${encodeURIComponent(hospitalName)}`;
      window.open(url, '_blank');
    } else {
      // Fallback or prompt for location
      getLocation();
    }
  };

  // Auto-trigger map if location was just found after a user action
  useEffect(() => {
    // Optional: could auto-redirect or just let the user click again. 
    // We'll keeps it clean and just update the UI state.
  }, [location]);

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('hospital.title')}</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{location ? "Showing real nearby results" : "Enable location for real results"}</span>
          </div>
        </motion.div>

        {/* content */}
        {!location ? (
          <>
            <motion.button
              onClick={getLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-primary-foreground rounded-2xl mb-8 max-w-md mx-auto hover:bg-primary/90 transition-colors disabled:opacity-70"
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapPin className="w-6 h-6" />}
              <span className="font-bold">{isLoading ? "Finding your location..." : "Enable Location Access"}</span>
            </motion.button>

            {/* Offline/Mock Hospital List */}
            <div className="space-y-4 max-w-lg mx-auto opacity-70">
              <p className="text-center text-sm text-muted-foreground mb-4">Example Nearby Hospitals (Enable location to see real ones)</p>
              {hospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.name}
                  className="bg-card rounded-2xl p-5 shadow-lg border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 ${hospital.color} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <hospital.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg leading-tight">{hospital.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{t(hospital.typeKey)}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm font-medium text-primary ml-auto">{hospital.distance}</span>
                      </div>
                    </div>
                  </div>
                  {/* Info and Actions removed for brevity/simplicity in fallback mode, or keep if preferred */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className={hospital.open ? 'text-primary font-medium' : 'text-destructive'}>
                        {hospital.hours}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <MapComponent userLocation={location} type="hospital" />

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

        {/* Emergency Note */}
        <motion.div
          className="mt-8 p-4 bg-emergency-light border-2 border-destructive/30 rounded-2xl text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-destructive font-bold">
            🚨 In case of emergency, call 999 or go to the nearest hospital immediately
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NearbyHospitals;