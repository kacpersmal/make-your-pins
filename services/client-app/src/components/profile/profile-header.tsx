import {
  Binoculars,
  UserMinus,
  UserPen,
  UserPlus,
  Users,
  Videotape,
} from 'lucide-react'
import { toast } from 'sonner'
import { ProfileEdit } from './profile-edit'
import { StatBadge } from './stat-badge'
import type { UseQueryResult } from '@tanstack/react-query'
import type { UserProfileDto } from '@/types/user-types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFollowUser, useUnfollowUser, useUser } from '@/hooks/use-users'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { SocialLinks } from '@/components/profile/social-links'
import { useIsMobile } from '@/hooks/use-mobile'

type Props = {
  userId: string
  userQuery: UseQueryResult<UserProfileDto, Error>
}

const ProfileHeader = ({ userId, userQuery }: Props) => {
  const auth = useAuth()
  const currentUser = auth.currentUser
  const isOwner = userId === currentUser?.uid
  const isMobile = useIsMobile()

  // Using the userQuery passed from the parent route component
  const user = userQuery.data
  const followMutation = useFollowUser()
  const unfollowMutation = useUnfollowUser()

  const handleFollow = async () => {
    try {
      await followMutation.mutateAsync(userId)
      toast('Success', {
        description: `You are now following ${user?.displayName || 'this user'}.`,
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
        description: `You have unfollowed ${user?.displayName || 'this user'}.`,
      })
    } catch (error) {
      toast('Error', {
        description: 'Failed to unfollow this user. Please try again.',
      })
    }
  }

  const isFollowing = user?.isFollowing || false
  const isLoading = followMutation.isPending || unfollowMutation.isPending

  return (
    <div className="w-full flex flex-col">
      {/* Background Banner */}
      <div
        className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: undefined,
        }}
      />

      {/* Profile Info Section */}
      <div className="relative px-4 sm:px-6 pb-4">
        {/* Profile Picture - centered on mobile, left-aligned on desktop */}
        <div
          className={`
          absolute
          ${isMobile ? 'left-1/2 transform -translate-x-1/2 -top-16' : '-top-16 left-6'}
          border-4 border-white dark:border-gray-900 rounded-full
          transition-all duration-300
        `}
        >
          <Avatar className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'}`}>
            <AvatarImage
              src={user?.photoURL || ''}
              alt={user?.displayName || 'Profile'}
            />
            <AvatarFallback>
              {(user?.displayName || 'U')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name and Bio Section - stack on mobile, side-by-side on desktop */}
        <div
          className={`
          ${isMobile ? 'mt-16 text-center' : 'ml-40 mt-2'}
          flex
          ${isMobile ? 'flex-col items-center' : 'justify-between items-start'}
        `}
        >
          <div className={isMobile ? 'w-full' : ''}>
            <div
              className={`flex ${isMobile ? 'flex-col items-center' : 'items-center gap-4'}`}
            >
              <h1 className="text-xl sm:text-2xl font-bold">
                {user?.displayName || 'Unknown User'}
              </h1>

              {/* Edit/Follow Button - full width on mobile */}
              <div className={`${isMobile ? 'w-full mt-2' : ''}`}>
                {isOwner ? (
                  <ProfileEdit
                    userId={userId}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className={isMobile ? 'w-full' : ''}
                      >
                        <UserPen className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    }
                  />
                ) : isFollowing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnfollow}
                    disabled={isLoading}
                    className={isMobile ? 'w-full' : ''}
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleFollow}
                    disabled={isLoading}
                    className={isMobile ? 'w-full' : ''}
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div
              className={`flex items-center ${isMobile ? 'justify-center' : ''} mt-1`}
            >
              <span className="text-sm text-gray-500">
                @{user?.displayName || userId}
              </span>
              <SocialLinks links={user?.socialLinks} />
            </div>

            <p
              className={`
              text-gray-600 dark:text-gray-300 mt-3
              ${isMobile ? 'text-center' : 'max-w-lg'}
            `}
            >
              {user?.bio ||
                (isOwner ? 'Add a bio to your profile' : 'No bio available')}
            </p>
          </div>
        </div>

        {/* Stats Section - flex wrap for mobile */}
        <div
          className={`
          flex flex-wrap justify-center sm:justify-start gap-2 sm:space-x-3
          mt-6
          ${isMobile ? 'pt-4' : ''}
        `}
        >
          <StatBadge
            icon={<Users />}
            label="Followers"
            value={user?.followersCount.toString() || '0'}
          />
          <StatBadge
            icon={<Binoculars />}
            label="Following"
            value={user?.followingCount.toString() || '0'}
          />
          <StatBadge
            icon={<Videotape />}
            label="Assets"
            value={user?.assetsCount.toString() || '0'}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
