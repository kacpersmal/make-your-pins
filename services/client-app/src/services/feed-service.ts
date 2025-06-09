import apiClient from '../lib/api-client'
import type { PaginatedAssetsResponseDto } from '../types/asset-types'
import type { FeedQueryParams } from '../types/user-types'

export class FeedService {
  private baseUrl = '/feed'

  /**
   * Get the current user's feed (assets from followed users)
   * @param params Query parameters (limit, page)
   * @returns Paginated list of assets
   */
  async getFeed(params?: FeedQueryParams): Promise<PaginatedAssetsResponseDto> {
    return apiClient.get<PaginatedAssetsResponseDto>(this.baseUrl, params)
  }
}

export const feedService = new FeedService()
