import apiClient from '../lib/api-client'
import type {
  FollowResponseDto,
  PaginatedUserProfilesResponseDto,
  UserProfileDto,
  UserQueryParams,
} from '../types/user-types'

export class UserService {
  private baseUrl = '/users'

  /**
   * Get a user profile by ID
   * @param userId User ID to fetch
   * @returns User profile data
   */
  async getUserProfile(userId: string): Promise<UserProfileDto> {
    return apiClient.get<UserProfileDto>(`${this.baseUrl}/${userId}`)
  }

  /**
   * List user profiles with pagination and filtering
   * @param params Query parameters (name, limit, page)
   * @returns Paginated list of user profiles
   */
  async listUsers(
    params?: UserQueryParams,
  ): Promise<PaginatedUserProfilesResponseDto> {
    return apiClient.get<PaginatedUserProfilesResponseDto>(this.baseUrl, params)
  }

  /**
   * Follow a user
   * @param userId User ID to follow
   * @returns Follow operation result
   */
  async followUser(userId: string): Promise<FollowResponseDto> {
    return apiClient.post<FollowResponseDto>(`${this.baseUrl}/${userId}/follow`)
  }

  /**
   * Unfollow a user
   * @param userId User ID to unfollow
   * @returns Unfollow operation result
   */
  async unfollowUser(userId: string): Promise<FollowResponseDto> {
    return apiClient.delete<FollowResponseDto>(
      `${this.baseUrl}/${userId}/follow`,
    )
  }
}

export const userService = new UserService()
