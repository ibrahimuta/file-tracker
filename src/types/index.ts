export type FileStage = 'ordered' | 'shipped' | 'invoiced' | 'remitted' | 'complete';

export interface FileData {
  id: string;
  filename: string;
  type: string;
  size: number;
  stage: FileStage;
  lastModified: string;
  documentUrl?: string;
}

export interface FileEvent {
  id: string;
  fileId: string;
  stage: FileStage;
  timestamp: string;
  documentUrl?: string;
  details?: string;
}

export type FileWithEvents = FileData & {
  events: FileEvent[];
};
