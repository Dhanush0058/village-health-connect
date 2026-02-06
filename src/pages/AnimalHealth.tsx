import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Syringe, AlertTriangle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const animals = [
  { id: 'cow', emoji: '🐄', labelKey: 'animal.cow' },
  { id: 'goat', emoji: '🐐', labelKey: 'animal.goat' },
  { id: 'chicken', emoji: '🐔', labelKey: 'animal.chicken' },
  { id: 'sheep', emoji: '🐑', labelKey: 'animal.sheep' },
];

const AnimalHealth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('animal.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('animal.select')}</p>
        </motion.div>

        {/* Photo Upload CTA */}
        <motion.button
          className="w-full flex items-center justify-center gap-4 p-6 bg-destructive text-destructive-foreground rounded-2xl shadow-xl mb-8 max-w-lg mx-auto"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Camera className="w-12 h-12" />
          <div className="text-left">
            <span className="block text-xl font-bold">Show Us The Problem</span>
            <span className="text-sm opacity-90">Upload photo of injury</span>
          </div>
        </motion.button>

        {/* Animal Selection Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
          {animals.map((animal, index) => (
            <motion.button
              key={animal.id}
              onClick={() => setSelectedAnimal(animal.id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 shadow-lg transition-all ${
                selectedAnimal === animal.id
                  ? 'bg-health-green-light border-primary'
                  : 'bg-card border-transparent hover:border-primary/50'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-6xl">{animal.emoji}</span>
              <span className="text-xl font-bold">{t(animal.labelKey)}</span>
            </motion.button>
          ))}
        </div>

        {/* Selected Animal Actions */}
        {selectedAnimal && (
          <motion.div
            className="bg-card rounded-2xl p-6 shadow-xl border-t-4 border-primary max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <h2 className="text-xl font-bold">
                What do you need for your{' '}
                <span className="text-primary underline">
                  {t(`animal.${selectedAnimal}`) || selectedAnimal}
                </span>
                ?
              </h2>
            </div>

            <div className="grid gap-4">
              {/* Talk to Vet */}
              <button className="flex items-center gap-4 p-4 bg-surface-sunken rounded-xl hover:bg-secondary transition-colors">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Video className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-lg">{t('animal.vet')}</h3>
                  <p className="text-sm text-muted-foreground">Video call with a vet now</p>
                </div>
              </button>

              {/* Medicine & Shots */}
              <button className="flex items-center gap-4 p-4 bg-surface-sunken rounded-xl hover:bg-secondary transition-colors">
                <div className="w-14 h-14 bg-health-blue rounded-full flex items-center justify-center shadow-lg">
                  <Syringe className="w-7 h-7 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-lg">{t('animal.vaccine')}</h3>
                  <p className="text-sm text-muted-foreground">Vaccination schedule</p>
                </div>
              </button>

              {/* Urgent Help */}
              <button className="flex items-center gap-4 p-4 bg-emergency-light rounded-xl border-2 border-destructive/30 hover:border-destructive transition-colors">
                <div className="w-14 h-14 bg-destructive rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-destructive-foreground" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-lg text-destructive">{t('animal.urgent')}</h3>
                  <p className="text-sm text-destructive/80">Animal is very sick or hurt</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default AnimalHealth;