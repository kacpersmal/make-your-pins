import type { AssetResponseDto } from '@/types/asset-types'
// import type { ReactNode } from 'react'
// import AssetDetailsModal from './asset-details-modal'
import { EllipsisVertical, Heart, Share2 } from 'lucide-react'
import { Button } from '../ui/button'
export default function AssetsThumbnailCard({
  asset,
}: {
  asset: AssetResponseDto
}) {
  return (
    <>
      <div className="h-full bg-black/10 rounded-md flex  flex-col  items-center  shadow-neutral-900 shadow-md/10 overflow-hidden">
        <div className="flex-1/7 w-full shrink-0">
          <ThumbnailTop asset={asset} />
        </div>
        <div className="flex-4/7 w-full overflow-hidden">
          {asset.files[0]?.thumbnailPath && <ThumbnailImage asset={asset} />}
        </div>
        <div className="flex-2/7 w-full">
          <ThumbnailBottom asset={asset} />
        </div>
      </div>
      {/* <AssetDetailsModal /> */}
    </>
  )
}

function ThumbnailTop({ asset }: { asset: AssetResponseDto }) {
  return (
    <div className=" flex justify-between items-center rounded-t-md p-2">
      <div className="flex gap-2 items-center">
        <img src={asset.owner.photoURL} alt="" className="w-8 rounded-[50%]" />
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold truncate">{asset.name}</h3>
          <p className="text-gray-600 text-xs">
            {asset.timestamp.slice(0, 10)}
          </p>
        </div>
      </div>
      <div>
        <Button variant={'ghost'}>
          <EllipsisVertical />
        </Button>
      </div>
    </div>
  )
}

function ThumbnailBottom({ asset }: { asset: AssetResponseDto }) {
  return (
    <div className="flex justify-between h-full flex-col p-2 relative">
      <p className="text-gray-600 text-md truncate overflow-hidden">
        {asset.description}
      </p>
      <div className="absolute flex gap-1 bottom-1">
        <Button variant={'ghost'} className="rounded-[50%]">
          <Share2 />
        </Button>
        <Button variant={'ghost'} className="rounded-[50%]">
          <Heart />
        </Button>
      </div>
    </div>
  )
}

function ThumbnailImage({ asset }: { asset: AssetResponseDto }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <img
        src={
          import.meta.env.VITE_PUBLIC_BUCKET_URL + asset.files[0].thumbnailPath
        }
        alt={asset.name}
        className="h-full object-cover"
      />
      {/* TAGS OVERLAY */}
      <div className="absolute left-2 bottom-1  flex flex-wrap gap-y-1">
        {asset.tags?.map((tag) => (
          <span
            key={tag.value}
            className=" text-xs bg-gray-200/50 backdrop-blur-sxs rounded-md p-1 mr-1"
          >
            {tag.value}
          </span>
        ))}
      </div>
    </div>
  )
}
