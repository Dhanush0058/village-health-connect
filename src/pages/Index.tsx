import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import {
  Stethoscope,

  Pill,
  Camera,
  MapPin,
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services = [
    {
      icon: Stethoscope,
      title: t('service.doctor'),
      description: t('service.doctor.desc'),
      path: '/doctor',
      gradient: 'from-primary to-secondary',
    },

    {
      icon: Pill,
      title: t('service.medicine'),
      description: t('service.medicine.desc'),
      path: '/medicine',
      gradient: 'from-teal-medical to-primary',
    },
    {
      icon: Camera,
      title: t('service.photo'),
      description: t('service.photo.desc'),
      path: '/photo',
      gradient: 'from-primary to-teal-medical',
    },
    {
      icon: MapPin,
      title: t('service.hospital'),
      description: t('service.hospital.desc'),
      path: '/hospital',
      gradient: 'from-secondary to-primary',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('home.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">{t('home.subtitle')}</p>
        </motion.div>

        {/* Service Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={index === services.length - 1 && services.length % 2 !== 0 ? 'col-span-2 lg:col-span-1' : ''}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() => navigate(service.path)}
                gradient={service.gradient}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
