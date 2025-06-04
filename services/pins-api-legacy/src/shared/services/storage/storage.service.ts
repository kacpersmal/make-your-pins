import {GetSignedUrlConfig, Storage} from '@google-cloud/storage';
import * as crypto from 'crypto';
import {SignedUrlOptions} from './storage.service.dto';

export interface StorageService {
  generateSignedUrl(options: SignedUrlOptions): Promise<string>;
  generateUniqueFileName(originalName: string): string;
}

export class GcsStorageService implements StorageService {
  private storage: Storage;
  private defaultBucket: string;

  constructor() {
    const isLocalDev =
      process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const storageOptions = isLocalDev
      ? {
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        }
      : {};

    this.storage = new Storage(storageOptions);

    this.defaultBucket = process.env.GCS_BUCKET_NAME || 'make-your-pin-assets';
  }

  async generateSignedUrl(options: SignedUrlOptions): Promise<string> {
    const {
      bucketName = this.defaultBucket,
      fileName,
      contentType = 'application/octet-stream',
      action,
      expires = 15 * 60, // Default 15 minutes
    } = options;

    let finalFileName: string;
    if (fileName) {
      // If fileName already has a path, make sure it's inside /original/
      const parts = fileName.split('/').filter(part => part.trim() !== '');

      // If the first part is not 'original', add it
      if (parts[0] !== 'original') {
        parts.unshift('original');
      }

      finalFileName = parts.join('/');
    } else {
      // Generate a unique name inside the original directory
      finalFileName = `original/${this.generateUniqueFileName('unknown')}`;
    }

    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(finalFileName);

    // Set up signed URL options
    const urlOptions: GetSignedUrlConfig = {
      version: 'v4' as const,
      action:
        action === 'read' ? 'read' : action === 'delete' ? 'delete' : 'write',
      expires: Date.now() + expires * 1000,
      contentType: action === 'write' ? contentType : undefined,
    };

    try {
      // Generate the signed URL
      const rs = await file.getSignedUrl(urlOptions);
      const url = rs[0];
      console.log(`Generated signed URL: ${url}`);
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  generateUniqueFileName(originalName: string): string {
    // Generate a unique filename to prevent collisions
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = originalName.includes('.')
      ? originalName.split('.').pop()
      : '';

    return `${timestamp}-${randomString}${extension ? `.${extension}` : ''}`;
  }
}
