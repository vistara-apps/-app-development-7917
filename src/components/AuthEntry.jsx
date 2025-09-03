import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ActionStatus from './ActionStatus'

export default function AuthEntry() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const { signIn, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('pending')
    
    const result = await signIn(email, password)
    
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-primary mb-2">ScholarSift</h1>
          <p className="text-gray-600">Instant insights from research papers, powered by AI</p>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
          
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
            
            <ActionStatus status={status} />
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Demo credentials: any email/password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}