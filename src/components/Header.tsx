import { useLanguage, languages } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, Globe, Dog } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { language, setIsLanguageModalOpen, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-primary rounded-full">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">GramHealth</h1>

          </button>

          {/* Navigation Toggles */}
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full border border-border/50">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium ${location.pathname !== '/animal'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Shield className="w-4 h-4" />
              <span>Human</span>
            </button>
            <button
              onClick={() => navigate('/animal')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium ${location.pathname === '/animal'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Dog className="w-4 h-4" />
              <span>Animal</span>
            </button>
          </div>

          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Language Switcher */}
            <motion.button
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">
                {languages.find(l => l.code === language)?.label || 'Language'}
              </span>
            </motion.button>

            {/* Emergency Button */}
            <motion.button
              onClick={() => navigate('/emergency')}
              className="emergency-button"
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 8px rgba(239, 68, 68, 0.2)', '0 0 0 0 rgba(239, 68, 68, 0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="hidden sm:inline">{t('emergency')}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;