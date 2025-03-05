import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Must match the secret in login route

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 401 });
  }
} 