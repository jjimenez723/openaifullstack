import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOpenAI } from '../hooks/useOpenAI';

const LANGUAGES = [
  'Arabic',
  'Chinese',
  'English',
  'French',
  'German',
  'Hindi',
  'Italian',
  'Japanese',
  'Korean',
  'Portuguese',
  'Russian',
  'Spanish',
];

export default function TranslationTab() {
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [translation, setTranslation] = useState('');
  const { translate, isLoading, error } = useOpenAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      const response = await translate(input, targetLang);
      setTranslation(response.choices[0].message.content);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Text to Translate
          </label>
          <textarea
            id="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter text to translate..."
          />
        </div>

        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Target Language
          </label>
          <select
            id="language"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </motion.button>
      </form>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {translation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-2 dark:text-white">Translation</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {translation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
