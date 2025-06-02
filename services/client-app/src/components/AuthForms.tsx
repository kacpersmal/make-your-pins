import React, { useState } from 'react'
import { useAuth } from '../lib/auth-context'
import { cn } from '../lib/utils'

interface AuthFormProps {
  className?: string
}

export const LoginForm = ({ className }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, signInWithGoogle } = useAuth()

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
    <div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md !text-red-500',
        className,
      )}
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export const SignupForm = ({ className }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md !text-red-500',
        className,
      )}
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export const UserProfile = ({ className }: AuthFormProps) => {
  const { currentUser, signOut, getIdToken } = useAuth()
  const [token, setToken] = useState('')

  const handleGetToken = async () => {
    const idToken = await getIdToken()
    setToken(idToken || '')
  }

  if (!currentUser) return null

  return (
    <div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md !text-red-500',
        className,
      )}
    >
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <p>
          <strong>UID:</strong> {currentUser.uid}
        </p>
      </div>

      <button
        onClick={handleGetToken}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
      >
        Get JWT Token
      </button>

      {token && (
        <div className="mb-4">
          <p className="font-bold">JWT Token:</p>
          <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md overflow-auto">
            <code className="text-xs break-all">{token}</code>
          </div>
        </div>
      )}

      <button
        onClick={signOut}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  )
}
