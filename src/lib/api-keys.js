// API Key Service - Client-side wrapper for REST endpoints
// This service now uses REST API endpoints instead of direct Supabase calls

const API_BASE_URL = '/api/api-keys'

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Request failed')
  }

  return response.json()
}

// API Key CRUD Operations
export const apiKeysService = {
  // Get all API keys
  async getAll() {
    try {
      return await makeAuthenticatedRequest(`${API_BASE_URL}`)
    } catch (error) {
      console.error('Error fetching API keys:', error)
      throw error
    }
  },

  // Create a new API key
  async create(keyData) {
    try {
      return await makeAuthenticatedRequest(`${API_BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(keyData)
      })
    } catch (error) {
      console.error('Error creating API key:', error)
      throw error
    }
  },

  // Update an API key
  async update(id, keyData) {
    try {
      return await makeAuthenticatedRequest(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(keyData)
      })
    } catch (error) {
      console.error('Error updating API key:', error)
      throw error
    }
  },

  // Delete an API key
  async delete(id) {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Error deleting API key:', error)
      throw error
    }
  },


  // Validate a specific API key
  async validateKey(keyValue) {
    try {
      return await makeAuthenticatedRequest(`${API_BASE_URL}/validate`, {
        method: 'POST',
        body: JSON.stringify({ keyValue })
      })
    } catch (error) {
      console.error('Error validating API key:', error)
      throw error
    }
  }
}
