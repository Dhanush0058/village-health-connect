import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Phone, MapPin, AlertTriangle, ArrowLeft, Ambulance, Heart, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const emergencyNumbers = [
  { name: 'Ambulance', number: '999', icon: Ambulance, color: 'bg-destructive' },
  { name: 'Nearest Hospital', number: '+254 700 123 456', icon: MapPin, color: 'bg-health-blue' },
  { name: 'Poison Control', number: '0800 723 253', icon: AlertTriangle, color: 'bg-health-orange' },
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

  return (
    <Layout showDisclaimer={false}>
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

        {/* Emergency Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <AlertTriangle className="w-14 h-14 text-destructive-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-destructive mb-2">Emergency Help</h1>
          <p className="text-muted-foreground">Call immediately if life is in danger</p>
        </motion.div>

        {/* Main Emergency Button */}
        <motion.a
          href="tel:999"
          className="block w-full max-w-md mx-auto mb-8"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-destructive text-destructive-foreground p-8 rounded-2xl shadow-2xl text-center">
            <Phone className="w-16 h-16 mx-auto mb-4" />
            <p className="text-4xl font-black mb-2">CALL 999</p>
            <p className="text-lg opacity-90">Free Emergency Line</p>
          </div>
        </motion.a>

        {/* Other Emergency Numbers */}
        <div className="space-y-3 max-w-md mx-auto mb-8">
          {emergencyNumbers.slice(1).map((item, index) => (
            <motion.a
              key={item.name}
              href={`tel:${item.number.replace(/\s/g, '')}`}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-primary font-mono text-lg">{item.number}</p>
              </div>
              <Phone className="w-6 h-6 text-primary" />
            </motion.a>
          ))}
        </div>

        {/* Warning Symptoms */}
        <motion.div 
          className="bg-emergency-light border-2 border-destructive/30 rounded-2xl p-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-bold text-lg text-destructive mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Go to hospital immediately if:
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

        {/* Find Nearest Hospital */}
        <motion.button
          onClick={() => navigate('/hospital')}
          className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-primary-foreground rounded-2xl mt-6 max-w-md mx-auto"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MapPin className="w-6 h-6" />
          <span className="font-bold text-lg">Find Nearest Hospital</span>
        </motion.button>
      </div>
    </Layout>
  );
};

export default Emergency;