import { GetSignedUrlConfig } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ActionType,
  AllowedContentTypes,
  GenerateUploadUrl,
  UserUploadUrl,
} from 'src/files/services/signed-urls.dto';
import { StorageService } from 'src/shared/services/storage.service';

@Injectable()
export class SignedUrlsService {
  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async generateUserUploadUrl({
    userId,
    contentType,
  }: GenerateUploadUrl): Promise<UserUploadUrl> {
    const bucketName = this.configService.get<string>('ASSETS_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('Google Cloud Storage bucket name is not configured');
    }

    const expiresInSeconds = 3600; // one hour

    const fileName = this.generateUniqueFileName();

    const urlResult = await this.generateSignedUrl(
      bucketName,
      `users/${userId}/${fileName}`,
      'write',
      expiresInSeconds,
      contentType,
    );

    return {
      url: urlResult.signedUrl,
      publicUrl: urlResult.publicUrl,
      fileName,
      expiresIn: expiresInSeconds,
    };
  }

  async generateSignedUrl(
    bucketName: string,
    fileName: string,
    action: ActionType = 'read',
    expiresInSeconds: number = 3600, // Default to 1 hour
    contentType: AllowedContentTypes = 'application/octet-stream', // Default content type
  ): Promise<{ signedUrl: string; publicUrl: string }> {
    const storage = this.storageService.getStorage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const publicUrl = file.publicUrl();
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action,
      expires: Date.now() + expiresInSeconds * 1000,
      contentType,
    };

    try {
      const res = await file.getSignedUrl(options);
      return { signedUrl: res[0], publicUrl };
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  private generateUniqueFileName(prefix: string = 'file'): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    return `${prefix}-${timestamp}-${randomSuffix}`;
  }
}
