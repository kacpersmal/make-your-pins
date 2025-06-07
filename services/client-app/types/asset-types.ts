export enum AssetFileType {
  IMAGE = 'image',
}

export interface AssetTag {
  value: string
}

export interface AssetFile {
  fileName: string
  order?: number
  type: AssetFileType
  thumbnailName?: string
  path?: string
  thumbnailPath?: string
}

export interface AssetResponseDto {
  id: string
  name: string
  description: string
  files: Array<AssetFile>
  tags?: Array<AssetTag>
  ownerId: string
  timestamp: string
  updatedAt?: string
  upvotes: number
  downvotes: number
  views: number
}

export interface CreateAssetDto {
  id: string
  name: string
  description: string
  files: Array<AssetFile>
  tags?: Array<AssetTag>
  ownerId?: string
}

export interface UpdateAssetDto {
  name?: string
  description?: string
  files?: Array<AssetFile>
  tags?: Array<AssetTag>
}

export interface PaginatedAssetsResponseDto {
  items: Array<AssetResponseDto>
  total: number
  page: number
  limit: number
  pages: number
}
