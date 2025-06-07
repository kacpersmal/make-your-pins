import React, { useState } from 'react'
import { useAuth } from '../../lib/auth-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  // uniwerrsal
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  //register
  const [signUpFlag, setSignUpFlag] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const { signUp } = useAuth()
  //login
  const { signIn, signInWithGoogle } = useAuth()

  // register form handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      await signUp(email, password)
    } catch (err) {
      setError('Failed to create an account.')
      console.error(err)
    }
  }

  //Login form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signIn(email, password)
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
      console.error(err)
    }
  }
  //login with google
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl/80">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={!signUpFlag ? handleSubmit : handleRegisterSubmit}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  {!signUpFlag ? 'Welcome' : 'Create an account'}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {/* sign up change */}
                  {!signUpFlag ? 'Login to your account' : ''}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  // placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {!signUpFlag ? 'Forgot your password ?' : ''}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* confirm password only show when signing up */}
              {signUpFlag ? (
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    ></a>
                  </div>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              ) : (
                ''
              )}
              <Button type="submit" className="w-full">
                {signUpFlag ? 'Register' : 'Login'}
              </Button>
              {signUpFlag ? (
                ''
              ) : (
                <div>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="flex">
                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      type="button"
                      className="w-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                  </div>
                </div>
              )}
              {signUpFlag ? (
                ''
              ) : (
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSignUpFlag(true)
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1516571748831-5d81767b788d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
