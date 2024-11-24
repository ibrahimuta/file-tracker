export type FileStage = 'ordered' | 'shipped' | 'invoiced' | 'remitted' | 'complete';

export interface FileMetadata {
  user: string;
  notes?: string;
  orderNumber?: string;
  trackingNumber?: string;
  carrier?: string;
  invoiceNumber?: string;
  amount?: number;
  remittanceId?: string;
  paymentMethod?: string;
  completedBy?: string;
}

export interface FileData {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
  stage: FileStage;
  metadata?: FileMetadata;
}

export interface FileEvent {
  id: string;
  fileId: string;
  stage: FileStage;
  timestamp: string;
  documentUrl?: string;
  metadata: FileMetadata;
}

export interface FileWithEvents extends FileData {
  events: FileEvent[];
}
