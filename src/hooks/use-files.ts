import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFiles, fetchFileById, updateFileStatus, fileKeys } from '@/services/api';
import { FileData } from '@/types';

export function useFiles() {
  const queryClient = useQueryClient();

  const filesQuery = useQuery({
    queryKey: fileKeys.lists(),
    queryFn: fetchFiles,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const prefetchFile = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: fileKeys.detail(id),
      queryFn: () => fetchFileById(id),
    });
  };

  const getFileFromCache = (id: string): FileData | undefined => {
    return queryClient.getQueryData(fileKeys.lists())?.find((file: FileData) => file.id === id);
  };

  const updateStatus = async (id: string, status: FileData['status']) => {
    // Optimistically update the cache
    const previousFiles = queryClient.getQueryData<FileData[]>(fileKeys.lists()) || [];
    
    queryClient.setQueryData(fileKeys.lists(), (old: FileData[] | undefined) => {
      if (!old) return previousFiles;
      return old.map(file => 
        file.id === id ? { ...file, status } : file
      );
    });

    try {
      const updatedFile = await updateFileStatus(id, status);
      
      // Update the cache with the server response
      queryClient.setQueryData(fileKeys.lists(), (old: FileData[] | undefined) => {
        if (!old) return previousFiles;
        return old.map(file => 
          file.id === id ? updatedFile : file
        );
      });
      
      return updatedFile;
    } catch (error) {
      // Revert the cache on error
      queryClient.setQueryData(fileKeys.lists(), previousFiles);
      throw error;
    }
  };

  return {
    files: filesQuery.data ?? [],
    isLoading: filesQuery.isLoading,
    isError: filesQuery.isError,
    error: filesQuery.error,
    refetch: filesQuery.refetch,
    prefetchFile,
    getFileFromCache,
    updateStatus,
  };
}

export function useFile(id: string) {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: () => fetchFileById(id),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
