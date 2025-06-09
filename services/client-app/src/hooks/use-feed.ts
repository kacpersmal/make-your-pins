import { useQuery } from '@tanstack/react-query'
import { feedService } from '../services/feed-service'
import { useAuth } from '../lib/auth-context'
import type { FeedQueryParams } from '../types/user-types'

// Query keys for React Query
const FEED_KEYS = {
  all: ['feed'] as const,
  list: (params?: FeedQueryParams) => [...FEED_KEYS.all, params] as const,
}

/**
 * Hook to get the current user's feed
 * @param params Query parameters (limit, page)
 * @returns Query result with feed items
 */
export function useFeed(params?: FeedQueryParams) {
  const { currentUser } = useAuth()

  return useQuery({
    queryKey: FEED_KEYS.list(params),
    queryFn: () => feedService.getFeed(params),
    enabled: !!currentUser,
  })
}
