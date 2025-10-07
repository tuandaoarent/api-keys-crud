import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'

// POST /api/api-keys/[id]/usage - Increment usage count
export async function POST(request, { params }) {
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
      .update({
        usage_count: supabase.raw('usage_count + 1'),
        last_used_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error incrementing usage:', error)
      return NextResponse.json({ error: 'Failed to increment usage' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Usage count incremented successfully' })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
