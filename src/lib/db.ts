import { FileData, FileEvent, FileStage, FileWithEvents } from '@/types';

// Helper function to generate random date within last 30 days
function getRandomDate(daysAgo = 30) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Helper function to generate random file size between 1MB and 100MB
function getRandomFileSize() {
  return Math.floor(Math.random() * 99_000_000) + 1_000_000;
}

// Helper function to generate mock events for a file based on its current stage
function generateEventsForStage(fileId: string, currentStage: FileStage): FileEvent[] {
  const stages: FileStage[] = ['ordered', 'shipped', 'invoiced', 'remitted', 'complete'];
  const currentIndex = stages.indexOf(currentStage);
  const events: FileEvent[] = [];
  
  // Generate events up to current stage
  for (let i = 0; i <= currentIndex; i++) {
    const stage = stages[i];
    const date = new Date();
    date.setDate(date.getDate() - (currentIndex - i)); // Earlier stages happened earlier
    
    events.push({
      id: `${fileId}-${stage}`,
      fileId,
      stage,
      timestamp: date.toISOString(),
      documentUrl: stage === 'invoiced' ? `https://example.com/invoices/${fileId}.pdf` : undefined,
      metadata: {
        user: 'system',
        notes: `File ${stage}`,
      },
    });
  }
  
  return events;
}

// Generate a diverse set of mock files with different stages
const mockFiles: FileData[] = [
  // Ordered files
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `file-ordered-${i + 1}`,
    filename: `ordered-file-${i + 1}.pdf`,
    size: getRandomFileSize(),
    uploadedAt: getRandomDate(),
    stage: 'ordered' as FileStage,
  })),
  // Shipped files
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `file-shipped-${i + 1}`,
    filename: `shipped-file-${i + 1}.pdf`,
    size: getRandomFileSize(),
    uploadedAt: getRandomDate(),
    stage: 'shipped' as FileStage,
  })),
  // Invoiced files
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `file-invoiced-${i + 1}`,
    filename: `invoiced-file-${i + 1}.pdf`,
    size: getRandomFileSize(),
    uploadedAt: getRandomDate(),
    stage: 'invoiced' as FileStage,
  })),
  // Remitted files
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `file-remitted-${i + 1}`,
    filename: `remitted-file-${i + 1}.pdf`,
    size: getRandomFileSize(),
    uploadedAt: getRandomDate(),
    stage: 'remitted' as FileStage,
  })),
  // Complete files
  ...Array.from({ length: 1 }, (_, i) => ({
    id: `file-complete-${i + 1}`,
    filename: `complete-file-${i + 1}.pdf`,
    size: getRandomFileSize(),
    uploadedAt: getRandomDate(),
    stage: 'complete' as FileStage,
  })),
];

// Mock database operations
export const db = {
  files: {
    list: async () => {
      return mockFiles;
    },
    get: async (id: string): Promise<FileWithEvents | null> => {
      const file = mockFiles.find(f => f.id === id);
      if (!file) return null;
      
      const events = generateEventsForStage(id, file.stage);
      return {
        ...file,
        events,
      };
    },
    update: async (id: string, data: Partial<FileData>): Promise<FileWithEvents | null> => {
      const index = mockFiles.findIndex(f => f.id === id);
      if (index === -1) return null;
      
      mockFiles[index] = { ...mockFiles[index], ...data };
      return db.files.get(id);
    },
    getEvents: async (id: string): Promise<FileEvent[]> => {
      const file = await db.files.get(id);
      return file ? file.events : [];
    },
  },
};
