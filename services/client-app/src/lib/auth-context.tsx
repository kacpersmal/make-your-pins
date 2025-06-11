import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from './firebase-config'
import type { User, UserCredential } from 'firebase/auth'
import type { ReactNode } from 'react'

export interface AuthContextType {
  currentUser: User | null
  signUp: (email: string, password: string) => Promise<UserCredential>
  signIn: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  signOut: () => Promise<void>
  getIdToken: () => Promise<string | null>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  function signOut() {
    return firebaseSignOut(auth)
  }

  async function getIdToken() {
    if (!currentUser) return null
    return currentUser.getIdToken(true)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    getIdToken,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
