
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Import dynamically to avoid circular dependencies if any, though likely not needed here but good practice
      const { getGeminiResponse } = await import('../services/gemini');

      // Prepare history for the service
      // The service expects { role: 'user' | 'assistant', content: string }
      // We pass the current messages + the new user message
      // Note: 'system' role is handled internally by the service for now or we can adapt if needed
      const history = [...messages, userMessage].map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      }));

      const responseText = await getGeminiResponse(content, history, `User Language: ${language}`);

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    // Gemini SDK doesn't support aborting mid-flight easily in this simple implementation
    // We just set loading to false to "stop" the UI
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    stopGeneration,
  };
};
