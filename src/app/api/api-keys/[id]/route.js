import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

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

// PUT /api/api-keys/[id] - Update API key
export async function PUT(request, { params }) {
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

    const { id } = params
    const body = await request.json()

    // First verify the API key belongs to the user
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingKey) {
      return NextResponse.json({ error: 'API key not found or access denied' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({
        name: body.name,
        description: body.description,
        permissions: body.permissions || []
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating API key:', error)
      return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 })
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
      lastUsed: data.last_used_at ? data.last_used_at.split('T')[0] : 'Never',
      permissions: data.permissions || []
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

// DELETE /api/api-keys/[id] - Delete API key
export async function DELETE(request, { params }) {
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

    const { id } = params

    // First verify the API key belongs to the user
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingKey) {
      return NextResponse.json({ error: 'API key not found or access denied' }, { status: 404 })
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting API key:', error)
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
    }

    return NextResponse.json({ message: 'API key deleted successfully' })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
