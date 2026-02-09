import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, Calendar, Pill, Stethoscope, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  time: string;
  icon: typeof Bell;
  read: boolean;
}

const defaultAlerts: Alert[] = [
  {
    id: '1',
    type: 'info',
    title: 'Vaccination Reminder',
    message: 'Your livestock vaccination is due next week. Schedule an appointment with a vet.',
    time: '2 hours ago',
    icon: Calendar,
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Prescription Ready',
    message: 'Your medicine order is ready for pickup at Village Pharmacy.',
    time: '1 day ago',
    icon: Pill,
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Health Check Due',
    message: "It's been a month since your last health consultation. Book a follow-up.",
    time: '3 days ago',
    icon: Stethoscope,
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'New Feature Available',
    message: 'Try our new Photo Scan feature to get instant health guidance.',
    time: '1 week ago',
    icon: Info,
    read: true,
  },
];

const Alerts = () => {
  const { t, language } = useLanguage();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const handleSpeak = (alert: Alert) => {
    if (speakingId === alert.id && isSpeaking) {
      stop();
      setSpeakingId(null);
    } else {
      speak(`${alert.title}. ${alert.message}`, language);
      setSpeakingId(alert.id);
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const getTypeStyles = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      case 'success':
        return 'border-success/30 bg-success/5';
      default:
        return 'border-secondary/30 bg-secondary/5';
    }
  };

  const getIconStyles = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-warning text-white';
      case 'success':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <Layout showDisclaimer={false}>
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold">{t('nav.alerts')}</h1>
            <p className="text-muted-foreground text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="rounded-full"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-sunken flex items-center justify-center">
                  <Bell className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Notifications</h2>
                <p className="text-muted-foreground">You're all caught up! Check back later.</p>
              </motion.div>
            ) : (
              alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => markAsRead(alert.id)}
                  className={`glass-card p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${getTypeStyles(alert.type)} ${
                    !alert.read ? 'ring-2 ring-secondary/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconStyles(alert.type)}`}>
                      <alert.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold flex items-center gap-2">
                            {alert.title}
                            {!alert.read && (
                              <span className="w-2 h-2 rounded-full bg-secondary" />
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(alert);
                            }}
                          >
                            {speakingId === alert.id && isSpeaking ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Emergency Note */}
        <motion.div 
          className="mt-8 p-4 glass-card rounded-2xl border-2 border-destructive/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
            <p className="text-sm">
              <span className="font-bold text-destructive">Emergency?</span>{' '}
              <span className="text-muted-foreground">Call 999 or go to the nearest hospital immediately.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Alerts;
