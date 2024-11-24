'use client';

import { cn } from '@/lib/utils';
import { FileEvent, FileStage } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FileText, CheckCircle2, Circle, Link as LinkIcon } from 'lucide-react';

interface FileTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events?: FileEvent[];
  currentStage: FileStage;
}

const stages: FileStage[] = ['ordered', 'shipped', 'invoiced', 'remitted', 'complete'];

const stageConfig = {
  ordered: { label: 'Ordered', color: 'bg-blue-500' },
  shipped: { label: 'Shipped', color: 'bg-yellow-500' },
  invoiced: { label: 'Invoiced', color: 'bg-purple-500' },
  remitted: { label: 'Remitted', color: 'bg-green-500' },
  complete: { label: 'Complete', color: 'bg-slate-500' },
};

export function FileTimeline({
  events = [],
  currentStage,
  className,
  ...props
}: FileTimelineProps) {
  const currentStageIndex = stages.indexOf(currentStage);

  return (
    <div className={cn('p-6', className)} {...props}>
      <div className="flex flex-col space-y-8">
        {/* Progress Bar */}
        <div className="w-full">
          <Progress
            value={((currentStageIndex + 1) / stages.length) * 100}
            className="h-2"
          />
        </div>

        {/* Timeline */}
        <div className="relative flex md:flex-row flex-col md:items-center items-start md:justify-between md:space-y-0 space-y-8">
          {/* Connecting Lines - Desktop */}
          <div className="absolute md:block hidden top-4 left-[2.5%] w-[95%] h-0.5">
            {/* Background lines */}
            <div className="absolute inset-0 bg-muted" />
            
            {/* Progress lines */}
            {currentStageIndex > 0 && (
              <div 
                className="absolute h-full transition-all duration-300"
                style={{
                  left: 0,
                  width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                }}
              >
                <div className={cn(
                  'h-full w-full',
                  stageConfig[stages[currentStageIndex - 1]].color
                )} />
              </div>
            )}
          </div>

          {/* Connecting Lines - Mobile */}
          <div className="absolute md:hidden block left-4 h-[calc(100%-2rem)] w-0.5">
            {/* Background lines */}
            <div className="absolute inset-0 bg-muted" />
            
            {/* Progress lines */}
            {currentStageIndex > 0 && (
              <div 
                className="absolute w-full transition-all duration-300"
                style={{
                  top: '1rem',
                  height: currentStageIndex === stages.length - 1 
                    ? 'calc(100% - 2rem)' 
                    : `calc(${(currentStageIndex / (stages.length - 1)) * 100}% - 1rem)`,
                }}
              >
                <div className={cn(
                  'w-full h-full',
                  stageConfig[stages[currentStageIndex - 1]].color
                )} />
              </div>
            )}
          </div>

          {/* Stage Points */}
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const event = events.find((e) => e.stage === stage);
            const config = stageConfig[stage];
            const isComplete = stage === 'complete';

            return (
              <div
                key={stage}
                className="relative z-10 flex md:flex-col flex-row md:items-center items-start md:pl-0 pl-12"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex md:flex-col flex-row items-center gap-2">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300',
                            isCompleted ? config.color : 'bg-muted',
                            'text-white'
                          )}
                        >
                          {isComplete && event?.documentUrl ? (
                            <FileText className="h-4 w-4" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              'text-sm font-medium whitespace-nowrap',
                              isCompleted ? 'text-foreground' : 'text-muted-foreground'
                            )}
                          >
                            {config.label}
                          </span>
                          {event && (
                            <div className="flex flex-col items-center text-xs text-muted-foreground">
                              <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                              {isComplete && event.documentUrl && (
                                <a
                                  href={event.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-primary hover:underline mt-1"
                                >
                                  <LinkIcon className="h-3 w-3" />
                                  <span>View Document</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    {event && (
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-medium">{config.label}</p>
                          <p className="text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.metadata?.notes && (
                            <p className="text-muted-foreground">
                              {event.metadata.notes}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
