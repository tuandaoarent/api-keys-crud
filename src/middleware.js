import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if this is a NextAuth error redirect
  if (request.nextUrl.pathname.startsWith('/api/auth/signin') && 
      request.nextUrl.searchParams.has('error')) {
    
    // Redirect to homepage with error parameter
    const error = request.nextUrl.searchParams.get('error');
    const homepageUrl = new URL('/', request.url);
    homepageUrl.searchParams.set('error', error);
    
    return NextResponse.redirect(homepageUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/:path*',
  ],
};
