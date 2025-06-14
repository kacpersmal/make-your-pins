import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { TagManagementService } from './services/tag-management.service';

@Controller('tags')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiTags('tags')
export class TagsController {
  constructor(private readonly tagService: TagManagementService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Get popular tags' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Popular tags retrieved successfully',
  })
  async getPopularTags(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.tagService.getPopularTags(limit || 20, offset || 0);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tags by prefix' })
  @ApiQuery({ name: 'prefix', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tags search completed successfully',
  })
  async searchTags(
    @Query('prefix') prefix: string,
    @Query('limit') limit?: number,
  ) {
    return this.tagService.searchTagsByPrefix(prefix, limit || 10);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get tag suggestions' })
  @ApiQuery({
    name: 'existingTags',
    required: false,
    type: String,
    isArray: true,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tag suggestions retrieved successfully',
  })
  async getTagSuggestions(
    @Query('existingTags') existingTags?: string[],
    @Query('limit') limit?: number,
  ) {
    return this.tagService.getTagSuggestions(existingTags || [], limit || 5);
  }
}
