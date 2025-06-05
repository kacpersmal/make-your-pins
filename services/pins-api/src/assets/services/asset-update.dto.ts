import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AssetFile, AssetTag, CreateAsset } from './asset-creation.dto';

export class UpdateAssetDto extends PartialType(CreateAsset) {
  @ApiPropertyOptional({ description: 'Updated asset name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Updated asset description' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated files associated with this asset',
    type: [AssetFile],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssetFile)
  files?: AssetFile[];

  @ApiPropertyOptional({
    description: 'Updated tags for categorizing the asset',
    type: [AssetTag],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetTag)
  tags?: AssetTag[];
}

export class UpdateAssetParams {
  @ApiProperty({
    description: 'Asset ID to update',
    example: 'asset123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
