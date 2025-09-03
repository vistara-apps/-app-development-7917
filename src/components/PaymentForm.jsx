import React, { useState } from 'react'
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initializePayment, SUBSCRIPTION_TIERS } from '../services/subscriptionService'
import ActionStatus from './ActionStatus'

export default function PaymentForm({ selectedTier = 'basic', onCancel }) {
  const [status, setStatus] = useState('idle')
  const [paymentUrl, setPaymentUrl] = useState(null)
  const { user } = useAuth()
  
  const tierDetails = SUBSCRIPTION_TIERS[selectedTier]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('pending')
    
    try {
      const result = await initializePayment(user.id, selectedTier)
      
      if (result.success) {
        setPaymentUrl(result.checkoutUrl)
        setStatus('success')
      } else {
        throw new Error(result.error || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-md">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Upgrade to {tierDetails.name}</h2>
          <p className="text-gray-600">${tierDetails.price}/month</p>
        </div>
      </div>

      {status === 'success' && paymentUrl ? (
        <div className="space-y-4">
          <div className="p-4 bg-success/10 rounded-md flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <p className="text-success">Payment session created successfully!</p>
          </div>
          
          <p className="text-gray-700">
            Click the button below to complete your payment and upgrade your subscription.
          </p>
          
          <div className="flex gap-3">
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-center"
            >
              Complete Payment
            </a>
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Plan Features:</h3>
            <ul className="space-y-2">
              {tierDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Monthly subscription</span>
              <span className="font-semibold">${tierDetails.price}/month</span>
            </div>
            <div className="text-xs text-gray-500">
              You can cancel your subscription at any time from your account settings.
            </div>
          </div>
          
          <ActionStatus status={status} />
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={status === 'pending'}
              className="btn-primary flex-1"
            >
              {status === 'pending' ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500">
            This is a demo application. No actual payment will be processed.
            In a production environment, this would connect to a payment processor like Stripe.
          </p>
        </div>
      </div>
    </div>
  )
}

