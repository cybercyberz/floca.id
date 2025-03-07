import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      return NextResponse.json({
        success: false,
        error: 'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set'
      }, { status: 404 });
    }
    
    // Try to parse the service account key
    let parsedKey;
    try {
      parsedKey = JSON.parse(serviceAccountKey);
    } catch (parseError: any) {
      return NextResponse.json({
        success: false,
        error: 'FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON',
        parseError: parseError.message,
        keyPreview: serviceAccountKey.substring(0, 50) + '...'
      }, { status: 400 });
    }
    
    // Check if the parsed key has the required fields
    const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email', 'client_id'];
    const missingFields = requiredFields.filter(field => !parsedKey[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'FIREBASE_SERVICE_ACCOUNT_KEY is missing required fields',
        missingFields,
        availableFields: Object.keys(parsedKey)
      }, { status: 400 });
    }
    
    // Check if private_key is properly formatted
    const privateKey = parsedKey.private_key;
    const hasCorrectFormat = 
      privateKey.includes('-----BEGIN PRIVATE KEY-----') && 
      privateKey.includes('-----END PRIVATE KEY-----');
    
    if (!hasCorrectFormat) {
      return NextResponse.json({
        success: false,
        error: 'private_key is not properly formatted',
        privateKeyPreview: privateKey.substring(0, 20) + '...'
      }, { status: 400 });
    }
    
    // Return success with safe information about the service account
    return NextResponse.json({
      success: true,
      message: 'FIREBASE_SERVICE_ACCOUNT_KEY is properly formatted',
      serviceAccountInfo: {
        type: parsedKey.type,
        project_id: parsedKey.project_id,
        private_key_id: parsedKey.private_key_id.substring(0, 5) + '...',
        client_email: parsedKey.client_email,
        has_private_key: !!parsedKey.private_key,
        private_key_format_valid: hasCorrectFormat
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 