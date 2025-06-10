import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/components/auth/auth-container'
import { useAuth } from '@/lib/auth-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from '@/components/ui/search-input'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import UploadModal from '@/components/uploadProcess/upload-modal'
import { useState } from 'react'
export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentUser } = useAuth()
  const [isClosed, setIsClosed] = useState(false)

  function handleUploadFlag() {
    setIsClosed(!isClosed)
  }

  return (
    <>
      <div className=" min-h-[93vh] bg-black/3 rounded-2xl">
        <ScrollArea className="h-[93vh] w-full rounded-2xl relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-5 xl:grid-cols-6 rounded-2xl">
            <SearchInput />
            <div className="fixed z-20  top-5 right-5">
              <Button onClick={handleUploadFlag}>
                <Upload />
              </Button>
              {isClosed ? '' : <UploadModal handler={handleUploadFlag} />}
            </div>
            {/* simulation only for layout*/}
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
            <div className="bg-black/10 h-[42vh] rounded-2xl"></div>
          </div>
        </ScrollArea>

        {currentUser ? (
          ''
        ) : (
          <div className="h-screen">
            <AuthContainer />{' '}
          </div>
        )}
      </div>
    </>
  )
}
