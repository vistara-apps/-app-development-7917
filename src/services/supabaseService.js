import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * User Authentication Functions
 */

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Result of sign up operation
 */
export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // Create initial user profile with free tier
    if (data?.user) {
      await createUserProfile(data.user.id, {
        email: data.user.email,
        subscriptionTier: 'free',
        summariesUsed: 0,
        summariesLimit: 5
      })
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error signing up:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Result of sign in operation
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile data
    const userProfile = await getUserProfile(data.user.id)
    
    return { 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        ...userProfile
      }
    }
  } catch (error) {
    console.error('Error signing in:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Sign out the current user
 * @returns {Promise<Object>} - Result of sign out operation
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get the current user session
 * @returns {Promise<Object>} - Current user session or null
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    
    if (data.session) {
      // Get user profile data
      const userProfile = await getUserProfile(data.session.user.id)
      
      return { 
        success: true, 
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          ...userProfile
        }
      }
    }
    
    return { success: false, user: null }
  } catch (error) {
    console.error('Error getting session:', error)
    return { success: false, error: error.message, user: null }
  }
}

/**
 * User Profile Functions
 */

/**
 * Create a new user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - User profile data
 * @returns {Promise<Object>} - Result of profile creation
 */
export async function createUserProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          user_id: userId,
          email: profileData.email,
          subscription_tier: profileData.subscriptionTier,
          summaries_used: profileData.summariesUsed,
          summaries_limit: profileData.summariesLimit
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a user's profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile data
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    
    // Convert from snake_case to camelCase for frontend use
    return {
      subscriptionTier: data.subscription_tier,
      summariesUsed: data.summaries_used,
      summariesLimit: data.summaries_limit
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Update a user's profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile data to update
 * @returns {Promise<Object>} - Result of profile update
 */
export async function updateUserProfile(userId, updates) {
  try {
    // Convert from camelCase to snake_case for database
    const dbUpdates = {}
    if (updates.subscriptionTier) dbUpdates.subscription_tier = updates.subscriptionTier
    if (updates.summariesUsed !== undefined) dbUpdates.summaries_used = updates.summariesUsed
    if (updates.summariesLimit !== undefined) dbUpdates.summaries_limit = updates.summariesLimit
    
    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('user_id', userId)
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Increment the number of summaries used by a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated user profile
 */
export async function incrementSummariesUsed(userId) {
  try {
    // Get current profile
    const profile = await getUserProfile(userId)
    if (!profile) throw new Error('User profile not found')
    
    // Update summaries used
    const { success, data, error } = await updateUserProfile(userId, {
      summariesUsed: profile.summariesUsed + 1
    })
    
    if (!success) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error incrementing summaries used:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Summary Management Functions
 */

/**
 * Save a paper summary
 * @param {string} userId - User ID
 * @param {Object} summary - Summary data
 * @returns {Promise<Object>} - Result of summary creation
 */
export async function saveSummary(userId, summary) {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .insert([
        {
          user_id: userId,
          title: summary.title,
          url: summary.url,
          summary_text: summary.summary,
          key_findings: summary.keyFindings,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    
    // Increment summaries used count
    await incrementSummariesUsed(userId)
    
    return { success: true, data }
  } catch (error) {
    console.error('Error saving summary:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all summaries for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user's summaries
 */
export async function getUserSummaries(userId) {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Convert from snake_case to camelCase for frontend use
    return data.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      summary: item.summary_text,
      keyFindings: item.key_findings,
      dateCreated: item.created_at
    }))
  } catch (error) {
    console.error('Error getting user summaries:', error)
    return []
  }
}

/**
 * Delete a summary
 * @param {string} userId - User ID
 * @param {string} summaryId - Summary ID
 * @returns {Promise<Object>} - Result of summary deletion
 */
export async function deleteSummary(userId, summaryId) {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .delete()
      .eq('id', summaryId)
      .eq('user_id', userId) // Ensure user owns the summary

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting summary:', error)
    return { success: false, error: error.message }
  }
}

export default supabase

