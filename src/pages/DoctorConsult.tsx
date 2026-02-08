import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAIChat } from '@/hooks/useAIChat';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, Loader2, MessageCircle, Video, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import '@/types/speech-recognition.d';

const DoctorConsult = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'video'>('chat');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition>> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      const langMap: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        sw: 'sw-KE',
        fr: 'fr-FR',
        es: 'es-ES',
        ar: 'ar-SA',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, [language]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

  const tabs = [
    { id: 'chat', icon: MessageCircle, label: t('doctor.chat') },
    { id: 'voice', icon: Phone, label: t('doctor.audio') },
    { id: 'video', icon: Video, label: t('doctor.video') },
  ];

  return (
    <Layout showDisclaimer={false}>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-180px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{t('doctor.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('doctor.wait')}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 glass-card rounded-full mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'chat' | 'voice' | 'video')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                {language === 'en' 
                  ? "Hello! I'm your health assistant. How can I help you today?" 
                  : t('home.title')
                }
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    chat-bubble 
                    ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                  `}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {message.content && (
                        <button
                          onClick={() => handleSpeak(message.content)}
                          className="mt-2 flex items-center gap-1 text-xs text-secondary hover:text-primary transition-colors"
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span>{t('speak')}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="chat-bubble chat-bubble-ai flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                <span className="text-muted-foreground">Thinking...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" onClick={clearChat} className="mt-2">
                {t('retry')}
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="glass-card p-3 rounded-full flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className={`
              rounded-full transition-all
              ${isListening 
                ? 'bg-destructive text-white animate-pulse' 
                : 'hover:bg-secondary/20'
              }
            `}
            disabled={!recognitionRef.current}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('doctor.placeholder')}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base"
            disabled={isLoading}
          />

          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorConsult;