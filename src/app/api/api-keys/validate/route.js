import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get masked key for display
const getMaskedKey = (fullKey) => {
  if (!fullKey) return ''
  const parts = fullKey.split('-')
  if (parts.length >= 3) {
    const prefix = parts.slice(0, 2).join('-') + '-'
    return prefix + '*'.repeat(27)
  }
  return fullKey
}

// POST /api/api-keys/validate - Validate API key (public endpoint)
export async function POST(request) {
  try {
    const body = await request.json()
    const { keyValue } = body

    if (!keyValue) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_value', keyValue)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - key not found
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
      }
      console.error('Error validating API key:', error)
      return NextResponse.json({ error: 'Failed to validate API key' }, { status: 500 })
    }

    // Transform data to match the expected format
    const transformedData = {
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

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
