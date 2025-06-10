import { useState } from 'react'
import { toast } from 'sonner'
import { queryOptions } from '@tanstack/react-query'
import type { UpdateUserProfileDto } from '@/types/user-types'
import { usePageTitle } from '@/hooks/use-pageTitle'
import {
  useFollowUser,
  useUnfollowUser,
  useUpdateProfile,
  useUser,
} from '@/hooks/use-users'
import { useAuth } from '@/lib/auth-context'
import { userService } from '@/services/user-service'

export const getUserProfileQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', 'detail', userId],
    queryFn: () => userService.getUserProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useProfileController(userId: string) {
  const { currentUser } = useAuth()
  const userQuery = useUser(userId)
  const followMutation = useFollowUser()
  const unfollowMutation = useUnfollowUser()
  const updateProfile = useUpdateProfile()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  usePageTitle(
    userQuery.data?.displayName,
    userQuery.isLoading,
    userQuery.isError,
  )

  const isOwner = userId === currentUser?.uid
  const isFollowing = userQuery.data?.isFollowing || false
  const isActionLoading =
    followMutation.isPending ||
    unfollowMutation.isPending ||
    updateProfile.isPending

  const handleFollow = async () => {
    try {
      await followMutation.mutateAsync(userId)
      toast('Success', {
        description: `You are now following ${userQuery.data?.displayName || 'this user'}.`,
      })
    } catch (error) {
      toast('Error', {
        description: 'Failed to follow this user. Please try again.',
      })
    }
  }

  const handleUnfollow = async () => {
    try {
      await unfollowMutation.mutateAsync(userId)
      toast('Success', {
        description: `You have unfollowed ${userQuery.data?.displayName || 'this user'}.`,
      })
    } catch (error) {
      toast('Error', {
        description: 'Failed to unfollow this user. Please try again.',
      })
    }
  }

  const handleUpdateProfile = async (data: UpdateUserProfileDto) => {
    try {
      await updateProfile.mutateAsync(data)
      toast('Success', {
        description: 'Your profile has been updated.',
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      toast('Error', {
        description: 'Failed to update your profile. Please try again.',
      })
    }
  }

  return {
    userId,
    userQuery,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    user: userQuery.data,
    isOwner,
    isFollowing,
    isActionLoading,
    handleFollow,
    handleUnfollow,
    handleUpdateProfile,
    isEditDialogOpen,
    setIsEditDialogOpen,
    updateProfile,
  }
}

export type UseProfileControllerReturn = ReturnType<typeof useProfileController>
