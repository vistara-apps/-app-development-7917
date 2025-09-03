import React from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ActionStatus({ status, message, variant = 'default' }) {
  if (status === 'idle') return null

  const variants = {
    pending: {
      icon: Loader2,
      className: 'text-primary animate-spin',
      bgClassName: 'bg-primary/10',
      text: message || 'Processing...'
    },
    success: {
      icon: CheckCircle,
      className: 'text-success',
      bgClassName: 'bg-success/10',
      text: message || 'Success!'
    },
    error: {
      icon: XCircle,
      className: 'text-error',
      bgClassName: 'bg-error/10',
      text: message || 'Something went wrong. Please try again.'
    }
  }

  const config = variants[status]
  if (!config) return null

  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 p-3 rounded-md ${config.bgClassName} animate-fade-in`}>
      <Icon className={`h-5 w-5 ${config.className}`} />
      <span className={`text-sm font-medium ${config.className}`}>
        {config.text}
      </span>
    </div>
  )
}