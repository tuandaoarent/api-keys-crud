import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Generate a random API key
const generateApiKey = (type = 'dev') => {
  const prefix = `tvly-${type}-`
  const randomPart = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15)
  return prefix + randomPart
}

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

// GET /api/api-keys - Get all API keys for authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user from Supabase using email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching API keys:', error)
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
    }

    // Transform data to match the expected format
    const transformedData = data.map(key => ({
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

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

// POST /api/api-keys - Create a new API key for authenticated user
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user from Supabase using email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const newKey = generateApiKey(body.type || 'dev')
    const keyPrefix = newKey.split('-').slice(0, 2).join('-') + '-'

    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          user_id: user.id,
          name: body.name,
          description: body.description,
          type: body.type || 'dev',
          key_value: newKey,
          key_prefix: keyPrefix,
          permissions: body.permissions || []
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
    }

    const transformedData = {
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

    return NextResponse.json(transformedData, { status: 201 })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
