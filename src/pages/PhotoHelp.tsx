import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Sun, Focus, ZoomIn, Phone, BookOpen, User, Dog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhotoHelp = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'human' | 'livestock'>('human');

  const guides = [
    { icon: Sun, title: t('photo.guide.light'), desc: 'Go outside or use a lamp', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Focus, title: t('photo.guide.focus'), desc: 'Hold still for 2 seconds', color: 'bg-health-blue/20 text-health-blue' },
    { icon: ZoomIn, title: t('photo.guide.close'), desc: 'Keep the area in the center', color: 'bg-health-green-light text-primary' },
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
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('photo.title')}</h1>
          <p className="text-lg text-muted-foreground">Send a photo to get medical advice quickly.</p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div 
          className="flex bg-secondary p-1.5 rounded-full mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setMode('human')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-lg transition-all ${
              mode === 'human' ? 'bg-card shadow-md text-primary' : 'text-muted-foreground'
            }`}
          >
            <User className="w-6 h-6" />
            {t('photo.human')}
          </button>
          <button
            onClick={() => setMode('livestock')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-lg transition-all ${
              mode === 'livestock' ? 'bg-card shadow-md text-primary' : 'text-muted-foreground'
            }`}
          >
            <Dog className="w-6 h-6" />
            {t('photo.livestock')}
          </button>
        </motion.div>

        {/* Main Camera Button */}
        <motion.div
          className="flex flex-col items-center justify-center py-12 bg-card rounded-2xl shadow-xl border border-primary/20 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button 
            className="flex flex-col items-center group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-40 h-40 md:w-48 md:h-48 bg-primary rounded-full flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(19, 236, 91, 0)',
                  '0 0 40px 10px rgba(19, 236, 91, 0.3)',
                  '0 0 0 0 rgba(19, 236, 91, 0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Camera className="w-20 h-20 md:w-24 md:h-24 text-primary-foreground" />
            </motion.div>
            <span className="mt-6 text-2xl font-bold">{t('photo.take')}</span>
            <span className="text-muted-foreground">Tap to start camera</span>
          </motion.button>
        </motion.div>

        {/* Photo Guide */}
        <div className="max-w-md mx-auto mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-primary">💡</span>
            How to take a good photo
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.title}
                className="bg-card p-4 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className={`w-12 h-12 ${guide.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <guide.icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm">{guide.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{guide.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <motion.button
            className="flex flex-col items-center gap-3 p-6 bg-primary text-primary-foreground rounded-2xl shadow-lg"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Phone className="w-10 h-10" />
            <span className="font-bold">Call Doctor</span>
          </motion.button>
          <motion.button
            className="flex flex-col items-center gap-3 p-6 bg-card border-2 border-border rounded-2xl shadow-lg"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <BookOpen className="w-10 h-10 text-primary" />
            <span className="font-bold">First Aid Steps</span>
          </motion.button>
        </div>
      </div>
    </Layout>
  );
};

export default PhotoHelp;