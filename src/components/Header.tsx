import { useLanguage, languages } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
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
            <h1 className="text-xl font-bold tracking-tight">{t('app.name')}</h1>
          </button>

          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-secondary p-1 rounded-full overflow-x-auto">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`language-pill whitespace-nowrap ${
                    language === lang.code ? 'language-pill-active' : 'hover:bg-card/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden sm:inline">{lang.label}</span>
                  <span className="sm:hidden">{lang.short}</span>
                </motion.button>
              ))}
            </div>

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