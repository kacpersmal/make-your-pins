import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/components/auth/auth-container'
import { useAuth } from '@/lib/auth-context'
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
    <div className="min-h-[92vh] bg-black/3 rounded-2xl">
      <div className="h-[89vh] w-full rounded-2xl relative">
        <AssetsContainer />
      </div>
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
