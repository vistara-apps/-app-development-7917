import React, { useState } from 'react'
import AppShell from './components/AppShell'
import Dashboard from './components/Dashboard'
import AuthEntry from './components/AuthEntry'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { user } = useAuth()

  if (!user) {
    return <AuthEntry />
  }

  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AppContent />
      </div>
    </AuthProvider>
  )
}

export default App