import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import logo from '../logo.svg'
import { useAuth } from '../lib/auth-context'
import { LoginForm, SignupForm, UserProfile } from '../components/AuthForms'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { currentUser } = useAuth()
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />

        <div className="mt-8 max-w-md w-full">
          {currentUser ? (
            <UserProfile />
          ) : (
            <>
              {showSignup ? (
                <>
                  <SignupForm />
                  <p className="mt-4">
                    Already have an account?{' '}
                    <button
                      onClick={() => setShowSignup(false)}
                      className="text-[#61dafb] hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <LoginForm />
                  <p className="mt-4">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setShowSignup(true)}
                      className="text-[#61dafb] hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}
                  </p>
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-8">
          <a
            className="text-[#61dafb] hover:underline"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <span className="mx-2">|</span>
          <a
            className="text-[#61dafb] hover:underline"
            href="https://tanstack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TanStack
          </a>
        </div>
      </header>
    </div>
  )
}
