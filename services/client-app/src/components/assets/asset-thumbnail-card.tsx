import { EllipsisVertical, Heart, Share2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/button'
import type { AssetResponseDto } from '@/types/asset-types'
import AssetDetailsModal from './asset-details-modal'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const useTagSearch = () => {
  const navigate = useNavigate()

  return (tag: string) => {
    navigate({
      to: '/',
      search: { tag },
    })
  }
}

// Add this hook for profile navigation
const useProfileNavigation = () => {
  const navigate = useNavigate()

  return (userId: string) => {
    navigate({
      to: '/profile/$userId',
      params: { userId },
    })
  }
}

export default function AssetsThumbnailCard({
  asset,
}: {
  asset: AssetResponseDto
}) {
  const [detailFlag, setDetailFlag] = useState(false)
  return (
    <>
      <div className="h-full bg-black/10 rounded-md flex flex-col items-center shadow-neutral-900 shadow-md/10 overflow-hidden">
        <div className="flex-1/7 w-full shrink-0">
          <ThumbnailTop asset={asset} />
        </div>
        <div
          className="flex-4/7 w-full overflow-hidden"
          onClick={() => {
            setDetailFlag(true)
          }}
        >
          {asset.files[0]?.thumbnailPath && <ThumbnailImage asset={asset} />}
        </div>
        <div className="flex-2/7 w-full">
          <ThumbnailBottom asset={asset} />
        </div>
        <AnimatePresence>
          {detailFlag && (
            <motion.div
              className="z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AssetDetailsModal asset={asset} handler={setDetailFlag} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function ThumbnailTop({ asset }: { asset: AssetResponseDto }) {
  const navigateToProfile = useProfileNavigation()

  return (
    <div className="flex justify-between items-center rounded-t-md p-2">
      <div className="flex gap-2 items-center">
        <div
          onClick={() => navigateToProfile(asset.ownerId)}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <img
            src={asset.owner.photoURL}
            alt={asset.owner.displayName || ''}
            className="w-8 h-8 rounded-[50%] object-cover border border-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold truncate">{asset.name}</h3>

          <p className="text-gray-500 text-xs">
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

function ThumbnailImage({ asset }: { asset: AssetResponseDto }) {
  const handleTagClick = useTagSearch()

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <img
        src={
          import.meta.env.VITE_PUBLIC_BUCKET_URL + asset.files[0].thumbnailPath
        }
        alt={asset.name}
        className="h-full object-cover"
      />
      {/* TAGS OVERLAY - Now clickable */}
      <div className="absolute bottom-1 flex justify-center flex-wrap gap-y-1">
        {asset.tags?.map((tag) => (
          <span
            key={tag.value}
            className="text-xs bg-gray-200/80 backdrop-blur-sxs rounded-md p-1 mr-1 cursor-pointer hover:bg-gray-300/50"
            onClick={(e) => {
              e.stopPropagation()
              handleTagClick(tag.value)
            }}
          >
            {tag.value}
          </span>
        ))}
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
