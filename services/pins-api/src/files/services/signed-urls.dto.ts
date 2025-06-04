import { IsIn, IsUUID } from 'class-validator';

const ALLOWED_CONTENT_TYPES = [
  'application/octet-stream',
  'image/jpeg',
  'image/png',
] as const;

export type AllowedContentTypes = (typeof ALLOWED_CONTENT_TYPES)[number];

export type ActionType = 'read' | 'write';

export class UserUploadUrl {
  url: string;
  publicUrl?: string;
  fileName: string;
  expiresIn: number;
}

export class GenerateUploadUrl {
  @IsUUID()
  userId: string;

  @IsIn(ALLOWED_CONTENT_TYPES)
  contentType: AllowedContentTypes = 'image/jpeg'; // Optional, defaults to 'image/jpeg'
}
