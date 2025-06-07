import LoginModal from '@/components/auth/auth-container'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from '@/components/ui/search-input'
export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentUser } = useAuth()

  return (
    <div className=" min-h-[93vh] bg-black/3 rounded-2xl ">
      <ScrollArea className="h-[93vh] w-full rounded-2xl relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-5 xl:grid-cols-6 rounded-2xl">
          <SearchInput />
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
          <LoginModal className="" />{' '}
        </div>
      )}
    </div>
  )
}
