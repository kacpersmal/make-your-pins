import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AssetFile, AssetTag } from './asset-creation.dto';

export class AssetQueryDto {
  @ApiPropertyOptional({
    description: 'Search by asset name (case-insensitive)',
    example: 'mountain',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by tag value',
    example: 'nature',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Filter by owner ID',
    example: 'user123',
  })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Number of results to return per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Page number (zero-based)',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page: number = 0;
}

export class AssetResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the asset',
    example: 'asset123',
  })
  id: string;

  @ApiProperty({
    description: 'Asset name',
    example: 'Mountain Landscape',
  })
  name: string;

  @ApiProperty({
    description: 'Asset description',
    example: 'Beautiful mountain landscape photograph',
  })
  description: string;

  @ApiProperty({
    description: 'Files associated with this asset',
    type: [AssetFile],
    example: [
      {
        fileName: 'file-1234567890.jpg',
        order: 0,
        type: 'image',
        thumbnailName: 'file-1234567890-thumbnail.jpg',
        path: 'users/user123/file-1234567890.jpg',
        thumbnailPath: 'users/user123/file-1234567890-thumbnail.jpg',
      },
    ],
  })
  files: AssetFile[];

  @ApiPropertyOptional({
    description: 'Tags for categorizing the asset',
    type: [AssetTag],
  })
  tags?: AssetTag[];

  @ApiProperty({
    description: 'ID of the asset owner',
    example: 'user123',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-10-15T14:30:00.000Z',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Last update timestamp',
    example: '2023-10-16T09:45:00.000Z',
  })
  updatedAt?: string;

  @ApiProperty({
    description: 'Number of upvotes',
    example: 42,
  })
  upvotes: number;

  @ApiProperty({
    description: 'Number of downvotes',
    example: 5,
  })
  downvotes: number;

  @ApiProperty({
    description: 'Number of views',
    example: 128,
  })
  views: number;
}

export class PaginatedAssetsResponseDto {
  @ApiProperty({
    description: 'List of assets',
    type: [AssetResponseDto],
  })
  items: AssetResponseDto[];

  @ApiProperty({
    description: 'Total number of assets matching the query',
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 0,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  pages: number;
}
