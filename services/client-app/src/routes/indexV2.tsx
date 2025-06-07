import { AuthFormV2 } from '@/components/auth/auth-form-v2'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/indexV2')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm`}>
      <div className="flex h-full flex-col items-center justify-center p-6 md:p-10 ">
        <div className="w-full min-h-[70%] max-w-sm md:max-w-3xl ">
          <AuthFormV2 />
        </div>
      </div>
    </div>
  )
}
