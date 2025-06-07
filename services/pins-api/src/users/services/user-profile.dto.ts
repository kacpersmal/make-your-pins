import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  id: string;

  @ApiProperty({
    description: 'Display name',
    example: 'John Doe',
  })
  displayName: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Profile photo URL',
    example: 'https://example.com/photo.jpg',
  })
  photoURL?: string;

  @ApiProperty({
    description: 'Number of followers',
    example: 42,
  })
  followersCount: number;

  @ApiProperty({
    description: 'Number of users this user is following',
    example: 125,
  })
  followingCount: number;

  @ApiProperty({
    description: 'Number of assets this user has created',
    example: 18,
  })
  assetsCount: number;

  @ApiPropertyOptional({
    description: 'User bio/description',
    example: 'Digital artist passionate about nature scenes',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Whether the current user is following this profile',
    example: true,
  })
  isFollowing?: boolean;
}

export class UserProfileQueryDto {
  @ApiPropertyOptional({
    description: 'Search by display name',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    default: 10,
    minimum: 1,
    maximum: 50,
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

export class PaginatedUserProfilesResponseDto {
  @ApiProperty({
    type: [UserProfileResponseDto],
    description: 'List of user profiles',
  })
  items: UserProfileResponseDto[];

  @ApiProperty({
    description: 'Total number of user profiles matching the query',
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

export class FollowUserResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Target user ID',
    example: 'user123',
  })
  targetUserId: string;

  @ApiProperty({
    description: 'Follower user ID',
    example: 'user456',
  })
  followerId: string;

  @ApiProperty({
    description: 'Timestamp of the follow action',
    example: '2023-07-20T15:30:00.000Z',
  })
  timestamp: string;
}

export class FeedQueryDto {
  @ApiPropertyOptional({
    description: 'Number of results per page',
    default: 10,
    minimum: 1,
    maximum: 50,
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
