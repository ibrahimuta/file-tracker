import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileData, FileWithEvents, FileStage } from '@/types';

// API functions
const api = {
  fetchFiles: async (): Promise<FileData[]> => {
    const response = await fetch('/api/files');
    if (!response.ok) throw new Error('Failed to fetch files');
    return response.json();
  },

  fetchFile: async (id: string): Promise<FileWithEvents> => {
    const response = await fetch(`/api/files/${id}`);
    if (!response.ok) throw new Error('Failed to fetch file');
    return response.json();
  },

  updateFileStage: async (id: string, stage: FileStage, details?: string): Promise<FileWithEvents> => {
    const response = await fetch(`/api/files/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, details }),
    });
    
    if (!response.ok) throw new Error('Failed to update file stage');
    return response.json();
  },
};

// Query key factory
const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  detail: (id: string) => [...fileKeys.all, 'detail', id] as const,
};

// Hooks
export function useFiles() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: fileKeys.lists(),
    queryFn: () => api.fetchFiles(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const prefetchFile = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: fileKeys.detail(id),
      queryFn: () => api.fetchFile(id),
    });
  };

  return {
    data,
    isLoading,
    error,
    prefetchFile,
  };
}

export function useFile(id: string) {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: () => api.fetchFile(id),
    enabled: !!id,
  });
}

export function useUpdateFileStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage, details }: { id: string; stage: FileStage; details?: string }) =>
      api.updateFileStage(id, stage, details),
    
    onMutate: async ({ id, stage }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: fileKeys.all });

      // Get snapshot of current data
      const previousFiles = queryClient.getQueryData<FileData[]>(fileKeys.lists());
      const previousFile = queryClient.getQueryData<FileWithEvents>(fileKeys.detail(id));

      // Optimistically update files list
      if (previousFiles) {
        queryClient.setQueryData<FileData[]>(fileKeys.lists(), 
          previousFiles.map(file => 
            file.id === id ? { ...file, stage } : file
          )
        );
      }

      // Optimistically update single file
      if (previousFile) {
        queryClient.setQueryData<FileWithEvents>(fileKeys.detail(id), {
          ...previousFile,
          stage,
          events: [
            {
              id: `temp-${Date.now()}`,
              fileId: id,
              stage,
              timestamp: new Date().toISOString(),
              details: `Document ${stage}`,
            },
            ...previousFile.events,
          ],
        });
      }

      return { previousFiles, previousFile };
    },

    onError: (err, { id }, context) => {
      // Revert optimistic updates on error
      if (context?.previousFiles) {
        queryClient.setQueryData(fileKeys.lists(), context.previousFiles);
      }
      if (context?.previousFile) {
        queryClient.setQueryData(fileKeys.detail(id), context.previousFile);
      }
    },

    onSettled: (data, error, { id }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.detail(id) });
    },
  });
}
