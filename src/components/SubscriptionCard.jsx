import React, { useState } from 'react'
import { Crown, Zap, ChevronRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { 
  SUBSCRIPTION_TIERS, 
  getSubscriptionTierDetails, 
  getSubscriptionUsage,
  hasReachedSummaryLimit
} from '../services/subscriptionService'
import PaymentForm from './PaymentForm'

export default function SubscriptionCard() {
  const { user } = useAuth()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [selectedTier, setSelectedTier] = useState('basic')

  // Plan icons mapping
  const planIcons = {
    free: Zap,
    basic: Zap,
    premium: Crown
  }

  // Plan colors mapping
  const planColors = {
    free: {
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    basic: {
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    premium: {
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  }

  // Get current plan details
  const currentTier = user?.subscriptionTier || 'free'
  const currentPlan = getSubscriptionTierDetails(currentTier)
  const Icon = planIcons[currentTier]
  const colorScheme = planColors[currentTier]
  
  // Get usage statistics
  const usage = getSubscriptionUsage(user)
  const reachedLimit = hasReachedSummaryLimit(user)

  // Handle upgrade button click
  const handleUpgradeClick = (tier) => {
    setSelectedTier(tier)
    setShowUpgrade(true)
  }

  // If showing payment form
  if (showUpgrade) {
    return (
      <PaymentForm 
        selectedTier={selectedTier} 
        onCancel={() => setShowUpgrade(false)} 
      />
    )
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${colorScheme.bgColor} rounded-md`}>
          <Icon className={`h-6 w-6 ${colorScheme.color}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          <p className={`font-medium ${colorScheme.color}`}>{currentPlan.name}</p>
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

      {/* Usage meter for limited plans */}
      {usage && !usage.isUnlimited && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Usage this month</span>
            <span>{usage.used}/{usage.limit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                reachedLimit ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(usage.percentage, 100)}%` }}
            />
          </div>
          
          {reachedLimit && (
            <div className="mt-2 p-2 bg-error/10 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-error flex-shrink-0 mt-0.5" />
              <p className="text-xs text-error">
                You've reached your monthly limit. Upgrade your plan to continue generating summaries.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Subscription management buttons */}
      {currentTier === 'free' && (
        <>
          <button 
            onClick={() => handleUpgradeClick('basic')}
            className="btn-primary w-full mb-3"
          >
            Upgrade to Basic - ${SUBSCRIPTION_TIERS.basic.price}/month
          </button>
          
          <button 
            onClick={() => handleUpgradeClick('premium')}
            className="btn-secondary w-full"
          >
            Upgrade to Premium - ${SUBSCRIPTION_TIERS.premium.price}/month
          </button>
        </>
      )}

      {currentTier === 'basic' && (
        <>
          <button 
            onClick={() => handleUpgradeClick('premium')}
            className="btn-primary w-full mb-3"
          >
            Upgrade to Premium - ${SUBSCRIPTION_TIERS.premium.price}/month
          </button>
          
          <button className="btn-secondary w-full">
            Manage Subscription
          </button>
        </>
      )}

      {currentTier === 'premium' && (
        <button className="btn-secondary w-full">
          Manage Subscription
        </button>
      )}
      
      {/* Available plans section */}
      {currentTier !== 'premium' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Available Plans</h4>
          
          {Object.entries(SUBSCRIPTION_TIERS)
            .filter(([tier]) => tier !== currentTier)
            .map(([tier, details]) => {
              const PlanIcon = planIcons[tier]
              return (
                <div 
                  key={tier}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer mb-2"
                  onClick={() => handleUpgradeClick(tier)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 ${planColors[tier].bgColor} rounded-md`}>
                      <PlanIcon className={`h-4 w-4 ${planColors[tier].color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{details.name}</p>
                      <p className="text-xs text-gray-500">${details.price}/month</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              )
            })
          }
        </div>
      )}
    </div>
  )
}
