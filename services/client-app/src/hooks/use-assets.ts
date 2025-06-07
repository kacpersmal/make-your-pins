import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assetService } from '../services/asset-service'
import { useAuth } from '../lib/auth-context'
import type { CreateAssetDto, UpdateAssetDto } from '../../types/asset-types'
// Keys for React Query
const ASSETS_KEYS = {
  all: ['assets'] as const,
  lists: () => [...ASSETS_KEYS.all, 'list'] as const,
  list: (filters: any) => [...ASSETS_KEYS.lists(), filters] as const,
  details: () => [...ASSETS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ASSETS_KEYS.details(), id] as const,
  myAssets: () => [...ASSETS_KEYS.all, 'my-assets'] as const,
}

// Hook to get all assets with filtering
export function useAssets(params?: {
  name?: string
  tag?: string
  ownerId?: string
  limit?: number
  page?: number
}) {
  return useQuery({
    queryKey: ASSETS_KEYS.list(params),
    queryFn: () => assetService.getAssets(params),
    enabled: true,
  })
}

// Hook to get a single asset by ID
export function useAsset(id: string) {
  return useQuery({
    queryKey: ASSETS_KEYS.detail(id),
    queryFn: () => assetService.getAssetById(id),
    enabled: !!id,
  })
}

// Hook to get assets belonging to the current user
export function useMyAssets(params?: { limit?: number; page?: number }) {
  const { currentUser } = useAuth()

  return useQuery({
    queryKey: [...ASSETS_KEYS.myAssets(), params],
    queryFn: () => assetService.getMyAssets(params),
    enabled: !!currentUser,
  })
}

// Hook to create a new asset
export function useCreateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (asset: Omit<CreateAssetDto, 'id' | 'ownerId'>) =>
      assetService.createAsset(asset),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ASSETS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ASSETS_KEYS.myAssets() })
    },
  })
}

// Hook to update an asset
export function useUpdateAsset(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (asset: UpdateAssetDto) => assetService.updateAsset(id, asset),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ASSETS_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: ASSETS_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ASSETS_KEYS.myAssets() })
    },
  })
}
