import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalysisResult {
  analysis: string;
  urgency: 'emergency' | 'medical' | 'low';
  disclaimer: string;
}

export const usePhotoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const analyzePhoto = useCallback(async (
    imageBase64: string, 
    type: 'human' | 'livestock' = 'human'
  ) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-photo', {
        body: { 
          imageBase64: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          type,
          language,
        }
      });

      if (fnError) throw fnError;
      setResult(data);
      return data;
    } catch (err) {
      console.error('Photo analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze photo');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [language]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyzePhoto,
    isAnalyzing,
    result,
    error,
    clearResult,
  };
};
