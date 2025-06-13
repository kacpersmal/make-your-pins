import { createFileRoute } from '@tanstack/react-router'
import ProfileHeader from '@/components/profile/profile-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileController } from '@/components/profile/profile-controller'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useMyAssets } from '@/hooks/use-assets'
import { useState } from 'react'
import AssetsThumbnailCard from '@/components/assets/asset-thumbnail-card'
import { AnimatePresence, motion } from 'framer-motion'
import LoadingCircleSpinner from '../components/ui/loading-circle'
import AssetsPageControll from '@/components/assets/assets-page-controll'

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
  const { isLoading: isProfileQueryLoading, isError: isProfileQueryError } = controller

  const { data, isLoading: isAssetsQueryLoading, isError: isAssetsQueryError } = useMyAssets({
    page,
    limit: 10
  })

  if (isProfileQueryLoading || isAssetsQueryLoading) {
    return (
      <>
        <ProfileSkeleton />
        <div className="h-[50vh]">
        <AnimatePresence>
          <motion.div
            className="h-full w-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingCircleSpinner />
          </motion.div>
        </AnimatePresence>
        </div>
      </>
    )
    
  }

  if (isProfileQueryError || isAssetsQueryError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p>Failed to load user {isProfileQueryError ? 'profile' : 'assets'}. Please try again later.</p>
      </div>
    )
  }

  return (
    <>
      <ProfileHeader userId={userId} controller={controller} />
      <motion.div
          key={page}
          className="grid min-h-[90vh] gap-5 w-full grid-rows-2 grid-cols-5 p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {data?.items.map((asset) => {
            console.log(asset)
            return <AssetsThumbnailCard asset={asset} key={asset.id} />
          })}
      </motion.div>
      <AssetsPageControll
            page={page}
            lastPage={data?.pages}
            onPageChange={setPage}
      />
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
