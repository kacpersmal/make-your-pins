import { LoginForm } from '@/components/auth/auth-form'
export default function LoginModal({ className }: { className: string }) {
  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-sm ${className}`}>
      <div className="flex h-full flex-col items-center justify-center p-6 md:p-10 ">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
