import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserProfileService } from './services/user-profile.service';
import { FeedQueryDto } from './services/user-profile.dto';
import { PaginatedAssetsResponseDto } from 'src/assets/services/asset-fetching.dto';

@Controller('feed')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiTags('feed')
export class FeedController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user feed (assets from followed users)' })
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
    description: 'Feed retrieved successfully',
    type: PaginatedAssetsResponseDto,
  })
  async getUserFeed(
    @Query() query: FeedQueryDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PaginatedAssetsResponseDto> {
    return this.userProfileService.getUserFeed(userId, query.limit, query.page);
  }
}
