import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePhotoAnalysis } from '@/hooks/usePhotoAnalysis';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Mic, MicOff, MapPin, Store, Building, ChevronRight, Phone, User, Dog, Loader2, Volume2, VolumeX, X, Navigation, RefreshCw, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '@/types/speech-recognition.d';

interface PickupPoint {
  name: string;
  distance: string;
  status: string;
  icon: typeof Store;
  lat?: number;
  lng?: number;
}

const defaultPickupPoints: PickupPoint[] = [
  { name: 'Village Pharmacy', distance: 'Nearby', status: 'Open now', icon: Store },
  { name: 'Health Center Pharmacy', distance: 'Medium', status: 'Closes 6 PM', icon: Building },
  { name: 'District Hospital Pharmacy', distance: 'Further', status: 'Open 24/7', icon: Building },
];

const MedicineDelivery = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'human' | 'livestock'>('human');
  const [showPrescriptionResult, setShowPrescriptionResult] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>(defaultPickupPoints);
  const [hasLocation, setHasLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { analyzePhoto, isAnalyzing, result, error, clearResult } = usePhotoAnalysis();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition>> | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      const langMap: Record<string, string> = {
        en: 'en-US', hi: 'hi-IN', sw: 'sw-KE', fr: 'fr-FR', es: 'es-ES',
        ar: 'ar-SA', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN',
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setRecordedText(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }

    return () => { recognitionRef.current?.abort(); };
  }, [language]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      setShowPrescriptionResult(true);
      await analyzePhoto(base64, mode === 'livestock' ? 'livestock' : 'human');
    };
    reader.readAsDataURL(file);
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setRecordedText('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const closeResult = () => {
    setPreviewUrl(null);
    clearResult();
    setShowPrescriptionResult(false);
    setRecordedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const requestLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setHasLocation(true);
          setIsLocating(false);
          setPickupPoints(prev => prev.map((p, i) => ({
            ...p,
            distance: `${(1 + i * 2.5).toFixed(1)} km`,
            lat: latitude + (Math.random() * 0.02 - 0.01),
            lng: longitude + (Math.random() * 0.02 - 0.01)
          })));
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const openDirections = (point: PickupPoint) => {
    if (point.lat && point.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/pharmacy+near+me`, '_blank');
    }
  };

  return (
    <Layout showDisclaimer={!showPrescriptionResult}>
      <div className="container mx-auto px-4 py-6">
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
          onClick={() => showPrescriptionResult ? closeResult() : navigate('/')}
          className="flex items-center gap-2 mb-6 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </Button>

        <AnimatePresence mode="wait">
          {showPrescriptionResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex justify-end mb-4">
                <Button variant="ghost" size="icon" onClick={closeResult} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {previewUrl && (
                <div className="w-full max-w-md mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl">
                  <img src={previewUrl} alt="Prescription" className="w-full h-auto" />
                </div>
              )}

              {isAnalyzing ? (
                <div className="glass-card p-8 rounded-3xl text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-secondary" />
                  <p className="text-lg font-semibold">Reading your prescription...</p>
                  <p className="text-muted-foreground mt-2">AI is analyzing the medicine details</p>
                </div>
              ) : result ? (
                <>
                  <div className="glass-card p-6 rounded-3xl mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Prescription Analysis</h2>
                      <button
                        onClick={() => isSpeaking ? stop() : speak(result.analysis, language)}
                        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                      >
                        {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        <span className="text-sm">{t('speak')}</span>
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{result.analysis}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-2xl bg-warning/10 border border-warning/30 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{result.disclaimer}</p>
                    </div>
                  </div>

                  {/* Nearby Pharmacies */}
                  <div className="glass-card p-6 rounded-3xl">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-secondary" />
                      Nearby Pharmacies
                    </h3>
                    
                    {!hasLocation && (
                      <Button
                        onClick={requestLocation}
                        disabled={isLocating}
                        className="w-full mb-4 rounded-full bg-gradient-to-r from-primary to-secondary"
                      >
                        {isLocating ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <MapPin className="w-5 h-5 mr-2" />
                        )}
                        {isLocating ? 'Finding...' : 'Enable Location'}
                      </Button>
                    )}

                    <div className="space-y-3">
                      {pickupPoints.map((point, index) => (
                        <motion.button
                          key={point.name}
                          onClick={() => openDirections(point)}
                          className="w-full flex items-center justify-between p-4 glass-card rounded-2xl hover:shadow-lg transition-all"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                              <point.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold">{point.name}</h4>
                              <p className="text-sm text-muted-foreground">{point.distance} • {point.status}</p>
                            </div>
                          </div>
                          <Navigation className="w-5 h-5 text-secondary" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button onClick={closeResult} variant="outline" className="flex-1 rounded-full h-14">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      New Upload
                    </Button>
                    <Button
                      onClick={() => navigate('/doctor')}
                      className="flex-1 rounded-full h-14 bg-gradient-to-r from-primary to-secondary"
                    >
                      Talk to Doctor
                    </Button>
                  </div>
                </>
              ) : error ? (
                <div className="glass-card p-8 rounded-3xl text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                  <p className="text-lg font-semibold text-destructive">{error}</p>
                  <Button onClick={closeResult} className="mt-6 rounded-full">{t('retry')}</Button>
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Title */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('medicine.title')}</h1>
              </motion.div>

              {/* Mode Toggle */}
              <motion.div 
                className="flex p-1.5 glass-card rounded-full mb-8 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={() => setMode('human')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${
                    mode === 'human' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-muted-foreground'
                  }`}
                >
                  <User className="w-5 h-5" />
                  For Humans
                </button>
                <button
                  onClick={() => setMode('livestock')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${
                    mode === 'livestock' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-muted-foreground'
                  }`}
                >
                  <Dog className="w-5 h-5" />
                  For Livestock
                </button>
              </motion.div>

              {/* Upload Prescription */}
              <motion.button
                onClick={openCamera}
                className="w-full flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-primary to-secondary text-white rounded-3xl shadow-xl mb-6 max-w-md mx-auto"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Camera className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{t('medicine.upload')}</h3>
                  <p className="text-sm opacity-80 mt-1">Take a picture of your prescription</p>
                </div>
              </motion.button>

              {/* Voice Message */}
              <motion.button
                onClick={toggleRecording}
                className={`w-full flex items-center justify-center gap-4 h-20 glass-card border-2 rounded-full mb-2 max-w-md mx-auto transition-all ${
                  isRecording ? 'border-destructive bg-destructive/10' : 'border-secondary hover:border-secondary/80'
                }`}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-8 h-8 text-destructive" />
                    <span className="text-xl font-bold text-destructive">Tap to Stop</span>
                    <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 text-secondary" />
                    <span className="text-xl font-bold">{t('medicine.voice')}</span>
                  </>
                )}
              </motion.button>
              <p className="text-center text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                {recordedText || 'Describe the medicine you need if you cannot read'}
              </p>

              {/* Location Button */}
              {!hasLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-md mx-auto mb-8"
                >
                  <Button
                    onClick={requestLocation}
                    disabled={isLocating}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-secondary"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Finding pharmacies...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 mr-2" />
                        Find Nearby Pharmacies
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Nearby Pickup Points */}
              <motion.div 
                className="max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    {t('medicine.pickup')}
                  </h2>
                  {hasLocation && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-sm text-muted-foreground">Location on</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {pickupPoints.map((point, index) => (
                    <motion.button
                      key={point.name}
                      onClick={() => openDirections(point)}
                      className="w-full flex items-center justify-between p-4 glass-card rounded-2xl hover:shadow-lg transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-secondary">
                          <point.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold">{point.name}</h4>
                          <p className="text-sm text-muted-foreground">{point.distance} • {point.status}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Help Hotline */}
              <motion.a 
                href="tel:0800123456"
                className="block mt-8 p-6 glass-card rounded-3xl text-center max-w-md mx-auto border-2 border-secondary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Phone className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Need help? Call for free at</p>
                <p className="text-2xl font-bold text-secondary">0800 123 456</p>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default MedicineDelivery;
