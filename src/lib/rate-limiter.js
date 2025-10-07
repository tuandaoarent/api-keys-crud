import { supabase } from './supabase'

/**
 * Check if an API key has exceeded its rate limit
 * @param {string} apiKey - The API key to check
 * @returns {Promise<{isValid: boolean, error?: string, keyInfo?: object}>}
 */
export const checkRateLimit = async (apiKey) => {
  try {
    // Get API key information from database
    const { data: keyInfo, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_value', apiKey.trim())
      .single()

    if (keyError || !keyInfo) {
      return {
        isValid: false,
        error: 'API key not found or invalid'
      }
    }

    // Check rate limit
    const currentUsage = keyInfo.usage_count || 0
    const rateLimit = keyInfo.rate_limit || 0 // Default limit of 100 requests

    if (currentUsage >= rateLimit) {
      return {
        isValid: false,
        error: `Rate limit exceeded. You have used ${currentUsage}/${rateLimit} requests. Please upgrade your plan or wait for the limit to reset.`,
        keyInfo
      }
    }

    return {
      isValid: true,
      keyInfo
    }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return {
      isValid: false,
      error: 'Failed to check rate limit'
    }
  }
}

/**
 * Increment usage count for an API key
 * @param {string} keyId - The API key ID
 * @param {number} currentUsage - Current usage count
 * @returns {Promise<boolean>}
 */
export const incrementUsage = async (keyId, currentUsage) => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({
        usage_count: currentUsage + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', keyId)

    if (error) {
      console.error('Error incrementing usage:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error incrementing usage:', error)
    return false
  }
}

/**
 * Get rate limit information for an API key
 * @param {string} apiKey - The API key to check
 * @returns {Promise<{usage: number, limit: number, remaining: number}>}
 */
export const getRateLimitInfo = async (apiKey) => {
  try {
    const { data: keyInfo, error } = await supabase
      .from('api_keys')
      .select('usage_count, rate_limit')
      .eq('key_value', apiKey.trim())
      .single()

    if (error || !keyInfo) {
      return null
    }

    const usage = keyInfo.usage_count || 0
    const limit = keyInfo.rate_limit || 100
    const remaining = Math.max(0, limit - usage)

    return {
      usage,
      limit,
      remaining
    }
  } catch (error) {
    console.error('Error getting rate limit info:', error)
    return null
  }
}
