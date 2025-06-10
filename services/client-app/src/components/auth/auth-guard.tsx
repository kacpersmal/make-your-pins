import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'

type AuthGuardProps = {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/',
}: AuthGuardProps) {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !currentUser) {
        navigate({ to: redirectTo })
      }
      setIsChecking(false)
    }
  }, [currentUser, loading, navigate, redirectTo, requireAuth])

  // Show nothing while checking authentication state
  if (loading || isChecking) {
    return null
  }

  // If authentication is required and user is not authenticated, return null
  // (navigation is handled in the useEffect)
  if (requireAuth && !currentUser) {
    return null
  }

  // If we want a page to be accessible only for non-authenticated users (like login page)
  // and the user is authenticated, redirect them
  if (!requireAuth && currentUser) {
    navigate({ to: '/' })
    return null
  }

  // Otherwise, render children
  return <>{children}</>
}
