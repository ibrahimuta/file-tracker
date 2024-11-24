import { FileData } from '@/types';

// This will be replaced with real database connection later
class Database {
  private files: FileData[] = [];

  constructor() {
    // Initialize with some data (will be replaced with database connection)
    this.generateSampleData();
  }

  private generateSampleData() {
    // Temporary sample data - will be replaced with real database data
    this.files = Array.from({ length: 10 }, (_, i) => ({
      id: `file-${i + 1}`,
      filename: `sample-${i + 1}.pdf`,
      type: 'PDF',
      size: 1024 * (i + 1),
      status: 'pending',
      lastModified: new Date().toISOString(),
    }));
  }

  async getAllFiles(): Promise<FileData[]> {
    // Will be replaced with database query
    return this.files;
  }

  async getFileById(id: string): Promise<FileData | null> {
    // Will be replaced with database query
    const file = this.files.find(f => f.id === id);
    return file || null;
  }

  async updateFileStatus(id: string, status: FileData['status']): Promise<FileData | null> {
    // Will be replaced with database query
    const fileIndex = this.files.findIndex(f => f.id === id);
    if (fileIndex === -1) return null;

    this.files[fileIndex] = {
      ...this.files[fileIndex],
      status,
      lastModified: new Date().toISOString(),
    };

    return this.files[fileIndex];
  }
}

// Export a singleton instance
export const db = new Database();
