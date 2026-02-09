import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  gradient?: string;
  variant?: 'default' | 'primary' | 'emergency';
}

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  gradient = 'from-primary to-secondary',
  variant = 'default' 
}: ServiceCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        group service-card w-full aspect-square p-6 md:p-8
        ${variant === 'emergency' ? 'border-2 border-destructive/30 bg-destructive/5' : ''}
      `}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <div 
        className={`
          w-20 h-20 md:w-24 md:h-24 rounded-3xl 
          flex items-center justify-center mb-5
          bg-gradient-to-br ${gradient}
          shadow-lg shadow-secondary/20
          transition-all duration-300 
          group-hover:scale-110 group-hover:rotate-3
          group-hover:shadow-xl group-hover:shadow-secondary/30
        `}
      >
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
      </div>
      <span className="text-lg md:text-xl font-bold text-center leading-tight mb-1.5 block">
        {title}
      </span>
      <span className="text-sm text-muted-foreground block">
        {description}
      </span>
    </motion.button>
  );
};

export default ServiceCard;