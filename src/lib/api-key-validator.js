import { supabase } from './supabase'

/**
 * Validate an API key and return key information
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<{isValid: boolean, keyInfo?: object, error?: string}>}
 */
export const validateApiKey = async (apiKey) => {
  try {
    if (!apiKey || !apiKey.trim()) {
      return {
        isValid: false,
        error: 'API key is required'
      }
    }

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

    return {
      isValid: true,
      keyInfo
    }
  } catch (error) {
    console.error('Error validating API key:', error)
    return {
      isValid: false,
      error: 'Failed to validate API key'
    }
  }
}

/**
 * Transform key info to standard format
 * @param {object} keyInfo - Raw key info from database
 * @returns {object} Transformed key info
 */
export const transformKeyInfo = (keyInfo) => {
  return {
    id: keyInfo.id,
    name: keyInfo.name,
    description: keyInfo.description,
    type: keyInfo.type,
    usage: keyInfo.usage_count,
    permissions: keyInfo.permissions || [],
    createdAt: keyInfo.created_at.split('T')[0],
    lastUsed: keyInfo.last_used_at ? keyInfo.last_used_at.split('T')[0] : 'Never'
  }
}

/**
 * Get masked key for display
 * @param {string} fullKey - The full API key
 * @returns {string} Masked key
 */
export const getMaskedKey = (fullKey) => {
  if (!fullKey) return ''
  const parts = fullKey.split('-')
  if (parts.length >= 3) {
    const prefix = parts.slice(0, 2).join('-') + '-'
    return prefix + '*'.repeat(27)
  }
  return fullKey
}
