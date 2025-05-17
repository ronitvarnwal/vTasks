
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Example: Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Here you would typically check for auth token
    const isAuthenticated = request.cookies.has('auth-token')
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
