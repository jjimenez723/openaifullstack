import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useOpenAI } from '../hooks/useOpenAI';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'API Usage by Endpoint',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Tokens Used',
      },
    },
  },
};

export default function UsageDashboard() {
  const { getUsageStats, isLoading, error } = useOpenAI();
  const [usageData, setUsageData] = useState<any>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const stats = await getUsageStats();
        const processedData = processUsageData(stats);
        setUsageData(processedData);
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      }
    };

    fetchUsage();
  }, [getUsageStats]);

  const processUsageData = (stats: any) => {
    const data = {
      labels: ['Completion', 'Prompt', 'Total'],
      datasets: [
        {
          label: 'Token Usage',
          data: [
            stats.completion_tokens || 0,
            stats.prompt_tokens || 0,
            stats.total_tokens || 0,
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
    return data;
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading usage data: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Usage Statistics</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      ) : usageData ? (
        <div className="h-64">
          <Bar options={options} data={usageData} />
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No usage data available
        </p>
      )}
      {usageData && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold dark:text-white">Completion Tokens</h3>
            <p className="text-2xl dark:text-white">
              {usageData.datasets[0].data[0].toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-teal-100 dark:bg-teal-900 rounded-lg">
            <h3 className="font-semibold dark:text-white">Prompt Tokens</h3>
            <p className="text-2xl dark:text-white">
              {usageData.datasets[0].data[1].toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <h3 className="font-semibold dark:text-white">Total Tokens</h3>
            <p className="text-2xl dark:text-white">
              {usageData.datasets[0].data[2].toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
