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
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6">
        <div className="py-4">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            {selectedFile ? (
              <FileTimeline
                events={fileWithEvents?.events}
                currentStage={selectedFile.stage}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                Select a file to view its timeline
              </div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 p-6 overflow-hidden">
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
