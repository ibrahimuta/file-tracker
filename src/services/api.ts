import { FileData } from '@/types';

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

// Status configurations with weighted probabilities
const STATUS_WEIGHTS = {
  'processed': 0.6,    // 60% chance
  'processing': 0.2,   // 20% chance
  'error': 0.1,        // 10% chance
  'pending': 0.1       // 10% chance
} as const;

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
  
  // Generate random status based on weights
  const random = Math.random();
  let status: FileData['status'] = 'pending';
  let sum = 0;
  for (const [key, weight] of Object.entries(STATUS_WEIGHTS)) {
    sum += weight;
    if (random <= sum) {
      status = key as FileData['status'];
      break;
    }
  }
  
  // Generate random date within last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  // Common file name prefixes for different types
  const prefixes = {
    pdf: ['Report', 'Document', 'Contract', 'Invoice'],
    document: ['Proposal', 'Letter', 'Agreement', 'Resume'],
    spreadsheet: ['Budget', 'Forecast', 'Analysis', 'Data'],
    image: ['Photo', 'Screenshot', 'Diagram', 'Chart'],
    text: ['Notes', 'Log', 'README', 'Changes']
  };
  
  const prefix = prefixes[fileType][Math.floor(Math.random() * prefixes[fileType].length)];
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return {
    id: `file-${index + 1}`,
    filename: `${prefix}_${randomNum}.${extension}`,
    type: extension.toUpperCase(),
    size,
    status,
    lastModified: date.toISOString(),
  };
}

// Generate mock data array
const mockFiles: FileData[] = Array.from({ length: 50 }, (_, i) => generateFile(i));

const API_BASE_URL = '/api';

export async function fetchFiles(): Promise<FileData[]> {
  const response = await fetch(`${API_BASE_URL}/files`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  
  return response.json();
}

export async function fetchFileById(id: string): Promise<FileData | null> {
  const response = await fetch(`${API_BASE_URL}/files/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch file');
  }
  
  return response.json();
}

export async function updateFileStatus(id: string, status: FileData['status']): Promise<FileData> {
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update file status');
  }
  
  return response.json();
}

// Cache key factory
export const fileKeys = {
  all: ['files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...fileKeys.lists(), { filters }] as const,
  details: () => [...fileKeys.all, 'detail'] as const,
  detail: (id: string) => [...fileKeys.details(), id] as const,
};
