import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';

export class AssetTag {
  @ApiProperty({ description: 'Tag value', example: 'nature' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  value: string;
}

export enum AssetFileType {
  IMAGE = 'image',
}

export class AssetFile {
  @ApiProperty({
    description: 'Name of the file in storage',
    example: 'file-1234567890.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional({
    description: 'Order of the file (0 is primary)',
    default: 0,
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number = 0;

  @ApiProperty({
    description: 'Type of the file',
    enum: AssetFileType,
    example: AssetFileType.IMAGE,
  })
  @IsEnum(AssetFileType)
  type: AssetFileType;

  @ApiPropertyOptional({
    description: 'Name of the thumbnail file (added by service)',
    example: 'file-1234567890-thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnailName?: string;

  @ApiPropertyOptional({
    description: 'Full path to access the file (added during fetching)',
    example: 'users/user123/file-1234567890.jpg',
  })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({
    description: 'Full path to access the thumbnail (added during fetching)',
    example: 'users/user123/file-1234567890-thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnailPath?: string;
}

export class CreateAsset {
  @ApiProperty({ description: 'Asset name', example: 'Mountain Landscape' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Asset description',
    example: 'Beautiful mountain landscape photograph',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Files associated with this asset',
    type: [AssetFile],
    example: [
      {
        fileName: 'file-1234567890.jpg',
        order: 0,
        type: AssetFileType.IMAGE,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssetFile)
  files: AssetFile[];

  @ApiPropertyOptional({
    description: 'Tags for categorizing the asset',
    type: [AssetTag],
    example: [{ value: 'nature' }, { value: 'mountains' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetTag)
  tags?: AssetTag[];
}

export class CreateAssetWithOwner extends CreateAsset {
  @ApiProperty({ description: 'ID of the asset owner', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}

export class CreateAssetDto {
  @ApiProperty({
    description: 'Unique identifier of the asset',
    example: 'asset123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Asset name', example: 'Mountain Landscape' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Asset description',
    example: 'Beautiful mountain landscape photograph',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Files associated with this asset',
    type: [AssetFile],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetFile)
  files: AssetFile[];

  @ApiPropertyOptional({
    description: 'Tags for categorizing the asset',
    type: [AssetTag],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetTag)
  tags?: AssetTag[];

  @ApiPropertyOptional({
    description: 'ID of the asset owner',
    example: 'user123',
  })
  @IsOptional()
  @IsString()
  ownerId?: string;
}
