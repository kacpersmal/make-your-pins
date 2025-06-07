import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateAsset,
  CreateAssetDto,
} from 'src/assets/services/asset-creation.dto';
import { AssetCreationService } from 'src/assets/services/asset-creation.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { UpdateAssetDto, UpdateAssetParams } from './services/asset-update.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { AssetFetchingService } from './services/asset-fetching.service';
import {
  AssetQueryDto,
  AssetResponseDto,
  PaginatedAssetsResponseDto,
} from './services/asset-fetching.dto';

@Controller('assets')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class AssetsController {
  constructor(
    private readonly assetCreationService: AssetCreationService,
    private readonly assetFetchingService: AssetFetchingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({
    status: 201,
    description: 'Asset successfully created',
    type: CreateAssetDto,
  })
  createAsset(
    @Body() createAsset: CreateAsset,
    @CurrentUser('userId') userId: string,
  ): Promise<CreateAssetDto> {
    return this.assetCreationService.createAsset({
      ownerId: userId,
      ...createAsset,
    });
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing asset' })
  @ApiParam({ name: 'id', description: 'Asset ID to update' })
  @ApiResponse({
    status: 200,
    description: 'Asset successfully updated',
    type: CreateAssetDto,
  })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the asset owner' })
  updateAsset(
    @Param() params: UpdateAssetParams,
    @Body() updateAssetDto: UpdateAssetDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CreateAssetDto> {
    return this.assetCreationService.updateAsset(
      params.id,
      updateAssetDto,
      userId,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID to fetch' })
  @ApiResponse({
    status: 200,
    description: 'Asset retrieved successfully',
    type: AssetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  getAssetById(@Param('id') id: string): Promise<AssetResponseDto> {
    return this.assetFetchingService.getAssetById(id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search assets with filtering and pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Search by asset name',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'Filter by tag value',
  })
  @ApiQuery({
    name: 'ownerId',
    required: false,
    description: 'Filter by owner ID',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Results per page',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (zero-based)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Assets retrieved successfully',
    type: PaginatedAssetsResponseDto,
  })
  searchAssets(
    @Query() query: AssetQueryDto,
  ): Promise<PaginatedAssetsResponseDto> {
    return this.assetFetchingService.searchAssets(query);
  }
}
