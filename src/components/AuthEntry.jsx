import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ActionStatus from './ActionStatus'
import { useNotification } from '../context/NotificationContext'

export default function AuthEntry() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [isSignUp, setIsSignUp] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { signIn, signUp, loading } = useAuth()
  const notification = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('pending')
    setErrorMessage('')
    
    try {
      if (isSignUp) {
        // Validate passwords match
        if (password !== confirmPassword) {
          setStatus('error')
          setErrorMessage('Passwords do not match')
          return
        }
        
        // Sign up
        const result = await signUp(email, password)
        
        if (result.success) {
          setStatus('success')
          notification.success('Account created successfully! Welcome to ScholarSift.')
        } else {
          setStatus('error')
          setErrorMessage(result.error || 'Failed to create account')
        }
      } else {
        // Sign in
        const result = await signIn(email, password)
        
        if (result.success) {
          setStatus('success')
          notification.success('Signed in successfully!')
        } else {
          setStatus('error')
          setErrorMessage(result.error || 'Invalid email or password')
        }
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'An unexpected error occurred')
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-primary mb-2">ScholarSift</h1>
          <p className="text-gray-600">Instant insights from research papers, powered by AI</p>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="researcher@university.edu"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            {isSignUp && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            <ActionStatus 
              status={status} 
              message={errorMessage || undefined}
            />
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
            
            <p className="text-xs text-gray-500 mt-2">
              Demo mode: Any email/password combination will work
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
