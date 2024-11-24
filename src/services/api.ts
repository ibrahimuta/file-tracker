import { FileData, FileStage } from '@/types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// File type configurations
const FILE_TYPES = {
  'pdf': { extensions: ['pdf'], sizes: { min: 100000, max: 5000000 } },
  'document': { extensions: ['doc', 'docx'], sizes: { min: 50000, max: 2000000 } },
  'spreadsheet': { extensions: ['xls', 'xlsx'], sizes: { min: 50000, max: 3000000 } },
  'image': { extensions: ['jpg', 'png', 'gif'], sizes: { min: 500000, max: 8000000 } },
  'text': { extensions: ['txt', 'md'], sizes: { min: 1000, max: 100000 } },
} as const;

const STAGES: FileStage[] = ['ordered', 'shipped', 'invoiced', 'remitted', 'complete'];

// Generate a random file
function generateFile(index: number): FileData {
  // Select random file type
  const fileType = Object.keys(FILE_TYPES)[Math.floor(Math.random() * Object.keys(FILE_TYPES).length)] as keyof typeof FILE_TYPES;
  const typeConfig = FILE_TYPES[fileType];
  
  // Select random extension for the file type
  const extension = typeConfig.extensions[Math.floor(Math.random() * typeConfig.extensions.length)];
  
  // Generate random size within the specified range
  const size = Math.floor(
    Math.random() * (typeConfig.sizes.max - typeConfig.sizes.min) + typeConfig.sizes.min
  );
  
  // Generate random stage
  const stage = STAGES[Math.floor(Math.random() * STAGES.length)];
  
  // Generate random date within last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: `file-${index + 1}`,
    filename: `file-${index + 1}.${extension}`,
    size,
    uploadedAt: date.toISOString(),
    stage,
  };
}

// Generate mock data array
const mockFiles: FileData[] = Array.from({ length: 50 }, (_, i) => generateFile(i));

const API_BASE_URL = '/api';

// API functions
export async function fetchFiles(): Promise<FileData[]> {
  await delay(500); // Simulate network delay
  return mockFiles;
}

export async function fetchFileById(id: string): Promise<FileData | null> {
  await delay(300);
  const file = mockFiles.find(f => f.id === id);
  if (!file) return null;
  return file;
}

export async function updateFile(id: string, data: Partial<FileData>): Promise<FileData> {
  await delay(300);
  const index = mockFiles.findIndex(f => f.id === id);
  if (index === -1) {
    throw new Error('File not found');
  }
  mockFiles[index] = { ...mockFiles[index], ...data };
  return mockFiles[index];
}

// Cache key factory
export const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...fileKeys.lists(), { filters }] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (id: string) => [...fileKeys.details(), id] as const,
};
