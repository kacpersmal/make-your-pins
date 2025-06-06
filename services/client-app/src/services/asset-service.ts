import apiClient from '../lib/api-client'
import type {
  AssetResponseDto,
  CreateAssetDto,
  PaginatedAssetsResponseDto,
  UpdateAssetDto,
} from '../types/asset-types'

export class AssetService {
  private baseUrl = '/assets'

  // Get all assets with optional filtering
  async getAssets(params?: {
    name?: string
    tag?: string
    ownerId?: string
    limit?: number
    page?: number
  }): Promise<PaginatedAssetsResponseDto> {
    return apiClient.get<PaginatedAssetsResponseDto>(this.baseUrl, params)
  }

  // Get a single asset by ID
  async getAssetById(id: string): Promise<AssetResponseDto> {
    return apiClient.get<AssetResponseDto>(`${this.baseUrl}/${id}`)
  }

  // Create a new asset
  async createAsset(
    asset: Omit<CreateAssetDto, 'id' | 'ownerId'>,
  ): Promise<CreateAssetDto> {
    return apiClient.post<CreateAssetDto>(this.baseUrl, asset)
  }

  // Update an existing asset
  async updateAsset(
    id: string,
    asset: UpdateAssetDto,
  ): Promise<CreateAssetDto> {
    return apiClient.put<CreateAssetDto>(`${this.baseUrl}/${id}`, asset)
  }

  // Get assets belonging to the current user
  async getMyAssets(params?: {
    limit?: number
    page?: number
  }): Promise<PaginatedAssetsResponseDto> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No user logged in')
    }

    return this.getAssets({
      ownerId: currentUser.uid,
      ...params,
    })
  }
}

export const assetService = new AssetService()
