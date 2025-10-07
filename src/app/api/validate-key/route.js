import { NextResponse } from 'next/server';
import { validateApiKey, transformKeyInfo } from '../../../lib/api-key-validator';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    // Validate the API key using unified validator
    const validationResult = await validateApiKey(apiKey);

    if (!validationResult.isValid) {
      const statusCode = validationResult.error === 'API key is required' ? 400 : 401;
      return NextResponse.json({
        isValid: false,
        error: validationResult.error
      }, { status: statusCode });
    }

    // Transform data to match expected format
    const transformedKeyInfo = transformKeyInfo(validationResult.keyInfo);

    return NextResponse.json({
      isValid: true,
      keyInfo: transformedKeyInfo
    });
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { 
        isValid: false, 
        error: 'Failed to validate API key. Please try again.' 
      },
      { status: 500 }
    );
  }
}
