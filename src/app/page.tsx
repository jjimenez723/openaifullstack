'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import KeyInput from '../components/KeyInput';
import ChatInterface from '../components/ChatInterface';
import SummaryTab from '../components/SummaryTab';
import TranslationTab from '../components/TranslationTab';
import BrainstormTab from '../components/BrainstormTab';
import UsageDashboard from '../components/UsageDashboard';
import ImageGallery from '../components/ImageGallery';
import CodeHelperSandbox from '../components/CodeHelperSandbox';
import { Toaster } from 'react-hot-toast';
import { ApiKeyProvider } from '@/context/ApiKeyContext';

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Chat', component: ChatInterface },
    { name: 'Summary', component: SummaryTab },
    { name: 'Translation', component: TranslationTab },
    { name: 'Brainstorm', component: BrainstormTab },
    { name: 'Usage', component: UsageDashboard },
    { name: 'Images', component: ImageGallery },
    { name: 'Code Helper', component: CodeHelperSandbox },
  ];

  return (
    <ApiKeyProvider value={{ apiKey, setApiKey }}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Toaster position="top-right" />
        
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            OpenAI Portfolio App
          </h1>

          {!apiKey ? (
            <div className="max-w-md mx-auto">
              <KeyInput onKeySet={setApiKey} />
            </div>
          ) : (
            <Tab.Group
              selectedIndex={selectedTab}
              onChange={setSelectedTab}
            >
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                      ${
                        selected
                          ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 shadow'
                          : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'
                      }`
                    }
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="mt-2">
                <AnimatePresence mode="wait">
                  {tabs.map((tab, idx) => (
                    <Tab.Panel
                      key={tab.name}
                      static
                      className={selectedTab === idx ? 'block' : 'hidden'}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                      >
                        {<tab.component />}
                      </motion.div>
                    </Tab.Panel>
                  ))}
                </AnimatePresence>
              </Tab.Panels>
            </Tab.Group>
          )}
        </main>
      </div>
    </ApiKeyProvider>
  );
}
