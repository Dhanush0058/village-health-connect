import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'emergency';
}

const ServiceCard = ({ icon: Icon, title, description, onClick, variant = 'default' }: ServiceCardProps) => {
  const variants = {
    default: {
      container: 'bg-card hover:border-primary',
      iconBg: 'bg-health-green-light',
      iconColor: 'text-primary',
    },
    primary: {
      container: 'bg-primary hover:bg-primary/90 border-primary',
      iconBg: 'bg-primary-foreground/20',
      iconColor: 'text-primary-foreground',
    },
    emergency: {
      container: 'bg-emergency-light hover:border-destructive border-destructive/30',
      iconBg: 'bg-destructive',
      iconColor: 'text-destructive-foreground',
    },
  };

  const style = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      className={`service-card group w-full aspect-square ${style.container}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`service-icon ${style.iconBg}`}>
        <Icon className={`w-12 h-12 ${style.iconColor}`} strokeWidth={1.5} />
      </div>
      <span className={`text-lg font-bold text-center leading-tight ${variant === 'primary' ? 'text-primary-foreground' : ''}`}>
        {title}
      </span>
      <span className={`text-sm mt-1 ${variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
        {description}
      </span>
    </motion.button>
  );
};

export default ServiceCard;