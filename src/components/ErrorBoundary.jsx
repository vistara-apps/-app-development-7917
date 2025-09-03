import React from 'react'
import { AlertTriangle } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // You could also log to an error monitoring service here
    // Example: logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="p-6 bg-error/5 rounded-lg border border-error/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-error/10 rounded-full">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {this.props.fallbackMessage || 'An unexpected error occurred. Please try again later.'}
          </p>
          
          {this.props.showDetails && (
            <div className="mb-4 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-40 text-xs font-mono">
              <p className="text-error font-semibold">{this.state.error?.toString()}</p>
              <p className="text-gray-700 mt-2">{this.state.errorInfo?.componentStack}</p>
            </div>
          )}
          
          <div className="flex justify-center gap-3">
            {this.props.resetable && (
              <button 
                onClick={this.handleReset}
                className="btn-primary"
              >
                Try Again
              </button>
            )}
            
            <button 
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    // If no error, render children normally
    return this.props.children
  }
}

export default ErrorBoundary

