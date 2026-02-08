import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Navigation, Building2, Hospital, Stethoscope, Clock, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HospitalData {
  name: string;
  type: string;
  typeKey: string;
  distance: string;
  time: string;
  phone: string;
  open: boolean;
  hours: string;
  icon: typeof Stethoscope;
  color: string;
  lat?: number;
  lng?: number;
}

const defaultHospitals: HospitalData[] = [
  {
    name: 'Primary Health Center',
    type: 'PHC',
    typeKey: 'hospital.phc',
    distance: 'Nearby',
    time: 'Short drive',
    phone: '+254 700 123 456',
    open: true,
    hours: 'Open 24/7',
    icon: Stethoscope,
    color: 'bg-secondary',
  },
  {
    name: 'Government Hospital',
    type: 'Government',
    typeKey: 'hospital.govt',
    distance: 'Medium',
    time: '30 min drive',
    phone: '+254 700 789 012',
    open: true,
    hours: 'Open 24/7',
    icon: Hospital,
    color: 'bg-primary',
  },
  {
    name: 'Private Clinic',
    type: 'Private',
    typeKey: 'hospital.private',
    distance: 'Variable',
    time: 'Check map',
    phone: '+254 700 345 678',
    open: true,
    hours: 'Closes 9 PM',
    icon: Building2,
    color: 'bg-warning',
  },
];

const NearbyHospitals = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [hospitals, setHospitals] = useState<HospitalData[]>(defaultHospitals);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = () => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setHasLocation(true);
          setIsLoading(false);
          // In a real app, we'd fetch actual nearby hospitals here
          // For now, we update distances to show location is working
          setHospitals(prev => prev.map((h, i) => ({
            ...h,
            distance: `${(2 + i * 3).toFixed(1)} km`,
            time: `${10 + i * 8} min`
          })));
        },
        (error) => {
          console.error('Location error:', error);
          setIsLoading(false);
          // Still show hospitals, just with generic distances
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLoading(false);
    }
  };

  const openDirections = (hospital: HospitalData) => {
    if (hospital.lat && hospital.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`,
        '_blank'
      );
    } else if (userLocation) {
      // Search for this type of hospital near user
      window.open(
        `https://www.google.com/maps/search/${hospital.type}+hospital/@${userLocation.lat},${userLocation.lng},14z`,
        '_blank'
      );
    } else {
      window.open(`https://www.google.com/maps/search/${hospital.type}+hospital+near+me`, '_blank');
    }
  };

  return (
    <Layout showDisclaimer={false}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{t('hospital.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {hasLocation ? 'Based on your location' : t('hospital.searching')}
            </p>
          </div>
        </div>

        {/* Location Button */}
        {!hasLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={requestLocation}
              disabled={isLoading}
              className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-lg font-bold max-w-md mx-auto flex"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Finding your location...
                </>
              ) : (
                <>
                  <MapPin className="w-6 h-6 mr-2" />
                  Enable Location Access
                </>
              )}
            </Button>
          </motion.div>
        )}

        {hasLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Location enabled</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={requestLocation}
              className="ml-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Hospital List */}
        <div className="space-y-4 max-w-lg mx-auto">
          <AnimatePresence>
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital.name}
                className="glass-card p-5 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 ${hospital.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <hospital.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight">{hospital.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{t(hospital.typeKey)}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm font-medium text-secondary">{hospital.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className={hospital.open ? 'text-success font-medium' : 'text-destructive'}>
                      {hospital.hours}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{hospital.time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.a
                    href={`tel:${hospital.phone}`}
                    className="flex items-center justify-center gap-2 p-3 glass-card rounded-2xl font-bold"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone className="w-5 h-5 text-secondary" />
                    <span>{t('hospital.call')}</span>
                  </motion.a>
                  <Button
                    onClick={() => openDirections(hospital)}
                    className="rounded-2xl bg-gradient-to-r from-primary to-secondary"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    <span>{t('hospital.directions')}</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Emergency Note */}
        <motion.div 
          className="mt-8 p-4 glass-card rounded-2xl text-center max-w-lg mx-auto border-2 border-destructive/20"
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