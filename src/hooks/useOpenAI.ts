import { useState, useCallback } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  total_cost: number;
}

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenAI = useCallback(async (endpoint: string, data: any) => {
    const userKey = sessionStorage.getItem('openai_key');
    if (!userKey) {
      throw new Error('Please provide an OpenAI API key');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userKey}`,
        },
        body: JSON.stringify({ endpoint, ...data }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch from OpenAI');
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chat = useCallback(async (messages: Message[]) => {
    return fetchOpenAI('chat', {
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      stream: true,
    });
  }, [fetchOpenAI]);

  const summarize = useCallback(async (text: string) => {
    return chat([
      { role: 'system', content: 'You are a helpful assistant that summarizes text concisely.' },
      { role: 'user', content: `Please summarize this text: ${text}` },
    ]);
  }, [chat]);

  const translate = useCallback(async (text: string, toLang: string) => {
    return chat([
      { role: 'system', content: `You are a helpful translator. Translate the text to ${toLang}.` },
      { role: 'user', content: text },
    ]);
  }, [chat]);

  const brainstorm = useCallback(async (prompt: string) => {
    return chat([
      { role: 'system', content: 'You are a creative assistant that helps with brainstorming ideas.' },
      { role: 'user', content: prompt },
    ]);
  }, [chat]);

  const generateImage = useCallback(async (prompt: string) => {
    return fetchOpenAI('images', {
      prompt,
      n: 1,
      size: '1024x1024',
    });
  }, [fetchOpenAI]);

  const getUsageStats = useCallback(async (): Promise<UsageStats> => {
    return fetchOpenAI('usage', {});
  }, [fetchOpenAI]);

  return {
    chat,
    summarize,
    translate,
    brainstorm,
    generateImage,
    getUsageStats,
    isLoading,
    error,
  };
}
