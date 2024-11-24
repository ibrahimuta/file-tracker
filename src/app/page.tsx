'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Timeline } from '@/components/timeline/timeline';
import { stages } from '@/lib/utils';
import { DataTable } from '@/components/table/data-table';
import { columns, type FileData } from '@/components/table/columns';

// Generate sample data
const generateSampleData = (count: number): FileData[] => {
  const fileTypes = ['pdf', 'doc', 'txt', 'jpg', 'png', 'xlsx'];
  const statuses: ('pending' | 'processing' | 'processed' | 'error')[] = [
    'pending',
    'processing',
    'processed',
    'error',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `file-${i + 1}`,
    filename: `sample-file-${i + 1}.${fileTypes[i % fileTypes.length]}`,
    size: Math.floor(Math.random() * 10000000), // Random size up to 10MB
    type: fileTypes[i % fileTypes.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastModified: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ), // Random date within last 30 days
  }));
};

const data = generateSampleData(50); // Generate 50 sample files

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStage, setCurrentStage] = useState<keyof typeof stages>('ORDERED');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleNextStage = () => {
    const stageOrder = ['ORDERED', 'SHIPPED', 'INVOICED', 'REMITTED', 'COMPLETE'] as const;
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      setCurrentStage(stageOrder[currentIndex + 1]);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-8 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">File Tracker</h1>
        <p className="text-gray-500">Track your file through the processing pipeline</p>
      </div>

      <Timeline currentStage={currentStage} documentUrl="#" />

      <div className="flex justify-center">
        <button
          onClick={handleNextStage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={currentStage === 'COMPLETE'}
        >
          Advance to Next Stage
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={data} />
      </div>
    </motion.div>
  );
}
