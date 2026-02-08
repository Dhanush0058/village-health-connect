import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Video, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DoctorInteractionModal } from '@/components/DoctorInteractionModal';

const DoctorConsult = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [interactionType, setInteractionType] = useState<'chat' | 'audio' | 'video' | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'audio') setInteractionType('audio');
    else if (mode === 'chat') setInteractionType('chat');
    else if (mode === 'video') setInteractionType('video');
  }, [searchParams]);

  const consultOptions = [
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Check symptoms instantly',
      color: 'bg-health-blue',
      action: () => setInteractionType('chat'),
    },
    {
      icon: Phone,
      title: 'AI Voice Support',
      description: 'Explain in your language',
      color: 'bg-health-orange',
      action: () => setInteractionType('audio'),
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 big-button bg-secondary"
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </motion.button>

        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-3xl font-bold mb-2">AI Health Assistant</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span>Available 24/7 • Instant Reply</span>
          </div>
        </motion.div>

        {/* Consultation Options */}
        <div className="grid gap-4 max-w-md mx-auto">
          {consultOptions.map((option, index) => (
            <motion.button
              key={option.title}
              className="flex items-center gap-6 p-6 bg-card rounded-2xl border-4 border-transparent hover:border-primary shadow-lg transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={option.action}
            >
              <div className={`w-20 h-20 ${option.color} rounded-full flex items-center justify-center shadow-lg`}>
                <option.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold">{option.title}</h3>
                <p className="text-muted-foreground">{option.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* AI Features Preview */}
        <motion.div
          className="mt-10 p-6 bg-health-green-light rounded-2xl max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="font-bold">AI Active & Ready to Helper</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Our AI uses advanced symptom checking to provide immediate guidance in your local language.
          </p>
        </motion.div>
        <DoctorInteractionModal
          isOpen={!!interactionType}
          onClose={() => setInteractionType(null)}
          type={interactionType}
        />
      </div>
    </Layout>
  );
};

export default DoctorConsult;