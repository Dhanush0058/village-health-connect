import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAIChat } from '@/hooks/useAIChat';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { usePhotoAnalysis } from '@/hooks/usePhotoAnalysis';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Video, Syringe, AlertTriangle, Camera, Send, Mic, MicOff, Volume2, VolumeX, Loader2, MessageCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '@/types/speech-recognition.d';

const animals = [
  { id: 'cow', emoji: '🐄', labelKey: 'animal.cow' },
  { id: 'goat', emoji: '🐐', labelKey: 'animal.goat' },
  { id: 'chicken', emoji: '🐔', labelKey: 'animal.chicken' },
  { id: 'sheep', emoji: '🐑', labelKey: 'animal.sheep' },
];

const AnimalHealth = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [showVetChat, setShowVetChat] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { analyzePhoto, isAnalyzing, result: photoResult, clearResult } = usePhotoAnalysis();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition>> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      const langMap: Record<string, string> = {
        en: 'en-US', hi: 'hi-IN', sw: 'sw-KE', fr: 'fr-FR', es: 'es-ES',
        ar: 'ar-SA', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN',
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => { recognitionRef.current?.abort(); };
  }, [language]);

  const handleSend = () => {
    if (!input.trim()) return;
    const prefix = selectedAnimal ? `[Asking about my ${selectedAnimal}]: ` : '[Livestock health question]: ';
    sendMessage(prefix + input);
    setInput('');
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
    isSpeaking ? stop() : speak(text, language);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      await analyzePhoto(base64, 'livestock');
    };
    reader.readAsDataURL(file);
  };

  const openPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const closePhotoResult = () => {
    setPreviewUrl(null);
    clearResult();
    setShowPhotoUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startVetChat = () => {
    clearChat();
    setShowVetChat(true);
    if (selectedAnimal) {
      sendMessage(`Hello, I need help with my ${selectedAnimal}. Can you provide veterinary advice?`);
    }
  };

  return (
    <Layout showDisclaimer={!showVetChat}>
      <div className="container mx-auto px-4 py-6 h-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => showVetChat ? setShowVetChat(false) : navigate('/')}
          className="flex items-center gap-2 mb-6 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </Button>

        <AnimatePresence mode="wait">
          {showVetChat ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-[calc(100vh-220px)] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-2xl">{animals.find(a => a.id === selectedAnimal)?.emoji || '🐾'}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t('animal.vet')}</h2>
                  <p className="text-sm text-muted-foreground">
                    Talking about your {selectedAnimal || 'animal'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
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
                        <p>{message.content.replace(/^\[.*?\]:\s*/, '')}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="chat-bubble chat-bubble-ai flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                      <span className="text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="glass-card p-3 rounded-full flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  className={`rounded-full ${isListening ? 'bg-destructive text-white animate-pulse' : ''}`}
                  disabled={!recognitionRef.current}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe the animal's symptoms..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-gradient-to-r from-primary to-secondary"
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : previewUrl || photoResult ? (
            <motion.div
              key="photo-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex justify-end mb-4">
                <Button variant="ghost" size="icon" onClick={closePhotoResult} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {previewUrl && (
                <div className="w-full max-w-md mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl">
                  <img src={previewUrl} alt="Analyzed" className="w-full h-auto" />
                </div>
              )}

              {isAnalyzing ? (
                <div className="glass-card p-8 rounded-3xl text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-secondary" />
                  <p className="text-lg font-semibold">{t('photo.analyzing')}</p>
                </div>
              ) : photoResult && (
                <>
                  {photoResult.urgency === 'emergency' && (
                    <div className="bg-destructive text-white p-4 rounded-2xl flex items-center gap-3 mb-6">
                      <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Seek Immediate Veterinary Attention</p>
                        <p className="text-sm opacity-90">This may require emergency care</p>
                      </div>
                    </div>
                  )}

                  <div className="glass-card p-6 rounded-3xl mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">{t('photo.result')}</h2>
                      <button
                        onClick={() => handleSpeak(photoResult.analysis)}
                        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                      >
                        {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        <span className="text-sm">{t('speak')}</span>
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{photoResult.analysis}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={closePhotoResult} variant="outline" className="flex-1 rounded-full h-14">
                      New Scan
                    </Button>
                    <Button onClick={startVetChat} className="flex-1 rounded-full h-14 bg-gradient-to-r from-primary to-secondary">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Talk to Vet
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              {/* Title */}
              <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('animal.title')}</h1>
                <p className="text-lg text-muted-foreground">{t('animal.select')}</p>
              </motion.div>

              {/* Photo Upload CTA */}
              <motion.button
                onClick={openPhotoUpload}
                className="w-full flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-primary to-secondary text-white rounded-3xl shadow-xl mb-8 max-w-lg mx-auto"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Camera className="w-12 h-12" />
                <div className="text-left">
                  <span className="block text-xl font-bold">Show Us The Problem</span>
                  <span className="text-sm opacity-90">Upload photo of injury or condition</span>
                </div>
              </motion.button>

              {/* Animal Selection Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                {animals.map((animal, index) => (
                  <motion.button
                    key={animal.id}
                    onClick={() => setSelectedAnimal(animal.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-4 glass-card transition-all ${
                      selectedAnimal === animal.id
                        ? 'border-secondary shadow-lg shadow-secondary/20'
                        : 'border-transparent hover:border-secondary/30'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-6xl">{animal.emoji}</span>
                    <span className="text-xl font-bold">{t(animal.labelKey)}</span>
                  </motion.button>
                ))}
              </div>

              {/* Selected Animal Actions */}
              {selectedAnimal && (
                <motion.div
                  className="glass-card rounded-3xl p-6 max-w-lg mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                    <h2 className="text-xl font-bold">
                      What do you need for your{' '}
                      <span className="text-secondary">{t(`animal.${selectedAnimal}`)}</span>?
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={startVetChat}
                      className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:shadow-lg transition-all"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                        <Video className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-lg">{t('animal.vet')}</h3>
                        <p className="text-sm text-muted-foreground">Chat with AI vet assistant</p>
                      </div>
                    </button>

                    <button className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:shadow-lg transition-all">
                      <div className="w-14 h-14 bg-teal-medical rounded-2xl flex items-center justify-center shadow-lg">
                        <Syringe className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-lg">{t('animal.vaccine')}</h3>
                        <p className="text-sm text-muted-foreground">Vaccination schedule</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/emergency')}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 border-destructive/30 hover:border-destructive bg-destructive/5 transition-all"
                    >
                      <div className="w-14 h-14 bg-destructive rounded-2xl flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-lg text-destructive">{t('animal.urgent')}</h3>
                        <p className="text-sm text-destructive/80">Animal is very sick or hurt</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default AnimalHealth;
