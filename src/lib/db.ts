import { FileData, FileEvent, FileWithEvents, FileStage } from '@/types';

// This will be replaced with real database connection later
class Database {
  private files: FileData[] = [];
  private events: FileEvent[] = [];

  constructor() {
    // Initialize with some data (will be replaced with database connection)
    this.generateSampleData();
  }

  private generateSampleData() {
    const stages: FileStage[] = ['ordered', 'shipped', 'invoiced', 'remitted', 'complete'];
    const documentTypes = ['Invoice', 'Purchase Order', 'Shipping Label', 'Receipt'];

    // Generate files
    this.files = Array.from({ length: 10 }, (_, i) => {
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      
      return {
        id: `file-${i + 1}`,
        filename: `${type.toLowerCase()}-${i + 1}.pdf`,
        type,
        size: 1024 * 1024 * (Math.random() * 10 + 1), // 1-11MB
        stage,
        lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Within last week
        documentUrl: Math.random() > 0.5 ? `https://example.com/docs/${i + 1}` : undefined,
      };
    });

    // Generate events for each file
    this.files.forEach(file => {
      const currentStageIndex = stages.indexOf(file.stage);
      
      // Generate events for all stages up to current stage
      for (let i = 0; i <= currentStageIndex; i++) {
        const date = new Date();
        date.setHours(date.getHours() - (currentStageIndex - i) * 24); // Events spaced 24 hours apart

        this.events.push({
          id: `event-${file.id}-${i + 1}`,
          fileId: file.id,
          stage: stages[i],
          timestamp: date.toISOString(),
          details: `Document ${stages[i]} at ${date.toLocaleString()}`,
          documentUrl: Math.random() > 0.7 ? `https://example.com/docs/${file.id}/${stages[i]}` : undefined,
        });
      }
    });
  }

  async getAllFiles(): Promise<FileData[]> {
    return this.files;
  }

  async getFileById(id: string): Promise<FileWithEvents | null> {
    const file = this.files.find(f => f.id === id);
    if (!file) return null;

    const events = this.events.filter(e => e.fileId === id);
    return { ...file, events };
  }

  async updateFileStage(id: string, stage: FileStage, details?: string): Promise<FileWithEvents | null> {
    const fileIndex = this.files.findIndex(f => f.id === id);
    if (fileIndex === -1) return null;

    // Update file stage
    this.files[fileIndex] = {
      ...this.files[fileIndex],
      stage,
      lastModified: new Date().toISOString(),
    };

    // Add new event
    const newEvent: FileEvent = {
      id: `event-${id}-${this.events.filter(e => e.fileId === id).length + 1}`,
      fileId: id,
      stage,
      timestamp: new Date().toISOString(),
      details: details || `Document ${stage} at ${new Date().toLocaleString()}`,
    };

    this.events.push(newEvent);

    return this.getFileById(id);
  }

  async getFileEvents(id: string): Promise<FileEvent[]> {
    return this.events.filter(e => e.fileId === id);
  }
}

// Export a singleton instance
export const db = new Database();
