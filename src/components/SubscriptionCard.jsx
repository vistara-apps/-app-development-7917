import React from 'react'
import { Crown, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SubscriptionCard() {
  const { user } = useAuth()

  const plans = {
    free: {
      name: 'Free',
      icon: Zap,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: ['5 summaries/month', 'Basic insights']
    },
    basic: {
      name: 'Basic',
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      features: ['50 summaries/month', 'Enhanced insights', 'Priority support']
    },
    premium: {
      name: 'Premium',
      icon: Crown,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      features: ['Unlimited summaries', 'Advanced insights', 'API access', 'Priority support']
    }
  }

  const currentPlan = plans[user?.subscriptionTier] || plans.free
  const Icon = currentPlan.icon

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${currentPlan.bgColor} rounded-md`}>
          <Icon className={`h-6 w-6 ${currentPlan.color}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          <p className={`font-medium ${currentPlan.color}`}>{currentPlan.name}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {currentPlan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {user?.subscriptionTier === 'free' && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Usage this month</span>
              <span>{user.summariesUsed}/{user.summariesLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(user.summariesUsed / user.summariesLimit) * 100}%` }}
              />
            </div>
          </div>
          
          <button className="btn-primary w-full mb-3">
            Upgrade to Basic - $10/month
          </button>
          
          <button className="btn-secondary w-full">
            View All Plans
          </button>
        </>
      )}

      {user?.subscriptionTier !== 'free' && (
        <button className="btn-secondary w-full">
          Manage Subscription
        </button>
      )}
    </div>
  )
}