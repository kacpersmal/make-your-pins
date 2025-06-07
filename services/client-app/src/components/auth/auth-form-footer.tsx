import { Button } from '../ui/button'
import AuthFormLoginButton from './auth-form-login-button'
export default function AuthFormFooter() {
  return (
    <>
      <div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <AuthFormLoginButton mediaSingIn="google" />
          <AuthFormLoginButton mediaSingIn="meta" />
          <AuthFormLoginButton mediaSingIn="git" />
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account? <Button variant="ghost">Sign up</Button>
      </div>
    </>
  )
}
