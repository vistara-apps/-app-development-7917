import { updateUserProfile } from './supabaseService'

// Subscription tier definitions
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    summariesLimit: 5,
    features: ['5 summaries/month', 'Basic insights']
  },
  basic: {
    name: 'Basic',
    price: 10,
    summariesLimit: 50,
    features: ['50 summaries/month', 'Enhanced insights', 'Priority support']
  },
  premium: {
    name: 'Premium',
    price: 25,
    summariesLimit: Infinity,
    features: ['Unlimited summaries', 'Advanced insights', 'API access', 'Priority support']
  }
}

/**
 * Check if a user has reached their summary limit
 * @param {Object} user - User object with subscription data
 * @returns {boolean} - True if user has reached their limit
 */
export function hasReachedSummaryLimit(user) {
  if (!user) return true
  return user.summariesUsed >= user.summariesLimit
}

/**
 * Get subscription tier details
 * @param {string} tier - Subscription tier name
 * @returns {Object} - Subscription tier details
 */
export function getSubscriptionTierDetails(tier) {
  return SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
}

/**
 * Initialize Stripe payment
 * @param {string} userId - User ID
 * @param {string} tier - Subscription tier to upgrade to
 * @returns {Promise<Object>} - Payment session details
 */
export async function initializePayment(userId, tier) {
  try {
    // In a real implementation, this would call your backend API to create a Stripe checkout session
    // For demo purposes, we'll simulate a successful payment initialization
    
    console.log(`Initializing payment for user ${userId} to upgrade to ${tier} tier`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return mock checkout session URL
    return {
      success: true,
      checkoutUrl: `https://checkout.stripe.com/mock-session/${userId}/${tier}`
    }
  } catch (error) {
    console.error('Error initializing payment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Upgrade user subscription tier
 * @param {string} userId - User ID
 * @param {string} tier - Subscription tier to upgrade to
 * @returns {Promise<Object>} - Result of subscription upgrade
 */
export async function upgradeSubscription(userId, tier) {
  try {
    // Validate tier
    if (!SUBSCRIPTION_TIERS[tier]) {
      throw new Error(`Invalid subscription tier: ${tier}`)
    }
    
    // Update user profile with new subscription tier and reset usage
    const result = await updateUserProfile(userId, {
      subscriptionTier: tier,
      summariesUsed: 0,
      summariesLimit: SUBSCRIPTION_TIERS[tier].summariesLimit
    })
    
    if (!result.success) throw new Error(result.error)
    
    return { 
      success: true, 
      message: `Successfully upgraded to ${SUBSCRIPTION_TIERS[tier].name} tier`
    }
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Cancel user subscription
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result of subscription cancellation
 */
export async function cancelSubscription(userId) {
  try {
    // In a real implementation, this would call your payment provider's API to cancel the subscription
    
    // Downgrade user to free tier
    const result = await updateUserProfile(userId, {
      subscriptionTier: 'free',
      summariesLimit: SUBSCRIPTION_TIERS.free.summariesLimit
    })
    
    if (!result.success) throw new Error(result.error)
    
    return { 
      success: true, 
      message: 'Subscription successfully cancelled. You have been downgraded to the Free tier.'
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user's subscription usage statistics
 * @param {Object} user - User object with subscription data
 * @returns {Object} - Usage statistics
 */
export function getSubscriptionUsage(user) {
  if (!user) return null
  
  const tierDetails = getSubscriptionTierDetails(user.subscriptionTier)
  const usagePercentage = tierDetails.summariesLimit === Infinity 
    ? 0 
    : (user.summariesUsed / user.summariesLimit) * 100
  
  return {
    used: user.summariesUsed,
    limit: user.summariesLimit,
    percentage: usagePercentage,
    isUnlimited: tierDetails.summariesLimit === Infinity,
    remaining: tierDetails.summariesLimit === Infinity 
      ? Infinity 
      : user.summariesLimit - user.summariesUsed
  }
}

