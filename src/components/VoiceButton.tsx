import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VoiceButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary text-primary-foreground rounded-full shadow-2xl"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(19, 236, 91, 0)',
          '0 0 0 12px rgba(19, 236, 91, 0.15)',
          '0 0 0 0 rgba(19, 236, 91, 0)',
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
      onClick={() => navigate('/doctor?mode=audio')}
    >
      <Mic className="w-8 h-8 md:w-10 md:h-10" />
      <span className="sr-only">Voice Help</span>
    </motion.button>
  );
};


export default VoiceButton;