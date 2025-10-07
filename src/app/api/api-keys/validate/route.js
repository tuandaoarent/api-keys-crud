import { NextResponse } from 'next/server'
import { validateApiKey, transformKeyInfo, getMaskedKey } from '@/lib/api-key-validator'

// POST /api/api-keys/validate - Validate API key (public endpoint)
export async function POST(request) {
  try {
    const body = await request.json()
    const { keyValue } = body

    // Validate the API key using unified validator
    const validationResult = await validateApiKey(keyValue)

    if (!validationResult.isValid) {
      const statusCode = validationResult.error === 'API key is required' ? 400 : 401
      return NextResponse.json({ 
        error: validationResult.error 
      }, { status: statusCode })
    }

    // Transform data to match the expected format
    const transformedData = {
      ...transformKeyInfo(validationResult.keyInfo),
      key: getMaskedKey(validationResult.keyInfo.key_value),
      fullKey: validationResult.keyInfo.key_value
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
