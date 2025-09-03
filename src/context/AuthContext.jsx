import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signIn as supabaseSignIn, 
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getCurrentSession,
  updateUserProfile
} from '../services/supabaseService'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Check for existing session on initial load
  useEffect(() => {
    async function loadSession() {
      try {
        const { success, user } = await getCurrentSession()
        if (success && user) {
          setUser(user)
        }
      } catch (error) {
        console.error('Error loading session:', error)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    loadSession()
  }, [])

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const result = await supabaseSignIn(email, password)
      if (result.success) {
        setUser(result.user)
      }
      return result
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password) => {
    setLoading(true)
    try {
      const result = await supabaseSignUp(email, password)
      if (result.success) {
        // After signup, sign in the user
        return await signIn(email, password)
      }
      return result
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { success } = await supabaseSignOut()
      if (success) {
        setUser(null)
      }
      return { success }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Update user profile data
  const updateUser = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      const result = await updateUserProfile(user.id, updates)
      if (result.success) {
        // Update local user state with new values
        setUser(prev => ({
          ...prev,
          ...updates
        }))
      }
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Increment summaries used count
  const incrementSummariesUsed = async () => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    // Update local state immediately for better UX
    setUser(prev => ({
      ...prev,
      summariesUsed: prev.summariesUsed + 1
    }))
    
    // Then update in database
    return await updateUser({ summariesUsed: user.summariesUsed + 1 })
  }

  const value = {
    user,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateUser,
    incrementSummariesUsed
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
