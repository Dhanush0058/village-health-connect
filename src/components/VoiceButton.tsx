import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VoiceButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/doctor')}
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-2xl shadow-secondary/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 10px 40px -10px rgba(31, 174, 155, 0.3)',
          '0 10px 40px -10px rgba(31, 174, 155, 0.6)',
          '0 10px 40px -10px rgba(31, 174, 155, 0.3)',
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <Mic className="w-8 h-8 md:w-10 md:h-10" />
      <span className="sr-only">Voice Help</span>
    </motion.button>
  );
};

export default VoiceButton;