import { FileData, FileWithEvents } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API functions
const api = {
  fetchFiles: async (): Promise<FileData[]> => {
    const response = await fetch('/api/files');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch files');
    }
    return response.json();
  },

  fetchFile: async (id: string): Promise<FileWithEvents | null> => {
    if (!id) return null;
    const response = await fetch(`/api/files/${id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch file');
    }
    return response.json();
  },

  updateFileStage: async (id: string, stage: string): Promise<FileWithEvents> => {
    const response = await fetch(`/api/files/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stage }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update file');
    }
    return response.json();
  },
};

// Query key factory
const fileKeys = {
  all: ['files'] as const,
  detail: (id: string) => [...fileKeys.all, id] as const,
};

// Hooks
export function useFiles() {
  return useQuery({
    queryKey: fileKeys.all,
    queryFn: api.fetchFiles,
  });
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
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.updateFileStage(id, stage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.all });
      queryClient.invalidateQueries({ queryKey: fileKeys.detail(data.id) });
    },
  });
}
