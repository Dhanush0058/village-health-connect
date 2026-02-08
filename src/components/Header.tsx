import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { Heart, AlertTriangle, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t, isLoading } = useLanguage();
  const currentLang = languages.find(l => l.code === language);

  return (
    <header className="sticky top-0 z-50 w-full glass-card rounded-none border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight">{t('app.name')}</h1>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 rounded-full px-4 h-12 glass-card border-white/30"
                disabled={isLoading}
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">{currentLang?.flag} {currentLang?.short}</span>
                <span className="sm:hidden">{currentLang?.flag}</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card border-white/20">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`gap-3 py-3 cursor-pointer ${language === lang.code ? 'bg-secondary/20' : ''}`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Emergency Button */}
          {location.pathname !== '/emergency' && (
            <Button
              onClick={() => navigate('/emergency')}
              className="emergency-button rounded-full h-12 px-6"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">{t('emergency')}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;