'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Truck, FileIcon, CreditCard } from 'lucide-react';
import { stages } from '@/lib/utils';
import { fadeIn, slideIn } from '@/lib/animations';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TimelineProps {
  currentStage: keyof typeof stages;
  documentUrl?: string;
}

const stageIcons = {
  ORDERED: FileText,
  SHIPPED: Truck,
  INVOICED: FileIcon,
  REMITTED: CreditCard,
  COMPLETE: CheckCircle,
};

export function Timeline({ currentStage, documentUrl }: TimelineProps) {
  const [mounted, setMounted] = React.useState(false);
  const stageOrder = ['ORDERED', 'SHIPPED', 'INVOICED', 'REMITTED', 'COMPLETE'] as const;
  const currentIndex = stageOrder.indexOf(currentStage);
  const progress = (currentIndex / (stageOrder.length - 1)) * 100;

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto p-6"
    >
      <div className="relative mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="relative z-10 flex justify-between">
        {stageOrder.map((stage, index) => {
          const Icon = stageIcons[stage];
          const isActive = index <= currentIndex;
          const isCurrent = stage === currentStage;

          return (
            <Tooltip key={stage}>
              <TooltipTrigger asChild>
                <motion.div
                  variants={slideIn}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                      ${isActive ? stages[stage].color : 'text-gray-400'}
                      ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                      bg-white shadow-lg transition-colors duration-300
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`
                      text-sm font-medium
                      ${isActive ? stages[stage].color : 'text-gray-400'}
                    `}
                  >
                    {stages[stage].label}
                  </span>
                  {documentUrl && isCurrent && (
                    <motion.a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-600 underline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Document
                    </motion.a>
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stage: {stages[stage].label}</p>
                {isActive && <p>Completed</p>}
                {isCurrent && <p>Current Stage</p>}
                {!isActive && !isCurrent && <p>Pending</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </motion.div>
  );
}
