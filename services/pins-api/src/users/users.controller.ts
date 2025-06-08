import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  Body,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserProfileService } from './services/user-profile.service';
import {
  UserProfileResponseDto,
  UserProfileQueryDto,
  PaginatedUserProfilesResponseDto,
  FollowUserResponseDto,
  UpdateUserProfileDto,
} from './services/user-profile.dto';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':userId')
  @Public()
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'userId', description: 'User ID to fetch' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserProfile(
    @Param('userId') userId: string,
    @CurrentUser('userId') currentUserId?: string,
  ): Promise<UserProfileResponseDto> {
    console.log(currentUserId);
    return this.userProfileService.getUserProfile(userId, currentUserId);
  }

  @Put(':userId/profile')
  @ApiOperation({ summary: 'Update a user profile (admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID to update' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserProfileDto,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<UserProfileResponseDto> {
    if (!currentUserId || currentUserId !== userId) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return this.userProfileService.updateUserProfile(userId, updateData);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List user profiles with pagination and filtering' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Search by display name',
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
    description: 'User profiles retrieved successfully',
    type: PaginatedUserProfilesResponseDto,
  })
  async listUserProfiles(
    @Query() query: UserProfileQueryDto,
    @CurrentUser('userId') currentUserId?: string,
  ): Promise<PaginatedUserProfilesResponseDto> {
    return this.userProfileService.listUserProfiles(query, currentUserId);
  }

  @Post(':userId/follow')
  @HttpCode(200)
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({ name: 'userId', description: 'User ID to follow' })
  @ApiResponse({
    status: 200,
    description: 'User followed successfully',
    type: FollowUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already following this user' })
  async followUser(
    @Param('userId') targetUserId: string,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<FollowUserResponseDto> {
    return this.userProfileService.followUser(currentUserId, targetUserId);
  }

  @Delete(':userId/follow')
  @HttpCode(200)
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'userId', description: 'User ID to unfollow' })
  @ApiResponse({
    status: 200,
    description: 'User unfollowed successfully',
    type: FollowUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Not following this user' })
  async unfollowUser(
    @Param('userId') targetUserId: string,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<FollowUserResponseDto> {
    return this.userProfileService.unfollowUser(currentUserId, targetUserId);
  }
}
