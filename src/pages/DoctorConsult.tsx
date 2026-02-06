import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Video, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorConsult = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const consultOptions = [
    {
      icon: MessageCircle,
      title: t('doctor.chat'),
      description: 'Type your symptoms',
      color: 'bg-health-blue',
    },
    {
      icon: Phone,
      title: t('doctor.audio'),
      description: 'Talk on phone',
      color: 'bg-health-orange',
    },
    {
      icon: Video,
      title: t('doctor.video'),
      description: 'Face to face',
      color: 'bg-primary',
    },
  ];

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
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('doctor.title')}</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span>{t('doctor.wait')}</span>
          </div>
        </motion.div>

        {/* Consultation Options */}
        <div className="grid gap-4 max-w-md mx-auto">
          {consultOptions.map((option, index) => (
            <motion.button
              key={option.title}
              className="flex items-center gap-6 p-6 bg-card rounded-2xl border-4 border-transparent hover:border-primary shadow-lg transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-20 h-20 ${option.color} rounded-full flex items-center justify-center shadow-lg`}>
                <option.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold">{option.title}</h3>
                <p className="text-muted-foreground">{option.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Online Doctors Preview */}
        <motion.div 
          className="mt-10 p-6 bg-health-green-light rounded-2xl max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="font-bold">12 doctors online now</span>
          </div>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-lg font-bold"
              >
                👨‍⚕️
              </div>
            ))}
            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-sm font-bold">
              +7
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DoctorConsult;