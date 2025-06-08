import { Binoculars, UserMinus, UserPlus, Users, Videotape } from 'lucide-react'
import { toast } from 'sonner'
import { ProfileEdit } from './profile-edit'
import { StatBadge } from './stat-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFollowUser, useUnfollowUser, useUser } from '@/hooks/use-users'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { SocialLinks } from '@/components/profile/social-links'

type Props = {
  userId: string
}

const ProfileHeader = ({ userId }: Props) => {
  const auth = useAuth()
  const currentUser = auth.currentUser
  const isOwner = userId === currentUser?.uid

  const user = useUser(userId)
  const followMutation = useFollowUser()
  const unfollowMutation = useUnfollowUser()

  const handleFollow = async () => {
    try {
      await followMutation.mutateAsync(userId)
      toast('Success', {
        description: `You are now following ${user.data?.displayName || 'this user'}.`,
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
        description: `You have unfollowed ${user.data?.displayName || 'this user'}.`,
      })
    } catch (error) {
      toast('Error', {
        description: 'Failed to unfollow this user. Please try again.',
      })
    }
  }

  const isFollowing = user.data?.isFollowing || false
  const isLoading = followMutation.isPending || unfollowMutation.isPending

  return (
    <div className="w-full flex flex-col">
      {/* Background Banner */}
      <div
        className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Profile Info Section */}
      <div className="relative px-6 pb-4">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-6 border-4 border-white dark:border-gray-900 rounded-full">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={user.data?.photoURL || ''}
              alt={user.data?.displayName || 'Profile'}
            />
            <AvatarFallback>
              {(user.data?.displayName || 'U')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name and Bio Section */}
        <div className="ml-40 mt-2 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">
                {user.data?.displayName || 'Unknown User'}
              </h1>

              {/* Edit Button (for owner) or Follow Buttons (for others) */}
              {isOwner ? (
                <ProfileEdit userId={userId} />
              ) : isFollowing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnfollow}
                  disabled={isLoading}
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

            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500">
                @{user.data?.displayName || userId}
              </span>
              <SocialLinks links={user.data?.socialLinks} />
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-lg">
              {user.data?.bio ||
                (isOwner ? 'Add a bio to your profile' : 'No bio available')}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex space-x-3 mt-6">
          <StatBadge
            icon={<Users />}
            label="Followers"
            value={user.data?.followersCount.toString() || '0'}
          />
          <StatBadge
            icon={<Binoculars />}
            label="Following"
            value={user.data?.followingCount.toString() || '0'}
          />
          <StatBadge
            icon={<Videotape />}
            label="Assets"
            value={user.data?.assetsCount.toString() || '0'}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
