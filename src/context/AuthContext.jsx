import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser({
        id: '1',
        email,
        subscriptionTier: 'free',
        summariesUsed: 0,
        summariesLimit: 5
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signOut
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