import { X } from 'lucide-react'
import { Button } from '../ui/button'

export default function AssetDetailsModal() {
  return (
    <div
      className={`fixed inset-0 z-50 w-full h-full flex justify-center items-center`}
    >
      <div className="h-[70%] w-[60%] flex justify-between items-center rounded-2xl shadow-md  backdrop-blur bg-[#C4C5DA]/8 p-6 relative">
        <div className="absolute top-2 right-2">
          <Button variant={'ghost'}>
            <X />
          </Button>
        </div>
        <div className="bg-neutral-600 h-[90%] flex-2/3 rounded-2xl mr-auto flex flex-col justify-center p-2 m-2 ">
          <div className=" flex-2/3 flex items-center justify-center  bg-neutral-800/30 rounded-2xl p-2 m-2 ">
            Main Image{' '}
          </div>
          <div className=" flex-1/3 flex flex-col items-center justify-center bg-neutral-800/30 rounded-2xl p-2 m-2">
            <div className="w-full  bg-neutral-900/20 flex-2/3 flex items-center justify-center p-2 m-2 rounded-xl">
              description
            </div>
            <div className="w-full bg-neutral-900/20 flex-1/3 flex items-center p-2 m-2 rounded-xl ">
              <AssetDetailTag> #tag </AssetDetailTag>
              <AssetDetailTag> #tag </AssetDetailTag>
              <AssetDetailTag> #tag </AssetDetailTag>
            </div>
          </div>
        </div>
        <div className="bg-neutral-600 h-[90%] flex-1/3 flex-col rounded-2xl flex items-center justify-center m-2 p-2">
          <div className="bg-neutral-900/20 rounded-xl flex-1/5 w-full flex items-center justify-center m-2 p-2">
            Profile
          </div>
          <div className="bg-neutral-900/20 rounded-xl flex-4/5 w-full flex items-center justify-center m-2 p-2">
            Coments
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
function AssetDetailTag({ children }: { children: ReactNode }) {
  return (
    <div className=" text-xs bg-gray-200/30 rounded-md p-1 mr-2">
      {children}
    </div>
  )
}
