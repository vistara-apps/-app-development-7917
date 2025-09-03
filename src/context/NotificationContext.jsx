import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// Create context
const NotificationContext = createContext({})

// Notification types and their configurations
const NOTIFICATION_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/20',
    iconColor: 'text-success'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-error/10',
    textColor: 'text-error',
    borderColor: 'border-error/20',
    iconColor: 'text-error'
  },
  info: {
    icon: Info,
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
    borderColor: 'border-primary/20',
    iconColor: 'text-primary'
  }
}

// Generate a unique ID for each notification
const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  // Add a new notification
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = generateId()
    const newNotification = {
      id,
      message,
      type,
      duration
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remove notification after duration
    if (duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }, [])

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  // Shorthand methods for different notification types
  const success = useCallback((message, duration) => {
    return addNotification(message, 'success', duration)
  }, [addNotification])

  const error = useCallback((message, duration) => {
    return addNotification(message, 'error', duration)
  }, [addNotification])

  const info = useCallback((message, duration) => {
    return addNotification(message, 'info', duration)
  }, [addNotification])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  )
}

// Notification container component
function NotificationContainer({ notifications, removeNotification }) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => {
        const config = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.info
        const Icon = config.icon
        
        return (
          <div 
            key={notification.id}
            className={`flex items-start p-4 rounded-lg border shadow-md animate-slide-up ${config.bgColor} ${config.borderColor}`}
          >
            <div className="flex-shrink-0 mr-3">
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div className="flex-1 mr-2">
              <p className={`text-sm font-medium ${config.textColor}`}>{notification.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// Custom hook to use the notification context
export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext

