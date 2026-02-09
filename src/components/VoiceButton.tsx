import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/types/speech-recognition.d';

const VoiceButton = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition>> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      const langMap: Record<string, string> = {
        en: 'en-US', hi: 'hi-IN', sw: 'sw-KE', fr: 'fr-FR', es: 'es-ES',
        ar: 'ar-SA', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN',
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
          // Navigate to doctor chat with the transcript
          timeoutRef.current = setTimeout(() => {
            navigate('/doctor', { state: { initialMessage: transcript } });
            setShowPopup(false);
            setTranscript('');
          }, 1000);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    return () => {
      recognitionRef.current?.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [language, navigate, transcript]);

  const handleClick = () => {
    if (!recognitionRef.current) {
      // No speech recognition available, just navigate
      navigate('/doctor');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setShowPopup(true);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started or error
        navigate('/doctor');
      }
    }
  };

  const handleClose = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setShowPopup(false);
    setTranscript('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <>
      {/* Voice Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-36 md:bottom-32 left-4 right-4 md:left-auto md:right-8 md:w-80 z-50 glass-card p-6 rounded-3xl shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isListening ? 'bg-destructive animate-pulse' : 'bg-secondary'}`}>
                  {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-bold">{isListening ? t('doctor.listening') : 'Voice Help'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isListening ? 'Speak now...' : 'Tap to start'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-surface-sunken transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {transcript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 glass-card rounded-2xl"
              >
                <p className="text-sm italic">"{transcript}"</p>
              </motion.div>
            )}

            {isListening && (
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-secondary rounded-full"
                    animate={{
                      height: [12, 24, 12],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={handleClick}
        className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full shadow-2xl ${
          isListening 
            ? 'bg-destructive shadow-destructive/30' 
            : 'bg-gradient-to-br from-primary to-secondary shadow-secondary/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? {
          scale: [1, 1.1, 1],
        } : {
          boxShadow: [
            '0 10px 40px -10px hsl(var(--secondary) / 0.3)',
            '0 10px 40px -10px hsl(var(--secondary) / 0.6)',
            '0 10px 40px -10px hsl(var(--secondary) / 0.3)',
          ],
        }}
        transition={{ duration: isListening ? 0.5 : 2.5, repeat: Infinity }}
      >
        {isListening ? (
          <MicOff className="w-8 h-8 md:w-10 md:h-10 text-white" />
        ) : (
          <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />
        )}
        <span className="sr-only">Voice Help</span>
      </motion.button>
    </>
  );
};

export default VoiceButton;
