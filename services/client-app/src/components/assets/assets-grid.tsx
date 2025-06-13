import AssetsThumbnailCard from './asset-thumbnail-card'
import { useAssets } from '@/hooks/use-assets'
import LoadingCircleSpinner from '../ui/loading-circle'
import { AnimatePresence, motion } from 'framer-motion'
export default function AssetsGrid({ page }: { page: number }) {
  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 10,
  })

  useAssets({
    page: page + 1,
    limit: 10,
  })
  if (isError) {
    return (
      <div className=" h-full w-full">
        Error loading assets: {error.message}
      </div>
    )
  }
  return (
    <>
      {isLoading ? (
        <AnimatePresence>
          <motion.div
            className="  h-full w-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingCircleSpinner />
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          key={page}
          className="grid h-full gap-5 w-full grid-rows-2 grid-cols-5 p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {data?.items.map((asset) => {
            console.log(asset)
            return <AssetsThumbnailCard asset={asset} key={asset.id} />
          })}
        </motion.div>
      )}
    </>
  )
}
