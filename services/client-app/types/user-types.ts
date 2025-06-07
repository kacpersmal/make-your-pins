export interface UserProfileDto {
  id: string
  displayName: string
  email?: string
  photoURL?: string
  followersCount: number
  followingCount: number
  assetsCount: number
  bio?: string
  isFollowing?: boolean
}

export interface PaginatedUserProfilesResponseDto {
  items: Array<UserProfileDto>
  total: number
  page: number
  limit: number
  pages: number
}

export interface FollowResponseDto {
  success: boolean
  targetUserId: string
  followerId: string
  timestamp: string
}

export interface UserQueryParams {
  name?: string
  limit?: number
  page?: number
}

export interface FeedQueryParams {
  limit?: number
  page?: number
}
