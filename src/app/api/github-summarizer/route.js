import { NextResponse } from 'next/server';
import { apiKeysService } from '../../../lib/api-keys';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'API key is required' 
        },
        { status: 400 }
      );
    }

    // Validate the API key using the existing service
    const keyInfo = await apiKeysService.validateKey(apiKey.trim());

    if (keyInfo) {
      return NextResponse.json({
        isValid: true,
        keyInfo: {
          name: keyInfo.name,
          type: keyInfo.type,
          usage: keyInfo.usage,
          permissions: keyInfo.permissions,
          createdAt: keyInfo.createdAt,
          lastUsed: keyInfo.lastUsed
        }
      });
    } else {
      return NextResponse.json({
        isValid: false,
        error: 'API key not found or invalid'
      }, { status: 401 }); // Unauthorized
    }
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
