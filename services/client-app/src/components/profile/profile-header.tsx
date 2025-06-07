import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/use-users'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  UserPen,
  UserPlus,
  UserMinus,
  Binoculars,
  Users,
  Videotape,
} from 'lucide-react'

type Props = {
  userId: string
}

const StatBadge = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => {
  return (
    <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
      <span className="text-gray-600 dark:text-gray-300">{icon}</span>
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}

const ProfileHeader = ({ userId }: Props) => {
  const auth = useAuth()
  const currentUser = auth.currentUser
  const isOwner = userId == currentUser?.uid

  const user = useUser(userId)

  return (
    <div className="w-full flex flex-col">
      {/* Background Banner */}
      <div
        className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative"
        style={{
          backgroundImage: user.data?.bannerURL
            ? `url(${user.data.bannerURL})`
            : undefined,
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
                <Button variant="outline" size="sm">
                  <UserPen className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : user.data?.isFollowing ? (
                <Button variant="outline" size="sm">
                  <UserMinus className="h-4 w-4 mr-2" />
                  Unfollow
                </Button>
              ) : (
                <Button variant="default" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              @{user.data?.displayName || userId}
            </p>

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
            value={user.data?.followersCount?.toString() || '0'}
          />
          <StatBadge
            icon={<Binoculars />}
            label="Following"
            value={user.data?.followingCount?.toString() || '0'}
          />
          <StatBadge
            icon={<Videotape />}
            label="Assets"
            value={user.data?.assetsCount?.toString() || '0'}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
