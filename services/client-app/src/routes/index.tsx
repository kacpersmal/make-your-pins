import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/components/auth/auth-container'
import { useAuth } from '@/lib/auth-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import AssetsContainer from '@/components/assets/assets-container'
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
      {/* <ScrollArea className="h-[93vh] w-full rounded-2xl relative"> */}
      <div className="h-[93vh] w-full rounded-2xl relative">
        <AssetsContainer />
      </div>
      {/* </ScrollArea> */}
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
