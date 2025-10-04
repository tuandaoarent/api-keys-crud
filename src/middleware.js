import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Check if this is a NextAuth error redirect
  if (request.nextUrl.pathname.startsWith('/api/auth/signin') && 
      request.nextUrl.searchParams.has('error')) {
    
    // Redirect to homepage with error parameter
    const error = request.nextUrl.searchParams.get('error');
    const homepageUrl = new URL('/', request.url);
    homepageUrl.searchParams.set('error', error);
    
    return NextResponse.redirect(homepageUrl);
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboards')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      // User is not authenticated, redirect to homepage with callback
      const homepageUrl = new URL('/', request.url);
      homepageUrl.searchParams.set('callbackUrl', '/dashboards');
      return NextResponse.redirect(homepageUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/dashboards/:path*',
  ],
};
