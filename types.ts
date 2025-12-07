export interface Attachment {
  file: File;
  type: 'image' | 'pdf' | 'audio';
  previewUrl?: string; // For images
  base64?: string;
  mimeType: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text?: string;
  attachments?: Attachment[];
  timestamp: number;
  isError?: boolean;
}

export enum AnalysisStatus {
  Idle = 'IDLE',
  Thinking = 'THINKING',
  Streaming = 'STREAMING',
  Complete = 'COMPLETE',
  Error = 'ERROR'
}
