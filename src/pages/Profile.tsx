import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Heart, Activity, Calendar, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { icon: Activity, label: 'Health Checks', value: '12', color: 'text-secondary' },
    { icon: Calendar, label: 'Consultations', value: '5', color: 'text-primary' },
    { icon: Award, label: 'Days Active', value: '30', color: 'text-teal-medical' },
  ];

  const menuItems = [
    { icon: Bell, label: 'Notifications', path: '/alerts' },
    { icon: Shield, label: 'Privacy & Security', path: '#' },
    { icon: Settings, label: 'Settings', path: '#' },
    { icon: HelpCircle, label: 'Help & Support', path: '#' },
  ];

  return (
    <Layout showDisclaimer={false}>
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Profile Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-secondary/30">
            <User className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Guest User</h1>
          <p className="text-muted-foreground">Welcome to RuralCare Connect</p>
        </motion.div>

        {/* Health Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="glass-card p-4 rounded-2xl text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="glass-card p-4 rounded-3xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Daily Health Check</h3>
              <p className="text-sm text-muted-foreground">Track your wellness journey</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div 
          className="glass-card rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-surface-sunken transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <span className="flex-1 font-medium text-left">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Sign Out */}
        <motion.button
          className="w-full flex items-center justify-center gap-3 p-4 mt-6 glass-card rounded-2xl text-destructive hover:bg-destructive/10 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold">Sign Out</span>
        </motion.button>

        {/* App Version */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          RuralCare Connect v1.0.0
        </p>
      </div>
    </Layout>
  );
};

export default Profile;
