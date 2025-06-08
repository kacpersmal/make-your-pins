import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user-service'
import { useAuth } from '../lib/auth-context'
import type { UpdateUserProfileDto, UserQueryParams } from '../types/user-types'

// Query keys for React Query
const USERS_KEYS = {
  all: ['users'] as const,
  lists: () => [...USERS_KEYS.all, 'list'] as const,
  list: (filters: UserQueryParams) => [...USERS_KEYS.lists(), filters] as const,
  details: () => [...USERS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USERS_KEYS.details(), id] as const,
}

/**
 * Hook to get a user profile by ID
 * @param userId User ID to fetch
 * @returns Query result with user profile
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: USERS_KEYS.detail(userId),
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId,
  })
}

/**
 * Hook to list users with filtering and pagination
 * @param params Query parameters
 * @returns Query result with paginated user profiles
 */
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: USERS_KEYS.list(params || {}),
    queryFn: () => userService.listUsers(params),
  })
}

/**
 * Hook to follow a user
 * @returns Mutation for following a user
 */
export function useFollowUser() {
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()

  return useMutation({
    mutationFn: (targetUserId: string) => userService.followUser(targetUserId),
    onSuccess: (data) => {
      // Invalidate the target user's profile
      queryClient.invalidateQueries({
        queryKey: USERS_KEYS.detail(data.targetUserId),
      })

      // Invalidate the current user's profile
      if (currentUser) {
        queryClient.invalidateQueries({
          queryKey: USERS_KEYS.detail(currentUser.uid),
        })
      }

      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() })

      // Invalidate feed data
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}

/**
 * Hook to unfollow a user
 * @returns Mutation for unfollowing a user
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()

  return useMutation({
    mutationFn: (targetUserId: string) =>
      userService.unfollowUser(targetUserId),
    onSuccess: (data) => {
      // Invalidate the target user's profile
      queryClient.invalidateQueries({
        queryKey: USERS_KEYS.detail(data.targetUserId),
      })

      // Invalidate the current user's profile
      if (currentUser) {
        queryClient.invalidateQueries({
          queryKey: USERS_KEYS.detail(currentUser.uid),
        })
      }

      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.lists() })

      // Invalidate feed data
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}

/**
 * Hook to update current user profile
 * @returns Mutation for updating profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()

  return useMutation({
    mutationFn: (data: UpdateUserProfileDto) => {
      // Check if user is authenticated before making the API call
      if (!currentUser) {
        throw new Error('You must be signed in to update your profile')
      }

      return userService.updateProfile(data, currentUser.uid)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.detail(data.id) })
    },
  })
}
