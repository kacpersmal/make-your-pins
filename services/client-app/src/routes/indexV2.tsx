import { AuthForm } from '@/components/auth/auth-formv2'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/indexV2')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm`}>
      <div className="flex h-full flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
