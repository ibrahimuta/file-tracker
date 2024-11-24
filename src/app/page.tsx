'use client';

import { Suspense, useState, useEffect } from 'react';
import { DataTable } from '@/components/table/data-table';
import { FileTimeline } from '@/components/timeline/file-timeline';
import { columns } from './columns';
import { useFiles, useFile } from '@/hooks/use-files';
import { Skeleton } from '@/components/ui/skeleton';
import { FileData } from '@/types';

export default function HomePage() {
  const { data: files, isLoading } = useFiles();
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const { data: fileWithEvents } = useFile(selectedFile?.id ?? '');

  // Initialize with first file
  useEffect(() => {
    if (files?.[0] && !selectedFile) {
      setSelectedFile(files[0]);
    }
  }, [files, selectedFile]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Timeline Section */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/40 px-6">
        <div className="py-4">
          <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
            {selectedFile ? (
              <FileTimeline
                events={fileWithEvents?.events}
                currentStage={selectedFile.stage}
              />
            ) : (
              <div className="text-center text-muted-foreground/80 h-48 flex items-center justify-center">
                <div className="space-y-2">
                  <div className="text-lg font-medium">No File Selected</div>
                  <div className="text-sm">Select a file to view its timeline and details</div>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="backdrop-blur-md bg-background/50 rounded-lg p-4">
          <DataTable
            columns={columns}
            data={files || []}
            loading={isLoading}
            onRowSelect={setSelectedFile}
          />
        </div>
      </div>
    </div>
  );
}
