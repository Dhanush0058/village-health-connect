import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePhotoAnalysis } from '@/hooks/usePhotoAnalysis';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Upload, User, Dog, Sun, Focus, ZoomIn, AlertTriangle, Volume2, VolumeX, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const PhotoHelp = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { analyzePhoto, isAnalyzing, result, error, clearResult } = usePhotoAnalysis();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [mode, setMode] = useState<'human' | 'livestock'>('human');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      await analyzePhoto(base64, mode);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleNewScan = () => {
    setPreviewUrl(null);
    clearResult();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const guides = [
    { icon: Sun, label: t('photo.guide.light'), color: 'text-warning' },
    { icon: Focus, label: t('photo.guide.focus'), color: 'text-secondary' },
    { icon: ZoomIn, label: t('photo.guide.close'), color: 'text-primary' },
  ];

  return (
    <Layout showDisclaimer={false}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('photo.title')}</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1.5 glass-card rounded-full mb-8 max-w-md mx-auto">
          <button
            onClick={() => setMode('human')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all
              ${mode === 'human' 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                : 'text-muted-foreground'
              }
            `}
          >
            <User className="w-5 h-5" />
            <span>{t('photo.human')}</span>
          </button>
          <button
            onClick={() => setMode('livestock')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all
              ${mode === 'livestock' 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                : 'text-muted-foreground'
              }
            `}
          >
            <Dog className="w-5 h-5" />
            <span>{t('photo.livestock')}</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!result && !previewUrl ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Camera Button */}
              <div 
                onClick={handleCapture}
                className="glass-card p-12 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:shadow-secondary/20 transition-all max-w-md mx-auto mb-8"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-secondary/30 mb-6 transition-transform hover:scale-105">
                  <Camera className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
                <span className="text-xl font-bold mb-2">{t('photo.take')}</span>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Upload className="w-4 h-4" />
                  <span>Tap to start camera or upload</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Photo Guides */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {guides.map((guide) => (
                  <div 
                    key={guide.label}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center text-center"
                  >
                    <div className={`w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mb-3 ${guide.color}`}>
                      <guide.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">{guide.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              {previewUrl && (
                <div className="w-48 h-48 mx-auto mb-8 rounded-3xl overflow-hidden shadow-xl">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="glass-card p-8 rounded-3xl max-w-md mx-auto">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-secondary" />
                <p className="text-lg font-semibold">{t('photo.analyzing')}</p>
                <p className="text-muted-foreground mt-2">Please wait while our AI analyzes your photo...</p>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              {previewUrl && (
                <div className="w-full max-w-md mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl">
                  <img src={previewUrl} alt="Analyzed" className="w-full h-auto" />
                </div>
              )}

              {/* Urgency Banner */}
              {result.urgency === 'emergency' && (
                <div className="bg-destructive text-white p-4 rounded-2xl flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Seek Immediate Medical Attention</p>
                    <p className="text-sm opacity-90">This may require emergency care</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/emergency')}
                    variant="secondary"
                    className="ml-auto rounded-full"
                  >
                    Emergency
                  </Button>
                </div>
              )}

              {/* Analysis Result */}
              <div className="glass-card p-6 rounded-3xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{t('photo.result')}</h2>
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

              {/* Disclaimer */}
              <div className="glass-card p-4 rounded-2xl bg-warning/10 border border-warning/30 mb-6">
                <p className="text-sm text-center text-muted-foreground">
                  {result.disclaimer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleNewScan}
                  variant="outline"
                  className="flex-1 rounded-full h-14"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  New Scan
                </Button>
                <Button
                  onClick={() => navigate('/doctor')}
                  className="flex-1 rounded-full h-14 bg-gradient-to-r from-primary to-secondary"
                >
                  Talk to Doctor
                </Button>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="glass-card p-8 rounded-3xl max-w-md mx-auto">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                <p className="text-lg font-semibold text-destructive">{error}</p>
                <Button onClick={handleNewScan} className="mt-6 rounded-full">
                  {t('retry')}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default PhotoHelp;