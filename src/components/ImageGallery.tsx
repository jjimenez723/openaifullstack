import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOpenAI } from '../hooks/useOpenAI';
import toast from 'react-hot-toast';

interface GeneratedImage {
  prompt: string;
  url: string;
  timestamp: number;
}

export default function ImageGallery() {
  const { generateImage, isLoading } = useOpenAI();
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [filter, setFilter] = useState<'none' | 'grayscale' | 'sepia'>('none');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    try {
      const result = await generateImage(prompt);
      const newImage: GeneratedImage = {
        prompt,
        url: result.data[0].url,
        timestamp: Date.now(),
      };
      setImages(prev => [newImage, ...prev]);
      setPrompt('');
      toast.success('Image generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate image');
    }
  };

  const getFilterStyle = useCallback((filterType: string) => {
    switch (filterType) {
      case 'grayscale':
        return 'filter grayscale';
      case 'sepia':
        return 'filter sepia';
      default:
        return '';
    }
  }, []);

  return (
    <div className="space-y-6">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Image Prompt
          </label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Describe the image you want to generate..."
          />
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </motion.button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image.timestamp}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <img
                src={image.url}
                alt={image.prompt}
                className={`w-full h-48 object-cover rounded-lg cursor-pointer ${getFilterStyle(
                  filter
                )}`}
                onClick={() => setSelectedImage(image)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 text-sm text-center p-2">
                  {image.prompt}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className={`w-full max-h-[70vh] object-contain ${getFilterStyle(
                  filter
                )}`}
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedImage.prompt}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('none')}
                    className={`px-3 py-1 rounded ${
                      filter === 'none'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    None
                  </button>
                  <button
                    onClick={() => setFilter('grayscale')}
                    className={`px-3 py-1 rounded ${
                      filter === 'grayscale'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    Grayscale
                  </button>
                  <button
                    onClick={() => setFilter('sepia')}
                    className={`px-3 py-1 rounded ${
                      filter === 'sepia'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    Sepia
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
