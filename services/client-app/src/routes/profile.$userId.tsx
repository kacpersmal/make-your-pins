import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ProfileHeader from '@/components/profile/profile-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileController } from '@/components/profile/profile-controller'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAssets } from '@/hooks/use-assets'

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
  const [page, setPage] = useState(0)

  const { userId } = Route.useParams()
  const controller = useProfileController(userId)
  const { isLoading: isProfileQueryLoading, isError: isProfileQueryError } =
    controller

  const {
    data,
    isLoading: isAssetsQueryLoading,
    isError: isAssetsQueryError,
  } = useAssets({
    page,
    limit: 10,
    ownerId: userId,
  })

  if (isProfileQueryLoading || isAssetsQueryLoading) {
    return (
      <>
        <ProfileSkeleton />
        <div className="mt-8 md:mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-100" />
          ))}
        </div>
      </>
    )
  }

  if (isProfileQueryError || isAssetsQueryError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p>
          Failed to load user {isProfileQueryError ? 'profile' : 'assets'}.
          Please try again later.
        </p>
      </div>
    )
  }

  return (
    <>
      <ProfileHeader userId={userId} controller={controller} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.items.map((asset) => (
          <div key={asset.id} className="border rounded-md overflow-hidden">
            {asset.files[0]?.thumbnailPath && (
              <img
                src={
                  import.meta.env.VITE_PUBLIC_BUCKET_URL +
                  asset.files[0].thumbnailPath
                }
                alt={asset.name}
                className="w-full h-74 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{asset.name}</h3>
              <p className="text-gray-600 truncate">{asset.description}</p>
              <div className="flex mt-2">
                {asset.tags?.map((tag) => (
                  <span
                    key={tag.value}
                    className="px-2 py-1 text-xs bg-gray-200 rounded-md mr-2"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {data && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={data.page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {data.pages}
          </span>
          <button
            disabled={page >= data.pages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
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
