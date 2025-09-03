import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import Dashboard from './components/Dashboard'
import AuthEntry from './components/AuthEntry'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

function AppContent() {
  const { user, loading, initialized } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Add a slight delay to prevent flash of login screen
  useEffect(() => {
    if (initialized) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [initialized])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-4xl font-semibold text-primary mb-2">ScholarSift</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthEntry />
  }

  return (
    <AppShell>
      <ErrorBoundary fallbackMessage="Something went wrong with the dashboard. Please try refreshing the page.">
        <Dashboard />
      </ErrorBoundary>
    </AppShell>
  )
}

function App() {
  return (
    <ErrorBoundary 
      fallbackMessage="Something went wrong with the application. Please try refreshing the page."
      showDetails={false}
      resetable={false}
    >
      <NotificationProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <AppContent />
          </div>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App
