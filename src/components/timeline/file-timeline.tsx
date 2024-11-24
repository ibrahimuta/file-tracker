import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Truck, FileIcon, CreditCard, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileEvent, FileStage } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const stageConfig = {
  ordered: {
    icon: FileText,
    color: 'text-blue-500',
    label: 'Ordered',
  },
  shipped: {
    icon: Truck,
    color: 'text-yellow-500',
    label: 'Shipped',
  },
  invoiced: {
    icon: FileIcon,
    color: 'text-purple-500',
    label: 'Invoiced',
  },
  remitted: {
    icon: CreditCard,
    color: 'text-pink-500',
    label: 'Remitted',
  },
  complete: {
    icon: CheckCircle,
    color: 'text-green-500',
    label: 'Complete',
  },
} as const;

interface FileTimelineProps {
  events?: FileEvent[];
  currentStage: FileStage;
  className?: string;
}

export function FileTimeline({ events = [], currentStage, className }: FileTimelineProps) {
  const sortedEvents = React.useMemo(() => 
    [...(events || [])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [events]
  );

  const stageOrder: FileStage[] = ['ordered', 'shipped', 'invoiced', 'remitted', 'complete'];
  const currentIndex = stageOrder.indexOf(currentStage);
  const progress = ((currentIndex + 1) / stageOrder.length) * 100;

  return (
    <div className={cn("w-full p-6 space-y-8", className)}>
      <div className="relative">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Timeline layout - horizontal on desktop, vertical on mobile */}
      <div className="relative">
        {/* Desktop layout */}
        <div className="hidden md:flex justify-between items-center">
          {stageOrder.map((stage, index) => {
            const Icon = stageConfig[stage].icon;
            const isActive = index <= currentIndex;
            const isCurrent = stage === currentStage;
            const event = sortedEvents.find(e => e.stage === stage);

            return (
              <Tooltip key={stage}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center cursor-pointer',
                        stageConfig[stage].color,
                        'bg-white shadow-lg ring-1 ring-gray-200 dark:ring-gray-800',
                        isCurrent && 'ring-2 ring-offset-2 ring-blue-500',
                        !isActive && 'opacity-50'
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        'text-sm font-medium',
                        isActive ? stageConfig[stage].color : 'text-gray-400'
                      )}>
                        {stageConfig[stage].label}
                      </span>
                      {event && (
                        <time className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </time>
                      )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{stageConfig[stage].label}</p>
                    {event?.details && <p className="text-xs">{event.details}</p>}
                    {event?.documentUrl && (
                      <a
                        href={event.documentUrl}
                        className="text-xs text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-6">
          <div className="absolute left-6 top-0 w-px h-full bg-gray-200 dark:bg-gray-800" />
          {stageOrder.map((stage, index) => {
            const Icon = stageConfig[stage].icon;
            const isActive = index <= currentIndex;
            const isCurrent = stage === currentStage;
            const event = sortedEvents.find(e => e.stage === stage);

            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4 ml-6"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    stageConfig[stage].color,
                    'bg-white shadow-lg ring-1 ring-gray-200 dark:ring-gray-800',
                    isCurrent && 'ring-2 ring-offset-2 ring-blue-500',
                    !isActive && 'opacity-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'font-medium',
                      isActive ? stageConfig[stage].color : 'text-gray-400'
                    )}>
                      {stageConfig[stage].label}
                    </span>
                    {event && (
                      <time className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </time>
                    )}
                  </div>
                  {event?.details && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.details}
                    </p>
                  )}
                  {event?.documentUrl && (
                    <a
                      href={event.documentUrl}
                      className="text-sm text-blue-500 hover:underline mt-1 block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
