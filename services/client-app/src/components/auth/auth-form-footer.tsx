import { useState } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '@/lib/auth-context'

import AuthFormLoginButton from './auth-form-media-button'
export default function AuthFormFooter() {
  const [error, setError] = useState('')
  const { signInWithGoogle } = useAuth()
  const handleGoogleSignIn = async () => {
    setError('')

    try {
      await signInWithGoogle()
    } catch (err) {
      setError('Failed to sign in with Google.')
      console.error(err)
    }
  }
  return (
    <>
      <div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <AuthFormLoginButton disabled={true} mediaSingIn="meta" />
          <AuthFormLoginButton
            handler={handleGoogleSignIn}
            mediaSingIn="google"
          />
          <AuthFormLoginButton disabled={true} mediaSingIn="git" />
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          Sign up
        </Button>
      </div>
    </>
  )
}
