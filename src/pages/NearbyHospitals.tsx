import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Navigation, Building2, Hospital, Stethoscope, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <span>Based on your location</span>
          </div>
        </motion.div>

        {/* Location Button */}
        <motion.button
          className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-primary-foreground rounded-2xl mb-8 max-w-md mx-auto"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MapPin className="w-6 h-6" />
          <span className="font-bold">Enable Location Access</span>
        </motion.button>

        {/* Hospital List */}
        <div className="space-y-4 max-w-lg mx-auto">
          {hospitals.map((hospital, index) => (
            <motion.div
              key={hospital.name}
              className="bg-card rounded-2xl p-5 shadow-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 ${hospital.color} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <hospital.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg leading-tight">{hospital.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{t(hospital.typeKey)}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm font-medium text-primary">{hospital.distance}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className={hospital.open ? 'text-primary font-medium' : 'text-destructive'}>
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
                  className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-xl font-bold"
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Call</span>
                </motion.a>
                <motion.button
                  className="flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-xl font-bold"
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-5 h-5" />
                  <span>{t('hospital.directions')}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

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