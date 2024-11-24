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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Timeline Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto py-4">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            {selectedFile ? (
              <FileTimeline
                events={fileWithEvents?.events}
                currentStage={selectedFile.stage}
                className="bg-card rounded-lg shadow-sm"
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No file selected
              </div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 container mx-auto py-6 overflow-auto">
        <DataTable
          columns={columns}
          data={files || []}
          loading={isLoading}
          onRowSelect={setSelectedFile}
        />
      </div>
    </div>
  );
}
