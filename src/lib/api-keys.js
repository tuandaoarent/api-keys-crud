import { supabase } from './supabase'

// Generate a random API key
export const generateApiKey = (type = 'dev') => {
  const prefix = `tvly-${type}-`
  const randomPart = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15)
  return prefix + randomPart
}

// Get masked key for display
export const getMaskedKey = (fullKey) => {
  if (!fullKey) return ''
  const parts = fullKey.split('-')
  if (parts.length >= 3) {
    const prefix = parts.slice(0, 2).join('-') + '-'
    return prefix + '*'.repeat(27)
  }
  return fullKey
}

// API Key CRUD Operations
export const apiKeysService = {
  // Get all API keys
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to match the expected format
      return data.map(key => ({
        id: key.id,
        name: key.name,
        description: key.description,
        type: key.type,
        usage: key.usage_count,
        key: getMaskedKey(key.key_value),
        fullKey: key.key_value,
        createdAt: key.created_at.split('T')[0],
        lastUsed: key.last_used_at ? key.last_used_at.split('T')[0] : 'Never',
        permissions: key.permissions || []
      }))
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  },

  // Create a new API key
  async create(keyData) {
    try {
      const newKey = generateApiKey(keyData.type || 'dev')
      const keyPrefix = newKey.split('-').slice(0, 2).join('-') + '-'

      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name: keyData.name,
            description: keyData.description,
            type: keyData.type || 'dev',
            key_value: newKey,
            key_prefix: keyPrefix,
            permissions: keyData.permissions || []
          }
        ])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        usage: data.usage_count,
        key: getMaskedKey(data.key_value),
        fullKey: data.key_value,
        createdAt: data.created_at.split('T')[0],
        lastUsed: 'Never',
        permissions: data.permissions || []
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      throw error
    }
  },

  // Update an API key
  async update(id, keyData) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          name: keyData.name,
          description: keyData.description,
          permissions: keyData.permissions || []
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        usage: data.usage_count,
        key: getMaskedKey(data.key_value),
        fullKey: data.key_value,
        createdAt: data.created_at.split('T')[0],
        lastUsed: data.last_used_at ? data.last_used_at.split('T')[0] : 'Never',
        permissions: data.permissions || []
      }
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  },

  // Delete an API key
  async delete(id) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting API key:', error)
      throw error
    }
  },

  // Increment usage count
  async incrementUsage(id) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          usage_count: supabase.raw('usage_count + 1'),
          last_used_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error incrementing usage:', error)
      throw error
    }
  },

  // Validate a specific API key
  async validateKey(keyValue) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_value', keyValue)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - key not found
          return null
        }
        throw error
      }

      // Transform data to match the expected format
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        usage: data.usage_count,
        key: getMaskedKey(data.key_value),
        fullKey: data.key_value,
        createdAt: data.created_at.split('T')[0],
        lastUsed: data.last_used_at ? data.last_used_at.split('T')[0] : 'Never',
        permissions: data.permissions || []
      }
    } catch (error) {
      console.error('Error validating API key:', error)
      throw error
    }
  }
}
