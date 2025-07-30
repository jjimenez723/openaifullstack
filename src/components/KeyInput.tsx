import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface KeyInputProps {
  onKeySet: (key: string) => void;
}

export default function KeyInput({ onKeySet }: KeyInputProps) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = sessionStorage.getItem('openai_key');
    if (savedKey) {
      setKey(savedKey);
      onKeySet(savedKey);
    }
  }, [onKeySet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.startsWith('sk-') && key.length > 20) {
      sessionStorage.setItem('openai_key', key);
      onKeySet(key);
      toast.success('API key saved successfully');
    } else {
      toast.error('Please enter a valid OpenAI API key');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            OpenAI API Key
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showKey ? 'text' : 'password'}
              id="apiKey"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="sk-..."
              aria-label="OpenAI API Key"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Save API Key
        </motion.button>
      </form>
    </motion.div>
  );
}
