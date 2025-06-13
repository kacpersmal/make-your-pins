import { AnimatePresence, motion } from 'framer-motion'
import LoadingCircleSpinner from '../ui/loading-circle'
import AssetsThumbnailCard from './asset-thumbnail-card'
import { useAssets } from '@/hooks/use-assets'

export default function AssetsGrid({
  page,
  tagFilter,
}: {
  page: number
  tagFilter?: string
}) {
  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 10,
    tag: tagFilter,
  })

  // Prefetch next page for smoother pagination
  useAssets({
    page: page + 1,
    limit: 10,
    tag: tagFilter,
  })

  if (isError) {
    return (
      <div className="h-full w-full">Error loading assets: {error.message}</div>
    )
  }

  return (
    <>
      {isLoading ? (
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
      ) : (
        <motion.div
          key={`${page}-${tagFilter}`}
          className="grid h-full gap-5 w-full grid-rows-2 grid-cols-5 p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {data?.items.length === 0 ? (
            <div className="col-span-5 text-center mt-12">
              No assets found{tagFilter ? ` with tag "${tagFilter}"` : ''}
            </div>
          ) : (
            data?.items.map((asset) => {
              return <AssetsThumbnailCard asset={asset} key={asset.id} />
            })
          )}
        </motion.div>
      )}
    </>
  )
}
