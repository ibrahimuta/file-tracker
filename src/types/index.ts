export interface FileData {
  id: string;
  filename: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'processed' | 'error';
  lastModified: Date;
}
