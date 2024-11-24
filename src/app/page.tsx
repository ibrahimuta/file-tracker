'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Timeline } from '@/components/timeline/timeline';
import { stages } from '@/lib/utils';
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/columns';

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
        <DataTable columns={columns} />
      </div>
    </motion.div>
  );
}
