import AssetsThumbnailCard from './asset-thumbnail-card'
import { useAssets } from '@/hooks/use-assets'
import LoadingCircleSpinner from '../ui/loading-circle'
import { animate, AnimatePresence, motion } from 'framer-motion'
export default function AssetsGrid({ page }: { page: number }) {
  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 18,
  })

  //   if (isLoading) {
  //     return (
  //       <div className="  h-full w-full">
  //         <LoadingCircleSpinner />
  //       </div>
  //     )
  //   }

  //   if (isError) {
  //     return (
  //       <div className=" h-full w-full">
  //         Error loading assets: {error.message}
  //       </div>
  //     )
  //   }
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
          className="grid h-full gap-5 w-full grid-rows-3 grid-cols-6 p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {data?.items.map((asset) => {
            console.log(asset)
            return <AssetsThumbnailCard assetId={asset.id} key={asset.id} />
          })}
        </motion.div>
      )}
    </>
  )
}
