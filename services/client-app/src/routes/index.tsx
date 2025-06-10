import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/components/auth/auth-container'
import { useAuth } from '@/lib/auth-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchInput } from '@/components/ui/search-input'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[93vh]">
        Loading...
      </div>
    )
  }

  return currentUser ? <AuthenticatedHome /> : <UnauthenticatedHome />
}

function AuthenticatedHome() {
  return (
    <div className="min-h-[93vh] bg-black/3 rounded-2xl">
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
          {/* Additional grid items... */}
        </div>
      </ScrollArea>
    </div>
  )
}

function UnauthenticatedHome() {
  return (
    <div className="h-screen">
      <AuthContainer />
    </div>
  )
}
