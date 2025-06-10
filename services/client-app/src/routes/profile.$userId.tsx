import { createFileRoute } from '@tanstack/react-router'
import ProfileHeader from '@/components/profile/profile-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileController } from '@/components/profile/profile-controller'
import { AuthGuard } from '@/components/auth/auth-guard'

export const Route = createFileRoute('/profile/$userId')({
  component: ProtectedProfilePage,
})

function ProtectedProfilePage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/">
      <ProfilePage />
    </AuthGuard>
  )
}

function ProfilePage() {
  const { userId } = Route.useParams()
  const controller = useProfileController(userId)
  const { isLoading, isError } = controller

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p>Failed to load user profile. Please try again later.</p>
      </div>
    )
  }

  return (
    <>
      <ProfileHeader userId={userId} controller={controller} />
    </>
  )
}

function ProfileSkeleton() {
  return (
    <div className="w-full flex flex-col">
      {/* Background Banner Skeleton */}
      <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />

      {/* Profile Info Section */}
      <div className="relative px-4 sm:px-6 pb-4">
        {/* Avatar Skeleton */}
        <div className="absolute -top-16 left-6 border-4 border-white dark:border-gray-900 rounded-full">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>

        {/* Content Skeleton */}
        <div className="ml-40 mt-2">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-4" />
        </div>
      </div>
    </div>
  )
}
