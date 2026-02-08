import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: User, label: t('nav.me'), path: '/profile' },
    { icon: Bell, label: t('nav.alerts'), path: '/alerts' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-t border-white/20">
      <div className="flex justify-around py-3 px-4 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bottom-nav-item min-w-[64px] ${
                isActive ? 'text-secondary' : 'text-muted-foreground'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon 
                className={`w-7 h-7 ${isActive ? 'drop-shadow-lg' : ''}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="text-xs font-bold">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;