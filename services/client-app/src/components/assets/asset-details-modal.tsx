import { X } from 'lucide-react'
import { Button } from '../ui/button'
import type { AssetResponseDto } from '@/types/asset-types'
export default function AssetDetailsModal({
  handler,
  asset,
}: {
  handler: React.Dispatch<React.SetStateAction<boolean>>
  asset: AssetResponseDto
}) {
  console.log(asset)

  return (
    <div
      className={`fixed inset-0 z-50 w-full h-full flex justify-center items-center`}
    >
      <div className="h-[70%] w-[60%] flex justify-between items-center rounded-2xl shadow-md   bg-[#C4C5DA] [background:radial-gradient(125%_125%_at_50%_10%,#fff_10%,#616E9A_110%)] p-4 relative">
        <div className="absolute top-2 right-2">
          <Button
            variant={'ghost'}
            onClick={() => {
              handler(false)
            }}
          >
            <X />
          </Button>
        </div>
        <div className="bg-gray-100/70 h-[90%] max-h-full flex-2/3 rounded-2xl mr-auto flex flex-col justify-center p-2 m-2 shadow-2xl">
          <div className=" flex-2/3 max-h-full flex items-center justify-center rounded-2xl grow-0 ">
            <img
              className="rounded-2xl object-contain h-96 mt-2"
              src={
                import.meta.env.VITE_PUBLIC_BUCKET_URL + asset?.files[0].path
              }
              alt=""
            />

            {}
          </div>
          <div className=" flex-1/3 flex flex-col items-center justify-cente rounded-2xl p-2 m-2 shadow-xl">
            <div className="w-full bg-neutral-500/10 flex-2/3 flex items-center justify-center p-2 m-2 rounded-xl">
              {asset?.description}
            </div>
            <div className="w-full bg-neutral-500/10 flex-1/3 justify-center flex items-center p-2 m-2 rounded-xl ">
              {asset.tags?.map((tag) => (
                <AssetDetailTag key={tag.value}>{tag.value}</AssetDetailTag>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-100/70 h-[90%] flex-1/3 flex-col rounded-2xl flex items-center justify-center m-2 p-2 shadow-2xl">
          <div className="bg-neutral-500/10 rounded-xl flex-1/5 w-full flex items-center justify-center m-2 p-2 shadow-xl">
            Profile
          </div>
          <div className="bg-neutral-500/10 rounded-xl flex-4/5 w-full flex items-center justify-center m-2 p-2 shadow-xl">
            Coments
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
function AssetDetailTag({ children }: { children?: ReactNode }) {
  return (
    <div className=" text-xs bg-gray-200/30 rounded-md p-1 mr-2">
      {children}
    </div>
  )
}
