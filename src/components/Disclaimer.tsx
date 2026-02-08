import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full glass-card py-6 border-t border-white/20 mt-auto rounded-none">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2 text-warning mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">Important</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('disclaimer')}
        </p>
      </div>
    </footer>
  );
};

export default Disclaimer;