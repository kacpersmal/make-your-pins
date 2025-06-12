import AssetsThumbnailCard from './asset-thumbnail-card'

import { useAssets } from '@/hooks/use-assets'
export default function AssetsGrid({ page }: { page: number }) {
  const { data, isLoading, isError, error } = useAssets({
    page,
    limit: 18,
  })

  if (isLoading) {
    return <div className=" h-full w-full">Loading assets...</div>
  }

  if (isError) {
    return (
      <div className=" h-full w-full">
        Error loading assets: {error.message}
      </div>
    )
  }
  return (
    <div className="grid h-full gap-5 w-full grid-rows-3 grid-cols-6 p-4">
      {data?.items.map((asset) => {
        console.log(asset)
        return <AssetsThumbnailCard assetId={asset.id} key={asset.id} />
      })}
    </div>
  )
}
