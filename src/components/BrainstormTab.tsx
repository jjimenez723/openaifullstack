import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOpenAI } from '../hooks/useOpenAI';

export default function BrainstormTab() {
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState('');
  const { brainstorm, isLoading, error } = useOpenAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    try {
      const response = await brainstorm(prompt);
      setIdeas(response.choices[0].message.content);
    } catch (error) {
      console.error('Brainstorm error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Brainstorming Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter your brainstorming prompt..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {isLoading ? 'Brainstorming...' : 'Generate Ideas'}
        </motion.button>
      </form>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {ideas && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-2 dark:text-white">Ideas</h3>
          <div className="prose dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: ideas.replace(/\n/g, '<br>') }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
