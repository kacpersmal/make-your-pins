import { createFileRoute } from '@tanstack/react-router'
import ProfileHeader from '@/components/profile/profile-header'

export const Route = createFileRoute('/profile/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()

  return (
    <>
      <ProfileHeader userId={userId} />
    </>
  )
}
