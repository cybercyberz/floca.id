import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ success: true }),
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.set('authToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
} 