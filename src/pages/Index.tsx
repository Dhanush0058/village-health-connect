import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Dog, 
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
      variant: 'default' as const,
    },
    {
      icon: Dog,
      title: t('service.animal'),
      description: t('service.animal.desc'),
      path: '/animal',
      variant: 'default' as const,
    },
    {
      icon: Pill,
      title: t('service.medicine'),
      description: t('service.medicine.desc'),
      path: '/medicine',
      variant: 'default' as const,
    },
    {
      icon: Camera,
      title: t('service.photo'),
      description: t('service.photo.desc'),
      path: '/photo',
      variant: 'default' as const,
    },
    {
      icon: MapPin,
      title: t('service.hospital'),
      description: t('service.hospital.desc'),
      path: '/hospital',
      variant: 'default' as const,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3">{t('home.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('home.subtitle')}</p>
        </motion.div>

        {/* Service Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() => navigate(service.path)}
                variant={service.variant}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;