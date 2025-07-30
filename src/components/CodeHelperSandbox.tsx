import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOpenAI } from '../hooks/useOpenAI';

interface ResultPanel {
  type: 'explanation' | 'tests' | 'refactor';
  content: string;
}

export default function CodeHelperSandbox() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState<ResultPanel[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { chat, isLoading } = useOpenAI();

  const analyzeCode = async (type: 'explanation' | 'tests' | 'refactor') => {
    if (!code.trim() || isLoading) return;

    let prompt = '';
    switch (type) {
      case 'explanation':
        prompt = `Please explain this code in detail:\n\n${code}`;
        break;
      case 'tests':
        prompt = `Generate comprehensive unit tests for this code:\n\n${code}`;
        break;
      case 'refactor':
        prompt = `Suggest ways to improve and refactor this code. Include code examples:\n\n${code}`;
        break;
    }

    try {
      const response = await chat([
        { role: 'system', content: 'You are an expert code analyzer.' },
        { role: 'user', content: prompt },
      ]);

      const newResult: ResultPanel = {
        type,
        content: response.choices[0].message.content,
      };

      setResults(prev => [newResult, ...prev]);
      setExpanded(type);
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Code Snippet
        </label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="Paste your code here..."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <motion.button
          onClick={() => analyzeCode('explanation')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Explain Code
        </motion.button>
        <motion.button
          onClick={() => analyzeCode('tests')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-400"
        >
          Generate Tests
        </motion.button>
        <motion.button
          onClick={() => analyzeCode('refactor')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-purple-500 dark:hover:bg-purple-400"
        >
          Suggest Refactors
        </motion.button>
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === result.type ? null : result.type)}
                className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
              >
                <span className="font-medium capitalize">{result.type}</span>
                <span>{expanded === result.type ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {expanded === result.type && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-white dark:bg-gray-900"
                  >
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {result.content}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
