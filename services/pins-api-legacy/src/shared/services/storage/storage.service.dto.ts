export interface SignedUrlOptions {
  bucketName?: string;
  fileName?: string;
  contentType?: string;
  action: 'read' | 'write' | 'delete';
  expires?: number; // In seconds from now
}
